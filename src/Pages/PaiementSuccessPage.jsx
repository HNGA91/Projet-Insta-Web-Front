import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../Styles/Style.css";
import { UserContext } from "../Context/UserContext.js";
import { updatePanier } from "../Database/UserDataAPI.js";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import { Helmet } from "react-helmet-async";

const PaiementSuccessPage = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { setPanier, user, accessToken } = useContext(UserContext);
	const session_id = searchParams.get("session_id");

	useEffect(() => {
		const viderPanierApresCommande = async () => {
			try {
				// 1. Vider l'état React immédiatement
				setPanier([]);
				// 2. Attendre que le token soit disponible
				if (!user?.email || !accessToken) return;
				// 3. Sync MongoDB directement
				await updatePanier(user.email, [], accessToken);
				console.log("✅ Panier vidé après commande");
			} catch (err) {
				console.error("Erreur vidage panier:", err);
			}
		};
		// Petit délai pour laisser le temps au contexte de se restaurer
		const timer = setTimeout(() => {
			if (user && accessToken) viderPanierApresCommande();
		}, 500);
		return () => clearTimeout(timer);
	}, [user, accessToken, setPanier]);

	return (
		<>  
            <Helmet>
                <title>Tech City - Paiement réussi</title>
            </Helmet>
			<Header />
			<main className="main-content" style={{ justifyContent: "center" }}>
				<div className="content-section" style={{ textAlign: "center", paddingTop: "60px" }}>
					<div style={{ fontSize: "4rem", marginBottom: "20px" }}>✅</div>

					<h1 style={{ color: "#27ae60" }}>Paiement réussi !</h1>

					<p style={{ color: "#555", marginTop: "16px", fontSize: "1.1rem" }}>
						Merci pour votre commande. Elle a été confirmée et est en cours de traitement.
					</p>

					<p style={{ color: "#888", marginTop: "8px", fontSize: "0.9rem" }}>Vous recevrez un email de confirmation prochainement.</p>

					<div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "32px" }}>
						<button
							className="primaryButton"
							style={{ padding: "12px 24px", maxWidth: "200px" }}
							onClick={() => navigate("/profil/commandes")}
						>
							Voir mes commandes
						</button>
						<button className="secondaryButton" style={{ padding: "12px 24px", maxWidth: "200px" }} onClick={() => navigate("/")}>
							Retour au catalogue
						</button>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
};

export default PaiementSuccessPage;
