import {FilterManager} from './FilterManager.js'
import {SortManager} from './SortManager.js'
import {SearchManager} from './SearchManager.js'
import {PaginationManager} from './PaginationManager.js'
import {DetailsManager} from './DetailsManager.js'
import {PageManager} from './PageManager.js'

export class CardManager {
    constructor() {
        this.itemsPerPage = 4;
        this.page = 1;
        this.cards = [];
    }

    // Создание карточки
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

    // Отображение карточек
    displayCards(cards) {
        const cardsPage = document.querySelector('.second__page');
        cardsPage.innerHTML = '';

        const cardsUl = document.createElement('ul');
        cardsUl.classList.add('second__card-list');

        cards.forEach(card => {
            cardsUl.appendChild(this.makeCard(card));
        });

        cardsPage.appendChild(cardsUl);
    }

    // Загрузка карточек
    async fetchCards() {
        try {
            const response = await fetch('https://672b185d976a834dd02595f5.mockapi.io/cards');
            if (!response.ok) {
                throw new Error('Ошибка при получении данных!');
            }
            this.cards = await response.json();

            this.displayCards(this.cards.slice((this.page - 1) * this.itemsPerPage, this.page * this.itemsPerPage));

            filterManager.displayFilters(filterManager.getType(this.cards));
        } catch (error) {
            console.log('Ошибка при загрузке карточек: ' + error.message);
        }
    }

    async fetchCombinedCards(filters = {}, sortBy = '', order = '', searchValue = '') {
        const url = new URL('https://672b185d976a834dd02595f5.mockapi.io/cards');

        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                url.searchParams.append(key, filters[key]);
            }
        });

        if (sortBy) {
            url.searchParams.append('sortBy', sortBy);
            url.searchParams.append('order', order);
        }

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { 'content-type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Ошибка при получении данных!');
            }

            let cards = await response.json();

            // Применяем поиск
            if (searchValue) {
                cards = cards.filter(card =>
                    card.name.toLowerCase().includes(searchValue.toLowerCase())
                );
            }

            this.displayCards(cards.slice((this.page - 1) * this.itemsPerPage, this.page * this.itemsPerPage));
        } catch (error) {
            console.log('Ошибка при загрузке данных: ' + error.message);
        }
    }
}

