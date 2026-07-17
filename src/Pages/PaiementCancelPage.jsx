import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Style.css";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import { Helmet } from "react-helmet-async";

const PaiementCancelPage = () => {
	const navigate = useNavigate();

	return (
		<>
			<Helmet>
				<title>Tech City - Paiement annulé</title>
			</Helmet>
			<Header />
			<main className="main-content" style={{ justifyContent: "center" }}>
				<div className="content-section" style={{ textAlign: "center", paddingTop: "60px" }}>
					<div style={{ fontSize: "4rem", marginBottom: "20px" }}>❌</div>

					<h1 style={{ color: "#e74c3c" }}>Paiement annulé</h1>

					<p style={{ color: "#555", marginTop: "16px", fontSize: "1.1rem" }}>
						Votre paiement a été annulé. Votre panier est toujours disponible.
					</p>

					<div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "32px" }}>
						<button className="primaryButton" style={{ padding: "12px 24px", maxWidth: "200px" }} onClick={() => navigate("/panier")}>
							Retour au panier
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

export default PaiementCancelPage;
