import React, { useState } from 'react';

const Compteur = () => {

    // Déclaration de l'état 'compte' avec une valeur initiale de 0
    const [compte, setCompte] = useState(0);

    //Fonction pour incrémenter le compteur
    const handlerincrementer = () => {setCompte(compte+1);};

    //Fonction pour décrémenter le compteur
    const handlerdécrementer = () => {setCompte(compte-1);};

    //Fonction pour réinitialiser le compteur
    const handlerreset = () => {setCompte(0);};

    return (

        <div>
            <h2>Compteur : {compte}</h2>
            <button onClick={handlerincrementer}>Incrémenter</button>
            <br></br><br></br>
            <button onClick={handlerdécrementer}>Décrémenter</button>
            <br></br><br></br>
            <button onClick={handlerreset}>Réinitialiser</button>
            { console.log(compte)}
        </div>

    );
}

export default Compteur;