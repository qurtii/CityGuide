export class PaginationManager {
    constructor() {
        this.isLoading = false;
        this.hasMoreData = true;
    }

    async fetchMoreCards() {
        if (this.isLoading || !this.hasMoreData) {
            return;
        }
        this.isLoading = true;

        try {
            const url = new URL('https://672b185d976a834dd02595f5.mockapi.io/cards');
            url.searchParams.append('page', cardManager.page);
            url.searchParams.append('limit', cardManager.itemsPerPage);

            if (currentSortBy) {
                url.searchParams.append('sortBy', currentSortBy);
                url.searchParams.append('order', currentOrder);
            }
            Object.keys(currentFilters).forEach(key => {
                url.searchParams.append(key, currentFilters[key]);
            });

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'content-type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Ошибка при получении данных!');
            }

            const newCards = await response.json();

            if (newCards.length === 0) {
                this.hasMoreData = false;
                return;
            }

            cardManager.cards = cardManager.cards.concat(newCards);
            cardManager.displayCards(cardManager.cards.slice(0, cardManager.page * cardManager.itemsPerPage));
            cardManager.page++;

        } catch (error) {
            console.log('Ошибка при загрузке дополнительных карточек: ' + error.message);
        } finally {
            this.isLoading = false;
        }
    }

    setupScrollListener() {
        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                this.fetchMoreCards();
            }
        });
    }
}