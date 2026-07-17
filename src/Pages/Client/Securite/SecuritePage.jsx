import React, { useContext, useState, useEffect } from "react";
import "../../../Styles/Style.css";
import { UserContext } from "../../../Context/UserContext.js";
import Header from "../../../Composants/Header.jsx";
import Footer from "../../../Composants/Footer.jsx";
import MenuLateralClient from "../../../Composants/Menu/MenuLateralClient.jsx";
import MenuLateralAdmin from "../../../Composants/Menu/MenuLateralAdmin.jsx";
import MenuLateral2 from "../../../Composants/Menu/MenuLateral2.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const SecuritePage = () => {
	const { user, accessToken, loading } = useContext(UserContext);

	// États du formulaire
	const [formData, setFormData] = useState({
		ancienPassword: "",
		nouveauPassword: "",
		confirmNouveauPassword: "",
	});

	const [message, setMessage] = useState("");
	const [erreur, setErreur] = useState("");
	const [saving, setSaving] = useState(false);
    const [isValid, setIsValid] = useState(false);

	// Critères du nouveau mot de passe (même règles que l'inscription)
	const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{12,}$/;

	// ===== GESTION DES CHANGEMENTS =====
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Réinitialiser les messages à chaque saisie
		setMessage("");
		setErreur("");
	};

    useEffect(() => {
		const criteresRemplis =
			formData.ancienPassword.trim() !== "" &&
			/[A-Z]/.test(formData.nouveauPassword) &&
			/[a-z]/.test(formData.nouveauPassword) &&
			/[0-9]/.test(formData.nouveauPassword) &&
			/[!@#$%^&*]/.test(formData.nouveauPassword) &&
			formData.nouveauPassword.length >= 12 &&
			formData.nouveauPassword === formData.confirmNouveauPassword;

		setIsValid(criteresRemplis);
	}, [formData]);

	// ===== SOUMISSION DU FORMULAIRE =====
	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setErreur("");

		// Validation côté client
		if (!formData.ancienPassword) {
			setErreur("⚠️ Veuillez saisir votre mot de passe actuel.");
			return;
		}

		if (formData.nouveauPassword.length < 12) {
			setErreur("⚠️ Le nouveau mot de passe doit contenir au moins 12 caractères.");
			return;
		}

		if (!passwordRegex.test(formData.nouveauPassword)) {
			setErreur(
				"⚠️ Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (!@#$%^&*).",
			);
			return;
		}

		if (formData.nouveauPassword !== formData.confirmNouveauPassword) {
			setErreur("⚠️ Les nouveaux mots de passe ne correspondent pas.");
			return;
		}

		if (formData.ancienPassword === formData.nouveauPassword) {
			setErreur("⚠️ Le nouveau mot de passe doit être différent de l'ancien.");
			return;
		}

		setSaving(true);

		try {
			const response = await fetch(`${API_BASE_URL}/users/${user.id_user}/password`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					ancienPassword: formData.ancienPassword,
					nouveauPassword: formData.nouveauPassword,
				}),
			});

			const result = await response.json();

			if (response.ok) {
				setMessage("✅ Mot de passe modifié avec succès.");
				// Réinitialiser le formulaire après succès
				setFormData({
					ancienPassword: "",
					nouveauPassword: "",
					confirmNouveauPassword: "",
				});
			} else {
				setErreur(`❌ ${result.message}`);
			}
		} catch (error) {
			setErreur("❌ Une erreur est survenue.");
		} finally {
			setSaving(false);
		}
	};

	// ===== GARDES =====
	if (!user) {
		return (
			<div className="loading-container">
				<p className="error-message" style={{ fontSize: "35px" }}>
					⛔ Veuillez vous connecter pour accéder à cette page.
				</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner" />
				<p className="p-loading"> Chargement...</p>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>Tech City - Sécurité</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<h1>Sécurité</h1>
					<p style={{ color: "gray", textAlign: "center", marginBottom: "20px" }}>Modifiez votre mot de passe ci-dessous.</p>

					{message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
					{erreur && <p style={{ color: "red", textAlign: "center" }}>{erreur}</p>}

					<form className="form" onSubmit={handleSubmit}>
						{/* Mot de passe actuel */}
						<label className="form-label" htmlFor="ancienPassword">
							Mot de passe actuel :
						</label>
						<input
							id="ancienPassword"
							name="ancienPassword"
							type="password"
							className="form-control"
							value={formData.ancienPassword}
							onChange={handleChange}
							placeholder="Votre mot de passe actuel"
							autoComplete="current-password"
						/>

						{/* Nouveau mot de passe */}
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

						{/* Confirmation nouveau mot de passe */}
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

						{/* Critères du mot de passe */}
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

						<button type="submit" className={`btn ${!isValid ? "btn-invalid" : ""}`} disabled={!isValid || saving}>
							{saving ? "Modification en cours..." : isValid ? "Modifier le mot de passe" : "Critères non remplis"}
						</button>
					</form>
				</div>

				{/* Menu latéral droit */}
				{user?.role === "admin" ? <MenuLateralAdmin /> : <MenuLateral2 />}
			</main>
			<Footer />
		</>
	);
};

export default SecuritePage;
