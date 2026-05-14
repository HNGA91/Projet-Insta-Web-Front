// Ce fichier gère tous les appels API vers les routes MongoDB (panier + favoris)
// L'accessToken est maintenant passé en paramètre depuis le contexte (useState)
// et non plus récupéré depuis localStorage

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

// Récupère toutes les données utilisateur (panier + favoris)
// Appelée au login ou au chargement de l'application
export const fetchUserData = async (email, accessToken) => {
	try {
		const response = await fetch(`${API_BASE_URL}/userdata/${email}`, {
			headers: {
				// Le token vient maintenant du useState, pas du localStorage
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (response.status === 401 || response.status === 403) {
			throw new Error("❌ Session expirée");
		}

		if (!response.ok) {
			throw new Error("❌ Erreur lors de la récupération des données utilisateur");
		}

		return await response.json();
	} catch (error) {
		console.error("❌ Erreur fetchUserData:", error);
		throw error;
	}
};

// Sauvegarde le panier sur le serveur
// Appelée après chaque modification du panier
export const updatePanier = async (email, panier, accessToken) => {
	try {
		const response = await fetch(`${API_BASE_URL}/userdata/${email}/panier`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			// Envoie le panier complet au back
			body: JSON.stringify({ panier }),
		});

		if (response.status === 401 || response.status === 403) {
			throw new Error("❌ Session expirée");
		}

		if (!response.ok) {
			throw new Error("❌ Erreur lors de la mise à jour du panier");
		}

		return await response.json();
	} catch (error) {
		console.error("❌ Erreur updatePanier:", error);
		throw error;
	}
};

// Sauvegarde les favoris sur le serveur
// Appelée après chaque modification des favoris
export const updateFavoris = async (email, favoris, accessToken) => {
	try {
		const response = await fetch(`${API_BASE_URL}/userdata/${email}/favoris`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			// Envoie les favoris complets au back
			body: JSON.stringify({ favoris }),
		});

		if (response.status === 401 || response.status === 403) {
			throw new Error("❌ Session expirée");
		}

		if (!response.ok) {
			throw new Error("❌ Erreur lors de la mise à jour des favoris");
		}

		return await response.json();
	} catch (error) {
		console.error("❌ Erreur updateFavoris:", error);
		throw error;
	}
};

// Supprime les données utilisateur
// Appelée à la déconnexion
export const deleteUserData = async (email, accessToken) => {
	try {
		const response = await fetch(`${API_BASE_URL}/userdata/${email}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (response.status === 401 || response.status === 403) {
			throw new Error("❌ Session expirée");
		}

		if (!response.ok) {
			throw new Error("❌ Erreur lors de la suppression des données");
		}

		return await response.json();
	} catch (error) {
		console.error("❌ Erreur deleteUserData:", error);
		throw error;
	}
};
