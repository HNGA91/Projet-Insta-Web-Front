import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RouterNavigator from "./src/Navigation/RouterNavigator.jsx";
import { UserProvider } from "./src/Context/UserContext.jsx";
import { ArticleProvider } from "./src/Context/ArticleContext.jsx";

const rootElement = document.getElementById("root");

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<UserProvider>
				<ArticleProvider>
					<RouterNavigator />
				</ArticleProvider>
			</UserProvider>
		</StrictMode>,
	);
}

/*
 * Project: MyprojectWebFrontend
 * Author: Hervé N'Goma
 * GitHub: https://github.com/HNGA91/Projet-Insta-Web-Front
 * GitLab: https://gitlab.com/myprojectwebfullstack/myprojectwebfrontend
 * License: MIT
 */