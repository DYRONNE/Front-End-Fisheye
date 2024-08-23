// fonction factory pour affichage sur la page d´acceuil 
function photographerTemplate(data) {
    const { name, portrait, city, tagline, price, id } = data;
    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        article.setAttribute('role', 'article');
        article.setAttribute('aria-labelledby', `photographer-${id}`);

        const a = document.createElement('a');
        a.setAttribute('href', `photographer.html?id=${id}`);
        a.setAttribute('aria-label', `Voir les détails du photographe ${name}`);

        const img = document.createElement( 'img' );
        img.setAttribute("src", picture);
        img.setAttribute("alt", `Portrait de ${name}`); 
        img.setAttribute('aria-labelledby', `photographer-${id}`);
        img.tabIndex = 0;

        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        h2.id = `photographer-${id}`;
        h2.setAttribute('aria-labelledby', `photographer-${id}`);
        

        const h3 = document.createElement( 'h3' );
        h3.textContent = city;
       

        const tag = document.createElement( 'p' );
        tag.textContent = tagline;

        const prix = document.createElement('p');
        prix.classList.add('price');
        prix.textContent = `${price}€/jour`; 

        a.appendChild(img);
        article.appendChild(a);
        article.appendChild(h2);
        article.appendChild(h3);
        article.appendChild(tag);
        article.appendChild(prix);
        return (article);
    }
    return { name, picture, city, tagline, price, id, getUserCardDOM }
}

// fonction factory pour affichage des donnees photographes dans le header de la page photographe
function photographerPageTemplate(data) {
    const { name, portrait, city, tagline, price } = data;
    const picture = `assets/photographers/${portrait}`;

    function displayHeader() {
        const bannerDiv = document.querySelector('.photograph-header');
        bannerDiv.setAttribute('role', 'banner');

        const infoDiv =document.createElement('div');
        infoDiv.classList.add('info');
        infoDiv.setAttribute('role', 'region');
        infoDiv.setAttribute('aria-labelledby', 'photographer-info');

        const img = document.createElement('img');
        img.setAttribute('src', picture);
        img.setAttribute('alt', `Portrait de ${name}`);
        img.classList.add('photographer-portrait'); 
        
        const h2 = document.createElement('h2');
        h2.textContent = name;
        h2.classList.add('photographer-name'); 
        
        const h3 = document.createElement('h3');
        h3.textContent = city;
        h3.classList.add('photographer-city'); 
        
        const tag = document.createElement('p');
        tag.textContent = tagline;
        tag.classList.add('photographer-tagline'); 
        
        infoDiv.appendChild(h2);
        infoDiv.appendChild(h3);
        infoDiv.appendChild(tag)

        bannerDiv.appendChild(infoDiv);
        bannerDiv.appendChild(img);

        const nameDiv = document.querySelector('.photographer-name-contact')
        nameDiv.textContent = name;
        nameDiv.setAttribute('aria-label', `Nom du photographe : ${name}`);

        const priceDiv = document.querySelector('.price-day')
        priceDiv.textContent = `${price}€/jour`;
        priceDiv.setAttribute('aria-label', `Prix par jour : ${price}€`);


        return infoDiv;
       
    }

    return { displayHeader };
}

