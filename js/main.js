/* ============================================
   VTA Group - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- AOS Init ----
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: prefersReducedMotion ? 0 : 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
            disable: prefersReducedMotion
        });
    }

    // ---- Hero Slider (Swiper) ----
    const heroSlides = document.querySelectorAll('.hero-swiper .swiper-slide');
    if (typeof Swiper !== 'undefined' && heroSlides.length > 1) {
        new Swiper('.hero-swiper', {
            loop: true,
            autoplay: prefersReducedMotion ? false : {
                delay: 8000,
                disableOnInteraction: false
            },
            effect: 'fade',
            fadeEffect: { crossFade: true },
            speed: 1500,
            pagination: {
                el: '.hero-swiper .swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.hero-swiper .swiper-button-next',
                prevEl: '.hero-swiper .swiper-button-prev'
            }
        });
    }

    // ---- Partners Slider ----
    const partnerSlides = document.querySelectorAll('.partners-swiper .swiper-slide');
    if (typeof Swiper !== 'undefined' && partnerSlides.length) {
        new Swiper('.partners-swiper', {
            loop: partnerSlides.length > 6,
            autoplay: prefersReducedMotion ? false : {
                delay: 2000,
                disableOnInteraction: false
            },
            speed: 800,
            slidesPerView: 2,
            spaceBetween: 20,
            breakpoints: {
                576: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                992: { slidesPerView: 5 },
                1200: { slidesPerView: 6 }
            }
        });
    }

    // ---- News Slider ----
    if (typeof Swiper !== 'undefined' && document.querySelector('.news-swiper')) {
        new Swiper('.news-swiper', {
            loop: false,
            speed: prefersReducedMotion ? 0 : 650,
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.news__button--next',
                prevEl: '.news__button--prev'
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1200: { slidesPerView: 3 }
            }
        });
    }

    // ---- Sticky Navigation ----
    const mainNav = document.getElementById('mainNav');
    const header = document.getElementById('header');
    let navOffset = 0;

    function updateNavOffset() {
        if (header) {
            navOffset = header.offsetTop + header.offsetHeight;
        }
    }

    updateNavOffset();

    window.addEventListener('scroll', function () {
        if (window.scrollY > navOffset) {
            mainNav.classList.add('sticky');
        } else {
            mainNav.classList.remove('sticky');
        }
    });

    window.addEventListener('resize', updateNavOffset);

    // ---- Mobile Menu Toggle ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        function closeMobileMenu() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
        }

        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('active');
            this.classList.toggle('active', isOpen);
            this.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('nav-open', isOpen);
        });

        // Dropdown toggle on mobile
        const dropdownItems = document.querySelectorAll('.main-nav__item--dropdown');
        dropdownItems.forEach(function (item) {
            const link = item.querySelector(':scope > a');
            if (link) {
                link.setAttribute('aria-expanded', 'false');
            }
            link.addEventListener('click', function (e) {
                if (window.innerWidth <= 991) {
                    e.preventDefault();
                    const isOpen = item.classList.toggle('open');
                    link.setAttribute('aria-expanded', String(isOpen));
                }
            });
        });

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 991 && !link.closest('.main-nav__item--dropdown')) {
                    closeMobileMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!mainNav.contains(e.target)) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }

    // ---- Navigation Search ----
    const navSearch = document.querySelector('[data-nav-search]');
    if (navSearch) {
        const searchForm = navSearch.querySelector('form');
        const searchInput = navSearch.querySelector('input[type="search"]');
        const searchButton = navSearch.querySelector('button');

        function openSearch() {
            navSearch.classList.add('is-open');
            searchButton.setAttribute('aria-expanded', 'true');
            searchButton.setAttribute('aria-label', 'Tìm kiếm');
            window.setTimeout(function () {
                searchInput.focus();
            }, 0);
        }

        function closeSearch() {
            if (searchInput.value.trim()) return;
            navSearch.classList.remove('is-open');
            searchButton.setAttribute('aria-expanded', 'false');
            searchButton.setAttribute('aria-label', 'Mở tìm kiếm');
        }

        searchButton.addEventListener('click', function (e) {
            if (!navSearch.classList.contains('is-open') || !searchInput.value.trim()) {
                e.preventDefault();
                openSearch();
            }
        });

        searchForm.addEventListener('submit', function (e) {
            if (!searchInput.value.trim()) {
                e.preventDefault();
                openSearch();
            }
        });

        document.addEventListener('click', function (e) {
            if (!navSearch.contains(e.target)) {
                closeSearch();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeSearch();
            }
        });
    }

    // ---- Back to Top ----
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    // ---- Counter Animation ----
    const counters = document.querySelectorAll('[data-count]');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        counters.forEach(function (counter) {
            const rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                countersAnimated = true;
                const target = parseInt(counter.getAttribute('data-count'), 10);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                function updateCounter() {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target.toLocaleString('vi-VN');
                        counter.closest('.about__stat').classList.add('animated');
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString('vi-VN');
                        requestAnimationFrame(updateCounter);
                    }
                }

                updateCounter();
            }
        });
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters();

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            let target = null;
            try {
                target = document.querySelector(href);
            } catch (error) {
                return;
            }

            if (target) {
                e.preventDefault();
                const navHeight = mainNav ? mainNav.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
        });
    });

    if (prefersReducedMotion) {
        document.querySelectorAll('.hero-slider__video').forEach(function (video) {
            video.pause();
        });
    }

    // ---- Image error handler (placeholder) ----
    document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', function () {
            if (!this.dataset.errorHandled) {
                this.dataset.errorHandled = 'true';
                this.style.background = 'linear-gradient(135deg, #000000 0%, #333333 100%)';
                this.style.minHeight = '150px';
                this.alt = this.alt || 'VTA Group';
            }
        });
    });

});
