import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Style.css";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const MotDePasseOubliePage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [erreur, setErreur] = useState("");
	const [loading, setLoading] = useState(false);

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setErreur("");

		// Validation côté client
		if (!email.trim()) {
			setErreur("⚠️ Veuillez saisir votre adresse email.");
			return;
		}

		if (!emailRegex.test(email.trim())) {
			setErreur("⚠️ Le format de l'email est invalide.");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${API_BASE_URL}/auth/mot-de-passe-oublie`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const result = await response.json();
			setMessage(result.message);
		} catch (error) {
			setErreur("❌ Une erreur est survenue. Veuillez réessayer.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Tech City — Mot de passe oublié</title>
				<meta name="description" content="Réinitialisez votre mot de passe Tech City en quelques étapes simples." />
			</Helmet>
			<Header />
			<main className="main-content" style={{ justifyContent: "center" }}>
				<MenuLateral1 />
				<div className="content-section">
					<h1>Mot de passe oublié</h1>
					<p style={{ color: "#2c3e50", textAlign: "center", marginBottom: "20px" }}>
						Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
					</p>

					{message && <p style={{ color: "green", textAlign: "center", marginBottom: "20px" }}>{message}</p>}
					{erreur && <p style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>{erreur}</p>}

					{/* On masque le formulaire après envoi réussi */}
					{!message && (
						<form className="form" onSubmit={handleSubmit}>
							<label className="form-label" htmlFor="email">
								Adresse email :
							</label>
							<br />
							<input
								id="email"
								type="email"
								name="email"
								className="form-control"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Votre adresse email"
								autoFocus
							/>

							<button type="submit" disabled={loading}>
								{loading ? "Envoi en cours..." : "Envoyer le lien"}
							</button>
							<br />
							<br />

							<div style={{ textAlign: "left", marginTop: "20px" }}>
								<button
									type="button"
									onClick={() => navigate("/login")}
									style={{ background: "none", border: "none", cursor: "pointer" }}
								>
									← Retour à la connexion
								</button>
							</div>
						</form>
					)}
				</div>
				<MenuLateral2 />
			</main>
			<Footer />
		</>
	);
};

export default MotDePasseOubliePage;
