// Функция для создания элементов DOM
function makeDiv(className) {
    const div = document.createElement('div');
    div.classList.add(className);
    return div;
}

function makeInput(type, id, className) {
    const input = document.createElement('input');
    input.classList.add(className);
    input.type = type;
    input.id = id;
    return input;
}

function makeP(className, text) {
    const p = document.createElement('p');
    p.classList.add(className);
    p.innerText = text;
    return p;
}

function makeCard(card) {
    const itemCard = document.createElement('img');
    itemCard.src = card.card;
    itemCard.alt = card.name;
    itemCard.id = card.name;
    itemCard.onclick = () => openDetails(card.UniqNum);
    itemCard.classList.add('second__card-img');
    return itemCard;
}

function getType(data) {
    return data.map(card => card.filter);
}

// Функция поиска
const searchInput = document.getElementById('search');
const searchNotFound = document.querySelector('.second__search-notfound');
const searchClear = document.querySelector('.second__functional-clear');

searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    searchClear.style.display = searchValue.trim() === '' ? 'none' : 'block';
    let filteredCards;
    // убирает пробелы 
    if (searchValue === '') { // Если поле поиска пустое, возвращаем все карточки
        filteredCards = displayCards(cards.slice((page - 1) * itemsPerPage, page * itemsPerPage));
        searchNotFound.textContent = '';
    } else {
        filteredCards = cards.filter(e =>
            e.name.toLowerCase().includes(searchValue)
        );

        if (filteredCards.length > 0) {
            searchNotFound.textContent = '';
        } else {
            searchNotFound.textContent = 'Ничего не найдено :(';
        }
    }

    searchClear.onclick = function () {
        searchInput.value = '';
        searchNotFound.textContent = '';
        displayCards(cards.slice((page - 1) * itemsPerPage, page * itemsPerPage));
        searchClear.style.display = 'none';
    };

    displayCards(filteredCards);
    setupPagination(filteredCards);
});

// OPEN BURGER MENU
const burgerOpenMenu = document.querySelector('.header__burger');
const burgerMenu = document.getElementById('modal_burger');
const burgerCloseMenu = document.getElementById('burger_close');

function openBurgerMenu() {
    burgerMenu.style.display = 'flex';
    burgerOpenMenu.style.display = 'none';
}

function closeBurgerMenu() {
    burgerMenu.style.display = 'none';
    burgerOpenMenu.style.display = 'flex';
}

burgerOpenMenu.onclick = openBurgerMenu;
burgerCloseMenu.onclick = closeBurgerMenu;

// открытие настроек
const sortOptions = document.querySelector('.second__functional-sort');
const optionsList = document.querySelector('.second__functional-list');

sortOptions.onclick = function () {
    optionsList.classList.contains('second__functional-list-close') ? 
        (optionsList.classList.remove('second__functional-list-close'), optionsList.classList.add('second__functional-list-open'))
        : (optionsList.classList.remove('second__functional-list-open'), optionsList.classList.add('second__functional-list-close'));
};

// Функция для отправки запроса с параметрами сортировки
async function fetchSortedCards(sortBy, order = 'asc') {
    const url = new URL('https://672b185d976a834dd02595f5.mockapi.io/cards');
    url.searchParams.append('sortBy', sortBy);
    url.searchParams.append('order', order);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Ошибка при получении данных!');
        }

        cards = await response.json();
        console.log(cards); 
        displayCards(cards.slice((page - 1) * itemsPerPage, page * itemsPerPage));
        setupPagination();
        displayFilters(getType(cards));
    } catch (error) {
        console.log('error: ' + error.message);
    }
}

// сортировка
const firstSortingDiv = document.querySelector('.second__functional-sorting_1');
const firstSortingClose = document.querySelector('.second__functional-sorting_close1');

firstSortingDiv.onclick = function () {
    firstSortingClose.style.display === "block" ? 
        (secondSortingDiv.style.display = 'flex', thirdSortingDiv.style.display = 'flex', firstSortingClose.style.display = 'none', fetchSortedCards('id', 'asc')) :
        (firstSortingClose.style.display = 'block', secondSortingDiv.style.display = 'none', thirdSortingDiv.style.display = 'none', fetchSortedCards('popularity', 'desc'));
};

