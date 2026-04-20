// Ce fichier remplace src/Context/UserContext.js dans les tests.
// Il exporte le VRAI objet contexte React avec des valeurs par défaut,
// pour que useContext(UserContext) retourne quelque chose de valide.
import React from "react";

export const UserContext = React.createContext({
	user: null,
	isLogin: false,
	login: () => {},
	logout: () => {},
	favoris: [],
	panier: [],
	totalPanier: 0,
	nombreArticlesPanier: 0,
	loading: false,
	toggleFavoris: () => {},
	ajouterAuPanier: () => {},
	supprimerDuPanier: () => {},
	supprimerDesFavoris: () => {},
	viderLePanier: () => {},
});

export const UserProvider = ({ children }) => children;
