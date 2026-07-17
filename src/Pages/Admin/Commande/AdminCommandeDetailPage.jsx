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

const AdminCommandeDetailPage = () => {
	const { accessToken } = useContext(UserContext);
	const { reference } = useParams();
	const navigate = useNavigate();

	const [commande, setCommande] = useState(null);
	const [chargement, setChargement] = useState(false);
	const [erreur, setErreur] = useState("");

	useEffect(() => {
		const charger = async () => {
			setChargement(true);
			try {
				const response = await fetch(`${API_BASE_URL}/commandes/reference/${reference}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				if (!response.ok) throw new Error();
				const lignes = await response.json();

				// Reconstituer la commande depuis les lignes
				setCommande({
					reference: lignes[0].reference,
					dateCommande: lignes[0].dateCommande,
					status: lignes[0].status,
					montant: lignes[0].montant,
					emailClient: lignes[0].utilisateur?.email || "—",
					adresseLivraison_rue: lignes[0].adresseLivraison_rue,
					adresseLivraison_ville: lignes[0].adresseLivraison_ville,
					adresseLivraison_cp: lignes[0].adresseLivraison_cp,
					adresseLivraison_pays: lignes[0].adresseLivraison_pays,
					adresseFacturation_rue: lignes[0].adresseFacturation_rue,
					adresseFacturation_ville: lignes[0].adresseFacturation_ville,
					adresseFacturation_cp: lignes[0].adresseFacturation_cp,
					adresseFacturation_pays: lignes[0].adresseFacturation_pays,
					lignes: lignes.map((l) => ({
						id_commande: l.id_commande,
						quantite: l.quantite,
						prix_unitaire: l.prix_unitaire,
						article: l.article,
					})),
				});
			} catch {
				setErreur("❌ Commande introuvable.");
			} finally {
				setChargement(false);
			}
		};
		charger();
	}, [reference]);

	const getBadgeStatut = (status) => {
		const config = {
			en_attente: { bg: "#f39c12", label: "En attente" },
			confirmee: { bg: "#3498db", label: "Confirmée" },
			expediee: { bg: "#9b59b6", label: "Expédiée" },
			livree: { bg: "#27ae60", label: "Livrée" },
			annulee: { bg: "#e74c3c", label: "Annulée" },
		};
		const c = config[status] || { bg: "#888", label: status };
		return (
			<span
				style={{
					backgroundColor: c.bg,
					color: "white",
					padding: "3px 8px",
					borderRadius: "12px",
					fontSize: "0.8rem",
					fontWeight: "bold",
				}}
			>
				{c.label}
			</span>
		);
	};

	return (
		<>
			<Helmet>
				<title>Tech City - Détail de commande</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<div className="admin-header">
						<h1>Détail de la commande</h1>
						<div style={{ display: "flex", gap: "10px" }}>
							<button
								className="btn-action-modifier"
								style={{ padding: "8px 16px" }}
								onClick={() => navigate(`/admin/commandes/${reference}/modifier`)}
							>
								Modifier le statut
							</button>
							<button className="secondaryButton" style={{ padding: "8px 16px" }} onClick={() => navigate("/admin/commandes")}>
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
						commande && (
							<div style={{ marginTop: "20px" }}>
								{/* Infos générales */}
								<div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
									<table style={{ width: "100%", borderCollapse: "collapse" }}>
										<tbody>
											{[
												["Référence", commande.reference],
												["Date", new Date(commande.dateCommande).toLocaleDateString("fr-FR")],
												["Client", commande.emailClient],
												["Montant", `${parseFloat(commande.montant).toFixed(2)} €`],
											].map(([label, valeur]) => (
												<tr key={label} style={{ borderBottom: "1px solid #eee" }}>
													<td style={{ padding: "10px", fontWeight: "bold", color: "#555", width: "160px" }}>{label}</td>
													<td style={{ padding: "10px", color: "#2c3e50" }}>{valeur}</td>
												</tr>
											))}
											<tr style={{ borderBottom: "1px solid #eee" }}>
												<td style={{ padding: "10px", fontWeight: "bold", color: "#555" }}>Statut</td>
												<td style={{ padding: "10px" }}>{getBadgeStatut(commande.status)}</td>
											</tr>
										</tbody>
									</table>
								</div>

								{/* Adresses côte à côte */}
								<div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
									<div style={{ flex: 1, backgroundColor: "#fff", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
										<p style={{ fontWeight: "bold", marginBottom: "8px" }}>Adresse de livraison</p>
										<p>{commande.adresseLivraison_rue}</p>
										<p>
											{commande.adresseLivraison_cp} {commande.adresseLivraison_ville}
										</p>
										<p>{commande.adresseLivraison_pays}</p>
									</div>
									<div style={{ width: "1px", backgroundColor: "#ddd" }} />
									<div style={{ flex: 1, backgroundColor: "#fff", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
										<p style={{ fontWeight: "bold", marginBottom: "8px" }}>Adresse de facturation</p>
										<p>{commande.adresseFacturation_rue}</p>
										<p>
											{commande.adresseFacturation_cp} {commande.adresseFacturation_ville}
										</p>
										<p>{commande.adresseFacturation_pays}</p>
									</div>
								</div>

								{/* Articles */}
								<div style={{ overflowX: "auto" }}>
									<table className="admin-table">
										<thead>
											<tr>
												<th>Article</th>
												<th>Quantité</th>
												<th>Prix unitaire</th>
												<th>Sous-total</th>
											</tr>
										</thead>
										<tbody>
											{commande.lignes.map((ligne, index) => (
												<tr key={index}>
													<td>{ligne.article?.titre || "Article supprimé"}</td>
													<td>{ligne.quantite}</td>
													<td>{parseFloat(ligne.prix_unitaire).toFixed(2)} €</td>
													<td>{(ligne.quantite * parseFloat(ligne.prix_unitaire)).toFixed(2)} €</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Total */}
								<div style={{ textAlign: "right", marginTop: "16px", fontSize: "1.1rem", fontWeight: "bold" }}>
									Total : {parseFloat(commande.montant).toFixed(2)} €
								</div>
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

export default AdminCommandeDetailPage;
