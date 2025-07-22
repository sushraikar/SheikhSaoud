// Language switching functionality
class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.langData = {
            en: {
                dir: 'ltr',
                font: 'Inter, sans-serif'
            },
            ar: {
                dir: 'rtl',
                font: 'Amiri, serif'
            }
        };
        
        this.init();
    }
    
    init() {
        this.detectBrowserLanguage();
        this.bindEvents();
        this.updatePlaceholders();
    }
    
    detectBrowserLanguage() {
        const browserLang = navigator.language.slice(0, 2);
        const supportedLangs = Object.keys(this.langData);
        
        if (supportedLangs.includes(browserLang)) {
            this.currentLang = browserLang;
        }
        
        // Check for saved preference
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && supportedLangs.includes(savedLang)) {
            this.currentLang = savedLang;
        }
        
        this.applyLanguage(this.currentLang);
    }
    
    bindEvents() {
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
        
        // Keyboard shortcut for language toggle (Alt + L)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'l') {
                e.preventDefault();
                this.toggleLanguage();
            }
        });
    }
    
    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
        this.applyLanguage(this.currentLang);
        this.savePreference();
    }
    
    applyLanguage(lang) {
        const langConfig = this.langData[lang];
        
        // Update HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = langConfig.dir;
        
        // Update body class for CSS targeting
        document.body.classList.remove('lang-en', 'lang-ar');
        document.body.classList.add(`lang-${lang}`);
        
        // Update text content
        this.updateTextContent(lang);
        
        // Update placeholders
        this.updatePlaceholders(lang);
        
        // Update page title
        this.updatePageTitle(lang);
        
        // Trigger custom event
        this.dispatchLanguageChange(lang);
        
        // Update chatbot language
        if (window.chatbot) {
            window.chatbot.setLanguage(lang);
        }
        
        // Smooth transition effect
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0.95';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        }, 150);
    }
    
    updateTextContent(lang) {
        const elements = document.querySelectorAll('[data-en], [data-ar]');
        
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.textContent = text;
            }
        });
    }
    
    updatePlaceholders(lang = this.currentLang) {
        const elements = document.querySelectorAll(`[data-placeholder-${lang}]`);
        
        elements.forEach(element => {
            const placeholder = element.getAttribute(`data-placeholder-${lang}`);
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });
    }
    
    updatePageTitle(lang) {
        const titles = {
            en: 'H.H. Sheikh Saoud bin Faisal Al Qassimi - Pioneering Excellence',
            ar: 'سمو الشيخ سعود بن فيصل القاسمي - رائد التميز'
        };
        
        document.title = titles[lang] || titles.en;
    }
    
    dispatchLanguageChange(lang) {
        const event = new CustomEvent('languageChanged', {
            detail: { language: lang, direction: this.langData[lang].dir }
        });
        document.dispatchEvent(event);
    }
    
    savePreference() {
        localStorage.setItem('preferred-language', this.currentLang);
    }
    
    getCurrentLanguage() {
        return this.currentLang;
    }
    
    getCurrentDirection() {
        return this.langData[this.currentLang].dir;
    }
    
    isRTL() {
        return this.getCurrentDirection() === 'rtl';
    }
    
    // Get translated text for JavaScript usage
    getText(key, lang = this.currentLang) {
        const translations = {
            en: {
                'loading': 'Loading...',
                'error': 'An error occurred',
                'success': 'Success!',
                'send_message': 'Send Message',
                'sending': 'Sending...',
                'subscribe': 'Subscribe',
                'subscribing': 'Subscribing...',
                'message_sent': 'Message sent successfully!',
                'subscription_success': 'Successfully subscribed to newsletter!',
                'error_general': 'Something went wrong. Please try again.',
                'email_required': 'Please enter a valid email address',
                'name_required': 'Please enter your name',
                'message_required': 'Please enter a message',
                'try_again': 'Try Again',
                'close': 'Close',
                'next': 'Next',
                'previous': 'Previous',
                'read_more': 'Read More',
                'view_gallery': 'View Gallery',
                'contact_us': 'Contact Us',
                'learn_more': 'Learn More'
            },
            ar: {
                'loading': 'جاري التحميل...',
                'error': 'حدث خطأ',
                'success': 'نجح!',
                'send_message': 'إرسال الرسالة',
                'sending': 'جاري الإرسال...',
                'subscribe': 'اشترك',
                'subscribing': 'جاري الاشتراك...',
                'message_sent': 'تم إرسال الرسالة بنجاح!',
                'subscription_success': 'تم الاشتراك في النشرة الإخبارية بنجاح!',
                'error_general': 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
                'email_required': 'يرجى إدخال عنوان بريد إلكتروني صالح',
                'name_required': 'يرجى إدخال اسمك',
                'message_required': 'يرجى إدخال رسالة',
                'try_again': 'حاول مرة أخرى',
                'close': 'إغلاق',
                'next': 'التالي',
                'previous': 'السابق',
                'read_more': 'اقرأ المزيد',
                'view_gallery': 'عرض المعرض',
                'contact_us': 'اتصل بنا',
                'learn_more': 'اعرف المزيد'
            }
        };
        
        return translations[lang]?.[key] || translations.en[key] || key;
    }
    
    // Format numbers according to language
    formatNumber(number, lang = this.currentLang) {
        const formatters = {
            en: new Intl.NumberFormat('en-US'),
            ar: new Intl.NumberFormat('ar-AE')
        };
        
        return formatters[lang]?.format(number) || formatters.en.format(number);
    }
    
    // Format dates according to language
    formatDate(date, lang = this.currentLang) {
        const formatters = {
            en: new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            ar: new Intl.DateTimeFormat('ar-AE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        
        return formatters[lang]?.format(date) || formatters.en.format(date);
    }
    
    // Update form validation messages
    updateFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                // Update validation messages
                input.addEventListener('invalid', (e) => {
                    e.preventDefault();
                    
                    let message = '';
                    
                    if (input.type === 'email' && input.validity.typeMismatch) {
                        message = this.getText('email_required');
                    } else if (input.hasAttribute('required') && input.validity.valueMissing) {
                        if (input.name === 'name') {
                            message = this.getText('name_required');
                        } else if (input.name === 'message') {
                            message = this.getText('message_required');
                        } else {
                            message = this.getText('error_general');
                        }
                    }
                    
                    input.setCustomValidity(message);
                    
                    // Create or update error display
                    this.showFieldError(input, message);
                });
                
                // Clear custom validity on input
                input.addEventListener('input', () => {
                    input.setCustomValidity('');
                    this.hideFieldError(input);
                });
            });
        });
    }
    
    showFieldError(input, message) {
        // Remove existing error
        this.hideFieldError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--error-color)';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = 'var(--error-color)';
    }
    
    hideFieldError(input) {
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    }
}

