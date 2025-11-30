import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import CataloguePage from "../Pages/CataloguePage.jsx"
import ConnexionFormPage from "../Pages/ConnexionFormPage.jsx";
import InscriptionFormPage from "../Pages/InscriptionFormPage.jsx";

function Controller() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<CataloguePage />} />
				<Route path="/login" element={<ConnexionFormPage />} />
				<Route path="/inscription" element={<InscriptionFormPage />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default Controller;
