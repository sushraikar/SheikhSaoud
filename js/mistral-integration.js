// Mistral AI Integration for Enhanced Chatbot
class MistralAIIntegration {
    constructor(vectorStore) {
        this.vectorStore = vectorStore;
        this.apiEndpoint = 'https://api.mistral.ai/v1/chat/completions';
        this.model = 'mistral-medium'; // Good balance of performance and cost
        this.apiKey = null; // Will be set when user provides it
        this.conversationHistory = [];
        this.maxHistoryLength = 10;
    }
    
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }
    
    async generateResponse(userMessage, language = 'en', useVectorStore = true) {
        try {
            let context = '';
            
            // Get relevant context from vector store
            if (useVectorStore && this.vectorStore) {
                const relevantDocs = await this.vectorStore.searchSimilarDocuments(userMessage, 3);
                if (relevantDocs.length > 0) {
                    context = relevantDocs
                        .map(item => `${item.document.title}: ${item.document.content}`)
                        .join('\n\n');
                }
            }
            
            // Prepare system prompt
            const systemPrompt = this.getSystemPrompt(language, context);
            
            // Prepare conversation history
            const messages = [
                { role: 'system', content: systemPrompt },
                ...this.conversationHistory.slice(-this.maxHistoryLength),
                { role: 'user', content: userMessage }
            ];
            
            // If no API key is provided, use vector store only
            if (!this.apiKey) {
                return await this.vectorStore.getContextualResponse(userMessage, language);
            }
            
            // Call Mistral AI API
            const response = await this.callMistralAPI(messages);
            
            // Update conversation history
            this.conversationHistory.push(
                { role: 'user', content: userMessage },
                { role: 'assistant', content: response }
            );
            
            return response;
            
        } catch (error) {
            console.error('Error generating Mistral response:', error);
            // Fallback to vector store
            return await this.vectorStore.getContextualResponse(userMessage, language);
        }
    }
    
    async callMistralAPI(messages) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
                top_p: 0.9
            })
        });
        
        if (!response.ok) {
            throw new Error(`Mistral API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    getSystemPrompt(language, context) {
        const prompts = {
            en: `You are an AI assistant representing H.H. Sheikh Saoud bin Faisal Al Qassimi. You should provide accurate, professional, and helpful information about Sheikh Saoud's roles, achievements, business ventures, and activities.

Key Information:
${context}

Guidelines:
- Be professional and respectful
- Provide accurate information based on the context provided
- If asked about topics not covered in the context, politely redirect to available information
- For business inquiries, direct users to the official contact information
- Maintain a tone appropriate for representing a distinguished leader
- Keep responses concise but informative`,

            ar: `أنت مساعد ذكي يمثل سمو الشيخ سعود بن فيصل القاسمي. يجب أن تقدم معلومات دقيقة ومهنية ومفيدة حول أدوار الشيخ سعود وإنجازاته ومشاريعه التجارية وأنشطته.

المعلومات الأساسية:
${context}

الإرشادات:
- كن مهنياً ومحترماً
- قدم معلومات دقيقة بناءً على السياق المقدم
- إذا سُئلت عن مواضيع غير مغطاة في السياق، وجه بأدب إلى المعلومات المتاحة
- للاستفسارات التجارية، وجه المستخدمين إلى معلومات الاتصال الرسمية
- حافظ على نبرة مناسبة لتمثيل قائد متميز
- اجعل الردود موجزة ولكن مفيدة`
        };
        
        return prompts[language] || prompts.en;
    }
    
    clearHistory() {
        this.conversationHistory = [];
    }
    
    getConversationHistory() {
        return this.conversationHistory;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MistralAIIntegration;
}