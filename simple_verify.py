#!/usr/bin/env python3
"""
Simple verification for index.html updates
"""
import os

def check_file_for_index1_html(filepath):
    """Check if a file contains references to index1.html"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return 'index1.html' in content
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False

def main():
    print("Checking for index1.html references...")
    print("=" * 40)
    
    files_to_check = [
        'dashboard.html',
        'login.html', 
        'signup.html',
        'README.md',
        'TESTING_GUIDE.md',
        'FINAL_TESTING_INSTRUCTIONS.md',
        'SYSTEM_READY_INDEX1.md',
        'test_complete_flow.py',
        'simple_test.py'
    ]
    
    base_path = 'c:/Users/asus/Documents/NextBloom'
    issues_found = False
    
    for filename in files_to_check:
        filepath = os.path.join(base_path, filename)
        if os.path.exists(filepath):
            has_index1 = check_file_for_index1_html(filepath)
            if has_index1:
                issues_found = True
                print(f"[X] {filename} - Still has index1.html references")
            else:
                print(f"[OK] {filename} - Clean")
        else:
            print(f"[!] {filename} - File not found")
    
    print("\n" + "=" * 40)
    if not issues_found:
        print("SUCCESS: All files updated to use index.html!")
        
        # Check if index.html exists
        index_path = os.path.join(base_path, 'index.html')
        if os.path.exists(index_path):
            print("index.html file exists - Ready to use!")
        else:
            print("WARNING: index.html file not found!")
    else:
        print("ERROR: Some files still have index1.html references")

if __name__ == "__main__":
    main()