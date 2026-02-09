# 🔑 API Key Setup Guide - Knowlzastro

## Overview

This guide explains how to configure API keys after purchasing them. Your app supports multiple APIs:

1. **OpenAI API** - For AI-powered chat responses
2. **VedAstro API** - For astrology calculations (optional)
3. **Vedic Horoscope API** - For Nakshatra and planetary calculations (optional)
4. **Backend API** - Your own backend server (optional)

---

## 📋 Step-by-Step Setup

### Step 1: Create `.env` File

Create a `.env` file in your project root directory (`D:\webstone\.env`):

```env
# ============================================
# API KEYS - ADD YOUR KEYS HERE
# ============================================

# OpenAI API Key (Required for AI Chat)
OPENAI_API_KEY=sk-your-openai-api-key-here

# OpenAI Model (Optional - defaults to gpt-4-turbo-preview)
OPENAI_MODEL=gpt-4-turbo-preview

# VedAstro API Key (Optional - for enhanced astrology calculations)
VEDASTRO_API_KEY=your-vedastro-api-key-here
VEDASTRO_API_URL=https://api.vedastro.org

# Vedic Horoscope API (Optional - for accurate Nakshatra calculations)
VEDIC_API_KEY=your-vedic-api-key-here
VEDIC_API_URL=https://api.vedicastrology.com

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=4000
NODE_ENV=production

# MongoDB Connection (Required if using backend)
MONGODB_URI=mongodb://localhost:27017/astrology_app

# Redis Connection (Optional - for caching)
REDIS_URL=redis://localhost:6379

# JWT Secret (Required for authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (Required for CORS)
FRONTEND_URL=https://your-domain.com

# ============================================
# PAYMENT CONFIGURATION (Optional)
# ============================================
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# ============================================
# EMAIL CONFIGURATION (Optional)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
```

---

## 🔐 Step 2: Get Your API Keys

### A. OpenAI API Key (Required for AI Chat)

1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-`)
5. Add to `.env`: `OPENAI_API_KEY=sk-your-key-here`

**Pricing**: Pay-per-use (approximately $0.01-0.10 per chat request)

---

### B. VedAstro API Key (Optional)

1. Go to: https://vedastro.org/
2. Sign up for API access
3. Get your API key from dashboard
4. Add to `.env`: `VEDASTRO_API_KEY=your-key-here`

**Pricing**: Check VedAstro.org for pricing

---

### C. Vedic Horoscope API (Optional)

If using a third-party Vedic API:
1. Register with the API provider
2. Get your API key
3. Add to `.env`: `VEDIC_API_KEY=your-key-here`
4. Update API URL: `VEDIC_API_URL=https://api.provider.com`

---

## ⚙️ Step 3: Configure Backend Server

### Option A: Using Your Own Backend (Recommended)

1. **Update `server.js`** - Already configured to read from `.env`
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the backend server**:
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

4. **Verify API is running**:
   - Open: http://localhost:4000/api/health
   - Should return: `{"status":"ok",...}`

---

### Option B: Frontend-Only (No Backend)

If you don't want to run a backend server, configure API keys directly in the HTML file:

**Edit `final desktop.html`** around line 3031:

```javascript
// OpenAI Configuration (for direct frontend use)
const OPENAI_API_KEY = 'sk-your-openai-api-key-here';
const OPENAI_ENABLED = true;

// Vedic API Configuration
const VEDIC_API_URL = 'https://your-vedic-api.com/api';
const VEDIC_API_KEY = 'your-vedic-api-key';
const VEDIC_API_ENABLED = true;
```

⚠️ **WARNING**: Never expose API keys in frontend code for production! Use backend for security.

---

## 🧪 Step 4: Test API Integration

### Test OpenAI API

1. **Open browser console** (F12)
2. **Run this test**:
   ```javascript
   // Test OpenAI connection
   fetch('http://localhost:4000/api/ai/test', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ message: 'Hello, test message' })
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error);
   ```

### Test Backend API

1. **Open**: http://localhost:4000/api/health
2. **Should see**: `{"status":"ok",...}`

