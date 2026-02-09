# 🏗️ Clean Project Structure - Knowlzastro

## 📁 Folder Structure

```
webstone/
├── frontend/                    # Frontend application (HTML, CSS, JS)
│   ├── index.html              # Main UI (based on final-desktop.html)
│   └── assets/
│       ├── js/                 # JavaScript files
│       │   ├── api-client.js   # Frontend API client (calls backend)
│       │   ├── astrology-api-client.js  # Astrology API wrapper
│       │   ├── config.js       # API configuration
│       │   ├── kundli-engine.js # Kundli chart renderer
│       │   ├── geolocation-enhanced.js  # Location database
│       │   └── error-handler.js # Error handling
│       ├── css/                # Stylesheets
│       │   ├── unified-buttons.css
│       │   ├── dialog-modals.css
│       │   ├── card-system.css
│       │   └── navbars.css
│       └── images/             # Images and icons
│
├── backend/                    # Backend API server (Node.js Express)
│   ├── server.js              # Main server file
│   ├── package.json           # Dependencies
│   ├── .env.example          # Environment variables template
│   └── .env                  # Your actual API keys (not in git)
│
├── legacy/                     # Original files (unchanged)
│   └── final-desktop.html    # Original file preserved
│
└── [other files...]          # Existing files remain
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your API keys:
#   OPENAI_API_KEY=sk-...
#   ASTRO_API_KEY=...
#   ASTRO_USER_ID=...
npm start
```

Backend will run on `http://localhost:4000`

### 2. Frontend Setup

```bash
# Option 1: Simple HTTP server (Python)
cd frontend
python -m http.server 8000

# Option 2: Node.js http-server
npx http-server frontend -p 8000

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Frontend will run on `http://localhost:8000`

---

## 🔧 Backend API Endpoints

### POST `/api/openai`
**Purpose**: Chat/AI responses using OpenAI

**Request:**
```json
{
  "message": "What is my horoscope?",
  "messages": null,  // Optional conversation history
  "model": "gpt-4o-mini"  // Optional, defaults to gpt-4o-mini
}
```

**Response:**
```json
{
  "success": true,
  "response": "Based on your birth chart...",
  "model": "gpt-4o-mini",
  "usage": {...}
}
```

### POST `/api/astrology`
**Purpose**: Generate birth chart from astrology API

**Request:**
```json
{
  "dob": "1990-01-15",  // YYYY-MM-DD
  "tob": "10:30",       // HH:MM (24-hour)
  "lat": 19.0760,       // Latitude
  "lon": 72.8777,       // Longitude
  "tz": "Asia/Kolkata"  // Optional timezone
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "planets": [
      {"name": "Sun", "longitude": 285.5, ...},
      ...
    ],
    "ascendant_long": 120.5,
    "houses": {...},
    "raw": {...}
  }
}
```

### GET `/api/health`
**Purpose**: Health check

**Response:**
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

---

## 🔌 Frontend to Backend Integration

### How It Works

1. **Frontend** (`frontend/index.html`) loads `assets/js/api-client.js`
2. **api-client.js** makes `fetch()` calls to `http://localhost:4000/api/*`
3. **Backend** (`backend/server.js`) receives requests, calls external APIs (OpenAI, AstrologyAPI.com)
4. **Backend** returns responses to frontend
5. **Frontend** displays results in UI

### Example: Chat Message

```javascript
// In frontend/index.html or frontend/assets/js/app.js
const response = await window.APIClient.callOpenAI("What is my horoscope?");
console.log(response); // "Based on your birth chart..."
```

### Example: Birth Chart

```javascript
// In frontend/index.html or frontend/assets/js/app.js
const chartData = await window.AstroClient.fetchBirthChart({
  dob: "1990-01-15",
  tob: "10:30",
  lat: 19.0760,
  lon: 72.8777,
  tz: "Asia/Kolkata"
});
console.log(chartData.planets); // Array of planets
```

---

## 🔐 Security

- ✅ **API keys are stored in `backend/.env`** (never exposed to frontend)
- ✅ **Backend handles all external API calls** (OpenAI, AstrologyAPI.com)
- ✅ **CORS is enabled** for `localhost` development
- ✅ **Frontend only calls backend**, never external APIs directly

---

## 📝 Environment Variables

Create `backend/.env`:

```env
PORT=4000

# OpenAI
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini

# Astrology API (AstrologyAPI.com)
ASTRO_API_KEY=your-api-key-here
ASTRO_USER_ID=your-user-id-here
ASTRO_PROVIDER_URL=https://json.astrologyapi.com/v1/birth_details

# Default timezone
DEFAULT_TIMEZONE=Asia/Kolkata
```

---

## 🎨 Design Preservation

- ✅ **All CSS and styling preserved** from `final-desktop.html`
- ✅ **All HTML structure unchanged**
- ✅ **All visual elements intact**
- ✅ **Only JavaScript logic updated** to call backend APIs

---

## 📦 What Was Changed

### Files Created:
- `frontend/index.html` - Clean frontend (based on final-desktop.html)
- `frontend/assets/js/api-client.js` - New API client
- `backend/server.js` - New backend server
- `backend/package.json` - Backend dependencies
- `backend/.env.example` - Environment template

### Files Moved:
- `js/*.js` → `frontend/assets/js/` (essential files only)
- `css/*.css` → `frontend/assets/css/`
- `final-desktop.html` → `legacy/final-desktop.html` (backup)

### Files Updated:
- `frontend/assets/js/astrology-api-client.js` - Updated to use `/api/astrology`
- `frontend/assets/js/api-client.js` - New file for OpenAI calls

---

## 🧪 Testing

1. Start backend: `cd backend && npm start`
2. Open frontend: `http://localhost:8000` (or your server)
3. Open browser console (F12)
4. Create profile → Should call `/api/astrology`
5. Send chat message → Should call `/api/openai`
6. Check console for API calls and responses

---

## 🐛 Troubleshooting

### Backend not responding
- Check if backend is running: `curl http://localhost:4000/api/health`
- Check `backend/.env` has correct API keys
- Check backend console for errors

### Frontend can't connect
- Check CORS is enabled in `backend/server.js`
- Check backend URL in `frontend/assets/js/api-client.js`
- Check browser console for network errors

### API keys not working
- Verify keys in `backend/.env`
- Check backend console for authentication errors
- Test keys directly with API providers

---

## 📚 Next Steps

1. Add your API keys to `backend/.env`
2. Start backend: `cd backend && npm start`
3. Open `frontend/index.html` in browser
4. Test profile creation and chat
5. Deploy backend to production (update frontend API URLs)
6. Deploy frontend to static hosting

---

**Status**: ✅ Clean structure ready for development and deployment

