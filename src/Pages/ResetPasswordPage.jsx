import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../Styles/Style.css";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const ResetPasswordPage = () => {
	const navigate = useNavigate();

	// Récupère le token depuis l'URL : /reset-password?token=abc123
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const [formData, setFormData] = useState({
		nouveauPassword: "",
		confirmNouveauPassword: "",
	});
	const [message, setMessage] = useState("");
	const [erreur, setErreur] = useState("");
	const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);

	const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{12,}$/;

    useEffect(() => {
		const criteresRemplis =
			/[A-Z]/.test(formData.nouveauPassword) &&
			/[a-z]/.test(formData.nouveauPassword) &&
			/[0-9]/.test(formData.nouveauPassword) &&
			/[!@#$%^&*]/.test(formData.nouveauPassword) &&
			formData.nouveauPassword.length >= 12 &&
			formData.nouveauPassword === formData.confirmNouveauPassword &&
			formData.confirmNouveauPassword.trim() !== "";

		setIsValid(criteresRemplis);
	}, [formData]);

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

		// Vérifications côté client
		if (!token) {
			setErreur("❌ Lien invalide. Veuillez refaire une demande de réinitialisation.");
			return;
		}

		if (!passwordRegex.test(formData.nouveauPassword)) {
			setErreur("⚠️ Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
			return;
		}

		if (formData.nouveauPassword !== formData.confirmNouveauPassword) {
			setErreur("⚠️ Les mots de passe ne correspondent pas.");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token: token,
					nouveauPassword: formData.nouveauPassword,
				}),
			});

			const result = await response.json();

			if (response.ok) {
				setMessage("✅ Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.");
				// Redirection vers la connexion après 3 secondes
				setTimeout(() => navigate("/login"), 3000);
			} else {
				setErreur(`❌ ${result.message}`);
			}
		} catch (error) {
			setErreur("❌ Une erreur est survenue. Veuillez réessayer.");
		} finally {
			setLoading(false);
		}
	};

	// Token absent dans l'URL
	if (!token) {
		return (
			<>
				<Header />
				<main className="main-content" style={{ justifyContent: "center" }}>
					<div className="content-section">
						<p style={{ color: "red", textAlign: "center", fontSize: "1.2rem" }}>
							❌ Lien invalide ou expiré. Veuillez refaire une demande de réinitialisation.
						</p>
						<div style={{ textAlign: "center", marginTop: "20px" }}>
							<button
								onClick={() => navigate("/mot-de-passe-oublie")}
								style={{ background: "none", border: "none", color: "#1c5be4", cursor: "pointer" }}
							>
								Refaire une demande
							</button>
						</div>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	return (
		<>
			<Header />
			<main className="main-content" style={{ justifyContent: "center" }}>
				<div className="content-section">
					<h1>Réinitialiser le mot de passe</h1>

					{message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
					{erreur && <p style={{ color: "red", textAlign: "center" }}>{erreur}</p>}

					{!message && (
						<form className="form" onSubmit={handleSubmit}>
							<label className="form-label" htmlFor="nouveauPassword">
								Nouveau mot de passe :
							</label>
							<input
								id="nouveauPassword"
								name="nouveauPassword"
								type="password"
								className="form-control"
								value={formData.nouveauPassword}
								onChange={handleChange}
								placeholder="Votre nouveau mot de passe"
								autoComplete="new-password"
							/>

							<label className="form-label" htmlFor="confirmNouveauPassword">
								Confirmer le nouveau mot de passe :
							</label>
							<input
								id="confirmNouveauPassword"
								name="confirmNouveauPassword"
								type="password"
								className="form-control"
								value={formData.confirmNouveauPassword}
								onChange={handleChange}
								placeholder="Confirmez votre nouveau mot de passe"
								autoComplete="new-password"
							/>

							{/* Indicateurs visuels des critères — identiques à SecuritePage */}
							<div
								style={{
									backgroundColor: "#f8f9fa",
									borderRadius: "6px",
									padding: "12px",
									marginBottom: "16px",
									fontSize: "0.85rem",
									color: "#666",
								}}
							>
								<p style={{ fontWeight: "bold", marginBottom: "6px" }}>Le mot de passe doit contenir :</p>
								<p style={{ color: /[A-Z]/.test(formData.nouveauPassword) ? "green" : "#e74c3c" }}>
									{/[A-Z]/.test(formData.nouveauPassword) ? "✅" : "❌"} Au moins une majuscule
								</p>
								<p style={{ color: /[a-z]/.test(formData.nouveauPassword) ? "green" : "#e74c3c" }}>
									{/[a-z]/.test(formData.nouveauPassword) ? "✅" : "❌"} Au moins une minuscule
								</p>
								<p style={{ color: /[0-9]/.test(formData.nouveauPassword) ? "green" : "#e74c3c" }}>
									{/[0-9]/.test(formData.nouveauPassword) ? "✅" : "❌"} Au moins un chiffre
								</p>
								<p style={{ color: /[!@#$%^&*]/.test(formData.nouveauPassword) ? "green" : "#e74c3c" }}>
									{/[!@#$%^&*]/.test(formData.nouveauPassword) ? "✅" : "❌"} Au moins un caractère spécial (!@#$%^&*)
								</p>
								<p style={{ color: formData.nouveauPassword.length >= 12 ? "green" : "#e74c3c" }}>
									{formData.nouveauPassword.length >= 12 ? "✅" : "❌"} Au moins 12 caractères
								</p>
							</div>

							<button type="submit" className={`btn ${!isValid ? "btn-invalid" : ""}`} disabled={!isValid || loading}>
								{loading ? "Réinitialisation en cours..." : isValid ? "Réinitialiser le mot de passe" : "Critères non remplis"}
							</button>
						</form>
					)}
				</div>
			</main>
			<Footer />
		</>
	);
};

export default ResetPasswordPage;
