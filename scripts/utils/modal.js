// modal.js

// Sélection des éléments globaux pour la modale
const mediaModal = document.querySelector(".bground-modalPhoto");
const modalImg = document.querySelector(".media-modal-img");
const nextButton = document.querySelector(".photo_modal .right");
const prevButton = document.querySelector(".photo_modal .left");
const closeBtn = document.querySelector(".closeModalPhoto");

// Fonction pour fermer la modale
function closeMediaModal() {
    mediaModal.classList.remove('open');
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