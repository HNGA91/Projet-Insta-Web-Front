import React, { useContext, useEffect, useState, memo } from "react";
import "../Styles/Style.css";
import { UserContext } from "../Context/UserContext.js";
import FavorisItem from "../Composants/List/FavorisItem.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const FavorisPage = memo(() => {
	const navigate = useNavigate();

	// Accès au context
	const { user, favoris, supprimerDesFavoris, ajouterAuPanier, loading } = useContext(UserContext);

	// Stocks frais chargés depuis l'API pour chaque article favori
	const [stocksActuels, setStocksActuels] = useState({});

	// Charger les stocks frais depuis l'API pour chaque article favori
	useEffect(() => {
		if (favoris.length === 0) return;
		const chargerStocks = async () => {
			const stocks = {};
			await Promise.all(
				favoris.map(async (item) => {
					try {
						const id = item.id_article || item._id;
						const res = await fetch(`${API_BASE_URL}/articles/${id}`);
						if (res.ok) {
							const data = await res.json();
							stocks[String(id)] = {
								stock: data.stock,
								disponibilite: data.disponibilite,
							};
						}
					} catch {
						// Erreur silencieuse — le stock restera undefined, le bouton + sera actif par défaut
					}
				}),
			);
			setStocksActuels(stocks);
		};
		chargerStocks();
	}, [favoris]);

	// Utilisateur non connecté
	if (!user) {
		return (
			<div className="loading-container">
				<p className="error-message" style={{ fontSize: 35, textAlign: "center", justifyContent: "center" }}>
					⛔ Veuillez vous connecter pour accéder à vos favoris.
				</p>
			</div>
		);
	}

	// Affiche un écran de chargement en cas de chargements
	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner" />
				<p className="p-loading">Chargement des favoris...</p>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>Tech City — Mes Favoris</title>
				<meta name="description" content="Retrouvez tous vos articles favoris Tech City en un seul endroit." />
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateral1 />
				<div className="content-section">
					<div style={{ padding: "20px" }}>
						<div style={{ marginBottom: "20px" }}>
							<h1 className="titre2" style={{ width: "100%" }}>
								⭐ Mes favoris ({favoris.length})
							</h1>
						</div>

						<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
							{favoris.map((item, index) => {
								// Récupérer les infos de stock fraîches pour cet article
								const id = String(item.id_article || item._id);
								const infoStock = stocksActuels[id];
								return (
									<FavorisItem
										key={item._id ? item._id : `favoris-${index}`}
										item={item}
										infoStock={infoStock}
										onSupprimer={supprimerDesFavoris}
										onAjouterPanier={ajouterAuPanier}
									/>
								);
							})}
						</div>
					</div>
				</div>
				<MenuLateral2 />
			</main>
			<Footer />
		</>
	);
});

export default FavorisPage;
