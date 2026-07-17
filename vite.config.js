import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// Chemins des certificats mkcert utilisés en développement local
const keyPath = "C:/Users/manut/Projets/React_Native/MyprojectMobileFullstack/MyprojectBackend/localhost-key.pem";
const certPath = "C:/Users/manut/Projets/React_Native/MyprojectMobileFullstack/MyprojectBackend/localhost.pem";

// On active le HTTPS uniquement si les certificats existent sur la machine
// (en local). Sur GitLab CI ou en build de production, ces fichiers n'existent
// pas — sans cette condition, fs.readFileSync ferait planter tout le build.
const httpsConfig =
	fs.existsSync(keyPath) && fs.existsSync(certPath)
		? {
				key: fs.readFileSync(keyPath),
				cert: fs.readFileSync(certPath),
			}
		: undefined;

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		// Configuration HTTPS pour le frontend en développement local
		// Utilise les mêmes certificats mkcert que le backend
		// undefined en CI/production : Vite démarre alors en HTTP simple
		// (Vercel gère le HTTPS public automatiquement en production)
		https: httpsConfig,
	},
});
