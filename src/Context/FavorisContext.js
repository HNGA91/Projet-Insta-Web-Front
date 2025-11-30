import React, { createContext, useState, useCallback, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { updateFavoris, fetchUserData } from "../services/UserDataAPI";

//Créer un context - une sorte de "zone mémoire partagée"
export const FavorisContext = createContext();

//Definir le fournisseur du context
export const FavorisProvider = ({ children }) => {
	const [favoris, setFavoris] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useContext(UserContext);

	// Charger les favoris au démarrage ou quand l'utilisateur change
	useEffect(() => {
		const loadFavoris = async () => {
			setIsLoading(true);
			try {
				if (user) {
					// Utilisateur connecté : charger depuis le backend
					const userData = await fetchUserData(user.email);
					setFavoris(userData.favoris || []);
					console.log("✅ Favoris chargés depuis le serveur");
				} else {
					// Utilisateur non connecté : charger depuis le localStorage
					const savedFavoris = localStorage.getItem("favoris_guest");
					if (savedFavoris) {
						setFavoris(JSON.parse(savedFavoris));
					}
				}
			} catch (error) {
				console.error("❌ Erreur lors du chargement des favoris:", error);

				// Fallback: Solution de secours
				// En ligne : Sauvegarde sur le serveur
				// Hors ligne : Sauvegarde locale (AsyncStorage/localStorage) en attendant la reconnexion
				try {
					const savedFavoris = localStorage.getItem("favoris_guest");
					if (savedFavoris) {
						setFavoris(JSON.parse(savedFavoris));
					}
				} catch (fallbackError) {
					console.error("❌ Erreur fallback:", fallbackError);
				}
			} finally {
				setIsLoading(false);
			}
		};
		loadFavoris();
	}, [user]);

	// Synchroniser avec le backend à chaque modification
	useEffect(() => {
		const syncFavoris = async () => {
			if (!user || isLoading) return;

			try {
				await updateFavoris(user.email, favoris);
				console.log("✅ Favoris synchronisés avec le serveur");
			} catch (error) {
				console.error("❌ Erreur de synchronisation des favoris:", error);
				// Sauvegarder localement en attendant
				localStorage.setItem(`favoris_${user.email}`, JSON.stringify(favoris));
			}
		};

		// Délai pour éviter trop de requêtes
		const timeoutId = setTimeout(syncFavoris, 1000);
		return () => clearTimeout(timeoutId);
	}, [favoris, user, isLoading]);

	// Sauvegarder localement pour les utilisateurs non connectés
	useEffect(() => {
		if (user) return; // Ne pas sauvegarder localement si connecté

		try {
			localStorage.setItem("favoris_guest", JSON.stringify(favoris));
		} catch (error) {
			console.error("❌ Erreur sauvegarde locale favoris:", error);
		}
	}, [favoris, user]);

	// Fonction toggle favoris (Ajouter / Retirer)
	const toggleFavoris = useCallback(
		(article) => {
			if (!user) {
				alert("⛔ Connexion requise - Veuillez vous connecter pour ajouter aux favoris");
				return;
			}

			setFavoris((prev) => {
				// 1. Vérifier si l'article existe déjà dans parmis les favoris
				const existe = prev.some((item) => item._id === article._id);
				if (existe) {
					// 2. Si OUI : Le retire des favoris
					return prev.filter((item) => item._id !== article._id);
				} else {
					// 3. Si NON : l'ajoute aux favoris
					return [...prev, { ...article }];
				}
			});
		},
		[user]
	);

	// Supprimer un article de la liste des favoris
	const supprimerDesFavoris = useCallback((id) => {
		setFavoris((prev) => prev.filter((item) => item._id !== id));
	}, []);

	return (
		<FavorisContext.Provider
			value={{
				favoris,
				setFavoris,
				toggleFavoris,
				supprimerDesFavoris,
				isLoading,
			}}
		>
			{children}
		</FavorisContext.Provider>
	);
};
