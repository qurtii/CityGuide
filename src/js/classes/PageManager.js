import { CardManager } from './CardManager.js'
import {FilterManager} from './FilterManager.js'
import {SortManager} from './SortManager.js'
import {SearchManager} from './SearchManager.js'
import {PaginationManager} from './PaginationManager.js'
import {DetailsManager} from './DetailsManager.js'

export class PageManager {
    constructor() {
        this.functional = document.querySelector('.second__functional');
        this.readBar = document.querySelector('.header__read-bar');
        this.detailsDiv = document.querySelector('.details');
        this.cardsPage = document.querySelector('.second__page');
    }

    setupPopstateListener() {
        window.addEventListener('popstate', (event) => {
            const state = event.state;
            if (state && state.id) {
                detailsManager.showDetails(state.id);
            } else {
                cardManager.fetchCards();
            }
        });
    }

    updatePageContent(state) {
        if (state && state.id) {
            detailsManager.showDetails(state.id);
        } else {
            fetchCards();
            this.updatePageLayout('list');
        }
    }

    updatePageLayout(type) {
        if (type === 'list') {
            this.cardsPage.style.display = 'block';
            this.functional.style.display = 'flex';
            this.readBar.style.display = 'none';
            this.detailsDiv.style.display = 'none';
        } else if (type === 'details') {
            this.cardsPage.style.display = 'none';
            this.functional.style.display = 'none';
            this.readBar.style.display = 'block';
            this.detailsDiv.style.display = 'block';
        }
    }

    async initialize() {
        const state = history.state;
        if (state && state.id) {
            detailsManager.showDetails(state.id);
        } else {
            currentSortBy = state?.sortBy || '';
            currentOrder = state?.order || '';
            currentFilters = state?.filters || {};
            const searchValue = state?.search || '';

            await cardManager.fetchCombinedCards(currentFilters, currentSortBy, currentOrder, searchValue);
            this.updatePageLayout('list');
        }
    }

    async fetchSights() {
        try {
            const response = await fetch("https://672b185d976a834dd02595f5.mockapi.io/cards");
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }
            return response.json();
        } catch (error) {
            console.error('Ошибка при загрузке достопримечательностей:', error);
            return [];
        }
    }

    renderSights(sights) {
        sights.forEach(sight => {
            const attrDiv = document.createElement('div');
            attrDiv.classList.add("details__card");
            this.cardsPage.appendChild(attrDiv);
        });
    }

    recalculateProgress() {
        const viewportHeight = window.innerHeight;
        const pageHeight = document.body.offsetHeight;
        const currentPosition = window.scrollY;
        const availableHeight = pageHeight - viewportHeight;
        const percent = (currentPosition / availableHeight) * 100;
        this.readBar.value = percent;
    }
}