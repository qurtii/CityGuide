export class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('search');
        this.searchNotFound = document.querySelector('.second__search-notfound');
        this.searchClear = document.querySelector('.second__functional-clear');
    }

    debounce(func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        }
    }

    setupSearch() {
        this.searchInput.addEventListener('input', this.debounce(() => {
            const searchValue = this.searchInput.value.toLowerCase().trim();
            currentSearch = searchValue;

            if (searchValue === '') {
                cardManager.fetchCombinedCards(currentFilters, currentSortBy, currentOrder, '');
            } else {
                cardManager.fetchCombinedCards(currentFilters, currentSortBy, currentOrder, searchValue);
            }
        }, 300));
    }
}