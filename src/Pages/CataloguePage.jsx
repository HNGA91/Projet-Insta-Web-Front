import React, { useState, useEffect, useContext, useRef, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { ArticleContext } from "../Context/ArticleContext.js";
import { UserContext } from "../Context/UserContext.js";
import "../Styles/Style.css";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;
const SERVER_URL = import.meta.env.VITE_SERVER_URL.replace("/api", "");

// ===== Carte article dans le carrousel =====
const CarteArticle = memo(({ article }) => {
	const navigate = useNavigate();
	const enRupture = article.disponibilite === "rupture" || article.stock <= 0;

	return (
		<div
			onClick={() => navigate(`/article/${article.id_article}`)}
			style={{
				flex: "0 0 200px",
				width: "200px",
				backgroundColor: "#fff",
				borderRadius: "10px",
				boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
				cursor: "pointer",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				transition: "transform 0.2s ease, box-shadow 0.2s ease",
				border: "1px solid #eee",
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = "translateY(-4px)";
				e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = "translateY(0)";
				e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
			}}
		>
			{/* Image */}
			<div
				style={{
					width: "100%",
					height: "160px",
					backgroundColor: "#f5f5f5",
					overflow: "hidden",
					flexShrink: 0,
				}}
			>
				{article.image ? (
					<img
						src={`${SERVER_URL}/Images/Articles/${article.produit?.titre}/${article.image}`}
						alt={article.image_alt || article.titre}
						style={{ width: "100%", height: "100%", objectFit: "cover" }}
						onError={(e) => {
							e.target.style.display = "none";
						}}
					/>
				) : (
					<div
						style={{
							width: "100%",
							height: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "#ccc",
							fontSize: "0.8rem",
						}}
					>
						Pas d'image
					</div>
				)}
			</div>

			{/* Infos */}
			<div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
				<p
					style={{
						fontWeight: "bold",
						fontSize: "0.85rem",
						color: "black",
						margin: 0,
						lineHeight: "1.3",
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
					}}
				>
					{article.titre}
				</p>
				<p
					style={{
						fontSize: "0.78rem",
						color: "black",
						margin: 0,
						lineHeight: "1.4",
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
					}}
				>
					{article.description || "—"}
				</p>
				<div style={{ marginTop: "auto", paddingTop: "6px" }}>
					{enRupture ? (
						<span style={{ fontSize: "0.75rem", color: "#e74c3c", fontWeight: "bold" }}>Rupture de stock</span>
					) : (
						<p style={{ fontWeight: "bold", fontSize: "1rem", color: "#09107e", margin: 0 }}>{parseFloat(article.prix).toFixed(2)} €</p>
					)}
				</div>
			</div>
		</div>
	);
});

// ===== Carrousel pour un produit =====
const Carrousel = memo(({ titre, articles, onVoirTout }) => {
	const trackRef = useRef(null);
	const CARD_WIDTH = 216; // 200px carte + 16px gap

	const scrollLeft = () => trackRef.current?.scrollBy({ left: -CARD_WIDTH * 2, behavior: "smooth" });
	const scrollRight = () => trackRef.current?.scrollBy({ left: CARD_WIDTH * 2, behavior: "smooth" });

	return (
		<div style={{ marginBottom: "40px" }}>
			{/* En-tête du carrousel */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "12px",
					paddingBottom: "8px",
					borderBottom: "2px solid #09107e",
				}}
			>
				<h3 style={{ margin: 0, color: "#2c3e50", fontSize: "1.1rem" }}>{titre}</h3>
				<button
					onClick={onVoirTout}
					style={{
						background: "none",
						border: "1px solid #09107e",
						color: "#09107e",
						borderRadius: "6px",
						padding: "4px 12px",
						cursor: "pointer",
						fontSize: "0.85rem",
						fontWeight: "bold",
					}}
				>
					Voir tout →
				</button>
			</div>

			{/* Piste du carrousel */}
			<div style={{ position: "relative", display: "flex", alignItems: "center", minWidth: 0 }}>
				{/* Bouton gauche */}
				<button
					onClick={scrollLeft}
					style={{
						position: "absolute",
						left: "-16px",
						zIndex: 2,
						width: "32px",
						height: "32px",
						borderRadius: "50%",
						backgroundColor: "#09107e",
						color: "white",
						border: "none",
						cursor: "pointer",
						fontSize: "1rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
						flexShrink: 0,
					}}
				>
					‹
				</button>

				{/* Articles */}
				<div
					ref={trackRef}
					className="carrousel-track"
					style={{
						display: "flex",
						gap: "16px",
						overflowX: "auto",
						scrollbarWidth: "none", // Firefox
						msOverflowStyle: "none", // IE
						padding: "8px 4px",
						flex: 1,
						// Essentiel : sans ça, cet élément flex refuse de rétrécir en dessous de la
						// largeur totale de ses cartes, ce qui fait déborder tout le carrousel (et la page)
						// au lieu de rester scrollable dans sa propre largeur
						minWidth: 0,
					}}
				>
					{articles.map((article) => (
						<CarteArticle key={article.id_article} article={article} />
					))}
				</div>

				{/* Bouton droit */}
				<button
					onClick={scrollRight}
					style={{
						position: "absolute",
						right: "-16px",
						zIndex: 2,
						width: "32px",
						height: "32px",
						borderRadius: "50%",
						backgroundColor: "#09107e",
						color: "white",
						border: "none",
						cursor: "pointer",
						fontSize: "1rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
						flexShrink: 0,
					}}
				>
					›
				</button>
			</div>
		</div>
	);
});

