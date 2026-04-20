import React, { useState } from "react";
import { ArticleContext } from "./ArticleContext.js";

//Definir le fournisseur du context
export const ArticleProvider = ({ children }) => {
	const [articles, setArticles] = useState([]);

	return (
        <ArticleContext.Provider 
            value={{ articles, setArticles }}>
                {children}
        </ArticleContext.Provider>
    );
};
