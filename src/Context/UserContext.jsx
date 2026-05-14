import React, { useState, useCallback, useEffect, useMemo } from "react";
import { updatePanier, updateFavoris, fetchUserData } from "../Database/UserDataAPI";
import { UserContext } from "./UserContext.js";

export const UserProvider = ({ children }) => {
	// =============== ÉTATS ===============

	const [user, setUser] = useState(null);

	// accessToken stocké en mémoire (useState) et NON dans localStorage
	// Cela évite les failles XSS — un script malveillant ne peut pas lire useState
	// Inconvénient : le token disparaît au rechargement → géré par le Refresh Token
	const [accessToken, setAccessToken] = useState(null);

	const [panier, setPanier] = useState([]);
	const [favoris, setFavoris] = useState([]);
	const [loading, setLoading] = useState(true);
	const [lastSync, setLastSync] = useState(null);

	// =============== FONCTIONS UTILISATEUR ===============

	// Vérifie si un utilisateur est connecté
	const isLogin = useMemo(() => !!user, [user]);

	// Charger l'utilisateur au démarrage de l'application
	// Si un user est en localStorage, on tente de renouveler son accessToken
	// via le Refresh Token (cookie httpOnly) sans qu'il ait à se reconnecter
	useEffect(() => {
		loadUser();
	}, []);

	const loadUser = async () => {
		try {
			setLoading(true);
			const userJson = localStorage.getItem("user");

			if (userJson) {
				const userData = JSON.parse(userJson);

				// Tenter de renouveler l'accessToken via le Refresh Token
				// Le cookie refreshToken est envoyé automatiquement par le navigateur
				try {
					const refreshResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/refresh`, {
						method: "POST",
						// credentials: "include" est OBLIGATOIRE pour envoyer les cookies
						credentials: "include",
					});

					if (refreshResponse.ok) {
						const refreshData = await refreshResponse.json();

						// Stocker le nouvel accessToken en mémoire (pas dans localStorage)
						setAccessToken(refreshData.accessToken);
						setUser(userData);

						// Charger les données utilisateur depuis MongoDB
						const serverData = await fetchUserData(userData.email, refreshData.accessToken);
						setPanier(serverData.panier || []);
						setFavoris(serverData.favoris || []);
						setLastSync(Date.now());
						console.log("✅ Session restaurée automatiquement");
					} else {
						// Refresh Token expiré ou invalide → déconnecter l'utilisateur
						console.log("🔄 Session expirée, déconnexion automatique");
						localStorage.removeItem("user");
					}
				} catch (error) {
					console.error("❌ Erreur lors du rafraîchissement du token:", error);
					localStorage.removeItem("user");
				}
			}
		} catch (error) {
			console.error("❌ Erreur lors du chargement de l'utilisateur:", error);
		} finally {
			setLoading(false);
		}
	};

	// Synchroniser panier et favoris avec MongoDB
	// Se déclenche à chaque modification du panier ou des favoris
	useEffect(() => {
		if (!user || !accessToken) return;
		if (!lastSync || Date.now() - lastSync < 5000) return;

		const syncData = async () => {
			try {
				await Promise.all([updatePanier(user.email, panier, accessToken), updateFavoris(user.email, favoris, accessToken)]);
				setLastSync(Date.now());
				console.log("✅ Données synchronisées avec MongoDB");
			} catch (error) {
				console.error("❌ Erreur synchronisation:", error);
			}
		};
		syncData();
	}, [panier, favoris, user, accessToken, lastSync]);

	// Fonction de connexion
	// Appelée depuis ConnexionFormPage après une connexion réussie
	const login = async (userData, token) => {
		try {
			// On stocke uniquement les infos utilisateur dans localStorage
			// Le token lui est gardé en mémoire uniquement
			localStorage.setItem("user", JSON.stringify(userData));
			setUser(userData);
			setAccessToken(token);

			// Charger les données utilisateur depuis MongoDB
			const serverData = await fetchUserData(userData.email, token);
			setPanier(serverData.panier || []);
			setFavoris(serverData.favoris || []);
			setLastSync(Date.now());
			console.log("✅ Connexion réussie + données chargées");
		} catch (error) {
			console.error("❌ Erreur lors de la connexion:", error);
			throw error;
		}
	};

	// Fonction de déconnexion
	// Appelle le back pour révoquer le Refresh Token en BDD
	const logout = async () => {
		try {
			// Révoquer le Refresh Token côté back
			await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/deconnexion`, {
				method: "POST",
				// credentials: "include" envoie le cookie refreshToken au back
				credentials: "include",
			});

			// Nettoyer le localStorage et les états
			localStorage.removeItem("user");
			setUser(null);
			setAccessToken(null);
			setPanier([]);
			setFavoris([]);
			console.log("✅ Déconnexion réussie");
		} catch (error) {
			console.error("❌ Erreur lors de la déconnexion:", error);
		}
	};

	// =============== FONCTIONS PANIER ===============

	const { totalPanier, nombreArticlesPanier, panierVide } = useMemo(() => {
		const total = panier.reduce((acc, item) => acc + item.prix * (item.quantite || 1), 0);
		const nombre = panier.reduce((sum, item) => sum + (item.quantite || 1), 0);
		const vide = panier.length === 0;
		return { totalPanier: total, nombreArticlesPanier: nombre, panierVide: vide };
	}, [panier]);

	// Ajouter un article au panier (ou augmenter sa quantité)
	const ajouterAuPanier = useCallback((article) => {
		setPanier((prev) => {
			const existe = prev.find((item) => item._id === article._id);
			if (existe) {
				return prev.map((item) => (item._id === article._id ? { ...item, quantite: (item.quantite || 1) + 1 } : item));
			} else {
				return [...prev, { ...article, quantite: 1 }];
			}
		});
	}, []);

	// Supprimer un article du panier (ou diminuer sa quantité)
	const supprimerDuPanier = useCallback((id) => {
		setPanier((prev) =>
			prev.map((item) => (item._id === id ? { ...item, quantite: (item.quantite || 1) - 1 } : item)).filter((item) => (item.quantite || 0) > 0),
		);
	}, []);

	// Vider entièrement le panier avec confirmation
	const viderLePanier = useCallback(() => {
		if (window.confirm("⚠️ Voulez-vous vraiment vider le panier ?")) {
			setPanier([]);
		}
	}, []);

	// =============== FONCTIONS FAVORIS ===============

	// Ajouter ou retirer un article des favoris
	const toggleFavoris = useCallback(
		(article) => {
			if (!user) {
				alert("⛔ Connexion requise - Veuillez vous connecter pour ajouter aux favoris");
				return;
			}
			setFavoris((prev) => {
				const existe = prev.some((item) => item._id === String(article.id_article));
				if (existe) {
					return prev.filter((item) => item._id !== String(article.id_article));
				} else {
					// Normalisation : on s'assure que _id est défini pour MongoDB
					return [...prev, { ...article, _id: String(article.id_article) }];
				}
			});
		},
		[user],
	);

	// Retirer un article des favoris
	const supprimerDesFavoris = useCallback((id) => {
		setFavoris((prev) => prev.filter((item) => item._id !== id));
	}, []);

	return (
		<UserContext.Provider
			value={{
				// Utilisateur
				user,
				setUser,
				login,
				logout,
				loading,
				isLogin,

				// Token — exposé pour que UserDataAPI puisse l'utiliser
				accessToken,
				setAccessToken,

				// Panier
				panier,
				setPanier,
				ajouterAuPanier,
				supprimerDuPanier,
				viderLePanier,
				totalPanier,
				nombreArticlesPanier,
				panierVide,

				// Favoris
				favoris,
				setFavoris,
				toggleFavoris,
				supprimerDesFavoris,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
