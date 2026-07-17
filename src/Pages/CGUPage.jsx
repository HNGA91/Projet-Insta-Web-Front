import React from "react";
import { Helmet } from "react-helmet-async";
import "../Styles/Style.css";
import Header from "../Composants/Header.jsx";
import Footer from "../Composants/Footer.jsx";
import MenuLateral1 from "../Composants/Menu/MenuLateral1.jsx";
import MenuLateral2 from "../Composants/Menu/MenuLateral2.jsx";

const CGUPage = () => {
	return (
		<>
			<Helmet>
				<title>Tech City — Conditions générales d'utilisation</title>
				<meta name="description" content="Consultez les conditions générales d'utilisation du site Tech City." />
				<meta property="og:title" content="Tech City — Conditions générales d'utilisation" />
				<meta property="og:description" content="Consultez les conditions générales d'utilisation du site Tech City." />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://techcity.com/cgu" />
			</Helmet>
			<Header />
			<main className="main-content">
				<MenuLateral1 />
				<div className="content-section">
					<div
						style={{
							backgroundColor: "#fff",
							borderRadius: "12px",
							padding: "32px",
							boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
							maxWidth: "800px",
							margin: "0 auto",
							textAlign: "left",
						}}
					>
						<h1 style={{ color: "#2c3e50", marginBottom: "70px" }}>Conditions générales d'utilisation</h1>

						<h4 style={{ color: "#09107e", marginBottom: "12px" }}>
							Conditions générales d'utilisation du site et des services proposés.
						</h4>
						<p style={{ textAlign: "left", marginBottom: "50px" }}>
							L'utilisation du site Tech-City implique l'acceptation pleine et entière des conditions générales d'utilisation ci-après
							décrites. Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment, les utilisateurs du
							site Tech-City sont donc invités à les consulter de manière régulière.
						</p>

						<h4 style={{ color: "#09107e", marginBottom: "12px" }}>Propriété intellectuelle et contrefaçons.</h4>
						<p style={{ textAlign: "left", marginBottom: "12px" }}>
							Tech-City est propriétaire des droits de propriété intellectuelle ou détient les droits d'usage sur tous les éléments
							accessibles sur le site, notamment les textes, images, graphismes, logo, icônes, sons, logiciels.
						</p>
						<p style={{ textAlign: "left", marginBottom: "12px" }}>
							Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que
							soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
						</p>
						<p style={{ textAlign: "left", marginBottom: "0" }}>
							Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme
							constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de
							Propriété Intellectuelle.
						</p>
					</div>
				</div>
				<MenuLateral2 />
			</main>
			<Footer />
		</>
	);
};

export default CGUPage;
