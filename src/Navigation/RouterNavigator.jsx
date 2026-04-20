import { BrowserRouter, Routes, Route, MemoryRouter } from "react-router-dom";
import CataloguePage from "../Pages/CataloguePage.jsx"
import ConnexionFormPage from "../Pages/ConnexionFormPage.jsx";
import InscriptionFormPage from "../Pages/InscriptionFormPage.jsx";
import ProfilPage from "../Pages/ProfilPage.jsx";
import PanierPage from "../Pages/PanierPage.jsx";
import FavorisPage from "../Pages/FavorisPage.jsx";

// Si initialEntries est fourni → mode test avec MemoryRouter
// Sinon → production avec BrowserRouter
const RouterNavigator = ({ initialEntries }) => {
	const Wrapper = initialEntries ? MemoryRouter : BrowserRouter;
	const wrapperProps = initialEntries ? { initialEntries } : {};

	return (
		<Wrapper {...wrapperProps}>
			<Routes>
				<Route path="/" element={<CataloguePage />} />
				<Route path="/login" element={<ConnexionFormPage />} />
				<Route path="/inscription" element={<InscriptionFormPage />} />
				<Route path="/favoris" element={<FavorisPage />} />
				<Route path="/panier" element={<PanierPage />} />
				<Route path="/profil" element={<ProfilPage />} />
			</Routes>
		</Wrapper>
	);
};

export default RouterNavigator;
