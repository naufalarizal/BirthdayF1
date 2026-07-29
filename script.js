document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Animations Setup
    const animatedElements = document.querySelectorAll('.animate');
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of element is visible
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        animatedElements.forEach(el => {
            el.classList.add('active');
        });
    }

    // 2. Particle System (Racing Sparks / Stars)
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    function createParticle() {
        const particle = document.createElement('div');
        
        // Random properties
        const size = Math.random() * 3 + 1; // 1px to 4px
        const xPos = Math.random() * 100; // 0 to 100 vw
        const startY = Math.random() * 100 + 100; // start below screen
        const duration = Math.random() * 10 + 5; // 5s to 15s
        const opacity = Math.random() * 0.5 + 0.1;
        
        // Styling
        particle.style.position = 'absolute';
        particle.style.bottom = '-10px';
        particle.style.left = `${xPos}vw`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = Math.random() > 0.5 ? '#ffffff' : '#c8102E';
        particle.style.borderRadius = '50%';
        particle.style.opacity = opacity;
        particle.style.pointerEvents = 'none';
        
        // Animation
        particle.animate([
            { transform: `translateY(0) scale(1)`, opacity: opacity },
            { transform: `translateY(-120vh) scale(0)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'linear',
            iterations: Infinity,
            delay: Math.random() * 5000
        });
        
        particlesContainer.appendChild(particle);
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
});
