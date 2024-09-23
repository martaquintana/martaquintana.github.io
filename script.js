document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('active');
});

let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-item');
let slideInterval = setInterval(nextSlide, 3000); // Define el intervalo aquí

function showSlide(index) {
    if (index >= slides.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = slides.length - 1;
    } else {
        currentIndex = index;
    }

    const offset = -currentIndex * 100;
    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    showSlide(currentIndex + 1);
    resetInterval();
}

function prevSlide() {
    showSlide(currentIndex - 1);
    resetInterval();
}

function resetInterval() {
    clearInterval(slideInterval); // Limpia el intervalo existente
    slideInterval = setInterval(nextSlide, 3000); // Inicia uno nuevo
}
