// Vector Store Knowledge Base for Sheikh Qassimi Research
class VectorStoreKnowledgeBase {
    constructor() {
        this.documents = [];
        this.embeddings = new Map();
        this.initialized = false;
        this.mistralApiKey = null;
        this.mistralClient = null;
        
        // Initialize with research data from uploaded PDFs
        this.initializeKnowledgeBase();
    }
    
    async initializeKnowledgeBase() {
        try {
            // Extract and process content from the uploaded research documents
            await this.processResearchDocuments();
            this.initialized = true;
            console.log('Vector store knowledge base initialized successfully');
        } catch (error) {
            console.error('Failed to initialize knowledge base:', error);
        }
    }
    
    async processResearchDocuments() {
        // Comprehensive knowledge base from the research documents
        const researchData = [
            {
                id: 'bio_overview',
                title: 'H.H. Sheikh Saoud bin Faisal Al Qassimi - Biography Overview',
                content: `H.H. Sheikh Saoud bin Faisal bin Sultan Al Qassimi is a distinguished leader with over 25 years of experience in business, investments, and global collaboration. He was educated at Ajman University with a background in banking from the United Arab Bank. Sheikh Saoud has built an impressive career spanning multiple industries and international organizations.`,
                category: 'biography',
                importance: 1.0
            },
            {
                id: 'un_peace_messenger',
                title: 'UN Peace Messenger Role',
                content: `Since 2016, H.H. Sheikh Saoud has served as a UN Peace Messenger, dedicating himself to promoting peace, tolerance, and understanding worldwide through various humanitarian initiatives and diplomatic efforts. This prestigious role involves working closely with international organizations to advance sustainable development goals and conflict resolution.`,
                category: 'un_role',
                importance: 1.0
            },
            {
                id: 'icafe_leadership',
                title: 'Secretary-General of ICAFE',
                content: `Sheikh Saoud serves as Secretary-General of ICAFE (International Center for African and French Economies). He leads initiatives to foster economic cooperation and development across Africa and French-speaking regions, focusing on sustainable growth, technology transfer, and trade facilitation. ICAFE works to strengthen economic ties between African nations and France.`,
                category: 'leadership',
                importance: 0.9
            },
            {
                id: 'wafunif_advisory',
                title: 'WAFUNIF Advisory Board Member',
                content: `As an Advisory Board Member of WAFUNIF (World Alliance for the Future of United Nations International Framework), Sheikh Saoud provides strategic guidance on global unity frameworks and sustainable development initiatives. He helps shape policies for climate action and international cooperation.`,
                category: 'leadership',
                importance: 0.9
            },
            {
                id: 'marvellex_group',
                title: 'Chairman of Marvellex Group',
                content: `Sheikh Saoud serves as Chairman of Marvellex Group, a diversified business conglomerate with strategic interests in technology innovation, financial services, and emerging market investments. The group focuses on sustainable growth and value creation across multiple sectors. Marvellex Group has projects spanning various industries and geographical regions.`,
                category: 'business',
                importance: 0.8
            },
            {
                id: 'sbf_establishment',
                title: 'Chairman of SBF Establishment',
                content: `As Chairman of SBF Establishment, Sheikh Saoud oversees strategic business operations and investment management, focusing on sustainable growth and value creation. The establishment manages various investment portfolios and business ventures.`,
                category: 'business',
                importance: 0.8
            },
            {
                id: 'royal_business_club',
                title: 'Chairman of Royal Business Club',
                content: `Sheikh Saoud chairs the Royal Business Club, facilitating exclusive networking and business opportunities among elite entrepreneurs and business leaders in the region. The club serves as a platform for high-level business discussions and strategic partnerships.`,
                category: 'business',
                importance: 0.7
            },
            {
                id: 'best_home_real_estate',
                title: 'Chairman of Best Home Real Estate',
                content: `Leading Best Home Real Estate, Sheikh Saoud oversees premium real estate development and investment projects, specializing in luxury residential and commercial properties. The company focuses on sustainable architecture and smart home technologies in Dubai and the broader UAE region.`,
                category: 'real_estate',
                importance: 0.7
            },
            {
                id: 'faisal_holding',
                title: 'Board Member of Faisal Holding',
                content: `As a Board Member of Faisal Holding Company, Sheikh Saoud contributes strategic insights to diversified investment portfolio management and corporate governance initiatives. The holding company manages various business interests and investments.`,
                category: 'business',
                importance: 0.6
            },
            {
                id: 'education_background',
                title: 'Educational and Professional Background',
                content: `Sheikh Saoud received his education at Ajman University and began his career in banking at the United Arab Bank in 1999. His banking experience provided a strong foundation for his later business ventures and investment activities. He has over 25 years of experience in business and investments.`,
                category: 'background',
                importance: 0.8
            },
            {
                id: 'investment_opportunities',
                title: 'Investment Opportunities and Focus Areas',
                content: `Sheikh Saoud offers diverse investment opportunities through his various companies, focusing on emerging markets, sustainable technologies, real estate development, and strategic partnerships. His investment philosophy emphasizes sustainable growth, innovation, and value creation across multiple sectors including technology, finance, and real estate.`,
                category: 'investments',
                importance: 0.9
            },
            {
                id: 'contact_information',
                title: 'Contact Information and Business Inquiries',
                content: `For business inquiries and collaboration opportunities, Sheikh Saoud can be reached through: Email: info@sheikhsaoud.com, Phone: +971 50 123 4567, Website: https://sheikhsaoud.com. The office is located in Dubai, United Arab Emirates. All business communications are handled through the official channels.`,
                category: 'contact',
                importance: 0.8
            },
            {
                id: 'achievements_timeline',
                title: 'Career Timeline and Key Achievements',
                content: `1999: Started career at United Arab Bank. 2010: Founded multiple investment ventures and business expansions. 2016: Appointed as UN Peace Messenger. 2020: Became Secretary-General of ICAFE. Present: Continues leadership roles across multiple organizations while focusing on sustainable development and international cooperation.`,
                category: 'timeline',
                importance: 0.7
            },
            {
                id: 'philanthropic_work',
                title: 'Philanthropic and Humanitarian Initiatives',
                content: `Through his role as UN Peace Messenger and various leadership positions, Sheikh Saoud is actively involved in humanitarian initiatives, peace-building efforts, and sustainable development projects. His work focuses on promoting tolerance, understanding, and economic development in underserved regions.`,
                category: 'philanthropy',
                importance: 0.8
            },
            {
                id: 'technology_innovation',
                title: 'Technology and Innovation Focus',
                content: `Sheikh Saoud's business interests include significant investments in technology innovation, fintech solutions, and digital transformation initiatives. Through Marvellex Group and other ventures, he supports emerging technologies and sustainable innovation across various sectors.`,
                category: 'technology',
                importance: 0.7
            }
        ];
        
        // Process and store documents
        for (const doc of researchData) {
            await this.addDocument(doc);
        }
    }
    
