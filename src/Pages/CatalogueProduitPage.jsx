import React, { useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { UserContext } from "../Context/UserContext.js";
import ArticlesItem from "../Composants/List/ArticlesItem.jsx";
import "../Styles/Style.css";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const CatalogueProduitPage = memo(() => {
	const { nomProduit } = useParams();
	const location = useLocation();
	const produitState = location.state?.produit;

	// Accès au context
	const { user, favoris, toggleFavoris, ajouterAuPanier, isLogin } = useContext(UserContext);

	const [articles, setArticles] = useState([]);
	const [titreProduit, setTitreProduit] = useState(produitState?.titre || nomProduit);
	const [recherche, setRecherche] = useState("");
	const [erreur, setErreur] = useState(null);

	// Pour vérifier l'état de chargement de la liste des articles
	const [loading, setLoading] = useState(false);

	// Etat qui stocke la visibilité de chaque article pour les descriptions individuelles : { idArticle: boolean }
	const [descriptionVisible, setDescriptionVisible] = useState({});

	useEffect(() => {
		const charger = async () => {
			setLoading(true);
			setErreur(null);
			setArticles([]);
			try {
				// Charger tous les produits pour trouver l'id_produit correspondant au slug
				const resProduits = await fetch(`${API_BASE_URL}/produits`);
				const produits = await resProduits.json();

				// Chercher le produit dont le titre correspond au slug de l'URL
				const produitTrouve = produits.find((p) => p.titre.toLowerCase().replace(/\s+/g, "-") === nomProduit);

				if (!produitTrouve) {
					setErreur("Produit introuvable.");
					setLoading(false);
					return;
				}

				setTitreProduit(produitTrouve.titre);

				// Charger les articles de ce produit
				const resArticles = await fetch(`${API_BASE_URL}/articles?id_produit=${produitTrouve.id_produit}`);
				const data = await resArticles.json();
				setArticles(data);
			} catch {
				setErreur("Impossible de charger les articles.");
			} finally {
				setLoading(false);
			}
		};
		charger();
	}, [nomProduit]);

	// Fonction pour la barre de recherche
	const articlesFiltres = useMemo(() => articles.filter((a) => a.titre.toLowerCase().includes(recherche.toLowerCase())), [articles, recherche]);

	// Fonction Toggle pour la description de l'article
	const toggleDescription = useCallback((id) => {
		setDescriptionVisible((prev) => ({ ...prev, [id]: !prev[id] }));
	}, []);

	// Création d'un Set des IDs des favoris
	const idsFavoris = useMemo(() => new Set(favoris.map((f) => String(f._id))), [favoris]);

	// Fonction renderItem
	const renderItem = useCallback(
		({ item }) => {
			const isVisible = descriptionVisible[item.id_article] || false;
			const estFavori = idsFavoris.has(String(item.id_article));
			return (
				<ArticlesItem
					key={item.id_article}
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
		[descriptionVisible, idsFavoris, toggleDescription, toggleFavoris, ajouterAuPanier, isLogin, user],
	);

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
			<div style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", height: "100vh" }}>
				<p style={{ color: "red", fontSize: "18px" }}>❌ Erreur : {erreur}</p>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>{`Tech City — ${titreProduit}`}</title>
				<meta name="description" content={`Découvrez notre sélection de ${titreProduit} au meilleur prix sur Tech City.`} />
				<meta property="og:title" content="Tech City — Catalogue" />
				<meta property="og:description" content={`Découvrez notre sélection de ${titreProduit} au meilleur prix sur Tech City.`} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`https://techcity.com/catalogue/${nomProduit}`} />
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateral1 />
				<div className="content-section">
					<h1 style={{ textAlign: "center", marginBottom: "20px" }}>{titreProduit}</h1>

					{erreur && <p style={{ color: "red", textAlign: "center" }}>{erreur}</p>}

					<input
						type="text"
						placeholder={`Rechercher dans ${titreProduit}...`}
						value={recherche}
						onChange={(e) => setRecherche(e.target.value)}
						className="searchInput"
					/>

					{articlesFiltres.length === 0 ? (
						<p style={{ textAlign: "center", color: "gray", marginTop: "30px" }}>
							{recherche ? `Aucun article ne correspond à "${recherche}".` : "Aucun article disponible pour ce produit."}
						</p>
					) : (
						// marginBottom fixe : garantit toujours le même espace avant le footer,
						// que le toggle "Afficher/Masquer les détails" soit ouvert ou non
						<div style={{ marginBottom: "60px" }}>{articlesFiltres.map((item) => renderItem({ item }))}</div>
					)}
				</div>
				<MenuLateral2 />
			</main>

			<Footer />
		</>
	);
});

export default CatalogueProduitPage;
