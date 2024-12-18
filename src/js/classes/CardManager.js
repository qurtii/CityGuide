class CardManager {
    constructor(){
        this.itemsPerPage = 4;
        this.page = 1;
        this.cards = [];
    }

    makeCard(card) {
        const cardDiv = document.createElement('div');
        cardDiv.style.cursor = 'pointer';
        const cardImg = document.createElement('img');
        cardImg.src = card.img;
        cardImg.alt = card.name;
        cardImg.id = card.name;
        cardImg.classList.add('second__card-img');
        const cardTitle = document.createElement('p');
        cardTitle.textContent = card.name;
        cardTitle.classList.add('second__card-title');
        cardDiv.appendChild(cardImg);
        cardDiv.appendChild(cardTitle);
        cardDiv.onclick = () => openDetails(card.id);
        return cardDiv;
    }
    displayCards(cards){
        const cardsPage = document.querySelector('.second__page');
        cardsPage.innerHTML = '';
        
    }
}