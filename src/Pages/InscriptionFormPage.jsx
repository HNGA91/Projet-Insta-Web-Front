import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import Header from "../Composants/Header.jsx"
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";
import "../Styles/Style.css";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const InscriptionFormPage = () => {
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
			setErrorNom('⚠️ Le champ "Nom" ne peut pas etre vide');
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
			setErrorPrenom('⚠️ Le champ "Prenom" ne peut pas etre vide');
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
			setErrorEmail('⚠️ Le champ "Email" ne peut pas etre vide');
		} else if (!emailRegex.test(value.trim())) {
			setErrorEmail("⚠️ Le format de l'email est invalide.");
		} else {
			setErrorEmail("");
		}
	};

	//Vérification du champ "tel"
	const handleTelChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: numericValue,
		}));

		const numericValue = value.replace(/[^0-9]/g, "");

		if (numericValue.trim() === "") {
			setErrorTel('⚠️ Le champ "Numéro de téléphone" ne peut pas etre vide');
		} else if (numericValue.length < 10) {
			setErrorTel("⚠️ Le numéro de téléphone semble trop court");
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
			setErrorPassword('⚠️ Le champ "Mot de passe" ne peut pas etre vide');
		} else if (value.length < 12) {
			setErrorPassword('⚠️ Le champ "Mot de passe" doit etre supérieur ou égale à 12');
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
			setErrorConfirmPassword('⚠️ Le champ "Confirmation de mot de passe" ne peut pas etre vide');
		} else if (value.length < 12) {
			setErrorConfirmPassword('⚠️ Le champ "Confirmation de mot de passe" doit etre supérieur ou égale à 12');
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
		} else {
			setErrorNom("");
		}

		// Prenom
		if (formData.prenom.trim() === "") {
			setErrorPrenom('⚠️ Le champ "Prenom" ne peut pas être vide');
			isValid = false;
		} else if (!nameRegex.test(formData.prenom)) {
			setErrorPrenom("⚠️ Le prenom ne peut contenir que des lettres");
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
		if (formData.tel.trim() === "") {
			setErrorTel('⚠️ Le champ "Tel" ne peut pas être vide');
			isValid = false;
		} else if (formData.tel.length < 10) {
			setErrorTel("⚠️ Le numéro de téléphone semble trop court");
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
			setErrorPassword('⚠️ Le champ "Mot de passe" doit etre supérieur ou égale à 12');
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
			setErrorConfirmPassword('⚠️ Le champ "Confirmation de mot de passe" doit etre supérieur ou égale à 12');
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

		// Début du loading
		setLoading(true);

		// VALIDATION COTE BASE DE DONNEE

		// Si la validation côté client est passée, on vérifie en base de données
		try {
			console.log("✅ Validation côté client réussie, connexion avec JWT...");

			// Appel à la NOUVELLE route d'authentification
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
					source: "web",
				}),
			});

			const result = await response.json();

			if (result.success) {
				console.log("✅ Connexion JWT réussie:", result.user);

				// 1. Stocker le token
				localStorage.setItem("authToken", result.token);
				localStorage.setItem("user", JSON.stringify(result.user));

				// 2. Mettre à jour le contexte utilisateur et connexion automatique après inscription
				login(result.user, result.token);

				// 3. Redirection
				alert("✅ Inscription réussie !", `Bienvenue, ${formData.prenom} !`);
				navigate("/");
			} else {
				alert("❌ Erreur", result.message);
				console.log("❌ Échec de l'authentification:", result.message);
			}
		} catch (error) {
			console.error("❌ Erreur lors de l'inscription:", error);
			alert("Une erreur est survenue lors de l'inscription.");
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
					<form className="form" onSubmit={handleSubmit}>
						<label className="form-label">Nom:</label>
						<br />
						<input
							ref={nomInputRef}
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

						<label className="form-label">Prenom:</label>
						<br />
						<input
							ref={prenomInputRef}
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

						<label className="form-label">Email:</label>
						<br />
						<input
							ref={emailInputRef}
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

						<label className="form-label">Numéro de téléphone:</label>
						<br />
						<input
							ref={telInputRef}
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

						<label className="form-label">Mot de passe:</label>
						<br />
						<input
							ref={passwordInputRef}
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

						<label className="form-label">Confirmation du mot de passe:</label>
						<br />
						<input
							ref={confirmPasswordInputRef}
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
								onClick={handleSubmit}
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
