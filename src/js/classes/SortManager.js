export class SortManager {
    constructor() {
        this.currentSortBy = '';
        this.currentOrder = '';
    }

    async fetchSortedCards(sortBy, order) {
        currentSortBy = sortBy;
        currentOrder = order;

        const url = new URL('https://672b185d976a834dd02595f5.mockapi.io/cards');
        url.searchParams.append('sortBy', sortBy);
        url.searchParams.append('order', order);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Ошибка при получении данных!');
            }
            const sortedCards = await response.json();
            const cardManager = new CardManager();
            cardManager.displayCards(sortedCards);
        } catch (error) {
            console.log('Ошибка при сортировке карточек: ' + error.message);
        }
    }
}