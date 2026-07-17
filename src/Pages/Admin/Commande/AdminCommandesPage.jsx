import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../Styles/Style.css";
import { UserContext } from "../../../Context/UserContext.js";
import Header from "../../../Composants/Header.jsx";
import Footer from "../../../Composants/Footer.jsx";
import MenuLateralClient from "../../../Composants/Menu/MenuLateralClient.jsx";
import MenuLateralAdmin from "../../../Composants/Menu/MenuLateralAdmin.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const AdminCommandesPage = () => {
	const { accessToken } = useContext(UserContext);
	const navigate = useNavigate();

	const [commandes, setCommandes] = useState([]);
	const [recherche, setRecherche] = useState("");
	const [chargement, setChargement] = useState(false);
	const [erreur, setErreur] = useState("");

	const chargerCommandes = async () => {
		setChargement(true);
		setErreur("");
		try {
			const response = await fetch(`${API_BASE_URL}/commandes`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			if (!response.ok) throw new Error();
			const data = await response.json();

			// Regrouper les lignes par référence
			const groupees = data.reduce((acc, ligne) => {
				const ref = ligne.reference;
				if (!acc[ref]) {
					acc[ref] = {
						reference: ref,
						dateCommande: ligne.dateCommande,
						status: ligne.status,
						montant: ligne.montant,
						emailClient: ligne.utilisateur?.email || "—",
						nbArticles: 0,
					};
				}
				acc[ref].nbArticles += 1;
				return acc;
			}, {});

			setCommandes(Object.values(groupees));
		} catch {
			setErreur("❌ Impossible de charger les commandes.");
		} finally {
			setChargement(false);
		}
	};

	useEffect(() => {
		chargerCommandes();
	}, []);

	// Badge statut — même logique que CommandesPage client
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

	const commandesFiltrees = commandes.filter((c) => c.reference.toLowerCase().includes(recherche.toLowerCase()));

	return (
		<>
			<Helmet>
				<title>Tech City - Gestion de commandes</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<div className="admin-header">
						<h1>Gestion des commandes</h1>
					</div>

					{erreur && <p style={{ color: "red", marginBottom: "10px" }}>{erreur}</p>}

					<input
						type="text"
						className="admin-search"
						placeholder="Rechercher une commande par référence..."
						value={recherche}
						onChange={(e) => setRecherche(e.target.value)}
					/>

					{chargement ? (
						<div className="loading-container">
							<div className="spinner" />
							<p className="p-loading"> Chargement...</p>
						</div>
					) : commandesFiltrees.length === 0 ? (
						<p style={{ color: "gray", textAlign: "center", marginTop: "30px" }}>Aucune commande trouvée.</p>
					) : (
						<div style={{ overflowX: "auto" }}>
							<table className="admin-table">
								<thead>
									<tr>
										<th>Référence</th>
										<th>Date</th>
										<th>Client (email)</th>
										<th>Articles</th>
										<th>Montant</th>
										<th>Statut</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{commandesFiltrees.map((commande) => (
										<tr key={commande.reference}>
											<td>{commande.reference}</td>
											<td>{new Date(commande.dateCommande).toLocaleDateString("fr-FR")}</td>
											<td>{commande.emailClient}</td>
											<td>{commande.nbArticles}</td>
											<td>{parseFloat(commande.montant).toFixed(2)} €</td>
											<td>{getBadgeStatut(commande.status)}</td>
											<td>
												<button
													className="btn-action-voir"
													onClick={() => navigate(`/admin/commandes/${commande.reference}`)}
												>
													Voir
												</button>
												<button
													className="btn-action-modifier"
													onClick={() => navigate(`/admin/commandes/${commande.reference}/modifier`)}
												>
													Modifier le statut
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				<MenuLateralAdmin />
			</main>
			<Footer />
		</>
	);
};

export default AdminCommandesPage;
