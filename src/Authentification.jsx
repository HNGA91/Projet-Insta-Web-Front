import './Style/Style.css'
import Header from './Composants/Header.jsx'
import Footer from './Composants/Footer.jsx'
import { useState , useEffect , useRef } from 'react';
import MenuLateral1 from './Composants/MenuLateral1.jsx';
import MenuLateral2 from './Composants/MenuLateral2.jsx';

function Authentification () {
	// definir un usestate comme objet
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [errorEmail, setEmailError] = useState("");
	const [errorPassword, setPasswordError] = useState("");
	const [isValid, setIsValid] = useState(false);
	const emailInputRef = useRef(null); //Crée une référence vide au départ.

	// Focus automatique sur le champ "nom" au chargement
	useEffect(() => {
		if (emailInputRef.current) {
			emailInputRef.current.focus(); //Accède à l’élément DOM et lui applique la méthode focus().
			console.log(emailInputRef.current);
		}
	}, []); //Le tableau vide [] indique que l’effet ne dépend d’aucune variable externe. Il s’exécute une seule fois au montage du composant.

	// UseEffect qui surveille la validité du formulaire pour l'activation du bouton submit
	useEffect(() => {
		const formIsValid =
			formData.email.trim() !== "" &&
			formData.password.trim() !== "" &&
			!errorEmail &&
			!errorPassword;

		setIsValid(formIsValid);
	}, [formData, errorEmail, errorPassword]);

	//...prev: opérateur de décomposition(spread operator)
	//...prev permet de conserver les autres champs du formulaire inchangés
	//[name]: value remplace uniquement la propriété ciblée (ex : email).
	// ...prev = copie de l’état précédent.
	// Utile pour mettre à jour partiellement un objet dans useState.
	// Évite d’écraser les autres propriétés.

	const handleChangeEmail = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (value.trim() === "") {
			setEmailError('⚠️ Le champ "Email" ne peut pas etre vide');
		} else if (!emailRegex.test(value.trim())) {
			setEmailError("⚠️ Le format de l'email est invalide.");
		} else {
			setEmailError("");
		}
	};

	const handleChangePassword = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		const passwordRegex =
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,}$/;
		if (value.trim() === "") {
			setPasswordError(
				'⚠️ Le champ "Mot de passe" ne peut pas etre vide'
			);
		} else if (value.length < 12) {
			setPasswordError(
				'⚠️ Le champ "Mot de passe" doit etre supérieur ou égale à 12'
			);
		} else if (!passwordRegex.test(value.trim())) {
			setPasswordError("⚠️ Le mot de passe est invalide.");
		} else {
			setPasswordError("");
		}
	};

	const handleSubmit = (e) => {
		// Bloque le rechargement
		e.preventDefault();

		let isValid = true;

		//Vérification Email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (formData.email.trim() === "") {
			setEmailError('⚠️ Le champ "Email" ne peut pas être vide');
			isValid = false;
		} else if (!emailRegex.test(formData.email.trim())) {
			setEmailError("⚠️ Le format de l'email est invalide");
			isValid = false;
		} else {
			setEmailError("");
		}

		// Vérification mot de passe
		const passwordRegex =
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,}$/;
		if (formData.password.trim() === "") {
			setPasswordError(
				'⚠️ Le champ "Mot de passe" ne peut pas être vide'
			);
			isValid = false;
		} else if (formData.password.length < 12) {
			setPasswordError(
				'⚠️ Le champ "Mot de passe" doit etre supérieur ou égale à 12'
			);
			isValid = false;
		} else if (!passwordRegex.test(formData.password.trim())) {
			setPasswordError("⚠️ Le mot de passe est invalide");
			isValid = false;
		} else {
			setPasswordError("");
		}

		if (!isValid) {
			// Arrête tout ici si il y a une erreur
			console.log("❌ Le formulaire contient des erreurs. Envoi bloqué.");
			return;
		}

		// Si tout est bon :
		console.log("✅ Données envoyées :", formData);
	};

	return (
		<>
			<Header />
			<div className="main-content">
				<MenuLateral1 />
				<main>
					<div className="content-section">
						<h2>Page de connexion</h2>
						<p>
							Veuillez remplir les champs afin de vous
							authentifier
						</p>
						<form className="form" onSubmit={handleSubmit}>
							<label className="form-label">Adresse mail:</label>
							<br />
							<input
								ref={emailInputRef}
								className="form-control"
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChangeEmail}
								placeholder="Veuillez entrer votre adresse mail"
							/>
							{errorEmail && (
								<p
									className="error-message"
									style={{ color: "red" }}
								>
									{errorEmail}
								</p>
							)}
							<br />
							<br />
							<label className="form-label">Mot de passe:</label>
							<br />
							<input
								className="form-control"
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChangePassword}
								placeholder="Veuillez entrer votre mot de passe"
							/>
							{errorPassword && (
								<p
									className="error-message"
									style={{ color: "red" }}
								>
									{errorPassword}
								</p>
							)}
							<br />
							<br />
							<button type="submit" disabled={!isValid}>
								{isValid ? "S'inscrire" : "Champs invalides"}
							</button>
						</form>
					</div>
				</main>
				<MenuLateral2 />
			</div>
			<Footer />
		</>
	);
}

export default Authentification;