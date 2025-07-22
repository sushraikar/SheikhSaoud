// Enhanced AI-Powered Chatbot with Vector Store and Mistral AI
class EnhancedSheikhSaoudChatbot {
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
        this.leadCaptured = false;
        
        // Initialize vector store and Mistral AI
        this.vectorStore = new VectorStoreKnowledgeBase();
        this.mistralAI = new MistralAIIntegration(this.vectorStore);
        
        // Set the provided Mistral AI API key
        this.mistralAI.setApiKey('yhuX6iZWSRohzR8c8INd7M0dNSGXcbFW');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeSpeechRecognition();
        this.setupApiKeyInput();
    }
    
    setupApiKeyInput() {
        // Add API key input to chatbot header
        const header = this.container.querySelector('.chatbot-header');
        if (header && !header.querySelector('.api-key-input')) {
            const apiKeyContainer = document.createElement('div');
            apiKeyContainer.className = 'api-key-container';
            apiKeyContainer.style.cssText = `
                margin-top: 10px;
                padding: 10px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                display: none;
            `;
            
            apiKeyContainer.innerHTML = `
                <label style="color: white; font-size: 12px; display: block; margin-bottom: 5px;">
                    Mistral AI API Key (Optional - for enhanced responses):
                </label>
                <div style="display: flex; gap: 5px;">
                    <input type="password" class="api-key-input" placeholder="Enter Mistral API key..." 
                           style="flex: 1; padding: 5px; border: none; border-radius: 3px; font-size: 12px;">
                    <button class="api-key-save" style="padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 3px; font-size: 12px;">
                        Save
                    </button>
                </div>
                <div style="font-size: 10px; color: #ccc; margin-top: 5px;">
                    Without API key, the chatbot will use the built-in knowledge base.
                </div>
            `;
            
            header.appendChild(apiKeyContainer);
            
            // Add settings button to toggle API key input
            const settingsBtn = document.createElement('button');
            settingsBtn.innerHTML = '⚙️';
            settingsBtn.className = 'settings-btn';
            settingsBtn.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                margin-left: 10px;
            `;
            
            const titleElement = header.querySelector('h3');
            titleElement.appendChild(settingsBtn);
            
            // Event listeners
            settingsBtn.addEventListener('click', () => {
                const isVisible = apiKeyContainer.style.display !== 'none';
                apiKeyContainer.style.display = isVisible ? 'none' : 'block';
            });
            
            const saveBtn = apiKeyContainer.querySelector('.api-key-save');
            const apiKeyInput = apiKeyContainer.querySelector('.api-key-input');
            
            saveBtn.onclick = () => {
                const apiKey = apiKeyInput.value.trim();
                if (apiKey) {
                    this.mistralAI.setApiKey(apiKey);
                    localStorage.setItem('mistral_api_key', apiKey);
                    this.addBotMessage('✅ Mistral AI API key saved successfully! Enhanced responses are now enabled.');
                } else {
                    this.mistralAI.setApiKey(null);
                    localStorage.removeItem('mistral_api_key');
                    this.addBotMessage('ℹ️ API key removed. Using built-in knowledge base.');
                }
                apiKeyContainer.style.display = 'none';
            };
            
            // Load saved API key
            const savedApiKey = localStorage.getItem('mistral_api_key');
            // Set the provided API key and save it
            localStorage.setItem('mistral_api_key', 'yhuX6iZWSRohzR8c8INd7M0dNSGXcbFW');
            apiKeyInput.value = 'yhuX6iZWSRohzR8c8INd7M0dNSGXcbFW';
            this.addBotMessage('✅ Mistral AI is ready! Enhanced responses are now enabled.');
        }
    }
    
    setupEventListeners() {
        // Update language when page language changes
        document.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail.language;
            this.updateChatbotLanguage();
            this.loadConversationHistory();
        });
        
        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const suggestion = btn.textContent.trim();
                this.sendMessage(suggestion);
            });
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
                this.loadConversationHistory();
                const greeting = this.conversationHistory.length === 0 && this.currentLanguage === 'ar' 
                    ? "مرحباً! أنا المساعد الذكي المطور لسمو الشيخ سعود بن فيصل القاسمي. يمكنني مساعدتك بمعلومات مفصلة حول أدواره القيادية وإنجازاته والفرص الاستثمارية. كيف يمكنني مساعدتك اليوم؟"
                    : "Hello! I'm the enhanced AI assistant for H.H. Sheikh Saoud bin Faisal Al Qassimi. I can provide detailed information about his leadership roles, achievements, and investment opportunities. How can I assist you today?";
                if (this.conversationHistory.length === 0) {
                this.addBotMessage(greeting);
                }
            }, 500);
        }
    }
    
    close() {
        this.container.classList.remove('active');
        this.isOpen = false;
        this.stopVoiceInput();
    }
    
    async sendMessage(message = null) {
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
        
        try {
            // Generate response using enhanced AI
            const response = await this.mistralAI.generateResponse(text, this.currentLanguage);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addBotMessage(response);
            
            // Check for lead capture after meaningful interaction
            this.checkForLeadCapture();
            
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();
            
            // Fallback to vector store
            const fallbackResponse = await this.vectorStore.getContextualResponse(text, this.currentLanguage);
            this.addBotMessage(fallbackResponse);
        }
    }
    
    addUserMessage(text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `<span>${this.escapeHtml(text)}</span>`;
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add to conversation history
        this.conversationHistory.push({
            type: 'user',
            message: text,
            timestamp: new Date()
        });
    }
    
    addBotMessage(text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        const span = document.createElement('span');
        span.textContent = text;
        messageDiv.appendChild(span);
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add to conversation history
        this.conversationHistory.push({
            type: 'bot',
            message: text,
            timestamp: new Date()
        });
        
        // Save conversation
        this.saveConversationHistory();
        
        // Add particle effect
        this.addMessageParticles(messageDiv);
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        
        this.typingIndicator = document.createElement('div');
        this.typingIndicator.className = 'message bot-message typing-indicator';
        this.typingIndicator.innerHTML = `
            button.onclick = () => {
                this.sendMessage(suggestion);
                suggestionsDiv.remove();
            };
            </div>
        `;
        
        messagesContainer.appendChild(this.typingIndicator);
        this.scrollToBottom();
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
        const particleCount = 3;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'message-particle';
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: var(--accent-color);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                animation: particleFloat 1.5s ease-out forwards;
                animation-delay: ${i * 0.1}s;
            `;
            
            messageElement.appendChild(particle);
            particles.push(particle);
            
            // Random position around message
            const x = Math.random() * 15 - 7.5;
            const y = Math.random() * 15 - 7.5;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
        }
        
        // Clean up particles after animation
        setTimeout(() => {
            particles.forEach(particle => {
                if (particle.parentNode) {
                    particle.remove();
                }
            });
        }, 2000);
    }
    
    checkForLeadCapture() {
        // Capture lead after meaningful interaction (3+ exchanges)
        const userMessages = this.conversationHistory.filter(msg => msg.type === 'user');
        
        if (userMessages.length >= 3 && !this.leadCaptured && !localStorage.getItem('leadCaptured')) {
            setTimeout(() => {
                this.promptLeadCapture();
            }, 2000);
        }
    }
    
    promptLeadCapture() {
        const leadPrompt = this.currentLanguage === 'ar' 
            ? "لتقديم مساعدة أفضل وإبقائك على اطلاع بآخر الأخبار والفرص، هل يمكنك مشاركة اسمك وبريدك الإلكتروني؟"
            : "To provide you with better assistance and keep you updated with the latest news and opportunities, could you please share your name and email address?";
            
        this.addBotMessage(leadPrompt);
        
        // Create lead capture form
        const messagesContainer = document.getElementById('chatbot-messages');
        const formDiv = document.createElement('div');
        formDiv.className = 'lead-capture-form';
        formDiv.innerHTML = `
            <div class="form-group">
                <input type="text" id="lead-name" placeholder="${this.currentLanguage === 'ar' ? 'الاسم الكامل' : 'Full Name'}" required>
            </div>
            <div class="form-group">
                <input type="email" id="lead-email" placeholder="${this.currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}" required>
            </div>
            <div class="form-actions">
                <button class="submit-lead-btn">
                    ${this.currentLanguage === 'ar' ? 'إرسال' : 'Submit'}
                </button>
                <button class="skip-lead-btn">
                    ${this.currentLanguage === 'ar' ? 'تخطي' : 'Skip'}
                </button>
            </div>
        `;
        
        messagesContainer.appendChild(formDiv);
        this.scrollToBottom();
        
        // Event listeners
        const submitBtn = formDiv.querySelector('.submit-lead-btn');
        const skipBtn = formDiv.querySelector('.skip-lead-btn');
        
        submitBtn.addEventListener('click', () => this.submitLeadCapture(formDiv));
        skipBtn.addEventListener('click', () => this.skipLeadCapture(formDiv));
    }
    
    async submitLeadCapture(formDiv) {
        const nameInput = formDiv.querySelector('#lead-name');
        const emailInput = formDiv.querySelector('#lead-email');
        
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
            source: 'enhanced_chatbot',
            timestamp: new Date().toISOString(),
            conversationHistory: this.conversationHistory.slice(-5),
            language: this.currentLanguage
        };
        
        try {
            // Send to CRM (replace with actual endpoint)
            const response = await fetch('/api/crm-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData)
            });
            
            if (response.ok) {
                localStorage.setItem('leadCaptured', 'true');
                this.leadCaptured = true;
                const successMsg = this.currentLanguage === 'ar'
                    ? "شكراً لك! تم حفظ معلوماتك بنجاح. سيتواصل معك فريقنا قريباً بمعلومات حصرية وفرص استثمارية."
                    : "Thank you! Your information has been saved successfully. Our team will contact you soon with exclusive information and investment opportunities.";
                this.addBotMessage(successMsg);
            } else {
                throw new Error('Failed to submit lead');
            }
        } catch (error) {
            console.error('Lead capture error:', error);
            const errorMsg = this.currentLanguage === 'ar'
                ? "حدث خطأ في حفظ المعلومات. يمكنك التواصل معنا مباشرة عبر: info@sheikhsaoud.com"
                : "An error occurred saving your information. You can contact us directly at: info@sheikhsaoud.com";
            this.addBotMessage(errorMsg);
        }
        
        // Remove form
        formDiv.remove();
    }
    
    skipLeadCapture(formDiv) {
        const skipMsg = this.currentLanguage === 'ar'
            ? "لا بأس! يمكنك التواصل معنا في أي وقت عبر: info@sheikhsaoud.com"
            : "No problem! Feel free to reach out anytime at: info@sheikhsaoud.com";
        this.addBotMessage(skipMsg);
        
        // Remove form
        formDiv.remove();
        
        // Mark as skipped to avoid showing again
        localStorage.setItem('leadCaptureSkipped', 'true');
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
        
        // Update speech recognition language
        if (this.recognition) {
            this.recognition.lang = this.currentLanguage === 'ar' ? 'ar-AE' : 'en-US';
        }
    }
    
    loadConversationHistory() {
        const history = localStorage.getItem('enhancedChatbotHistory');
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
        localStorage.setItem('enhancedChatbotHistory', JSON.stringify(recentHistory));
    }
    
    clearConversation() {
        this.conversationHistory = [];
        this.mistralAI.clearHistory();
        localStorage.removeItem('enhancedChatbotHistory');
        
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = `
            <div class="message bot-message">
                <span>${this.currentLanguage === 'ar' 
                    ? 'مرحباً! أنا المساعد الذكي المطور لسمو الشيخ سعود. كيف يمكنني مساعدتك؟'
                    : 'Hello! I\'m the enhanced AI assistant for H.H. Sheikh Saoud. How can I assist you?'}</span>
            </div>
        `;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        this.updateChatbotLanguage();
    }
}

// Global enhanced chatbot functions
function openEnhancedChatbot() {
    if (!window.enhancedChatbot) {
        window.enhancedChatbot = new EnhancedSheikhSaoudChatbot('chatbot-container');
    }
    window.enhancedChatbot.open();
}

function closeEnhancedChatbot() {
    if (window.enhancedChatbot) {
        window.enhancedChatbot.close();
    }
}

function sendEnhancedMessage() {
    if (window.enhancedChatbot) {
        window.enhancedChatbot.sendMessage();
    }
}

function toggleEnhancedVoiceInput() {
    if (window.enhancedChatbot) {
        window.enhancedChatbot.toggleVoiceInput();
    }
}

// Make functions globally available
window.openEnhancedChatbot = openEnhancedChatbot;
window.closeEnhancedChatbot = closeEnhancedChatbot;
window.sendEnhancedMessage = sendEnhancedMessage;
window.toggleEnhancedVoiceInput = toggleEnhancedVoiceInput;

// Initialize enhanced chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create enhanced chatbot instance
    window.enhancedChatbot = new EnhancedSheikhSaoudChatbot('chatbot-container');
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedSheikhSaoudChatbot;
}