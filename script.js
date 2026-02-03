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

// Animate elements on scroll into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.about-card, .service-item, .plan-item, .price-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'all 0.5s ease';
    observer.observe(el);
});

// Animate main price when price box enters view
const priceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const priceElement = entry.target.querySelector('.price');
            if (priceElement && !priceElement.dataset.animated) {
                priceElement.dataset.animated = '1';
                const priceValue = 300;
                priceElement.textContent = '0$';
                let current = 0;
                const increment = 15;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= priceValue) {
                        current = priceValue;
                        clearInterval(timer);
                    }
                    priceElement.textContent = current + '$';
                }, 25);
            }
        }
    });
}, { threshold: 0.3 });

const priceBox = document.querySelector('.price-box');
if (priceBox) {
    priceObserver.observe(priceBox);
}
