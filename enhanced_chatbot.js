// Enhanced Multilingual Voice Chatbot for NextBloom
// Features: Voice input/output, multilingual support, career guidance, natural conversation

class EnhancedChatbot {
  constructor() {
    this.isListening = false;
    this.isSpeaking = false;
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.chatHistory = [];
    this.currentLanguage = 'en-US';
    this.voiceMode = false; // Auto voice mode when user speaks
    this.voices = [];
    this.userProfile = {
      interests: [],
      skillLevel: 'beginner',
      careerGoals: [],
      preferredLanguage: 'en-US'
    };
    
    // Initialize the chatbot
    this.initializeLanguageSupport();
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
    this.createEnhancedUI();
    this.bindEvents();
    this.loadUserProfile();
  }

  // Language support configuration
  languages = {
    'en-US': {
      name: 'English',
      voice: 'en-US',
      greetings: [
        "Hello! I'm your AI career guidance assistant. I can help you with career planning, skill development, and provide emotional support. How can I assist you today?",
        "Hi there! I'm here to help you navigate your career journey. Whether you need guidance, motivation, or just someone to talk to, I'm here for you!",
        "Welcome! I'm your personal AI mentor. I can speak with you naturally and help you discover your career path. What would you like to explore?"
      ]
    },
    'es-ES': {
      name: 'Español',
      voice: 'es-ES',
      greetings: [
        "¡Hola! Soy tu asistente de orientación profesional con IA. Puedo ayudarte con planificación de carrera, desarrollo de habilidades y apoyo emocional. ¿Cómo puedo ayudarte hoy?",
        "¡Hola! Estoy aquí para ayudarte a navegar tu camino profesional. Ya sea que necesites orientación, motivación o simplemente alguien con quien hablar, ¡estoy aquí para ti!",
        "¡Bienvenido! Soy tu mentor personal de IA. Puedo hablar contigo de forma natural y ayudarte a descubrir tu camino profesional. ¿Qué te gustaría explorar?"
      ]
    },
    'hi-IN': {
      name: 'हिंदी',
      voice: 'hi-IN',
      greetings: [
        "नमस्ते! मैं आपका AI करियर गाइडेंस असिस्टेंट हूं। मैं करियर प्लानिंग, स्किल डेवलपमेंट और इमोशनल सपोर्ट में आपकी मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
        "नमस्कार! मैं यहां आपकी करियर यात्रा में मदद करने के लिए हूं। चाहे आपको गाइडेंस चाहिए, मोटिवेशन या बस कोई बात करने वाला, मैं आपके लिए हूं!",
        "स्वागत है! मैं आपका पर्सनल AI मेंटर हूं। मैं आपसे प्राकृतिक तरीके से बात कर सकता हूं और आपको अपना करियर पाथ खोजने में मदद कर सकता हूं। आप क्या एक्सप्लोर करना चाहेंगे?"
      ]
    },
    'fr-FR': {
      name: 'Français',
      voice: 'fr-FR',
      greetings: [
        "Bonjour! Je suis votre assistant IA d'orientation professionnelle. Je peux vous aider avec la planification de carrière, le développement des compétences et le soutien émotionnel. Comment puis-je vous aider aujourd'hui?",
        "Salut! Je suis là pour vous aider à naviguer votre parcours professionnel. Que vous ayez besoin de conseils, de motivation ou simplement de quelqu'un à qui parler, je suis là pour vous!",
        "Bienvenue! Je suis votre mentor personnel IA. Je peux parler avec vous naturellement et vous aider à découvrir votre chemin professionnel. Qu'aimeriez-vous explorer?"
      ]
    },
    'de-DE': {
      name: 'Deutsch',
      voice: 'de-DE',
      greetings: [
        "Hallo! Ich bin Ihr KI-Karriereberatungsassistent. Ich kann Ihnen bei der Karriereplanung, Kompetenzentwicklung und emotionalen Unterstützung helfen. Wie kann ich Ihnen heute helfen?",
        "Hi! Ich bin hier, um Ihnen bei Ihrem Karriereweg zu helfen. Ob Sie Beratung, Motivation oder einfach jemanden zum Reden brauchen, ich bin für Sie da!",
        "Willkommen! Ich bin Ihr persönlicher KI-Mentor. Ich kann natürlich mit Ihnen sprechen und Ihnen helfen, Ihren Karriereweg zu entdecken. Was möchten Sie erkunden?"
      ]
    }
  };

