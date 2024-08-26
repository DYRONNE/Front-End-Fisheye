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

// Fonction pour afficher un média
function displayMedia(mediaItem, index, photographerSection) {
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
    }

    const caption = document.createElement('p');
    caption.classList.add('media-title');
    caption.textContent = `${mediaItem.title}`;
    caption.setAttribute('role', 'text');
    
    const mediasLikes = document.createElement('p');
    mediasLikes.classList.add('media-likes');
    mediasLikes.textContent = `${mediaItem.likes} ♥`;
    mediasLikes.setAttribute('role', 'button');
    mediasLikes.setAttribute('aria-label', `J'aime: ${mediaItem.likes} likes`);

    mediaContainer.appendChild(mediaElement);
    mediaContainer.appendChild(caption);
    caption.appendChild(mediasLikes);

    mediaElement.addEventListener("click", () => showModalImage(index, photographerSection.querySelectorAll('.media-container .img-video')));

    mediasLikes.addEventListener('click', () => {
        if (!mediasLikes.classList.contains('liked')) {
            mediaItem.likes += 1;
            mediasLikes.textContent = `${mediaItem.likes} ♥`;
            mediasLikes.classList.add('liked');
            mediasLikes.setAttribute('aria-label', `J'aime: ${mediaItem.likes} likes`);
            updateTotalLikes(photographerSection.querySelectorAll('.media-container .media-likes'));
        }
    });

    photographerSection.appendChild(mediaContainer);
}


// Fonction pour gérer l'affichage des médias du photographe
async function displayPhotographerData(photographer, media) {
    const photographerHeader = document.querySelector(".photograph-header");
    const photographerSection = document.querySelector(".media-section");
    const photographerPageModel = photographerPageTemplate(photographer);
    const headerContent = photographerPageModel.displayHeader();
    photographerHeader.appendChild(headerContent);

    // Filtrer les médias du photographe
    const photographerMedia = media.filter(mediaItem => mediaItem.photographerId === photographer.id);

    console.log("Photographer Media:", photographerMedia);

    // Fonction pour mettre à jour le total des likes
    function updateTotalLikes() {
        const totalLikes = photographerMedia.reduce((total, mediaItem) => total + mediaItem.likes, 0);
        const priceDiv = document.querySelector('.total-likes');
        priceDiv.textContent = `${totalLikes} ♥`;
        priceDiv.setAttribute('aria-label', `Total de likes: ${totalLikes}`);
    }

    // Fonction pour afficher les médias
    function renderMedia(mediaItems) {
        photographerSection.innerHTML = ''; // Vider la section des médias
        mediaItems.forEach((mediaItem, index) => displayMedia(mediaItem, index, photographerSection));
        updateTotalLikes();
    }

    // Fonction pour trier les médias par ordre alphabétique
    function sortByAlphabet(mediaItems) {
    return mediaItems.sort((a, b) => a.title.localeCompare(b.title));
}

// Fonction pour trier les médias par date
function sortByDate(mediaItems) {
    return mediaItems.sort((a, b) => new Date(b.date) - new Date(a.date));
}

    renderMedia(photographerMedia);

    // Ajouter la fonction de tri par popularité
    const filterPopulaire = document.getElementById("Populaire-filter");
    filterPopulaire.setAttribute('role', 'button');
    filterPopulaire.setAttribute('aria-label', 'Trier par popularité');
    filterPopulaire.addEventListener("click", function () {
        photographerMedia.sort((a, b) => b.likes - a.likes); // Trier par likes décroissants
        renderMedia(photographerMedia);
    });

    // Ajouter la fonction de tri alphabétique
    const filterAlphabet = document.getElementById("title-filter");
    filterAlphabet.setAttribute('role', 'button');
    filterAlphabet.setAttribute('aria-label', 'Trier par titre');
    filterAlphabet.addEventListener("click", function () {
        const sortedMedia = sortByAlphabet(photographerMedia); // Trier par ordre alphabétique
        renderMedia(sortedMedia);
    });

    // Ajouter la fonction de tri par date
    const filterDate = document.getElementById("date-filter");
    filterDate.setAttribute('role', 'button');
    filterDate.setAttribute('aria-label', 'Trier par date');
    filterDate.addEventListener("click", function () {
        const sortedMedia = sortByDate(photographerMedia); // Trier par date
        renderMedia(sortedMedia);
    });
}

// Fonction pour mettre à jour le total des likes
function updateTotalLikes() {
    const totalLikes = Array.from(document.querySelectorAll('.media-likes')).reduce((total, mediaItem) => {
        const likesText = mediaItem.textContent;
        const likes = parseInt(likesText.replace(' ♥', ''));
        return total + likes;
    }, 0);
    const priceDiv = document.querySelector('.total-likes');
    priceDiv.textContent = `${totalLikes} ♥`;
    priceDiv.setAttribute('aria-label', `Total de likes: ${totalLikes}`);
}


// Fonction pour gérer la navigation au clavier
function handleKeyboardNavigation(event) {
    const focusableElements = Array.from(document.querySelectorAll('.media-container img, .media-container video'));
    const focusedIndex = focusableElements.indexOf(document.activeElement);

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        const nextIndex = (focusedIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevIndex = (focusedIndex - 1 + focusableElements.length) % focusableElements.length;
        focusableElements[prevIndex].focus();
    } else if (event.key === 'Enter') {
        if (document.activeElement.tagName === 'IMG' || document.activeElement.tagName === 'VIDEO') {
            const mediaContainers = document.querySelectorAll('.media-container .img-video');
            const index = Array.from(mediaContainers).indexOf(document.activeElement);
            showModalImage(index, mediaContainers); // Ouvre la modal
        } else if (document.activeElement.classList.contains('media-likes')) {
            document.activeElement.click(); // Simule le clic sur les likes
        }
    }
}


// Initialisation de la page
async function init() {
    const { photographers, media } = await getPhotographersAndMedia();
    const photographerId = getPhotographerId();
    const photographer = photographers.find(p => p.id == photographerId);
    if (photographer) {
        displayPhotographerData(photographer, media);
        document.addEventListener('keydown', handleKeyboardNavigation); // Activer la navigation au clavier
    } else {
        console.error("Photographe non trouvé");
    }
}

init();
