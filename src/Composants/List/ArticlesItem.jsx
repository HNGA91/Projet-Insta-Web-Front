import React, { memo } from "react";
import "../../Styles/Style.css";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";

const ArticlesItem = memo(({ item, isVisible, estFavori, onToggleDescription, onToggleFavoris, onAddToCart, isLogin }) => {
	return (
		<div className="articleWrapper">
			<div className="itemContainer">
				<img src={item.image} alt={item.name} className="image" style={{ objectFit: "cover", transition: "fade 400ms" }} />

				<div className="info">
					<p style={{ fontSize: "15px" }}>{item.name}</p>
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
							<button
								className="secondaryButton"
								onClick={() => alert("Connectez-vous pour acheter", "Veuillez vous connecter pour ajouter des articles au panier")}
							>
								<p className="button-text" style={{ fontSize: "12px" }}>
									Connectez-vous pour acheter
								</p>
							</button>
						) : (
							<button onClick={() => onAddToCart(item)} className="primaryButton">
								Ajouter au panier
							</button>
						)}
					</div>
				</div>
			</div>

			<button onClick={() => onToggleDescription(item._id)} className="descriptionToggleButton">
				{isVisible ? "Masquer les détails" : "Afficher les détails"}
			</button>

			{isVisible && (
				<div className="description-container">
					<p style={{ marginBottom: "13px" }}>Description technique :</p>
					<p style={{ marginBottom: "13px" }}>
						- Matériau: Coton 100%{"\n"}- Dimensions: 30x40 cm{"\n"}- Poids: 250g{"\n"}- Couleur: Bleu marine{"\n"}- Entretien: Lavable en
						machine
					</p>
				</div>
			)}
		</div>
	);
});

export default ArticlesItem;
