import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("Intégration de l'application", () => {
	it("navigue entre connexion et inscription", async () => {
		render(<App />);

		const user = userEvent.setup();

		// Vérifie qu'on commence sur la page de connexion
		expect(screen.getByRole("heading", { name: "Connexion" })).toBeInTheDocument();

		// Navigue vers l'inscription
		await user.click(screen.getByText("Créer un compte"));
		expect(screen.getByRole("heading", { name: "Inscription" })).toBeInTheDocument();

		// Retour à la connexion
		await user.click(screen.getByText("Se connecter"));
		expect(screen.getByRole("heading", { name: "Connexion" })).toBeInTheDocument();
	});
});
