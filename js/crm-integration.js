// Enhanced CRM Integration for Lead Management
class CRMIntegration {
    constructor() {
        this.apiEndpoint = '/api/crm-lead'; // Replace with actual CRM endpoint
        this.webhookUrl = 'https://hooks.zapier.com/hooks/catch/your-webhook-id/'; // Replace with actual webhook
        this.leadQueue = [];
        this.isProcessing = false;
    }
    
    async submitLead(leadData) {
        try {
            // Add to queue for processing
            this.leadQueue.push({
                ...leadData,
                id: this.generateLeadId(),
                submittedAt: new Date().toISOString(),
                status: 'pending'
            });
            
            // Process the queue
            await this.processLeadQueue();
            
            return { success: true, message: 'Lead submitted successfully' };
            
        } catch (error) {
            console.error('Error submitting lead:', error);
            return { success: false, message: 'Failed to submit lead' };
        }
    }
    
    async processLeadQueue() {
        if (this.isProcessing || this.leadQueue.length === 0) {
            return;
        }
        
        this.isProcessing = true;
        
        while (this.leadQueue.length > 0) {
            const lead = this.leadQueue.shift();
            
            try {
                // Submit to multiple endpoints for redundancy
                await Promise.allSettled([
                    this.submitToWebhook(lead),
                    this.submitToCRM(lead),
                    this.sendNotificationEmail(lead)
                ]);
                
                // Mark as processed
                lead.status = 'processed';
                this.storeLead(lead);
                
            } catch (error) {
                console.error('Error processing lead:', error);
                // Re-queue for retry
                lead.retryCount = (lead.retryCount || 0) + 1;
                if (lead.retryCount < 3) {
                    this.leadQueue.push(lead);
                }
            }
        }
        
        this.isProcessing = false;
    }
    
