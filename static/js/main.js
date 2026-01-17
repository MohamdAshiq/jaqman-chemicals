// Main JavaScript for navigation and scroll effects

document.addEventListener('DOMContentLoaded', function () {
    // Mobile navigation toggle
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.navbar-container')) {
                navbarMenu.classList.remove('active');
            }
        });
    }

    // Navbar Active State Detection (works on static sites including GitHub Pages)
    const currentPath = window.location.pathname.toLowerCase();
    const navbarLinks = document.querySelectorAll('.navbar-link');

    // Helper: check if current path matches a route
    const isRouteActive = (routeName) => {
        return currentPath.includes('/' + routeName + '/') || currentPath.endsWith('/' + routeName);
    };

    // Check if we're on home page (root or repo root like /jaqman-chemicals/)
    const pathParts = currentPath.split('/').filter(part => part.length > 0);
    const lastSegment = pathParts[pathParts.length - 1] || '';
    const isHomePage = pathParts.length === 0 ||
        pathParts.length === 1 && !['about', 'products', 'industries', 'resources', 'contact'].includes(lastSegment) ||
        lastSegment === 'index.html';

    navbarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        const linkText = link.textContent.trim().toLowerCase();

        // Match based on link text content
        if (linkText === 'home' && isHomePage) {
            link.classList.add('active');
        } else if (linkText === 'about' && isRouteActive('about')) {
            link.classList.add('active');
        } else if (linkText === 'products' && (isRouteActive('products') || currentPath.includes('/product/'))) {
            link.classList.add('active');
        } else if (linkText === 'industries' && isRouteActive('industries')) {
            link.classList.add('active');
        } else if (linkText === 'resources' && isRouteActive('resources')) {
            link.classList.add('active');
        } else if (linkText === 'contact' && isRouteActive('contact')) {
            link.classList.add('active');
        }
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Page Transition Animation - Fade out on navigation, fade in on load
    const pageTransition = document.querySelector('.page-transition');

    if (pageTransition) {
        // Handle all navbar link clicks for smooth page transitions
        document.querySelectorAll('.navbar-link').forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Always apply transition, even if clicking the same page
                e.preventDefault();

                // Fade out animation
                pageTransition.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
                pageTransition.style.opacity = '0';
                pageTransition.style.transform = 'translateY(-10px)';

                // Navigate after fade out
                setTimeout(() => {
                    window.location.href = href;
                }, 250);
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Unified Scroll Reveal System
    const revealObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    // 1. Observe manual reveal elements
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
        revealObserver.observe(el);
    });

    // 2. Automatically apply reveal to major sections for global coverage
    const revealSelectors = [
        'section', '.section', '.section-sm', '.card', '.feature-card', '.product-card',
        '.industry-card', '.product-detail-grid', '.section-header', '.about-hero-content',
        '.industries-hero-content', '.contact-info', '.contact-grid', '.table-container',
        '.industries-stats-section', '.resource-card'
    ];

    document.querySelectorAll(revealSelectors.join(', ')).forEach(el => {
        if (!el.classList.contains('reveal') && !el.classList.contains('reveal-stagger')) {
            el.classList.add('reveal');
        }
        revealObserver.observe(el);
    });

    // 3. Apply staggered reveal to grids and lists for a more premium feel
    // Note: industries-grid excluded so Industries page cards load immediately
    const staggerSelectors = [
        '.grid:not(.industries-grid)', '.features-grid', '.products-grid', '.about-story-highlights',
        '.mv-grid', '.spec-grid', '.industries-stats-grid',
        '.footer-grid', '.contact-form', '.resources-grid'
    ];

    document.querySelectorAll(staggerSelectors.join(', ')).forEach(el => {
        if (!el.classList.contains('reveal-stagger')) {
            el.classList.add('reveal-stagger');
        }
        revealObserver.observe(el);
    });

    // Auto-hide messages after 5 seconds
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateX(100%)';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    });

    // Parallax Effect Implementation
    const parallaxManager = {
        elements: [],
        ticking: false,
        init: function () {
            this.elements = document.querySelectorAll('.parallax-background');
            if (this.elements.length === 0) return;

            // Initial positioning
            this.handleParallax();

            // Use throttled scroll handler with requestAnimationFrame for smooth 60fps movement
            window.addEventListener('scroll', () => {
                if (!this.ticking) {
                    requestAnimationFrame(() => {
                        this.handleParallax();
                        this.ticking = false;
                    });
                    this.ticking = true;
                }
            }, { passive: true });

            // Also handle resize for responsive behavior
            window.addEventListener('resize', () => {
                requestAnimationFrame(() => this.handleParallax());
            }, { passive: true });
        },
        handleParallax: function () {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;

            this.elements.forEach(el => {
                const parent = el.closest('.section-parallax');
                if (!parent) return;

                const parentRect = parent.getBoundingClientRect();
                const parentTop = parentRect.top + scrollY;
                const parentHeight = parentRect.height;

                // Only animate if section is in or near viewport (with extended buffer)
                if (parentRect.top < windowHeight * 1.5 && parentRect.bottom > -windowHeight * 0.5) {
                    const progress = (windowHeight - parentRect.top) / (windowHeight + parentHeight);
                    const clampedProgress = Math.max(0, Math.min(1, progress));

                    // Enhanced parallax movement
                    const yPos = (clampedProgress - 0.5) * 60;

                    // Add subtle scale effect for depth perception
                    const scale = 1.05 + (clampedProgress - 0.5) * 0.05;

                    // Apply smooth transform with GPU acceleration
                    el.style.transform = `translate3d(0, ${yPos}%, 0) scale(${scale})`;
                }
            });
        }
    };

    parallaxManager.init();

    // Timeline Scroll Progress Animation
    const timelineProgressManager = {
        timeline: null,
        progressLine: null,
        items: [],
        markers: [],
        contents: [],

        init: function () {
            this.timeline = document.querySelector('.about-timeline');
            this.progressLine = document.querySelector('.about-timeline-progress');
            this.items = document.querySelectorAll('.about-timeline-item');
            this.markers = document.querySelectorAll('.about-timeline-marker');
            this.contents = document.querySelectorAll('.about-timeline-content');

            if (!this.timeline || !this.progressLine || this.items.length === 0) return;

            // Initial update
            this.updateProgress();

            // Update on scroll with throttling
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.updateProgress();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        },

        updateProgress: function () {
            const timelineRect = this.timeline.getBoundingClientRect();
            const timelineTop = timelineRect.top;
            const timelineHeight = timelineRect.height;
            const windowHeight = window.innerHeight;

            // Calculate the trigger point (center of viewport)
            const triggerPoint = windowHeight * 0.6;

            // Calculate progress based on how much of the timeline has passed the trigger point
            const scrolledPast = triggerPoint - timelineTop;
            const progress = Math.max(0, Math.min(1, scrolledPast / timelineHeight));

            // Update progress line height
            this.progressLine.style.height = `${progress * 100}%`;

            // Update each item's active state
            this.items.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.top + (itemRect.height / 2);

                // Mark as active if the item center is above the trigger point
                if (itemCenter < triggerPoint) {
                    this.markers[index]?.classList.add('active');
                    this.contents[index]?.classList.add('active');
                } else {
                    this.markers[index]?.classList.remove('active');
                    this.contents[index]?.classList.remove('active');
                }
            });
        }
    };

    timelineProgressManager.init();

    // === LENIS SMOOTH SCROLL ===
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        direction: 'vertical',
        smoothTouch: false
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
});
// ... existing code ...

