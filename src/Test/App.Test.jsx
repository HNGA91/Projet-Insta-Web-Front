import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("Intégration de l'application", () => {
	it("navigue entre connexion, inscription et accueil", async () => {
		render(<App />);

		const user = userEvent.setup();

		// Vérifie qu'on commence sur la page d'accueil
		expect(screen.getByPlaceholderText("Rechercher un article...")).toBeInTheDocument();

		// Navigue vers inscription
		await user.click(screen.getByText("Inscription"));
		expect(screen.getByRole("heading", { name: "Veuillez remplir le champs afin de compléter votre inscription" })).toBeInTheDocument();

		// Navigue vers connexion
		await user.click(screen.getByText("Connexion"));
		expect(screen.getByRole("heading", { name: "Veuillez remplir les champs afin de vous authentifier" })).toBeInTheDocument();

		// Retour à la connexion
		await user.click(screen.getByText("Accueil"));
		expect(screen.getByRole("heading", { name: "Connexion" })).toBeInTheDocument();
	});
});