    async submitToWebhook(leadData) {
        const response = await fetch(this.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...leadData,
                source: 'Sheikh Saoud Website Chatbot',
                priority: this.calculateLeadPriority(leadData),
                tags: this.generateLeadTags(leadData)
            })
        });
        
        if (!response.ok) {
            throw new Error(`Webhook submission failed: ${response.status}`);
        }
        
        return response.json();
    }
    
    async submitToCRM(leadData) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_CRM_API_KEY' // Replace with actual API key
            },
            body: JSON.stringify({
                contact: {
                    name: leadData.name,
                    email: leadData.email,
                    phone: leadData.phone || '',
                    source: leadData.source,
                    language: leadData.language,
                    tags: this.generateLeadTags(leadData)
                },
                interaction: {
                    type: 'chatbot_conversation',
                    timestamp: leadData.timestamp,
                    conversation_history: leadData.conversationHistory,
                    lead_score: this.calculateLeadScore(leadData)
                },
                custom_fields: {
                    website_session_id: this.getSessionId(),
                    user_agent: navigator.userAgent,
                    referrer: document.referrer,
                    page_url: window.location.href
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`CRM submission failed: ${response.status}`);
        }
        
        return response.json();
    }
    
    async sendNotificationEmail(leadData) {
        // Send notification to Sheikh Saoud's team
        const emailData = {
            to: 'info@sheikhsaoud.com',
            subject: `New Lead from Website Chatbot: ${leadData.name}`,
            html: this.generateEmailTemplate(leadData)
        };
        
        // Use a service like EmailJS or your email API
        return this.sendEmail(emailData);
    }
    
    generateEmailTemplate(leadData) {
        const conversationSummary = leadData.conversationHistory
            .slice(-5)
            .map(msg => `<p><strong>${msg.type === 'user' ? 'User' : 'Assistant'}:</strong> ${msg.message}</p>`)
            .join('');
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #d4af37;">New Lead from Website Chatbot</h2>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Contact Information</h3>
                    <p><strong>Name:</strong> ${leadData.name}</p>
                    <p><strong>Email:</strong> ${leadData.email}</p>
                    <p><strong>Language:</strong> ${leadData.language === 'ar' ? 'Arabic' : 'English'}</p>
                    <p><strong>Source:</strong> ${leadData.source}</p>
                    <p><strong>Timestamp:</strong> ${new Date(leadData.timestamp).toLocaleString()}</p>
                    <p><strong>Lead Score:</strong> ${this.calculateLeadScore(leadData)}/100</p>
                </div>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Recent Conversation</h3>
                    ${conversationSummary}
                </div>
                
                <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h4>Recommended Actions:</h4>
                    <ul>
                        <li>Follow up within 24 hours</li>
                        <li>Provide relevant investment information based on conversation</li>
                        <li>Schedule a consultation if appropriate</li>
                        <li>Add to newsletter for ongoing engagement</li>
                    </ul>
                </div>
                
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    This lead was automatically generated from the Sheikh Saoud website chatbot system.
                </p>
            </div>
        `;
    }
    
    calculateLeadScore(leadData) {
        let score = 50; // Base score
        
        // Conversation length indicates engagement
        const messageCount = leadData.conversationHistory?.length || 0;
        score += Math.min(messageCount * 5, 30);
        
        // Keywords indicating high intent
        const highIntentKeywords = [
            'investment', 'business', 'partnership', 'collaboration',
            'real estate', 'opportunity', 'meeting', 'contact'
        ];
        
        const conversationText = leadData.conversationHistory
            ?.map(msg => msg.message.toLowerCase())
            .join(' ') || '';
        
        highIntentKeywords.forEach(keyword => {
            if (conversationText.includes(keyword)) {
                score += 5;
            }
        });
        
        // Email domain scoring
        if (leadData.email) {
            const domain = leadData.email.split('@')[1];
            const businessDomains = ['company.com', 'corp.com', 'group.com'];
            const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
            
            if (businessDomains.some(d => domain.includes(d))) {
                score += 15;
            } else if (!personalDomains.includes(domain)) {
                score += 10; // Custom domain, likely business
            }
        }
        
        return Math.min(score, 100);
    }
    
    calculateLeadPriority(leadData) {
        const score = this.calculateLeadScore(leadData);
        
        if (score >= 80) return 'high';
        if (score >= 60) return 'medium';
        return 'low';
    }
    
    generateLeadTags(leadData) {
        const tags = ['website-chatbot'];
        
        if (leadData.language === 'ar') {
            tags.push('arabic-speaker');
        }
        
        const conversationText = leadData.conversationHistory
            ?.map(msg => msg.message.toLowerCase())
            .join(' ') || '';
        
        // Add tags based on conversation content
        if (conversationText.includes('investment')) tags.push('investment-interest');
        if (conversationText.includes('real estate')) tags.push('real-estate-interest');
        if (conversationText.includes('business')) tags.push('business-interest');
        if (conversationText.includes('un') || conversationText.includes('peace')) tags.push('un-interest');
        if (conversationText.includes('icafe')) tags.push('icafe-interest');
        
        return tags;
    }
    
    generateLeadId() {
        return 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('website_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('website_session_id', sessionId);
        }
        return sessionId;
    }
    
    storeLead(leadData) {
        // Store lead locally for backup
        const storedLeads = JSON.parse(localStorage.getItem('processed_leads') || '[]');
        storedLeads.push(leadData);
        
        // Keep only last 50 leads
        if (storedLeads.length > 50) {
            storedLeads.splice(0, storedLeads.length - 50);
        }
        
        localStorage.setItem('processed_leads', JSON.stringify(storedLeads));
    }
    
    async sendEmail(emailData) {
        // Implement email sending logic
        // This could use EmailJS, SendGrid, or your email service
        try {
            // Example using EmailJS
            if (window.emailjs) {
                return await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailData);
            }
            
            // Fallback: log to console in development
            console.log('Email notification:', emailData);
            return { success: true };
            
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }
    
    // Method to get lead analytics
    getLeadAnalytics() {
        const storedLeads = JSON.parse(localStorage.getItem('processed_leads') || '[]');
        
        return {
            totalLeads: storedLeads.length,
            averageScore: storedLeads.reduce((sum, lead) => sum + this.calculateLeadScore(lead), 0) / storedLeads.length || 0,
            languageBreakdown: storedLeads.reduce((acc, lead) => {
                acc[lead.language] = (acc[lead.language] || 0) + 1;
                return acc;
            }, {}),
            sourceBreakdown: storedLeads.reduce((acc, lead) => {
                acc[lead.source] = (acc[lead.source] || 0) + 1;
                return acc;
            }, {}),
            recentLeads: storedLeads.slice(-10)
        };
    }
}

// Initialize CRM integration
window.crmIntegration = new CRMIntegration();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CRMIntegration;
}