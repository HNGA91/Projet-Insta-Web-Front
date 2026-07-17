import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../Styles/Style.css";
import { UserContext } from "../../../Context/UserContext.js";
import Header from "../../../Composants/Header.jsx";
import Footer from "../../../Composants/Footer.jsx";
import MenuLateralClient from "../../../Composants/Menu/MenuLateralClient.jsx";
import MenuLateralAdmin from "../../../Composants/Menu/MenuLateralAdmin.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const AdminUtilisateurModifierPage = () => {
	const { user, accessToken } = useContext(UserContext);
	const { id } = useParams();
	const navigate = useNavigate();

	const [nomUtilisateur, setNomUtilisateur] = useState("");
	const [roleActuel, setRoleActuel] = useState("");
	const [nouveauRole, setNouveauRole] = useState("");
	const [chargement, setChargement] = useState(false);
	const [saving, setSaving] = useState(false);
	const [erreur, setErreur] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		const charger = async () => {
			setChargement(true);
			try {
				const response = await fetch(`${API_BASE_URL}/users/${id}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				if (!response.ok) throw new Error();
				const data = await response.json();
				setNomUtilisateur(`${data.prenom} ${data.nom}`);
				setRoleActuel(data.role);
				setNouveauRole(data.role);
			} catch {
				setErreur("❌ Utilisateur introuvable.");
			} finally {
				setChargement(false);
			}
		};
		charger();
	}, [id]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErreur("");
		setMessage("");

		// Empêcher un admin de changer son propre rôle
		if (parseInt(id) === user.id_user) {
			setErreur("❌ Vous ne pouvez pas modifier votre propre rôle.");
			return;
		}

		if (nouveauRole === roleActuel) {
			setErreur("⚠️ Le rôle est déjà celui-ci.");
			return;
		}

		setSaving(true);
		try {
			const response = await fetch(`${API_BASE_URL}/users/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({ role: nouveauRole }),
			});
			const result = await response.json();
			if (response.ok) {
				setMessage("✅ Rôle mis à jour avec succès.");
				setRoleActuel(nouveauRole);
			} else {
				setErreur(`❌ ${result.message}`);
			}
		} catch {
			setErreur("❌ Une erreur est survenue.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Tech City - Modifier l'utilisateur</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<h1 style={{ textAlign: "center", marginBottom: "20px" }}>Modifier le rôle de l'utilisateur</h1>
					<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
						<button className="secondaryButton" style={{ padding: "8px 16px" }} onClick={() => navigate(`/admin/utilisateurs/${id}`)}>
							← Retour
						</button>
					</div>

					{erreur && <p style={{ color: "red", textAlign: "center" }}>{erreur}</p>}
					{message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}

					{chargement ? (
						<div className="loading-container">
							<div className="spinner" />
							<p className="p-loading"> Chargement...</p>
						</div>
					) : (
						<form className="form" onSubmit={handleSubmit}>
							<p style={{ marginBottom: "16px", color: "#555" }}>
								Utilisateur : <strong>{nomUtilisateur}</strong>
							</p>

							<p style={{ marginBottom: "16px", color: "#555" }}>
								Rôle actuel :&nbsp;
								<strong>{roleActuel === "admin" ? "Admin" : "Client"}</strong>
							</p>

							<label className="form-label" htmlFor="role">
								Nouveau rôle :
							</label>
							<select
								id="role"
								name="role"
								className="form-control"
								value={nouveauRole}
								onChange={(e) => setNouveauRole(e.target.value)}
							>
								<option value="client">Client</option>
								<option value="admin">Admin</option>
							</select>

							<button type="submit" disabled={saving}>
								{saving ? "Enregistrement..." : "Enregistrer le rôle"}
							</button>
						</form>
					)}
				</div>

				<MenuLateralAdmin />
			</main>
			<Footer />
		</>
	);
};

export default AdminUtilisateurModifierPage;
