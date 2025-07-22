# Sheikh Saoud Al Qassimi Website - Enhanced AI Assistant

## Overview
This website features an advanced AI-powered chatbot with vector store knowledge base and Mistral AI integration for H.H. Sheikh Saoud bin Faisal Al Qassimi.

## Key Features

### 🤖 Enhanced AI Assistant
- **Vector Store Knowledge Base**: Comprehensive database of Sheikh Saoud's information extracted from research documents
- **Mistral AI Integration**: Advanced language model for natural, contextual responses
- **Bilingual Support**: Full English and Arabic language support with automatic language detection
- **Voice Input**: Speech recognition for hands-free interaction
- **Smart Lead Capture**: Intelligent lead qualification and CRM integration

### 📊 Vector Store Capabilities
- **Document Processing**: Automatically processes research documents about Sheikh Saoud
- **Semantic Search**: Finds relevant information based on user queries
- **Context-Aware Responses**: Provides accurate, contextual answers
- **Category-Based Organization**: Information organized by topics (biography, business, UN role, etc.)

### 🔗 CRM Integration
- **Automatic Lead Capture**: Captures user information after meaningful interactions
- **Lead Scoring**: Intelligent scoring based on conversation content and engagement
- **Multi-Channel Submission**: Sends leads to CRM, webhooks, and email notifications
- **Analytics Dashboard**: Track lead generation and conversation metrics

## Setup Instructions

### 1. Mistral AI Configuration (Optional)
To enable enhanced AI responses:

1. Get a Mistral AI API key from [https://console.mistral.ai/](https://console.mistral.ai/)
2. Click the settings (⚙️) button in the chatbot header
3. Enter your API key and save
4. The chatbot will now use Mistral AI for more sophisticated responses

**Note**: Without an API key, the chatbot will use the built-in vector store knowledge base.

### 2. CRM Integration Setup
Update the following in `js/crm-integration.js`:

```javascript
// Replace with your actual endpoints
this.apiEndpoint = 'YOUR_CRM_API_ENDPOINT';
this.webhookUrl = 'YOUR_WEBHOOK_URL';
```

### 3. Email Notifications
Configure email notifications in `js/crm-integration.js`:

```javascript
// Update email settings
const emailData = {
    to: 'your-email@domain.com', // Replace with actual email
    // ... other settings
};
```

## Knowledge Base Content

The vector store includes comprehensive information about:

- **Biography**: Educational background, career timeline, achievements
- **UN Role**: Peace Messenger responsibilities and initiatives
- **Leadership Positions**: ICAFE, WAFUNIF, and other organizational roles
- **Business Ventures**: Marvellex Group, SBF Establishment, Royal Business Club
- **Real Estate**: Best Home Real Estate projects and developments
- **Investment Opportunities**: Available investment sectors and partnerships
- **Contact Information**: Official contact details and business inquiry process

## Technical Architecture

### Vector Store (`js/vector-store.js`)
- Document storage and retrieval system
- Embedding generation for semantic search
- Similarity matching algorithms
- Category-based organization

### Mistral AI Integration (`js/mistral-integration.js`)
- API communication with Mistral AI
- Conversation history management
- Context-aware prompt engineering
- Fallback to vector store when needed

### Enhanced Chatbot (`js/enhanced-chatbot.js`)
- Main chatbot interface and logic
- User interaction handling
- Language switching capabilities
- Lead capture workflows

### CRM Integration (`js/crm-integration.js`)
- Lead data processing and scoring
- Multi-channel submission system
- Email notification templates
- Analytics and reporting

## Usage Examples

### Basic Queries
- "Tell me about Sheikh Saoud's UN role"
- "What investment opportunities are available?"
- "How can I contact the Royal Business Club?"

### Advanced Interactions
- "I'm interested in real estate investments in Dubai"
- "Can you explain Sheikh Saoud's role in African economic development?"
- "What are the requirements for joining the Royal Business Club?"

## Customization

### Adding New Knowledge
To add new information to the knowledge base, update the `researchData` array in `js/vector-store.js`:

```javascript
{
    id: 'new_topic',
    title: 'New Topic Title',
    content: 'Detailed content about the new topic...',
    category: 'category_name',
    importance: 0.8 // 0.0 to 1.0
}
```

### Modifying Responses
Update response templates in `js/mistral-integration.js` and `js/vector-store.js` for different languages and contexts.

### Styling
The chatbot inherits the website's design system. Modify CSS variables in `styles.css` to customize appearance.

## Browser Compatibility
- Modern browsers with ES6+ support
- Speech recognition (Chrome, Edge, Safari)
- Local storage for conversation history
- Responsive design for all devices

## Security Considerations
- API keys stored securely in localStorage
- Input sanitization for XSS prevention
- Rate limiting for API calls
- Secure CRM data transmission

## Performance
- Lazy loading of AI components
- Efficient vector search algorithms
- Conversation history optimization
- Minimal impact on page load speed

## Support
For technical support or customization requests, contact the development team or refer to the documentation in each JavaScript module.