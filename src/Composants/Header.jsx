import "../Styles/Style.css";
import Menu from "../Composants/Menu/Menu";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext.js";
import { useContext } from "react";

const Header = () => {
    // Pour la navigation
    const navigate = useNavigate();

    // Accès au context
	const { user, isLogin, logout, totalPanier, nombreArticlesPanier } = useContext(UserContext);

    const handleDeconnexion = () => {
		logout(); // Appel de la fonction du contexte UserContext
		navigate("/"); // Retour automatique à l'accueil
	};

	return (
		<header className="header">
				<div className="headerLeft"></div>
				<div className="headerCenter">
					<h1>Bienvenue sur ma page</h1>
					<Menu />
				</div>
				<div className="headerRight">
					{isLogin && (
						<div className="headerRightButtons">
							<button className="cartBadge" onClick={() => navigate("/panier")}>
								<p className="cartText">
									🛒 {nombreArticlesPanier} | {totalPanier.toFixed(2)} €
								</p>
							</button>
							<button className="disconnectBadge" onClick={handleDeconnexion}>
								<p className="disconnectText">Se déconnecter</p>
							</button>
						</div>
					)}
				</div>
		</header>
	);
}

export default Header;
