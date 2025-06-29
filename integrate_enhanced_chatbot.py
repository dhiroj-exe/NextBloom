#!/usr/bin/env python3
"""
Integration script to add the enhanced chatbot to the existing index.html
This script will backup the original and add the enhanced chatbot functionality
"""

import os
import shutil
from datetime import datetime

def backup_original():
    """Create a backup of the original index.html"""
    if os.path.exists('index.html'):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_name = f'index_backup_{timestamp}.html'
        shutil.copy2('index.html', backup_name)
        print(f"✅ Created backup: {backup_name}")
        return True
    else:
        print("❌ index.html not found")
        return False

def integrate_enhanced_chatbot():
    """Integrate the enhanced chatbot into index.html"""
    
    if not os.path.exists('index.html'):
        print("❌ index.html not found. Please run this script from the project root.")
        return False
    
    if not os.path.exists('enhanced_chatbot.js'):
        print("❌ enhanced_chatbot.js not found. Please ensure it's in the same directory.")
        return False
    
    # Read the current index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if enhanced chatbot is already integrated
    if 'enhanced_chatbot.js' in content:
        print("⚠️  Enhanced chatbot appears to already be integrated.")
        response = input("Do you want to continue anyway? (y/n): ")
        if response.lower() != 'y':
            return False
    
    # Add the enhanced chatbot script before the closing body tag
    enhanced_script = '''
    <!-- Enhanced Multilingual Voice Chatbot -->
    <script src="enhanced_chatbot.js"></script>
    <script>
        // Initialize enhanced chatbot when page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Wait a bit for other scripts to load
            setTimeout(() => {
                if (typeof EnhancedChatbot !== 'undefined') {
                    window.enhancedChatbot = new EnhancedChatbot();
                    console.log('✅ Enhanced Chatbot initialized successfully');
                    
                    // Show notification about enhanced features
                    setTimeout(() => {
                        if (window.enhancedChatbot && window.enhancedChatbot.showNotification) {
                            window.enhancedChatbot.showNotification(
                                '🚀 Enhanced AI Chatbot loaded! Try voice input and multilingual support!', 
                                'success'
                            );
                        }
                    }, 2000);
                } else {
                    console.error('❌ Enhanced Chatbot failed to load');
                }
            }, 1000);
        });
        
        // Add enhanced chatbot button to navbar if it doesn't exist
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                const navVoiceBtn = document.getElementById('nav-voice-assistant');
                if (navVoiceBtn && window.enhancedChatbot) {
                    navVoiceBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        window.enhancedChatbot.openChatbot();
                    });
                }
            }, 1500);
        });
    </script>
    </body>'''
    
    # Replace the closing body tag
    if '</body>' in content:
        content = content.replace('</body>', enhanced_script)
        
        # Write the updated content
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("✅ Enhanced chatbot integrated successfully!")
        return True
    else:
        print("❌ Could not find closing </body> tag in index.html")
        return False

def create_integration_info():
    """Create an info file about the integration"""
    info_content = """# Enhanced Chatbot Integration

## What was added:
1. Enhanced multilingual voice chatbot with advanced AI capabilities
2. Support for 5 languages: English, Spanish, Hindi, French, German
3. Voice input and output with automatic conversation flow
4. Personalized career guidance and emotional support
5. Learning roadmaps and resource recommendations

## Files added:
- enhanced_chatbot.js - Main chatbot logic
- enhanced_chatbot_demo.html - Standalone demo page
- nextbloom-backend/routes/enhanced_ai_routes.py - Backend API
- ENHANCED_CHATBOT_README.md - Comprehensive documentation

## How to use:
1. Start the backend: `cd nextbloom-backend && python app.py`
2. Open index.html in your browser
3. Click the voice assistant button in the navbar
4. Try speaking to the chatbot or typing in different languages

## Features:
- 🎤 Voice input and output
- 🌍 Multilingual support (5 languages)
- 🧠 Intelligent conversation with context awareness
- 💼 Career guidance and roadmap generation
- 📚 Learning resource recommendations
- 💪 Emotional support and motivation
- 📊 Skill assessment and personalized advice

## Testing:
Run `python test_enhanced_chatbot.py` to test all backend endpoints.

## Backup:
Your original index.html has been backed up with a timestamp.
"""
    
    with open('ENHANCED_CHATBOT_INTEGRATION.md', 'w', encoding='utf-8') as f:
        f.write(info_content)
    
    print("✅ Created integration info file: ENHANCED_CHATBOT_INTEGRATION.md")

def main():
    print("🚀 Enhanced Chatbot Integration Script")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('index.html'):
        print("❌ Please run this script from the NextBloom project root directory")
        print("   (where index.html is located)")
        return
    
    # Create backup
    if not backup_original():
        return
    
    # Integrate enhanced chatbot
    if integrate_enhanced_chatbot():
        create_integration_info()
        
        print("\n🎉 Integration completed successfully!")
        print("\n📋 Next steps:")
        print("1. Start the backend server:")
        print("   cd nextbloom-backend")
        print("   python app.py")
        print("\n2. Open index.html in your browser")
        print("\n3. Click the 'Voice AI' button in the navbar")
        print("\n4. Try these features:")
        print("   - Voice input (click microphone)")
        print("   - Multilingual chat (change language)")
        print("   - Career guidance questions")
        print("   - Emotional support requests")
        print("\n5. Test the backend:")
        print("   python test_enhanced_chatbot.py")
        
        print("\n📚 For detailed documentation, see:")
        print("   - ENHANCED_CHATBOT_README.md")
        print("   - enhanced_chatbot_demo.html (standalone demo)")
        
    else:
        print("\n❌ Integration failed. Please check the errors above.")

if __name__ == "__main__":
    main()