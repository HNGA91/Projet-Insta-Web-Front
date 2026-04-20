// Ce fichier remplace src/Context/ArticleContext.js dans les tests.
// Il exporte le VRAI objet contexte React avec des valeurs par défaut,
// pour que useContext(UserContext) retourne quelque chose de valide.
import React from "react";

export const ArticleContext = React.createContext({
	articles: [],
	setArticles: () => {},
});

export const ArticleProvider = ({ children }) => children;
