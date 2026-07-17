import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../Styles/Style.css";
import { UserContext } from "../../../Context/UserContext.js";
import Header from "../../../Composants/Header.jsx";
import Footer from "../../../Composants/Footer.jsx";
import MenuLateralClient from "../../../Composants/Menu/MenuLateralClient.jsx";
import MenuLateralAdmin from "../../../Composants/Menu/MenuLateralAdmin.jsx";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const AdminProduitAjouterPage = () => {
	const { accessToken } = useContext(UserContext);
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		titre: "",
		image: "",
		image_alt: "",
	});
	const [imageMode, setImageMode] = useState("url");
	const [preview, setPreview] = useState(null);
	const [erreur, setErreur] = useState("");
	const [saving, setSaving] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (!formData.titre) {
			setErreur("❌ Saisissez le titre du produit avant d'uploader une image.");
			return;
		}

		setPreview(URL.createObjectURL(file));

		const data = new FormData();
		data.append("nomProduit", formData.titre);
        data.append("image", file);

		try {
			const response = await fetch(`${API_BASE_URL}/produits/upload-image`, {
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

		if (!formData.titre) {
			setErreur("❌ Le titre est obligatoire.");
			return;
		}

		setSaving(true);
		try {
			const response = await fetch(`${API_BASE_URL}/produits`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(formData),
			});
			const result = await response.json();
			if (response.ok) {
				navigate("/admin/produits");
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
				<title>Tech City - Ajouter un produit</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<h1 style={{ textAlign: "center", marginBottom: "20px" }}>Ajouter un produit</h1>
					<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
						<button className="secondaryButton" style={{ padding: "8px 16px" }} onClick={() => navigate("/admin/produits")}>
							← Retour
						</button>
					</div>

					{erreur && <p style={{ color: "red", marginBottom: "10px" }}>{erreur}</p>}

					<form className="form" onSubmit={handleSubmit}>
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
							placeholder="Nom du produit (ex: clavier)"
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
								placeholder="nom-produit.jpg ou https://exemple.com/image.jpg"
							/>
						) : (
							<input type="file" accept="image/*" className="form-control" onChange={handleUpload} />
						)}

						{(preview || formData.image) && (
							<div style={{ margin: "10px 0" }}>
								<img
									src={preview || `/Images/Produits/${formData.image}`}
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

						<button type="submit" disabled={saving}>
							{saving ? "Enregistrement..." : "Ajouter le produit"}
						</button>
					</form>
				</div>

				<MenuLateralAdmin />
			</main>
			<Footer />
		</>
	);
};

export default AdminProduitAjouterPage;
