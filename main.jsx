import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RouterNavigator from "./src/Navigation/RouterNavigator.jsx";
import { UserProvider } from "./src/Context/UserContext.jsx";
import { ArticleProvider } from "./src/Context/ArticleContext.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<UserProvider>
			<ArticleProvider>
				<RouterNavigator />
			</ArticleProvider>
		</UserProvider>
	</StrictMode>
);

/*
 * Project: MyprojectWebFrontend
 * Author: Hervé N'Goma
 * GitHub: https://github.com/HNGA91
 * License: MIT
 */