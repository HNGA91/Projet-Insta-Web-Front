import React, { createContext, useState, useContext } from "react";
import { PanierContext } from "./PanierContext";
import { FavorisContext } from "./FavorisContext";
import { fetchUserData } from "../services/UserDataAPI";

//Créer un context - une sorte de "zone mémoire partagée"
export const UserContext = createContext();

//Definir le fournisseur du context
export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const { setPanier } = useContext(PanierContext);
	const { setFavoris } = useContext(FavorisContext);

	// Fonction de connexion
	const login = async (userData) => {
		try {
			setUser(userData);

			// Charger les données depuis le serveur après connexion
			const userDataFromServer = await fetchUserData(userData.email);

			// Synchroniser le panier et les favoris
			setPanier(userDataFromServer.panier || []);
			setFavoris(userDataFromServer.favoris || []);

			console.log("✅ Données utilisateur synchronisées après connexion");
		} catch (error) {
			console.error("❌ Erreur lors de la synchronisation après connexion:", error);
		}
	};

	// Fonction de déconnexion
	const logout = () => {
		setUser(null);
	};

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				login,
				logout,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
