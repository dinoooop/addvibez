/**
 * Addvibez – front-end behaviour (jQuery 4.0.0)
 * Progressive enhancement: the page is fully readable without this file.
 */
jQuery(function ($) {
    'use strict';

    const $win = $(window);
    const $header = $('[data-header]');
    const $scrollTop = $('[data-scroll-top]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ------------------------------------------------------------------
    // WOW.js + Animate.css (scroll reveal)
    // ------------------------------------------------------------------
    if (typeof WOW === 'function' && !reduceMotion) {
        new WOW({
            boxClass: 'wow',
            animateClass: 'animate__animated',
            offset: 60,
            mobile: true,
            live: false,
        }).init();
    }

    // ------------------------------------------------------------------
    // Sticky header: hides on scroll down, returns on scroll up
    // ------------------------------------------------------------------
    let lastY = $win.scrollTop();
    const hideAfter = 240;
    const delta = 8;

    const updateHeader = () => {
        const y = Math.max($win.scrollTop(), 0);
        const menuOpen = $('#mainMenu').hasClass('show');

        $header.toggleClass('is-scrolled', y > 40);

        if (Math.abs(y - lastY) > delta && !menuOpen) {
            $header.toggleClass('is-hidden', y > lastY && y > hideAfter);
            lastY = y;
        }

        $scrollTop.toggleClass('is-visible', y > 600);
    };

    // Reveal header when keyboard focus lands in it
    $header.on('focusin', () => $header.removeClass('is-hidden'));

    // ------------------------------------------------------------------
    // Subtle parallax: [data-parallax="0.1"] (positive = slower than scroll)
    // ------------------------------------------------------------------
    const $parallax = $('[data-parallax]');
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

    const updateParallax = () => {
        if (reduceMotion) {
            return;
        }

        const vh = window.innerHeight;
        const strength = isDesktop() ? 1 : 0.5;

        $parallax.each(function () {
            const rect = this.getBoundingClientRect();

            if (rect.bottom < -200 || rect.top > vh + 200) {
                return;
            }

            const speed = parseFloat(this.getAttribute('data-parallax')) || 0;
            const offset = (rect.top + rect.height / 2 - vh / 2) * speed * strength;

            this.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
        });
    };

    // ------------------------------------------------------------------
    // Active nav link on scroll
    // ------------------------------------------------------------------
    const $navLinks = $('.site-menu__link');
    const sections = $navLinks
        .map(function () {
            const $target = $($(this).attr('href'));
            return $target.length ? { link: $(this), target: $target } : null;
        })
        .get();

    const updateActiveLink = () => {
        const probe = $win.scrollTop() + $header.outerHeight() + window.innerHeight * 0.25;
        let current = sections[0];

        sections.forEach((item) => {
            if (item.target.offset().top <= probe) {
                current = item;
            }
        });

        if (current) {
            $navLinks.removeClass('is-active').removeAttr('aria-current');
            current.link.addClass('is-active').attr('aria-current', 'true');
        }
    };

    // ------------------------------------------------------------------
    // Counters: <span data-counter="250">
    // ------------------------------------------------------------------
    const $counters = $('[data-counter]');

    const runCounter = ($el) => {
        const end = parseInt($el.data('counter'), 10);

        if (reduceMotion) {
            $el.text(end);
            return;
        }

        $({ n: 0 }).animate({ n: end }, {
            duration: 1800,
            easing: 'swing',
            step: function (now) {
                $el.text(Math.floor(now));
            },
            complete: () => $el.text(end),
        });
    };

    const checkCounters = () => {
        const bottom = $win.scrollTop() + window.innerHeight;

        $counters.each(function () {
            const $el = $(this);

            if (!$el.data('done') && $el.offset().top < bottom - 40) {
                $el.data('done', true);
                runCounter($el);
            }
        });
    };

    // ------------------------------------------------------------------
    // Scroll / resize wiring (one rAF-throttled handler)
    // ------------------------------------------------------------------
    let ticking = false;

    const onScroll = () => {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(() => {
            updateHeader();
            updateParallax();
            updateActiveLink();
            checkCounters();
            ticking = false;
        });
    };

    $win.on('scroll resize', onScroll);
    onScroll();

    // ------------------------------------------------------------------
    // Smooth scrolling for in-page links + close the mobile menu
    // ------------------------------------------------------------------
    $('a[href^="#"]').not('[href="#"]').on('click', function (event) {
        const $target = $($(this).attr('href'));

        if (!$target.length) {
            return;
        }

        event.preventDefault();

        const menuEl = document.getElementById('mainMenu');
        const menu = menuEl ? bootstrap.Offcanvas.getInstance(menuEl) : null;

        if (menu && $(menuEl).hasClass('show')) {
            menu.hide();
        }

        const top = $target.offset().top - ($header.outerHeight() || 0) + 1;

        $('html, body').stop().animate({ scrollTop: top }, reduceMotion ? 0 : 700);
        $target.attr('tabindex', '-1');
    });

    // Placeholder links should not jump to the top of the page
    $('a[href="#"]').on('click', (event) => event.preventDefault());

    // ------------------------------------------------------------------
    // Scroll to top
    // ------------------------------------------------------------------
    $scrollTop.on('click', () => {
        $('html, body').stop().animate({ scrollTop: 0 }, reduceMotion ? 0 : 600);
    });

    // ------------------------------------------------------------------
    // Work slider (scroll-snap track + prev/next buttons)
    // ------------------------------------------------------------------
    const $track = $('[data-work-track]');

    const slideWork = (direction) => {
        const step = $track.find('.work__item').first().outerWidth(true) || 300;

        $track.stop().animate({ scrollLeft: $track.scrollLeft() + direction * step }, reduceMotion ? 0 : 450);
    };

    $('[data-work-prev]').on('click', () => slideWork(-1));
    $('[data-work-next]').on('click', () => slideWork(1));

    $track.on('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            slideWork(1);
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            slideWork(-1);
        }
    });

    // ------------------------------------------------------------------
    // Testimonial carousel: reserve the tallest slide's height so sliding
    // never makes the panel jump
    // ------------------------------------------------------------------
    const $slides = $('#testimonialCarousel .carousel-inner');

    const fitSlides = () => {
        $slides.addClass('is-measuring');

        const tallest = Math.max.apply(null, $slides.children().map(function () {
            return $(this).outerHeight();
        }).get());

        $slides.removeClass('is-measuring').css('--slide-h', tallest + 'px');
    };

    if ($slides.length) {
        fitSlides();
        $win.on('resize', fitSlides).on('load', fitSlides);

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(fitSlides);
        }
    }

    // ------------------------------------------------------------------
    // Testimonial dots follow the Bootstrap carousel
    // ------------------------------------------------------------------
    $('#testimonialCarousel').on('slide.bs.carousel', function (event) {
        $(this)
            .find('.testimonials__dots button')
            .removeClass('active')
            .removeAttr('aria-current')
            .eq(event.to)
            .addClass('active')
            .attr('aria-current', 'true');
    });

    // ------------------------------------------------------------------
    // Showreel modal: lazy-load, play on open, pause on close
    // ------------------------------------------------------------------
    const $modal = $('#showreelModal');
    const video = $modal.find('video').get(0);

    $modal.on('shown.bs.modal', () => {
        if (!video) {
            return;
        }

        if (!video.getAttribute('src')) {
            video.setAttribute('src', video.getAttribute('data-src'));
        }

        video.play().catch(() => {});
    });

    $modal.on('hidden.bs.modal', () => video && video.pause());

    // ------------------------------------------------------------------
    // Forms (front-end validation only – connect to your back end / mailer)
    // ------------------------------------------------------------------
    $('[data-contact-form]').on('submit', function (event) {
        event.preventDefault();

        const form = this;
        const $status = $('[data-form-status]');

        if (!form.checkValidity()) {
            $(form).addClass('was-validated');
            $status.text('Please check the highlighted fields.');
            $(form).find(':invalid').first().trigger('focus');
            return;
        }

        $(form).removeClass('was-validated');
        form.reset();
        $status.text('Thanks! Your enquiry is noted. We will be in touch shortly.');
    });

    $('[data-newsletter-form]').on('submit', function (event) {
        event.preventDefault();

        const $input = $(this).find('input');
        const $status = $('[data-newsletter-status]');

        if (!this.checkValidity()) {
            $status.text('Please enter a valid email address.');
            $input.trigger('focus');
            return;
        }

        this.reset();
        $status.text('You are subscribed. Welcome to the vibe!');
    });

    // ------------------------------------------------------------------
    // Footer year
    // ------------------------------------------------------------------
    $('[data-year]').text(new Date().getFullYear());
});
