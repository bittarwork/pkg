// Slide Navigation
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const currentSlideElement = document.getElementById('currentSlide');
const totalSlidesElement = document.getElementById('totalSlides');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Initialize
totalSlidesElement.textContent = totalSlides;
showSlide(0);

// Show specific slide
function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
        slide.style.display = 'none';
    });
    
    // Show current slide
    if (index >= 0 && index < totalSlides) {
        currentSlide = index;
        slides[currentSlide].style.display = 'block';
        currentSlideElement.textContent = currentSlide + 1;
        
        // Update navigation buttons
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Previous slide
prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
});

// Next slide
nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (currentSlide < totalSlides - 1) {
            showSlide(currentSlide + 1);
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }
});

// Download as PDF
downloadBtn.addEventListener('click', async () => {
    // Show loading state
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="50" stroke-dashoffset="0"><animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="1s" repeatCount="indefinite"/></circle></svg> جاري التحميل...';
    downloadBtn.disabled = true;
    
    try {
        // Store current state
        const currentIndex = currentSlide;
        
        // Show all slides temporarily
        slides.forEach(slide => {
            slide.style.display = 'block';
        });
        
        // Hide navigation elements
        const navigation = document.querySelector('.navigation');
        const downloadButton = document.getElementById('downloadBtn');
        navigation.style.display = 'none';
        downloadButton.style.display = 'none';
        
        // PDF options
        const opt = {
            margin: 0,
            filename: 'NAWA_Agency_Presentation.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'landscape',
                compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        // Generate PDF
        const element = document.getElementById('presentation');
        await html2pdf().set(opt).from(element).save();
        
        // Restore state
        navigation.style.display = 'flex';
        downloadButton.style.display = 'flex';
        showSlide(currentIndex);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('حدث خطأ أثناء تحميل ملف PDF. يرجى المحاولة مرة أخرى.');
    } finally {
        // Restore button
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }
});

// Add smooth scroll behavior
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

// Add animation on scroll for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-card, .service-item, .package-card, .discount-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            if (currentSlide < totalSlides - 1) {
                showSlide(currentSlide + 1);
            }
        } else {
            // Swipe right - previous slide
            if (currentSlide > 0) {
                showSlide(currentSlide - 1);
            }
        }
    }
}

// Add hover effect to package features
document.querySelectorAll('.package-features li').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(-10px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Animate numbers
function animateNumber(element, start, end, duration) {
    let startTime = null;
    
    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Animate prices on load
window.addEventListener('load', () => {
    document.querySelectorAll('.price').forEach(priceElement => {
        const priceText = priceElement.textContent.replace(/[^0-9]/g, '');
        const priceValue = parseInt(priceText);
        if (!isNaN(priceValue)) {
            priceElement.textContent = '0$';
            setTimeout(() => {
                let current = 0;
                const increment = Math.ceil(priceValue / 50);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= priceValue) {
                        current = priceValue;
                        clearInterval(timer);
                    }
                    priceElement.textContent = current.toLocaleString() + '$';
                }, 20);
            }, 500);
        }
    });
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    ripple.classList.add('ripple');
    
    const rippleEffect = button.getElementsByClassName('ripple')[0];
    if (rippleEffect) {
        rippleEffect.remove();
    }
    
    button.appendChild(ripple);
}

document.querySelectorAll('.nav-btn, .download-btn').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .nav-btn, .download-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console log
console.log('%c NAWA Agency Presentation ', 'background: #568FD3; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c Total Slides: ' + totalSlides, 'color: #568FD3; font-size: 14px;');

