
let photographerMedia = [];

// Importer la fonction de navigation au clavier depuis keyboardNavigation.js
import { handleKeyboardNavigation } from '../utils/keyboardNavigation.js';
import { handleKeyboardNavigation2 } from '../utils/keyboardNavigation.js';
// Importer les fonctions de tri
import { sortByAlphabet, sortByDate } from '../utils/renderMedia.js';

// Extraire l'ID du photographe de l'URL
function getPhotographerId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Récupérer les données JSON des photographes
async function getPhotographersAndMedia() {
    try {
        const response = await fetch("data/photographers.json");
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();
        return { photographers: data.photographers, media: data.media };
    } catch (error) {
        console.error("Erreur :", error);
        return { photographers: [], media: [] };
    }
}

// Fonction pour gérer l'affichage du header du photographe
function displayPhotographerData(photographer) {
    const photographerHeader = document.querySelector(".photograph-header");
    const photographerPageModel = photographerPageTemplate(photographer);
    const headerContent = photographerPageModel.displayHeader();
    photographerHeader.appendChild(headerContent);
}

// Fonction pour afficher un média (photo ou vidéo) avec son titre, son nombre de likes et l’intégrer dans la div mediaContainer
function displayMedia(mediaItem, photographerSection, mediaItems) {
    let mediaElement;
    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('media-container');
    mediaContainer.setAttribute('role', 'group');
    mediaContainer.setAttribute('aria-label', `Media: ${mediaItem.title}, ${mediaItem.likes} likes`);

    if (mediaItem.image) {
        mediaElement = document.createElement('img');
        mediaElement.src = `assets/images/${mediaItem.image}`;
        mediaElement.alt = mediaItem.title;
        mediaElement.classList.add('img-video');
        mediaElement.tabIndex = 0;
    } else if (mediaItem.video) {
        mediaElement = document.createElement('video');
        mediaElement.controls = true;
        const source = document.createElement('source');
        source.src = `assets/images/${mediaItem.video}`;
        source.type = 'video/mp4';
        mediaElement.appendChild(source);
        mediaElement.classList.add('img-video');
        mediaElement.setAttribute('aria-label', mediaItem.title);
        mediaElement.tabIndex = 0;

        // Créer automatiquement une miniature de la vidéo
        mediaElement.addEventListener('loadeddata', () => {
            captureVideoThumbnail(mediaElement);
        });
    }

    mediaElement.addEventListener('click', () => {
        const mediaItems = document.querySelectorAll(".media-section .media-container .img-video");
        const index = Array.from(mediaItems).indexOf(mediaElement);
        showModalImage(index, mediaItems); // Ouvrir la modal avec l'image sélectionnée
    });

    const caption = document.createElement('p');
    caption.classList.add('media-title');
    caption.textContent = `${mediaItem.title}`;
    caption.setAttribute('role', 'text');

    const mediasLikes = document.createElement('p');
    mediasLikes.classList.add('media-likes');
    mediasLikes.textContent = `${mediaItem.likes} ♥`;
    mediasLikes.setAttribute('role', 'button');
    mediasLikes.setAttribute('aria-label', `J'aime: ${mediaItem.likes} likes`);

    mediasLikes.addEventListener('click', () => {
        if (!mediasLikes.classList.contains('liked')) {
            mediaItem.likes += 1;
            mediasLikes.textContent = `${mediaItem.likes} ♥`;
            mediasLikes.classList.add('liked');
            mediasLikes.setAttribute('aria-label', `J'aime: ${mediaItem.likes} likes`);
            updateTotalLikes(mediaItems);
        }
    });

    mediaContainer.appendChild(mediaElement);
    mediaContainer.appendChild(caption);
    caption.appendChild(mediasLikes);

    photographerSection.appendChild(mediaContainer);

    return { mediaElement, mediasLikes };
}

// Fonction pour capturer la miniature de la vidéo
function captureVideoThumbnail(videoElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Dimensions du canvas = dimensions de la vidéo
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Dessiner la frame de la vidéo sur le canvas (ici à 0.5 seconde)
    videoElement.currentTime = 0.5;

    videoElement.addEventListener('seeked', () => {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convertir le canvas en URL de donnée image
        const imageDataUrl = canvas.toDataURL();

        // Définir l'image générée comme poster de la vidéo
        videoElement.setAttribute('poster', imageDataUrl);
    }, { once: true });
}


// Fonction pour afficher les médias du photographe
function renderMedia(mediaItems) {
    const photographerSection = document.querySelector(".media-section");
    photographerSection.innerHTML = ''; // Vider la section des médias
    mediaItems.forEach((mediaItem) => displayMedia(mediaItem, photographerSection, mediaItems));
    updateTotalLikes(mediaItems); // Calculer le total initial des likes
}

// Fonction pour mettre à jour le total des likes
function updateTotalLikes(mediaItems) {
    const totalLikes = mediaItems.reduce((total, mediaItem) => total + mediaItem.likes, 0);
    const priceDiv = document.querySelector('.total-likes');
    priceDiv.textContent = `${totalLikes} ♥`;
    priceDiv.setAttribute('aria-label', `Total de likes: ${totalLikes}`);
}

// Ajouter la fonction de tri par popularité
const filterPopulaire = document.getElementById("Populaire-filter");
filterPopulaire.setAttribute('role', 'button');
filterPopulaire.setAttribute('aria-label', 'Trier par popularité');
filterPopulaire.addEventListener("click", function () {
    photographerMedia.sort((a, b) => b.likes - a.likes);
    renderMedia(photographerMedia);
});

// Ajouter la fonction de tri alphabétique
const filterAlphabet = document.getElementById("title-filter");
filterAlphabet.setAttribute('role', 'button');
filterAlphabet.setAttribute('aria-label', 'Trier par titre');
filterAlphabet.addEventListener("click", function () {
    const sortedMedia = sortByAlphabet(photographerMedia);
    renderMedia(sortedMedia);
});

// Ajouter la fonction de tri par date
const filterDate = document.getElementById("date-filter");
filterDate.setAttribute('role', 'button');
filterDate.setAttribute('aria-label', 'Trier par date');
filterDate.addEventListener("click", function () {
    const sortedMedia = sortByDate(photographerMedia);
    renderMedia(sortedMedia);
});

// Fonction principale d'initialisation
async function init() {
    const { photographers, media } = await getPhotographersAndMedia();
    const photographerId = getPhotographerId();
    const photographer = photographers.find(p => p.id == photographerId);

    if (photographer) {
        displayPhotographerData(photographer);
        photographerMedia = media.filter(mediaItem => mediaItem.photographerId === photographer.id); // Mise à jour de photographerMedia
        renderMedia(photographerMedia);
        document.addEventListener('keydown', handleKeyboardNavigation);
        document.addEventListener('keydown', handleKeyboardNavigation2);
    } else {
        console.error("Photographe non trouvé");
        // Afficher un message d'erreur utilisateur, si nécessaire
    }
}

init();
