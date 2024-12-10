
let slideIndex = 1;
showSlides(slideIndex);

function nextSlide() {
    showSlides(slideIndex += 1);
}

function previousSlide() {
    showSlides(slideIndex -= 1);  
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("third__card-link");
    if (n > slides.length) {
      slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (let slide of slides) {
        slide.style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";    
}

const modal_burger = document.getElementById('modal_burger')
const open_burger = document.getElementById('open_burger');
const close_burger = document.getElementById('burger_close');


open_burger.onclick = function(){
    modal_burger.style.display = "flex";
    open_burger.style.display = "hide";
}
close_burger.onclick = function() {
    modal_burger.style.display = "none";   
    open_burger.style.display = "show";
}
modal_burger.onclick = function(event) {
    if (event.target === modal_burger) {
        close_burger.onclick();
    }
}
