const API_BASE_URL = "http://localhost:3000/api";

// Récupére toutes les données utilisateur (panier + favoris)
// Au login ou au chargement de l'application renvoi { panier: [...], favoris: [...] } ou erreur
export const fetchUserData = async (email) => {
	try {
		const response = await fetch(`${API_BASE_URL}/userdata/${email}`);
		if (!response.ok) {
			throw new Error("❌ Erreur lors de la récupération des données utilisateur");
		}
		return await response.json(); // Renvoi les données si succès
	} catch (error) {
		console.error("❌ Erreur fetchUserData:", error);
		throw error; // Propage l'erreur au composant appelant
	}
};

// Sauvegarde le panier sur le serveur
// Après chaque modification du panier les données sont mises à jour ou erreur
export const updatePanier = async (email, panier) => {
	try {
		const response = await fetch(`${API_BASE_URL}/userdata/${email}/panier`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ panier }), // Envoie le panier complet
		});

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
// Après chaque modification des favoris les données sont mises à jour ou erreur
export const updateFavoris = async (email, favoris) => {
	try {
		const response = await fetch(`${API_BASE_URL}/userdata/${email}/favoris`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ favoris }), // Envoie les favoris complets
		});

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
export const deleteUserData = async (email) => {
	try {
		const response = await fetch(`${API_BASE_URL}/userdata/${email}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			throw new Error("❌ Erreur lors de la suppression des données");
		}

		return await response.json();
	} catch (error) {
		console.error("❌ Erreur deleteUserData:", error);
		throw error;
	}
};
