function makeDiv(className) {
    const div = document.createElement('div');
    div.classList.add(className)

    return div
}

function makeInput(type, id, className) {
    const input = document.createElement('input');
    input.classList.add(className)
    input.type = type
    input.id = id

    return input
}

function makeP(className, text) {
    const p = document.createElement('p');
    p.classList.add(className)
    p.innerText = text
    return p
}
function getType (data){
    return data.map(card => card.filter)
}


// Функция поиска
const searchInput = document.getElementById('search');
const searchNotFound = document.querySelector('.second__search-result');
const searchClear = document.querySelector('.second__functional-clear');

searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    searchClear.style.display = searchValue.trim() === '' ? 'none' : 'block';
    let filteredCards;
    // убирает пробелы
    if (searchValue.trim() === '') {// Если поле поиска пустое, возвращаем все карточки
        filteredCards = displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        searchNotFound.textContent = '';
    } else {
        filteredCards = cards.filter(e =>
            e.name.toLowerCase().includes(searchValue)
        );

        if (filteredCards.length > 0) {
            console.log(filteredCards);
            searchNotFound.textContent = '';
        } else {
            searchNotFound.textContent = 'Ничего не найдено :(';

        }
    }

    searchClear.onclick = function () {
        searchInput.value = '';
        searchNotFound.textContent = '';
        displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        searchClear.style.display = 'none';
    };

    displayCards(filteredCards);
    setupPagination(filteredCards);
});


// OPEN BURGER MENU
const burgerOpenMenu = document.querySelector('.header__burger');
const burgerMenu = document.getElementById('modal_burger');
const burgerCloseMenu = document.getElementById('burger_close');

burgerOpenMenu.onclick = function () {
    burgerMenu.style.display = 'flex';
    burgerOpenMenu.style.display = 'none';
};

burgerCloseMenu.onclick = function () {
    burgerMenu.style.display = 'none';
    burgerOpenMenu.style.display = 'flex';
};


// открытие настроек
const sortOptions = document.querySelector('.second__functional-sort');
const optionsList = document.querySelector('.second__functional-list')

sortOptions.onclick = function () {
    if (optionsList.classList.contains('second__functional-list-close')) {
        optionsList.classList.remove('second__functional-list-close');
        optionsList.classList.add('second__functional-list-open');
    } else {
        optionsList.classList.remove('second__functional-list-open')
        optionsList.classList.add('second__functional-list-close');
    }
}

// сортировка
function byName(cardName) {
    return (a, b) => a[cardName].localeCompare(b[cardName]);
}
function byID(CardID) {
    return (a, b) => a[cardID] > b[CardID] ? 1 : -1;
}
function ByPopularity(cardPopopularity) {
    return (a, b) => a[cardPopopularity] > b[cardPopopularity] ? 1 : -1;
}

function byNameReverse(cardNameReverse) {
    return (a, b) => b[cardNameReverse] - a[cardNameReverse] ? 1 : -1;
}

const firstSortingDiv = document.querySelector('.second__functional-sorting_1');
const firstSortingClose = document.querySelector('.second__functional-sorting_close1');

firstSortingDiv.onclick = function () {
    if (firstSortingClose.style.display === "block") {
        secondSortingDiv.style.display = 'flex';
        thirdSortingDiv.style.display = 'flex';
        firstSortingClose.style.display = 'none';
        cards.sort(byName('id'));
        displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    } else {
        firstSortingClose.style.display = 'block';
        secondSortingDiv.style.display = 'none';
        thirdSortingDiv.style.display = 'none';
        cards.sort(ByPopularity('popularity'));
        displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    }
}


const secondSortingDiv = document.querySelector('.second__functional-sorting_2')
const secondSortingClose = document.querySelector('.second__functional-sorting_close2');

secondSortingDiv.onclick = function () {
    if (secondSortingClose.style.display === "block") {
        firstSortingDiv.style.display = 'flex'
        thirdSortingDiv.style.display = 'flex'
        secondSortingClose.style.display = 'none';
        cards.sort(byName('id'));
        displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    }
    else {
        secondSortingClose.style.display = 'block';
        firstSortingDiv.style.display = 'none';
        thirdSortingDiv.style.display = 'none';
        cards.sort(byName('name'));
        displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        console.log(cards)
    }
}

const thirdSortingDiv = document.querySelector('.second__functional-sorting_3')
const thirdSortingClose = document.querySelector('.second__functional-sorting_close3');

