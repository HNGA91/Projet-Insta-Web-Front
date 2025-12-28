import React, { useContext, memo } from "react";
import { UserContext } from "../Context/UserContext";
import "../Styles/Style.css";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";

const PanierPage = memo(() => {
	const { user, panier, ajouterAuPanier, supprimerDuPanier, viderLePanier, totalPanier, loading } = useContext(UserContext);

	// Utilisateur non connecté
	if (!user) {
		return (
			<div className="loading-container">
				<p className="error-message">⛔ Veuillez vous connecter pour accéder à votre panier.</p>
			</div>
		);
	}

	// Affiche un écran de chargement en cas de chargements
	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner" />
				<p className="p-loading">Chargement du panier...</p>
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
							<h2 className="titre2">🛒 Mon Panier</h2>
						</div>

						<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
							{/* Liste */}
							<div className="articleWrapper">
								{panier.map((item, index) => (
									<div className="itemContainer" key={`${item._id}-${index}`}>
										<img src={item.image} alt={item.name} className="image" />

										<div className="info">
											<p className="nom">{item.name}</p>
											<p>{item.prix} €</p>
										</div>

										<div className="cartActions">
											<button className="btnMinus" onClick={() => supprimerDuPanier(item._id)}>
												−
											</button>

											<span className="quantite">{item.quantite || 1}</span>

											<button className="btnPlus" onClick={() => ajouterAuPanier(item)}>
												+
											</button>
										</div>
									</div>
								))}
							</div>

							{/* Total */}
							{panier.length > 0 && (
								<div className="totalContainer">
									<button className="btnVider" onClick={viderLePanier}>
										Vider le panier
									</button>

									<p className="total">Total : {totalPanier.toFixed(2)} €</p>
								</div>
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

export default PanierPage;
