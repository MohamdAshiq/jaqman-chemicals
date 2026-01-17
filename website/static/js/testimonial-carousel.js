/**
 * TESTIMONIALS CAROUSEL - INFINITE LOOP IMPLEMENTATION
 * =====================================================
 * 
 * This script implements a responsive, infinite-looping carousel for client testimonials.
 * 
 * Features:
 * - Displays 3 cards on desktop, 2 on tablet, 1 on mobile
 * - Infinite loop: cards cycle seamlessly
 * - Smooth transitions with CSS transforms
 * - Arrow navigation (left/right)
 * - Auto-slide functionality
 * - Touch-friendly and accessible
 * 
 * How it works:
 * 1. Clone visible cards and append/prepend them to create seamless loop
 * 2. Track current index and update transform position
 * 3. When reaching cloned cards, instantly reset to original position
 * 4. Responsive: recalculates on window resize
 */

document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const track = document.getElementById('testimonials-track');
    const prevButton = document.getElementById('testimonial-prev');
    const nextButton = document.getElementById('testimonial-next');

    if (!track || !prevButton || !nextButton) return;

    // Get all original testimonial cards
    const originalCards = Array.from(track.querySelectorAll('.testimonial-card'));
    const totalOriginalCards = originalCards.length;

    // Configuration
    let visibleCards = 3; // Default for desktop
    let currentIndex = 0;
    let isTransitioning = false;
    let autoSlideInterval;
    const autoSlideDelay = 5000; // 5 seconds

    /**
     * Get number of visible cards based on screen width
     */
    function getVisibleCards() {
        const width = window.innerWidth;
        if (width <= 768) return 1;      // Mobile
        if (width <= 1024) return 2;     // Tablet
        return 3;                        // Desktop
    }

    /**
     * Setup infinite loop by cloning cards
     * Clones 'visibleCards' number of cards from start and end
     */
    function setupInfiniteLoop() {
        // Remove any existing clones
        track.querySelectorAll('.testimonial-card').forEach((card, index) => {
            if (index >= totalOriginalCards) {
                card.remove();
            }
        });

        visibleCards = getVisibleCards();

        // Clone cards from the end and prepend
        for (let i = totalOriginalCards - visibleCards; i < totalOriginalCards; i++) {
            const clone = originalCards[i].cloneNode(true);
            clone.classList.add('cloned');
            track.insertBefore(clone, track.firstChild);
        }

        // Clone cards from the start and append
        for (let i = 0; i < visibleCards; i++) {
            const clone = originalCards[i].cloneNode(true);
            clone.classList.add('cloned');
            track.appendChild(clone);
        }

        // Set initial position to first original card (after prepended clones)
        currentIndex = visibleCards;
        updateCarousel(false); // No animation for initial setup
    }

    /**
     * Calculate card width including gap
     */
    function getCardWidth() {
        const cards = track.querySelectorAll('.testimonial-card');
        if (cards.length === 0) return 0;

        const cardStyle = window.getComputedStyle(cards[0]);
        const cardWidth = cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap) || 0;

        return cardWidth + gap;
    }

    /**
     * Update carousel position
     * @param {boolean} animate - Whether to use smooth transition
     */
    function updateCarousel(animate = true) {
        const cardWidth = getCardWidth();
        const offset = -currentIndex * cardWidth;

        if (animate) {
            track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            track.style.transition = 'none';
        }

        track.style.transform = `translateX(${offset}px)`;
    }

    /**
     * Move to next slide
     */
    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex++;
        updateCarousel(true);

        // Check if we've reached a cloned card
        setTimeout(() => {
            if (currentIndex >= visibleCards + totalOriginalCards) {
                // We're at the cloned cards at the end
                // Jump back to the first original card
                currentIndex = visibleCards;
                updateCarousel(false);
            }
            isTransitioning = false;
        }, 500); // Match CSS transition duration
    }

    /**
     * Move to previous slide
     */
    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex--;
        updateCarousel(true);

        // Check if we've reached a cloned card
        setTimeout(() => {
            if (currentIndex < visibleCards) {
                // We're at the cloned cards at the start
                // Jump to the last original card
                currentIndex = visibleCards + totalOriginalCards - 1;
                updateCarousel(false);
            }
            isTransitioning = false;
        }, 500); // Match CSS transition duration
    }

    /**
     * Start auto-slide
     */
    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval
        autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
    }

    /**
     * Stop auto-slide
     */
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        const newVisibleCards = getVisibleCards();
        if (newVisibleCards !== visibleCards) {
            // Visible cards changed, need to rebuild
            setupInfiniteLoop();
            startAutoSlide();
        }
    }

    // Event Listeners
    nextButton.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide(); // Stop auto-slide when user interacts
        startAutoSlide(); // Restart auto-slide
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide(); // Stop auto-slide when user interacts
        startAutoSlide(); // Restart auto-slide
    });

    // Pause auto-slide on hover
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    // Handle resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left, go to next
                nextSlide();
            } else {
                // Swiped right, go to previous
                prevSlide();
            }
        }
    }

    // Initialize carousel
    setupInfiniteLoop();
    startAutoSlide();
});

// Progress Dots Integration
const dotsContainer = document.getElementById('testimonial-dots');
if (dotsContainer && typeof currentIndex !== 'undefined') {
    const dots = dotsContainer.querySelectorAll('.testimonial-dot');
    window.updateTestimonialDots = function() {
        const track = document.getElementById('testimonials-track');
        if (!track) return;
        const cards = track.querySelectorAll('.testimonial-card');
        const totalCards = 6;
        let index = Math.floor((Math.abs(parseFloat(track.style.transform.replace('translateX(', '').replace('px)', '')) || 0) / (cards[0]?.offsetWidth || 1))) % totalCards;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };
}
