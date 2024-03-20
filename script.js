//const key = "bedc5c25208d43948a9b430602d671c6" //
function searchAndCreate()
{
    let ricercaTxt = document.getElementById("RicercaNotiziaTxt").value; 
    console.log(document.getElementById("RicercaNotiziaTxt").value)
    let apiUrl = `http://localhost:3000/api/${ricercaTxt}/${todaystring}`;
    console.log(apiUrl)
    document.getElementById("articleContainer").innerHTML = "";
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data.articles.forEach(article => {
            // Controlla se l'articolo esiste già nella struttura dati in base all'URL
            const exists = Dati.some(existingArticle => existingArticle.url === article.url);
            if (!exists) {
                article.source.id = keyLocal;
                article.Preferito = false;
                article.RicercheUsate = [];
                article.RicercheUsate.push(ricercaTxt)
                Dati.push(article);
                keyLocal++;
                createArticleCard(article);
            }
        });
        console.log(Dati);
        console.log(keyLocal);
        updateLocalStorage()
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function createArticleCard(article) {
    // Crea gli elementi HTML per la card
    const card = document.createElement('div');
    card.classList.add('card');
    
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'd-flex', 'flex-column');
    
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = article.title;
    
    const description = document.createElement('p');
    description.classList.add('card-text');
    description.textContent = article.description;
    
    // Aggiungi l'immagine
    const image = document.createElement('img');
    image.classList.add('card-img-top');
    image.style.maxWidth = '100%'; // Applica uno stile CSS per ridurre le dimensioni dell'immagine
    image.style.height = 'auto'; // Assicurati che l'immagine mantenga l'aspetto corretto
    image.src = article.urlToImage;
    image.alt = 'Article Image';
    
    const link = document.createElement('a');
    link.classList.add('btn', 'btn-primary', 'mt-auto', 'w-100'); // Aggiungi la classe Bootstrap 'w-100' per impostare la larghezza del link al 100%
    link.href = article.url;
    link.textContent = 'Read More';
    // Imposta il target del link per aprire il link in una nuova scheda
    link.target = '_blank';
    
    // Crea un div per il contenitore della checkbox e della scritta "Preferito"
    const favoriteContainer = document.createElement('div');
    favoriteContainer.classList.add('d-flex', 'justify-content-end', 'align-items-center'); // Allinea gli elementi a destra e al centro verticalmente
    
    // Aggiungi la checkbox "Preferiti"
    const favoriteCheckbox = document.createElement('input');
    favoriteCheckbox.setAttribute('type', 'checkbox');
    favoriteCheckbox.setAttribute('name', 'favoriteCheckbox');
    favoriteCheckbox.value = article.id
    favoriteCheckbox.classList.add('mt-2', 'mr-2'); // Aggiungi margine top e destra per separare dalla parte inferiore e dalla scritta "Preferito"
    favoriteCheckbox.checked = article.Preferito

favoriteCheckbox.addEventListener('change', function(event) {
        const id = article.source.id; // Ottieni l'ID dell'articolo associato alla checkbox
        const isChecked = event.target.checked; // Ottieni lo stato della checkbox

        // Trova l'articolo corrispondente nella struttura Dati
        let articleToUpdate = Dati.find(article => article.source.id === id);

        // Imposta il valore di 'Preferito' in base allo stato della checkbox
        if (articleToUpdate) {
            articleToUpdate.Preferito = isChecked;
            updateLocalStorage(); // Aggiorna il localStorage dopo la modifica
        }
    });



    // Aggiungi la scritta "Preferito"
    const favoriteLabel = document.createElement('label');
    favoriteLabel.textContent = 'Preferito';
    
    // Aggiungi gli elementi al contenitore della checkbox e della scritta "Preferito"
    favoriteContainer.appendChild(favoriteCheckbox);
    favoriteContainer.appendChild(favoriteLabel);
    
    // Aggiungi gli elementi alla card
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(image);
    cardBody.appendChild(link);
    cardBody.appendChild(favoriteContainer); // Aggiungi il contenitore della checkbox e della scritta "Preferito" alla card
    
    card.appendChild(cardBody);
    
    // Aggiungi la card all DOM
    const cardContainer = document.getElementById('articleContainer');
    cardContainer.appendChild(card);
}