### Test Chat with API

1. Open your app: `final desktop.html`
2. Open chat box
3. Send a message
4. Check browser console for API calls
5. If working, you'll see AI responses

---

## 🎯 How It Works After Setup

### 1. **AI Chat** (OpenAI API)

When a user sends a message:
```
User Message → Backend API → OpenAI API → Response → User
```

**Flow**:
- User types message in chat
- Frontend sends to `/api/ai/chat`
- Backend uses OpenAI API key from `.env`
- OpenAI processes request
- Response sent back to user

**Cost**: ~$0.01-0.10 per message

---

### 2. **Astrology Calculations** (VedAstro/Vedic API)

When generating a Kundli:
```
Birth Details → Backend API → VedAstro/Vedic API → Chart Data → Display
```

**Flow**:
- User provides birth details
- Backend calls VedAstro API (if configured)
- Chart calculations returned
- Chart displayed on page

**Cost**: Varies by provider

---

### 3. **Local Fallback**

If API fails or not configured:
- App uses local calculations
- Basic chart rendering
- Local AI responses (simplified)

---

## 🔒 Security Best Practices

### ✅ DO:

1. **Keep `.env` file secret** - Never commit to Git
2. **Use environment variables** - Always use `.env` for keys
3. **Restrict API keys** - Set usage limits on OpenAI dashboard
4. **Use backend for keys** - Never expose keys in frontend
5. **Rotate keys regularly** - Change keys every 3-6 months

### ❌ DON'T:

1. **Commit `.env` to Git** - Add to `.gitignore`
2. **Share API keys** - Keep them private
3. **Use same key everywhere** - Create separate keys per environment
4. **Log API keys** - Never log or print keys in console

---

## 📝 Update `.gitignore`

Make sure `.env` is in `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.production

# API keys
*.key
*.pem
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All API keys added to `.env`
- [ ] `.env` file in `.gitignore`
- [ ] Backend server running
- [ ] MongoDB connected
- [ ] Redis connected (optional)
- [ ] API health check passing
- [ ] Test chat working
- [ ] Test chart generation working
- [ ] Rate limiting configured
- [ ] CORS configured correctly
- [ ] HTTPS enabled (for production)

---

## 🆘 Troubleshooting

### Problem: "API key not found"

**Solution**: Check `.env` file exists and key is correct
```bash
# Verify .env file
cat .env | grep OPENAI_API_KEY
```

---

### Problem: "API request failed"

**Solution**: Check API key is valid
```javascript
// Test in Node.js console
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// Should not throw error
```

---

### Problem: "CORS error"

**Solution**: Update `FRONTEND_URL` in `.env`
```env
FRONTEND_URL=https://your-domain.com
```

---

### Problem: "MongoDB connection failed"

**Solution**: Check MongoDB is running and `MONGODB_URI` is correct
```bash
# Check MongoDB
mongosh
# or
mongo
```

---

## 📞 Support

If you need help:
1. Check API provider documentation
2. Verify `.env` file format
3. Check server logs: `npm run dev`
4. Test API endpoints manually

---

## 💰 Cost Estimation

### OpenAI API Costs:
- **GPT-4 Turbo**: ~$0.01 per 1K tokens
- **Average chat**: 500-2000 tokens = $0.005-$0.02 per message
- **1000 messages**: ~$5-$20/month

### Other APIs:
- Check individual provider pricing
- Most have free tiers for testing

---

## ✅ Quick Start Commands

```bash
# 1. Create .env file
cp .env.example .env

# 2. Edit .env and add your API keys
notepad .env  # Windows
nano .env     # Linux/Mac

# 3. Install dependencies
npm install

# 4. Start backend server
npm start

# 5. Open frontend
# Open final desktop.html in browser

# 6. Test
# Send a message in chat - should use OpenAI API
```

---

## 📚 Additional Resources

- **OpenAI API Docs**: https://platform.openai.com/docs
- **VedAstro Docs**: https://vedastro.org/docs
- **Node.js Environment Variables**: https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs

---

**Last Updated**: 2024-11-18
**Version**: 1.0

