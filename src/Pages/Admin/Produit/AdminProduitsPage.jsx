import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../Styles/Style.css";
import { UserContext } from "../../../Context/UserContext.js";
import Header from "../../../Composants/Header.jsx";
import Footer from "../../../Composants/Footer.jsx";
import MenuLateralClient from "../../../Composants/Menu/MenuLateralClient.jsx";
import MenuLateralAdmin from "../../../Composants/Menu/MenuLateralAdmin.jsx";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;
// URL du back sans /api — pour les images statiques
const SERVER_URL   = import.meta.env.VITE_SERVER_URL.replace("/api", "");

const AdminProduitsPage = () => {
	const { accessToken } = useContext(UserContext);
	const navigate = useNavigate();

	const [produits, setProduits] = useState([]);
	const [recherche, setRecherche] = useState("");
	const [chargement, setChargement] = useState(false);
	const [erreur, setErreur] = useState("");
	const [message, setMessage] = useState("");

	const chargerProduits = async () => {
		setChargement(true);
		setErreur("");
		try {
			const response = await fetch(`${API_BASE_URL}/produits`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			if (!response.ok) throw new Error();
			const data = await response.json();
			setProduits(data);
		} catch {
			setErreur("❌ Impossible de charger les produits.");
		} finally {
			setChargement(false);
		}
	};

	useEffect(() => {
		chargerProduits();
	}, []);

	const supprimerProduit = async (id) => {
		const result = await Swal.fire({
			title: "Supprimer ce produit ?",
			text: "Cette action est irréversible.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#e74c3c",
			cancelButtonColor: "#aaa",
			confirmButtonText: "Oui, supprimer",
			cancelButtonText: "Annuler",
		});
		if (!result.isConfirmed) return;

		setMessage("");
		setErreur("");
		try {
			const response = await fetch(`${API_BASE_URL}/produits/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const result2 = await response.json();
			if (response.ok) {
				Swal.fire({
					title: "Supprimé !",
					text: "Le produit a été supprimé.",
					icon: "success",
					confirmButtonColor: "#09107e",
					timer: 2000,
					showConfirmButton: false,
				});
				chargerProduits();
			} else {
				Swal.fire({ title: "Erreur", text: result2.message, icon: "error", confirmButtonColor: "#e74c3c" });
			}
		} catch {
			Swal.fire({ title: "Erreur", text: "Une erreur est survenue.", icon: "error", confirmButtonColor: "#e74c3c" });
		}
	};

	const produitsFiltres = produits.filter((p) => p.titre.toLowerCase().includes(recherche.toLowerCase()));

	return (
		<>
			<Helmet>
				<title>Tech City - Gestion des produits</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<div className="admin-header">
						<h1>Gestion des produits</h1>
						<button className="primaryButton" style={{ padding: "10px 20px" }} onClick={() => navigate("/admin/produits/ajouter")}>
							Ajouter un produit
						</button>
					</div>

					{message && <p style={{ color: "green", marginBottom: "10px" }}>{message}</p>}
					{erreur && <p style={{ color: "red", marginBottom: "10px" }}>{erreur}</p>}

					<input
						type="text"
						className="admin-search"
						placeholder="Rechercher un produit par titre..."
						value={recherche}
						onChange={(e) => setRecherche(e.target.value)}
					/>

					{chargement ? (
						<div className="loading-container">
							<div className="spinner" />
							<p className="p-loading"> Chargement...</p>
						</div>
					) : produitsFiltres.length === 0 ? (
						<p style={{ color: "gray", textAlign: "center", marginTop: "30px" }}>Aucun produit trouvé.</p>
					) : (
						<div style={{ overflowX: "auto" }}>
							<table className="admin-table">
								<thead>
									<tr>
										<th>ID</th>
										<th>Titre</th>
										<th>Image</th>
										<th>image_alt</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{produitsFiltres.map((produit) => (
										<tr key={produit.id_produit}>
											<td>{produit.id_produit}</td>
											<td>{produit.titre}</td>
											<td>
												{produit.image ? (
													<img
														src={`${SERVER_URL}/Images/Produits/${produit.image}`}
														alt={produit.image_alt || produit.titre}
														style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
														onError={(e) => {
															e.target.style.display = "none";
														}}
													/>
												) : (
													"—"
												)}
											</td>
											<td>{produit.image_alt}</td>
											<td>
												<button className="btn-action-voir" onClick={() => navigate(`/admin/produits/${produit.id_produit}`)}>
													Voir
												</button>
												<button
													className="btn-action-modifier"
													onClick={() => navigate(`/admin/produits/${produit.id_produit}/modifier`)}
												>
													Modifier
												</button>
												<button className="btn-action-supprimer" onClick={() => supprimerProduit(produit.id_produit)}>
													Supprimer
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

export default AdminProduitsPage;
