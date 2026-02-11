# QUICK START GUIDE - ResumeIQ

## ⚡ One-Time Setup (5 minutes)

### Step 1: Enable PowerShell Scripts (REQUIRED)

Your system has PowerShell script execution disabled. Run this ONCE in PowerShell as Administrator:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**OR** use Command Prompt (CMD) instead of PowerShell for all commands below.

---

### Step 2: Install Backend Dependencies

Open Terminal/CMD in the `backend` folder:

```bash
cd backend
npm install
```

This will install:

- express, cors, dotenv
- bcrypt, jsonwebtoken
- multer, pdf-parse, mammoth
- openai

---

### Step 3: Configure Google Gemini API Key

1. Copy `.env.example` to `backend/.env`:

   ```bash
   copy .env.example backend\.env
   ```

   OR manually create `backend/.env` file

2. Get your Google Gemini API key from: https://makersuite.google.com/app/apikey

3. Edit `backend/.env` and replace:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   with your actual key:
   ```
   GEMINI_API_KEY=AIzaSy-xxxxxxxxxxxxx
   ```

---

### Step 4: Install Frontend Dependencies

Open Terminal/CMD in the `frontend` folder:

```bash
cd frontend
npm install
```

This will install:

- react, react-dom, react-router-dom
- react-scripts
- tailwindcss, postcss, autoprefixer
- axios

---

## 🚀 Running the Application

### You need TWO terminals running simultaneously:

**Terminal 1 - Backend (Port 5000):**

```bash
cd backend
npm start
```

You should see:

```
✅ Server running on port 5000
📍 Health check: http://localhost:5000/api/health
```

**Terminal 2 - Frontend (Port 3000):**

```bash
cd frontend
npm start
```

Browser will automatically open to: http://localhost:3000

---

## ✅ First Time Usage

1. **Register** - Create account (email + password)
2. **Login** - Access dashboard
3. **Upload Resume** - PDF or DOCX file
4. **Select Job Role** - e.g., "Software Engineer"
5. **Select Industry** - e.g., "Technology"
6. **Analyze** - Get ATS score + AI feedback

---

## 🔧 Troubleshooting

### PowerShell Script Error

**Error:** "running scripts is disabled on this system"
**Fix:** Run as Administrator:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use

**Error:** "Port 5000 is already in use"
**Fix:** Change port in `backend/.env`:

```
PORT=5001
```

### Gemini API Error

**Error:** "Invalid API key" or API errors
**Fix:**

- Verify API key is correct in `backend/.env`
- Check Google AI Studio: https://makersuite.google.com/app/apikey

### Dependencies Installation Fails

**Fix:** Delete `node_modules` and try again:

```bash
rmdir /s /q node_modules
npm install
```

---

## 📝 Quick Commands Reference

### Backend

```bash
cd backend
npm install          # Install dependencies
npm start            # Start server (port 5000)
```

### Frontend

```bash
cd frontend
npm install          # Install dependencies
npm start            # Start dev server (port 3000)
npm run build        # Build for production
```

---

## 🎯 What's Next?

Once both servers are running:

1. Go to http://localhost:3000
2. Create an account
3. Upload a resume and analyze it!

The application is now fully functional and ready to use! 🎉
