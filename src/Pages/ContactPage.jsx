import React, { useState } from "react";
import { useContext } from "react";
import "../Styles/Style.css";
import { UserContext } from "../Context/UserContext.js";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const ContactPage = () => {
	const { user } = useContext(UserContext);

	const [formData, setFormData] = useState({
		nom: user ? `${user.prenom} ${user.nom}` : "",
		email: user?.email || "",
		message: "",
	});

	const [message, setMessage] = useState("");
	const [erreur, setErreur] = useState("");
	const [loading, setLoading] = useState(false);

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setMessage("");
		setErreur("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setErreur("");

		// Validation côté client
		if (!formData.nom.trim()) {
			setErreur("⚠️ Veuillez saisir votre nom.");
			return;
		}

		if (!emailRegex.test(formData.email.trim())) {
			setErreur("⚠️ Le format de l'email est invalide.");
			return;
		}

		if (formData.message.trim().length < 10) {
			setErreur("⚠️ Le message doit contenir au moins 10 caractères.");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${API_BASE_URL}/contact`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (response.ok) {
				setMessage("✅ Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.");
				// Réinitialiser uniquement le message, pas le nom et l'email
				setFormData((prev) => ({ ...prev, message: "" }));
			} else {
				setErreur(`❌ ${result.message}`);
			}
		} catch {
			setErreur("❌ Une erreur est survenue. Veuillez réessayer.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Tech City — Contact</title>
				<meta name="description" content="Contactez l'équipe Tech City pour toute question sur nos produits ou votre commande." />
				<meta property="og:title" content="Tech City — Contact" />
				<meta property="og:description" content="Contactez l'équipe Tech City pour toute question sur nos produits ou votre commande." />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://techcity.com/contact" />
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateral1 />

				<div className="content-section">
					<h1>Nous contacter</h1>
					<p style={{ color: "gray", textAlign: "center", marginBottom: "20px" }}>
						Une question ? Un problème ? Envoyez-nous un message et nous vous répondrons rapidement.
					</p>

					{message && <p style={{ color: "green", textAlign: "center", marginBottom: "20px" }}>{message}</p>}
					{erreur && <p style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>{erreur}</p>}

					<form className="form" onSubmit={handleSubmit}>
						<label className="form-label" htmlFor="nom">
							Nom :
						</label>
						<input
							id="nom"
							name="nom"
							type="text"
							className="form-control"
							value={formData.nom}
							onChange={handleChange}
							placeholder="Votre nom"
							// Pré-rempli si connecté mais modifiable
							readOnly={false}
						/>

						<label className="form-label" htmlFor="email">
							Email :
						</label>
						<input
							id="email"
							name="email"
							type="email"
							className="form-control"
							value={formData.email}
							onChange={handleChange}
							placeholder="Votre adresse email"
						/>

						<label className="form-label" htmlFor="message">
							Message :
						</label>
						<textarea
							id="message"
							name="message"
							className="form-control"
							value={formData.message}
							onChange={handleChange}
							placeholder="Votre message (minimum 10 caractères)"
							rows={6}
						/>

						{/* Compteur de caractères */}
						<p
							style={{
								textAlign: "right",
								fontSize: "0.8rem",
								color: formData.message.length < 10 ? "#e74c3c" : "#27ae60",
								marginTop: "-10px",
								marginBottom: "10px",
							}}
						>
							{formData.message.length} caractère{formData.message.length > 1 ? "s" : ""}
							{formData.message.length < 10 && ` (minimum 10)`}
						</p>

						<button type="submit" disabled={loading}>
							{loading ? "Envoi en cours..." : "Envoyer le message"}
						</button>
					</form>
				</div>

				<MenuLateral2 />
			</main>
			<Footer />
		</>
	);
};

export default ContactPage;
