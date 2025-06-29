// NextBloom Chatbot Configuration
// Add your API keys here to enable AI responses

const CHATBOT_CONFIG = {
  // OpenAI Configuration
  openai: {
    apiKey: '', // Add your OpenAI API key here (e.g., 'sk-...')
    model: 'gpt-3.5-turbo',
    maxTokens: 300,
    temperature: 0.7
  },
  
  // Hugging Face Configuration
  huggingface: {
    apiKey: '', // Add your Hugging Face API key here
    model: 'microsoft/DialoGPT-medium',
    maxLength: 200,
    temperature: 0.7
  },
  
  // Local Backend Configuration
  backend: {
    url: 'http://localhost:5000/api/ai',
    enabled: true
  },
  
  // Chatbot Behavior Settings
  behavior: {
    enableVoice: true,
    enableTypingIndicator: true,
    responseDelay: 1000, // Delay in milliseconds before showing response
    fallbackToLocal: true // Always fallback to local responses if APIs fail
  },
  
  // Custom System Prompt for AI APIs
  systemPrompt: `You are a helpful assistant for NextBloom, a platform helping dropouts get back into learning and find careers. 

Your role is to:
- Provide encouraging and practical career guidance
- Offer emotional support and motivation
- Suggest learning resources and study plans
- Help users build confidence and overcome challenges
- Be empathetic to the struggles of people who have dropped out

Keep responses:
- Concise but helpful (under 300 words)
- Encouraging and positive
- Practical with actionable advice
- Supportive and non-judgmental

Focus on helping users find their path back to education and meaningful careers.`
};

// Instructions for adding API keys:
/*
To enable AI responses:

1. OpenAI API:
   - Go to https://platform.openai.com/api-keys
   - Create an account and get your API key
   - Add it to CHATBOT_CONFIG.openai.apiKey above
   - Note: This requires payment/credits

2. Hugging Face API:
   - Go to https://huggingface.co/settings/tokens
   - Create a free account and generate a token
   - Add it to CHATBOT_CONFIG.huggingface.apiKey above
   - Note: Free tier available

3. Local Backend:
   - Make sure your Flask backend is running
   - The chatbot will automatically try this if APIs fail

If no API keys are provided, the chatbot will use pre-programmed responses
which still provide helpful career guidance and emotional support.
*/