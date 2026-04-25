/**
 * ========================================
 * HOTEL MIRADOR - JavaScript
 * Author: v0 Assistant
 * Description: Interactive functionality for the hotel website
 * ========================================
 */

// ========== DOM ELEMENTS ==========
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const floatingBtn = document.getElementById('floatingBtn');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

// Gallery Elements
const galleryCarousel = document.getElementById('galleryCarousel');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');
const galleryIndicators = document.getElementById('galleryIndicators');
const gallerySlides = document.querySelectorAll('.gallery-slide');

// ========== HEADER SCROLL EFFECT ==========
/**
 * Adds/removes 'scrolled' class to header based on scroll position
 * Changes header background from transparent to solid white
 */
function handleHeaderScroll() {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ========== FLOATING BUTTON VISIBILITY ==========
/**
 * Shows/hides floating reserve button based on scroll position
 */
function handleFloatingButton() {
    if (window.scrollY > 500) {
        floatingBtn.classList.add('show');
    } else {
        floatingBtn.classList.remove('show');
    }
}

// ========== MOBILE MENU TOGGLE ==========
/**
 * Toggles mobile navigation menu open/close
 */
function toggleMobileMenu() {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

/**
 * Closes mobile menu when a navigation link is clicked
 */
function closeMobileMenu() {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ========== SMOOTH SCROLL ==========
/**
 * Implements smooth scrolling for anchor links
 * Accounts for fixed header height
 */
function smoothScroll(e) {
    // Only process internal anchor links
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            closeMobileMenu();
        }
    }
}

// ========== GALLERY CAROUSEL ==========
let currentSlide = 0;
let autoSlideInterval = null;
const slideCount = gallerySlides.length;

/**
 * Creates indicator dots for gallery carousel
 */
function createGalleryIndicators() {
    if (!galleryIndicators) return;
    
    for (let i = 0; i < slideCount; i++) {
        const indicator = document.createElement('button');
        indicator.classList.add('gallery-indicator');
        indicator.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
        if (i === 0) indicator.classList.add('active');
        
        indicator.addEventListener('click', () => goToSlide(i));
        galleryIndicators.appendChild(indicator);
    }
}

/**
 * Updates the carousel to show the specified slide
 * @param {number} index - Index of the slide to show
 */
function goToSlide(index) {
    if (index < 0) {
        currentSlide = slideCount - 1;
    } else if (index >= slideCount) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }
    
    // Move carousel
    galleryCarousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update indicators
    const indicators = galleryIndicators.querySelectorAll('.gallery-indicator');
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === currentSlide);
    });
}

/**
 * Advances to the next slide
 */
function nextSlide() {
    goToSlide(currentSlide + 1);
}

/**
 * Goes to the previous slide
 */
function prevSlide() {
    goToSlide(currentSlide - 1);
}

/**
 * Starts automatic slide advancement
 */
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
}

/**
 * Stops automatic slide advancement
 */
function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// ========== FORM VALIDATION ==========
/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Shows error message for a form field
 * @param {string} fieldId - ID of the field
 * @param {string} message - Error message to show
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    if (field) field.classList.add('error');
    if (errorElement) errorElement.textContent = message;
}

/**
 * Clears error message for a form field
 * @param {string} fieldId - ID of the field
 */
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    if (field) field.classList.remove('error');
    if (errorElement) errorElement.textContent = '';
}

/**
 * Validates and handles contact form submission
 * @param {Event} e - Submit event
 */
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    
    let isValid = true;
    
    // Clear previous errors
    clearError('nombre');
    clearError('email');
    clearError('mensaje');
    
    // Validate nombre
    if (!nombre) {
        showError('nombre', 'Por favor ingresa tu nombre');
        isValid = false;
    } else if (nombre.length < 2) {
        showError('nombre', 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError('email', 'Por favor ingresa tu correo electrónico');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Por favor ingresa un correo electrónico válido');
        isValid = false;
    }
    
    // Validate mensaje
    if (!mensaje) {
        showError('mensaje', 'Por favor ingresa tu mensaje');
        isValid = false;
    } else if (mensaje.length < 10) {
        showError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
    }
    
    // If valid, show success message
    if (isValid) {
        const formSuccess = document.getElementById('formSuccess');
        formSuccess.classList.add('show');
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            formSuccess.classList.remove('show');
        }, 5000);
    }
}

/**
 * Handles newsletter form submission
 * @param {Event} e - Submit event
 */
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (email && isValidEmail(email)) {
        // Show simple confirmation
        alert('¡Gracias por suscribirte! Pronto recibirás nuestras ofertas exclusivas.');
        newsletterForm.reset();
    } else {
        alert('Por favor ingresa un correo electrónico válido.');
    }
}

// ========== LANGUAGE SELECTOR (Visual Only) ==========
/**
 * Handles language button clicks (visual only, no actual translation)
 */
function handleLanguageClick() {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
/**
 * Creates fade-in animation for elements as they enter viewport
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.room-card, .service-card, .testimonial-card, .hotel-content');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ========== EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Initial check
    
    // Floating button visibility
    window.addEventListener('scroll', handleFloatingButton);
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });
    
    // Gallery carousel
    if (galleryCarousel && slideCount > 0) {
        createGalleryIndicators();
        
        if (galleryPrev) {
            galleryPrev.addEventListener('click', () => {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }
        
        if (galleryNext) {
            galleryNext.addEventListener('click', () => {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }
        
        // Start auto-slide
        startAutoSlide();
        
        // Pause on hover
        galleryCarousel.addEventListener('mouseenter', stopAutoSlide);
        galleryCarousel.addEventListener('mouseleave', startAutoSlide);
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        galleryCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        galleryCarousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                stopAutoSlide();
                startAutoSlide();
            }
        }, { passive: true });
    }
    
    // Contact form validation
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        
        // Clear errors on input
        ['nombre', 'email', 'mensaje'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => clearError(fieldId));
            }
        });
    }
    
    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Language selector
    handleLanguageClick();
    
    // Scroll animations
    initScrollAnimations();
});

// ========== KEYBOARD NAVIGATION FOR GALLERY ==========
document.addEventListener('keydown', function(e) {
    // Only if gallery is in view
    const gallerySection = document.getElementById('galeria');
    if (!gallerySection) return;
    
    const rect = gallerySection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInView) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        }
    }
});

// ========== CONSOLE LOG FOR DEVELOPMENT ==========
console.log('%c🏨 Hotel Mirador', 'font-size: 24px; font-weight: bold; color: #9A7B4F;');
console.log('%cWebsite loaded successfully!', 'font-size: 14px; color: #666;');