// ===== Page principale =====
const CataloguePage = memo(() => {
	const navigate = useNavigate();
	const [erreur, setErreur] = useState(null);
	const [recherche, setRecherche] = useState("");
	const [produits, setProduits] = useState([]);

	// Pour vérifier l'état de chargement de la liste des articles
	const [loading, setLoading] = useState(false);

	// Accès au context
	const { articles, setArticles } = useContext(ArticleContext);
	const { isLogin } = useContext(UserContext);

	// Charger articles et produits
	useEffect(() => {
		const charger = async () => {
			try {
				setLoading(true);
				setErreur(null);

				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout 10 secondes

				const [resArticles, resProduits] = await Promise.all([
					fetch(`${API_BASE_URL}/articles`, { signal: controller.signal }),
					fetch(`${API_BASE_URL}/produits`, { signal: controller.signal }),
				]);

				clearTimeout(timeoutId);

				if (!resArticles.ok) throw new Error(`Erreur HTTP ${resArticles.status}`);
				if (!resProduits.ok) throw new Error(`Erreur HTTP ${resProduits.status}`);

				const dataArticles = await resArticles.json();
				const dataProduits = await resProduits.json();

				setArticles(dataArticles);
				setProduits(dataProduits);
			} catch (err) {
				if (err.name === "AbortError") {
					setErreur("❌ La requête a pris trop de temps. Vérifiez votre connexion.");
				} else {
					setErreur(err.message);
				}
			} finally {
				setLoading(false);
			}
		};
		charger();
	}, [setArticles]);

	// Filtrer les articles par recherche
	const articlesFiltres = useMemo(() => {
		if (!recherche.trim()) return null; // null = mode carrousel
		return articles.filter((a) => a.titre.toLowerCase().includes(recherche.toLowerCase()));
	}, [articles, recherche]);

	// Grouper les articles par produit pour les carrousels
	const articlesProduit = useMemo(() => {
		const groupes = {};
		produits.forEach((p) => {
			groupes[p.id_produit] = [];
		});
		articles.forEach((a) => {
			if (groupes[a.id_produit] !== undefined) {
				groupes[a.id_produit].push(a);
			}
		});
		return groupes;
	}, [articles, produits]);

	// Affiche un écran de chargement
	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner" />
				<p className="p-loading"> Chargement des articles...</p>
			</div>
		);
	}

	// Affiche un écran d'erreur
	if (erreur) {
		return (
			<div style={{ flex: 1, justifyContent: "center", alignItems: "center", height: "100vh" }}>
				<p style={{ color: "red", fontSize: "18px" }}>❌ Erreur : {erreur}</p>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>Tech City</title>
				<meta name="description" content="Découvrez notre catalogue de composants PC au meilleur prix sur Tech City." />
				<meta property="og:title" content="Tech City" />
				<meta property="og:description" content="Découvrez notre catalogue de composants PC." />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://techcity.com" />
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateral1 />
				<div className="content-section">
					{/* Barre de recherche */}
					<input
						type="text"
						placeholder="Rechercher un article..."
						value={recherche}
						onChange={(e) => setRecherche(e.target.value)}
						className="searchInput"
					/>

					{/* Mode recherche — liste plate */}
					{articlesFiltres !== null ? (
						<div>
							{articlesFiltres.length === 0 ? (
								<p>Aucun produit ne correspond à "{recherche}".</p>
							) : (
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: "16px",
										justifyContent: "flex-start",
										padding: "8px 0",
									}}
								>
									{articlesFiltres.map((article) => (
										<CarteArticle key={article.id_article} article={article} />
									))}
								</div>
							)}
						</div>
					) : (
						/* Mode normal — carrousels par produit */
						<div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
							{produits.length === 0 ? (
								<p>Aucun produit disponible.</p>
							) : (
								produits.map((produit) => {
									const articlesSection = articlesProduit[produit.id_produit] || [];
									if (articlesSection.length === 0) return null;
									const slug = produit.titre.toLowerCase().replace(/\s+/g, "-");
									return (
										<Carrousel
											key={produit.id_produit}
											titre={produit.titre}
											articles={articlesSection}
											onVoirTout={() => navigate(`/catalogue/${slug}`, { state: { produit } })}
										/>
									);
								})
							)}
						</div>
					)}
				</div>
				<MenuLateral2 />
			</main>
			<Footer />
		</>
	);
});

export default CataloguePage;