function loadArticlesFromLocalStoragePreferiti() {
    // Rimuovi tutte le card attualmente presenti nel contenitore
    clearArticleCards(false);

    // Leggi gli elementi dal localStorage e crea le card solo per gli articoli preferiti
    for (let i = 0; i < localStorage.length; i++) {
        const article = JSON.parse(localStorage.getItem(i));
        if (article.Preferito) { // Verifica se l'articolo è preferito
            Dati.push(article)
            createArticleCard(article);
        }
    }

    console.log('Favorite articles loaded from local storage.');
}


function updateLocalStorage() {
    localStorage.clear(); // Rimuovi tutti gli elementi nel local storage

    // Aggiungi tutti gli elementi dalla struttura Dati al local storage
    Dati.forEach((article, index) => {
        localStorage.setItem(index, JSON.stringify(article));
    });

    console.log('Local storage updated.');
}

document.addEventListener('DOMContentLoaded', function() {

    function loadArticlesFromLocalStorage() {
        // Rimuovi tutte le card attualmente presenti nel contenitore
        const cardContainer = document.getElementById('articleContainer');
        cardContainer.innerHTML = '';
    
        // Leggi gli elementi dal localStorage e crea le card per ciascun elemento
        for (let i = 0; i < localStorage.length; i++) {
            const article = JSON.parse(localStorage.getItem(i));
            Dati.push(article)
            createArticleCard(article);
        }
    
        console.log('Articles loaded from local storage.');
    }
    
    // Chiama la funzione per caricare gli articoli dal localStorage all'avvio dell'applicazione
    loadArticlesFromLocalStorage();
    
    
});
//
let keyLocal = 0;
var today = new Date();
var Dati = []
// Go back 3 months
today.setMonth(today.getMonth() - 1);
let year = today.getFullYear().toString().slice(2); // Ottieni l'anno con due cifre
let month = ("0" + (today.getMonth() + 1)).slice(-2); // Ottieni il mese con due cifre, aggiungi 1 perché il mese parte da 0
let day = ("0" + today.getDate()).slice(-2); // Ottieni il giorno con due cifre
let todaystring = year + "-" + month + "-" + day; // Formatta la data
// fetch(`http://localhost:3000/api/inter/${todaystring}`)
// .then(response => {
//     if (!response.ok) {
//             throw new Error('Network response was not ok');
//     }
//     return response.json();
// })
// .then(data => {
//     console.log(data);
//     data.articles.forEach(article => {
//         // Controlla se l'articolo esiste già nella struttura dati in base all'URL
//         const exists = Dati.some(existingArticle => existingArticle.url === article.url);
//         if (!exists) {
//             article.source.id = keyLocal;
//             article.Preferito = false;
//             article.RicercheUsate = [];
//             article.RicercheUsate.push("inter");
//             Dati.push(article);
//             keyLocal++;
//             createArticleCard(article);
//         }
//     });
//     console.log(Dati);
//     console.log(keyLocal);
//     updateLocalStorage();
// })
// .catch(error => {
//     console.error('Error:', error);
// });



function clearArticleCards(Reset = true) {
    const cardContainer = document.getElementById('articleContainer');
    cardContainer.innerHTML = '';
    if(Reset)
    {
        Dati = []; // Resetta anche l'array di dati
    }
    console.log('Article cards cleared.');
}

function searchInLocalStorage() {
    clearArticleCards();
    const ricercaTxt = document.getElementById("RicercaNotiziaTxt").value;
    let foundInLocalStorage = false;

    // Controlla se la ricerca è già stata fatta e salvata nel local storage
    for (let i = 0; i < localStorage.length; i++) {
        const article = JSON.parse(localStorage.getItem(i));
        if (article && article.RicercheUsate && article.RicercheUsate.includes(ricercaTxt)) {
            foundInLocalStorage = true;
            break;
        }
    }

    if (foundInLocalStorage) {
        // Se la ricerca è già stata fatta, carica gli articoli corrispondenti dal local storage
        loadArticlesFromLocalStorageForSearch(ricercaTxt);
    }
}

function loadArticlesFromLocalStorageForSearch(ricercaTxt) {
    // Rimuovi tutte le card attualmente presenti nel contenitore
    clearArticleCards();

    // Carica gli articoli dal local storage che corrispondono alla ricerca
    for (let i = 0; i < localStorage.length; i++) {
        const article = JSON.parse(localStorage.getItem(i));
        if (article && article.RicercheUsate && article.RicercheUsate.includes(ricercaTxt)) {
            Dati.push(article);
            createArticleCard(article);
        }
    }

    console.log('Articles loaded from local storage for search: ' + ricercaTxt);
}
