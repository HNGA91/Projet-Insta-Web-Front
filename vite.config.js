import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		// Configuration HTTPS pour le frontend
		// Utilise les mêmes certificats mkcert que le backend
		https: {
			key: fs.readFileSync("C:/Users/manut/Projets/React_Native/MyprojectMobileFullstack/MyprojectBackend/localhost-key.pem"),
			cert: fs.readFileSync("C:/Users/manut/Projets/React_Native/MyprojectMobileFullstack/MyprojectBackend/localhost.pem"),
		},
	},
});
