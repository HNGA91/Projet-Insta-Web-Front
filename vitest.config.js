import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

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
		},
	},
});
