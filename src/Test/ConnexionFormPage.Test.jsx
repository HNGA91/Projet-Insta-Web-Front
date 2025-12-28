import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Connexion from "../Composant/connexion";

describe("Page de connexion", () => {
	let mockOnSubmit = vi.fn();
	let mockOnForgotPassword = vi.fn();
	let user = userEvent.setup();

	// ========== SCÉNARIO 1 : INPUT EMAIL VIDE ==========
	// Test de l'input email qui n'est pas remplit
	it("l'input email n'est pas remplit", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu du composant une seule fois dans ce test
        render(
			<MemoryRouter>
				<Connexion onSubmit={mockOnSubmit} onForgotPassword={mockOnForgotPassword} />{" "}
			</MemoryRouter>
		);

		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Email"), " ");
		await user.type(screen.getByLabelText("Mot de passe"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		await user.click(screen.getByRole("button", { name: /Se connecter/i }));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/L'email est requis/i)).toBeInTheDocument();

		// Optionnel : vérifie que la connexion n'a pas réussi
		expect(mockOnSubmit, mockOnForgotPassword).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 2 : EMAIL INVALIDE PAS DE @ ==========
	// Test de validité de l'adresse email
	it("l'email est invalide", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu du composant une seule fois dans ce test
		render(
			<MemoryRouter>
				<Connexion onSubmit={mockOnSubmit} onForgotPassword={mockOnForgotPassword} />{" "}
			</MemoryRouter>
		);

		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Email"), "jean.exemple.com");
		await user.type(screen.getByLabelText("Mot de passe"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		await user.click(screen.getByRole("button", { name: /Se connecter/i }));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/Email invalide/i)).toBeInTheDocument();

		// Optionnel : vérifie que la connexion n'a pas réussi
		expect(mockOnSubmit, mockOnForgotPassword).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 3 : EMAIL INVALIDE PAS DE . ==========
	// Test de validité de l'adresse email
	it("l'email est invalide", async () => {
		// ========== ARRANGE (Préparation) ==========

		render(
			<MemoryRouter>
				<Connexion onSubmit={mockOnSubmit} onForgotPassword={mockOnForgotPassword} />{" "}
			</MemoryRouter>
		);

		const motDePasseValide = "MonSuperMot2passe!2025";
		await user.type(screen.getByLabelText("Email"), "jean@exemplecom");
		await user.type(screen.getByLabelText("Mot de passe"), motDePasseValide);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		await user.click(screen.getByRole("button", { name: /Se connecter/i }));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/Email invalide/i)).toBeInTheDocument();

		// Optionnel : vérifie que la connexion n'a pas réussi
		expect(mockOnSubmit, mockOnForgotPassword).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 4 : INPUT MOT DE PASSE VIDE ==========
	// Test de l'input mot de passe qui n'est pas remplit
	it("l'input mot de passe n'est pas remplit", async () => {
		// ========== ARRANGE (Préparation) ==========

		// Rendu du composant une seule fois dans ce test
		render(
			<MemoryRouter>
				<Connexion onSubmit={mockOnSubmit} onForgotPassword={mockOnForgotPassword} />{" "}
			</MemoryRouter>
		);

		await user.type(screen.getByLabelText("Email"), "jean.exemple.com");
		expect(screen.getByLabelText("Mot de passe")).toHaveValue("");

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		await user.click(screen.getByRole("button", { name: /Se connecter/i }));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/Le mot de passe est requis/i)).toBeInTheDocument();

		// Optionnel : vérifie que la connexion n'a pas réussi
		expect(mockOnSubmit, mockOnForgotPassword).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 5 : FORMULAIRE VIERGE AU CHARGEMENT ==========
	// Test du formulaire vide au chargement
	it("affiche le formulaire avec tous les champs vides au chargement", () => {
		// Création d'un mock pour onSuccess
		const mockOnSubmit = vi.fn();
		const mockOnForgotPassword = vi.fn();

		render(
			<MemoryRouter>
				<Connexion onSubmit={mockOnSubmit} onForgotPassword={mockOnForgotPassword} />{" "}
			</MemoryRouter>
		);

		// Vérification 2 : Champ Email (même principe)
		expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("");

		// Vérification 3 : Champ Mot de passe
		expect(screen.getByLabelText("Mot de passe")).toHaveValue("");
	});

	// ========== SCÉNARIO 6 : MOT DE PASSE TROP COURT ==========
	// Test de la validation de longueur minimale
	it("refuse un mot de passe trop court (< 12 caractères)", async () => {
		// ========== ARRANGE (Préparation) ==========
		const motDePasseTropCourt = "abc"; // Mot de passe de moins de 12 caractères

		// Rendu du composant une seule fois dans ce test
		render(
			<MemoryRouter>
				<Connexion onSubmit={mockOnSubmit} onForgotPassword={mockOnForgotPassword} />{" "}
			</MemoryRouter>
		);

		await user.type(screen.getByLabelText("Email"), "jean.exemple.com");
		await user.type(screen.getByLabelText("Mot de passe"), motDePasseTropCourt);

		// ========== ACT (Action) ==========
		// Soumission du formulaire
		await user.click(screen.getByRole("button", { name: /Se connecter/i }));

		// ========== ASSERT (Vérification) ==========
		// Vérifie que le message d'erreur apparaît
		expect(await screen.findByText(/Au moins 12 caractères/i)).toBeInTheDocument();

		// Optionnel : vérifie que l'inscription n'a pas réussi
		expect(mockOnSubmit, mockOnForgotPassword).not.toHaveBeenCalled();
	});

	// ========== SCÉNARIO 7 : BRUTEFORCE / NOMBRE DE TENTATIVE ==========
	// Test bruteforce
	it("bloque temporairement après 5 tentatives échouées (protection brute force)", async () => {
        render(
			<MemoryRouter>
				<Connexion onSubmit={mockOnSubmit} onForgotPassword={mockOnForgotPassword} />{" "}
			</MemoryRouter>
		);
		mockOnSubmit.mockRejectedValue(new Error("Invalid credentials"));

		// Récupération des éléments du formulaire pour performance et lisibilité
		const emailInput = screen.getByPlaceholderText("aylan@example.com");
		const passwordInput = screen.getByPlaceholderText("••••••••");
		const submitButton = screen.getByRole("button", { name: /se connecter/i });

		// ───── Act ───── 5 tentatives échouées
		// ACT (When) : Simulation de l'attaque par force brute
		// Un attaquant tente plusieurs combinaisons d'identifiants
		// Boucle for pour simuler 5 tentatives rapides
		for (let i = 0; i < 5; i++) {
			// user.clear() efface le champ avant de retaper (plus réaliste que juste type)
			await user.clear(emailInput);
			await user.type(emailInput, "hacker@attack.com");
			await user.clear(passwordInput);
			await user.type(passwordInput, "wrong");
			await user.click(submitButton);
		}

		// ───── Assert ───── Blocage activé après 5 échecs
		// ASSERT (Then) : Vérification de la protection activée

		// 1. Message de blocage affiché
		// waitFor attend qu'une condition soit vraie (rendu asynchrone après état)
		// Le composant doit afficher un message après le 5ème échec
		await waitFor(() => {
			expect(screen.getByText(/trop de tentatives/i)).toBeInTheDocument();
			// ou avec test-id : expect(screen.getByTestId('lockout-message')).toBeInTheDocument();
		});
	});

	// ========== SCÉNARIO 8 : MOT DE PASSE OUBLIE ==========
	// Test d'appelle onForgotPassword quand on clique sur "Mot de passe oublié ?"
	it('appelle onForgotPassword quand on clique sur "Mot de passe oublié ?" ', async () => {
		// ───── Arrange ───── (Étant donné que)
		// Je suis sur la page de connexion

		render(
			<MemoryRouter>
				<Connexion onSubmit={mockOnSubmit} onForgotPassword={mockOnForgotPassword} />{" "}
			</MemoryRouter>
		);

		// ───── Act ───── (Quand)
		// Je clique sur le lien "Mot de passe oublié ?"
		// getByText trouve l'élément par son texte (regex pour variantes de texte)
		await user.click(screen.getByText(/mot de passe oublié/i));

		// ───── Assert ───── (Alors)
		// 1. Le système doit initialiser le processus de récupération
		// La fonction callback (prop) doit être appelée
		expect(mockOnForgotPassword).toHaveBeenCalledTimes(1);

		// 2. Feedback utilisateur optionnel
		// Et je dois rester informé de la prochaine étape
		// (Selon l'implémentation, pourrait être une redirection ou un message)
		// queryByText retourne null si non trouvé (contrairement à getByText qui échoue)
		const messageInfo = screen.queryByText(/vérifiez.*email|réinitialisation.*envoyée/i);

		// Conditionnel : vérifie seulement si le message existe
		// Permet de tester différentes implémentations
		if (messageInfo) {
			expect(messageInfo).toBeVisible();
		}

		// Note : Ce test pourrait aussi vérifier une redirection vers une autre page
		// Mais ici on teste juste l'appel de la fonction callback
	});
});
