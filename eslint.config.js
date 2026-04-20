import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import vitest from "eslint-plugin-vitest";

export default defineConfig([
	globalIgnores(["dist", "node_modules"]),

	{
		files: ["**/*.{js,jsx}"],
		plugins: {
			vitest,
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		extends: [js.configs.recommended],

		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
				...vitest.environments.env.globals,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},

		settings: {
			react: {
				version: "detect",
			},
		},

		rules: {
			// Règles react-hooks manuellement (évite le conflit de format)
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			// Règle react-refresh manuellement
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
			// Mes règles
			"no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
		},
	},
]);
