// Counter Animation for Stats
document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Animation speed

    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const increment = target / speed;

        const updateCount = () => {
            const current = parseFloat(counter.innerText);

            if (current < target) {
                const newValue = current + increment;
                if (isDecimal) {
                    counter.innerText = newValue > target ? target.toFixed(1) + '%' : newValue.toFixed(1);
                } else {
                    counter.innerText = Math.ceil(newValue) > target ? target + '+' : Math.ceil(newValue);
                }
                setTimeout(updateCount, 10);
            } else {
                if (isDecimal) {
                    counter.innerText = target.toFixed(1) + '%';
                } else {
                    counter.innerText = target + '+';
                }
            }
        };

        updateCount();
    };

    // Intersection Observer to trigger animation when stats are visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
});
