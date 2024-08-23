document.addEventListener("DOMContentLoaded", () => {
    const photographersSection = document.querySelector(".photographer_section");

    photographersSection.addEventListener("keydown", (e) => {
        const focusableElements = Array.from(photographersSection.querySelectorAll("article img"));
        let currentIndex = focusableElements.indexOf(document.activeElement);

        switch (e.key) {
            case "ArrowDown":
            case "ArrowRight":
                if (currentIndex < focusableElements.length - 1) {
                    currentIndex++;
                    focusableElements[currentIndex].focus();
                }
                break;
            case "ArrowUp":
            case "ArrowLeft":
                if (currentIndex > 0) {
                    currentIndex--;
                    focusableElements[currentIndex].focus();
                }
                break;
            case "Enter":
                const link = focusableElements[currentIndex].closest("article").querySelector("a");
                if (link) {
                    link.click();
                }
                break;
            default:
                break;
        }
    });
});


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


async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    displayData(photographers);
}

init();
