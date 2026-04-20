import React from "react";
import { render } from "@testing-library/react";
import { UserContext } from "../Context/UserContext.js";
import { ArticleContext } from "../Context/ArticleContext.js";

// Ces imports arrivent sur les fichiers __mocks__ grâce à l'alias dans vitest.config.js.
// On fournit les valeurs nécessaires via les vrais objets contexte.

const UserProvider = ({ children }) => (
	<UserContext.Provider
		value={{
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
		}}
	>
		{children}
	</UserContext.Provider>
);

const ArticleProvider = ({ children }) => (
	<ArticleContext.Provider value={{ articles: [], setArticles: () => {} }}>{children}</ArticleContext.Provider>
);

export const renderWithProviders = (ui) => {
	return render(
		<UserProvider>
			<ArticleProvider>{ui}</ArticleProvider>
		</UserProvider>,
	);
};
