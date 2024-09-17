// Sélection des éléments globaux pour la modale
const contactModal = document.getElementById("contact_modal");
const closeModalBtn = document.getElementById("close_contact_modal");

// Fonction pour ouvrir la modale
function displayModal() {
    contactModal.style.display = "block";
    trapFocusModal(); // Appel de la fonction de piège à focus ici
}

// Fonction pour fermer la modale
function closeModal() {
    contactModal.style.display = "none";
    document.querySelector(".open-modal-button").focus(); // Restaure le focus à l'élément ayant ouvert la modal
}

// Ajouter un écouteur d'événement pour le formulaire
let form = document.querySelector("form");
form.addEventListener("submit", (event) => {
    event.preventDefault();

    let balisePrenom = document.getElementById("first");
    let Prenom = balisePrenom.value;
    console.log(Prenom);

    let baliseNom = document.getElementById("last");
    let Nom = baliseNom.value;
    console.log(Nom);

    let baliseMail = document.getElementById("mail");
    let mail = baliseMail.value;
    console.log(mail);

    let baliseMessage = document.getElementById("message");
    let Message = baliseMessage.value;
    console.log(Message);
});

// Gerer navigation au clavier dans la modale de contact
// Fonction pour piéger le focus dans la modale
function trapFocusModal() {
    const focusableElements = contactModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    const previouslyFocusedElement = document.activeElement;

    firstFocusableElement.focus();

    function handleTabKey(event) {
        const isTabPressed = (event.key === 'Tab' || event.keyCode === 9);
        if (!isTabPressed) return;

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

    function handleEnterKey(event) {
        const isEnterPressed = (event.key === 'Enter' || event.keyCode === 13);
        if (isEnterPressed) {
            if (document.activeElement === closeModalBtn) {
                event.preventDefault();
                closeModal(); // Fermer la modal si Enter est pressé sur le bouton de fermeture
            } else if (document.activeElement.tagName === "BUTTON" && document.activeElement.type === "submit") {
                event.preventDefault();
                form.submit(); // Soumettre le formulaire si Enter est pressé sur le bouton "Submit"
            }
        }
    }

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEnterKey);

    // Gérer la fermeture de la modal
    function handleModalClose() {
        contactModal.style.display = "none";
        document.removeEventListener('keydown', handleTabKey);
        document.removeEventListener('keydown', handleEnterKey);
        previouslyFocusedElement.focus(); // Restaurer le focus à l'élément précédemment focalisé
    }

    closeModalBtn.addEventListener('click', handleModalClose);
}
