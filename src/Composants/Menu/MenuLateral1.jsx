import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../Styles/Style.css";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const MenuLateral1 = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [produits, setProduits] = useState([]);

	useEffect(() => {
		const charger = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}/produits`);
				const data = await res.json();
				setProduits(data);
			} catch {
				console.error("Impossible de charger les produits pour le menu");
			}
		};
		charger();
	}, []);

	const isActive = (path) => location.pathname === path;

	return (
		<aside className="menu-lateral">
			<h3 className="menu-lateral-titre">Nos produits</h3>
			<nav>
				<ul className="menu-lateral-liste">
					{produits.map((produit) => {
						const path = `/catalogue/${produit.titre.toLowerCase().replace(/\s+/g, "-")}`;
						return (
							<li key={produit.id_produit}>
								<button
									className={`menu-lateral-btn ${isActive(path) ? "menu-lateral-btn-actif" : ""}`}
									onClick={() => navigate(path, { state: { produit } })}
								>
									{produit.titre}
								</button>
							</li>
						);
					})}
				</ul>
			</nav>
		</aside>
	);
};

export default MenuLateral1;
