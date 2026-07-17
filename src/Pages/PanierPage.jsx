import React, { useContext, useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext.js";
import "../Styles/Style.css";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;
// URL du back sans /api — pour les images statiques
const SERVER_URL = import.meta.env.VITE_SERVER_URL.replace("/api", "");

const PanierPage = memo(() => {
	const navigate = useNavigate();
	const { user, accessToken, panier, ajouterAuPanier, supprimerDuPanier, viderLePanier, totalPanier, loading } = useContext(UserContext);

	const [adresses, setAdresses] = useState([]);
	const [idAdresseLivraison, setIdAdresseLivraison] = useState("");
	const [idAdresseFacturation, setIdAdresseFacturation] = useState("");
	const [erreur, setErreur] = useState("");
	const [loadingPaiement, setLoadingPaiement] = useState(false);
	const [stocksActuels, setStocksActuels] = useState({});

	// Charger les stocks frais depuis l'API pour chaque article du panier
	// Nécessaire car les données MongoDB ne contiennent pas le stock en temps réel
	useEffect(() => {
		if (panier.length === 0) return;
		const chargerStocks = async () => {
			const stocks = {};
			await Promise.all(
				panier.map(async (item) => {
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
	}, [panier]);

	// Charger les adresses de l'utilisateur
	useEffect(() => {
		if (!user) return;
		const charger = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/adresses/user/${user.id_user}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				if (!response.ok) throw new Error();
				const data = await response.json();
				setAdresses(data);
				// Pré-sélectionner la première adresse si disponible
				if (data.length > 0) {
					setIdAdresseLivraison(data[0].id_adresse);
					setIdAdresseFacturation(data[0].id_adresse);
				}
			} catch {
				setErreur("❌ Impossible de charger vos adresses.");
			}
		};
		charger();
	}, [user]);

	// Déclencher le paiement Stripe
	const handlePaiement = async () => {
		setErreur("");

		if (panier.length === 0) {
			setErreur("⚠️ Votre panier est vide.");
			return;
		}

		if (!idAdresseLivraison || !idAdresseFacturation) {
			setErreur("⚠️ Veuillez sélectionner une adresse de livraison et de facturation.");
			return;
		}

		setLoadingPaiement(true);

		try {
			const response = await fetch(`${API_BASE_URL}/paiement/create-checkout-session`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					panier,
					id_adresse_livraison: parseInt(idAdresseLivraison),
					id_adresse_facturation: parseInt(idAdresseFacturation),
				}),
			});

			const result = await response.json();

			if (response.ok) {
				// Rediriger vers la page de paiement Stripe
				window.location.href = result.url;
			} else {
				setErreur(`❌ ${result.message}`);
			}
		} catch {
			setErreur("❌ Une erreur est survenue lors de l'initialisation du paiement.");
		} finally {
			setLoadingPaiement(false);
		}
	};

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
			<Helmet>
				<title>Tech City — Mon Panier</title>
				<meta name="description" content="Consultez et gérez votre panier d'achats Tech City." />
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateral1 />

				<div className="content-section">
					<h1>🛒 Mon Panier</h1>

					{erreur && <p style={{ color: "red", textAlign: "center", marginBottom: "16px" }}>{erreur}</p>}

					{panier.length === 0 ? (
						<div style={{ textAlign: "center", marginTop: "40px" }}>
							<p style={{ color: "gray", fontSize: "1.1rem" }}>Votre panier est vide.</p>
							<button className="primaryButton" style={{ marginTop: "20px", padding: "12px 24px" }} onClick={() => navigate("/")}>
								Voir le catalogue
							</button>
						</div>
					) : (
						<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
							{/* Liste des articles */}
							<div className="articleWrapper">
								{panier.map((item, index) => {
									// Récupérer les infos de stock fraîches depuis l'API pour cet article
									const id = String(item.id_article || item._id);
									const infoStock = stocksActuels[id];
									const enRupture = infoStock ? infoStock.disponibilite === "rupture" || infoStock.stock <= 0 : false;
									const stockMax = infoStock?.stock ?? Infinity;
									const plusBloque = enRupture || item.quantite >= stockMax;

									return (
										<div className="itemContainer" key={`${item._id}-${index}`}>
											{/* Image — chemin vers le back (port 3000) */}
											<img
												src={`${SERVER_URL}/Images/Articles/${item.produit?.titre || item.produitTitre}/${item.image}`}
												alt={item.image_alt}
												className="image"
												style={{ cursor: "pointer" }}
												onClick={() => navigate(`/article/${item._id || item.id_article}`)}
												onError={(e) => {
													e.target.style.display = "none";
												}}
											/>
											<div
												className="info"
												style={{ cursor: "pointer" }}
												onClick={() => navigate(`/article/${item._id || item.id_article}`)}
											>
												<p className="nom">{item.titre}</p>
												<p>{parseFloat(item.prix).toFixed(2)} €</p>
												{/* Indicateur rupture de stock */}
												{enRupture && <p style={{ color: "#e74c3c", fontSize: "0.8rem", margin: 0 }}>Rupture de stock</p>}
											</div>
											<div className="cartActions">
												<button className="btnMinus" onClick={() => supprimerDuPanier(item._id)}>
													−
												</button>
												<span className="quantite">{item.quantite || 1}</span>
												{/* Bouton + bloqué si rupture ou stock max atteint */}
												<button
													className="btnPlus"
													onClick={() => ajouterAuPanier(item)}
													disabled={plusBloque}
													style={{
														opacity: plusBloque ? 0.4 : 1,
														cursor: plusBloque ? "not-allowed" : "pointer",
													}}
													title={
														enRupture
															? "Rupture de stock"
															: plusBloque
																? "Stock maximum atteint"
																: "Augmenter la quantité"
													}
												>
													+
												</button>
											</div>
										</div>
									);
								})}
							</div>

							{/* Total + vider */}
							<div className="totalContainer">
								<button className="btnVider" onClick={viderLePanier}>
									Vider le panier
								</button>
								<p className="total">Total : {totalPanier.toFixed(2)} €</p>
							</div>

							{/* Sélection des adresses */}
							<div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "20px", marginTop: "10px" }}>
								<h3 style={{ marginBottom: "16px", color: "#2c3e50" }}>Adresses de livraison et facturation</h3>

								{adresses.length === 0 ? (
									<div style={{ textAlign: "center" }}>
										<p style={{ color: "gray", marginBottom: "12px" }}>Vous n'avez pas encore d'adresse enregistrée.</p>
										<button
											className="primaryButton"
											style={{ padding: "10px 20px" }}
											onClick={() => navigate("/profil/adresses")}
										>
											Ajouter une adresse
										</button>
									</div>
								) : (
									<div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
										{/* Adresse de livraison */}
										<div style={{ flex: 1, minWidth: "200px" }}>
											<label className="form-label" htmlFor="adresse-livraison">
												Adresse de livraison :
											</label>
											<select
												id="adresse-livraison"
												className="form-control"
												value={idAdresseLivraison}
												onChange={(e) => setIdAdresseLivraison(e.target.value)}
											>
												{adresses.map((a) => (
													<option key={a.id_adresse} value={a.id_adresse}>
														{a.rue}, {a.code_postal} {a.ville}
													</option>
												))}
											</select>
										</div>

										{/* Adresse de facturation */}
										<div style={{ flex: 1, minWidth: "200px" }}>
											<label className="form-label" htmlFor="adresse-facturation">
												Adresse de facturation :
											</label>
											<select
												id="adresse-facturation"
												className="form-control"
												value={idAdresseFacturation}
												onChange={(e) => setIdAdresseFacturation(e.target.value)}
											>
												{adresses.map((a) => (
													<option key={a.id_adresse} value={a.id_adresse}>
														{a.rue}, {a.code_postal} {a.ville}
													</option>
												))}
											</select>
										</div>
									</div>
								)}
							</div>

							{/* Bouton paiement Stripe */}
							{adresses.length > 0 && (
								<div style={{ textAlign: "center", marginTop: "10px" }}>
									<button
										onClick={handlePaiement}
										disabled={loadingPaiement}
										style={{
											backgroundColor: loadingPaiement ? "#aaa" : "#635BFF",
											color: "white",
											padding: "14px 40px",
											border: "none",
											borderRadius: "8px",
											fontSize: "1.1rem",
											fontWeight: "bold",
											cursor: loadingPaiement ? "not-allowed" : "pointer",
											width: "100%",
											maxWidth: "400px",
										}}
									>
										{loadingPaiement ? "Redirection en cours..." : "💳 Payer avec Stripe"}
									</button>
									<p style={{ color: "#888", fontSize: "0.8rem", marginTop: "8px" }}>Paiement sécurisé par Stripe</p>
								</div>
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

export default PanierPage;
