// Composant qui protège les routes nécessitant une authentification ou un rôle spécifique
// Si la condition n'est pas remplie, redirige vers la page appropriée
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext.js";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
	const { user, loading } = useContext(UserContext);

	// Attendre que le contexte soit chargé avant de décider
	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner" />
				<p className="p-loading"> Chargement...</p>
			</div>
		);
	}

	// Utilisateur non connecté → page de connexion
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// Utilisateur connecté mais pas admin alors que la route l'exige → accueil
	if (requireAdmin && user.role !== "admin") {
		return <Navigate to="/" replace />;
	}

	// Tout est bon → afficher la page demandée
	return children;
};

export default ProtectedRoute;
