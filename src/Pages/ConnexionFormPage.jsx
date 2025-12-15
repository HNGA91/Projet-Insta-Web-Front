import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import "../Styles/Style.css";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const ConnexionFormPage = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [errorEmail, setErrorEmail] = useState("");
	const [errorPassword, setErrorPassword] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [loading, setLoading] = useState(false);

	const { login } = useContext(UserContext);
	const navigate = useNavigate();
	const emailInputRef = useRef(null);
	const passwordInputRef = useRef(null);

	// Focus automatique sur le champ "email" au chargement
	useEffect(() => {
		if (emailInputRef.current) {
			emailInputRef.current.focus(); //Accède à l’élément DOM et lui applique la méthode focus().
		}
	}, []); //Le tableau vide [] indique que l’effet ne dépend d’aucune variable externe. Il s’exécute une seule fois au montage du composant.

	// Pour la navigation d'un champs à un autre
	const handleInputForm = (e) => {
		if (e.key === "Enter") {
			if (e.target.name === "email") {
				passwordInputRef.current?.focus();
			} else if (e.target.name === "password") {
				handleSubmit(e);
			}
		}
	};

	// UseEffect qui surveille la validité du formulaire pour l'activation du bouton submit
	useEffect(() => {
		const formIsValid = formData.email.trim() !== "" && formData.password.trim() !== "" && !error && !errorEmail && !errorPassword;
		setIsValid(formIsValid);
	}, [formData, error, errorEmail, errorPassword]);

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,}$/;

	//...prev: opérateur de décomposition(spread operator)
	//...prev permet de conserver les autres champs du formulaire inchangés
	//[name]: value remplace uniquement la propriété ciblée (ex : email).
	// ...prev = copie de l’état précédent.
	// Utile pour mettre à jour partiellement un objet dans useState.
	// Évite d’écraser les autres propriétés.

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

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (value.trim() === "") {
			setErrorPassword('⚠️ Le champ "Mot de passe" ne peut pas etre vide');
		} else if (value.length < 12) {
			setErrorPassword('⚠️ Le champ "Mot de passe" doit etre supérieur ou égale à 12');
		} else if (!passwordRegex.test(value.trim())) {
			setErrorPassword("⚠️ Le mot de passe est invalide");
		} else {
			setErrorPassword("");
		}
	};

	const handleSubmit = async (e) => {
		// Bloque le rechargement
		e.preventDefault();

		if (loading) return;

		let isValid = true;

		// Validation côté client
		if (formData.email.trim() === "") {
			setErrorEmail('⚠️ Le champ "Email" ne peut pas être vide');
			isValid = false;
		} else if (!emailRegex.test(formData.email.trim())) {
			setErrorEmail("⚠️ Le format de l'email est invalide");
			isValid = false;
		} else {
			setErrorEmail("");
		}

		if (formData.password.trim() === "") {
			setErrorPassword('⚠️ Le champ "Mot de passe" ne peut pas être vide');
			isValid = false;
		} else if (formData.password.length < 12) {
			setErrorPassword('⚠️ Le champ "Mot de passe" doit etre supérieur ou égale à 12');
			isValid = false;
		} else if (!passwordRegex.test(formData.password.trim())) {
			setErrorPassword("⚠️ Le mot de passe est invalide");
			isValid = false;
		} else {
			setErrorPassword("");
		}

		if (!isValid) {
			console.log("❌ Le formulaire contient des erreurs. Envoi bloqué");
			return;
		}

		setLoading(true);

		// VALIDATION COTE BASE DE DONNEE

		// Si la validation côté client est passée, on vérifie en base de données
		try {
			console.log("✅ Validation côté client réussie, connexion avec JWT...");

			// Appel à la NOUVELLE route d'authentification
			const response = await fetch(`${API_BASE_URL}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: formData.email,
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

				// 2. Mettre à jour le contexte utilisateur et connexion
				login(result.user, result.token);

				// 3. Redirection
				alert("✅ Connexion réussie - Bienvenue !");
				navigate("/");
			} else {
				alert(result.message);
				console.log("❌ Échec de l'authentification:", result.message);
			}
		} catch (error) {
			console.error("❌ Erreur lors de la connexion:", error);
			alert("Une erreur est survenue lors de la connexion.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Header />
			<main className="main-content">
				<MenuLateral1 />
					<div className="content-section">
						<h2>Page de connexion</h2>
						<p>Veuillez remplir les champs afin de vous authentifier</p>

						<form className="form" onSubmit={handleSubmit}>
							<label className="form-label">Email:</label>
							<br />
							<input
								ref={emailInputRef}
								type="email"
								name="email"
								className="form-control"
								value={formData.email}
								onChange={handleEmailChange}
								onKeyDown={handleInputForm}
								placeholder="Veuillez entrer votre adresse mail"
							/>
							{errorEmail && (
								<p className="error-message" style={{ color: "red" }}>
									{errorEmail}
								</p>
							)}
							<br />
							<br />

							<label className="form-label">Mot de passe:</label>
							<br />
							<input
								ref={passwordInputRef}
								type="password"
								name="password"
								className="form-control"
								value={formData.password}
								onChange={handlePasswordChange}
								onKeyDown={handleInputForm}
								placeholder="Veuillez entrer votre mot de passe"
							/>
							{errorPassword && (
								<p className="error-message" style={{ color: "red" }}>
									{errorPassword}
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
									disabled={!isValid || loading}
								>
									{isValid ? "Se connecter" : "Champs invalides"}
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

export default ConnexionFormPage;
