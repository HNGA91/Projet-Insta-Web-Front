import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../Styles/Style.css";
import { UserContext } from "../../../Context/UserContext.js";
import Header from "../../../Composants/Header.jsx";
import Footer from "../../../Composants/Footer.jsx";
import MenuLateralClient from "../../../Composants/Menu/MenuLateralClient.jsx";
import MenuLateralAdmin from "../../../Composants/Menu/MenuLateralAdmin.jsx";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const AdminUtilisateursPage = () => {
	const { user, accessToken } = useContext(UserContext);
	const navigate = useNavigate();

	const [utilisateurs, setUtilisateurs] = useState([]);
	const [recherche, setRecherche] = useState("");
	const [chargement, setChargement] = useState(false);
	const [erreur, setErreur] = useState("");
	const [message, setMessage] = useState("");

	const chargerUtilisateurs = async () => {
		setChargement(true);
		setErreur("");
		try {
			const response = await fetch(`${API_BASE_URL}/users`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			if (!response.ok) throw new Error();
			const data = await response.json();
			setUtilisateurs(data);
		} catch {
			setErreur("❌ Impossible de charger les utilisateurs.");
		} finally {
			setChargement(false);
		}
	};

	useEffect(() => {
		chargerUtilisateurs();
	}, []);

	// Empêcher un admin de se supprimer lui-même
	const supprimerUtilisateur = async (id) => {
		if (id === user.id_user) {
			Swal.fire({
				title: "Action impossible",
				text: "Vous ne pouvez pas supprimer votre propre compte.",
				icon: "error",
				confirmButtonColor: "#e74c3c",
			});
			return;
		}

		const result = await Swal.fire({
			title: "Supprimer cet utilisateur ?",
			text: "Cette action est irréversible.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#e74c3c",
			cancelButtonColor: "#aaa",
			confirmButtonText: "Oui, supprimer",
			cancelButtonText: "Annuler",
		});
		if (!result.isConfirmed) return;

		setMessage("");
		setErreur("");
		try {
			const response = await fetch(`${API_BASE_URL}/users/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const result2 = await response.json();
			if (response.ok) {
				Swal.fire({
					title: "Supprimé !",
					text: "L'utilisateur a été supprimé.",
					icon: "success",
					confirmButtonColor: "#09107e",
					timer: 2000,
					showConfirmButton: false,
				});
				chargerUtilisateurs();
			} else {
				Swal.fire({ title: "Erreur", text: result2.message, icon: "error", confirmButtonColor: "#e74c3c" });
			}
		} catch {
			Swal.fire({ title: "Erreur", text: "Une erreur est survenue.", icon: "error", confirmButtonColor: "#e74c3c" });
		}
	};

	const getBadgeRole = (role) => (
		<span
			style={{
				backgroundColor: role === "admin" ? "#e4941c" : "#3498db",
				color: "white",
				padding: "3px 8px",
				borderRadius: "12px",
				fontSize: "0.8rem",
				fontWeight: "bold",
			}}
		>
			{role === "admin" ? "Admin" : "Client"}
		</span>
	);

	const utilisateursFiltres = utilisateurs.filter((u) => u.email.toLowerCase().includes(recherche.toLowerCase()));

	return (
		<>
			<Helmet>
				<title>Tech City - Gestion dess utilisateurs</title>
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateralClient />

				<div className="content-section">
					<div className="admin-header">
						<h1>Gestion des utilisateurs</h1>
					</div>

					{message && <p style={{ color: "green", marginBottom: "10px" }}>{message}</p>}
					{erreur && <p style={{ color: "red", marginBottom: "10px" }}>{erreur}</p>}

					<input
						type="text"
						className="admin-search"
						placeholder="Rechercher un utilisateur par email..."
						value={recherche}
						onChange={(e) => setRecherche(e.target.value)}
					/>

					{chargement ? (
						<div className="loading-container">
							<div className="spinner" />
							<p className="p-loading"> Chargement...</p>
						</div>
					) : utilisateursFiltres.length === 0 ? (
						<p style={{ color: "gray", textAlign: "center", marginTop: "30px" }}>Aucun utilisateur trouvé.</p>
					) : (
						<div style={{ overflowX: "auto" }}>
							<table className="admin-table">
								<thead>
									<tr>
										<th>ID</th>
										<th>Nom</th>
										<th>Prénom</th>
										<th>Email</th>
										<th>Téléphone</th>
										<th>Rôle</th>
										<th>Inscription</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{utilisateursFiltres.map((u) => (
										<tr key={u.id_user}>
											<td>{u.id_user}</td>
											<td>{u.nom}</td>
											<td>{u.prenom}</td>
											<td>{u.email}</td>
											<td>{u.tel || "—"}</td>
											<td>{getBadgeRole(u.role)}</td>
											<td>{u.dateInscription ? new Date(u.dateInscription).toLocaleDateString("fr-FR") : "—"}</td>
											<td>
												<button className="btn-action-voir" onClick={() => navigate(`/admin/utilisateurs/${u.id_user}`)}>
													Voir
												</button>
												<button
													className="btn-action-modifier"
													onClick={() => navigate(`/admin/utilisateurs/${u.id_user}/modifier`)}
												>
													Rôle
												</button>
												<button className="btn-action-supprimer" onClick={() => supprimerUtilisateur(u.id_user)}>
													Supprimer
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				<MenuLateralAdmin />
			</main>
			<Footer />
		</>
	);
};

export default AdminUtilisateursPage;