const secondSortingDiv = document.querySelector('.second__functional-sorting_2');
const secondSortingClose = document.querySelector('.second__functional-sorting_close2');
secondSortingDiv.onclick = function () {
    const isOpenSecond = secondSortingClose.style.display === "block";

    firstSortingDiv.style.display = isOpenSecond ? 'flex' : 'none';
    thirdSortingDiv.style.display = isOpenSecond ? 'flex' : 'none';
    secondSortingClose.style.display = isOpenSecond ? 'none' : 'block';

    fetchSortedCards(isOpenSecond ? 'id' : 'name', 'asc');
};

const thirdSortingDiv = document.querySelector('.second__functional-sorting_3');
const thirdSortingClose = document.querySelector('.second__functional-sorting_close3');

thirdSortingDiv.onclick = function () {
    const isOpenThird = thirdSortingClose.style.display === "block";

    secondSortingDiv.style.display = isOpenThird ? 'flex' : 'none';
    firstSortingDiv.style.display = isOpenThird ? 'flex' : 'none';
    thirdSortingClose.style.display = isOpenThird ? 'none' : "block";

    fetchSortedCards(isOpenThird ? 'id' : 'name', 'desc');
};

// пагинация
const itemsPerPage = 4;
let page = 1;
let cards = [];
let isLoading = false;

async function fetchCards() {
    try {
        const response = await fetch('https://672b185d976a834dd02595f5.mockapi.io/cards');

        if (!response.ok) {
            throw new Error('Ошибка при получении данных!');
        }

        cards = await response.json();
        displayCards(cards.slice((page - 1) * itemsPerPage, page * itemsPerPage));
        setupPagination();
        displayFilters(getType(cards));
    } catch (error) {
        console.log('error: ' + error.message);
    }
}

const cardsPage = document.querySelector('.second__page');

function displayCards(cards) {
    cardsPage.innerHTML = '';

    const cardsUl = document.createElement('ul');
    cardsUl.classList.add('second__card-list');

    cards.forEach(card => {
        cardsUl.appendChild(makeCard(card));
    });

    cardsPage.appendChild(cardsUl);
}

const filtersDiv = document.getElementById("filters");

const uniqueFilters = new Set();

function displayFilters(filters) {
    filtersDiv.innerHTML = '';

    filters.forEach(filter => {
        const filterElement = makeDiv("second__functional-filter");

        const input = makeInput('checkbox', 'firstCheckbox', 'second__functional-checkbox');
        const p = makeP('second__functional-text', filter.text);

        if (uniqueFilters.has(filter.type)) {
            return;
        } else {
            uniqueFilters.add(filter.type);
        }

        filterElement.appendChild(input);
        filterElement.appendChild(p);

        input.addEventListener('change', function () {
            if (input.checked) {
                const firstTargetCards = cards.filter(item1 => item1.filter.type.toLowerCase() === filter.type.toLowerCase());
                if (firstTargetCards.length > 0) {
                    paginBtn.style.display = 'none';
                    displayCards(firstTargetCards);
                } else {
                    console.log('Карточек для чекбокса не найдено!');
                }
            } else {
                paginBtn.style.display = 'flex';
                displayCards(cards.slice((page - 1) * itemsPerPage, page * itemsPerPage));
            }
        });

        filtersDiv.appendChild(filterElement);
    });
}

const paginBtn = document.querySelector('.second__pagination');
function setupPagination() {
    const totalPages = Math.ceil(cards.length / itemsPerPage);

    paginBtn.innerHTML = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'second__pagination-link';
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                page = i;
                displayCards(cards.slice((page - 1) * itemsPerPage, page * itemsPerPage));
            });
            paginBtn.appendChild(pageButton);
        }
    } else {
        paginBtn.style.display = 'none';
    }
}

fetchCards();

const functional = document.querySelector('.second__functional-header');
function openDetails(itemUniqNum) {
    window.location.href = `?id=${itemUniqNum}`;
}

async function fetchSights() {
    const response = await fetch("https://67444af2b4e2e04abea198bc.mockapi.io/cards/Attractions");
    return response.json();
}

