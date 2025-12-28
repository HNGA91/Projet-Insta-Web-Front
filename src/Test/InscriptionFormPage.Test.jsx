import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Inscription from "../Composant/Inscription";

describe("Page d'inscription ", () => {
	it("affiche le formulaire avec tous les champs vides au chargement", () => {
		// Création d'un mock pour onSuccess
		const onSuccessMock = vi.fn();

		render(
			<MemoryRouter>
				<Inscription onSuccess={onSuccessMock} />
			</MemoryRouter>
		);

		// Vérification 1 : Champ Nom
		expect(screen.getByRole("textbox", { name: /nom/i })).toHaveValue("");

		// Vérification 2 : Champ Email (même principe)
		expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("");

		// Vérification 3 : Champ Mot de passe
		expect(screen.getByLabelText("Mot de passe")).toHaveValue("");

		// Vérification 4 : Champ Confirmation du mot de passe
		expect(screen.getByLabelText("Confirmer le mot de passe")).toHaveValue("");
	});

	// ========== SCÉNARIO 2 : MOT DE PASSE TROP COURT ==========
	// Test de la validation de longueur minimale
	it("refuse un mot de passe trop court (< 12 caractères)", async () => {
		// ========== ARRANGE (Préparation) ==========
		const motDePasseInvalide = "abc"; // Mot de passe de moins de 12 caractères

		// Création d'un mock pour onSuccess (utile si vous voulez vérifier qu'il n'est pas appelé)
		const onSuccessMock = vi.fn();

		// Rendu du composant une seule fois dans ce test
		render(
			<MemoryRouter>
				<Inscription onSuccess={onSuccessMock} />
			</MemoryRouter>
		);

		// Simulation des interactions utilisateur
		const user = userEvent.setup();
		// 1. Saisie du prénom dans le champ correspondant
		// - Recherche du champ par son texte de placeholder "aylan"
		// - Saisie de la valeur "Aylan" (avec majuscule initiale)
		// await user.type(screen.getByPlaceholderText("aylan"), "Aylan");
		// await user.type(screen.getByPlaceholderText("aylan@example.com"), "a@b.com");
		await user.type(screen.getByLabelText("Mot de passe"), motDePasseInvalide);
		// await user.type(screen.getByLabelText("Confirmer le mot de passe"), motDePasseInvalide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/Au moins 12 caractères/i)).toBeInTheDocument();

		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(onSuccessMock).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 3 : PAS DE MAJUSCULE ==========
	// Test du refus d'un mot de passe sans majuscule
	it("refuse un mot de passe long sans majuscule", async () => {
		// ========== ARRANGE (Préparation) ==========
		// Création d'un mock pour onSuccess
		const onSuccessMock = vi.fn();

		const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

		// Mot de passe sans majuscule
		const passwordSansMajuscule = "passwordlong123!";

		// Rendu du composant une seule fois dans ce test
		render(
			<MemoryRouter>
				<Inscription onSuccess={onSuccessMock} />
			</MemoryRouter>
		);

		// Simulation des interactions utilisateur
		const user = userEvent.setup();

		await user.type(screen.getByPlaceholderText("aylan"), "Aylan");
		await user.type(screen.getByPlaceholderText("aylan@example.com"), "a@b.com");
		await user.type(screen.getByLabelText("Mot de passe"), passwordSansMajuscule);
		await user.type(screen.getByLabelText("Confirmer le mot de passe"), passwordSansMajuscule);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/Au moins une majuscule/i)).toBeInTheDocument();
		// Enregistre les appels
		expect(alertSpy).not.toHaveBeenCalled();

		expect(onSuccessMock).not.toHaveBeenCalled();
		// Optionnel : vérifie que l'inscription n'a pas réussi
		alertSpy.mockRestore();
	});

	// ========== SCÉNARIO 4 : PAS DE MINUSCULE ==========
	// Test du refus d'un mot de passe sans minuscule
	it("", async () => {
		// ========== ARRANGE (Préparation) ==========
		// Création d'un mock pour onSuccess

		const onSuccessMock = vi.fn();
		// - vi.spyOn crée un espion qui tracke les appels
		// - mockImplementation(() => {}) remplace l'alerte réelle par une fonction vide
		// Avantage : ce spy est créé dans le test → toujours reconnu comme un vrai spy Vitest
		const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

		render(
			<MemoryRouter>
				<Inscription onSuccess={onSuccessMock} />
			</MemoryRouter>
		);
		const user = userEvent.setup();

		await user.type(screen.getByPlaceholderText("aylan"), "Aylan");
		await user.type(screen.getByPlaceholderText("aylan@example.com"), "a@b.com");

		const passwordToutEnMajuscules = "PASSWORDLONG123!";
		await user.type(screen.getByLabelText("Mot de passe"), passwordToutEnMajuscules);
		await user.type(screen.getByLabelText("Confirmer le mot de passe"), passwordToutEnMajuscules);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/Au moins une minuscule/i)).toBeInTheDocument();
		expect(onSuccessMock).not.toHaveBeenCalled();
		expect(alertSpy).not.toHaveBeenCalled();
		//évite les interférences entre les tests même si Vitest nettoie généralement automatiquement
		alertSpy.mockRestore();
	});

	// ========== SCÉNARIO 5 : PAS DE CHIFFRE ==========
	// Test du refus d'un mot de passe sans chiffre
	it("", async () => {
		// ========== ARRANGE (Préparation) ==========
		// Création d'un mock pour onSuccess

		const onSuccessMock = vi.fn();
		// - vi.spyOn crée un espion qui tracke les appels
		// - mockImplementation(() => {}) remplace l'alerte réelle par une fonction vide
		// Avantage : ce spy est créé dans le test → toujours reconnu comme un vrai spy Vitest
		const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

		render(
			<MemoryRouter>
				<Inscription onSuccess={onSuccessMock} />
			</MemoryRouter>
		);
		const user = userEvent.setup();

		await user.type(screen.getByPlaceholderText("aylan"), "Aylan");
		await user.type(screen.getByPlaceholderText("aylan@example.com"), "a@b.com");

		const passwordSansChiffre = "PASSWORDLONrye!";
		await user.type(screen.getByLabelText("Mot de passe"), passwordSansChiffre);
		await user.type(screen.getByLabelText("Confirmer le mot de passe"), passwordSansChiffre);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/Au moins un chiffre/i)).toBeInTheDocument();
		expect(onSuccessMock).not.toHaveBeenCalled();
		expect(alertSpy).not.toHaveBeenCalled();
		//évite les interférences entre les tests même si Vitest nettoie généralement automatiquement
		alertSpy.mockRestore();
	});

	// ========== SCÉNARIO 6 : PAS DE CARACTERES SPECIAUX ==========
	// Test du refus d'un mot de passe sans caractères spéciaux
	it("", async () => {
		// ========== ARRANGE (Préparation) ==========
		// Création d'un mock pour onSuccess

		const onSuccessMock = vi.fn();
		// - vi.spyOn crée un espion qui tracke les appels
		// - mockImplementation(() => {}) remplace l'alerte réelle par une fonction vide
		// Avantage : ce spy est créé dans le test → toujours reconnu comme un vrai spy Vitest
		const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

		render(
			<MemoryRouter>
				<Inscription onSuccess={onSuccessMock} />
			</MemoryRouter>
		);
		const user = userEvent.setup();

		await user.type(screen.getByPlaceholderText("aylan"), "Aylan");
		await user.type(screen.getByPlaceholderText("aylan@example.com"), "a@b.com");

		const passwordSansCaracSpé = "PasswordLong123";
		await user.type(screen.getByLabelText("Mot de passe"), passwordSansCaracSpé);
		await user.type(screen.getByLabelText("Confirmer le mot de passe"), passwordSansCaracSpé);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/Au moins un caractère spécial/i)).toBeInTheDocument();
		expect(onSuccessMock).not.toHaveBeenCalled();
		expect(alertSpy).not.toHaveBeenCalled();
		//évite les interférences entre les tests même si Vitest nettoie généralement automatiquement
		alertSpy.mockRestore();
	});

	// ========== SCÉNARIO 7 : INSCRIPTION REUSSI ==========
	// Test de la réussite de l'inscription
	it("accepte un mot de passe conforme à toutes les règles", async () => {
		// ========== ARRANGE (Préparation) ==========
		// Création d'un mock pour onSuccess

		const onSuccessMock = vi.fn();

		const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

		// Rendu unique du composant
		render(
			<MemoryRouter>
				<Inscription onSuccess={onSuccessMock} />
			</MemoryRouter>
		);

		const user = userEvent.setup();

		await user.type(screen.getByPlaceholderText("aylan"), "jean2025");
		await user.type(screen.getByPlaceholderText("aylan@example.com"), "jean@exemple.com");
		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Mot de passe"), motDePasseValide);
		await user.type(screen.getByLabelText("Confirmer le mot de passe"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(alertSpy).toHaveBeenCalledWith("Inscription réussie !");
		expect(onSuccessMock).toHaveBeenCalled();
		expect(screen.queryByText(/Au moins/i)).not.toBeInTheDocument();
		//évite les interférences entre les tests même si Vitest nettoie généralement automatiquement
		alertSpy.mockRestore();
	});
});
