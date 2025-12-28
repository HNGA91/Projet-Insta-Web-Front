import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../../Styles/Style.css";
import { UserContext } from "../../Context/UserContext";

const Menu = () => {
    // Accès au context
    const { isLogin, favoris } = useContext(UserContext);

    return (
		<nav className="crumbs">
			<ol>
				<li className="nav-list">
					<Link to="/" className="nav-link">
						Accueil
					</Link>
				</li>
				{!isLogin && (
					<>
						<li className="nav-list">
							<Link to="/inscription" className="nav-link">
								Inscription
							</Link>
						</li>
						{/* <li className='nav-list'><a className='nav-link' href='#'>A propos</a></li>
                <li className='nav-list'><a className='nav-link' href='#'>Contact</a></li> */}
						<li className="nav-list">
							<Link to="/login" className="nav-link">
								Connexion
							</Link>
						</li>
					</>
				)}
				{isLogin && (
					<>
						<li className="nav-list">
							<Link to="/favoris" className="nav-link">
								⭐ Mes favoris ({favoris.length})
							</Link>
						</li>
						<li className="nav-list">
							<Link to="/profil" className="nav-link">
								Mon compte
							</Link>
						</li>
					</>
				)}
			</ol>
		</nav>
	);
};

export default Menu;