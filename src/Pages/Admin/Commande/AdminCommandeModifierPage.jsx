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

const AdminCommandeModifierPage = () => {
	const { accessToken } = useContext(UserContext);
	const { reference } = useParams();
	const navigate = useNavigate();

	const [statusActuel, setStatusActuel] = useState("");
	const [nouveauStatus, setNouveauStatus] = useState("");
	const [chargement, setChargement] = useState(false);
	const [saving, setSaving] = useState(false);
	const [erreur, setErreur] = useState("");
	const [message, setMessage] = useState("");

	const statusValides = [
		{ value: "en_attente", label: "En attente" },
		{ value: "confirmee", label: "Confirmée" },
		{ value: "expediee", label: "Expédiée" },
		{ value: "livree", label: "Livrée" },
		{ value: "annulee", label: "Annulée" },
	];

	useEffect(() => {
		const charger = async () => {
			setChargement(true);
			try {
				const response = await fetch(`${API_BASE_URL}/commandes/reference/${reference}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				if (!response.ok) throw new Error();
				const lignes = await response.json();
				setStatusActuel(lignes[0].status);
				setNouveauStatus(lignes[0].status);
			} catch {
				setErreur("❌ Commande introuvable.");
			} finally {
				setChargement(false);
			}
		};
		charger();
	}, [reference]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErreur("");
		setMessage("");

		if (nouveauStatus === statusActuel) {
			setErreur("⚠️ Le statut est déjà celui-ci.");
			return;
		}

		setSaving(true);
		try {
			const response = await fetch(`${API_BASE_URL}/commandes/reference/${reference}/status`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({ status: nouveauStatus }),
			});
			const result = await response.json();
			if (response.ok) {
				setMessage("✅ Statut mis à jour avec succès.");
				setStatusActuel(nouveauStatus);
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
				<title>Tech City - Modifier une commande</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<h1 style={{ textAlign: "center", marginBottom: "20px" }}>Modifier le statut de la commande</h1>
					<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
						<button className="secondaryButton" style={{ padding: "8px 16px" }} onClick={() => navigate(`/admin/commandes/${reference}`)}>
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
								Référence : <strong>{reference}</strong>
							</p>

							<p style={{ marginBottom: "16px", color: "#555" }}>
								Statut actuel :&nbsp;
								<strong>{statusValides.find((s) => s.value === statusActuel)?.label || statusActuel}</strong>
							</p>

							<label className="form-label" htmlFor="status">
								Nouveau statut :
							</label>
							<select
								id="status"
								name="status"
								className="form-control"
								value={nouveauStatus}
								onChange={(e) => setNouveauStatus(e.target.value)}
							>
								{statusValides.map((s) => (
									<option key={s.value} value={s.value}>
										{s.label}
									</option>
								))}
							</select>

							<button type="submit" disabled={saving}>
								{saving ? "Enregistrement..." : "Enregistrer le statut"}
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

export default AdminCommandeModifierPage;
