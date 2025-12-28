import React, { useContext, memo } from "react";
import "../Styles/Style.css";
import { UserContext } from "../Context/UserContext";
import FavorisItem from "../Composants/List/FavorisItem.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";

const FavorisPage = memo(() => {
	// Pour la navigation
	const navigate = useNavigate();

	// Accès au context
	const { user, favoris, supprimerDesFavoris, ajouterAuPanier, totalPanier, nombreArticlesPanier, loading } = useContext(UserContext);

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
			<Header />
			<main className="main-content">
				<MenuLateral1 />
				<div className="content-section">
					<div style={{ padding: "20px" }}>
						<div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<h2 className="titre2">⭐ Mes favoris ({favoris.length})</h2>
						</div>

						<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
							{favoris.map((item, index) => (
								<FavorisItem
									key={item._id ? item._id : `favoris-${index}`}
									item={item}
									onSupprimer={supprimerDesFavoris}
									onAjouterPanier={ajouterAuPanier}
								/>
							))}
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
