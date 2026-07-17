import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../Styles/Style.css";
import { UserContext } from "../../../Context/UserContext.js";
import Header from "../../../Composants/Header.jsx";
import Footer from "../../../Composants/Footer.jsx";
import MenuLateralClient from "../../../Composants/Menu/MenuLateralClient.jsx";
import MenuLateralAdmin from "../../../Composants/Menu/MenuLateralAdmin.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const AdminArticleAjouterPage = () => {
	const { accessToken } = useContext(UserContext);
	const navigate = useNavigate();

	const [produits, setProduits] = useState([]);
	const [erreur, setErreur] = useState("");
	const [saving, setSaving] = useState(false);
	const [imageMode, setImageMode] = useState("url"); // "url" ou "upload"
	const [preview, setPreview] = useState(null);

	const [formData, setFormData] = useState({
		titre: "",
		marque: "",
		description: "",
		prix: "",
		stock: "",
		disponibilite: "disponible",
		id_produit: "",
		image: "",
		image_alt: "",
	});

	// Charger la liste des produits pour la liste déroulante
	useEffect(() => {
		const chargerProduits = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/produits`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				const data = await response.json();
				setProduits(data);
			} catch {
				setErreur("❌ Impossible de charger les produits.");
			}
		};
		chargerProduits();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Gestion de l'upload d'image
	const handleUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Trouver le nom du produit sélectionné pour le dossier
		const produitSelectionne = produits.find((p) => p.id_produit === parseInt(formData.id_produit));
		if (!produitSelectionne) {
			setErreur("❌ Sélectionnez un produit avant d'uploader une image.");
			return;
		}

		// Aperçu local
		setPreview(URL.createObjectURL(file));

		// Upload vers le back
		const data = new FormData();
		data.append("nomProduit", produitSelectionne.titre);
		data.append("nomArticle", formData.titre || file.name);
        data.append("image", file);

		try {
			const response = await fetch(`${API_BASE_URL}/articles/upload-image`, {
				method: "POST",
				headers: { Authorization: `Bearer ${accessToken}` },
				body: data,
			});
			const result = await response.json();
			if (response.ok) {
				setFormData((prev) => ({ ...prev, image: result.filename }));
			} else {
				setErreur(`❌ ${result.message}`);
			}
		} catch {
			setErreur("❌ Erreur lors de l'upload.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErreur("");

		// Validations
		if (!formData.titre || !formData.prix || !formData.stock || !formData.id_produit) {
			setErreur("❌ Veuillez remplir tous les champs obligatoires.");
			return;
		}

		setSaving(true);
		try {
			const response = await fetch(`${API_BASE_URL}/articles`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(formData),
			});
			const result = await response.json();
			if (response.ok) {
				navigate("/admin/articles");
			} else {
				setErreur(`❌ ${result.message}`);
			}
		} catch {
			setErreur("❌ Une erreur est survenue.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Tech City - Ajouter un article</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<h1 style={{ textAlign: "center", marginBottom: "20px" }}>Ajouter un article</h1>
					<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
						<button className="secondaryButton" style={{ padding: "8px 16px" }} onClick={() => navigate("/admin/articles")}>
							← Retour
						</button>
					</div>

					{erreur && <p style={{ color: "red", marginBottom: "10px" }}>{erreur}</p>}

					<form className="form" onSubmit={handleSubmit}>
						{/* Produit (obligatoire) */}
						<label className="form-label" htmlFor="id_produit">
							Produit (catégorie) :
						</label>
						<select id="id_produit" name="id_produit" className="form-control" value={formData.id_produit} onChange={handleChange}>
							<option value="">— Sélectionner un produit —</option>
							{produits.map((p) => (
								<option key={p.id_produit} value={p.id_produit}>
									{p.titre}
								</option>
							))}
						</select>

						<label className="form-label" htmlFor="titre">
							Titre :
						</label>
						<input
							id="titre"
							name="titre"
							type="text"
							className="form-control"
							value={formData.titre}
							onChange={handleChange}
							placeholder="Nom de l'article"
						/>

						<label className="form-label" htmlFor="marque">
							Marque :
						</label>
						<input
							id="marque"
							name="marque"
							type="text"
							className="form-control"
							value={formData.marque}
							onChange={handleChange}
							placeholder="Marque de l'article"
						/>

						{/* Image */}
						<label className="form-label">Image :</label>
						<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
							<button
								type="button"
								onClick={() => setImageMode("url")}
								style={{
									padding: "6px 14px",
									borderRadius: "4px",
									cursor: "pointer",
									border: "1px solid #ccc",
									backgroundColor: imageMode === "url" ? "#09107e" : "#fff",
									color: imageMode === "url" ? "#fff" : "#333",
								}}
							>
								URL / Chemin
							</button>
							<button
								type="button"
								onClick={() => setImageMode("upload")}
								style={{
									padding: "6px 14px",
									borderRadius: "4px",
									cursor: "pointer",
									border: "1px solid #ccc",
									backgroundColor: imageMode === "upload" ? "#09107e" : "#fff",
									color: imageMode === "upload" ? "#fff" : "#333",
								}}
							>
								Upload fichier
							</button>
						</div>

						{imageMode === "url" ? (
							<input
								id="image"
								name="image"
								type="text"
								className="form-control"
								value={formData.image}
								onChange={handleChange}
								placeholder="nom-article.jpg ou https://exemple.com/image.jpg"
							/>
						) : (
							<input type="file" accept="image/*" className="form-control" onChange={handleUpload} />
						)}

						{/* Aperçu de l'image */}
						{(preview || formData.image) && (
							<div style={{ margin: "10px 0" }}>
								<img
									src={
										preview ||
										`/Images/Articles/${produits.find((p) => p.id_produit === parseInt(formData.id_produit))?.titre}/${formData.image}`
									}
									alt="Aperçu"
									style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
									onError={(e) => {
										e.target.style.display = "none";
									}}
								/>
							</div>
						)}

						<label className="form-label" htmlFor="image_alt">
							Texte alternatif de l'image (alt) :
						</label>
						<input
							id="image_alt"
							name="image_alt"
							type="text"
							className="form-control"
							value={formData.image_alt}
							onChange={handleChange}
							placeholder="Description de l'image pour l'accessibilité"
						/>

						<label className="form-label" htmlFor="description">
							Description :
						</label>
						<textarea
							id="description"
							name="description"
							className="form-control"
							value={formData.description}
							onChange={handleChange}
							placeholder="Description de l'article"
							rows={4}
						/>

						<label className="form-label" htmlFor="stock">
							Stock :
						</label>
						<input
							id="stock"
							name="stock"
							type="number"
							min="0"
							className="form-control"
							value={formData.stock}
							onChange={handleChange}
							placeholder="0"
						/>

						<label className="form-label" htmlFor="disponibilite">
							Disponibilité :
						</label>
						<select
							id="disponibilite"
							name="disponibilite"
							className="form-control"
							value={formData.disponibilite}
							onChange={handleChange}
						>
							<option value="disponible">Disponible</option>
							<option value="indisponible">Indisponible</option>
							<option value="rupture">Rupture de stock</option>
						</select>

						<label className="form-label" htmlFor="prix">
							Prix (€) :
						</label>
						<input
							id="prix"
							name="prix"
							type="number"
							step="0.01"
							min="0"
							className="form-control"
							value={formData.prix}
							onChange={handleChange}
							placeholder="0.00"
						/>

						<button type="submit" disabled={saving}>
							{saving ? "Enregistrement..." : "Ajouter l'article"}
						</button>
					</form>
				</div>

				<MenuLateralAdmin />
			</main>
			<Footer />
		</>
	);
};

export default AdminArticleAjouterPage;
