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

import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConnexionFormPage from "../Pages/ConnexionFormPage.jsx";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "./TestUtils.jsx";

// ────────────────────────────────────────────────────────────────
// STRATÉGIE :
//  • Tests d'ERREUR  → le bouton reste disabled car les champs
//    sont invalides. On soumet via fireEvent.submit() sur la
//    <form> pour contourner le disabled sans modifier le composant.
//  • Tests de SUCCÈS → on attend que le bouton soit enabled avec
//    waitFor(), puis on clique normalement.
// ────────────────────────────────────────────────────────────────

describe("Page de connexion", () => {
	// Création d'un mock pour OnSubmit
	const mockOnSubmit = vi.fn();
	// Simulation des interactions utilisateur
	const user = userEvent.setup();
	// Soumet le formulaire directement (bypass du bouton disabled)
	const submitForm = () => fireEvent.submit(screen.getByTestId("form"));

	// ========== SCÉNARIO 1 : INPUT EMAIL VIDE ==========
	// Test de l'input email qui n'est pas remplit
	it("L'input email n'est pas remplit", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu du composant une seule fois dans ce test
		renderWithProviders(
			<MemoryRouter>
				<ConnexionFormPage onSubmit={mockOnSubmit} />
			</MemoryRouter>,
		);

		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Email :"), " ");
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Le bouton est disabled (email invalide) → on soumet via la form
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le champ "Email" ne peut pas être vide/i)).toBeInTheDocument();
		// Optionnel : vérifie que la connexion n'a pas réussi
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 2 : EMAIL INVALIDE PAS DE @ ==========
	// Test de validité de l'adresse email
	it("Le format de l'email est invalide (sans @)", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu du composant une seule fois dans ce test
		renderWithProviders(
			<MemoryRouter>
				<ConnexionFormPage onSubmit={mockOnSubmit} />
			</MemoryRouter>,
		);

		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Email :"), "jean.exemple.com");
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le format de l'email est invalide/i)).toBeInTheDocument();
		// Optionnel : vérifie que la connexion n'a pas réussi
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 3 : EMAIL INVALIDE PAS DE . ==========
	// Test de validité de l'adresse email
	it("Le format de l'email est invalide (sans point)", async () => {
		// ========== ARRANGE (Préparation) ==========

		renderWithProviders(
			<MemoryRouter>
				<ConnexionFormPage onSubmit={mockOnSubmit} />
			</MemoryRouter>,
		);

		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Email :"), "jean@exemplecom");
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le format de l'email est invalide/i)).toBeInTheDocument();
		// Optionnel : vérifie que la connexion n'a pas réussi
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 4 : INPUT MOT DE PASSE VIDE ==========
	// Test de l'input mot de passe qui n'est pas remplit
	it("L'input mot de passe n'est pas remplit", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu du composant une seule fois dans ce test
		renderWithProviders(
			<MemoryRouter>
				<ConnexionFormPage onSubmit={mockOnSubmit} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		expect(screen.getByLabelText("Mot de passe :")).toHaveValue("");

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le champ "Mot de passe" ne peut pas être vide/i)).toBeInTheDocument();
		// Optionnel : vérifie que la connexion n'a pas réussi
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 5 : FORMULAIRE VIERGE AU CHARGEMENT ==========
	// Test du formulaire vide au chargement
	it("Affiche le formulaire avec tous les champs vides au chargement", () => {
		renderWithProviders(
			<MemoryRouter>
				<ConnexionFormPage onSubmit={mockOnSubmit} />
			</MemoryRouter>,
		);

		// Vérification 1 : Champ Email
		expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("");

		// Vérification 2 : Champ Mot de passe
		expect(screen.getByLabelText("Mot de passe :")).toHaveValue("");
	});

	// ========== SCÉNARIO 6 : MOT DE PASSE TROP COURT ==========
	// Test de la validation de longueur minimale
	it("Refuse un mot de passe trop court (< 12 caractères)", async () => {
		// ========== ARRANGE (Préparation) ==========
		const motDePasseTropCourt = "abc"; // Mot de passe de moins de 12 caractères

		// Rendu du composant une seule fois dans ce test
		renderWithProviders(
			<MemoryRouter>
				<ConnexionFormPage onSubmit={mockOnSubmit} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseTropCourt);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le champ "Mot de passe" doit être supérieur ou égale à 12/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 7 : PAS DE MAJUSCULE DANS LE MOT DE PASSE ==========
	// Test du refus d'un mot de passe sans majuscule
	it("Refuse un mot de passe long sans majuscule", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Mot de passe sans majuscule
		const passwordSansMajuscule = "passwordlong123!";

		// Rendu du composant une seule fois dans ce test
		renderWithProviders(
			<MemoryRouter>
				<ConnexionFormPage onSubmit={mockOnSubmit} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Mot de passe :"), passwordSansMajuscule);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le mot de passe est invalide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 8 : PAS DE MINUSCULE DANS LE MOT DE PASSE ==========
	// Test du refus d'un mot de passe sans minuscule
	it("mot de passe sans minuscule", async () => {
		// ========== ARRANGE (Préparation) ==========

		renderWithProviders(
			<MemoryRouter>
				<ConnexionFormPage onSubmit={mockOnSubmit} />
			</MemoryRouter>,
		);

		const passwordToutEnMajuscules = "PASSWORDLONG123!";
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Mot de passe :"), passwordToutEnMajuscules);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le mot de passe est invalide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 9 : PAS DE CHIFFRE DANS LE MOT DE PASSE ==========
	// Test du refus d'un mot de passe sans chiffre
	it("mot de passe sans chiffre", async () => {
		// ========== ARRANGE (Préparation) ==========

		renderWithProviders(
			<MemoryRouter>
				<ConnexionFormPage onSubmit={mockOnSubmit} />
			</MemoryRouter>,
		);

		const passwordSansChiffre = "PASSWORDLONrye!";
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Mot de passe :"), passwordSansChiffre);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le mot de passe est invalide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 10 : PAS DE CARACTERES SPECIAUX DANS LE MOT DE PASSE ==========
	// Test du refus d'un mot de passe sans caractères spéciaux
	it("mot de passe sans caractères spéciaux", async () => {
		// ========== ARRANGE (Préparation) ==========

		renderWithProviders(
			<MemoryRouter>
				<ConnexionFormPage onSubmit={mockOnSubmit} />
			</MemoryRouter>,
		);

		const passwordSansCaracSpé = "PasswordLong123";
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Mot de passe :"), passwordSansCaracSpé);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le mot de passe est invalide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 11 : CONNEXION REUSSI ==========
	// Test de la réussite de la connexion
	// Ici le bouton DOIT être enabled car tous les champs sont valides.
	// On attend avec waitFor() que le useEffect active le bouton, puis on clique.
	it("accepte un mail ainsi qu'un mot de passe conforme à toutes les règles", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<ConnexionFormPage onSubmit={mockOnSubmit} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// On attend que le useEffect ait activé le bouton avant de cliquer
		await waitFor(() => {
			expect(screen.getByRole("button")).not.toBeDisabled();
		});

		await user.click(screen.getByRole("button"));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que la connexion a réussi
		expect(mockOnSubmit).toHaveBeenCalled();
	});
});
