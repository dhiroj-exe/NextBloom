# NextBloom - AI-Powered Dropout Recovery Platform

A comprehensive educational platform designed to help students get back on track with their learning journey using AI-powered assistance.

## 🚀 Features

- **User Authentication**: Secure signup and login system
- **Responsive Design**: Works on desktop and mobile devices
- **Dashboard**: Personalized user dashboard with progress tracking
- **AI Integration Ready**: Built to integrate with AI learning assistants
- **Modern UI**: Beautiful, modern interface with smooth animations

## 📁 Project Structure

```
NextBloom/
├── index.html              # Homepage
├── login.html              # Login page
├── signup.html             # Signup page
├── dashboard.html          # User dashboard
├── nextbloom-backend/     # Backend API
│   ├── app.py             # Flask application
│   ├── routes/            # API routes
│   │   └── auth_routes.py # Authentication routes
│   ├── models/            # Data models
│   │   ├── user_model.py  # User data handling
│   │   └── users.json     # User data storage
│   └── requirements.txt   # Python dependencies
├── test_auth.py           # Authentication testing script
└── README.md              # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.7 or higher
- Modern web browser

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd nextbloom-backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask server:**
   ```bash
   python app.py
   ```

   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Open the project in a web browser:**
   - Open `index.html` in your web browser
   - Or use a local server like Live Server in VS Code

## 🔧 Usage

### For Users

1. **Visit the Homepage**: Open `index.html` in your browser
2. **Sign Up**: Click "Get Started" to create a new account
3. **Login**: Use your credentials to log in
4. **Dashboard**: Access your personalized dashboard after login

### For Developers

1. **Test the Authentication System:**
   ```bash
   python test_auth.py
   ```

2. **API Endpoints:**
   - `POST /api/auth/signup` - Create new user account
   - `POST /api/auth/login` - User login
   - `POST /api/auth/verify` - Verify user authentication

## 🔐 Authentication Flow

1. **Signup Process:**
   - User fills signup form
   - Password is hashed using bcrypt
   - User data stored in JSON file
   - Success message displayed

2. **Login Process:**
   - User enters credentials
   - Server validates email and password
   - JWT-like session created (localStorage)
   - User redirected to dashboard

3. **Session Management:**
   - User email stored in localStorage
   - Authentication checked on protected pages
   - Logout clears session data

## 📊 Data Storage

Currently using JSON file storage for simplicity:
- **File**: `nextbloom-backend/models/users.json`
- **Format**: Array of user objects with email and hashed password
- **Security**: Passwords are hashed using bcrypt

### Upgrading to MongoDB (Optional)

To use MongoDB instead of JSON files:

1. **Install MongoDB** or create a **MongoDB Atlas** account
2. **Update** `nextbloom-backend/models/user_model.py`
3. **Set environment variables** in `.env` file:
   ```
   MONGO_URI=your_mongodb_connection_string
   ```

## 🎨 Customization

### Styling
- Uses **Tailwind CSS** for styling
- Custom animations and effects in `index.html`
- Responsive design for all screen sizes

### Colors
- Primary: Purple to Blue gradient
- Secondary: Indigo tones
- Success: Green
- Error: Red

## 🧪 Testing

Run the authentication test suite:
```bash
python test_auth.py
```

This will test:
- User signup functionality
- User login with valid credentials
- Login rejection with invalid credentials

## 🚀 Deployment

### Local Development
1. Start the Flask backend: `python app.py`
2. Open `index.html` in a web browser

### Production Deployment
1. **Backend**: Deploy Flask app to services like Heroku, Railway, or DigitalOcean
2. **Frontend**: Deploy static files to Netlify, Vercel, or GitHub Pages
3. **Database**: Use MongoDB Atlas for production database

## 🔒 Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error handling and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Server won't start:**
   - Check if Python dependencies are installed
   - Ensure port 5000 is not in use

2. **Login not working:**
   - Verify backend server is running
   - Check browser console for errors
   - Ensure CORS is properly configured

3. **Users not saving:**
   - Check file permissions for `users.json`
   - Verify backend directory structure

### Getting Help

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Check the Flask server logs for backend errors
3. Run the test script to verify system functionality
4. Ensure all dependencies are properly installed

## 🎯 Future Enhancements

- [ ] AI-powered learning recommendations
- [ ] Progress tracking and analytics
- [ ] Course management system
- [ ] Real-time chat support
- [ ] Mobile app development
- [ ] Advanced user profiles
- [ ] Integration with external learning platforms

---

**Built with ❤️ for educational empowerment**