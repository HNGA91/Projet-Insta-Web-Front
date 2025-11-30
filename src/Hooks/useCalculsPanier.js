import React, { useContext, useMemo } from "react";
import { PanierContext } from "../Context/PanierContext";

export const useCalculsPanier = () => {
	const { panier } = useContext(PanierContext);

	return useMemo(
		// Étape 1: useMemo reçoit la fonction callback

		// Étape 2: Cette fonction entière est exécutée
		() => ({
			// Étape 3: reduce() est appelé sur le panier
			// reduce() transforme un tableau en une seule valeur (le total) en "accumulant" progressivement le résultat à travers chaque élément du tableau.
			totalPanier: panier.reduce(
				// Étape 4: Cette fonction est appelée pour CHAQUE item du panier
				(acc, item) =>
					// Initialisation : acc = 0
					acc +
					// On multiplie l'article par la quantité
					item.prix * (item.quantite || 1),
				0 // Permetd'initialiser l'acc à 0 ou de retourner 0 si le panier est vide
			),

			// Optimisation du calcule du nombre d'article dans le panier
			nombreArticlesPanier: panier.reduce((sum, item) => sum + (item.quantite || 1), 0),
			panierVide: panier.length === 0,
		}),
		// Étape 5: useMemo mémorise le résultat
		[panier]
	);
};