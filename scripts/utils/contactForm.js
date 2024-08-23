function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

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
})