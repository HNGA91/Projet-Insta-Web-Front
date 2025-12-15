import { BrowserRouter, Routes, Route } from "react-router-dom";
import CataloguePage from "../Pages/CataloguePage.jsx"
import ConnexionFormPage from "../Pages/ConnexionFormPage.jsx";
import InscriptionFormPage from "../Pages/InscriptionFormPage.jsx";

const RouterNavigator = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<CataloguePage />} />
				<Route path="/login" element={<ConnexionFormPage />} />
				<Route path="/inscription" element={<InscriptionFormPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default RouterNavigator;
