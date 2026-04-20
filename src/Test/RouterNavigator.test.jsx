import { describe, it, expect, vi } from "vitest";

// ─── Mock de tous les composants partagés ───────────────────
vi.mock("../Composants/Header.jsx", () => ({
	default: () => <div>Header</div>,
}));

vi.mock("../Composants/Footer.jsx", () => ({
	default: () => <div>Footer</div>,
}));

vi.mock("../Composants/Menu/Menu.jsx", () => ({
	default: () => <div>Menu</div>,
}));

vi.mock("../Composants/Menu/MenuLateral1.jsx", () => ({
	default: () => <div>Menu1</div>,
}));

vi.mock("../Composants/Menu/MenuLateral2.jsx", () => ({
	default: () => <div>Menu2</div>,
}));

// ─── Mock de TOUTES les pages (elles ne sont pas testées ici) ──
// Sans ces mocks, RouterNavigator importe les vraies pages qui
// elles-mêmes importent d'autres dépendances → "Element type: undefined"
vi.mock("../Pages/CataloguePage.jsx", () => ({
	default: () => (
		<div>
			<input placeholder="Rechercher un article..." />
		</div>
	),
}));

vi.mock("../Pages/ConnexionFormPage.jsx", () => ({
	default: () => <h2>Veuillez remplir les champs afin de vous authentifier</h2>,
}));

vi.mock("../Pages/InscriptionFormPage.jsx", () => ({
	default: () => <h2>Veuillez remplir le champs afin de compléter votre inscription</h2>,
}));

vi.mock("../Pages/ProfilPage.jsx", () => ({
	default: () => <div>Profil</div>,
}));

vi.mock("../Pages/PanierPage.jsx", () => ({
	default: () => <div>Panier</div>,
}));

vi.mock("../Pages/FavorisPage.jsx", () => ({
	default: () => <div>Favoris</div>,
}));

import { screen } from "@testing-library/react";
import RouterNavigator from "../Navigation/RouterNavigator.jsx";
import { renderWithProviders } from "./TestUtils.jsx";

describe("Navigation globale de l'application", () => {
	it("affiche la page d'accueil", () => {
		renderWithProviders(<RouterNavigator initialEntries={["/"]} />);

		expect(screen.getByPlaceholderText("Rechercher un article...")).toBeInTheDocument();
	});

	it("affiche la page inscription", () => {
		renderWithProviders(<RouterNavigator initialEntries={["/inscription"]} />);

		expect(
			screen.getByRole("heading", {
				name: /compléter votre inscription/i,
			}),
		).toBeInTheDocument();
	});

	it("affiche la page connexion", () => {
		renderWithProviders(<RouterNavigator initialEntries={["/login"]} />);

		expect(
			screen.getByRole("heading", {
				name: /vous authentifier/i,
			}),
		).toBeInTheDocument();
	});
});