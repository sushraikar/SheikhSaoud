// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    initializeNavigation();
    initializeMobileMenu();
    initializeEventListeners();
    initializeScrollAnimations();
    initializeStatCounters();
    initializeCarousel();
    initializeLightbox();
    initializeContactForm();
    initializeNewsletterForm();
    loadNewsContent();
    initializeScrollToTop();
}

// Initialize all event listeners
function initializeEventListeners() {
    // CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            openEnhancedChatbot();
        });
    }
    
    // Carousel buttons
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');
    if (carouselPrev) carouselPrev.addEventListener('click', () => moveCarousel(-1));
    if (carouselNext) carouselNext.addEventListener('click', () => moveCarousel(1));
    
    // Chatbot elements
    const chatFab = document.getElementById('chat-fab');
    const chatbotClose = document.getElementById('chatbot-close');
    const voiceBtn = document.getElementById('voice-btn');
    const sendBtn = document.getElementById('send-btn');
    
    if (chatFab) chatFab.addEventListener('click', openEnhancedChatbot);
    if (chatbotClose) chatbotClose.addEventListener('click', closeEnhancedChatbot);
    if (voiceBtn) voiceBtn.addEventListener('click', toggleEnhancedVoiceInput);
    if (sendBtn) sendBtn.addEventListener('click', sendEnhancedMessage);
    
    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => changeLightboxImage(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => changeLightboxImage(1));
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle scroll effect on navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                const hamburger = document.getElementById('hamburger');
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for different elements
                if (entry.target.classList.contains('role-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, delay);
                }
                
                if (entry.target.classList.contains('timeline-item')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 200;
                    setTimeout(() => {
                        entry.target.style.transform = 'translateX(0)';
                        entry.target.style.opacity = '1';
                    }, delay);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.role-card, .timeline-item, .news-card, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
        observer.observe(el);
    });
}

// Animated counters
function initializeStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    if (statNumbers.length > 0) {
        observer.observe(statNumbers[0].closest('.stats-grid'));
    }
    
    function animateCounters() {
        statNumbers.forEach(element => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format the number appropriately
                if (target === 2016) {
                    element.textContent = Math.floor(current);
                } else if (target >= 10) {
                    element.textContent = Math.floor(current) + '+';
                } else {
                    element.textContent = current.toFixed(0);
                }
            }, 16);
        });
    }
}

// Gallery carousel functionality
window.currentSlide = 0;
const slidesToShow = window.innerWidth <= 768 ? 1 : 3;

function initializeCarousel() {
    const track = document.getElementById('carousel-track');
    const items = document.querySelectorAll('.gallery-item');
    
    if (!track || items.length === 0) return;
    
    // Clone items for infinite scroll effect
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
    
    // Add click listeners to gallery items
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index % items.length);
        });
    });
    
    updateCarouselPosition();
    
    // Auto-play carousel
    setInterval(() => {
        moveCarousel(1);
    }, 5000);
    
    // Touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    track.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only handle horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                moveCarousel(1); // Swipe left - next
            } else {
                moveCarousel(-1); // Swipe right - previous
            }
        }
    });
}

function moveCarousel(direction) {
    const track = document.getElementById('carousel-track');
    const items = document.querySelectorAll('.gallery-item');
    const totalItems = Math.floor(items.length / 2); // Account for cloned items
    
    window.currentSlide += direction;
    
    if (window.currentSlide >= totalItems) {
        window.currentSlide = 0;
    } else if (window.currentSlide < 0) {
        window.currentSlide = totalItems - 1;
    }
    
    updateCarouselPosition();
}

function updateCarouselPosition() {
    const track = document.getElementById('carousel-track');
    const itemWidth = 400; // Width of each gallery item
    const gap = 24; // Gap between items
    const offset = -(window.currentSlide * (itemWidth + gap));
    
    track.style.transform = `translateX(${offset}px)`;
}

// Lightbox functionality
let lightboxImages = [];
let currentLightboxIndex = 0;

function initializeLightbox() {
    const images = document.querySelectorAll('.gallery-item img');
    lightboxImages = Array.from(images).map(img => ({
        src: img.src,
        alt: img.alt
    }));
}

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    lightboxImage.src = lightboxImages[index].src;
    lightboxImage.alt = lightboxImages[index].alt;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function changeLightboxImage(direction) {
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex >= lightboxImages.length) {
        currentLightboxIndex = 0;
    } else if (currentLightboxIndex < 0) {
        currentLightboxIndex = lightboxImages.length - 1;
    }
    
    const lightboxImage = document.getElementById('lightbox-image');
    lightboxImage.src = lightboxImages[currentLightboxIndex].src;
    lightboxImage.alt = lightboxImages[currentLightboxIndex].alt;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                changeLightboxImage(-1);
                break;
            case 'ArrowRight':
                changeLightboxImage(1);
                break;
        }
    }
});

