/**
 * Addvibez – front-end behaviour (jQuery 4.0.0)
 * Progressive enhancement: the pages are fully readable without this file.
 */
jQuery(function ($) {
    'use strict';

    const $win = $(window);
    const $header = $('[data-header]');
    const $scrollTop = $('[data-scroll-top]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    // Active nav link on scroll (home page only: links to #sections)
    // ------------------------------------------------------------------
    const $navLinks = $('.site-menu__link');
    const sections = $navLinks
        .filter('[href^="#"]')
        .map(function () {
            const $target = $($(this).attr('href'));
            return $target.length ? { link: $(this), target: $target } : null;
        })
        .get();

    const updateActiveLink = () => {
        if (!sections.length) {
            return;
        }

        const probe = $win.scrollTop() + $header.outerHeight() + window.innerHeight * 0.25;
        let current = sections[0];

        sections.forEach((item) => {
            if (item.target.offset().top <= probe) {
                current = item;
            }
        });

        $navLinks.removeClass('is-active').removeAttr('aria-current');
        current.link.addClass('is-active').attr('aria-current', 'true');
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
            updateActiveLink();
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
    // Contact / enquiry forms (front-end validation only – connect to
    // your back end or mailer)
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

    // ------------------------------------------------------------------
    // Footer year
    // ------------------------------------------------------------------
    $('[data-year]').text(new Date().getFullYear());
});
