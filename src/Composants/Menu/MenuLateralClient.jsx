import { useNavigate, useLocation } from "react-router-dom";
import "../../Styles/Style.css";

const MenuLateralClient = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Vérifie si le lien est actif pour le mettre en surbrillance
	const isActive = (path) => location.pathname === path;

	const menuItems = [
		{ label: "Informations personnelles", path: "/profil" },
		{ label: "Mes adresses", path: "/profil/adresses" },
		{ label: "Mes commandes", path: "/profil/commandes" },
		{ label: "Sécurité", path: "/profil/securite" },
	];

	return (
		<aside className="menu-lateral">
			<nav>
				<h3 className="menu-lateral-titre">Mon compte</h3>
				<ul className="menu-lateral-liste">
					{menuItems.map((item) => (
						<li key={item.path}>
							<button
								className={`menu-lateral-btn ${isActive(item.path) ? "menu-lateral-btn-actif" : ""}`}
								onClick={() => navigate(item.path)}
							>
								{item.label}
							</button>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
};

export default MenuLateralClient;
