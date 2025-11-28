import Footer from './Composants/Footer';
import Header from './Composants/Header';
import MenuLateral1 from './Composants/MenuLateral1';
import MenuLateral2 from './Composants/MenuLateral2';
import './Style/Style.css'
import { useState , useEffect , useRef } from 'react';

function Inscription () {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPw: "",
	});
	const [erreur, setErreur] = useState("");
	const [passworderreur, setPasswordError] = useState("");
	const [confirmPwerreur, setconfirmPwErreur] = useState("");
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
			formData.confirmPw.trim() !== "" &&
			!erreur &&
			!passworderreur &&
			!confirmPwerreur;

		setIsValid(formIsValid);
	}, [formData, erreur, passworderreur, confirmPwerreur]);

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
			formData.confirmPw &&
			formData.password !== formData.confirmPw //Si les deux champs sont remplis et ne correspondent pas
		) {
			setErreur("⚠️ Les mots de passe ne correspondent pas"); //Met à jour le message d’erreur
		} else {
			setErreur(""); //Réinitialise le message d’erreur si les mots de passe correspondent
		}
	}, [formData.password, formData.confirmPw]); //Dépendance aux changements de motdepasse et confirmMotdepasse

	// Mise à jour du champ name + suppression de l'erreur si rempli
	const handleEmailChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (value.trim() === "") {
			setErreur('⚠️ Le champ "Email" ne peut pas etre vide');
		} else if (!emailRegex.test(value.trim())) {
			setErreur("⚠️ Le format de l'email est invalide.");
		} else {
			setErreur("");
		}
	};

	const handlePasswordChange = (e) => {
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
			setPasswordError("⚠️ Le mot de passe est invalide");
		} else {
			setPasswordError("");
		}
	};

	const handleconfirmPwChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		const confirmPwRegex =
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,}$/;
		if (value.trim() === "") {
			setconfirmPwErreur(
				'⚠️ Le champ "Confirmation de mot de passe" ne peut pas etre vide'
			);
		} else if (value.length < 12) {
			setconfirmPwErreur(
				'⚠️ Le champ "Confirmation de mot de passe" doit etre supérieur ou égale à 12'
			);
		} else if (!confirmPwRegex.test(value.trim())) {
			setconfirmPwErreur("⚠️ Le mot de passe est invalide");
		} else {
			setconfirmPwErreur("");
		}
	};

	const handleSubmit = (e) => {
		// Bloque le rechargement
		e.preventDefault();

		let isValid = true;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const passwordRegex =
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,}$/;

		// Email
		if (formData.email.trim() === "") {
			setErreur('⚠️ Le champ "Email" ne peut pas être vide');
			isValid = false;
		} else if (!emailRegex.test(formData.email.trim())) {
			setErreur("⚠️ Le format de l'email est invalide");
			isValid = false;
		} else {
			setErreur("");
		}

		// Mot de passe
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
		// Confirmation
		if (formData.confirmPw.trim() === "") {
			setconfirmPwErreur(
				'⚠️ Le champ "Confirmation de mot de passe" ne peut pas être vide'
			);
			isValid = false;
		} else if (formData.confirmPw.length < 12) {
			setconfirmPwErreur(
				'⚠️ Le champ "Confirmation de mot de passe" doit etre supérieur ou égale à 12'
			);
			isValid = false;
		} else if (formData.password !== formData.confirmPw) {
			setconfirmPwErreur("⚠️ Les mots de passe ne correspondent pas");
			isValid = false;
		} else {
			setconfirmPwErreur("");
		}

		if (!isValid) {
			// Arrête tout ici si il y a une erreur
			console.log("❌ Le formulaire contient des erreurs. Envoi bloqué");
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
						<h2>Page d'inscription</h2>
						<p>
							Veuillez remplir le champs afin de compléter votre
							inscription
						</p>
						<form className="form" onSubmit={handleSubmit}>
							<label className="form-label">Adresse mail:</label>
							<br />
							<input
								ref={emailInputRef}
								onChange={handleEmailChange}
								className="form-control"
								type="email"
								name="email"
								value={formData.email}
								placeholder="Veuillez entrer votre adresse mail"
							/>
							{erreur && (
								<p
									className="error-message"
									style={{ color: "red" }}
								>
									{erreur}
								</p>
							)}
							{console.log(formData.email)}
							<br />
							<br />
							<label className="form-label">Mot de passe:</label>
							<br />
							<input
								onChange={handlePasswordChange}
								className="form-control"
								type="password"
								name="password"
								value={formData.password}
								placeholder="Veuillez entrer votre mot de passe"
							/>
							{passworderreur && (
								<p
									className="error-message"
									style={{ color: "red" }}
								>
									{passworderreur}
								</p>
							)}
							{console.log(formData.password)}
							<br />
							<br />
							<label className="form-label">
								Confirmation du mot de passe:
							</label>
							<br />
							<input
								onChange={handleconfirmPwChange}
								className="form-control"
								type="password"
								name="confirmPw"
								value={formData.confirmPw}
								placeholder="Veuillez entrer votre mot de passe"
							/>
							{confirmPwerreur && (
								<p
									className="error-message"
									style={{ color: "red" }}
								>
									{confirmPwerreur}
								</p>
							)}
							{console.log(formData.confirmPw)}
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

export default Inscription;