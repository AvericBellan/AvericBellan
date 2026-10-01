/* ============================================
   AVERIC BELLAN - MAIN JAVASCRIPT
   Professional Book Marketing Website
   ============================================ */

document.body.style.overflow = 'hidden';

document.addEventListener('DOMContentLoaded', function () {

    // ---- PRELOADER / INTRO LOADER ----
    const loader = document.getElementById('loader');
    if (loader) {
        const hideLoader = function () {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        };

        window.addEventListener('load', function () {
            setTimeout(hideLoader, 700);
        });

        // Fallback in case load event is delayed or blocked
        setTimeout(hideLoader, 2800);
    }

    // ---- NAVBAR SCROLL EFFECT ----
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    function handleNavScroll() {
        const currentScroll = window.pageYOffset;
        if (navbar) {
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();

    // ---- MOBILE MENU TOGGLE ----
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        const navLinks = navMenu.querySelectorAll('.nav-link:not(.has-dropdown), .dropdown-link, .nav-cta');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- MOBILE DROPDOWN TOGGLE ----
    const dropdownToggles = document.querySelectorAll('.nav-link.has-dropdown');
    dropdownToggles.forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.closest('.nav-item');
                parent.classList.toggle('dropdown-open');
            }
        });
    });

    // ---- FADE IN ON SCROLL (Intersection Observer) ----
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up, .scale-in');

    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(function (el) {
            fadeObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        fadeElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ---- COUNTER ANIMATION ----
    const counters = document.querySelectorAll('.count-up');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // ease out cubic
            const current = Math.floor(easeProgress * target);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                el.textContent = prefix + target.toLocaleString() + suffix;
            }
        }

        requestAnimationFrame(updateCount);
    }

    if ('IntersectionObserver' in window && counters.length > 0) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }

    // ---- FAQ ACCORDION ----
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function () {
                const isActive = item.classList.contains('active');

                // Close all
                faqItems.forEach(function (otherItem) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                });

                // Open clicked (if it was not already active)
                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                }
            });
        }
    });

    // ---- BACK TO TOP BUTTON ----
    const backToTop = document.querySelector('.back-to-top');

    function handleBackToTop() {
        if (backToTop) {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', handleBackToTop);

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            }
        });
    });

    // ---- ACTIVE NAV LINK BASED ON URL ----
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-link');
    allNavLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            // Also highlight parent nav-link if it's a dropdown item
            const parentNavItem = link.closest('.nav-item');
            if (parentNavItem) {
                const parentLink = parentNavItem.querySelector('.nav-link');
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        }
    });

    // ---- TYPING EFFECT (optional for hero) ----
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const text = typingElement.getAttribute('data-text') || '';
        let index = 0;
        typingElement.textContent = '';

        function typeChar() {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, 40);
            }
        }

        setTimeout(typeChar, 1500);
    }

    // ---- FORM SUBMISSION FEEDBACK ----
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }
        });
    }

    // ---- PARALLAX LIGHT EFFECT ON HERO ----
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            if (scrolled < heroHeight) {
                const particles = hero.querySelector('.hero-particles');
                if (particles) {
                    particles.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
                }
            }
        });
    }

    // ---- SET CURRENT YEAR IN FOOTER (if needed) ----
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

});