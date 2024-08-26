// Sélection des éléments globaux pour la modale
const mediaModal = document.querySelector(".bground-modalPhoto");
const modalImg = document.querySelector(".media-modal-img");
const nextButton = document.querySelector(".photo_modal .right");
const prevButton = document.querySelector(".photo_modal .left");
const closeBtn = document.querySelector(".closeModalPhoto");

// Fonction pour fermer la modale
function closeMediaModal() {
    mediaModal.classList.remove('open');
    closeBtn.focus(); // Restaurer le focus sur le bouton de fermeture
}

// Fonction pour ouvrir la modale
function openMediaModal() {
    mediaModal.classList.add('open');
    modalImg.focus();
}

// Variable pour suivre l'index de l'image courante
let currentIndex = 0;

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

    // Piéger le focus dans la modal
    const focusableElements = mediaModal.querySelectorAll('.closeModalPhoto, .photo_modal .right, .photo_modal .left');
    const firstFocusableElement = focusableElements[0]; 
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    const previousFocusedElement = document.activeElement; // Sauvegarder l'élément précédemment focalisé

    firstFocusableElement.focus(); // Définir le focus sur le premier élément focalisable de la modal

    function trapFocus(event) {
        const isTabPressed = (event.key === 'Tab' || event.keyCode === 9);

        if (!isTabPressed) {
            return;
        }

        if (event.shiftKey) { // Si Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                event.preventDefault();
                lastFocusableElement.focus(); // Aller au dernier élément
            }
        } else { // Si Tab
            if (document.activeElement === lastFocusableElement) {
                event.preventDefault();
                firstFocusableElement.focus(); // Retour au premier élément
            }
        }
    }

    mediaModal.addEventListener('keydown', trapFocus);

    // Gérer la fermeture de la modal avec Enter
    function handleEnterKey(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            if (document.activeElement === closeBtn) {
                closeModal();
            } else if (document.activeElement === nextButton) {
                nextImage();
            } else if (document.activeElement === prevButton) {
                prevImage();
            }
        }
    }

    mediaModal.addEventListener('keydown', handleEnterKey);

    // Gérer la fermeture de la modal
    function closeModal() {
        mediaModal.classList.remove('open');
        previousFocusedElement.focus(); // Restaurer le focus à l'élément précédemment focalisé
        mediaModal.removeEventListener('keydown', trapFocus); // Supprimer l'écouteur d'événement
        mediaModal.removeEventListener('keydown', handleEnterKey); // Supprimer l'écouteur d'événement pour Enter
    }

    // Ajouter un gestionnaire d'événements pour fermer la modal
    closeBtn.addEventListener('click', closeModal);
}

// Fonction pour naviguer vers l'image suivante
function nextImage() {
    const mediaItems = document.querySelectorAll(".media-section .media-container .img-video");
    showModalImage((currentIndex + 1) % mediaItems.length, mediaItems);
}

// Fonction pour naviguer vers l'image précédente
function prevImage() {
    const mediaItems = document.querySelectorAll(".media-section .media-container .img-video");
    showModalImage((currentIndex - 1 + mediaItems.length) % mediaItems.length, mediaItems);
}

// Ajouter des écouteurs d'événements aux boutons de navigation
nextButton.addEventListener("click", nextImage);
prevButton.addEventListener("click", prevImage);

// Ajouter un écouteur d'événement au bouton de fermeture
closeBtn.addEventListener("click", closeMediaModal);
