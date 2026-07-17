import React, { useContext, useEffect, useState } from "react";
import "../../../Styles/Style.css";
import { UserContext } from "../../../Context/UserContext.js";
import Header from "../../../Composants/Header.jsx";
import Footer from "../../../Composants/Footer.jsx";
import MenuLateralClient from "../../../Composants/Menu/MenuLateralClient.jsx";
import MenuLateralAdmin from "../../../Composants/Menu/MenuLateralAdmin.jsx";
import MenuLateral2 from "../../../Composants/Menu/MenuLateral2.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const AdressesPage = () => {
	const { user, accessToken, loading } = useContext(UserContext);

	// Liste des adresses de l'utilisateur
	const [adresses, setAdresses] = useState([]);
	const [chargement, setChargement] = useState(false);
	const [erreur, setErreur] = useState("");
	const [message, setMessage] = useState("");

	// Formulaire d'ajout / modification
	const [formulaire, setFormulaire] = useState({
		rue: "",
		ville: "",
		code_postal: "",
		pays: "France",
	});

	// ID de l'adresse en cours de modification (null = mode ajout)
	const [adresseEnModification, setAdresseEnModification] = useState(null);

	// Afficher ou masquer le formulaire
	const [formulaireVisible, setFormulaireVisible] = useState(false);

	// ===== CHARGEMENT DES ADRESSES =====
	const chargerAdresses = async () => {
		if (!user) return;
		setChargement(true);
		setErreur("");

		try {
			const response = await fetch(`${API_BASE_URL}/adresses/user/${user.id_user}`, { headers: { Authorization: `Bearer ${accessToken}` } });

			if (!response.ok) throw new Error("Impossible de charger les adresses");

			const data = await response.json();
			setAdresses(data);
		} catch (err) {
			setErreur("❌ Impossible de charger vos adresses.");
		} finally {
			setChargement(false);
		}
	};

	useEffect(() => {
		chargerAdresses();
	}, [user]);

	// ===== GESTION DU FORMULAIRE =====
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormulaire((prev) => ({ ...prev, [name]: value }));
	};

	// Ouvrir le formulaire en mode ajout
	const ouvrirFormulaireAjout = () => {
		setFormulaire({ rue: "", ville: "", code_postal: "", pays: "France" });
		setAdresseEnModification(null);
		setFormulaireVisible(true);
		setMessage("");
		setErreur("");
	};

	// Ouvrir le formulaire en mode modification
	const ouvrirFormulaireModification = (adresse) => {
		setFormulaire({
			rue: adresse.rue,
			ville: adresse.ville,
			code_postal: adresse.code_postal,
			pays: adresse.pays,
		});
		setAdresseEnModification(adresse.id_adresse);
		setFormulaireVisible(true);
		setMessage("");
		setErreur("");
	};

	// Fermer le formulaire
	const fermerFormulaire = () => {
		setFormulaireVisible(false);
		setAdresseEnModification(null);
		setFormulaire({ rue: "", ville: "", code_postal: "", pays: "France" });
	};

	// ===== SOUMETTRE (AJOUT OU MODIFICATION) =====
	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setErreur("");

		// Validation simple
		if (!formulaire.rue || !formulaire.ville || !formulaire.code_postal) {
			setErreur("❌ Veuillez remplir tous les champs obligatoires.");
			return;
		}

		try {
			// Choisir la méthode selon le mode
			const method = adresseEnModification ? "PUT" : "POST";
			const url = adresseEnModification ? `${API_BASE_URL}/adresses/${adresseEnModification}` : `${API_BASE_URL}/adresses`;

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(formulaire),
			});

			const result = await response.json();

			if (response.ok) {
				setMessage(adresseEnModification ? "✅ Adresse mise à jour avec succès." : "✅ Adresse ajoutée avec succès.");
				fermerFormulaire();
				// Recharger la liste après modification
				chargerAdresses();
			} else {
				setErreur(`❌ ${result.message}`);
			}
		} catch (err) {
			setErreur("❌ Une erreur est survenue.");
		}
	};

	// ===== SUPPRIMER UNE ADRESSE =====
	const supprimerAdresse = async (id_adresse) => {
		if (!window.confirm("Voulez-vous vraiment supprimer cette adresse ?")) return;

		setMessage("");
		setErreur("");

		try {
			const response = await fetch(`${API_BASE_URL}/adresses/${id_adresse}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			const result = await response.json();

			if (response.ok) {
				setMessage("✅ Adresse supprimée.");
				chargerAdresses();
			} else {
				setErreur(`❌ ${result.message}`);
			}
		} catch (err) {
			setErreur("❌ Une erreur est survenue.");
		}
	};

	if (!user) {
		return (
			<div className="loading-container">
				<p className="error-message" style={{ fontSize: "35px" }}>
					⛔ Veuillez vous connecter pour accéder à vos adresses.
				</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner" />
				<p className="p-loading"> Chargement...</p>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>Tech City - Mes adresses</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<h1>Mes adresses</h1>

					{message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
					{erreur && <p style={{ color: "red", textAlign: "center" }}>{erreur}</p>}

					{/* Bouton pour ajouter une nouvelle adresse */}
					{!formulaireVisible && (
						<div style={{ textAlign: "center", marginBottom: "20px" }}>
							<button className="primaryButton" onClick={ouvrirFormulaireAjout}>
								Ajouter une adresse
							</button>
						</div>
					)}

					{/* Formulaire d'ajout / modification */}
					{formulaireVisible && (
						<form className="form" onSubmit={handleSubmit}>
							<h3>{adresseEnModification ? "Modifier l'adresse" : "Nouvelle adresse"}</h3>

							<label className="form-label" htmlFor="rue">
								Rue :
							</label>
							<input
								id="rue"
								name="rue"
								type="text"
								className="form-control"
								value={formulaire.rue}
								onChange={handleChange}
								placeholder="Numéro et nom de rue"
							/>

							<label className="form-label" htmlFor="ville">
								Ville :
							</label>
							<input
								id="ville"
								name="ville"
								type="text"
								className="form-control"
								value={formulaire.ville}
								onChange={handleChange}
								placeholder="Ville"
							/>

							<label className="form-label" htmlFor="code_postal">
								Code postal :
							</label>
							<input
								id="code_postal"
								name="code_postal"
								type="text"
								className="form-control"
								value={formulaire.code_postal}
								onChange={handleChange}
								placeholder="Code postal"
							/>

							<label className="form-label" htmlFor="pays">
								Pays :
							</label>
							<input
								id="pays"
								name="pays"
								type="text"
								className="form-control"
								value={formulaire.pays}
								onChange={handleChange}
								placeholder="Pays"
							/>

							<div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
								<button type="submit" className="primaryButton" style={{ flex: 1, padding: "10px" }}>
									{adresseEnModification ? "Enregistrer les modifications" : "Ajouter l'adresse"}
								</button>
								<button type="button" onClick={fermerFormulaire} className="secondaryButton" style={{ flex: 1, padding: "10px" }}>
									Annuler
								</button>
							</div>
						</form>
					)}

					{/* Liste des adresses */}
					{chargement ? (
						<div className="loading-container">
							<div className="spinner" />
							<p className="p-loading"> Chargement des adresses...</p>
						</div>
					) : adresses.length === 0 ? (
						<p style={{ textAlign: "center", color: "gray", marginTop: "30px" }}>Vous n'avez pas encore d'adresse enregistrée.</p>
					) : (
						<div className="articleWrapper">
							<div style={{ overflowX: "auto" }}>
								<table className="admin-table">
									<thead>
										<tr>
											<th>Rue</th>
											<th>Code postal</th>
											<th>Ville</th>
											<th>Pays</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{adresses.map((adresse) => (
											<tr key={adresse.id_adresse}>
												<td>{adresse.rue}</td>
												<td>{adresse.code_postal}</td>
												<td>{adresse.ville}</td>
												<td>{adresse.pays}</td>
												<td>
													<button className="btn-action-modifier" onClick={() => ouvrirFormulaireModification(adresse)}>
														Modifier
													</button>
													<button className="btn-action-supprimer" onClick={() => supprimerAdresse(adresse.id_adresse)}>
														Supprimer
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
				{user?.role === "admin" ? <MenuLateralAdmin /> : <MenuLateral2 />}
			</main>
			<Footer />
		</>
	);
};

export default AdressesPage;
