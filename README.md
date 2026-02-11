# ResumeIQ - AI Resume Analyzer

A complete full-stack AI-powered resume analyzer featuring ATS scoring, ChatGPT integration, and a modern glassmorphism UI.

![ResumeIQ](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![Node.js](https://img.shields.io/badge/Node.js-Express-green)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user registration and login
- 📄 **Resume Upload** - Support for PDF and DOCX files with drag-and-drop
- 🎯 **ATS Scoring Engine** - Deterministic scoring algorithm analyzing:
  - Keyword match (40%)
  - Section presence (25%)
  - Skill relevance (20%)
  - Formatting quality (15%)
- 🤖 **Google Gemini Analysis** - AI-powered feedback on:
  - Resume strengths
  - Areas for improvement
  - Role-specific recommendations
  - Content to remove
  - Optimization strategies
- 🎨 **Modern UI** - Glassmorphism design with white-blue theme
- 📊 **Visual Results** - Circular progress indicators, keyword badges, and detailed breakdowns

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS 3** - Utility-first styling with glassmorphism
- **Axios** - HTTP client for API requests

### Backend

- **Node.js + Express** - RESTful API server
- **Google Gemini API** - AI-powered resume analysis
- **bcrypt** - Password hashing
- **JWT** - Token-based authentication
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction

## 📁 Project Structure

```
resumeiq/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── analyze.js       # Resume analysis routes
│   ├── controllers/
│   │   ├── authController.js
│   │   └── analyzeController.js
│   ├── utils/
│   │   ├── openai.js        # ChatGPT integration
│   │   ├── atsScoring.js    # ATS scoring algorithm
│   │   └── textExtractor.js # PDF/DOCX text extraction
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── server.js            # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AnalysisResults.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   ├── tailwind.config.js
│   └── package.json
├── .env.example
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Clone or Navigate to Project Directory

```bash
cd resumeiq
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file from template
copy ..\.env.example .env
# OR on Mac/Linux:
# cp ../.env.example .env

# Edit .env and add your Google Gemini API key
# GEMINI_API_KEY=AIzaSy-your-actual-key-here
```

### 3. Frontend Setup

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Running the Application

You'll need **two terminal windows**:

**Terminal 1 - Backend Server:**

```bash
cd backend
npm start
# Server will run on http://localhost:5000
```

**Terminal 2 - Frontend Dev Server:**

```bash
cd frontend
npm start
# App will open at http://localhost:3000
```

### 5. Using the Application

1. **Register** - Create a new account with your email and password
2. **Login** - Access the dashboard
3. **Upload Resume** - Drag and drop your PDF or DOCX resume
4. **Select Job Details** - Choose your target job role and industry
5. **Analyze** - Click "Analyze Resume" to get results
6. **Review Feedback** - See your ATS score and AI-powered recommendations

## 🔑 Environment Variables

The `.env` file should contain:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
JWT_SECRET=your_jwt_secret_change_this
NODE_ENV=development
```

**Important:** The only variable you MUST manually configure is `GEMINI_API_KEY`.

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resume Analysis (Protected)

- `POST /api/analyze` - Analyze resume (requires JWT token)

### Health Check

- `GET /api/health` - Server status

## 🎨 UI Features

- **Glassmorphism Design** - Modern frosted glass effect
- **Gradient Backgrounds** - Purple to blue gradient
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Fade-ins and transitions
- **Loading States** - Visual feedback during processing
- **Error Handling** - Clear error messages

## 🧪 Testing the Application

### Sample Resumes

1. Create a test PDF or DOCX resume
2. Include sections: Contact, Experience, Education, Skills
3. Add relevant keywords for your chosen job role

### Test Flow

1. Register with: `test@example.com` / `password123`
2. Upload your test resume
3. Select: "Software Engineer" + "Technology"
4. Analyze and review results

## 🔒 Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Protected routes require authentication
- File upload limited to 5MB
- Only PDF and DOCX files accepted

## ⚠️ Production Considerations

This is a demonstration application. For production use:

1. **Database** - Replace in-memory user storage with MongoDB/PostgreSQL
2. **File Storage** - Add permanent resume storage (AWS S3, etc.)
3. **Environment** - Use secure JWT secrets and environment-specific configs
4. **Rate Limiting** - Add API rate limiting
5. **Validation** - Enhanced input validation and sanitization
6. **HTTPS** - Use SSL certificates
7. **Error Logging** - Implement proper logging (Winston, etc.)

## 🐛 Troubleshooting

### Backend won't start

- Check if port 5000 is available
- Ensure all dependencies are installed: `npm install`
- Verify `.env` file exists with valid OpenAI API key

### Frontend won't start

- Check if port 3000 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Gemini API errors

- Verify API key is correct and valid
- Check Google AI Studio for API key status
- Review backend console for detailed error messages

### File upload fails

- Ensure file is PDF or DOCX format
- Check file size is under 5MB
- Verify backend server is running

## 📝 License

MIT License - Feel free to use this project for learning and development.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs!

## 📧 Support

For issues or questions, please check the troubleshooting section above.

---

**Built with ❤️ using React, Node.js, and Google Gemini**
