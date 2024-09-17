// Importer la fonction de navigation au clavier depuis keyboardNavigation.js
import { setupKeyboardNavigation } from '../utils/keyboardNavigation.js';

// Cette fonction récupère les données des photographes dans le dossier JSON
async function getPhotographers() {
    try {
        // Récupération des données depuis le fichier JSON
        const response = await fetch("data/photographers.json");

        // Vérification de la validité de la réponse
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }

        // Conversion de la réponse en JSON
        const data = await response.json();

        // Retourner les données de photographes
        return { photographers: data.photographers };
    } catch (error) {
        console.error("Erreur :", error);
        return { photographers: [] };
    }
}

// Cette fonction va intégrer les données des photographes et appeler le template pour les organiser et les afficher sur la page d’accueil
async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

// Fonction d'initialisation
async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    await displayData(photographers);

    // Appeler la fonction de navigation au clavier après avoir ajouté les éléments au DOM
    setupKeyboardNavigation();
}

init();
 
