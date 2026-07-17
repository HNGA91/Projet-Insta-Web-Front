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

const AdminArticlesPage = () => {
	const { user, accessToken } = useContext(UserContext);
	const navigate = useNavigate();

	const [articles, setArticles] = useState([]);
	const [recherche, setRecherche] = useState("");
	const [chargement, setChargement] = useState(false);
	const [erreur, setErreur] = useState("");
	const [message, setMessage] = useState("");

	// ===== CHARGEMENT DES ARTICLES =====
	const chargerArticles = async () => {
		setChargement(true);
		setErreur("");
		try {
			const response = await fetch(`${API_BASE_URL}/articles`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			if (!response.ok) throw new Error("Impossible de charger les articles");
			const data = await response.json();
			setArticles(data);
		} catch (err) {
			setErreur("❌ Impossible de charger les articles.");
		} finally {
			setChargement(false);
		}
	};

	useEffect(() => {
		chargerArticles();
	}, []);

	// ===== SUPPRESSION =====
	const supprimerArticle = async (id) => {
		const result = await Swal.fire({
			title: "Supprimer cet article ?",
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
			const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const result2 = await response.json();
			if (response.ok) {
				Swal.fire({
					title: "Supprimé !",
					text: "L'article a été supprimé.",
					icon: "success",
					confirmButtonColor: "#09107e",
					timer: 2000,
					showConfirmButton: false,
				});
				chargerArticles();
			} else {
				Swal.fire({ title: "Erreur", text: result2.message, icon: "error", confirmButtonColor: "#e74c3c" });
			}
		} catch {
			Swal.fire({ title: "Erreur", text: "Une erreur est survenue.", icon: "error", confirmButtonColor: "#e74c3c" });
		}
	};

	// ===== FILTRAGE LOCAL PAR TITRE =====
	const articlesFiltres = articles.filter((a) => a.titre.toLowerCase().includes(recherche.toLowerCase()));

	return (
		<>
			<Helmet>
				<title>Tech City - Gestion des articles</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					{/* En-tête */}
					<div className="admin-header">
						<h1>Gestion des articles</h1>
						<button className="primaryButton" style={{ padding: "10px 20px" }} onClick={() => navigate("/admin/articles/ajouter")}>
							Ajouter un article
						</button>
					</div>

					{message && <p style={{ color: "green", marginBottom: "10px" }}>{message}</p>}
					{erreur && <p style={{ color: "red", marginBottom: "10px" }}>{erreur}</p>}

					{/* Barre de recherche */}
					<input
						type="text"
						className="admin-search"
						placeholder="Rechercher un article par titre..."
						value={recherche}
						onChange={(e) => setRecherche(e.target.value)}
					/>

					{/* Tableau */}
					{chargement ? (
						<div className="loading-container">
							<div className="spinner" />
							<p className="p-loading"> Chargement...</p>
						</div>
					) : articlesFiltres.length === 0 ? (
						<p style={{ color: "gray", textAlign: "center", marginTop: "30px" }}>Aucun article trouvé.</p>
					) : (
						<div style={{ overflowX: "auto" }}>
							<table className="admin-table">
								<thead>
									<tr>
										<th>ID</th>
										<th>Titre</th>
										<th>Produit</th>
										<th>Prix</th>
										<th>Stock</th>
										<th>Disponibilité</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{articlesFiltres.map((article) => (
										<tr key={article.id_article}>
											<td>{article.id_article}</td>
											<td>{article.titre}</td>
											<td>{article.produit?.titre || "—"}</td>
											<td>{parseFloat(article.prix).toFixed(2)} €</td>
											<td>{article.stock}</td>
											<td>
												<span
													style={{
														padding: "3px 8px",
														borderRadius: "12px",
														fontSize: "0.8rem",
														fontWeight: "bold",
														backgroundColor: article.disponibilite === "disponible" ? "#27ae60" : "#e74c3c",
														color: "white",
													}}
												>
													{article.disponibilite === "disponible" ? "Disponible" : "Rupture"}
												</span>
											</td>
											<td>
												<button className="btn-action-voir" onClick={() => navigate(`/admin/articles/${article.id_article}`)}>
													Voir
												</button>
												<button
													className="btn-action-modifier"
													onClick={() => navigate(`/admin/articles/${article.id_article}/modifier`)}
												>
													Modifier
												</button>
												<button className="btn-action-supprimer" onClick={() => supprimerArticle(article.id_article)}>
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

export default AdminArticlesPage;
