import "../Styles/Style.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
	const navigate = useNavigate();

	return (
		<footer className="footer">
			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					alignItems: "center",
					flexWrap: "wrap",
					gap: "8px",
				}}
			>
				<p style={{ margin: 0 }}>&copy; 2026 Tech City Tous droits réservés.</p>
				<button
					onClick={() => navigate("/cgu")}
					style={{
						background: "none",
						border: "none",
						color: "white",
						cursor: "pointer",
						fontSize: "1rem",
						padding: 0,
					}}
				>
					Conditions générales d'utilisation
				</button>
			</div>
		</footer>
	);
};

export default Footer;
