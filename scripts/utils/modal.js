// Sélection des éléments globaux pour la modale
const mediaModal = document.querySelector(".bground-modalPhoto");
const modalImg = document.querySelector(".media-modal-img");
const nextButton = document.querySelector(".photo_modal .right");
const prevButton = document.querySelector(".photo_modal .left");
const closeBtn = document.querySelector(".closeModalPhoto");

// Variable pour suivre l'index de l'image courante
let currentIndex = 0;

// Fonction pour fermer la modale
function closeMediaModal() {
    mediaModal.classList.remove('open');
    closeBtn.focus(); // Restaurer le focus sur le bouton de fermeture
    mediaModal.removeEventListener('keydown', handleKeydown); // Supprimer l'écouteur d'événements
}

// Fonction pour ouvrir la modale
function openMediaModal() {
    mediaModal.classList.add('open');
    prevButton.focus(); // Définir le focus initial sur la flèche gauche
    mediaModal.addEventListener('keydown', handleKeydown); // Ajouter l'écouteur pour la navigation clavier
    mediaModal.addEventListener('keydown', trapFocus); // Ajouter l'écouteur pour piéger le focus
}

// Fonction pour afficher une image dans la modale
function showModalImage(index, mediaItems) {
    if (index < 0 || index >= mediaItems.length) return; // Vérification des limites
    const selectedMedia = mediaItems[index];
    
    // Définir la source et le texte alternatif
    if (selectedMedia.tagName === "IMG") {
        modalImg.src = selectedMedia.src;
        modalImg.alt = selectedMedia.alt;
    } else if (selectedMedia.tagName === "VIDEO") {
        modalImg.src = selectedMedia.querySelector('source').src; // Chemin source
        modalImg.alt = selectedMedia.querySelector('source').alt || "Vidéo"; // Valeur de repli
       
    }

    currentIndex = index;
    openMediaModal(); // Afficher la modale
}

// Fonction pour naviguer vers l'image suivante
function nextImage() {
    const mediaItems = document.querySelectorAll(".media-section .media-container .img-video");
    showModalImage((currentIndex + 1) % mediaItems.length, mediaItems);
    nextButton.focus(); // Garder le focus sur le bouton "Suivant"
}

// Fonction pour naviguer vers l'image précédente
function prevImage() {
    const mediaItems = document.querySelectorAll(".media-section .media-container .img-video");
    showModalImage((currentIndex - 1 + mediaItems.length) % mediaItems.length, mediaItems);
    prevButton.focus(); // Garder le focus sur le bouton "Précédent"
}

// Fonction pour gérer les touches du clavier
function handleKeydown(event) {
    switch (event.key) {
        case 'ArrowRight': // Flèche droite
            nextImage();
            break;
        case 'ArrowLeft': // Flèche gauche
            prevImage();
            break;
        case 'Enter': // Touche Entrée
            if (document.activeElement === closeBtn) {
                closeMediaModal();
            } else if (document.activeElement === nextButton) {
                nextImage();
            } else if (document.activeElement === prevButton) {
                prevImage();
            }
            break;
        case 'Escape': // Touche Échap pour fermer la modale
            closeMediaModal();
            break;
    }
}

// Fonction pour piéger le focus dans la modale
function trapFocus(event) {
    const focusableElements = mediaModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab' || event.keyCode === 9) {
        if (event.shiftKey) { // Si Shift + Tab est pressé
            if (document.activeElement === firstFocusableElement) {
                event.preventDefault();
                lastFocusableElement.focus();
            }
        } else { // Si Tab est pressé
            if (document.activeElement === lastFocusableElement) {
                event.preventDefault();
                firstFocusableElement.focus();
            }
        }
    }
}

// Ajouter des écouteurs d'événements pour la navigation et la fermeture
nextButton.addEventListener("click", nextImage);
prevButton.addEventListener("click", prevImage);
closeBtn.addEventListener('click', closeMediaModal);
