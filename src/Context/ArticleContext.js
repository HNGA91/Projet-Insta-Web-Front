import React, { createContext, useState } from "react";

//Créer un context - une sorte de "zone mémoire partagée"
export const ArticleContext = createContext();

//Definir le fournisseur du context
export const ArticleProvider = ({ children }) => {
	const [articles, setArticles] = useState([]);

	return (
		<ArticleContext.Provider
			value={{
				articles,
				setArticles,
			}}
		>
			{children}
		</ArticleContext.Provider>
	);
};
