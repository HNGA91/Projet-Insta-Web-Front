import React, { useContext, useState, useEffect } from "react";
import "../../Styles/Style.css";
import { UserContext } from "../../Context/UserContext.js";
import { useNavigate } from "react-router-dom";
import Header from "../../Composants/Header.jsx";
import Footer from "../../Composants/Footer.jsx";
import MenuLateralClient from "../../Composants/Menu/MenuLateralClient.jsx";
import MenuLateralAdmin from "../../Composants/Menu/MenuLateralAdmin.jsx";
import MenuLateral2 from "../../Composants/Menu/MenuLateral2.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const ProfilPage = () => {
	const { user, accessToken, loading } = useContext(UserContext);

	// Pour la navigation
	const navigate = useNavigate();

	// États du formulaire
	const [formData, setFormData] = useState({ nom: "", prenom: "", email: "", tel: "" });
	const [message, setMessage] = useState("");
	const [erreur, setErreur] = useState("");
	const [saving, setSaving] = useState(false);

	// Pré-remplir le formulaire avec les données actuelles de l'utilisateur
	useEffect(() => {
		if (user) {
			setFormData({
				nom: user.nom || "",
				prenom: user.prenom || "",
				email: user.email || "",
				tel: user.tel || "",
			});
		}
	}, [user]);

	// Utilisateur non connecté
	if (!user) {
		return (
			<div className="loading-container">
				<p className="error-message" style={{ fontSize: "35px", textAlign: "center", justifyContent: "center" }}>
					⛔ Veuillez vous connecter pour accéder à votre profil.
				</p>
			</div>
		);
	}

	// Affiche un écran de chargement en cas de chargements
	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner"></div>
				<p className="p-loading"> Chargement de votre profil...</p>
			</div>
		);
	}

	// Gestion des changements dans le formulaire
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Soumission du formulaire de modification
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setMessage("");
		setErreur("");

		try {
			const response = await fetch(`${API_BASE_URL}/users/${user.id_user}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (response.ok) {
				setMessage("✅ Informations mises à jour avec succès.");
			} else {
				setErreur(`❌ ${result.message}`);
			}
		} catch (error) {
			setErreur("❌ Une erreur est survenue.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Tech City - Mon compte</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<h1>Informations personnelles</h1>
					<p style={{ color: "gray", marginBottom: "20px" }}>Modifiez vos informations personnelles ci-dessous.</p>

					{message && <p style={{ color: "green" }}>{message}</p>}
					{erreur && <p style={{ color: "red" }}>{erreur}</p>}

					<form className="form" onSubmit={handleSubmit}>
						<label className="form-label" htmlFor="nom">
							Nom :
						</label>
						<br />
						<input
							id="nom"
							name="nom"
							type="text"
							className="form-control"
							value={formData.nom}
							onChange={handleChange}
							placeholder="Votre nom"
						/>
						<br />
						<br />

						<label className="form-label" htmlFor="prenom">
							Prénom :
						</label>
						<br />
						<input
							id="prenom"
							name="prenom"
							type="text"
							className="form-control"
							value={formData.prenom}
							onChange={handleChange}
							placeholder="Votre prénom"
						/>
						<br />
						<br />

						<label className="form-label" htmlFor="email">
							Email :
						</label>
						<br />
						<input
							id="email"
							name="email"
							type="email"
							className="form-control"
							value={formData.email}
							onChange={handleChange}
							placeholder="Votre email"
						/>
						<br />
						<br />

						<label className="form-label" htmlFor="tel">
							Téléphone :
						</label>
						<br />
						<input
							id="tel"
							name="tel"
							type="tel"
							className="form-control"
							value={formData.tel}
							onChange={handleChange}
							placeholder="Votre numéro de téléphone"
						/>
						<br />
						<br />

						<button type="submit" className="btn" disabled={saving}>
							{saving ? "Enregistrement..." : "Enregistrer les modifications"}
						</button>
					</form>
				</div>
				{user?.role === "admin" ? <MenuLateralAdmin /> : <MenuLateral2 />}
			</main>
			<Footer />
		</>
	);
};

export default ProfilPage;
