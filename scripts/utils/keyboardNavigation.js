// fonction de navigation clavier page index.hrml

export function setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const focusedElement = document.activeElement;
    
            // Vérifier si l'élément actif est une image
            if (focusedElement.tagName === "IMG") {
                // Trouver le lien parent le plus proche
                const link = focusedElement.closest("a");
                if (link) {
                    e.preventDefault(); // Empêcher le comportement par défaut
                    window.location.href = link.href; // Simuler la redirection du lien
                }
            }
        }
    });
}




// Fonction pour gérer la navigation au clavier sur la page photographe
export function handleKeyboardNavigation(event) {
    // Vérification de la touche "Entrée"
    if (event.key === 'Enter') {
        const activeElement = document.activeElement;

        // Vérification si l'élément actif est l'image avec la classe 'logo'
        if (activeElement.classList.contains('logo')) {
            event.preventDefault(); // Empêche le comportement par défaut
            
            // Récupère le parent <a> (qui est le lien)
            const link = activeElement.closest('a');

            if (link) {
                link.click(); // Simule un clic sur le lien
            }
        }
    }
}

export function handleKeyboardNavigation2(event) {
    // Vérification de la touche "Entrée"
    if (event.key === 'Enter') {
        const activeElement = document.activeElement;

        if (activeElement.tagName === 'IMG' || activeElement.tagName === 'VIDEO') {
            const mediaContainers = document.querySelectorAll('.media-container .img-video');
            const index = Array.from(mediaContainers).indexOf(activeElement);

            if (index !== -1) {
                showModalImage(index, mediaContainers);
            }
        }
    }
}
