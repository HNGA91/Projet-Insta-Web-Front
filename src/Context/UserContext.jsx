import React, { createContext, useState, useCallback, useEffect, useMemo } from "react";
import { updatePanier, updateFavoris, fetchUserData } from "../Database/UserDataAPI";

//Créer un context - une sorte de "zone mémoire partagée"
export const UserContext = createContext();

//Definir le fournisseur du context
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [panier, setPanier] = useState([]);
    const [favoris, setFavoris] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastSync, setLastSync] = useState(null);

    // =============== FONCTIONS UTILISATEUR ===============

    // Vérifie si un utilisateur est connecté
    const isLogin = useMemo(() => !!user, [user]);

    // Charger l'utilisateur au démarrage
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            setLoading(true);
            const userJson = localStorage.getItem("user");
            const token = localStorage.getItem("authToken");

            if (userJson && token) {
                const userData = JSON.parse(userJson);
                setUser(userData);

                // Charger les données utilisateur depuis le serveur
                try {
                    const serverData = await fetchUserData(userData.email);
                    setPanier(serverData.panier || []);
                    setFavoris(serverData.favoris || []);
                    console.log("✅ Données utilisateur chargées:", {
                        panier: serverData.panier?.length || 0,
                        favoris: serverData.favoris?.length || 0,
                    });
                    setLastSync(Date.now());
                } catch (error) {
                    console.error("❌ Erreur lors du chargement des données utilisateur:", error);
                    setPanier([]);
                    setFavoris([]);
                }
            }
        } catch (error) {
            console.error("❌ Erreur lors du chargement de l'utilisateur:", error);
        } finally {
            setLoading(false);
        }
    };

    // Synchroniser panier et favoris avec MongoDB
    useEffect(() => {
        if (!user) return;
        if (!lastSync || Date.now() - lastSync < 5000) return;

        const syncData = async () => {
            try {
                await Promise.all([updatePanier(user.email, panier), updateFavoris(user.email, favoris)]);
                setLastSync(Date.now());
                console.log("✅ Données synchronisées avec MongoDB");
            } catch (error) {
                console.error("❌ Erreur synchronisation:", error);
            }
        };
        syncData();
    }, [panier, favoris, user]);

    // Fonction de connexion
    const login = async (userData, token) => {
        try {
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("authToken", token);
            setUser(userData);

            // Charger les données utilisateur après connexion
            const serverData = await fetchUserData(userData.email);
            setPanier(serverData.panier || []);
            setFavoris(serverData.favoris || []);
            setLastSync(Date.now());
            console.log("✅ Connexion réussie + données chargées");
        } catch (error) {
            console.error("❌ Erreur lors de la connexion:", error);
            throw error;
        }
    };

    // Fonction de déconnexion
    const logout = async () => {
        try {
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");

            // Réinitialiser les données
            setUser(null);
            setPanier([]);
            setFavoris([]);
            console.log("✅ Déconnexion réussie");
        } catch (error) {
            console.error("❌ Erreur lors de la déconnexion:", error);
        }
    };

    // =============== FONCTIONS PANIER ===============

    // Calculs panier
    const { totalPanier, nombreArticlesPanier, panierVide } =
        // Étape 1: useMemo reçoit la fonction
        useMemo(
            // Étape 2: Cette fonction entière est exécutée
            () => {
                // Étape 3: reduce() est appelé sur le panier
                // reduce() transforme un tableau en une seule valeur (le total) en "accumulant" progressivement le résultat à travers chaque élément du tableau.
                const total = panier.reduce(
                    // Étape 4: Cette fonction est appelée pour CHAQUE item du panier
                    (acc, item) =>
                        // Initialisation : acc = 0
                        acc + item.prix * (item.quantite || 1),
                    0 // Permetd'initialiser l'acc à 0 ou de retourner 0 si le panier est vide
                );
                // Optimisation du calcule du nombre d'article dans le panier
                const nombre = panier.reduce((sum, item) => sum + (item.quantite || 1), 0);
                const vide = panier.length === 0;

                return {
                    totalPanier: total,
                    nombreArticlesPanier: nombre,
                    panierVide: vide,
                };
            },
            // Étape 5: useMemo mémorise le résultat
            [panier]
        );

    // Ajouter un article (ou augmenter sa quantité)
    const ajouterAuPanier = useCallback((article) => {
        setPanier((prev) => {
            // 1. Vérifier si l'article existe déjà
            const existe = prev.find((item) => item._id === article._id);
            if (existe) {
                // 2. Si OUI : augmenter la quantité de 1
                return prev.map((item) => (item._id === article._id ? { ...item, quantite: (item.quantite || 1) + 1 } : item));
            } else {
                // 3. Si NON : ajouter nouvel article avec quantité 1
                return [...prev, { ...article, quantite: 1 }];
            }
        });
    }, []);

    // Supprimer un article (ou diminuer sa quantité)
    const supprimerDuPanier = useCallback((id) => {
        setPanier((prev) =>
            // 1. Diminuer la quantité de 1 pour l'article ciblé via l'id
            prev.map((item) => (item._id === id ? { ...item, quantite: (item.quantite || 1) - 1 } : item))
            // 2. Filtrer pour garder seulement les articles avec quantite > 0
            .filter((item) => (item.quantite || 0) > 0)
        );
    }, []);

    // Vider entièrement le panier avec confirmation avant
    const viderLePanier = useCallback(() => {
        if (window.confirm("⚠️ Voulez-vous vraiment vider le panier ?")) {
            setPanier([]);
        }
    }, []);

    // =============== FONCTIONS FAVORIS ===============

    // Fonction toggle favoris (Ajouter / Retirer)
    const toggleFavoris = useCallback(
        (article) => {
            if (!user) {
                alert("⛔ Connexion requise - Veuillez vous connecter pour ajouter aux favoris");
                return;
            }

            setFavoris((prev) => {
                // 1. Vérifier si l'article existe déjà dans parmis les favoris
                const existe = prev.some((item) => item._id === article._id);
                if (existe) {
                    // 2. Si OUI : le retire des favoris
                    return prev.filter((item) => item._id !== article._id);
                } else {
                    // 3. Si NON : l'Aajoute aux favoris
                    return [...prev, { ...article }];
                }
            });
        },
        [user]
    );

    // Retirer un article de la liste des favoris
    const supprimerDesFavoris = useCallback((id) => {
        setFavoris((prev) => prev.filter((item) => item._id !== id));
    }, []);

    return (
        <UserContext.Provider
            value={{
                // Utilisateur
                user,
                setUser,
                login,
                logout,
                loading,
                isLogin,

                // Panier
                panier,
                setPanier,
                ajouterAuPanier,
                supprimerDuPanier,
                viderLePanier,
                totalPanier,
                nombreArticlesPanier,
                panierVide,

                // Favoris
                favoris,
                setFavoris,
                toggleFavoris,
                supprimerDesFavoris,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
