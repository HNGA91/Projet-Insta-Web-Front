import React, { useState, useEffect, useContext, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { UserContext } from "../Context/UserContext.js";
import "../Styles/Style.css";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;
// URL du back sans /api — pour les images statiques
const SERVER_URL = import.meta.env.VITE_SERVER_URL.replace("/api", "");

const ArticleDetailPage = memo(() => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { favoris, toggleFavoris, ajouterAuPanier, isLogin } = useContext(UserContext);

	const [article, setArticle] = useState(null);
	const [loading, setLoading] = useState(true);
	const [erreur, setErreur] = useState(null);
	const [ajoutConfirme, setAjoutConfirme] = useState(false);

	useEffect(() => {
		const charger = async () => {
			setLoading(true);
			setErreur(null);
			try {
				const res = await fetch(`${API_BASE_URL}/articles/${id}`);
				if (!res.ok) throw new Error();
				setArticle(await res.json());
			} catch {
				setErreur("Article introuvable.");
			} finally {
				setLoading(false);
			}
		};
		charger();
	}, [id]);

	const estFavori = favoris.some((f) => String(f._id) === String(id));

	const handleAjouterAuPanier = () => {
		if (!article) return;
		ajouterAuPanier(article);
		setAjoutConfirme(true);
		setTimeout(() => setAjoutConfirme(false), 2000);
	};

	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner" />
				<p className="p-loading">Chargement de l'article...</p>
			</div>
		);
	}

	if (erreur || !article) {
		return (
			<>
				<Header />
				<main className="main-content">
					<MenuLateral1 />
					<div className="content-section" style={{ textAlign: "center", paddingTop: "60px" }}>
						<p style={{ color: "red", fontSize: "1.2rem" }}>❌ {erreur || "Article introuvable."}</p>
						<button className="primaryButton" style={{ marginTop: "20px", padding: "10px 20px" }} onClick={() => navigate("/")}>
							Retour au catalogue
						</button>
					</div>
					<MenuLateral2 />
				</main>
				<Footer />
			</>
		);
	}

	const enRupture = article.disponibilite === "rupture" || article.stock <= 0;
	const TAILLE = "450px";
	const FONT_SIZE = "1rem"; // Taille uniforme pour toutes les infos

	return (
		<>
			<Helmet>
				<title>{`Tech City — ${article.titre}`}</title>
				<meta name="description" content={article.description || `Découvrez ${article.titre} sur Tech City.`} />
				<meta property="og:title" content={`Tech City — ${article.titre}`} />
				<meta property="og:description" content={article.description || `Découvrez ${article.titre} sur Tech City.`} />
				<meta property="og:type" content="product" />
			</Helmet>

			<Header />
			<main className="main-content">
				<MenuLateral1 />

				<div className="content-section">
					{/* EN-TÊTE : catégorie à gauche + bouton retour à droite */}
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							marginBottom: "16px",
						}}
					>
						<button className="secondaryButton" style={{ padding: "8px 16px" }} onClick={() => navigate(-1)}>
							← Retour
						</button>
					</div>

					{/* GRANDE DIV BLANCHE — pleine largeur pour permettre l'espacement entre image et infos */}
					<div
						style={{
							backgroundColor: "#fff",
							borderRadius: "12px",
							padding: "20px",
							boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
							display: "flex",
							flexDirection: "column",
							width: "100%", // pleine largeur pour que "space-between" pousse les infos à droite
							maxWidth: "100%",
							gap: "0px",
							margin: "0 auto",
							boxSizing: "border-box",
						}}
					>
						{/* LIGNE HAUTE : image à gauche + infos poussées tout à droite, avec espace entre les deux */}
						<div
							style={{
								display: "flex",
								justifyContent: "space-between", // pousse l'image à gauche et les infos à droite
								gap: "40px", // espace minimum garanti entre l'image et le bloc d'infos
								flexWrap: "wrap",
							}}
						>
							{/* IMAGE — reste à gauche */}
							<div
								style={{
									width: TAILLE,
									height: TAILLE,
									flexShrink: 0,
									maxWidth: "100%",
								}}
							>
								{article.image ? (
									<img
										src={`${SERVER_URL}/Images/Articles/${article.produit?.titre}/${article.image}`}
										alt={article.image_alt || article.titre}
										style={{
											width: TAILLE,
											height: TAILLE,
											objectFit: "cover",
											borderRadius: "8px",
											display: "block",
										}}
										onError={(e) => {
											e.target.style.display = "none";
										}}
									/>
								) : (
									<div
										style={{
											width: "100%",
											height: "100%",
											backgroundColor: "#eee",
											borderRadius: "8px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "#aaa",
											fontSize: "0.85rem",
										}}
									>
										Pas d'image
									</div>
								)}
							</div>

							{/* INFOS — poussées tout à droite, même taille que l'image */}
							<div
								style={{
									width: TAILLE,
									height: TAILLE,
									flexShrink: 0,
									maxWidth: "100%",
									display: "flex",
									flexDirection: "column",
									justifyContent: "space-between",
									padding: "12px 16px",
									backgroundColor: "#f8f9fa",
									borderRadius: "8px",
									boxSizing: "border-box",
								}}
							>
								{/* Titre + favoris */}
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
									<p style={{ fontSize: FONT_SIZE, fontWeight: "bold", color: "#2c3e50", margin: 0, flex: 1, lineHeight: "1.3" }}>
										{article.titre}
									</p>
									{isLogin && (
										<button
											onClick={() => toggleFavoris(article)}
											style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 0 8px", flexShrink: 0 }}
										>
											{estFavori ? <IoBookmark size={22} color="#f3c808" /> : <IoBookmarkOutline size={22} color="#888" />}
										</button>
									)}
								</div>

								{/* Marque — juste sous le titre */}
								<p style={{ fontSize: FONT_SIZE, fontWeight: "bold", color: "#2c3e50", margin: 0 }}>
									Marque : {article.marque || "—"}
								</p>

								{/* Stock */}
								<div>
									{enRupture ? (
										<span
											style={{
												backgroundColor: "#e74c3c",
												color: "white",
												padding: "2px 8px",
												borderRadius: "10px",
												fontSize: FONT_SIZE,
												fontWeight: "bold",
											}}
										>
											Rupture de stock
										</span>
									) : (
										<span
											style={{
												backgroundColor: "#27ae60",
												color: "white",
												padding: "2px 8px",
												borderRadius: "10px",
												fontSize: FONT_SIZE,
												fontWeight: "bold",
											}}
										>
											En stock ({article.stock} dispo{article.stock > 1 ? "s" : ""})
										</span>
									)}
								</div>

								{/* Prix */}
								<p style={{ fontSize: FONT_SIZE, fontWeight: "bold", color: "#2c3e50", margin: 0 }}>
									{parseFloat(article.prix).toFixed(2)} €
								</p>

								{/* Bouton panier */}
								{!isLogin ? (
									<button
										className="primaryButton"
										style={{ padding: "8px 0", width: "100%", maxWidth: "100%", fontSize: FONT_SIZE }}
										onClick={() => navigate("/login")}
									>
										Connectez-vous pour acheter
									</button>
								) : enRupture ? (
									<button
										className="primaryButton"
										disabled
										style={{
											padding: "8px 0",
											width: "100%",
											maxWidth: "100%",
											fontSize: FONT_SIZE,
											backgroundColor: "#aaa",
											cursor: "not-allowed",
										}}
									>
										Rupture de stock
									</button>
								) : (
									<button
										className="primaryButton"
										style={{
											padding: "8px 0",
											width: "100%",
											maxWidth: "100%",
											fontSize: FONT_SIZE,
											backgroundColor: ajoutConfirme ? "#27ae60" : "#1c5be4",
											transition: "background-color 0.3s ease",
										}}
										onClick={handleAjouterAuPanier}
									>
										{ajoutConfirme ? "✅ Ajouté !" : "Ajouter au panier"}
									</button>
								)}
							</div>
						</div>

						{/* DESCRIPTION — rectangle jaune, pleine largeur sous image+infos */}
						<div
							style={{
								borderTop: "1px solid #eee",
								marginTop: "16px",
								paddingTop: "14px",
								minHeight: "80px", // hauteur minimale, s'agrandit si texte long
							}}
						>
							<p
								style={{
									fontWeight: "bold",
									color: "#2c3e50",
									fontSize: FONT_SIZE,
									marginBottom: "6px",
									textAlign: "left",
								}}
							>
								Description :
							</p>
							<p
								style={{
									color: "#555",
									lineHeight: "1.6",
									fontSize: FONT_SIZE,
									margin: 0,
									textAlign: "left",
								}}
							>
								{article.description || "Aucune description disponible."}
							</p>
						</div>
					</div>
				</div>

				<MenuLateral2 />
			</main>
			<Footer />
		</>
	);
});

export default ArticleDetailPage;
