import React, { useState, useEffect } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RouterNavigator from "./src/Navigation/RouterNavigator.jsx";
import { UserProvider } from "./src/Context/UserContext.jsx";
import { ArticleProvider } from "./src/Context/ArticleContext.jsx";
import { HelmetProvider } from "react-helmet-async";

const rootElement = document.getElementById("root");

const BannereCookies = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const consent = localStorage.getItem("techcity_consent");
		if (!consent) setVisible(true);
	}, []);

	const accepter = () => {
		localStorage.setItem("techcity_consent", "accepted");
		setVisible(false);
	};

	const refuser = () => {
		localStorage.setItem("techcity_consent", "declined");
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<div
			style={{
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
				backgroundColor: "#2c3e50",
				color: "white",
				padding: "16px 24px",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				flexWrap: "wrap",
				gap: "12px",
				zIndex: 9999,
				fontSize: "14px",
			}}
		>
			<span>
				Ce site utilise des cookies pour améliorer votre expérience.{" "}
				<span style={{ fontSize: "12px", color: "#aaa" }}>
					Ils sont nécessaires au bon fonctionnement de l'authentification et du panier.
				</span>
			</span>
			<div style={{ display: "flex", gap: "10px" }}>
				<button
					onClick={accepter}
					style={{
						backgroundColor: "#09107e",
						color: "white",
						border: "none",
						borderRadius: "4px",
						padding: "8px 16px",
						fontWeight: "bold",
						cursor: "pointer",
					}}
				>
					J'accepte
				</button>
				<button
					onClick={refuser}
					style={{
						backgroundColor: "#e74c3c",
						color: "white",
						border: "none",
						borderRadius: "4px",
						padding: "8px 16px",
						cursor: "pointer",
					}}
				>
					Je refuse
				</button>
			</div>
		</div>
	);
};

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<HelmetProvider>
				<UserProvider>
					<ArticleProvider>
						<RouterNavigator />
						<BannereCookies />
					</ArticleProvider>
				</UserProvider>
			</HelmetProvider>
		</StrictMode>,
	);
}

/*
 * Project: MyprojectWebFrontend
 * Author: Hervé N'Goma
 * GitHub: https://github.com/HNGA91/Projet-Insta-Web-Front
 * GitLab: https://gitlab.com/myprojectwebfullstack/myprojectwebfrontend
 * License: MIT
 */