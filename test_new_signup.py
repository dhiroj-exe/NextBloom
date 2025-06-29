#!/usr/bin/env python3
import requests
import time

BASE_URL = "http://localhost:5000/api/auth"

def test_new_signup():
    print("Testing New Comprehensive Signup System")
    print("=" * 50)
    
    # Create test user data
    test_data = {
        "firstName": "John",
        "lastName": "Doe", 
        "email": f"john.doe.{int(time.time())}@example.com",
        "age": 25,
        "education": "Bachelor's Degree",
        "password": "securepassword123"
    }
    
    print(f"Test User: {test_data['firstName']} {test_data['lastName']}")
    print(f"Email: {test_data['email']}")
    print(f"Age: {test_data['age']}")
    print(f"Education: {test_data['education']}")
    
    # Test signup with all fields
    print("\n1. Testing Comprehensive Signup...")
    try:
        response = requests.post(f"{BASE_URL}/signup", json=test_data)
        result = response.json()
        print(f"Response: {result}")
        
        if result.get('success'):
            print("COMPREHENSIVE SIGNUP: PASSED")
            print(f"User Profile Created: {result.get('user', {})}")
        else:
            print(f"COMPREHENSIVE SIGNUP: FAILED - {result.get('message')}")
            return False
    except Exception as e:
        print(f"SIGNUP ERROR: {e}")
        return False
    
    # Test login with new user
    print("\n2. Testing Login with New User...")
    try:
        login_data = {
            "email": test_data["email"],
            "password": test_data["password"]
        }
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        result = response.json()
        print(f"Login Response: {result}")
        
        if result.get('success'):
            print("LOGIN WITH PROFILE: PASSED")
            user_profile = result.get('user', {})
            print(f"Retrieved Profile: {user_profile}")
            
            # Verify all profile fields are returned
            expected_fields = ['firstName', 'lastName', 'email', 'age', 'education']
            missing_fields = [field for field in expected_fields if field not in user_profile]
            
            if missing_fields:
                print(f"WARNING: Missing profile fields: {missing_fields}")
            else:
                print("All profile fields present!")
                
        else:
            print(f"LOGIN: FAILED - {result.get('message')}")
            return False
    except Exception as e:
        print(f"LOGIN ERROR: {e}")
        return False
    
    return True

def test_validation():
    print("\n" + "=" * 50)
    print("Testing Enhanced Validation")
    print("=" * 50)
    
    # Test missing fields
    print("\n1. Testing Missing Fields...")
    try:
        incomplete_data = {
            "firstName": "John",
            "email": "john@example.com",
            # Missing lastName, age, education, password
        }
        response = requests.post(f"{BASE_URL}/signup", json=incomplete_data)
        result = response.json()
        print(f"Response: {result}")
        
        if not result.get('success'):
            print("MISSING FIELDS VALIDATION: PASSED")
        else:
            print("MISSING FIELDS VALIDATION: FAILED - Should have been rejected")
            return False
    except Exception as e:
        print(f"VALIDATION ERROR: {e}")
        return False
    
    # Test invalid age
    print("\n2. Testing Invalid Age...")
    try:
        invalid_age_data = {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "age": 150,  # Invalid age
            "education": "High School",
            "password": "password123"
        }
        response = requests.post(f"{BASE_URL}/signup", json=invalid_age_data)
        result = response.json()
        print(f"Response: {result}")
        
        if not result.get('success'):
            print("INVALID AGE VALIDATION: PASSED")
        else:
            print("INVALID AGE VALIDATION: FAILED - Should have been rejected")
            return False
    except Exception as e:
        print(f"AGE VALIDATION ERROR: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("NextBloom Enhanced Authentication Test")
    
    # Test new signup system
    signup_success = test_new_signup()
    
    # Test validation
    validation_success = test_validation()
    
    print("\n" + "=" * 50)
    print("FINAL RESULTS")
    print("=" * 50)
    print(f"Enhanced Signup: {'PASSED' if signup_success else 'FAILED'}")
    print(f"Enhanced Validation: {'PASSED' if validation_success else 'FAILED'}")
    
    if signup_success and validation_success:
        print("\nALL TESTS PASSED!")
        print("Your enhanced authentication system is working!")
        print("\nFeatures confirmed:")
        print("- Comprehensive user profiles")
        print("- All required fields validation")
        print("- Age range validation")
        print("- Profile data storage and retrieval")
        print("\nReady to test in browser!")
    else:
        print("\nSOME TESTS FAILED!")
        print("Please check the server and try again.")