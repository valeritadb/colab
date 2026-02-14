// Carrusel de la sección "próximamente"
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.proximamente-track .slide');
  const btnPrev = document.getElementById('prevSlide');
  const btnNext = document.getElementById('nextSlide');

  // seguridad básica
  if (!slides.length || !btnPrev || !btnNext) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  function showSlide(newIndex, direction = 1) {
    const oldSlide = slides[currentIndex];

    // quitar activa del slide actual
    oldSlide.classList.remove('slide--active');
    oldSlide.style.opacity = '0';

    // índice nuevo INFINITO:
    // - siguiente desde el último → vuelve a 0
    // - anterior desde el primero → va al último
    currentIndex = (newIndex + totalSlides) % totalSlides;
    const nextSlide = slides[currentIndex];

    // posición inicial de entrada según la dirección
    nextSlide.style.transform = `translateX(${30 * direction}px)`;
    nextSlide.style.opacity = '0';

    // en el siguiente frame activamos la transición
    requestAnimationFrame(() => {
      nextSlide.classList.add('slide--active');
      nextSlide.style.transform = 'translateX(0)';
      nextSlide.style.opacity = '1';
    });
  }

  btnNext.addEventListener('click', () => {
    showSlide(currentIndex + 1, 1);   // siguiente
  });

  btnPrev.addEventListener('click', () => {
    showSlide(currentIndex - 1, -1);  // anterior
  });
});


