// AI-Powered Chatbot with Knowledge Base
class SheikhSaoudChatbot {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.messagesContainer = null;
        this.inputField = null;
        this.isOpen = false;
        this.currentLanguage = 'en';
        this.isListening = false;
        this.recognition = null;
        this.conversationHistory = [];
        this.typingIndicator = null;
        
        this.knowledgeBase = {
            en: {
                greeting: "Hello! I'm Sheikh Saoud's AI assistant. I can help you learn about His Highness's roles, achievements, investment opportunities, and more. How can I assist you today?",
                fallback: "I'd be happy to help you with that. You can ask me about Sheikh Saoud's UN role, business ventures, investment opportunities, or how to get in touch. What would you like to know?",
                entities: {
                    "un role": {
                        response: "H.H. Sheikh Saoud bin Faisal Al Qassimi has been serving as a UN Peace Messenger since 2016. In this capacity, he promotes peace, tolerance, and understanding worldwide through various humanitarian initiatives and diplomatic efforts. He works closely with international organizations to advance sustainable development goals and conflict resolution.",
                        followUp: "Would you like to know more about his specific peace initiatives or other leadership roles?"
                    },
                    "icafe": {
                        response: "Sheikh Saoud serves as Secretary-General of ICAFE (International Center for African and French Economies). He leads initiatives to foster economic cooperation and development across Africa and French-speaking regions, focusing on sustainable growth, technology transfer, and trade facilitation.",
                        followUp: "Are you interested in learning about investment opportunities in African markets?"
                    },
                    "wafunif": {
                        response: "As an Advisory Board Member of WAFUNIF (World Alliance for the Future of United Nations International Framework), Sheikh Saoud provides strategic guidance on global unity frameworks and sustainable development initiatives. He helps shape policies for climate action and international cooperation.",
                        followUp: "Would you like to know about his other international roles?"
                    },
                    "investment": {
                        response: "Sheikh Saoud offers diverse investment opportunities through his various companies: Marvellex Group (technology and finance), Best Home Real Estate (luxury properties in Dubai), SBF Establishment (strategic investments), and Faisal Holding (diversified portfolio). He focuses on emerging markets, sustainable technologies, and strategic partnerships.",
                        followUp: "Which investment sector interests you most - real estate, technology, or emerging markets?"
                    },
                    "royal business club": {
                        response: "The Royal Business Club, chaired by Sheikh Saoud, is an exclusive networking platform for elite entrepreneurs and business leaders in the region. It facilitates strategic partnerships, investment opportunities, and knowledge sharing among high-net-worth individuals and successful business owners.",
                        followUp: "Would you like information on how to connect with the Royal Business Club?"
                    },
                    "marvellex group": {
                        response: "Marvellex Group is a diversified business conglomerate led by Sheikh Saoud, with strategic interests in technology innovation, financial services, and emerging market investments. The group focuses on sustainable growth and value creation across multiple sectors.",
                        followUp: "Are you interested in partnership opportunities with Marvellex Group?"
                    },
                    "real estate": {
                        response: "Best Home Real Estate, under Sheikh Saoud's leadership, specializes in premium real estate development and investment projects in Dubai and the broader UAE region. They focus on luxury residential and commercial properties featuring sustainable architecture and smart home technologies.",
                        followUp: "Would you like to explore current real estate investment opportunities?"
                    },
                    "contact": {
                        response: "You can reach Sheikh Saoud's office through several channels: Email: info@sheikhsaoud.com, Phone: +971 50 123 4567, or through the contact form on this website. For business inquiries and collaboration opportunities, please provide details about your interests and background.",
                        followUp: "Would you like me to help you prepare a message for Sheikh Saoud's team?"
                    }
                }
            },
            ar: {
                greeting: "مرحباً! أنا المساعد الذكي لسمو الشيخ سعود. يمكنني مساعدتك في التعرف على أدوار سموه وإنجازاته والفرص الاستثمارية والمزيد. كيف يمكنني مساعدتك اليوم؟",
                fallback: "سأكون سعيداً لمساعدتك في ذلك. يمكنك سؤالي عن دور الشيخ سعود في الأمم المتحدة أو مشاريعه التجارية أو الفرص الاستثمارية أو كيفية التواصل معه. ماذا تود أن تعرف؟",
                entities: {
                    "دور الأمم المتحدة": {
                        response: "سمو الشيخ سعود بن فيصل القاسمي يشغل منصب رسول سلام الأمم المتحدة منذ عام 2016. في هذه الصفة، يعمل على تعزيز السلام والتسامح والتفاهم في جميع أنحاء العالم من خلال مبادرات إنسانية وجهود دبلوماسية متنوعة.",
                        followUp: "هل تود معرفة المزيد عن مبادراته للسلام أم أدواره القيادية الأخرى؟"
                    },
                    "استثمار": {
                        response: "يقدم الشيخ سعود فرص استثمارية متنوعة من خلال شركاته المختلفة: مجموعة مارفيليكس (التكنولوجيا والمالية)، بست هوم العقارية (العقارات الفاخرة في دبي)، مؤسسة SBF (الاستثمارات الاستراتيجية)، وفيصل القابضة (محفظة متنوعة).",
                        followUp: "أي قطاع استثماري يثير اهتمامك أكثر - العقارات أم التكنولوجيا أم الأسواق الناشئة؟"
                    },
                    "التواصل": {
                        response: "يمكنك التواصل مع مكتب الشيخ سعود من خلال عدة قنوات: البريد الإلكتروني: info@sheikhsaoud.com، الهاتف: +971 50 123 4567، أو من خلال نموذج الاتصال في هذا الموقع.",
                        followUp: "هل تود مني مساعدتك في إعداد رسالة لفريق الشيخ سعود؟"
                    }
                }
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeSpeechRecognition();
        this.loadConversationHistory();
    }
    
    setupEventListeners() {
        // Chat input handling
        const input = document.getElementById('chatbot-input');
        if (input) {
            this.inputField = input;
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // Update language when page language changes
        document.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail.language;
            this.updateChatbotLanguage();
        });
    }
    
    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.currentLanguage === 'ar' ? 'ar-AE' : 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.inputField.value = transcript;
                this.sendMessage();
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopVoiceInput();
            };
            
            this.recognition.onend = () => {
                this.stopVoiceInput();
            };
        }
    }
    
    open() {
        this.container.classList.add('active');
        this.isOpen = true;
        
        // Focus input field
        setTimeout(() => {
            if (this.inputField) {
                this.inputField.focus();
            }
        }, 300);
        
        // Send greeting if no previous conversation
        if (this.conversationHistory.length === 0) {
            setTimeout(() => {
                this.addBotMessage(this.knowledgeBase[this.currentLanguage].greeting);
            }, 500);
        }
    }
    
    close() {
        this.container.classList.remove('active');
        this.isOpen = false;
        this.stopVoiceInput();
    }
    
    sendMessage(message = null) {
        const text = message || this.inputField.value.trim();
        if (!text) return;
        
        // Clear input
        if (!message) {
            this.inputField.value = '';
        }
        
        // Add user message
        this.addUserMessage(text);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message and respond
        setTimeout(() => {
            const response = this.processMessage(text);
            this.hideTypingIndicator();
            this.addBotMessage(response.text);
            
            // Add follow-up suggestions if available
            if (response.followUp) {
                setTimeout(() => {
                    this.addFollowUpSuggestions(response.followUp);
                }, 1000);
            }
        }, 1500 + Math.random() * 1000); // Variable delay for realism
    }
    
    sendSuggestion(suggestion) {
        this.sendMessage(suggestion);
        
        // Hide suggestion buttons
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');
        suggestionBtns.forEach(btn => btn.style.display = 'none');
    }
    
    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        const kb = this.knowledgeBase[this.currentLanguage];
        
        // Add to conversation history
        this.conversationHistory.push({
            type: 'user',
            message: message,
            timestamp: new Date()
        });
        
        // Intent detection and entity extraction
        let bestMatch = null;
        let bestScore = 0;
        
        Object.keys(kb.entities).forEach(entity => {
            const score = this.calculateSimilarity(lowerMessage, entity);
            if (score > bestScore && score > 0.3) {
                bestScore = score;
                bestMatch = entity;
            }
        });
        
        let response = {
            text: kb.fallback,
            followUp: null
        };
        
        if (bestMatch) {
            response.text = kb.entities[bestMatch].response;
            response.followUp = kb.entities[bestMatch].followUp;
        }
        
        // Add to conversation history
        this.conversationHistory.push({
            type: 'bot',
            message: response.text,
            timestamp: new Date()
        });
        
        // Save conversation
        this.saveConversationHistory();
        
        // Capture lead information after meaningful interaction
        this.checkForLeadCapture();
        
        return response;
    }
    
    calculateSimilarity(text, entity) {
        const words = text.split(' ');
        const entityWords = entity.toLowerCase().split(' ');
        let matches = 0;
        
        entityWords.forEach(entityWord => {
            words.forEach(word => {
                if (word.includes(entityWord) || entityWord.includes(word)) {
                    matches++;
                }
            });
        });
        
        return matches / Math.max(words.length, entityWords.length);
    }
    
    addUserMessage(text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `<span>${this.escapeHtml(text)}</span>`;
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addBotMessage(text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        // Add data attributes for language switching
        const span = document.createElement('span');
        span.textContent = text;
        messageDiv.appendChild(span);
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add particle effect
        this.addMessageParticles(messageDiv);
    }
    
    addFollowUpSuggestions(suggestions) {
        if (typeof suggestions === 'string') {
            suggestions = [suggestions];
        }
        
        const messagesContainer = document.getElementById('chatbot-messages');
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'message-suggestions';
        
        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'follow-up-btn';
            button.textContent = suggestion;
            button.addEventListener('click', () => {
                this.sendSuggestion(suggestion);
                suggestionsDiv.remove();
            });
            suggestionsDiv.appendChild(button);
        });
        
        messagesContainer.appendChild(suggestionsDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        
        this.typingIndicator = document.createElement('div');
        this.typingIndicator.className = 'message bot-message typing-indicator';
        this.typingIndicator.innerHTML = `
            <div class="typing-animation">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        messagesContainer.appendChild(this.typingIndicator);
        this.scrollToBottom();
        
        // Add typing indicator styles if not already present
        if (!document.querySelector('.typing-indicator-styles')) {
            const style = document.createElement('style');
            style.className = 'typing-indicator-styles';
            style.textContent = `
                .typing-indicator {
                    opacity: 0.7;
                }
                
                .typing-animation {
                    display: flex;
                    gap: 4px;
                    padding: 10px;
                }
                
                .typing-animation span {
                    width: 8px;
                    height: 8px;
                    background: var(--accent-color);
                    border-radius: 50%;
                    animation: typing 1.4s infinite ease-in-out;
                }
                
                .typing-animation span:nth-child(1) { animation-delay: -0.32s; }
                .typing-animation span:nth-child(2) { animation-delay: -0.16s; }
                
                @keyframes typing {
                    0%, 80%, 100% {
                        transform: scale(0);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                .message-suggestions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    padding: 10px;
                    margin-top: 10px;
                }
                
                .follow-up-btn {
                    background: rgba(212, 175, 55, 0.2);
                    border: 1px solid rgba(212, 175, 55, 0.4);
                    color: var(--text-primary);
                    padding: 8px 12px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .follow-up-btn:hover {
                    background: rgba(212, 175, 55, 0.4);
                    transform: translateY(-1px);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.remove();
            this.typingIndicator = null;
        }
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    addMessageParticles(messageElement) {
        // Create subtle particle effect for bot messages
        const particles = [];
        const particleCount = 5;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'message-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--accent-color);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                animation: particleFloat 2s ease-out forwards;
                animation-delay: ${i * 0.1}s;
            `;
            
            messageElement.appendChild(particle);
            particles.push(particle);
            
            // Random position around message
            const x = Math.random() * 20 - 10;
            const y = Math.random() * 20 - 10;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
        }
        
        // Add particle animation styles
        if (!document.querySelector('.particle-styles')) {
            const style = document.createElement('style');
            style.className = 'particle-styles';
            style.textContent = `
                @keyframes particleFloat {
                    0% {
                        opacity: 0;
                        transform: translate(0, 0) scale(0);
                    }
                    50% {
                        opacity: 1;
                        transform: translate(10px, -10px) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(20px, -20px) scale(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Clean up particles after animation
        setTimeout(() => {
            particles.forEach(particle => {
                if (particle.parentNode) {
                    particle.remove();
                }
            });
        }, 3000);
    }
    
    toggleVoiceInput() {
        if (!this.recognition) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }
        
        if (this.isListening) {
            this.stopVoiceInput();
        } else {
            this.startVoiceInput();
        }
    }
    
    startVoiceInput() {
        this.isListening = true;
        this.recognition.lang = this.currentLanguage === 'ar' ? 'ar-AE' : 'en-US';
        this.recognition.start();
        
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.classList.add('recording');
        }
    }
    
    stopVoiceInput() {
        if (this.recognition) {
            this.recognition.stop();
        }
        
        this.isListening = false;
        
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.classList.remove('recording');
        }
    }
    
    updateChatbotLanguage() {
        // Update placeholder
        if (this.inputField) {
            const placeholders = {
                en: 'Type your message...',
                ar: 'اكتب رسالتك...'
            };
            this.inputField.placeholder = placeholders[this.currentLanguage];
        }
        
        // Update suggestion buttons
        const suggestionButtons = document.querySelectorAll('.suggestion-btn');
        suggestionButtons.forEach(btn => {
            const enText = btn.getAttribute('data-en');
            const arText = btn.getAttribute('data-ar');
            
            if (this.currentLanguage === 'ar' && arText) {
                btn.textContent = arText;
            } else if (enText) {
                btn.textContent = enText;
            }
        });
    }
    
    checkForLeadCapture() {
        // Capture lead after meaningful interaction (3+ exchanges)
        const userMessages = this.conversationHistory.filter(msg => msg.type === 'user');
        
        if (userMessages.length >= 3 && !localStorage.getItem('leadCaptured')) {
            setTimeout(() => {
                this.promptLeadCapture();
            }, 2000);
        }
    }
    
    promptLeadCapture() {
        const leadPrompt = this.currentLanguage === 'ar' 
            ? "لتقديم مساعدة أفضل، هل يمكنك مشاركة اسمك وبريدك الإلكتروني؟"
            : "To provide you with better assistance, could you please share your name and email address?";
            
        this.addBotMessage(leadPrompt);
        
        // Create lead capture form
        const messagesContainer = document.getElementById('chatbot-messages');
        const formDiv = document.createElement('div');
        formDiv.className = 'lead-capture-form';
        formDiv.innerHTML = `
            <div class="form-group">
                <input type="text" id="lead-name" placeholder="${this.currentLanguage === 'ar' ? 'الاسم' : 'Name'}" required>
            </div>
            <div class="form-group">
                <input type="email" id="lead-email" placeholder="${this.currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email'}" required>
            </div>
            <div class="form-actions">
                <button onclick="window.chatbot.submitLeadCapture()" class="submit-lead-btn">
                    ${this.currentLanguage === 'ar' ? 'إرسال' : 'Submit'}
                </button>
                <button class="skip-lead-btn" data-action="skip">
                    ${this.currentLanguage === 'ar' ? 'تخطي' : 'Skip'}
                </button>
            </div>
        `;
        
        messagesContainer.appendChild(formDiv);
        
        // Add event listeners for the form buttons
        const submitBtn = formDiv.querySelector('.submit-lead-btn');
        const skipBtn = formDiv.querySelector('.skip-lead-btn');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                window.chatbot.submitLeadCapture();
            });
        }
        
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                window.chatbot.skipLeadCapture();
            });
        }
        
        this.scrollToBottom();
        
        // Add form styles
        if (!document.querySelector('.lead-capture-styles')) {
            const style = document.createElement('style');
            style.className = 'lead-capture-styles';
            style.textContent = `
                .lead-capture-form {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 15px;
                    border-radius: 10px;
                    margin: 10px 0;
                    border: 1px solid rgba(212, 175, 55, 0.3);
                }
                
                .lead-capture-form .form-group {
                    margin-bottom: 10px;
                }
                
                .lead-capture-form input {
                    width: 100%;
                    padding: 8px 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    border-radius: 5px;
                    color: var(--text-primary);
                    font-size: 0.9rem;
                }
                
                .form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }
                
                .submit-lead-btn, .skip-lead-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    flex: 1;
                    transition: all 0.3s ease;
                }
                
                .submit-lead-btn {
                    background: linear-gradient(45deg, var(--accent-color), var(--holographic-primary));
                    color: var(--background-dark);
                }
                
                .skip-lead-btn {
                    background: transparent;
                    color: var(--text-secondary);
                    border: 1px solid var(--text-secondary);
                }
                
                .submit-lead-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(212, 175, 55, 0.3);
                }
                
                .skip-lead-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    async submitLeadCapture() {
        const nameInput = document.getElementById('lead-name');
        const emailInput = document.getElementById('lead-email');
        
        if (!nameInput.value.trim() || !emailInput.value.trim()) {
            const errorMsg = this.currentLanguage === 'ar' 
                ? "يرجى ملء جميع الحقول"
                : "Please fill in all fields";
            this.addBotMessage(errorMsg);
            return;
        }
        
        const leadData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            source: 'chatbot',
            timestamp: new Date().toISOString(),
            conversationHistory: this.conversationHistory.slice(-5) // Last 5 messages
        };
        
        try {
            // Send to CRM (replace with actual endpoint)
            const response = await fetch('https://api.example.com/crm-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData)
            });
            
            if (response.ok) {
                localStorage.setItem('leadCaptured', 'true');
                const successMsg = this.currentLanguage === 'ar'
                    ? "شكراً! سيتواصل معك فريقنا قريباً."
                    : "Thank you! Our team will contact you shortly.";
                this.addBotMessage(successMsg);
            } else {
                throw new Error('Failed to submit lead');
            }
        } catch (error) {
            console.error('Lead capture error:', error);
            const errorMsg = this.currentLanguage === 'ar'
                ? "حدث خطأ. يرجى المحاولة لاحقاً."
                : "An error occurred. Please try again later.";
            this.addBotMessage(errorMsg);
        }
        
        // Remove form
        document.querySelector('.lead-capture-form').remove();
    }
    
    skipLeadCapture() {
        const skipMsg = this.currentLanguage === 'ar'
            ? "لا بأس! يمكنك التواصل معنا في أي وقت."
            : "No problem! Feel free to reach out anytime.";
        this.addBotMessage(skipMsg);
        
        // Remove form
        document.querySelector('.lead-capture-form').remove();
        
        // Mark as skipped to avoid showing again
        localStorage.setItem('leadCaptureSkipped', 'true');
    }
    
    loadConversationHistory() {
        const history = localStorage.getItem('chatbotHistory');
        if (history) {
            try {
                this.conversationHistory = JSON.parse(history);
                
                // Restore last few messages
                const recentMessages = this.conversationHistory.slice(-6);
                const messagesContainer = document.getElementById('chatbot-messages');
                
                recentMessages.forEach(msg => {
                    if (msg.type === 'user') {
                        this.addUserMessage(msg.message);
                    } else {
                        this.addBotMessage(msg.message);
                    }
                });
                
            } catch (error) {
                console.error('Error loading conversation history:', error);
            }
        }
    }
    
    saveConversationHistory() {
        // Keep only last 20 messages to avoid localStorage bloat
        const recentHistory = this.conversationHistory.slice(-20);
        localStorage.setItem('chatbotHistory', JSON.stringify(recentHistory));
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        this.updateChatbotLanguage();
        
        if (this.recognition) {
            this.recognition.lang = lang === 'ar' ? 'ar-AE' : 'en-US';
        }
    }
    
    clearConversation() {
        this.conversationHistory = [];
        localStorage.removeItem('chatbotHistory');
        
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = `
            <div class="message bot-message">
                <span>${this.knowledgeBase[this.currentLanguage].greeting}</span>
            </div>
        `;
    }
}

// Global chatbot functions
function openChatbot() {
    if (!window.chatbot) {
        window.chatbot = new SheikhSaoudChatbot('chatbot-container');
    }
    window.chatbot.open();
}

function closeChatbot() {
    if (window.chatbot) {
        window.chatbot.close();
    }
}

function sendMessage() {
    if (window.chatbot) {
        window.chatbot.sendMessage();
    }
}

function sendSuggestion(suggestion) {
    if (window.chatbot) {
        window.chatbot.sendSuggestion(suggestion);
    }
}

function toggleVoiceInput() {
    if (window.chatbot) {
        window.chatbot.toggleVoiceInput();
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create chatbot instance but don't open it
    window.chatbot = new SheikhSaoudChatbot('chatbot-container');
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SheikhSaoudChatbot };
}