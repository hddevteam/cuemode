// CueMode Website JavaScript
// Enhanced interaction and animations

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.feature-card, .use-case-card, .method, .support-card, .step, .theme-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Theme preview hover effects
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Add floating animation to demo screens
    const demoScreens = document.querySelectorAll('.demo-screen');
    demoScreens.forEach((screen, index) => {
        // Add slight delay to create staggered animation
        screen.style.animationDelay = `${index * 0.5}s`;
    });

    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });

    // Mobile menu toggle (if needed in future)
    const createMobileMenu = () => {
        const navContainer = document.querySelector('.nav-container');
        const navLinks = document.querySelector('.nav-links');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.classList.add('mobile-menu-btn');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.style.display = 'none';
        
        // Add mobile styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .mobile-menu-btn {
                    display: block !important;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #6366f1;
                    cursor: pointer;
                }
                
                .nav-links.mobile-hidden {
                    display: none;
                }
                
                .nav-links.mobile-shown {
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: rgba(255, 255, 255, 0.98);
                    padding: 1rem;
                    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Add click handler
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-hidden');
            navLinks.classList.toggle('mobile-shown');
        });
        
        navContainer.appendChild(mobileMenuBtn);
    };

    // Initialize mobile menu if on small screen
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }

    // Stats counter animation
    const statsNumbers = document.querySelectorAll('.stat-number');
    const animateStats = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                // Skip if not a number
                if (finalValue === '∞') return;
                
                let currentValue = 0;
                const increment = finalValue / 50;
                
                const updateCounter = () => {
                    currentValue += increment;
                    if (currentValue < finalValue) {
                        target.textContent = Math.ceil(currentValue);
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = finalValue;
                    }
                };
                
                updateCounter();
            }
        });
    };

    const statsObserver = new IntersectionObserver(animateStats, { threshold: 0.5 });
    statsNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Add loading animation
    const addLoadingAnimation = () => {
        const loader = document.createElement('div');
        loader.classList.add('page-loader');
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Loading CueMode...</p>
            </div>
        `;
        
        const loaderStyles = `
            .page-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #6366f1, #22d3ee);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 1;
                transition: opacity 0.5s ease;
            }
            
            .loader-content {
                text-align: center;
                color: white;
            }
            
            .loader-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = loaderStyles;
        document.head.appendChild(style);
        document.body.appendChild(loader);
        
        // Remove loader after page loads
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1500);
    };

    // Initialize loader
    addLoadingAnimation();

    // Console welcome message
    console.log('%c Welcome to CueMode! 🎯', 'color: #6366f1; font-size: 20px; font-weight: bold;');
    console.log('%c Transform your VS Code into presentation mode', 'color: #22d3ee; font-size: 14px;');
    console.log('%c GitHub: https://github.com/hddevteam/cuemode', 'color: #64748b; font-size: 12px;');
});

// External link tracking (if analytics is added later)
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hostname !== window.location.hostname) {
        // External link clicked - could track with analytics
        console.log('External link clicked:', link.href);
    }
});

// Performance optimization - lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => {
    imageObserver.observe(img);
});

// Error handling for missing images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        // Could add fallback image here
    }
}, true);