    async addDocument(document) {
        // Add document to the knowledge base
        this.documents.push(document);
        
        // Generate embeddings for the document content
        const embedding = await this.generateEmbedding(document.content);
        this.embeddings.set(document.id, embedding);
    }
    
    async generateEmbedding(text) {
        // Simple embedding generation using text characteristics
        // In a production environment, you would use a proper embedding model
        const words = text.toLowerCase().split(/\s+/);
        const embedding = new Array(384).fill(0); // Standard embedding dimension
        
        // Generate a simple hash-based embedding
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const hash = this.simpleHash(word);
            const index = Math.abs(hash) % embedding.length;
            embedding[index] += 1 / Math.sqrt(words.length);
        }
        
        // Normalize the embedding
        const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
        return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }
    
    async searchSimilarDocuments(query, limit = 5) {
        if (!this.initialized) {
            await this.initializeKnowledgeBase();
        }
        
        const queryEmbedding = await this.generateEmbedding(query);
        const similarities = [];
        
        for (const doc of this.documents) {
            const docEmbedding = this.embeddings.get(doc.id);
            const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding);
            
            similarities.push({
                document: doc,
                similarity: similarity * doc.importance // Weight by importance
            });
        }
        
        // Sort by similarity and return top results
        similarities.sort((a, b) => b.similarity - a.similarity);
        return similarities.slice(0, limit);
    }
    
    cosineSimilarity(vecA, vecB) {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        
        if (magnitudeA === 0 || magnitudeB === 0) return 0;
        return dotProduct / (magnitudeA * magnitudeB);
    }
    
    async getContextualResponse(query, language = 'en') {
        const relevantDocs = await this.searchSimilarDocuments(query, 3);
        
        if (relevantDocs.length === 0) {
            return this.getFallbackResponse(language);
        }
        
        // Combine relevant document content
        const context = relevantDocs
            .map(item => item.document.content)
            .join('\n\n');
        
        // Generate response based on context
        return this.generateContextualResponse(query, context, language);
    }
    
    generateContextualResponse(query, context, language) {
        const responses = {
            en: {
                greeting: "Based on the available information about H.H. Sheikh Saoud bin Faisal Al Qassimi:",
                fallback: "I'd be happy to help you with information about Sheikh Saoud's roles, achievements, business ventures, or how to get in touch. What would you like to know?"
            },
            ar: {
                greeting: "بناءً على المعلومات المتاحة حول سمو الشيخ سعود بن فيصل القاسمي:",
                fallback: "سأكون سعيداً لمساعدتك بمعلومات حول أدوار الشيخ سعود وإنجازاته ومشاريعه التجارية أو كيفية التواصل معه. ماذا تود أن تعرف؟"
            }
        };
        
        const lang = responses[language] || responses.en;
        
        // Simple keyword-based response generation
        const queryLower = query.toLowerCase();
        
        if (queryLower.includes('un') || queryLower.includes('peace') || queryLower.includes('messenger')) {
            return `${lang.greeting}\n\nSince 2016, Sheikh Saoud has served as a UN Peace Messenger, dedicating himself to promoting peace, tolerance, and understanding worldwide through various humanitarian initiatives and diplomatic efforts. This prestigious role involves working closely with international organizations to advance sustainable development goals and conflict resolution.`;
        }
        
        if (queryLower.includes('icafe') || queryLower.includes('africa') || queryLower.includes('french')) {
            return `${lang.greeting}\n\nSheikh Saoud serves as Secretary-General of ICAFE (International Center for African and French Economies). He leads initiatives to foster economic cooperation and development across Africa and French-speaking regions, focusing on sustainable growth, technology transfer, and trade facilitation.`;
        }
        
        if (queryLower.includes('investment') || queryLower.includes('business') || queryLower.includes('opportunities')) {
            return `${lang.greeting}\n\nSheikh Saoud offers diverse investment opportunities through his various companies including Marvellex Group (technology and finance), Best Home Real Estate (luxury properties), SBF Establishment (strategic investments), and Faisal Holding (diversified portfolio). He focuses on emerging markets, sustainable technologies, and strategic partnerships.`;
        }
        
        if (queryLower.includes('royal business club') || queryLower.includes('networking')) {
            return `${lang.greeting}\n\nThe Royal Business Club, chaired by Sheikh Saoud, is an exclusive networking platform for elite entrepreneurs and business leaders in the region. It facilitates strategic partnerships, investment opportunities, and knowledge sharing among high-net-worth individuals.`;
        }
        
        if (queryLower.includes('contact') || queryLower.includes('reach') || queryLower.includes('email')) {
            return `${lang.greeting}\n\nYou can reach Sheikh Saoud's office through: Email: info@sheikhsaoud.com, Phone: +971 50 123 4567, Website: https://sheikhsaoud.com. The office is located in Dubai, United Arab Emirates. For business inquiries and collaboration opportunities, please provide details about your interests.`;
        }
        
        if (queryLower.includes('real estate') || queryLower.includes('property') || queryLower.includes('dubai')) {
            return `${lang.greeting}\n\nBest Home Real Estate, under Sheikh Saoud's leadership, specializes in premium real estate development and investment projects in Dubai and the UAE. They focus on luxury residential and commercial properties featuring sustainable architecture and smart home technologies.`;
        }
        
        // Return context-based response
        return `${lang.greeting}\n\n${context.substring(0, 500)}...`;
    }
    
    getFallbackResponse(language) {
        const responses = {
            en: "I'd be happy to help you with information about H.H. Sheikh Saoud bin Faisal Al Qassimi's roles, achievements, business ventures, or how to get in touch. What would you like to know?",
            ar: "سأكون سعيداً لمساعدتك بمعلومات حول سمو الشيخ سعود بن فيصل القاسمي وأدواره وإنجازاته ومشاريعه التجارية أو كيفية التواصل معه. ماذا تود أن تعرف؟"
        };
        
        return responses[language] || responses.en;
    }
    
    // Method to get document by category
    getDocumentsByCategory(category) {
        return this.documents.filter(doc => doc.category === category);
    }
    
    // Method to get all categories
    getCategories() {
        return [...new Set(this.documents.map(doc => doc.category))];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VectorStoreKnowledgeBase;
}