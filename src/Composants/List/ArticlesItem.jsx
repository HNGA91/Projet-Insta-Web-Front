import React, { memo } from "react";
import "../../Styles/Style.css";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

// URL du back sans /api — pour les images statiques
const SERVER_URL = import.meta.env.VITE_SERVER_URL.replace("/api", "");

const ArticlesItem = memo(({ item, isVisible, estFavori, onToggleDescription, onToggleFavoris, onAddToCart, isLogin }) => {
	const navigate = useNavigate();

	return (
		<div
			className="articleWrapper"
			onClick={(e) => {
				// Ne pas naviguer si on clique sur un bouton
				if (e.target.closest("button")) return;
				navigate(`/article/${item.id_article}`);
			}}
			style={{ cursor: "pointer" }}
		>
			<div className="itemContainer">
				{/* Image — chemin vers le back (port 3000) et non le front (port 5173) */}
				<img
					src={`${SERVER_URL}/Images/Articles/${item.produit?.titre}/${item.image}`}
					alt={item.image_alt || item.titre}
					className="image"
					style={{ objectFit: "cover", transition: "fade 400ms" }}
					onError={(e) => {
						e.target.style.display = "none";
					}}
				/>

				<div className="info">
					<p style={{ fontSize: "15px" }}>{item.titre}</p>
					<p style={{ fontSize: "15px", marginTop: "4px" }}>{item.prix}€</p>
				</div>

				<div style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
					<div className="articleActions">
						{isLogin && (
							<button
								className="favoriButton"
								onClick={() => onToggleFavoris(item)}
								style={{ padding: 5, alignItems: "center", marginBottom: 8 }}
							>
								{estFavori ? <IoBookmark size={30} color="#f3c808ff" /> : <IoBookmarkOutline size={30} color="#000000ff" />}
							</button>
						)}

						{!isLogin ? (
							<button className="secondaryButton" onClick={() => navigate("/login")}>
								<p style={{ fontSize: "12px" }}>Connectez-vous pour acheter</p>
							</button>
						) : item.disponibilite === "rupture" || item.stock <= 0 ? (
							<button className="primaryButton" disabled style={{ backgroundColor: "#e74c3c", color: "white", cursor: "not-allowed" }}>
								Rupture de stock
							</button>
						) : (
							<button onClick={() => onAddToCart(item)} className="primaryButton">
								Ajouter au panier
							</button>
						)}
					</div>
				</div>
			</div>

			<button onClick={() => onToggleDescription(item.id_article)} className="descriptionToggleButton">
				{isVisible ? "Masquer les détails" : "Afficher les détails"}
			</button>

			{isVisible && (
				<div className="description-container">
					<p style={{ marginBottom: "13px" }}>Description technique :</p>
					<p style={{ marginBottom: "13px" }}>{item.description}</p>
				</div>
			)}
		</div>
	);
});

export default ArticlesItem;
