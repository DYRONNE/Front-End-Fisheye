// Fonction pour trier les médias par ordre alphabétique
export function sortByAlphabet(mediaItems) {
    return mediaItems.sort((a, b) => a.title.localeCompare(b.title));
    }

 // Fonction pour trier les médias par date
export function sortByDate(mediaItems) {
    return mediaItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