thirdSortingDiv.onclick = function () {
    if (thirdSortingClose.style.display === "block") {
        secondSortingDiv.style.display = 'flex'
        firstSortingDiv.style.display = 'flex'
        thirdSortingClose.style.display = 'none';
        cards.sort(byName('id'));
        displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    }
    else {
        thirdSortingClose.style.display = "block";
        secondSortingDiv.style.display = 'none';
        firstSortingDiv.style.display = 'none'
        cards.sort(byNameReverse('name'));
        displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    }
}

// //фильтрация
// const firstCheckBox = document.getElementById('firstCheckbox');
// const secondCheckBox = document.getElementById('secondCheckbox');
// const thirdCheckBox = document.getElementById('thirdCheckbox');

// const typeShowplace = 'showplace';
// const typeEntertainment = 'entertainment';
// const typePark = 'park'

// firstCheckBox.addEventListener('change', function () {
//     if (firstCheckBox.checked) {
//         firstTargetCards = cards.filter(item1 => item1.type === typeShowplace)
//         if (firstTargetCards.length > 0) {
//             console.log(firstTargetCards);
//             displayCards(firstTargetCards)
//         } else {
//             console.log('Карточек для чекбокса не найдено!')
//         }
//     } else {
//         displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
//     }
// })


// secondCheckBox.addEventListener('change', function () {
//     if (secondCheckBox.checked) {
//         secondTargetCards = cards.filter(item2 => item2.type === typeEntertainment)
//         if (secondTargetCards.length > 0) {

//             displayCards(secondTargetCards)
//         } else {
//             console.log('Карточек для чекбокса не найдено!')
//         }
//     } else {
//         displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage))
//     }


// })

// пагинация
const itemsPerPage = 4;
let currentPage = 1;
let cards = [];

function fetchCards() {
    fetch("https://672b185d976a834dd02595f5.mockapi.io/cards")
        .then(response => response.json())
        .then(data => {
            cards = data; // карточки в переменную
            displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            setupPagination();
            // надо подгрузить 
            console.log(getType(cards))
            displayFilters(getType(cards))
            
            document.querySelector('.second__loader').style.display = 'none'
        })
        .catch(error => {
            console.error("Ошибка при получении данных", error);
        });
}

const secondContainer = document.getElementById('secondContainer')
const secondPagin = document.querySelector('.second__pagination-page')
const filtersDiv = document.getElementById("filters")

const uniqueFilters = new Set();

function displayFilters(filters) {
    filtersDiv.innerHTML = '';

    filters.forEach(filter => {
        const filterElement = makeDiv("second__functional-filter");

        const input = makeInput('checkbox', 'firstCheckbox', 'second__functional-checkbox');
        const p = makeP('second__functional-text', filter.text);

        // Проверка на уникальность фильтра
        if (uniqueFilters.has(filter.type)) {
            return; // Предотвращаем добавление дубликата
        } else {
            uniqueFilters.add(filter.type);
        }

        filterElement.appendChild(input);
        filterElement.appendChild(p);

        input.addEventListener('change', function () {
            if (input.checked) {
                console.log(filter.type, cards);
                firstTargetCards = cards.filter(item1 => item1.filter.type.toLowerCase() === filter.type.toLowerCase());
                if (firstTargetCards.length > 0) {
                    console.log(firstTargetCards);
                    displayCards(firstTargetCards);
                } else {
                    console.log('Карточек для чекбокса не найдено!');
                }
            } else {
                displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            }
        });

        filtersDiv.appendChild(filterElement);
    });
}

function displayCards(data) {
    secondPagin.innerHTML = '';

    const cardUl = document.createElement('ul');
    cardUl.classList.add('second__card-list');

    data.forEach(card => {
        const cardLi = document.createElement('li');
        cardLi.classList.add('second__card');

        const itemCard = document.createElement('img');
        itemCard.src = card.card;
        itemCard.alt = card.name;
        itemCard.id = card.name
        itemCard.classList.add('second__card-img');

        cardLi.appendChild(itemCard);
        cardUl.appendChild(cardLi);
    });

    secondPagin.appendChild(cardUl);
}

function setupPagination() {
    const paginBtn = document.querySelector('.second__pagination')
    const totalPages = Math.ceil(cards.length / itemsPerPage);

    paginBtn.innerHTML = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'second__pagination-link';
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayCards(cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            });
            paginBtn.appendChild(pageButton);
        }
        // ДОБАВИТЬ ФУНКЦИЮ КОТОРАЯ ВЫДЕЛЯЕТ СТРАНИЦУ НА КОТОРОЙ НАХОДИИТСЯ ПОЛЬЗОВАТЕЛЬ
    } else {
        paginBtn.style.display = 'none';
    }


}

fetchCards();