/* =========================================
   Premium Toast Notifications
   ========================================= */
function showToast(message, type = 'error') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    // Icon based on type
    let iconSvg = '';
    if (type === 'error') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="toast-icon" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else if (type === 'success') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="toast-icon" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="toast-icon" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
        ${iconSvg}
        <div class="toast-content">${message}</div>
    `;

    // Add to container
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 500); // Wait for transition
    }, 4000); // Show for 4 seconds
}

/* =========================================
   Custom Form Validation Interceptor
   ========================================= */
function setupPremiumValidation(formElement) {
    if (!formElement) return;

    // Disable default bubble
    formElement.setAttribute('novalidate', true);

    // Helper to show inline error
    const showError = (input, message) => {
        const formGroup = input.closest('.form-group-premium');
        if (!formGroup) return;

        // Check if error message exists
        let errorDisplay = formGroup.querySelector('.form-error-message');
        if (!errorDisplay) {
            errorDisplay = document.createElement('div');
            errorDisplay.className = 'form-error-message';
            formGroup.appendChild(errorDisplay);
        }

        errorDisplay.textContent = message;
        formGroup.classList.add('error');

        // Small delay to allow transition
        requestAnimationFrame(() => {
            errorDisplay.classList.add('visible');
        });
    };

    // Helper to clear error
    const clearError = (input) => {
        const formGroup = input.closest('.form-group-premium');
        if (!formGroup) return;

        const errorDisplay = formGroup.querySelector('.form-error-message');
        formGroup.classList.remove('error');
        if (errorDisplay) {
            errorDisplay.classList.remove('visible');
        }
    };

    // Listen for input to clear errors
    formElement.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => clearError(input));
        input.addEventListener('change', () => clearError(input));
    });

    // Intercept submit
    formElement.addEventListener('submit', (e) => {
        // Check constraints
        if (!formElement.checkValidity()) {
            e.preventDefault();
            e.stopImmediatePropagation(); // Stop other listeners if invalid

            // Find ONLY the first invalid field
            // We use a robust selector to find the first candidate
            const inputs = Array.from(formElement.querySelectorAll('input, textarea, select'));
            const firstInvalid = inputs.find(input => !input.checkValidity());

            if (firstInvalid) {
                // Show error ONLY for this field
                showError(firstInvalid, firstInvalid.validationMessage);

                // Focus and shake
                firstInvalid.focus();
                const formGroup = firstInvalid.closest('.form-group-premium');
                if (formGroup) {
                    formGroup.classList.add('shake-field');
                    setTimeout(() => formGroup.classList.remove('shake-field'), 500);
                }
            }
        }
    });

    // Expose helpers to validationForm for custom usage (e.g. phone)
    formElement.showInlineError = showError;
    formElement.clearInlineError = clearError;
}