  // Career guidance database with multilingual support
  careerPaths = {
    technology: {
      en: {
        title: "Technology Careers",
        paths: [
          {
            name: "Web Development",
            description: "Build websites and web applications using modern technologies",
            skills: ["HTML/CSS", "JavaScript", "React/Vue", "Node.js", "Databases"],
            timeline: "6-12 months",
            salary: "$50k-$120k",
            roadmap: [
              "Learn HTML & CSS fundamentals (3-4 weeks)",
              "Master JavaScript programming (6-8 weeks)",
              "Choose a frontend framework (React/Vue) (6-8 weeks)",
              "Learn backend development (Node.js/Python) (6-8 weeks)",
              "Database management (SQL/NoSQL) (4-6 weeks)",
              "Build portfolio projects (6-8 weeks)",
              "Job search and interview preparation (2-4 weeks)"
            ]
          },
          {
            name: "Data Science",
            description: "Analyze data to extract insights and build predictive models",
            skills: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization"],
            timeline: "8-15 months",
            salary: "$70k-$150k",
            roadmap: [
              "Learn Python programming basics (4-6 weeks)",
              "Statistics and mathematics fundamentals (8-10 weeks)",
              "Data manipulation with Pandas/NumPy (4-6 weeks)",
              "Data visualization (Matplotlib, Seaborn) (3-4 weeks)",
              "Machine learning algorithms (10-12 weeks)",
              "SQL and database management (4-6 weeks)",
              "Build data science portfolio (8-10 weeks)",
              "Apply for entry-level positions"
            ]
          }
        ]
      },
      es: {
        title: "Carreras en Tecnología",
        paths: [
          {
            name: "Desarrollo Web",
            description: "Construir sitios web y aplicaciones web usando tecnologías modernas",
            skills: ["HTML/CSS", "JavaScript", "React/Vue", "Node.js", "Bases de datos"],
            timeline: "6-12 meses",
            salary: "$50k-$120k",
            roadmap: [
              "Aprender fundamentos de HTML y CSS (3-4 semanas)",
              "Dominar programación JavaScript (6-8 semanas)",
              "Elegir un framework frontend (React/Vue) (6-8 semanas)",
              "Aprender desarrollo backend (Node.js/Python) (6-8 semanas)",
              "Gestión de bases de datos (SQL/NoSQL) (4-6 semanas)",
              "Construir proyectos de portafolio (6-8 semanas)",
              "Búsqueda de empleo y preparación de entrevistas (2-4 semanas)"
            ]
          }
        ]
      },
      hi: {
        title: "टेक्नोलॉजी करियर",
        paths: [
          {
            name: "वेब डेवलपमेंट",
            description: "आधुनिक तकनीकों का उपयोग करके वेबसाइट और वेब एप्लिकेशन बनाना",
            skills: ["HTML/CSS", "JavaScript", "React/Vue", "Node.js", "डेटाबेस"],
            timeline: "6-12 महीने",
            salary: "$50k-$120k",
            roadmap: [
              "HTML और CSS की बुनियादी बातें सीखें (3-4 सप्ताह)",
              "JavaScript प्रोग्रामिंग में महारत हासिल करें (6-8 सप्ताह)",
              "एक फ्रंटएंड फ्रेमवर्क चुनें (React/Vue) (6-8 सप्ताह)",
              "बैकएंड डेवलपमेंट सीखें (Node.js/Python) (6-8 सप्ताह)",
              "डेटाबेस प्रबंधन (SQL/NoSQL) (4-6 सप्ताह)",
              "पोर्टफोलियो प्रोजेक्ट्स बनाएं (6-8 सप्ताह)",
              "नौकरी की खोज और इंटरव्यू की तैयारी (2-4 सप्ताह)"
            ]
          }
        ]
      }
    },
    business: {
      en: {
        title: "Business Careers",
        paths: [
          {
            name: "Digital Marketing",
            description: "Promote products and services through digital channels",
            skills: ["SEO/SEM", "Social Media", "Content Creation", "Analytics", "Email Marketing"],
            timeline: "4-8 months",
            salary: "$40k-$90k",
            roadmap: [
              "Learn digital marketing fundamentals (2-3 weeks)",
              "SEO and content marketing strategies (4-6 weeks)",
              "Social media marketing mastery (4-5 weeks)",
              "Google Ads and PPC campaigns (4-5 weeks)",
              "Email marketing and automation (3-4 weeks)",
              "Analytics and data interpretation (4-5 weeks)",
              "Build marketing portfolio (6-8 weeks)",
              "Apply for marketing positions"
            ]
          }
        ]
      }
    }
  };