function renderSights(sights) {
    sights.forEach(sight => {
        const attrDiv = document.createElement('div');
        attrDiv.classList.add("details__card");
        cardsPage.appendChild(attrDiv);
    });
}



async function showDetails(sightId) {
    const sights = await fetchSights();
    const sight = sights.find(a => a.UniqNum === sightId);
    if (sight) {
        cardsPage.style.display = 'none';
        functional.style.display = 'none';
        paginBtn.style.display = 'none';

        const detailsDiv = document.querySelector('.details');
        detailsDiv.innerHTML = `
            <a href="#" onclick="history.back()"> ← Назад </a>
            <div class="details__block">            
                <h1>${sight.name}</h1>
                <div class='details__details-part'>
                    <p class="details__text">${sight.About[2]}</p>
                    <img src="${sight.About[0]}" alt="Image" class="details__img">
                </div>
                <div class='details__details-part adaptiv'>
                    <img src="${sight.About[1]}" alt="Image">
                    <p>${sight.About[3]}</p>
                </div>
                <h2>Достопримечательность на карте</h2>
                <iframe src="${sight.Map}" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                <h2>Отзывы</h2>
                <div class='details__createComment' id='createComment'> 
                    <form class='details__inputs'>
                        <input placeholder='Ваше имя' class='details__nameInput' id="reviewName">
                        <textarea placeholder='Введите сообщение' class='details__textInput' id="reviewText"></textarea>
                    </form>
                    <div class='details__hr' id='detailsHr'> </div>
                    <div class='details__buttons'>
                        <button class='details__btn' id='cancelReview'> Отмена </button>
                        <button class='details__btn' type="submit" id="submitReview"> Оставить комментарий </button>
                    </div>
                </div>
                <div class='details__allComments'></div>
            </div>
        `;


        document.querySelector('.details__inputs').addEventListener('click', function(){
            // hr
            document.querySelector("#detailsHr").classList.add('active')
            document.querySelector('.details__buttons').style.display = 'flex';
        })

        document.getElementById('cancelReview').addEventListener('click', function(){
            document.querySelector('.details__inputs').reset();
            document.querySelector('.details__buttons').style.display = 'none';
            document.querySelector("#detailsHr").classList.remove('active')
        })

        document.getElementById('reviewText').addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        
            if (document.getElementById('reviewText').value.length > 0) {
                document.getElementById('submitReview').classList.add('active');
            } else {
                document.getElementById('submitReview').classList.remove('active');
            }
        });

        detailsDiv.classList.remove('hidden');


        loadReviews(sight.UniqNum);


        document.getElementById('submitReview').addEventListener('click', function(event) {
            event.preventDefault();

            const attractionId = sight.UniqNum;
            const reviewName = document.getElementById('reviewName').value;
            const reviewText = document.getElementById('reviewText').value;

            const reviewData = {
                name: reviewName,
                text: reviewText,
                createdAt: new Date().toISOString()
            };

            fetch(`https://672b185d976a834dd02595f5.mockapi.io/cards/${attractionId}`, {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                if (!data.reviews) {
                    data.reviews = [];
                }
                data.reviews.push(reviewData);

                return fetch(`https://672b185d976a834dd02595f5.mockapi.io/cards/${attractionId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            })
            .then(response => response.json())
            .then(data => {
                console.log('Отзыв успешно добавлен:', data);
                loadReviews(attractionId); 
                document.querySelector('.details__inputs').reset();
                document.querySelector('.details__buttons').style.display = 'none';
                document.querySelector("#detailsHr").classList.remove('active')
                document.getElementById('submitReview').classList.remove('active');
                
            })
            .catch(error => {
                console.error('Ошибка при добавлении отзыва:', error);
            });
        });
    }
}

window.onload = async () => {
    const sights = await fetchSights();
    renderSights(sights);

    const params = new URLSearchParams(window.location.search);
    const sightId = params.get('id');
    if (sightId) {
        showDetails(sightId);
    }
};


function loadReviews(attractionId) {
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
                            <div class='details__comment-text' >${review.text}</div>
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

let options =  { 
    year: '2-digit', 
    month: 'numeric', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric' 
}