// Contact form handling
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', submitContactForm);
    }
}

async function submitContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone') || '',
            message: formData.get('message'),
            timestamp: new Date().toISOString(),
            source: 'website_contact_form'
        };
        
        // For demo purposes, simulate successful submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Failed to send message. Please try again later.', 'error');
    } finally {
        // Restore button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Newsletter form handling
function initializeNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', subscribeNewsletter);
    });
}

async function subscribeNewsletter(event) {
    event.preventDefault();
    
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    try {
        const email = emailInput.value;
        
        const data = {
            email: email,
            timestamp: new Date().toISOString(),
            source: 'newsletter_signup'
        };
        
        // For demo purposes, simulate successful subscription
        await new Promise(resolve => setTimeout(resolve, 1000));
        showNotification('Successfully subscribed to newsletter!', 'success');
        emailInput.value = '';
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showNotification('Failed to subscribe. Please try again later.', 'error');
    } finally {
        // Restore button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Load news content
function loadNewsContent() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;
    
    const newsData = [
        {
            date: '2024-01-15',
            title: 'ICAFE Launches New Economic Development Initiative',
            excerpt: 'Sheikh Saoud announces groundbreaking program to foster economic cooperation between African nations and France, focusing on sustainable development and technology transfer.',
            slug: 'icafe-economic-development-initiative'
        },
        {
            date: '2024-01-10',
            title: 'WAFUNIF Advisory Board Meeting in Geneva',
            excerpt: 'Strategic discussions on global unity frameworks and sustainable development goals for the next decade, with focus on climate action and peace-building initiatives.',
            slug: 'wafunif-advisory-board-geneva'
        },
        {
            date: '2024-01-05',
            title: 'Marvellex Group Expands Investment Portfolio',
            excerpt: 'New strategic investments in emerging technology sectors, including renewable energy and fintech solutions across Middle East and North African markets.',
            slug: 'marvellex-group-expansion'
        },
        {
            date: '2023-12-20',
            title: 'Best Home Real Estate Unveils Luxury Development',
            excerpt: 'Premium residential project in Dubai featuring sustainable architecture and smart home technologies, setting new standards for luxury living in the region.',
            slug: 'best-home-luxury-development'
        },
        {
            date: '2023-12-15',
            title: 'UN Peace Messenger Initiative Update',
            excerpt: 'Progress report on global peace-building efforts and humanitarian projects across conflict-affected regions, with focus on education and economic empowerment.',
            slug: 'un-peace-messenger-update'
        },
        {
            date: '2023-12-10',
            title: 'Royal Business Club Annual Summit',
            excerpt: 'Exclusive networking event brings together regional business leaders to discuss investment opportunities and strategic partnerships for economic growth.',
            slug: 'royal-business-club-summit'
        }
    ];
    
    newsGrid.innerHTML = newsData.map(article => `
        <article class="news-card">
            <div class="news-content">
                <time class="news-date" datetime="${article.date}">
                    ${new Date(article.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </time>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-excerpt">${article.excerpt}</p>
                <a href="#" class="read-more" data-slug="${article.slug}">Read More →</a>
            </div>
        </article>
    `).join('');
    
    // Add event listeners to read-more links
    const readMoreLinks = newsGrid.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const slug = this.getAttribute('data-slug');
            openNewsArticle(slug);
        });
    });
}

// Open news article (placeholder function)
function openNewsArticle(slug) {
    // In a real implementation, this would navigate to a detailed article page
    showNotification('Full article coming soon!', 'info');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('.notification-styles')) {
        const style = document.createElement('style');
        style.className = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--background-dark);
                border: 2px solid;
                padding: 15px 20px;
                border-radius: 10px;
                color: white;
                z-index: 10000;
                max-width: 400px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success { border-color: var(--success-color); }
            .notification-error { border-color: var(--error-color); }
            .notification-info { border-color: var(--accent-color); }
            
            .notification button {
                background: none;
                border: none;
                color: inherit;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Scroll to top functionality
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(45deg, var(--accent-color), var(--holographic-primary));
            border: none;
            border-radius: 50%;
            color: var(--background-dark);
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-to-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    updateCarouselPosition();
}, 250));

// Performance monitoring
if ('performance' in window && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
        });
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
}

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Note: Service Worker would be implemented for production caching
        console.log('Service Worker support detected');
    });
}

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // In production, this would send errors to a logging service
});

// Export functions for global access
window.moveCarousel = moveCarousel;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.changeLightboxImage = changeLightboxImage;
window.submitContactForm = submitContactForm;
window.subscribeNewsletter = subscribeNewsletter;
window.openNewsArticle = openNewsArticle;