export class FilterManager {
    constructor() {
        this.activeFilters = [];
        this.filtersDiv = document.getElementById("filters");
        this.currentFilters = {};
    }

    makeDiv(className) {
        const div = document.createElement('div');
        div.classList.add(className);
        return div;
    }

    makeInput(type, id, className) {
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.classList.add(className);
        return input;
    }

    makeP(className, text) {
        const p = document.createElement('p');
        p.classList.add(className);
        p.innerText = text;
        return p;
    }

    getType(data) {
        const filters = data.map(card => card.filter);
        const uniqueFilters = filters.filter((filter, index, self) =>
            index === self.findIndex(f => f.type === filter.type)
        );
        return uniqueFilters;
    }

    displayFilters(filters) {
        this.filtersDiv.innerHTML = '';

        filters.forEach(filter => {
            const filterElement = this.makeDiv("second__functional-filter");

            const input = this.makeInput('checkbox', filter.type, 'second__functional-checkbox');
            input.addEventListener('change', () => {
                if (input.checked) {
                    this.activeFilters.push(filter.type);
                } else {
                    this.activeFilters = this.activeFilters.filter(f => f !== filter.type);
                }
                this.applyFilters();
            });

            const p = this.makeP('second__functional-text', filter.text);

            filterElement.appendChild(input);
            filterElement.appendChild(p);

            this.filtersDiv.appendChild(filterElement);
        });
    }

    applyFilters() {
        if (this.activeFilters.length === 0) {
            cardManager.displayCards(cardManager.cards);
        } else {
            const filteredCards = cardManager.cards.filter(card =>
                this.activeFilters.includes(card.filter.type)
            );
            cardManager.displayCards(filteredCards);
        }
    }

    async fetchFilteredCards(filters) {
        const url = new URL('https://672b185d976a834dd02595f5.mockapi.io/cards');
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                url.searchParams.append(key, filters[key]);
            }
        });

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { 'content-type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Ошибка при получении данных!');
            }

            const filteredCards = await response.json();
            const cardManager = new CardManager();
            cardManager.displayCards(filteredCards.slice((cardManager.page - 1) * cardManager.itemsPerPage, cardManager.page * cardManager.itemsPerPage));
        } catch (error) {
            console.log('Filters error: ' + error.message);
        }
    }

    setupFilterListener() {
        this.filtersDiv.addEventListener('change', (event) => {
            this.currentFilters = {};

            document.querySelectorAll('.second__functional-checkbox').forEach(input => {
                if (input.checked) {
                    this.currentFilters[input.id] = input.value;
                }
            });

            history.pushState({ sortBy: currentSortBy, order: currentOrder, filters: this.currentFilters }, '');
            this.fetchFilteredCards(this.currentFilters);
        });
    }
}