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
// URL du back sans /api — pour les images statiques
const SERVER_URL = import.meta.env.VITE_SERVER_URL.replace("/api", "");

const AdminArticleDetailPage = () => {
	const { accessToken } = useContext(UserContext);
	const { id } = useParams();
	const navigate = useNavigate();

	const [article, setArticle] = useState(null);
	const [chargement, setChargement] = useState(false);
	const [erreur, setErreur] = useState("");

	useEffect(() => {
		const charger = async () => {
			setChargement(true);
			try {
				const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				if (!response.ok) throw new Error();
				setArticle(await response.json());
			} catch {
				setErreur("❌ Article introuvable.");
			} finally {
				setChargement(false);
			}
		};
		charger();
	}, [id]);

	return (
		<>
			<Helmet>
				<title>Tech City - Détail d'un article</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<div className="admin-header">
						<h1>Détail de l'article</h1>
						<div style={{ display: "flex", gap: "10px" }}>
							<button
								className="btn-action-modifier"
								style={{ padding: "8px 16px" }}
								onClick={() => navigate(`/admin/articles/${id}/modifier`)}
							>
								Modifier
							</button>
							<button className="secondaryButton" style={{ padding: "8px 16px" }} onClick={() => navigate("/admin/articles")}>
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
						article && (
							<div style={{ display: "flex", gap: "30px", flexWrap: "wrap", marginTop: "20px" }}>
								{/* Image + image_alt — chemin vers le back (port 3000) */}
								<div style={{ flex: "0 0 auto", textAlign: "center" }}>
									{article.image ? (
										<img
											src={`${SERVER_URL}/Images/Articles/${article.produit?.titre}/${article.image}`}
											alt={article.image_alt || article.titre}
											style={{ width: "250px", height: "250px", objectFit: "cover", borderRadius: "8px" }}
											onError={(e) => {
												e.target.style.display = "none";
											}}
										/>
									) : (
										<div
											style={{
												width: "250px",
												height: "250px",
												backgroundColor: "#eee",
												borderRadius: "8px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												color: "#aaa",
											}}
										>
											Pas d'image
											{article.image_alt && (
												<p style={{ color: "#888", fontSize: "0.8rem", marginTop: "6px" }}>Alt : {article.image_alt}</p>
											)}
										</div>
									)}
								</div>

								{/* Tableau des infos */}
								<div style={{ flex: 1, backgroundColor: "#fff", borderRadius: "8px", padding: "20px" }}>
									<table style={{ width: "100%", borderCollapse: "collapse" }}>
										<tbody>
											{[
												["ID", article.id_article],
												["Titre", article.titre],
												["Produit", article.produit?.titre || "—"],
												["Marque", article.marque || "—"],
												["Image", article.image || "—"],
												["Image alt", article.image_alt || "—"],
												["Description", article.description || "—"],
												["Stock", article.stock],
												["Disponibilité", article.disponibilite],
												["Prix", `${parseFloat(article.prix).toFixed(2)} €`],
											].map(([label, valeur]) => (
												<tr key={label} style={{ borderBottom: "1px solid #eee" }}>
													<td style={{ padding: "10px", fontWeight: "bold", color: "#555", width: "160px" }}>{label}</td>
													<td style={{ padding: "10px", color: "#2c3e50" }}>{valeur}</td>
												</tr>
											))}
										</tbody>
									</table>
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

export default AdminArticleDetailPage;
