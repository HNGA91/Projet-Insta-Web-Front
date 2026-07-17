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

const AdminUtilisateurDetailPage = () => {
	const { accessToken } = useContext(UserContext);
	const { id } = useParams();
	const navigate = useNavigate();

	const [utilisateur, setUtilisateur] = useState(null);
	const [chargement, setChargement] = useState(false);
	const [erreur, setErreur] = useState("");

	useEffect(() => {
		const charger = async () => {
			setChargement(true);
			try {
				const response = await fetch(`${API_BASE_URL}/users/${id}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				if (!response.ok) throw new Error();
				setUtilisateur(await response.json());
			} catch {
				setErreur("❌ Utilisateur introuvable.");
			} finally {
				setChargement(false);
			}
		};
		charger();
	}, [id]);

	const getBadgeRole = (role) => (
		<span
			style={{
				backgroundColor: role === "admin" ? "#e4941c" : "#3498db",
				color: "white",
				padding: "3px 8px",
				borderRadius: "12px",
				fontSize: "0.8rem",
				fontWeight: "bold",
			}}
		>
			{role === "admin" ? "Admin" : "Client"}
		</span>
	);

	return (
		<>
			<Helmet>
				<title>Tech City - Détail de l'utilisateur</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<div className="admin-header">
						<h1>Détail de l'utilisateur</h1>
						<div style={{ display: "flex", gap: "10px" }}>
							<button
								className="btn-action-modifier"
								style={{ padding: "8px 16px" }}
								onClick={() => navigate(`/admin/utilisateurs/${id}/modifier`)}
							>
								Modifier le rôle
							</button>
							<button className="secondaryButton" style={{ padding: "8px 16px" }} onClick={() => navigate("/admin/utilisateurs")}>
								← Retour
							</button>
						</div>
					</div>

					{erreur && <p style={{ color: "red" }}>{erreur}</p>}

					{chargement ? (
						<div className="loading-container">
							<div className="spinner" />
							<p className="p-loading"> Chargement...</p>
						</div>
					) : (
						utilisateur && (
							<div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
								<table style={{ width: "100%", borderCollapse: "collapse" }}>
									<tbody>
										{[
											["ID", utilisateur.id_user],
											["Nom", utilisateur.nom],
											["Prénom", utilisateur.prenom],
											["Email", utilisateur.email],
											["Téléphone", utilisateur.tel || "—"],
											[
												"Inscription",
												utilisateur.dateInscription ? new Date(utilisateur.dateInscription).toLocaleDateString("fr-FR") : "—",
											],
											[
												"Dernière connexion",
												utilisateur.lastLoginAt ? new Date(utilisateur.lastLoginAt).toLocaleDateString("fr-FR") : "—",
											],
											["Connecté depuis", utilisateur.lastLoginFrom || "—"],
										].map(([label, valeur]) => (
											<tr key={label} style={{ borderBottom: "1px solid #eee" }}>
												<td style={{ padding: "10px", fontWeight: "bold", color: "#555", width: "200px" }}>{label}</td>
												<td style={{ padding: "10px", color: "#2c3e50" }}>{valeur}</td>
											</tr>
										))}
										<tr style={{ borderBottom: "1px solid #eee" }}>
											<td style={{ padding: "10px", fontWeight: "bold", color: "#555" }}>Rôle</td>
											<td style={{ padding: "10px" }}>{getBadgeRole(utilisateur.role)}</td>
										</tr>
									</tbody>
								</table>
							</div>
						)
					)}
				</div>

				<MenuLateralAdmin />
			</main>
			<Footer />
		</>
	);
};

export default AdminUtilisateurDetailPage;
