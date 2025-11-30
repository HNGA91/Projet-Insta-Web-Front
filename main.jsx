import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Controller from "./src/Navigation/Controller.jsx";
import { UserProvider } from "./src/Context/UserContext.js";
import { PanierProvider } from "./src/Context/PanierContext.js";
import { FavorisProvider } from "./src/Context/FavorisContext.js";
import { ArticleContext } from "./src/Context/ArticleContext.js";

createRoot(document.getElementById("root")).render(
	<UserProvider>
		<ArticleContext>
			<PanierProvider>
				<FavorisProvider>
					<StrictMode>
						<Controller />
					</StrictMode>
				</FavorisProvider>
			</PanierProvider>
		</ArticleContext>
	</UserProvider>
);
