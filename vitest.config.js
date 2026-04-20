import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true, // permet describe, it, expect sans import
		environment: "jsdom", // Définit l'environnement (node:exécution côté serveur., jsdom pour simuler un navigateur)
		// include: ['tests/**/*.test.js'], // Fichiers de test à inclure
		include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"], // Cela couvrira src/Composants/Inscription.test.jsx
		exclude: ["node_modules"], // Fichiers/dossiers à ignorer
		setupFiles: "./src/setupTest.js",
		css: true,
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			reportsDirectory: "./coverage",
		},
		env: {
			VITE_SERVER_URL: "http://localhost:3000",
		},
		// Redirige tous les imports de UserContext et ArticleContext
		// vers des fichiers mock, quel que soit le chemin relatif utilisé.
		// Cela couvre : "../Context/UserContext.js", "../../Context/UserContext.js", etc.
		alias: [
			{
				find: /.*\/Context\/UserContext(\.js|\.jsx)?$/,
				replacement: resolve(__dirname, "src/__mocks__/UserContext.js"),
			},
			{
				find: /.*\/Context\/ArticleContext(\.js|\.jsx)?$/,
				replacement: resolve(__dirname, "src/__mocks__/ArticleContext.js"),
			},
		],
	},
});
