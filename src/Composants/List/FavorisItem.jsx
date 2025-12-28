import React, { memo } from "react";
import { IoCart } from "react-icons/io5";
import "../../Styles/Style.css";

const FavorisItem = memo(({ item, onSupprimer, onAjouterPanier }) => {
	return (
		<div className="articleWrapper">
			<div className="itemContainer">
				<img
					src={item.image}
					alt={item.name}
					className="image"
					style={{ objectFit: "cover", transition: "fade 400ms" }} // Transition d'image plus fluide
				/>
				<div className="info" style={{ marginLeft: "12px", marginRight: "12px" }}>
					<p>{item.name}</p>
					<p>{item.prix}€</p>
				</div>

				<div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
					<button onClick={() => onSupprimer(item._id)} className="btnMinus">
						<span style={{ color: "white", fontSize: "25px" }}>−</span>
					</button>

					<button onClick={() => onAjouterPanier(item)} className="btnPlus">
						<IoCart name="cart" size={23} color="white" />
					</button>
				</div>
			</div>
		</div>
	);
});

export default FavorisItem;
