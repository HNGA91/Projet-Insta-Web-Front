import "../Styles/Style.css";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const CataloguePage = () => {
	return (
		<>
			<Header />
			<main className="main-content">
				<MenuLateral1 />
				<div className="content-section">
					<h2>Page d'accueil</h2>
				</div>
				<MenuLateral2 />
			</main>
			<Footer />
		</>
	);
};

export default CataloguePage;
