# NextBloom Setup Guide

## Quick Start

### 1. Install Dependencies

Choose one of the following options:

#### Option A: Minimal Installation (Recommended for basic usage)
```bash
pip install -r requirements-minimal.txt
```

#### Option B: Full Installation (All features)
```bash
pip install -r requirements.txt
```

#### Option C: Development Installation (For contributors)
```bash
pip install -r requirements-dev.txt
```

### 2. Start the Backend Server

#### Method 1: Using the start script (Recommended)
```bash
python start_backend.py
```

#### Method 2: Manual start
```bash
cd nextbloom-backend
python app.py
```

### 3. Open the Application
Open `index.html` in your web browser or serve it using a local server:

```bash
# Using Python's built-in server
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

## Testing

### Test Authentication System
```bash
python test_auth.py
```

### Test Enhanced Signup
```bash
python test_new_signup.py
```

### Verify File References
```bash
python simple_verify.py
```

## Project Structure

```
NextBloom/
├── index.html                     # Main application page
├── requirements.txt               # Full dependencies
├── requirements-minimal.txt       # Essential dependencies only
├── requirements-dev.txt          # Development dependencies
├── start_backend.py              # Backend startup script
├── nextbloom-backend/            # Backend API
│   ├── app.py                    # Flask application
│   ├── requirements.txt          # Backend-specific requirements
│   ├── routes/                   # API routes
│   └── models/                   # Data models
├── test_*.py                     # Test scripts
└── *.html                        # Frontend pages
```

## Dependencies Explained

### Core Dependencies (requirements-minimal.txt)
- **flask**: Web framework for the backend API
- **flask-cors**: Cross-Origin Resource Sharing support
- **flask-bcrypt**: Password hashing and authentication
- **python-dotenv**: Environment variable management
- **pymongo**: MongoDB driver (for future database integration)
- **requests**: HTTP library for API calls and testing
- **typing-extensions**: Type hints support

### Additional Features (requirements.txt)
- **pytest**: Testing framework
- **openai**: OpenAI API integration (commented out)
- **speechrecognition**: Voice input processing (commented out)
- **nltk**: Natural language processing (commented out)
- And more optional features...

### Development Tools (requirements-dev.txt)
- **pytest**: Testing framework with coverage
- **black**: Code formatting
- **flake8**: Code linting
- **sphinx**: Documentation generation

## Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   - Change the port in `nextbloom-backend/app.py`
   - Or kill the process using port 5000

2. **Module not found errors**
   - Make sure you've installed the requirements: `pip install -r requirements-minimal.txt`
   - Check that you're in the correct directory

3. **CORS errors in browser**
   - Ensure the backend server is running
   - Check that flask-cors is installed

4. **Authentication not working**
   - Run the test scripts to verify: `python test_auth.py`
   - Check that the backend server is accessible at http://localhost:5000

### Getting Help

1. Check the console for error messages
2. Run the test scripts to identify issues
3. Ensure all dependencies are installed
4. Verify the backend server is running

## Development

### Adding New Dependencies

1. Add to the appropriate requirements file
2. Install: `pip install package_name`
3. Test the application
4. Update this documentation

### Running Tests

```bash
# Test authentication
python test_auth.py

# Test enhanced signup
python test_new_signup.py

# Run all pytest tests (if using requirements-dev.txt)
pytest
```

## Production Deployment

For production deployment, consider:

1. Using a production WSGI server (gunicorn, waitress)
2. Setting up environment variables
3. Using a proper database (MongoDB, PostgreSQL)
4. Implementing proper logging
5. Setting up SSL/HTTPS

Example production requirements would include:
```
gunicorn>=21.2.0
python-decouple>=3.8
```

## License

This project is part of the NextBloom AI-Powered Dropout Recovery Platform.