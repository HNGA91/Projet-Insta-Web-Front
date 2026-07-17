import React, { memo } from "react";
import { IoCart } from "react-icons/io5";
import "../../Styles/Style.css";
import { useNavigate } from "react-router-dom";

// URL du back sans /api — pour les images statiques
const SERVER_URL = import.meta.env.VITE_SERVER_URL.replace("/api", "");

const FavorisItem = memo(({ item, infoStock, onSupprimer, onAjouterPanier }) => {
	const navigate = useNavigate();
	const enRupture = infoStock ? infoStock.disponibilite === "rupture" || infoStock.stock <= 0 : false;

	return (
		<div
			className="articleWrapper"
			onClick={(e) => {
				if (e.target.closest("button")) return;
				navigate(`/article/${item.id_article || item._id}`);
			}}
			style={{ cursor: "pointer" }}
		>
			<div className="itemContainer">
				{/* Image — chemin vers le back (port 3000) */}
				<img
					src={`${SERVER_URL}/Images/Articles/${item.produit?.titre || item.produitTitre}/${item.image}`}
					alt={item.image_alt}
					className="image"
					style={{ objectFit: "cover", transition: "fade 400ms" }} // Transition d'image plus fluide
					onError={(e) => {
						e.target.style.display = "none";
					}}
				/>
				<div className="info" style={{ marginLeft: "12px", marginRight: "12px" }}>
					<p>{item.titre}</p>
					<p>{item.prix}€</p>
					{enRupture && <p style={{ color: "#e74c3c", fontSize: "0.8rem", margin: 0 }}>Rupture de stock</p>}
				</div>

				<div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
					<button onClick={() => onSupprimer(item._id)} className="btnMinus">
						<span style={{ color: "white", fontSize: "25px" }}>−</span>
					</button>

					<button
						onClick={() => (enRupture ? null : onAjouterPanier(item))}
						className="btnPlus"
						disabled={enRupture}
						style={{
							opacity: enRupture ? 0.4 : 1,
							cursor: enRupture ? "not-allowed" : "pointer",
						}}
						title={enRupture ? "Rupture de stock" : "Ajouter au panier"}
					>
						<IoCart name="cart" size={23} color="white" />
					</button>
				</div>
			</div>
		</div>
	);
});

export default FavorisItem;
