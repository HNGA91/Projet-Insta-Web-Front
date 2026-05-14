import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext.js";
import Header from "../Composants/Header.jsx"
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";
import "../Styles/Style.css";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const InscriptionFormPage = ({ onSuccess }) => {
	const [formData, setFormData] = useState({
		nom: "",
		prenom: "",
		email: "",
		tel: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [errorNom, setErrorNom] = useState("");
	const [errorPrenom, setErrorPrenom] = useState("");
	const [errorEmail, setErrorEmail] = useState("");
	const [errorTel, setErrorTel] = useState("");
	const [errorPassword, setErrorPassword] = useState("");
	const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

	// Pour vérifier l'états des critères du mot de passe
	const [passwordCriteria, setPasswordCriteria] = useState({
		hasUppercase: false,
		hasLowercase: false,
		hasNumber: false,
		hasSpecialChar: false,
	});

	// Pour vérifier l'état de validation du formulaire
	const [isValid, setIsValid] = useState(false);

	// Pour vérifier l'état de chargement du formulaire
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	// Accès au context
	const { login } = useContext(UserContext);

	// Ref pour déplacer le focus entre les inputs
	const nomInputRef = useRef(null);
	const prenomInputRef = useRef(null);
	const emailInputRef = useRef(null);
	const telInputRef = useRef(null);
	const passwordInputRef = useRef(null);
	const confirmPasswordInputRef = useRef(null);

	// Focus automatique sur le champ "nom" au chargement
	useEffect(() => {
		if (nomInputRef.current) {
			nomInputRef.current.focus(); //Accède à l’élément DOM et lui applique la méthode focus().
		}
	}, []); //Le tableau vide [] indique que l’effet ne dépend d’aucune variable externe. Il s’exécute une seule fois au montage du composant.

	// Pour la navigation d'un champs à un autre
	const handleInputForm = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const inputs = [nomInputRef, prenomInputRef, emailInputRef, telInputRef, passwordInputRef, confirmPasswordInputRef];

			const currentIndex = inputs.findIndex((ref) => ref.current === e.target);
			if (currentIndex < inputs.length - 1) {
				inputs[currentIndex + 1].current?.focus();
			} else {
				handleSubmit(e);
			}
		}
	};

	// UseEffect qui surveille la validité du formulaire pour l'activation du bouton submit
	// Si la moindre erreur s'active, le formulaire ne peut pas etre envoyé
	useEffect(() => {
		const formIsValid =
			formData.nom.trim() !== "" &&
			formData.prenom.trim() !== "" &&
			formData.email.trim() !== "" &&
			formData.tel.trim() !== "" &&
			formData.password.trim() !== "" &&
			formData.confirmPassword.trim() !== "" &&
			!error &&
			!errorNom &&
			!errorPrenom &&
			!errorEmail &&
			!errorTel &&
			!errorPassword &&
			!errorConfirmPassword;

		setIsValid(formIsValid);
	}, [formData, error, errorNom, errorPrenom, errorEmail, errorTel, errorPassword, errorConfirmPassword]);

	//...prev: opérateur de décomposition(spread operator)
	//...prev permet de conserver les autres champs du formulaire inchangés
	//[name]: value remplace uniquement la propriété ciblée (ex : email).
	// ...prev = copie de l’état précédent.
	// Utile pour mettre à jour partiellement un objet dans useState.
	// Évite d’écraser les autres propriétés.

	// Vérifie si les mots de passe correspondent
	useEffect(() => {
		//Se déclenche à chaque modification de motdepasse ou confirmMotdepasse
		if (
			formData.password &&
			formData.confirmPassword &&
			formData.password !== formData.confirmPassword //Si les deux champs sont remplis et ne correspondent pas
		) {
			setError("⚠️ Les mots de passe ne correspondent pas"); //Met à jour le message d’erreur
		} else {
			setError(""); //Réinitialise le message d’erreur si les mots de passe correspondent
		}
	}, [formData.password, formData.confirmPassword]); //Dépendance aux changements de motdepasse et confirmMotdepasse

	// Les différents Regex utiles aux vérifications
	const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,}$/;

	// Fonction pour vérifier tous les critères du mot de passe
	const checkPasswordCriteria = (password) => {
		const criteria = {
			hasUppercase: /[A-Z]/.test(password),
			hasLowercase: /[a-z]/.test(password),
			hasNumber: /\d/.test(password),
			hasSpecialChar: /[!@#$%^&*]/.test(password),
		};
		setPasswordCriteria(criteria);

		// Vérifie si tous les critères sont remplis
		return Object.values(criteria).every((criterion) => criterion === true);
	};

	//Vérification du champ "nom"
	const handleNomChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (value.trim() === "") {
			setErrorNom('⚠️ Le champ "Nom" ne peut pas être vide');
		} else if (!nameRegex.test(value)) {
			setErrorNom("⚠️ Le nom ne peut contenir que des lettres");
		} else {
			setErrorNom("");
		}
	};

	//Vérification du champ "prenom"
	const handlePrenomChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (value.trim() === "") {
			setErrorPrenom('⚠️ Le champ "Prenom" ne peut pas être vide');
		} else if (!nameRegex.test(value)) {
			setErrorPrenom("⚠️ Le prenom ne peut contenir que des lettres");
		} else {
			setErrorPrenom("");
		}
	};

	//Vérification du champ "email"
	const handleEmailChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (value.trim() === "") {
			setErrorEmail('⚠️ Le champ "Email" ne peut pas être vide');
		} else if (!emailRegex.test(value.trim())) {
			setErrorEmail("⚠️ Le format de l'email est invalide");
		} else {
			setErrorEmail("");
		}
	};

	//Vérification du champ "tel"
	const phoneRegex = /^(0|\+33)[1-9][0-9]{8}$/;

	const handleTelChange = (e) => {
		const { name, value } = e.target;

		// Nettoyage : on garde chiffres et +
		let cleanedValue = value.replace(/[^0-9+]/g, "");

		// Autoriser UN SEUL "+" et uniquement au début
		if (cleanedValue.includes("+")) {
			// Supprime tous les "+"
			cleanedValue = cleanedValue.replace(/\+/g, "");

			// Si l'utilisateur avait mis un "+" au début → on le remet
			if (value.trim().startsWith("+")) {
				cleanedValue = "+" + cleanedValue;
			}
		}

		// Version chiffres uniquement (pour la longueur)
		const numericValue = cleanedValue.replace(/[^0-9]/g, "");

		setFormData((prev) => ({
			...prev,
			[name]: cleanedValue,
		}));

		if (cleanedValue.trim() === "") {
			setErrorTel('⚠️ Le champ "Numéro de téléphone" ne peut pas être vide');
		} else if (numericValue.length !== 10 && numericValue.length !== 11) {
			setErrorTel("⚠️ Le numéro doit contenir 10 chiffres (ou 11 avec indicatif +33)");
		} else if (!phoneRegex.test(cleanedValue)) {
			setErrorTel("⚠️ Le format du numéro de téléphone est invalide");
		} else {
			setErrorTel("");
		}
	};

	//Vérification du champ "mot de passe"
	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Vérifie les critères
		const allCriteriaMet = checkPasswordCriteria(value);

		if (value.trim() === "") {
			setErrorPassword('⚠️ Le champ "Mot de passe" ne peut pas être vide');
		} else if (value.length < 12) {
			setErrorPassword('⚠️ Le champ "Mot de passe" doit être supérieur ou égale à 12');
		} else if (!passwordRegex.test(value.trim())) {
			setErrorPassword("⚠️ Le mot de passe est invalide");
		} else if (!allCriteriaMet) {
			setErrorPassword("⚠️ Le mot de passe ne respecte pas tous les critères");
		} else {
			setErrorPassword("");
		}
	};

	//Vérification du champ "confirmation de mot de passe"
	const handleConfirmPasswordChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (value.trim() === "") {
			setErrorConfirmPassword('⚠️ Le champ "Confirmation de mot de passe" ne peut pas être vide');
		} else if (value.length < 12) {
			setErrorConfirmPassword('⚠️ Le champ "Confirmation de mot de passe" doit être supérieur ou égale à 12');
		} else if (!passwordRegex.test(value.trim())) {
			setErrorConfirmPassword("⚠️ Le mot de passe est invalide");
		} else {
			setErrorConfirmPassword("");
		}
	};

	const handleSubmit = async (e) => {
		// Bloque le rechargement
		e.preventDefault();

		// Ajout de loading afin d'empêcher la double soumission
		if (loading) return;

		let isValid = true;

		// VALIDATION COTE CLIENT

		// Nom
		if (formData.nom.trim() === "") {
			setErrorNom('⚠️ Le champ "Nom" ne peut pas être vide');
			isValid = false;
		} else if (!nameRegex.test(formData.nom)) {
			setErrorNom("⚠️ Le nom ne peut contenir que des lettres");
            isValid = false;
		} else {
			setErrorNom("");
		}

		// Prenom
		if (formData.prenom.trim() === "") {
			setErrorPrenom('⚠️ Le champ "Prenom" ne peut pas être vide');
			isValid = false;
		} else if (!nameRegex.test(formData.prenom)) {
			setErrorPrenom("⚠️ Le prenom ne peut contenir que des lettres");
            isValid = false;
		} else {
			setErrorPrenom("");
		}

		// Email
		if (formData.email.trim() === "") {
			setErrorEmail('⚠️ Le champ "Email" ne peut pas être vide');
			isValid = false;
		} else if (!emailRegex.test(formData.email.trim())) {
			setErrorEmail("⚠️ Le format de l'email est invalide");
			isValid = false;
		} else {
			setErrorEmail("");
		}

		// Tel
		// Nettoyage : on garde chiffres et +
		let cleanedValue = formData.tel.replace(/[^0-9+]/g, "");

		// Autoriser UN SEUL "+" et uniquement au début
		if (cleanedValue.includes("+")) {
			// Supprime tous les "+"
			cleanedValue = cleanedValue.replace(/\+/g, "");

			// Si l'utilisateur avait mis un "+" au début → on le remet
			if (formData.tel.trim().startsWith("+")) {
				cleanedValue = "+" + cleanedValue;
			}
		}

		// Version chiffres uniquement (pour la longueur)
		const numericValue = cleanedValue.replace(/[^0-9]/g, "");

		if (cleanedValue.trim() === "") {
			setErrorTel('⚠️ Le champ "Numéro de téléphone" ne peut pas être vide');
            isValid = false;
		} else if (numericValue.length !== 10 && numericValue.length !== 11) {
			setErrorTel("⚠️ Le numéro doit contenir 10 chiffres (ou 11 avec indicatif +33)");
            isValid = false;
		} else if (!phoneRegex.test(cleanedValue)) {
			setErrorTel("⚠️ Le format du numéro de téléphone est invalide");
            isValid = false;
		} else {
			setErrorTel("");
		}

		// Vérifie tous les critères du mot de passe
		const passwordAllCriteriaMet = checkPasswordCriteria(formData.password);

		// Mot de passe
		if (formData.password.trim() === "") {
			setErrorPassword('⚠️ Le champ "Mot de passe" ne peut pas être vide');
			isValid = false;
		} else if (formData.password.length < 12) {
			setErrorPassword('⚠️ Le champ "Mot de passe" doit être supérieur ou égale à 12');
			isValid = false;
		} else if (!passwordRegex.test(formData.password.trim())) {
			setErrorPassword("⚠️ Le mot de passe est invalide");
			isValid = false;
		} else if (!passwordAllCriteriaMet) {
			setErrorPassword("⚠️ Le mot de passe ne respecte pas tous les critères");
			isValid = false;
		} else {
			setErrorPassword("");
		}

		// Confirmation du mot de passe
		if (formData.confirmPassword.trim() === "") {
			setErrorConfirmPassword('⚠️ Le champ "Confirmation de mot de passe" ne peut pas être vide');
			isValid = false;
		} else if (formData.confirmPassword.length < 12) {
			setErrorConfirmPassword('⚠️ Le champ "Confirmation de mot de passe" doit être supérieur ou égale à 12');
			isValid = false;
		} else if (formData.password !== formData.confirmPassword) {
			setErrorConfirmPassword("⚠️ Les mots de passe ne correspondent pas");
			isValid = false;
		} else {
			setErrorConfirmPassword("");
		}

		if (!isValid) {
			// Arrête tout ici si il y a une erreur
			console.log("❌ Le formulaire contient des erreurs. Envoi bloqué");
			return;
		}

		// Appel du onSubmit pour les tests
		if (onSuccess) {
			onSuccess(formData);
			return; // évite l'appel API pendant les tests
		}

		// Début du loading
		setLoading(true);

		// VALIDATION COTE BASE DE DONNEE

		// Si la validation côté client est passée, on vérifie en base de données
		try {
			console.log("✅ Validation côté client réussie, inscription en cours...");

			const response = await fetch(`${API_BASE_URL}/auth/inscription`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					nom: formData.nom,
					prenom: formData.prenom,
					email: formData.email,
					tel: formData.tel,
					password: formData.password,
				}),
			});

			const result = await response.json();

			if (response.ok) {
				console.log("✅ Inscription réussie");

				// On ne connecte PAS l'utilisateur automatiquement
				// On le redirige vers la page de connexion
				alert(`✅ Inscription réussie ! Bienvenue ${formData.prenom}, veuillez vous connecter.`);
				navigate("/login");
			} else {
				// Affiche le message d'erreur retourné par le back
				alert(`❌ Erreur : ${result.message}`);
				console.log("❌ Échec de l'inscription:", result.message);
			}
		} catch (error) {
			console.error("❌ Erreur lors de l'inscription:", error);
			alert("❌ Une erreur est survenue lors de l'inscription.");
		} finally {
			setLoading(false);
		}
	};

	// Composant pour afficher un critère du mot de passe
	const PasswordCriterion = ({ label, isMet }) => (
		<div style={{ flexDirection: "row", alignItems: "center", marginVertical: 2 }}>
			<div
				style={{
					width: 12,
					height: 12,
					borderRadius: 6,
					backgroundColor: isMet ? "#2ecc71" : "#e74c3c",
					marginRight: 8,
				}}
			></div>
			<p
				style={{
					color: isMet ? "#2ecc71" : "#e74c3c",
					fontSize: 12,
				}}
			>
				{label}
			</p>
		</div>
	);

	return (
		<>
			<Header />
			<main className="main-content">
				<MenuLateral1 />
				<div className="content-section">
					<h2>Veuillez remplir le champs afin de compléter votre inscription</h2>
					<form className="form" onSubmit={handleSubmit} data-testid="form">
						<label className="form-label" htmlFor="nom">
							Nom :
						</label>
						<br />
						<input
							ref={nomInputRef}
							id="nom"
							onChange={handleNomChange}
							className="form-control"
							type="text"
							name="nom"
							value={formData.nom}
							onKeyDown={handleInputForm}
							placeholder="Veuillez entrez votre nom ici"
						/>
						{errorNom && (
							<p className="error-message" style={{ color: "red" }}>
								{errorNom}
							</p>
						)}
						<br />
						<br />
						<label className="form-label" htmlFor="prenom">
							Prenom :
						</label>
						<br />
						<input
							ref={prenomInputRef}
							id="prenom"
							onChange={handlePrenomChange}
							className="form-control"
							type="text"
							name="prenom"
							value={formData.prenom}
							onKeyDown={handleInputForm}
							placeholder="Veuillez entrez votre prenom ici"
						/>
						{errorPrenom && (
							<p className="error-message" style={{ color: "red" }}>
								{errorPrenom}
							</p>
						)}
						<br />
						<br />
						<label className="form-label" htmlFor="email">
							Email :
						</label>
						<br />
						<input
							ref={emailInputRef}
							id="email"
							onChange={handleEmailChange}
							className="form-control"
							type="email"
							name="email"
							value={formData.email}
							onKeyDown={handleInputForm}
							placeholder="Veuillez entrer votre adresse mail ici"
						/>
						{errorEmail && (
							<p className="error-message" style={{ color: "red" }}>
								{errorEmail}
							</p>
						)}
						<br />
						<br />
						<label className="form-label" htmlFor="tel">
							Numéro de téléphone :
						</label>
						<br />
						<input
							ref={telInputRef}
							id="tel"
							onChange={handleTelChange}
							className="form-control"
							type="tel"
							name="tel"
							value={formData.tel}
							onKeyDown={handleInputForm}
							placeholder="Entrez votre numéro de Téléphone ici"
						/>
						{errorTel && (
							<p className="error-message" style={{ color: "red" }}>
								{errorTel}
							</p>
						)}
						<br />
						<br />
						<label className="form-label" htmlFor="password">
							Mot de passe :
						</label>
						<br />
						<input
							ref={passwordInputRef}
							id="password"
							onChange={handlePasswordChange}
							className="form-control"
							type="password"
							name="password"
							value={formData.password}
							onKeyDown={handleInputForm}
							placeholder="Veuillez entrer votre mot de passe ici"
						/>
						{errorPassword && (
							<p className="error-message" style={{ color: "red" }}>
								{errorPassword}
							</p>
						)}
						<br />
						<br />
						<label className="form-label" htmlFor="confirmPassword">
							Confirmation du mot de passe :
						</label>
						<br />
						<input
							ref={confirmPasswordInputRef}
							id="confirmPassword"
							onChange={handleConfirmPasswordChange}
							className="form-control"
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onKeyDown={handleInputForm}
							placeholder="Entrez votre confirmation de mot de passe ici"
						/>
						{errorConfirmPassword && (
							<p className="error-message" style={{ color: "red" }}>
								{errorConfirmPassword}
							</p>
						)}
						<br />
						<br />
						{loading ? (
							<div className="loading-container">
								<div className="spinner"></div>
								<p>Connexion en cours...</p>
							</div>
						) : (
							<button
								type="submit"
								className={`btn ${!isValid ? "btn-invalid" : ""}`}
								// Désactivé si loading ou non valide
								disabled={!isValid || loading}
							>
								{isValid ? "S'inscrire" : "Champs invalides"}
							</button>
						)}
					</form>
				</div>
				<MenuLateral2 />
			</main>
			<Footer />
		</>
	);
};

export default InscriptionFormPage;