  // Emotional support responses in multiple languages
  emotionalSupport = {
    en: {
      anxiety: [
        "I understand you're feeling anxious, and that's completely normal. Remember, anxiety often comes from uncertainty about the future. Let's work together to create a clear, step-by-step plan that will help reduce that uncertainty. You don't have to figure everything out today - just focus on the next small step you can take.",
        "Feeling anxious about your career is something many people experience, especially when starting over. Take a deep breath. You've already shown incredible courage by seeking help and wanting to improve your situation. That's a huge first step that many people never take."
      ],
      motivation: [
        "I want you to know that your journey is unique and valuable. Dropping out doesn't define your potential - it's just a different path to success. Some of the most successful people took unconventional routes. What matters is that you're here now, ready to grow and learn.",
        "You have something that many traditional students don't have - real-world experience and resilience. You've faced challenges and you're still here, still fighting for your future. That strength will serve you well in whatever career you choose."
      ],
      confidence: [
        "You are more capable than you realize. Confidence isn't something you're born with - it's built through taking action and achieving small wins. Every skill you learn, every challenge you overcome, every step forward builds your confidence.",
        "Your life experiences have taught you things that can't be learned in a classroom. You have unique perspectives and problem-solving abilities that employers value. Trust in your ability to learn and adapt - you've done it before, and you can do it again."
      ]
    },
    es: {
      anxiety: [
        "Entiendo que te sientes ansioso, y eso es completamente normal. Recuerda, la ansiedad a menudo viene de la incertidumbre sobre el futuro. Trabajemos juntos para crear un plan claro, paso a paso, que ayude a reducir esa incertidumbre. No tienes que resolverlo todo hoy - solo concéntrate en el próximo pequeño paso que puedes dar.",
        "Sentirse ansioso por tu carrera es algo que muchas personas experimentan, especialmente cuando empiezan de nuevo. Respira profundo. Ya has mostrado un coraje increíble al buscar ayuda y querer mejorar tu situación. Ese es un primer paso enorme que muchas personas nunca dan."
      ]
    },
    hi: {
      anxiety: [
        "मैं समझता हूं कि आप चिंतित महसूस कर रहे हैं, और यह बिल्कुल सामान्य है। याद रखें, चिंता अक्सर भविष्य की अनिश्चितता से आती है। आइए मिलकर एक स्पष्ट, चरणबद्ध योजना बनाते हैं जो उस अनिश्चितता को कम करने में मदद करेगी। आपको आज सब कुछ समझने की जरूरत नहीं है - बस अगले छोटे कदम पर ध्यान दें जो आप उठा सकते हैं।",
        "अपने करियर के बारे में चिंतित महसूस करना कुछ ऐसा है जो कई लोग अनुभव करते हैं, खासकर जब वे नए सिरे से शुरुआत कर रहे हों। गहरी सांस लें। आपने पहले से ही मदद मांगने और अपनी स्थिति सुधारने की चाह रखकर अविश्वसनीय साहस दिखाया है। यह एक बहुत बड़ा पहला कदम है जो कई लोग कभी नहीं उठाते।"
      ]
    }
  };

  initializeLanguageSupport() {
    // Detect user's preferred language from browser
    const browserLang = navigator.language || navigator.userLanguage;
    if (this.languages[browserLang]) {
      this.currentLanguage = browserLang;
      this.userProfile.preferredLanguage = browserLang;
    }
  }

  initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLanguage;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateVoiceUI(true);
        this.showVoiceFeedback('🎤 Listening... Speak naturally!');
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        let isFinal = false;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }
        
        const chatInput = document.getElementById('enhanced-chat-input');
        if (chatInput) {
          chatInput.value = transcript;
        }
        
        if (isFinal) {
          this.showVoiceFeedback(`✅ You said: "${transcript}"`);
          this.voiceMode = true; // Enable voice mode when user speaks
          setTimeout(() => {
            this.handleUserInput(transcript, 'voice');
            this.hideVoiceFeedback();
          }, 500);
        } else {
          this.showVoiceFeedback(`🎤 Recognizing: "${transcript}"`);
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        this.updateVoiceUI(false);
        this.handleSpeechError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateVoiceUI(false);
      };
    }
  }

  initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.loadVoices();
      
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  loadVoices() {
    this.voices = this.synthesis.getVoices();
    console.log(`Loaded ${this.voices.length} voices`);
  }

  createEnhancedUI() {
    // Create floating chatbot button
    const chatbotButton = document.createElement('div');
    chatbotButton.id = 'enhanced-chatbot-button';
    chatbotButton.className = 'fixed bottom-6 right-6 z-50';
    chatbotButton.innerHTML = `
      <button class="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group animate-pulse">
        <i class="fas fa-comments text-xl group-hover:scale-110 transition-transform duration-300"></i>
        <div class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
          AI
        </div>
      </button>
    `;
    document.body.appendChild(chatbotButton);

    // Create enhanced chatbot modal
    const chatbotModal = document.createElement('div');
    chatbotModal.id = 'enhanced-chatbot-modal';
    chatbotModal.className = 'fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center p-4';
    chatbotModal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform scale-95 opacity-0 transition-all duration-300">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i class="fas fa-robot text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg">AI Career Assistant</h3>
              <p class="text-sm opacity-90">Your multilingual career guidance companion</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <!-- Language Selector -->
            <select id="language-selector" class="bg-white/20 text-white rounded-lg px-3 py-1 text-sm border-none outline-none">
              <option value="en-US">🇺🇸 English</option>
              <option value="es-ES">🇪🇸 Español</option>
              <option value="hi-IN">🇮🇳 हिंदी</option>
              <option value="fr-FR">🇫🇷 Français</option>
              <option value="de-DE">🇩🇪 Deutsch</option>
            </select>
            <button id="close-enhanced-chatbot" class="text-white/80 hover:text-white transition-colors p-2">
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex h-[70vh]">
          <!-- Sidebar -->
          <div class="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <div class="space-y-4">
              <!-- Voice Mode Toggle -->
              <div class="bg-white rounded-lg p-3 shadow-sm">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-gray-700">Voice Mode</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="voice-mode-toggle" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p class="text-xs text-gray-500">Auto voice response when you speak</p>
              </div>

              <!-- Quick Actions -->
              <div class="bg-white rounded-lg p-3 shadow-sm">
                <h4 class="font-medium text-gray-700 mb-3">Quick Actions</h4>
                <div class="space-y-2">
                  <button class="quick-action w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm" data-action="career-explore">
                    🚀 Explore Career Paths
                  </button>
                  <button class="quick-action w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm" data-action="skill-assessment">
                    📊 Skill Assessment
                  </button>
                  <button class="quick-action w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm" data-action="motivation">
                    💪 Need Motivation
                  </button>
                  <button class="quick-action w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm" data-action="roadmap">
                    🗺️ Create Learning Roadmap
                  </button>
                </div>
              </div>

              <!-- User Profile -->
              <div class="bg-white rounded-lg p-3 shadow-sm">
                <h4 class="font-medium text-gray-700 mb-3">Your Profile</h4>
                <div class="space-y-2 text-sm">
                  <div>
                    <span class="text-gray-500">Skill Level:</span>
                    <span class="ml-2 font-medium" id="user-skill-level">Beginner</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Interests:</span>
                    <div class="mt-1" id="user-interests">
                      <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">Technology</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Chat -->
          <div class="flex-1 flex flex-col">
            <!-- Messages -->
            <div id="enhanced-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-4">
              <!-- Welcome message will be added here -->
            </div>

            <!-- Voice Feedback -->
            <div id="voice-feedback" class="hidden bg-blue-50 border-t border-blue-200 p-3">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span id="voice-feedback-text" class="text-blue-700 text-sm"></span>
              </div>
            </div>

            <!-- Input Area -->
            <div class="border-t border-gray-200 p-4">
              <div class="flex items-center space-x-3">
                <div class="flex-1 relative">
                  <input 
                    type="text" 
                    id="enhanced-chat-input" 
                    placeholder="Type your message or click the mic to speak..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                  <button id="voice-input-btn" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                    <i class="fas fa-microphone text-lg"></i>
                  </button>
                </div>
                <button id="send-message-btn" class="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(chatbotModal);
  }

  bindEvents() {
    // Open chatbot
    document.getElementById('enhanced-chatbot-button').addEventListener('click', () => {
      this.openChatbot();
    });

    // Close chatbot
    document.getElementById('close-enhanced-chatbot').addEventListener('click', () => {
      this.closeChatbot();
    });

    // Language selector
    document.getElementById('language-selector').addEventListener('change', (e) => {
      this.changeLanguage(e.target.value);
    });

    // Voice mode toggle
    document.getElementById('voice-mode-toggle').addEventListener('change', (e) => {
      this.voiceMode = e.target.checked;
      if (this.voiceMode) {
        this.showNotification('Voice mode enabled! I\'ll respond with voice automatically.', 'success');
      }
    });

    // Voice input button
    document.getElementById('voice-input-btn').addEventListener('click', () => {
      this.toggleVoiceInput();
    });

    // Send message button
    document.getElementById('send-message-btn').addEventListener('click', () => {
      const input = document.getElementById('enhanced-chat-input');
      if (input.value.trim()) {
        this.handleUserInput(input.value.trim(), 'text');
        input.value = '';
      }
    });

    // Enter key to send message
    document.getElementById('enhanced-chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const input = e.target;
        if (input.value.trim()) {
          this.handleUserInput(input.value.trim(), 'text');
          input.value = '';
        }
      }
    });

    // Quick actions
    document.querySelectorAll('.quick-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        this.handleQuickAction(action);
      });
    });

    // Close modal when clicking outside
    document.getElementById('enhanced-chatbot-modal').addEventListener('click', (e) => {
      if (e.target.id === 'enhanced-chatbot-modal') {
        this.closeChatbot();
      }
    });
  }

  openChatbot() {
    const modal = document.getElementById('enhanced-chatbot-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.querySelector('.bg-white').style.transform = 'scale(1)';
      modal.querySelector('.bg-white').style.opacity = '1';
    }, 10);

    // Show welcome message if first time
    if (this.chatHistory.length === 0) {
      this.showWelcomeMessage();
    }
  }

  closeChatbot() {
    const modal = document.getElementById('enhanced-chatbot-modal');
    const content = modal.querySelector('.bg-white');
    content.style.transform = 'scale(0.95)';
    content.style.opacity = '0';
    
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);

    // Stop any ongoing speech
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    if (this.isListening) {
      this.recognition.stop();
    }
  }

  changeLanguage(langCode) {
    this.currentLanguage = langCode;
    this.userProfile.preferredLanguage = langCode;
    
    // Update speech recognition language
    if (this.recognition) {
      this.recognition.lang = langCode;
    }

    // Show language change confirmation
    const langName = this.languages[langCode]?.name || 'Unknown';
    this.showNotification(`Language changed to ${langName}`, 'success');
    
    // Add a message in the new language
    const greeting = this.getRandomGreeting();
    this.addMessage(greeting, 'bot');
    
    // Speak the greeting if voice mode is on
    if (this.voiceMode) {
      this.speakText(greeting);
    }
  }

  showWelcomeMessage() {
    const greeting = this.getRandomGreeting();
    this.addMessage(greeting, 'bot');
    
    // Auto-speak welcome message
    setTimeout(() => {
      this.speakText(greeting);
    }, 1000);
  }

  getRandomGreeting() {
    const langCode = this.currentLanguage.split('-')[0];
    const greetings = this.languages[this.currentLanguage]?.greetings || this.languages['en-US'].greetings;
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  async handleUserInput(message, inputType) {
    // Add user message to chat
    this.addMessage(message, 'user');
    this.chatHistory.push({ role: 'user', content: message, type: inputType });

    // Show typing indicator
    this.showTypingIndicator();

    // Analyze message and generate response
    const response = await this.generateResponse(message);
    
    // Remove typing indicator
    this.hideTypingIndicator();
    
    // Add bot response
    this.addMessage(response.text, 'bot');
    this.chatHistory.push({ role: 'bot', content: response.text, type: 'text' });

    // Add suggestions if available
    if (response.suggestions && response.suggestions.length > 0) {
      this.addSuggestions(response.suggestions);
    }

    // Add resources if available
    if (response.resources && response.resources.length > 0) {
      this.addResources(response.resources);
    }

    // Speak response if voice mode is enabled or user used voice input
    if (this.voiceMode || inputType === 'voice') {
      setTimeout(() => {
        this.speakText(response.text);
      }, 500);
    }

    // Update user profile based on conversation
    this.updateUserProfile(message, response);
  }

  async generateResponse(message) {
    const messageLower = message.toLowerCase();
    const langCode = this.currentLanguage.split('-')[0];

    // Detect intent and generate appropriate response
    if (this.isGreeting(messageLower)) {
      return { text: this.getRandomGreeting(), type: 'greeting' };
    }
    
    if (this.isCareerQuery(messageLower)) {
      return { text: this.getCareerGuidance(messageLower, langCode), type: 'career' };
    }
    
    if (this.isEmotionalSupport(messageLower)) {
      return { text: this.getEmotionalSupport(messageLower, langCode), type: 'emotional' };
    }
    
    if (this.isSkillQuery(messageLower)) {
      return { text: this.getSkillGuidance(messageLower, langCode), type: 'skill' };
    }

    // Try to get AI response from backend
    try {
      const aiResponse = await this.getAIResponse(message);
      if (aiResponse) {
        return { 
          text: aiResponse.text, 
          type: 'ai',
          suggestions: aiResponse.suggestions,
          resources: aiResponse.resources,
          followUp: aiResponse.followUp
        };
      }
    } catch (error) {
      console.log('AI API not available, using local response');
    }

    // Default conversational response
    return { text: this.getConversationalResponse(message, langCode), type: 'general' };
  }

  isGreeting(message) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'hola', 'namaste', 'bonjour', 'hallo'];
    return greetings.some(greeting => message.includes(greeting));
  }

  isCareerQuery(message) {
    const careerKeywords = ['career', 'job', 'work', 'profession', 'employment', 'salary', 'industry', 'field', 'occupation'];
    return careerKeywords.some(keyword => message.includes(keyword));
  }

  isEmotionalSupport(message) {
    const emotionalKeywords = ['anxious', 'worried', 'scared', 'nervous', 'depressed', 'sad', 'unmotivated', 'hopeless', 'confident', 'doubt'];
    return emotionalKeywords.some(keyword => message.includes(keyword));
  }

  isSkillQuery(message) {
    const skillKeywords = ['learn', 'skill', 'course', 'study', 'training', 'education', 'tutorial', 'practice'];
    return skillKeywords.some(keyword => message.includes(keyword));
  }

  getCareerGuidance(message, langCode) {
    const lang = langCode === 'en' ? 'en' : langCode;
    
    if (message.includes('technology') || message.includes('tech') || message.includes('programming')) {
      const techPaths = this.careerPaths.technology[lang] || this.careerPaths.technology.en;
      return `${techPaths.title}:\n\n${techPaths.paths[0].name}: ${techPaths.paths[0].description}\n\nSkills needed: ${techPaths.paths[0].skills.join(', ')}\nTimeline: ${techPaths.paths[0].timeline}\nSalary range: ${techPaths.paths[0].salary}\n\nWould you like a detailed roadmap?`;
    }
    
    // Default career response
    return this.getDefaultCareerResponse(lang);
  }

  getDefaultCareerResponse(lang) {
    if (lang === 'es') {
      return "Puedo ayudarte a explorar diferentes caminos profesionales. ¿Qué te interesa más: Tecnología, Negocios, Creatividad o Salud? También puedo ayudarte con planificación de carrera, desarrollo de habilidades y apoyo emocional.";
    } else if (lang === 'hi') {
      return "मैं आपको विभिन्न करियर पथों का पता लगाने में मदद कर सकता हूं। आपको क्या सबसे ज्यादा दिलचस्पी है: टेक्नोलॉजी, बिजनेस, क्रिएटिविटी या हेल्थकेयर? मैं करियर प्लानिंग, स्किल डेवलपमेंट और इमोशनल सपोर्ट में भी मदद कर सकता हूं।";
    } else {
      return "I can help you explore different career paths! What interests you most: Technology, Business, Creative fields, or Healthcare? I can also assist with career planning, skill development, and emotional support.";
    }
  }

  getEmotionalSupport(message, langCode) {
    const lang = langCode === 'en' ? 'en' : langCode;
    const support = this.emotionalSupport[lang] || this.emotionalSupport.en;
    
    if (message.includes('anxious') || message.includes('worried') || message.includes('nervous')) {
      return support.anxiety[Math.floor(Math.random() * support.anxiety.length)];
    }
    
    if (message.includes('unmotivated') || message.includes('hopeless') || message.includes('sad')) {
      return support.motivation[Math.floor(Math.random() * support.motivation.length)];
    }
    
    if (message.includes('confident') || message.includes('doubt')) {
      return support.confidence[Math.floor(Math.random() * support.confidence.length)];
    }
    
    return support.motivation[0]; // Default motivational response
  }

  getSkillGuidance(message, langCode) {
    if (langCode === 'es') {
      return "¡Excelente! Aprender nuevas habilidades es clave para el éxito. Te recomiendo:\n\n📚 Recursos gratuitos: Coursera, edX, Khan Academy\n⏰ Estudia 30 minutos diarios\n🤝 Únete a comunidades de aprendizaje\n💼 Practica con proyectos reales\n\n¿Qué habilidad específica te gustaría desarrollar?";
    } else if (langCode === 'hi') {
      return "बहुत बढ़िया! नए स्किल्स सीखना सफलता की चाबी है। मैं सुझाता हूं:\n\n📚 मुफ्त संसाधन: Coursera, edX, Khan Academy\n⏰ रोजाना 30 मिनट पढ़ाई करें\n🤝 लर्निंग कम्युनिटीज में शामिल हों\n💼 रियल प्रोजेक्ट्स के साथ प्रैक्टिस करें\n\nआप कौन सा स्पेसिफिक स्किल डेवलप करना चाहेंगे?";
    } else {
      return "Great! Learning new skills is the key to success. I recommend:\n\n📚 Free resources: Coursera, edX, Khan Academy\n⏰ Study 30 minutes daily\n🤝 Join learning communities\n💼 Practice with real projects\n\nWhat specific skill would you like to develop?";
    }
  }

  getConversationalResponse(message, langCode) {
    const responses = {
      en: [
        "That's interesting! I'm here to help you with your career journey. What specific area would you like to explore?",
        "I understand. Let me help you with that. Can you tell me more about what you're looking for?",
        "Great question! I can assist you with career guidance, skill development, or emotional support. What would be most helpful right now?"
      ],
      es: [
        "¡Eso es interesante! Estoy aquí para ayudarte con tu camino profesional. ¿Qué área específica te gustaría explorar?",
        "Entiendo. Déjame ayudarte con eso. ¿Puedes contarme más sobre lo que estás buscando?",
        "¡Excelente pregunta! Puedo ayudarte con orientación profesional, desarrollo de habilidades o apoyo emocional. ¿Qué sería más útil ahora?"
      ],
      hi: [
        "यह दिलचस्प है! मैं आपकी करियर यात्रा में मदद करने के लिए यहां हूं। आप किस विशिष्ट क्षेत्र का पता लगाना चाहेंगे?",
        "मैं समझता हूं। मुझे इसमें आपकी मदद करने दें। क्या आप मुझे बता सकते हैं कि आप क्या खोज रहे हैं?",
        "बहुत बढ़िया सवाल! मैं करियर गाइडेंस, स्किल डेवलपमेंट या इमोशनल सपोर्ट में आपकी मदद कर सकता हूं। अभी क्या सबसे ज्यादा मददगार होगा?"
      ]
    };
    
    const langResponses = responses[langCode] || responses.en;
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  }

  async getAIResponse(message) {
    try {
      // Try enhanced AI endpoint first
      const response = await fetch('http://localhost:5000/api/enhanced-ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          language: this.currentLanguage,
          user_profile: this.userProfile
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.response) {
          return {
            text: data.response.message,
            suggestions: data.response.suggestions || [],
            resources: data.response.resources || [],
            followUp: data.response.follow_up_questions || []
          };
        }
      }
    } catch (error) {
      console.log('Enhanced AI backend not available, trying fallback:', error);
    }
    
    // Fallback to original AI endpoint
    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          language: this.currentLanguage,
          user_profile: this.userProfile
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          text: data.response?.response || data.message || 'I understand you, but I need a moment to process that. Could you try rephrasing?',
          suggestions: [],
          resources: [],
          followUp: []
        };
      }
    } catch (error) {
      console.log('Backend AI not available:', error);
    }
    return null;
  }

  handleQuickAction(action) {
    const actions = {
      'career-explore': "I'd love to help you explore career options! What interests you most: Technology 💻, Business 💼, Creative fields 🎨, or Healthcare 🏥?",
      'skill-assessment': "Let's assess your current skills! What areas do you have experience in? Don't worry if you're just starting - everyone begins somewhere!",
      'motivation': "I believe in you! 🌟 Remember, every expert was once a beginner. Your unique journey and experiences give you valuable perspectives. What's one small step you can take today toward your goals?",
      'roadmap': "I can create a personalized learning roadmap for you! First, tell me: What field interests you most, and what's your current experience level?"
    };
    
    const message = actions[action] || "How can I help you today?";
    this.addMessage(message, 'bot');
    
    if (this.voiceMode) {
      this.speakText(message);
    }
  }

  addMessage(text, sender) {
    const messagesContainer = document.getElementById('enhanced-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 chat-message`;
    
    const isBot = sender === 'bot';
    messageDiv.innerHTML = `
      <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isBot 
          ? 'bg-gray-100 text-gray-800' 
          : 'bg-blue-500 text-white'
      } ${isBot ? 'rounded-bl-sm' : 'rounded-br-sm'}">
        ${isBot ? '<i class="fas fa-robot text-blue-500 mr-2"></i>' : ''}
        <span class="whitespace-pre-wrap">${text}</span>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  addSuggestions(suggestions) {
    const messagesContainer = document.getElementById('enhanced-chat-messages');
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'flex justify-start mb-4 chat-message';
    
    const suggestionsHtml = suggestions.map(suggestion => 
      `<button class="suggestion-btn bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm mr-2 mb-2 transition-colors" onclick="window.enhancedChatbot.handleSuggestionClick('${suggestion.replace(/'/g, "\\'")}')">
        ${suggestion}
      </button>`
    ).join('');
    
    suggestionsDiv.innerHTML = `
      <div class="max-w-xs lg:max-w-md">
        <div class="text-xs text-gray-500 mb-2">
          <i class="fas fa-lightbulb mr-1"></i>Suggestions:
        </div>
        <div class="flex flex-wrap">
          ${suggestionsHtml}
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(suggestionsDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  addResources(resources) {
    const messagesContainer = document.getElementById('enhanced-chat-messages');
    const resourcesDiv = document.createElement('div');
    resourcesDiv.className = 'flex justify-start mb-4 chat-message';
    
    const resourcesHtml = resources.map(resource => 
      `<div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium text-green-800">${resource.name}</h4>
            <p class="text-sm text-green-600">${resource.description}</p>
            ${resource.price ? `<span class="text-xs text-green-500">Price: ${resource.price}</span>` : '<span class="text-xs text-green-500">Free</span>'}
          </div>
          ${resource.url ? `<a href="${resource.url}" target="_blank" class="text-green-600 hover:text-green-800"><i class="fas fa-external-link-alt"></i></a>` : ''}
        </div>
      </div>`
    ).join('');
    
    resourcesDiv.innerHTML = `
      <div class="max-w-xs lg:max-w-md">
        <div class="text-xs text-gray-500 mb-2">
          <i class="fas fa-book mr-1"></i>Recommended Resources:
        </div>
        ${resourcesHtml}
      </div>
    `;
    
    messagesContainer.appendChild(resourcesDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  handleSuggestionClick(suggestion) {
    this.handleUserInput(suggestion, 'click');
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('enhanced-chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'flex justify-start mb-4';
    typingDiv.innerHTML = `
      <div class="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm">
        <i class="fas fa-robot text-blue-500 mr-2"></i>
        <span class="typing-dots">
          <span class="dot animate-bounce">.</span>
          <span class="dot animate-bounce" style="animation-delay: 0.1s">.</span>
          <span class="dot animate-bounce" style="animation-delay: 0.2s">.</span>
        </span>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  toggleVoiceInput() {
    if (this.isListening) {
      this.recognition.stop();
    } else {
      if (this.recognition) {
        this.recognition.start();
      } else {
        this.showNotification('Voice recognition not supported in this browser', 'error');
      }
    }
  }

  updateVoiceUI(isListening) {
    const voiceBtn = document.getElementById('voice-input-btn');
    if (voiceBtn) {
      const icon = voiceBtn.querySelector('i');
      if (isListening) {
        icon.className = 'fas fa-stop text-lg text-red-500';
        voiceBtn.classList.add('animate-pulse');
      } else {
        icon.className = 'fas fa-microphone text-lg';
        voiceBtn.classList.remove('animate-pulse');
      }
    }
  }

  showVoiceFeedback(message) {
    const feedback = document.getElementById('voice-feedback');
    const feedbackText = document.getElementById('voice-feedback-text');
    if (feedback && feedbackText) {
      feedbackText.textContent = message;
      feedback.classList.remove('hidden');
    }
  }

  hideVoiceFeedback() {
    const feedback = document.getElementById('voice-feedback');
    if (feedback) {
      feedback.classList.add('hidden');
    }
  }

  speakText(text) {
    if (!this.synthesis || this.isSpeaking) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    // Clean text for speech
    const cleanText = text
      .replace(/[*#`]/g, '')
      .replace(/\n/g, ' ')
      .replace(/[🌟💻💼🎨🏥📚⏰🤝💼🎯]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Find appropriate voice for current language
    const preferredVoice = this.voices.find(voice => 
      voice.lang.startsWith(this.currentLanguage.split('-')[0])
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      // Auto-listen for response if voice mode is enabled
      if (this.voiceMode && this.recognition && !this.isListening) {
        setTimeout(() => {
          this.recognition.start();
        }, 1000);
      }
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
    };

    this.synthesis.speak(utterance);
  }

  handleSpeechError(error) {
    let errorMessage = 'Speech recognition error: ';
    switch(error) {
      case 'no-speech':
        errorMessage += 'No speech detected. Please try again.';
        break;
      case 'audio-capture':
        errorMessage += 'Microphone not accessible. Check permissions.';
        break;
      case 'not-allowed':
        errorMessage += 'Microphone permission denied. Please allow access.';
        break;
      case 'network':
        errorMessage += 'Network error. Check your connection.';
        break;
      default:
        errorMessage += 'Please try again.';
    }
    
    this.showVoiceFeedback(errorMessage);
    this.showNotification(errorMessage, 'error');
    setTimeout(() => this.hideVoiceFeedback(), 4000);
  }

  updateUserProfile(userMessage, botResponse) {
    // Extract interests and update profile
    const techKeywords = ['programming', 'coding', 'web development', 'software', 'technology'];
    const businessKeywords = ['business', 'marketing', 'management', 'sales', 'entrepreneurship'];
    const creativeKeywords = ['design', 'creative', 'art', 'writing', 'content'];
    
    const messageLower = userMessage.toLowerCase();
    
    if (techKeywords.some(keyword => messageLower.includes(keyword))) {
      if (!this.userProfile.interests.includes('Technology')) {
        this.userProfile.interests.push('Technology');
        this.updateProfileUI();
      }
    }
    
    if (businessKeywords.some(keyword => messageLower.includes(keyword))) {
      if (!this.userProfile.interests.includes('Business')) {
        this.userProfile.interests.push('Business');
        this.updateProfileUI();
      }
    }
    
    if (creativeKeywords.some(keyword => messageLower.includes(keyword))) {
      if (!this.userProfile.interests.includes('Creative')) {
        this.userProfile.interests.push('Creative');
        this.updateProfileUI();
      }
    }
    
    // Save profile to localStorage
    this.saveUserProfile();
  }

  updateProfileUI() {
    const interestsContainer = document.getElementById('user-interests');
    if (interestsContainer) {
      interestsContainer.innerHTML = this.userProfile.interests.map(interest => 
        `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">${interest}</span>`
      ).join('');
    }
  }

  saveUserProfile() {
    localStorage.setItem('nextbloom_user_profile', JSON.stringify(this.userProfile));
  }

  loadUserProfile() {
    const saved = localStorage.getItem('nextbloom_user_profile');
    if (saved) {
      this.userProfile = { ...this.userProfile, ...JSON.parse(saved) };
      this.currentLanguage = this.userProfile.preferredLanguage || this.currentLanguage;
      this.updateProfileUI();
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-black' :
      'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-sm">${message}</span>
        <button class="ml-3 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  }
}

// Initialize the enhanced chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
  window.enhancedChatbot = new EnhancedChatbot();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedChatbot;
}