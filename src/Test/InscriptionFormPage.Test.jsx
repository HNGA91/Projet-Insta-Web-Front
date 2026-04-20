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
import InscriptionFormPage from "../Pages/InscriptionFormPage.jsx";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "./TestUtils.jsx";

// ────────────────────────────────────────────────────────────────
// STRATÉGIE :
//  • Tests d'ERREUR  → le bouton reste disabled. On soumet via
//    fireEvent.submit() sur la <form> pour déclencher handleSubmit
//    sans toucher au composant.
//  • Test de SUCCÈS  → on attend que le bouton soit enabled avec
//    waitFor(), puis on clique normalement.
// ────────────────────────────────────────────────────────────────

describe("Page d'inscription", () => {
	// Création d'un mock pour onSuccess (utile si on veut vérifier qu'il n'est pas appelé)
	const onSuccessMock = vi.fn();
	// Simulation des interactions utilisateur
	const user = userEvent.setup();
	// Soumet le formulaire directement (bypass du bouton disabled)
	const submitForm = () => fireEvent.submit(screen.getByTestId("form"));

	// ========== SCÉNARIO 1 : FORMULAIRE VIERGE AU CHARGEMENT ==========
	// Test du formulaire vide au chargement
	it("Affiche le formulaire avec tous les champs vides au chargement", () => {
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		expect(screen.getByLabelText("Nom :")).toHaveValue("");
		expect(screen.getByLabelText("Prenom :")).toHaveValue("");
		expect(screen.getByLabelText("Email :")).toHaveValue("");
		expect(screen.getByLabelText("Numéro de téléphone :")).toHaveValue("");
		expect(screen.getByLabelText("Mot de passe :")).toHaveValue("");
		expect(screen.getByLabelText("Confirmation du mot de passe :")).toHaveValue("");
	});

	// ========== SCÉNARIO 2 : MOT DE PASSE TROP COURT ==========
	// Test de la validation de longueur minimale
	it("Refuse un mot de passe trop court (< 12 caractères)", async () => {
		// ========== ARRANGE (Préparation) ==========
		const motDePasseInvalide = "abc"; // Mot de passe de moins de 12 caractères

		// Rendu du composant une seule fois dans ce test
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseInvalide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseInvalide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le champ "Mot de passe" doit être supérieur ou égale à 12/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 3 : PAS DE MAJUSCULE DANS LE MOT DE PASSE ==========
	// Test du refus d'un mot de passe sans majuscule
	it("Refuse un mot de passe long sans majuscule", async () => {
		// ========== ARRANGE (Préparation) ==========
		// Mot de passe sans majuscule
		const passwordSansMajuscule = "passwordlong123!";

		// Rendu du composant une seule fois dans ce test
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		await user.type(screen.getByLabelText("Mot de passe :"), passwordSansMajuscule);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), passwordSansMajuscule);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le mot de passe ne respecte pas tous les critères/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 4 : PAS DE MINUSCULE DANS LE MOT DE PASSE ==========
	// Test du refus d'un mot de passe sans minuscule
	it("Refuse un mot de passe sans minuscule", async () => {
		// ========== ARRANGE (Préparation) ==========

		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const passwordToutEnMajuscules = "PASSWORDLONG123!";
		await user.type(screen.getByLabelText("Mot de passe :"), passwordToutEnMajuscules);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), passwordToutEnMajuscules);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le mot de passe ne respecte pas tous les critères/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 5 : PAS DE CHIFFRE DANS LE MOT DE PASSE ==========
	// Test du refus d'un mot de passe sans chiffre
	it("Refuse un mot de passe sans chiffre", async () => {
		// ========== ARRANGE (Préparation) ==========

		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const passwordSansChiffre = "PASSWORDLONrye!";
		await user.type(screen.getByLabelText("Mot de passe :"), passwordSansChiffre);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), passwordSansChiffre);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le mot de passe est invalide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 6 : PAS DE CARACTERES SPECIAUX DANS LE MOT DE PASSE ==========
	// Test du refus d'un mot de passe sans caractères spéciaux
	it("Refuse un mot de passe sans caractères spéciaux", async () => {
		// ========== ARRANGE (Préparation) ==========

		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const passwordSansCaracSpé = "PasswordLong123";
		await user.type(screen.getByLabelText("Mot de passe :"), passwordSansCaracSpé);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), passwordSansCaracSpé);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le mot de passe est invalide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 7 : INSCRIPTION REUSSI ==========
	// Test de la réussite de l'inscription
	// Ici le bouton DOIT être enabled car tous les champs sont valides.
	// On attend avec waitFor() que le useEffect active le bouton, puis on clique.
	it("Accepte un mot de passe conforme à toutes les règles", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// On attend que le useEffect ait activé le bouton avant de cliquer
		await waitFor(() => {
			expect(screen.getByRole("button")).not.toBeDisabled();
		});

		await user.click(screen.getByRole("button"));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que l'inscription a réussi
		expect(onSuccessMock).toHaveBeenCalled();
	});

	// ========== SCÉNARIO 8 : INPUT EMAIL VIDE ==========
	// Test de l'input email qui n'est pas remplit
	it("L'input email n'est pas remplit", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), " ");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le champ "Email" ne peut pas être vide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 9 : EMAIL INVALIDE PAS DE @ ==========
	// Test de validité de l'adresse email
	it("Le format de l'email est invalide (sans @)", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean.exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le format de l'email est invalide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 10 : EMAIL INVALIDE PAS DE . ==========
	// Test de validité de l'adresse email
	it("Le format de l'email est invalide (sans point)", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemplecom");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le format de l'email est invalide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 11 : INPUT MOT DE PASSE VIDE ==========
	// Test de l'input mot de passe qui n'est pas remplit
	it("L'input mot de passe n'est pas remplit", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), " ");
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le champ "Mot de passe" ne peut pas être vide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 12 : LES MOTS DE PASSES NE CORRESPONDENT PAS ==========
	// Test de la correspondance des mot de passe
	it("Les mots de passes ne correspondent pas", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const motDePasseValide = "MonSuperMot2passe!2025";
		const motDePasseValide2 = "MonSuperMot2passe!2026";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseValide2);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Les mots de passe ne correspondent pas/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 13 : INPUT CONFIRMATION DU MOT DE PASSE VIDE ==========
	// Test de l'input confirmation du mot de passe qui n'est pas remplit
	it("L'input confirmation du mot de passe n'est pas remplit", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), " ");

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le champ "Confirmation de mot de passe" ne peut pas être vide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 14 : INPUT NUMERO DE TELEPHONE VIDE ==========
	// Test de l'input Numéro de téléphone qui n'est pas remplit
	it("L'input Numéro de téléphone n'est pas remplit", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), " ");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le champ "Numéro de téléphone" ne peut pas être vide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 15 : NUMERO DE TELEPHONE TROP COURT  ==========
	// Test de la validation de longueur minimale
	it("Refuse un numéro de téléphone trop court (< 10 caractères)", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "01234567");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();
        
		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText((content) => content.includes("Le numéro doit contenir 10 chiffres"))).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 16 : INPUT PRENOM VIDE ==========
	// Test de l'input Prenom qui n'est pas remplit
	it("L'input Prenom n'est pas remplit", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), " ");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le champ "Prenom" ne peut pas être vide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 17 : INPUT PRENOM INVALIDE  ==========
	// Test de validité du prénom
	it("Le format du prénom est invalide", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "Neymar");
		await user.type(screen.getByLabelText("Prenom :"), "je3@n");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le prenom ne peut contenir que des lettres/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 18 : INPUT NOM VIDE ==========
	// Test de l'input Nom qui n'est pas remplit
	it("L'input Nom n'est pas remplit", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), " ");
		await user.type(screen.getByLabelText("Prenom :"), "Jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le champ "Nom" ne peut pas être vide/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 19 : INPUT NOM INVALIDE ==========
	// Test de validité du nom
	it("Le format du nom est invalide", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu unique du composant
		renderWithProviders(
			<MemoryRouter>
				<InscriptionFormPage onSuccess={onSuccessMock} />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Nom :"), "N3ym@r");
		await user.type(screen.getByLabelText("Prenom :"), "Jean");
		await user.type(screen.getByLabelText("Email :"), "jean@exemple.com");
		await user.type(screen.getByLabelText("Numéro de téléphone :"), "0123456789");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe :"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmation du mot de passe :"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		submitForm();

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/⚠️ Le nom ne peut contenir que des lettres/i)).toBeInTheDocument();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});
});
