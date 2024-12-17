// Глобальные переменные
const itemsPerPage = 4;
let page = 1;
let cards = [];
let isLoading = false;
let hasMoreData = true;
let currentSortBy = ''; 
let currentOrder = ''; 
let currentFilters = {}; 
let activeFilters = []; 




class CardManager {
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



class FilterManager {
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
            cardManager.displayCards(cardManager.cards.slice(0, cardManager.itemsPerPage));
        } else {
            const filteredCards = cardManager.cards.filter(card =>
                this.activeFilters.includes(card.filter.type)
            );
            cardManager.displayCards(filteredCards.slice(0, cardManager.itemsPerPage)); 
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

    // Обработчик изменения фильтров
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

class SortManager {
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
const sortManager = new SortManager();

class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('search');
        this.searchNotFound = document.querySelector('.second__search-notfound');
        this.searchClear = document.querySelector('.second__functional-clear');
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
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


class PaginationManager {
    constructor() {
        this.isLoading = false;
        this.hasMoreData = true;
    }

    // infinity scroll
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


function resetFilters() {
    activeFilters = []; 
    document.querySelectorAll('.second__functional-checkbox').forEach(input => {
        input.checked = false; 
    });
}



const cardsPage = document.querySelector('.second__page');


// Обработчики для сортировки

const firstText = document.querySelector('.second__functional-text1');
document.querySelector('.second__functional-sorting_1').addEventListener('click', () => {
    if (firstText.classList.contains('active')) {
        firstText.classList.remove('active');
        cardManager.fetchCards(); 
        resetFilters(); 
    } else {
        firstText.classList.add('active');
        sortManager.fetchSortedCards('popularity', 'desc');
        secondText.classList.remove('active');
        thirdText.classList.remove('active');
    }
});


const secondText = document.querySelector('.second__functional-text2');
document.querySelector('.second__functional-sorting_2').addEventListener('click', () => {
    if (secondText.classList.contains('active')) {
        secondText.classList.remove('active');
        cardManager.fetchCards(); 
        resetFilters(); 
    } else {
        secondText.classList.add('active');
        sortManager.fetchSortedCards('name', 'asc');
        firstText.classList.remove('active');
        thirdText.classList.remove('active');
    }
});

const thirdText = document.querySelector('.second__functional-text3');
document.querySelector('.second__functional-sorting_3').addEventListener('click', () => {
    if (thirdText.classList.contains('active')) {
        thirdText.classList.remove('active');
        currentSortBy = 'UniqNum';
        currentOrder = 'desc';
        cardManager.fetchCards(); 
        resetFilters(); 
    } else {
        thirdText.classList.add('active');
        sortManager.fetchSortedCards('name', 'desc');
        firstText.classList.remove('active');
        secondText.classList.remove('active');
    }
});

const sortOptions = document.querySelector('.second__functional-sort');
const optionsList = document.querySelector('.second__functional-list');

sortOptions.onclick = function () {
    optionsList.classList.contains('second__functional-list-close') ? 
        (optionsList.classList.remove('second__functional-list-close'), optionsList.classList.add('second__functional-list-open'))
        : (optionsList.classList.remove('second__functional-list-open'), optionsList.classList.add('second__functional-list-close'));
};




class DetailsManager {
    constructor() {
        this.detailsDiv = document.querySelector('.details');
        this.functional = document.querySelector('.second__functional');
        this.readBar = document.querySelector('.header__read-bar');
        this.cardsPage = document.querySelector('.second__page');
    }

    // Отображение деталей карточки
    async showDetails(sightId) {
        const sights = await fetchSights();
        const sight = sights.find(a => a.id === sightId);
        if (sight) {
            sight.count += 1;

            this.currentSight = sight;
            try {
                const response = await fetch(`https://672b185d976a834dd02595f5.mockapi.io/cards/${sightId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sight)
                });

                if (!response.ok) {
                    throw new Error('Ошибка при обновлении данных на сервере');
                }

                console.log('Данные успешно обновлены на сервере');
            } catch (error) {
                console.error('Ошибка при обновлении данных:', error);
            }

            // Обновляем URL
            history.pushState({ id: sightId }, '', `/id/${sightId}`);
            window.addEventListener('scroll', () => pageManager.recalculateProgress());
            window.addEventListener('resize', () => pageManager.recalculateProgress());
            this.updatePageLayout('details');

            this.detailsDiv.innerHTML = `
                <div class='details__images-wrapper'> 
                    <div class='details__images'> 
                        <p class='details__slider-btn details__previus' id='back'> &larr; </p>
                        <img class ='details__slider-img' src='${sight.images[0]}' alt='img'>
                        <p class='details__slider-btn details__next' id='next'> &rarr; </p>
                    </div>
                </div>

                <div class="details__header">
                    <a href="#" class='details__back-btn'> ← Назад </a>
                    <div class="details__header_reviews">
                        <img src="${sight.icon}" alt="image" class="details__header_reviews-img">
                        <p class="details__header_reviews-count">${sight.count }</p>
                    </div>
                </div>
                <div class="details__block">            
                    <h1>${sight.name}</h1>
                    <div class='details__details-part'>
                        <p class="details__text">${sight.About[0]}</p>
                        <img src="${sight.images[0]}" alt="Image" onclick='openImagesSlider()' class="details__img" data-id="${sight.id}">
                    </div>
                    <div class='details__details-part adaptiv'>
                        <img src="${sight.images[1]}" onclick='openImagesSlider()' alt="Image" class="details__img" data-id="${sight.id}">
                        <p class="details__text">${sight.About[1]}</p>
                    </div>
                    <h2>Достопримечательность на карте</h2>
                    <iframe src="${sight.Map}" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    
                    <h2>Отзывы</h2>
                    <div class='details__createComment' id='createComment' data-id="${sight.id}"> 
                        <form class='details__inputs'>
                            <input minlength='2' maxlength="33" placeholder='Ваше имя' class='details__nameInput' id="reviewName" required>
                            <textarea maxlength="650" placeholder='Введите сообщение' class='details__textInput' id="reviewText" required></textarea>
                        </form>
                        <div class='details__hr' id='detailsHr'> </div>
                        <div class='details__buttons'>
                            <button class='details__btn' id='cancelReview'> Отмена </button>
                            <button class='details__btn' type="submit" id="submitReview"> Оставить комментарий </button>
                        </div>
                    </div>
                    <div class='details__allComments'></div>
            `;

            this.setupDetailsListeners();
            this.loadReviews(sight.id);
        }        
    }

    // Загрузка отзывов
    loadReviews(attractionId) {
        fetch(`https://672b185d976a834dd02595f5.mockapi.io/cards/${attractionId}`)
            .then(response => response.json())
            .then(data => {
                const reviewsContainer = document.querySelector('.details__allComments');
                reviewsContainer.innerHTML = '';
    
                if (data.reviews) {
                    data.reviews.forEach(review => {
                        const reviewElement = document.createElement('div');
                        reviewElement.classList.add('details__comment');
                        reviewElement.innerHTML = `
                            <img src="https://live.staticflickr.com/65535/54192929955_ce85969884_o.png" alt="avatar" class='details__comment-img'>
                            <div class='details__comment-info'> 
                                <div class='details__comment-header'>
                                    <div class='details__comment-name'>${review.name}</div>
                                    <div class='details__comment-date'>${new Date(review.createdAt).toLocaleString('ru-RU', options)}</div>
                                </div>
                                <div class='details__comment-text'>${review.text}</div>
                            </div>
                        `;
                        reviewsContainer.appendChild(reviewElement);
                    });
                } else {
                    reviewsContainer.innerHTML = '<p>Пока нет отзывов.</p>';
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке отзывов:', error);
            });
    }
    
    setupDetailsListeners() {
        document.querySelector('.details__inputs').addEventListener('click', () => {
            document.querySelector("#detailsHr").classList.add('active');
            document.querySelector('.details__buttons').style.display = 'flex';
        });
    
        document.getElementById('cancelReview').addEventListener('click', () => {
            document.querySelector('.details__inputs').reset();
            document.querySelector('.details__buttons').style.display = 'none';
            document.querySelector("#detailsHr").classList.remove('active');
        });
    
        document.getElementById('reviewText').addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
    
            if (document.getElementById('reviewText').value.length > 0) {
                document.getElementById('submitReview').classList.add('active');
            } else {
                document.getElementById('submitReview').classList.remove('active');
            }
        });


        document.getElementById('submitReview').addEventListener('click', async (event) => {
            event.preventDefault();
    
            const attractionId = this.currentSight.id;
            const reviewName = document.getElementById('reviewName').value;
            const reviewText = document.getElementById('reviewText').value;
    
            try {
                const response = await fetch(`https://672b185d976a834dd02595f5.mockapi.io/cards/${attractionId}`, {
                    method: 'GET'
                });
    
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных достопримечательности');
                }
    
                const data = await response.json();
    
                if (!data.reviews) {
                    data.reviews = [];
                }
                data.reviews.push({
                    id: new Date().getTime(), 
                    name: reviewName,
                    text: reviewText,
                    createdAt: new Date().toISOString(),
                });
    
                const putResponse = await fetch(`https://672b185d976a834dd02595f5.mockapi.io/cards/${attractionId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
    
                if (!putResponse.ok) {
                    throw new Error('Ошибка при отправке отзыва');
                }
    
                document.querySelector('.details__inputs').reset();
                document.querySelector('.details__buttons').style.display = 'none';
                document.querySelector("#detailsHr").classList.remove('active');
                document.getElementById('submitReview').classList.remove('active');
    
                // Обновляем отзывы
                this.loadReviews(attractionId);
    
                console.log('Отзыв успешно добавлен');
            } catch (error) {
                console.error('Ошибка при добавлении отзыва:', error);
            }
        });
    }
    // Обновление макета страницы
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
        // Открытие слайдера изображений
    openImagesSlider(sight) {
        if (!sight) {
            console.error('Переменная sight не определена');
            return;
        }
        const imagesSlider = document.querySelector('.details__images-wrapper');
        if (imagesSlider) {
            imagesSlider.style.display = 'flex';
            document.body.style.overflowY = 'hidden';
            document.body.style.overflowX = 'hidden';

            imagesSlider.addEventListener('click', function (event) {
                if (event.target === imagesSlider) {
                    imagesSlider.style.display = 'none';
                    document.body.style.overflowY = 'auto';
                }
            });

            const sliderNext = imagesSlider.querySelector('#next');
            const sliderPrev = imagesSlider.querySelector('#back');
            let currentImageIndex = 0;

            function updateImage() {
                const imgElement = imagesSlider.querySelector('.details__slider-img');
                imgElement.src = sight.images[currentImageIndex];
            }

            sliderNext.addEventListener('click', function () {
                currentImageIndex = (currentImageIndex + 1) % sight.images.length;
                updateImage();
            });

            sliderPrev.addEventListener('click', function () {
                currentImageIndex = (currentImageIndex - 1 + sight.images.length) % sight.images.length;
                updateImage();
            });
        } else {
            console.error('Элемент .details__images-wrapper не найден');
        }
    }
}
class PageManager {
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


const cardManager = new CardManager();
const searchManager = new SearchManager();
const paginationManager = new PaginationManager();
const pageManager = new PageManager();
const detailsManager = new DetailsManager();


cardManager.fetchCards();


searchManager.setupSearch();


paginationManager.setupScrollListener();
pageManager.setupPopstateListener();
pageManager.initialize();

const filterManager = new FilterManager();

// Отображение фильтров
filterManager.displayFilters(filterManager.getType(cardManager.cards));

function openDetails(id) {
    history.pushState({ id }, '', `/id/${id}`);
    detailsManager.showDetails(id);
}

async function fetchSights() {
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


let options = {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
};

function getCurrentPage() {
    const path = window.location.pathname;

    if (path.startsWith('/id/')) {
        const id = path.split('/')[2]; 
        return { type: 'details', id };
    } else {
        return { type: 'list' }; 
    }
}

function renderPage() {
    const page = getCurrentPage();

    if (page.type === 'details') {
        detailsManager.showDetails(page.id);
    } else if (page.type === 'list') {

        cardManager.fetchCards();
    }
}


window.addEventListener('load', renderPage);
window.addEventListener('popstate', renderPage);


function btnBack() {
    history.back();
}

