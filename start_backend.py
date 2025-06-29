#!/usr/bin/env python3
"""
Simple script to start the NextBloom backend server
"""

import os
import sys
import subprocess
import time

def check_requirements():
    """Check if required packages are installed"""
    required_packages = ['flask', 'flask-cors', 'flask-bcrypt']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"Missing required packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        for package in missing_packages:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
        print("All packages installed successfully!")

def clear_user_data():
    """Clear all existing user data"""
    backend_dir = os.path.join(os.path.dirname(__file__), 'nextbloom-backend')
    users_file = os.path.join(backend_dir, 'users.json')
    
    if os.path.exists(users_file):
        with open(users_file, 'w') as f:
            f.write('[]')
        print("✅ All user data cleared from database")
    else:
        print("ℹ️ No existing user data found")

def start_server():
    """Start the Flask backend server"""
    backend_dir = os.path.join(os.path.dirname(__file__), 'nextbloom-backend')
    
    if not os.path.exists(backend_dir):
        print(f"Backend directory not found: {backend_dir}")
        return False
    
    app_file = os.path.join(backend_dir, 'app.py')
    if not os.path.exists(app_file):
        print(f"App file not found: {app_file}")
        return False
    
    print("Starting NextBloom backend server...")
    print("Server will be available at: http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Change to backend directory and run the app
        os.chdir(backend_dir)
        subprocess.run([sys.executable, 'app.py'])
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("NextBloom Backend Starter")
    print("=" * 30)
    
    # Check and install requirements
    check_requirements()
    
    # Clear existing user data
    clear_user_data()
    
    # Start the server
    start_server()