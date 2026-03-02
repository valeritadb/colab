/* ============================================================
   COLAB — script principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Año dinámico en el footer ── */
    const yearEl = document.querySelector('.year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* ── Header espacio.html: oculta el nav al hacer scroll ──
       Añade .scrolled al header cuando el usuario baja más de 30px.
       El CSS se encarga de desvanecer el nav y dejar solo el logo. */
    const espHeader = document.querySelector('.esp-header');
    if (espHeader) {
        const onScroll = () => {
            espHeader.classList.toggle('scrolled', window.scrollY > 30);
        };
        window.addEventListener('scroll', onScroll, {passive: true});
        onScroll(); // ejecutar una vez por si ya está bajado al cargar
    }


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

            incoming.style.transition = 'none';
            incoming.style.opacity = '0';
            incoming.style.transform = `translateX(${30 * direction}px)`;

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
            if (href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({behavior: 'smooth', block: 'start'});
        });
    });


    /* ── Lightbox de la galería ── */
    const galItems = document.querySelectorAll('.gal-item');
    if (!galItems.length) return;

    /* Recopilar todas las imágenes de la galería en orden */
    const galImages = Array.from(galItems).map(item => {
        const img = item.querySelector('img');
        return {src: img.src, alt: img.alt};
    });

    let lbIndex = 0;
    let lbEl = null;          // nodo del lightbox en el DOM
    let lbImg = null;         // <img> activo dentro del lightbox
    let lbCounter = null;     // contador "x / n"

    /* --- Abrir lightbox --- */
    function openLightbox(index) {
        lbIndex = index;

        /* Contenedor overlay */
        lbEl = document.createElement('div');
        lbEl.className = 'gal-lightbox';
        lbEl.setAttribute('role', 'dialog');
        lbEl.setAttribute('aria-modal', 'true');
        lbEl.setAttribute('aria-label', 'Galería de imágenes');

        /* Inner: contiene imagen + flechas */
        const inner = document.createElement('div');
        inner.className = 'gal-lightbox-inner';

        /* Botón cerrar */
        const closeBtn = document.createElement('button');
        closeBtn.className = 'gal-lb-close';
        closeBtn.setAttribute('aria-label', 'Cerrar galería');
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', closeLightbox);

        /* Flecha anterior */
        const prevBtn = document.createElement('button');
        prevBtn.className = 'gal-lb-arrow gal-lb-prev';
        prevBtn.setAttribute('aria-label', 'Imagen anterior');
        prevBtn.textContent = '<';
        prevBtn.addEventListener('click', () => navigateLightbox(-1));

        /* Flecha siguiente */
        const nextBtn = document.createElement('button');
        nextBtn.className = 'gal-lb-arrow gal-lb-next';
        nextBtn.setAttribute('aria-label', 'Imagen siguiente');
        nextBtn.textContent = '>';
        nextBtn.addEventListener('click', () => navigateLightbox(1));

        /* Imagen */
        lbImg = document.createElement('img');
        lbImg.src = galImages[lbIndex].src;
        lbImg.alt = galImages[lbIndex].alt;

        /* Contador */
        lbCounter = document.createElement('div');
        lbCounter.className = 'gal-lb-counter';
        updateCounter();

        inner.appendChild(prevBtn);
        inner.appendChild(lbImg);
        inner.appendChild(nextBtn);
        inner.appendChild(closeBtn);
        inner.appendChild(lbCounter);

        lbEl.appendChild(inner);
        document.body.appendChild(lbEl);
        document.body.style.overflow = 'hidden';

        /* Cerrar al hacer clic en el fondo */
        lbEl.addEventListener('click', (e) => {
            if (e.target === lbEl) closeLightbox();
        });

        /* Teclado */
        document.addEventListener('keydown', handleKeydown);
    }

    /* --- Cerrar lightbox --- */
    function closeLightbox() {
        if (!lbEl) return;
        document.body.removeChild(lbEl);
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeydown);
        lbEl = null;
        lbImg = null;
        lbCounter = null;
    }

    /* --- Navegar entre imágenes con transición slide --- */
    function navigateLightbox(direction) {
        if (!lbImg) return;

        const exitClass = direction === 1 ? 'lb-exit-left' : 'lb-exit-right';
        lbImg.classList.add(exitClass);

        setTimeout(() => {
            lbIndex = ((lbIndex + direction) % galImages.length + galImages.length) % galImages.length;
            lbImg.classList.remove(exitClass);
            lbImg.classList.add('lb-enter');
            lbImg.src = galImages[lbIndex].src;
            lbImg.alt = galImages[lbIndex].alt;
            updateCounter();

            /* Forzar reflow para que la transición de entrada se aplique */
            lbImg.getBoundingClientRect();
            lbImg.classList.remove('lb-enter');
        }, 280);
    }

    /* --- Actualizar contador --- */
    function updateCounter() {
        if (lbCounter) {
            lbCounter.textContent = `${lbIndex + 1} / ${galImages.length}`;
        }
    }

    /* --- Teclado: ← → Escape --- */
    function handleKeydown(e) {
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'Escape') closeLightbox();
    }

    /* --- Asignar clic a cada item de la galería --- */
    galItems.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
    });

});

