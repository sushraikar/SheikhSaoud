// Advanced animations and effects
class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        this.createIntersectionObservers();
        this.initializeScrollEffects();
        this.bindEvents();
        this.startAnimationLoop();
    }
    
    createIntersectionObservers() {
        // Observer for fade-in animations
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target, 'fadeIn');
                }
            });
        }, { 
            threshold: 0.1, 
            rootMargin: '0px 0px -50px 0px' 
        });
        
        // Observer for slide animations
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const direction = entry.target.dataset.slideDirection || 'up';
                    this.animateElement(entry.target, 'slideIn', { direction });
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '0px 0px -30px 0px'
        });
        
        // Observer for stagger animations
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStaggeredChildren(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        this.observers.set('fade', fadeObserver);
        this.observers.set('slide', slideObserver);
        this.observers.set('stagger', staggerObserver);
        
        this.observeElements();
    }
    
    observeElements() {
        // Observe elements for different animation types
        document.querySelectorAll('[data-animate="fade"]').forEach(el => {
            this.observers.get('fade').observe(el);
        });
        
        document.querySelectorAll('[data-animate="slide"]').forEach(el => {
            this.observers.get('slide').observe(el);
        });
        
        document.querySelectorAll('[data-animate="stagger"]').forEach(el => {
            this.observers.get('stagger').observe(el);
        });
        
        // Auto-detect elements that should be animated
        this.autoDetectAnimatableElements();
    }
    
    autoDetectAnimatableElements() {
        const selectors = [
            '.role-card',
            '.news-card',
            '.timeline-item',
            '.stat-card',
            '.contact-item',
            '.gallery-item'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.hasAttribute('data-animate')) {
                    el.setAttribute('data-animate', 'slide');
                    el.setAttribute('data-slide-direction', 'up');
                    this.observers.get('slide').observe(el);
                }
            });
        });
        
        // Stagger animations for grid containers
        document.querySelectorAll('.roles-grid, .news-grid, .stats-grid').forEach(el => {
            if (!el.hasAttribute('data-animate')) {
                el.setAttribute('data-animate', 'stagger');
                this.observers.get('stagger').observe(el);
            }
        });
    }
    
    animateElement(element, type, options = {}) {
        if (this.isReducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }
        
        element.classList.add('animating');
        
        switch (type) {
            case 'fadeIn':
                this.fadeInAnimation(element, options);
                break;
            case 'slideIn':
                this.slideInAnimation(element, options);
                break;
            case 'scaleIn':
                this.scaleInAnimation(element, options);
                break;
            case 'rotateIn':
                this.rotateInAnimation(element, options);
                break;
        }
    }
    
    fadeInAnimation(element, options = {}) {
        const duration = options.duration || 800;
        const delay = options.delay || 0;
        
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, delay);
        
        setTimeout(() => {
            element.classList.remove('animating');
            element.style.transition = '';
        }, delay + duration);
    }
    
    slideInAnimation(element, options = {}) {
        const { direction = 'up', distance = 50, duration = 600, delay = 0 } = options;
        
        let initialTransform = '';
        switch (direction) {
            case 'up':
                initialTransform = `translateY(${distance}px)`;
                break;
            case 'down':
                initialTransform = `translateY(-${distance}px)`;
                break;
            case 'left':
                initialTransform = `translateX(${distance}px)`;
                break;
            case 'right':
                initialTransform = `translateX(-${distance}px)`;
                break;
        }
        
        element.style.opacity = '0';
        element.style.transform = initialTransform;
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';
        }, delay);
        
        setTimeout(() => {
            element.classList.remove('animating');
            element.style.transition = '';
        }, delay + duration);
    }
    
    scaleInAnimation(element, options = {}) {
        const { scale = 0.8, duration = 500, delay = 0 } = options;
        
        element.style.opacity = '0';
        element.style.transform = `scale(${scale})`;
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, delay);
        
        setTimeout(() => {
            element.classList.remove('animating');
            element.style.transition = '';
        }, delay + duration);
    }
    
    rotateInAnimation(element, options = {}) {
        const { rotation = -10, duration = 600, delay = 0 } = options;
        
        element.style.opacity = '0';
        element.style.transform = `rotate(${rotation}deg) scale(0.8)`;
        element.style.transition = `all ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
        }, delay);
        
        setTimeout(() => {
            element.classList.remove('animating');
            element.style.transition = '';
        }, delay + duration);
    }
    
    animateStaggeredChildren(container) {
        const children = Array.from(container.children);
        const staggerDelay = 100;
        
        children.forEach((child, index) => {
            const delay = index * staggerDelay;
            this.animateElement(child, 'slideIn', { 
                delay,
                direction: 'up',
                duration: 600
            });
        });
    }
    
    // Advanced scroll effects
    initializeScrollEffects() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        this.morphElements = document.querySelectorAll('[data-morph]');
        
        if (this.parallaxElements.length > 0 || this.morphElements.length > 0) {
            this.bindScrollEvents();
        }
    }
    
    bindScrollEvents() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    this.updateMorphEffects();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', updateScrollEffects, { passive: true });
    }
    
    updateParallax() {
        if (this.isReducedMotion) return;
        
        const scrollY = window.pageYOffset;
        
        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    updateMorphEffects() {
        if (this.isReducedMotion) return;
        
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.morphElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const elementHeight = rect.height;
            
            // Calculate visibility percentage
            const visibleStart = elementTop - windowHeight;
            const visibleEnd = elementTop + elementHeight;
            const visibleRange = visibleEnd - visibleStart;
            const visiblePercent = Math.max(0, Math.min(1, (scrollY - visibleStart) / visibleRange));
            
            // Apply morph transformations
            const morphType = element.dataset.morph;
            switch (morphType) {
                case 'rotate':
                    element.style.transform = `rotate(${visiblePercent * 360}deg)`;
                    break;
                case 'scale':
                    const scale = 0.8 + (visiblePercent * 0.4);
                    element.style.transform = `scale(${scale})`;
                    break;
                case 'skew':
                    const skew = (visiblePercent - 0.5) * 20;
                    element.style.transform = `skewY(${skew}deg)`;
                    break;
            }
        });
    }
    
    // Hover effects
    initializeHoverEffects() {
        const hoverElements = document.querySelectorAll('[data-hover-effect]');
        
        hoverElements.forEach(element => {
            const effect = element.dataset.hoverEffect;
            
            element.addEventListener('mouseenter', () => {
                this.applyHoverEffect(element, effect, true);
            });
            
            element.addEventListener('mouseleave', () => {
                this.applyHoverEffect(element, effect, false);
            });
        });
    }
    
    applyHoverEffect(element, effect, isHover) {
        if (this.isReducedMotion) return;
        
        switch (effect) {
            case 'lift':
                element.style.transform = isHover ? 'translateY(-10px)' : '';
                element.style.boxShadow = isHover ? '0 20px 40px rgba(0, 0, 0, 0.2)' : '';
                break;
            case 'glow':
                element.style.boxShadow = isHover ? '0 0 30px rgba(212, 175, 55, 0.5)' : '';
                break;
            case 'scale':
                element.style.transform = isHover ? 'scale(1.05)' : '';
                break;
            case 'tilt':
                element.style.transform = isHover ? 'perspective(1000px) rotateX(5deg) rotateY(5deg)' : '';
                break;
        }
    }
    
    // Loading animations
    createLoadingAnimation(element, type = 'spinner') {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-animation';
        
        switch (type) {
            case 'spinner':
                loadingElement.innerHTML = '<div class="spinner"></div>';
                break;
            case 'dots':
                loadingElement.innerHTML = '<div class="dots"><span></span><span></span><span></span></div>';
                break;
            case 'pulse':
                loadingElement.innerHTML = '<div class="pulse"></div>';
                break;
        }
        
        // Add CSS if not already present
        if (!document.querySelector('.loading-animation-styles')) {
            this.addLoadingStyles();
        }
        
        element.appendChild(loadingElement);
        return loadingElement;
    }
    
    addLoadingStyles() {
        const style = document.createElement('style');
        style.className = 'loading-animation-styles';
        style.textContent = `
            .loading-animation {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(212, 175, 55, 0.3);
                border-top: 4px solid var(--accent-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .dots {
                display: flex;
                gap: 5px;
            }
            
            .dots span {
                width: 10px;
                height: 10px;
                background: var(--accent-color);
                border-radius: 50%;
                animation: bounce 1.4s ease-in-out infinite both;
            }
            
            .dots span:nth-child(1) { animation-delay: -0.32s; }
            .dots span:nth-child(2) { animation-delay: -0.16s; }
            
            .pulse {
                width: 40px;
                height: 40px;
                background: var(--accent-color);
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes bounce {
                0%, 80%, 100% {
                    transform: scale(0);
                } 40% {
                    transform: scale(1);
                }
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    removeLoadingAnimation(element) {
        const loadingElement = element.querySelector('.loading-animation');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    // Text animations
    animateText(element, text, options = {}) {
        const { 
            speed = 50, 
            deleteSpeed = 30, 
            pauseDuration = 1000,
            loop = false 
        } = options;
        
        let index = 0;
        let isDeleting = false;
        
        const typeWriter = () => {
            const currentText = isDeleting 
                ? text.substring(0, index - 1)
                : text.substring(0, index + 1);
            
            element.textContent = currentText;
            
            if (!isDeleting && index === text.length) {
                isDeleting = true;
                setTimeout(typeWriter, pauseDuration);
                return;
            }
            
            if (isDeleting && index === 0) {
                isDeleting = false;
                if (loop) {
                    setTimeout(typeWriter, speed);
                }
                return;
            }
            
            index = isDeleting ? index - 1 : index + 1;
            setTimeout(typeWriter, isDeleting ? deleteSpeed : speed);
        };
        
        typeWriter();
    }
    
    // Number counting animation
    animateCounter(element, endValue, options = {}) {
        const { 
            duration = 2000, 
            startValue = 0, 
            suffix = '',
            prefix = '',
            decimalPlaces = 0 
        } = options;
        
        const startTime = performance.now();
        const range = endValue - startValue;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = startValue + (range * easeProgress);
            const displayValue = currentValue.toFixed(decimalPlaces);
            
            element.textContent = prefix + displayValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    // Animation loop for continuous effects
    startAnimationLoop() {
        let lastTime = 0;
        
        const animate = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            // Process animation queue
            this.processAnimationQueue(deltaTime);
            
            // Continue loop
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
    
    processAnimationQueue(deltaTime) {
        this.animationQueue = this.animationQueue.filter(animation => {
            animation.elapsed += deltaTime;
            
            const progress = Math.min(animation.elapsed / animation.duration, 1);
            
            if (animation.update) {
                animation.update(progress);
            }
            
            if (progress >= 1 && animation.complete) {
                animation.complete();
                return false; // Remove from queue
            }
            
            return progress < 1; // Keep in queue
        });
    }
    
    // Add animation to queue
    queueAnimation(animation) {
        animation.elapsed = 0;
        this.animationQueue.push(animation);
    }
    
    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animationQueue = [];
    }
    
    bindEvents() {
        // Re-observe elements when new content is added
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.observeNewElement(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Handle reduced motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
        });
    }
    
    observeNewElement(element) {
        // Check if element should be animated
        if (element.hasAttribute('data-animate')) {
            const animationType = element.getAttribute('data-animate');
            const observer = this.observers.get(animationType);
            if (observer) {
                observer.observe(element);
            }
        }
        
        // Check children as well
        element.querySelectorAll('[data-animate]').forEach(child => {
            const animationType = child.getAttribute('data-animate');
            const observer = this.observers.get(animationType);
            if (observer) {
                observer.observe(child);
            }
        });
    }
}

// Initialize animation manager
document.addEventListener('DOMContentLoaded', function() {
    const animationManager = new AnimationManager();
    
    // Make globally available
    window.animationManager = animationManager;
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        animationManager.destroy();
    });
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationManager };
}