import React, { useContext } from "react";
import "../Styles/Style.css";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";

const ProfilPage = () => {
	const { user, setUser, logout, panier, setPanier, totalPanier, nombreArticlesPanier, loading } = useContext(UserContext);

    // Pour la navigation
    const navigate = useNavigate();

	const handleDeconnexion = () => {
		logout(); // Appel de la fonction du contexte UserContext
		navigate("/"); // Retour automatique à l'accueil
	};

	if (!user) {
		return (
			<div className="loading-container">
				<p className="error-message" style={{ fontSize: "35px", textAlign: "center", justifyContent: "center" }}>
					⛔ Veuillez vous connecter pour accéder à votre profil.
				</p>
			</div>
		);
	}

	// Affiche un écran de chargement en cas de chargements
	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner"></div>
				<p className="p-loading">Chargement de votre profil...</p>
			</div>
		);
	}

	return (
		<>
			<Header />
			<main className="main-content">
				<MenuLateral1 />
				<div className="content-section">
					<h2>Bienvenue {user?.prenom ?? ""}</h2>
				</div>
				<MenuLateral2 />
			</main>
			<Footer />
		</>
	);
};

export default ProfilPage;
