#!/usr/bin/env python3
"""
Test script to verify authentication system
"""
import requests
import json

BASE_URL = "http://localhost:5000/api/auth"

def test_signup():
    """Test user signup"""
    print("Testing signup...")
    data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/signup", json=data)
        result = response.json()
        print(f"Signup Response: {result}")
        return result.get('success', False)
    except Exception as e:
        print(f"Signup Error: {e}")
        return False

def test_login():
    """Test user login"""
    print("Testing login...")
    data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=data)
        result = response.json()
        print(f"Login Response: {result}")
        return result.get('success', False)
    except Exception as e:
        print(f"Login Error: {e}")
        return False

def test_invalid_login():
    """Test invalid login"""
    print("Testing invalid login...")
    data = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=data)
        result = response.json()
        print(f"Invalid Login Response: {result}")
        return not result.get('success', True)  # Should return False for success
    except Exception as e:
        print(f"Invalid Login Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing NextBloom Authentication System")
    print("=" * 50)
    
    # Test signup
    signup_success = test_signup()
    print(f"Signup Test: {'PASSED' if signup_success else 'FAILED'}")
    
    # Test valid login
    login_success = test_login()
    print(f"Login Test: {'PASSED' if login_success else 'FAILED'}")
    
    # Test invalid login
    invalid_login_success = test_invalid_login()
    print(f"Invalid Login Test: {'PASSED' if invalid_login_success else 'FAILED'}")
    
    print("=" * 50)
    if signup_success and login_success and invalid_login_success:
        print("All tests PASSED! Your authentication system is working!")
    else:
        print("Some tests FAILED. Check the server logs.")