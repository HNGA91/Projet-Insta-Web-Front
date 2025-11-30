import React, { createContext, useState, useCallback, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { updatePanier, fetchUserData } from "../services/UserDataAPI";

//Créer un context - une sorte de "zone mémoire partagée"
export const PanierContext = createContext();

//Definir le fournisseur du context
export const PanierProvider = ({ children }) => {
	const [panier, setPanier] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useContext(UserContext);

	// Charger le panier au démarrage ou quand l'utilisateur change
	useEffect(() => {
		const loadPanier = async () => {
			setIsLoading(true);
			try {
				if (user) {
					// Utilisateur connecté : charger depuis le backend
					const userData = await fetchUserData(user.email);
					setPanier(userData.panier || []);
					console.log("✅ Panier chargé depuis le serveur");
				} else {
					// Utilisateur non connecté : charger depuis le localStorage
					const savedPanier = localStorage.getItem("panier_guest");
					if (savedPanier) {
						setPanier(JSON.parse(savedPanier));
					}
				}
			} catch (error) {
				console.error("❌ Erreur lors du chargement du panier:", error);

				// Fallback: Solution de secours
				// En ligne : Sauvegarde sur le serveur
				// Hors ligne : Sauvegarde locale (AsyncStorage/localStorage) en attendant la reconnexion
				try {
					const savedPanier = localStorage.getItem("panier_guest");
					if (savedPanier) {
						setPanier(JSON.parse(savedPanier));
					}
				} catch (fallbackError) {
					console.error("❌ Erreur fallback:", fallbackError);
				}
			} finally {
				setIsLoading(false);
			}
		};
		loadPanier();
	}, [user]);

	// Synchroniser avec le backend à chaque modification
	useEffect(() => {
		const syncPanier = async () => {
			if (!user || isLoading) return;

			try {
				await updatePanier(user.email, panier);
				console.log("✅ Panier synchronisé avec le serveur");
			} catch (error) {
				console.error("❌ Erreur de synchronisation du panier:", error);
				// Sauvegarder localement en attendant
				localStorage.setItem(`panier_${user.email}`, JSON.stringify(panier));
			}
		};

		// Délai pour éviter trop de requêtes
		const timeoutId = setTimeout(syncPanier, 1000);
		return () => clearTimeout(timeoutId);
	}, [panier, user, isLoading]);

	// Sauvegarder localement pour les utilisateurs non connectés
	useEffect(() => {
		if (user) return; // Ne pas sauvegarder localement si connecté

		try {
			localStorage.setItem("panier_guest", JSON.stringify(panier));
		} catch (error) {
			console.error("❌ Erreur sauvegarde locale panier:", error);
		}
	}, [panier, user]);

	// Ajouter un article (ou augmenter sa quantité)
	const ajouterAuPanier = useCallback((article) => {
		setPanier((prev) => {
			// 1. Vérifier si l'article existe déjà
			const existe = prev.find((item) => item._id === article._id);
			if (existe) {
				// 2. Si OUI : augmenter la quantité de 1
				return prev.map((item) => (item._id === article._id ? { ...item, quantite: (item.quantite || 1) + 1 } : item));
			} else {
				// 3. Si NON : ajouter nouvel article avec quantité 1
				return [...prev, { ...article, quantite: 1 }];
			}
		});
	}, []);

	// Supprimer un article (ou diminuer sa quantité)
	const supprimerDuPanier = useCallback((id) => {
		setPanier((prev) => {
			// 1. Diminuer la quantité de 1 pour l'article ciblé via l'id
			return (
				prev
					.map((item) => (item._id === id ? { ...item, quantite: (item.quantite || 1) - 1 } : item))
					// 2. Filtrer pour garder seulement les articles avec quantite > 0
					.filter((item) => (item.quantite || 0) > 0)
			);
		});
	}, []);

	const viderLePanier = useCallback(() => {
		if (window.confirm("⚠️ Voulez-vous vraiment vider le panier ?")) {
			setPanier([]);
		}
	}, []);

	return (
		<PanierContext.Provider
			value={{
				panier,
				setPanier,
				ajouterAuPanier,
				supprimerDuPanier,
				viderLePanier,
				isLoading,
			}}
		>
			{children}
		</PanierContext.Provider>
	);
};
