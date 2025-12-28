import React, { useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import { ArticleContext } from "../Context/ArticleContext";
import { UserContext } from "../Context/UserContext";
import ArticlesItem from "../Composants/List/ArticlesItem.jsx";
import "../Styles/Style.css";
import { useNavigate } from "react-router-dom";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const CataloguePage = memo(() => {
	const [erreur, setErreur] = useState(null);
	const [recherche, setRecherche] = useState("");

	// Pour la navigation
	const navigate = useNavigate();

	// Etat qui stocke la visibilité de chaque article pour les descriptions individuelles : { idArticle: boolean }
	const [descriptionVisible, setDescriptionVisible] = useState({});

	// Pour vérifier l'état de chargement de la liste des articles
	const [loading, setLoading] = useState(false);

	// Accès au context
	const { articles, setArticles } = useContext(ArticleContext);
	const { user, favoris, toggleFavoris, ajouterAuPanier, isLogin, totalPanier, nombreArticlesPanier } = useContext(UserContext);

	useEffect(() => {
		const chargerArticles = async () => {
			try {
				setLoading(true);
				setErreur(null);

				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 secondes

				const res = await fetch(`${API_BASE_URL}/articles`, {
					signal: controller.signal,
				});

				clearTimeout(timeoutId);

				if (!res.ok) {
					throw new Error(`Erreur HTTP ${res.status}: ${res.statusText}`);
				}

				const data = await res.json();
				setArticles(data);
			} catch (err) {
				console.error("❌ Erreur chargement articles:", err);
				if (err.name === "AbortError") {
					setErreur("❌ La requête a pris trop de temps. Vérifiez votre connexion.");
				} else if (err.message.includes("Network request failed")) {
					setErreur("❌ Erreur réseau. Vérifiez votre connexion internet.");
				} else {
					setErreur(err.message);
				}
			} finally {
				setLoading(false);
			}
		};
		chargerArticles();
	}, [setArticles]);

	// Fonction pour la barre de recherche
	const articlesFiltres = useMemo(() => {
		return articles.filter((a) => a.name.toLowerCase().includes(recherche.toLowerCase()));
	}, [articles, recherche]);

	// Fonction Toggle pour la description de l'article
	const toggleDescription = useCallback((id) => {
		setDescriptionVisible((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	}, []);

	// Création d'un Set des IDs des favoris
	const idsFavoris = useMemo(() => new Set(favoris.map((f) => f._id)), [favoris]);

	// Fonction renderItem
	const renderItem = useCallback(
		({ item }) => {
			const isVisible = descriptionVisible[item._id] || false;
			const estFavori = idsFavoris.has(item._id);

			return (
				<ArticlesItem
					item={item}
					isVisible={isVisible}
					estFavori={estFavori}
					onToggleDescription={toggleDescription}
					onToggleFavoris={() => toggleFavoris(item, user)}
					onAddToCart={ajouterAuPanier}
					isLogin={isLogin}
				/>
			);
		},
		[descriptionVisible, idsFavoris, toggleDescription, toggleFavoris, ajouterAuPanier, isLogin]
	);

	// Affiche un écran de chargement
	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner"></div>
				<p className="p-loading">Chargement des articles...</p>
			</div>
		);
	}

	// Affiche un écran d'erreur
	if (erreur) {
		return (
			<div style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", height: "100vh" }}>
				<p style={{ color: "red", fontSize: "18px" }}>❌ Erreur : {erreur}</p>
			</div>
		);
	}

	return (
		<>
			<Header />
			<main className="main-content">
				<MenuLateral1 />
				<div className="content-section">
					<div style={{ flex: 1 }}>
						<div style={{ flex: 1 }}>
							<input
								type="text"
								placeholder="Rechercher un article..."
								value={recherche}
								onChange={(e) => setRecherche(e.target.value)}
								className="searchInput"
							/>
						</div>

						<div>
							{articlesFiltres.length === 0 ? (
								<p>{recherche.length > 0 ? `Aucun produit ne correspond à "${recherche}".` : "Aucun produit disponible."}</p>
							) : (
								<div>{articlesFiltres.map((item) => renderItem({ item }))}</div>
							)}
						</div>
					</div>
				</div>
				<MenuLateral2 />
			</main>
			<Footer />
		</>
	);
});

export default CataloguePage;
