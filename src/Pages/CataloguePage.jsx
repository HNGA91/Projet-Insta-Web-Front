import "../Styles/Style.css";
import Header from "../Composants/Menu/Header.jsx";
import Footer from "../Composants/Menu/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";

const CataloguePage = () => {
	return (
		<>
			<Header />
			<div className="main-content">
				<MenuLateral1 />
				<main>
					<div className="content-section">
						<h2>Page d'accueil</h2>
					</div>
				</main>
				<MenuLateral2 />
			</div>
			<Footer />
		</>
	);
}

export default CataloguePage;
