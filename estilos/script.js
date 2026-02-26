/* ============================================================
   COLAB — script principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Año dinámico en el footer ── */
    const yearEl = document.querySelector('.year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* ── Carrusel de la sección "próximamente" ── */
    const slides = document.querySelectorAll('.proximamente-track .slide');
    const btnPrev = document.getElementById('prevSlide');
    const btnNext = document.getElementById('nextSlide');

    if (slides.length && btnPrev && btnNext) {
        let current = 0;
        const total = slides.length;

        function goTo(newIndex, direction) {
            const outgoing = slides[current];
            outgoing.classList.remove('slide--active');
            outgoing.style.opacity = '0';
            outgoing.style.transform = `translateX(${-30 * direction}px)`;

            current = ((newIndex % total) + total) % total;
            const incoming = slides[current];

            // Posición inicial de entrada
            incoming.style.transition = 'none';
            incoming.style.opacity = '0';
            incoming.style.transform = `translateX(${30 * direction}px)`;

            // Forzar reflow para que la transición se aplique
            incoming.getBoundingClientRect();

            incoming.style.transition = '';
            incoming.classList.add('slide--active');
            incoming.style.transform = 'translateX(0)';
            incoming.style.opacity = '1';
        }

        btnNext.addEventListener('click', () => goTo(current + 1, 1));
        btnPrev.addEventListener('click', () => goTo(current - 1, -1));
    }


    /* ── Smooth scroll para los enlaces del nav ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length < 2) return; // saltar href="#"
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({behavior: 'smooth', block: 'start'});
        });
    });

});