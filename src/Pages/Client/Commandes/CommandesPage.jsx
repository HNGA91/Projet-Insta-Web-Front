import React, { useContext, useEffect, useState } from "react";
import "../../../Styles/Style.css";
import { UserContext } from "../../../Context/UserContext.js";
import Header from "../../../Composants/Header.jsx";
import Footer from "../../../Composants/Footer.jsx";
import MenuLateralClient from "../../../Composants/Menu/MenuLateralClient.jsx";
import MenuLateralAdmin from "../../../Composants/Menu/MenuLateralAdmin.jsx";
import MenuLateral2 from "../../../Composants/Menu/MenuLateral2.jsx";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const CommandesPage = () => {
	const { user, accessToken, loading } = useContext(UserContext);

	// Liste des commandes
	const [commandes, setCommandes] = useState([]);
	const [chargement, setChargement] = useState(false);
	const [erreur, setErreur] = useState("");

	// Commande sélectionnée pour voir les détails
	const [commandeSelectionnee, setCommandeSelectionnee] = useState(null);

	// ===== CHARGEMENT DES COMMANDES =====
	const chargerCommandes = async () => {
		if (!user) return;
		setChargement(true);
		setErreur("");

		try {
			const response = await fetch(`${API_BASE_URL}/commandes/user/${user.id_user}`, { headers: { Authorization: `Bearer ${accessToken}` } });

			if (!response.ok) throw new Error("Impossible de charger les commandes");

			const data = await response.json();

			// Regrouper les lignes par référence de commande
			// Une commande = plusieurs lignes avec la même référence
			const commandesGroupees = data.reduce((acc, ligne) => {
				const ref = ligne.reference;
				if (!acc[ref]) {
					acc[ref] = {
						reference: ref,
						dateCommande: ligne.dateCommande,
						status: ligne.status,
						montant: ligne.montant,
						// Adresse de livraison
						adresseLivraison_rue: ligne.adresseLivraison_rue,
						adresseLivraison_ville: ligne.adresseLivraison_ville,
						adresseLivraison_cp: ligne.adresseLivraison_cp,
						adresseLivraison_pays: ligne.adresseLivraison_pays,
						// Adresse de facturation — manquait ici
						adresseFacturation_rue: ligne.adresseFacturation_rue,
						adresseFacturation_ville: ligne.adresseFacturation_ville,
						adresseFacturation_cp: ligne.adresseFacturation_cp,
						adresseFacturation_pays: ligne.adresseFacturation_pays,
						lignes: [],
					};
				}

				// Ajouter la ligne à la commande correspondante
				acc[ref].lignes.push({
					id_commande: ligne.id_commande,
					quantite: ligne.quantite,
					prix_unitaire: ligne.prix_unitaire,
					article: ligne.article,
				});
				return acc;
			}, {});

			// Convertir l'objet en tableau et trier par date décroissante
			setCommandes(Object.values(commandesGroupees));
		} catch (err) {
			setErreur("❌ Impossible de charger vos commandes.");
		} finally {
			setChargement(false);
		}
	};

	useEffect(() => {
		chargerCommandes();
	}, [user]);

	// ===== BADGE DE STATUT =====
	const getBadgeStatut = (status) => {
		const styles = {
			en_attente: { backgroundColor: "#f39c12", color: "white" },
			confirmee: { backgroundColor: "#3498db", color: "white" },
			expediee: { backgroundColor: "#9b59b6", color: "white" },
			livree: { backgroundColor: "#27ae60", color: "white" },
			annulee: { backgroundColor: "#e74c3c", color: "white" },
		};
		const labels = {
			en_attente: "En attente",
			confirmee: "Confirmée",
			expediee: "Expédiée",
			livree: "Livrée",
			annulee: "Annulée",
		};
		return (
			<span
				style={{
					...styles[status],
					padding: "4px 10px",
					borderRadius: "12px",
					fontSize: "0.8rem",
					fontWeight: "bold",
				}}
			>
				{labels[status] || status}
			</span>
		);
	};

	if (!user) {
		return (
			<div className="loading-container">
				<p className="error-message" style={{ fontSize: "35px" }}>
					⛔ Veuillez vous connecter pour accéder à vos commandes.
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
				<title>Tech City - Mes commandes</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<h1>Mes commandes</h1>

					{erreur && <p style={{ color: "red", textAlign: "center" }}>{erreur}</p>}

					{chargement ? (
						<div className="loading-container">
							<div className="spinner" />
							<p className="p-loading"> Chargement des commandes...</p>
						</div>
					) : commandes.length === 0 ? (
						<p style={{ textAlign: "center", color: "gray", marginTop: "30px" }}>Vous n'avez pas encore passé de commande.</p>
					) : commandeSelectionnee ? (
						// ===== VUE DÉTAIL D'UNE COMMANDE =====
						<div style={{ marginTop: "20px" }}>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
								<h3>Détail de la commande</h3>
								<button className="secondaryButton" style={{ padding: "8px 16px" }} onClick={() => setCommandeSelectionnee(null)}>
									← Retour à mes commandes
								</button>
							</div>

							{/* Infos générales */}
							<div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
								<table style={{ width: "100%", borderCollapse: "collapse" }}>
									<tbody>
										{[
											["Référence", commandeSelectionnee.reference],
											["Date", new Date(commandeSelectionnee.dateCommande).toLocaleDateString("fr-FR")],
											["Montant", `${parseFloat(commandeSelectionnee.montant).toFixed(2)} €`],
										].map(([label, valeur]) => (
											<tr key={label} style={{ borderBottom: "1px solid #eee" }}>
												<td style={{ padding: "10px", fontWeight: "bold", color: "#555", width: "160px" }}>{label}</td>
												<td style={{ padding: "10px", color: "#2c3e50" }}>{valeur}</td>
											</tr>
										))}
										<tr style={{ borderBottom: "1px solid #eee" }}>
											<td style={{ padding: "10px", fontWeight: "bold", color: "#555" }}>Statut</td>
											<td style={{ padding: "10px" }}>{getBadgeStatut(commandeSelectionnee.status)}</td>
										</tr>
									</tbody>
								</table>
							</div>

							{/* Adresses côte à côte */}
							<div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
								<div style={{ flex: 1, backgroundColor: "#fff", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
									<p style={{ fontWeight: "bold", marginBottom: "8px" }}>Adresse de livraison</p>
									<p>{commandeSelectionnee.adresseLivraison_rue}</p>
									<p>
										{commandeSelectionnee.adresseLivraison_cp} {commandeSelectionnee.adresseLivraison_ville}
									</p>
									<p>{commandeSelectionnee.adresseLivraison_pays}</p>
								</div>
								<div style={{ width: "1px", backgroundColor: "#ddd" }} />
								<div style={{ flex: 1, backgroundColor: "#fff", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
									<p style={{ fontWeight: "bold", marginBottom: "8px" }}>Adresse de facturation</p>
									<p>{commandeSelectionnee.adresseFacturation_rue}</p>
									<p>
										{commandeSelectionnee.adresseFacturation_cp} {commandeSelectionnee.adresseFacturation_ville}
									</p>
									<p>{commandeSelectionnee.adresseFacturation_pays}</p>
								</div>
							</div>

							{/* Articles */}
							<div style={{ overflowX: "auto", marginBottom: "20px" }}>
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
										{commandeSelectionnee.lignes.map((ligne, index) => (
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

							{/* Total + bouton facture */}
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
								<button
									className="primaryButton"
									style={{ padding: "10px 20px" }}
									onClick={async () => {
										try {
											const response = await fetch(
												`${API_BASE_URL}/commandes/reference/${commandeSelectionnee.reference}/facture`,
												{ headers: { Authorization: `Bearer ${accessToken}` } },
											);
											if (!response.ok) throw new Error();
											const blob = await response.blob();
											const url = URL.createObjectURL(blob);
											const a = document.createElement("a");
											a.href = url;
											a.download = `facture-${commandeSelectionnee.reference}.pdf`;
											a.click();
											URL.revokeObjectURL(url);
										} catch {
											Swal.fire({
												title: "Erreur",
												text: "Impossible de télécharger la facture.",
												icon: "error",
												confirmButtonColor: "#e74c3c",
											});
										}
									}}
								>
									📄 Télécharger la facture
								</button>
								<p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
									Total : {parseFloat(commandeSelectionnee.montant).toFixed(2)} €
								</p>
							</div>
						</div>
					) : (
						// ===== LISTE DES COMMANDES =====
						<div className="articleWrapper">
							<div style={{ overflowX: "auto" }}>
								<table className="admin-table">
									<thead>
										<tr>
											<th>Référence</th>
											<th>Date</th>
											<th>Statut</th>
											<th>Articles</th>
											<th>Montant</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{commandes.map((commande) => (
											<tr key={commande.reference}>
												<td>{commande.reference}</td>
												<td>{new Date(commande.dateCommande).toLocaleDateString("fr-FR")}</td>
												<td>{getBadgeStatut(commande.status)}</td>
												<td>
													{commande.lignes.length} article{commande.lignes.length > 1 ? "s" : ""}
												</td>
												<td>{parseFloat(commande.montant).toFixed(2)} €</td>
												<td>
													<button className="btn-action-voir" onClick={() => setCommandeSelectionnee(commande)}>
														Voir
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>

				{/* Menu latéral droit */}
				{user?.role === "admin" ? <MenuLateralAdmin /> : <MenuLateral2 />}
			</main>
			<Footer />
		</>
	);
};

export default CommandesPage;
