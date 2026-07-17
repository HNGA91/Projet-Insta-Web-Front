import { BrowserRouter, Routes, Route, MemoryRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";

// Pages publiques
import CataloguePage from "../Pages/CataloguePage.jsx";
import ConnexionFormPage from "../Pages/ConnexionFormPage.jsx";
import InscriptionFormPage from "../Pages/InscriptionFormPage.jsx";
import PanierPage from "../Pages/PanierPage.jsx";
import FavorisPage from "../Pages/FavorisPage.jsx";
import ContactPage from "../Pages/ContactPage.jsx";
import MotDePasseOubliePage from "../Pages/MotDePasseOubliePage.jsx";
import ResetPasswordPage from "../Pages/ResetPasswordPage.jsx";
import CatalogueProduitPage from "../Pages/CatalogueProduitPage.jsx";
import ArticleDetailPage from "../Pages/ArticleDetailPage.jsx";
import CGUPage from "../Pages/CGUPage.jsx";

// Espace client
import ProfilPage from "../Pages/Client/ProfilPage.jsx";
import AdressesPage from "../Pages/Client/Adresse/AdressesPage.jsx";
import CommandesPage from "../Pages/Client/Commandes/CommandesPage.jsx";
import SecuritePage from "../Pages/Client/Securite/SecuritePage.jsx";

import PaiementSuccessPage from "../Pages/PaiementSuccessPage.jsx";
import PaiementCancelPage from "../Pages/PaiementCancelPage.jsx";

// Espace admin
import AdminArticlesPage from "../Pages/Admin/Article/AdminArticlesPage.jsx";
import AdminArticleDetailPage from "../Pages/Admin/Article/AdminArticleDetailPage.jsx";
import AdminArticleModifierPage from "../Pages/Admin/Article/AdminArticleModifierPage.jsx";
import AdminArticleAjouterPage from "../Pages/Admin/Article/AdminArticleAjouterPage.jsx";

import AdminCommandesPage from "../Pages/Admin/Commande/AdminCommandesPage.jsx";
import AdminCommandeDetailPage from "../Pages/Admin/Commande/AdminCommandeDetailPage.jsx";
import AdminCommandeModifierPage from "../Pages/Admin/Commande/AdminCommandeModifierPage.jsx";

import AdminProduitsPage from "../Pages/Admin/Produit/AdminProduitsPage.jsx";
import AdminProduitDetailPage from "../Pages/Admin/Produit/AdminProduitDetailPage.jsx";
import AdminProduitModifierPage from "../Pages/Admin/Produit/AdminProduitModifierPage.jsx";
import AdminProduitAjouterPage from "../Pages/Admin/Produit/AdminProduitAjouterPage.jsx";

import AdminUtilisateursPage from "../Pages/Admin/Utilisateur/AdminUtilisateursPage.jsx";
import AdminUtilisateurDetailPage from "../Pages/Admin/Utilisateur/AdminUtilisateurDetailPage.jsx";
import AdminUtilisateurModifierPage from "../Pages/Admin/Utilisateur/AdminUtilisateurModifierPage.jsx";

// Si initialEntries est fourni → mode test avec MemoryRouter
// Sinon → production avec BrowserRouter
const RouterNavigator = ({ initialEntries }) => {
	const Wrapper = initialEntries ? MemoryRouter : BrowserRouter;
	const wrapperProps = initialEntries ? { initialEntries } : {};

	return (
		<Wrapper {...wrapperProps}>
			<Routes>
				{/* Routes publiques */}
				<Route path="/" element={<CataloguePage />} />
				<Route path="/login" element={<ConnexionFormPage />} />
				<Route path="/inscription" element={<InscriptionFormPage />} />
				<Route path="/contact" element={<ContactPage />} />
				<Route path="/mot-de-passe-oublie" element={<MotDePasseOubliePage />} />
				<Route path="/reset-password" element={<ResetPasswordPage />} />
				<Route path="/catalogue/:nomProduit" element={<CatalogueProduitPage />} />
				<Route path="/article/:id" element={<ArticleDetailPage />} />
				<Route path="/cgu" element={<CGUPage />} />

				{/* Espace client — connecté obligatoire  */}
				<Route
					path="/favoris"
					element={
						<ProtectedRoute>
							<FavorisPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/panier"
					element={
						<ProtectedRoute>
							<PanierPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profil"
					element={
						<ProtectedRoute>
							<ProfilPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profil/adresses"
					element={
						<ProtectedRoute>
							<AdressesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profil/commandes"
					element={
						<ProtectedRoute>
							<CommandesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profil/securite"
					element={
						<ProtectedRoute>
							<SecuritePage />
						</ProtectedRoute>
					}
				/>

				{/* Paiement — connecté obligatoire */}
				<Route
					path="/paiement-success"
					element={
						<ProtectedRoute>
							<PaiementSuccessPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/paiement-cancel"
					element={
						<ProtectedRoute>
							<PaiementCancelPage />
						</ProtectedRoute>
					}
				/>

				{/* Espace admin — admin obligatoire */}
				<Route
					path="/admin/articles"
					element={
						<ProtectedRoute requireAdmin>
							<AdminArticlesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/articles/ajouter"
					element={
						<ProtectedRoute requireAdmin>
							<AdminArticleAjouterPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/articles/:id"
					element={
						<ProtectedRoute requireAdmin>
							<AdminArticleDetailPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/articles/:id/modifier"
					element={
						<ProtectedRoute requireAdmin>
							<AdminArticleModifierPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/admin/produits"
					element={
						<ProtectedRoute requireAdmin>
							<AdminProduitsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/produits/ajouter"
					element={
						<ProtectedRoute requireAdmin>
							<AdminProduitAjouterPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/produits/:id"
					element={
						<ProtectedRoute requireAdmin>
							<AdminProduitDetailPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/produits/:id/modifier"
					element={
						<ProtectedRoute requireAdmin>
							<AdminProduitModifierPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/admin/commandes"
					element={
						<ProtectedRoute requireAdmin>
							<AdminCommandesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/commandes/:reference"
					element={
						<ProtectedRoute requireAdmin>
							<AdminCommandeDetailPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/commandes/:reference/modifier"
					element={
						<ProtectedRoute requireAdmin>
							<AdminCommandeModifierPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/admin/utilisateurs"
					element={
						<ProtectedRoute requireAdmin>
							<AdminUtilisateursPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/utilisateurs/:id"
					element={
						<ProtectedRoute requireAdmin>
							<AdminUtilisateurDetailPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/utilisateurs/:id/modifier"
					element={
						<ProtectedRoute requireAdmin>
							<AdminUtilisateurModifierPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Wrapper>
	);
};

export default RouterNavigator;
