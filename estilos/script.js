// Carrusel de la sección "próximamente"

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.proximamente-track .slide');
  const btnPrev = document.getElementById('prevSlide');
  const btnNext = document.getElementById('nextSlide');
  const layer1 = document.querySelector('.slider-layer--1');
  const layer2 = document.querySelector('.slider-layer--2');

  if (!slides.length || !btnPrev || !btnNext) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  function showSlide(newIndex, direction = 1) {
    const oldSlide = slides[currentIndex];

    // calcular índice nuevo (carrusel infinito)
    currentIndex = (newIndex + totalSlides) % totalSlides;
    const currentSlide = slides[currentIndex];

    // reset clases
    oldSlide.classList.remove('slide--active');
    currentSlide.classList.remove('slide--active');

    // posición inicial de entrada según la dirección
    currentSlide.style.transform = `translateX(${30 * direction}px)`;
    currentSlide.style.opacity = '0';

    requestAnimationFrame(() => {
      currentSlide.classList.add('slide--active');
      currentSlide.style.transform = 'translateX(0)';
      currentSlide.style.opacity = '1';
    });

    // movimiento suave de las capas del fondo
    const offset = currentIndex * 2;
    if (layer1 && layer2) {
      layer1.style.transform = `translate(${12 + offset}px, ${12 + offset}px)`;
      layer2.style.transform = `translate(${24 + offset}px, ${24 + offset}px)`;
    }
  }

  btnNext.addEventListener('click', () => {
    showSlide(currentIndex + 1, 1); // entra desde la derecha
  });

  btnPrev.addEventListener('click', () => {
    showSlide(currentIndex - 1, -1); // entra desde la izquierda
  });
});
