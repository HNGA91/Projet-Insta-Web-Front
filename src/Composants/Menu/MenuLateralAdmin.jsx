// src/Composants/Menu/MenuLateralAdmin.jsx
import { useNavigate, useLocation } from "react-router-dom";
import "../../Styles/Style.css";

const MenuLateralAdmin = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Vérifie si le chemin commence par le path du bouton
	// startsWith permet de garder le bouton actif sur /admin/articles/:id aussi
	const isActive = (path) => location.pathname.startsWith(path);

	const menuItems = [
		{ label: "Articles", path: "/admin/articles" },
		{ label: "Commandes", path: "/admin/commandes" },
		{ label: "Produits", path: "/admin/produits" },
		{ label: "Utilisateurs", path: "/admin/utilisateurs" },
	];

	return (
		<aside className="menu-lateral">
			<h3 className="menu-lateral-titre menu-lateral-titre-admin">Menu Admin</h3>
			<nav>
				<ul className="menu-lateral-liste">
					{menuItems.map((item) => (
						<li key={item.path}>
							<button
								className={`menu-lateral-btn ${isActive(item.path) ? "menu-lateral-btn-actif-admin" : ""}`}
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

export default MenuLateralAdmin;