// RTL/LTR specific animations and adjustments
class DirectionManager {
    constructor(languageManager) {
        this.langManager = languageManager;
        this.init();
    }
    
    init() {
        document.addEventListener('languageChanged', (e) => {
            this.handleDirectionChange(e.detail.direction);
        });
    }
    
    handleDirectionChange(direction) {
        // Update carousel direction
        this.updateCarouselDirection(direction);
        
        // Update timeline direction
        this.updateTimelineDirection(direction);
        
        // Update navigation animations
        this.updateNavigationDirection(direction);
        
        // Update scroll behaviors
        this.updateScrollBehaviors(direction);
    }
    
    updateCarouselDirection(direction) {
        const carouselTrack = document.getElementById('carousel-track');
        if (carouselTrack) {
            // Reset transform and update for RTL
            if (direction === 'rtl') {
                carouselTrack.style.transform = `translateX(${window.currentSlide * (400 + 24)}px)`;
            } else {
                carouselTrack.style.transform = `translateX(-${window.currentSlide * (400 + 24)}px)`;
            }
        }
    }
    
    updateTimelineDirection(direction) {
        const timeline = document.querySelector('.timeline');
        if (timeline) {
            timeline.classList.toggle('timeline-rtl', direction === 'rtl');
        }
    }
    
    updateNavigationDirection(direction) {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.classList.toggle('nav-rtl', direction === 'rtl');
        }
    }
    
    updateScrollBehaviors(direction) {
        // Update any scroll-based animations that need direction awareness
        const scrollElements = document.querySelectorAll('[data-scroll-animation]');
        
        scrollElements.forEach(element => {
            element.classList.toggle('scroll-rtl', direction === 'rtl');
        });
    }
}

// Font loading optimization
class FontManager {
    constructor(languageManager) {
        this.langManager = languageManager;
        this.fontStatus = {
            inter: false,
            playfair: false,
            amiri: false
        };
        
        this.init();
    }
    
    async init() {
        if ('fonts' in document) {
            await this.loadFonts();
            this.optimizeFontSwitching();
        }
    }
    
    async loadFonts() {
        const fonts = [
            new FontFace('Inter', 'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2)'),
            new FontFace('Playfair Display', 'url(https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDTbtXK-F2qC0s.woff2)'),
            new FontFace('Amiri', 'url(https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.woff2)')
        ];
        
        try {
            const loadedFonts = await Promise.allSettled(
                fonts.map(font => font.load())
            );
            
            loadedFonts.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    document.fonts.add(result.value);
                    const fontNames = ['inter', 'playfair', 'amiri'];
                    this.fontStatus[fontNames[index]] = true;
                }
            });
            
        } catch (error) {
            console.warn('Font loading failed:', error);
        }
    }
    
    optimizeFontSwitching() {
        document.addEventListener('languageChanged', (e) => {
            const lang = e.detail.language;
            
            if (lang === 'ar' && !this.fontStatus.amiri) {
                // Fallback to system Arabic fonts
                document.body.style.setProperty('--font-arabic', 'Arial, sans-serif');
            }
            
            // Preload fonts for the other language
            const preloadLang = lang === 'en' ? 'ar' : 'en';
            this.preloadLanguageFonts(preloadLang);
        });
    }
    
    preloadLanguageFonts(lang) {
        if (lang === 'ar' && !this.fontStatus.amiri) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            link.href = 'https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.woff2';
            document.head.appendChild(link);
        }
    }
}

// Initialize language management
document.addEventListener('DOMContentLoaded', function() {
    const languageManager = new LanguageManager();
    const directionManager = new DirectionManager(languageManager);
    const fontManager = new FontManager(languageManager);
    
    // Make language manager globally available
    window.languageManager = languageManager;
    
    // Update form validation when language changes
    languageManager.updateFormValidation();
    
    document.addEventListener('languageChanged', () => {
        languageManager.updateFormValidation();
    });
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LanguageManager, DirectionManager, FontManager };
}