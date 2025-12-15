import React from "react";
import { Link } from "react-router-dom";

const Menu = () => {
    return (
        <nav className='crumbs'>
            <ol>
                <li className='nav-list'><Link to="/" className='nav-link'>Accueil</Link></li>
                <li className='nav-list'><Link to="/inscription" className='nav-link'>Inscription</Link></li>
                <li className='nav-list'><a className='nav-link' href='#'>A propos</a></li>
                <li className='nav-list'><a className='nav-link' href='#'>Contact</a></li>
                <li className='nav-list'><Link to="/login" className='nav-link'>Connexion</Link></li>
            </ol>
        </nav>
    );
};

export default Menu;