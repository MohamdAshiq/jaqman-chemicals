// Hero Text Animations - Typing Effect for Rotating Tagline

document.addEventListener('DOMContentLoaded', function () {
    // Rotating text phrases (after "Your Trusted")
    const phrases = [
        'Global Chemical Partner',
        'Premium Chemical Source',
        'Chemical Excellence Partner',
        'Industrial Needs Solution',
        'Chemical Trading Expert',
        'Quality Solvents Supplier'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // milliseconds per character
    const deletingSpeed = 50;
    const pauseAfterComplete = 2000; // pause when phrase is complete
    const pauseAfterDelete = 500; // pause after deleting

    const rotatingTextElement = document.getElementById('rotating-text');

    function typeText() {
        if (!rotatingTextElement) return;

        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            // Delete character
            rotatingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeText, pauseAfterDelete);
                return;
            }
            setTimeout(typeText, deletingSpeed);
        } else {
            // Type character
            rotatingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(typeText, pauseAfterComplete);
                return;
            }
            setTimeout(typeText, typingSpeed);
        }
    }

    // Start typing animation after a short delay
    setTimeout(typeText, 1000);

    // Add fade-in animation to hero title
    const heroTitle = document.querySelector('.hero-title-animated');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroTitle.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }

    // Counter Animation for About Page Stats
    const counters = document.querySelectorAll('.counter');

    if (counters.length > 0) {
        const animateCounter = (counter) => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    // Handle decimal numbers
                    if (target % 1 !== 0) {
                        counter.textContent = current.toFixed(1);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    // Final value
                    if (target % 1 !== 0) {
                        counter.textContent = target.toFixed(1) + '%';
                    } else {
                        counter.textContent = target + '+';
                    }
                }
            };

            updateCounter();
        };

        // Intersection Observer to trigger animation when visible
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
});
