import { CardManager } from './CardManager.js'
import {FilterManager} from './FilterManager.js'
import {SortManager} from './SortManager.js'
import {SearchManager} from './SearchManager.js'
import {PaginationManager} from './PaginationManager.js'
import {PageManager} from './PageManager.js'
export class DetailsManager {
    constructor() {
        this.detailsDiv = document.querySelector('.details');
        this.functional = document.querySelector('.second__functional');
        this.readBar = document.querySelector('.header__read-bar');
        this.cardsPage = document.querySelector('.second__page');
    }

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