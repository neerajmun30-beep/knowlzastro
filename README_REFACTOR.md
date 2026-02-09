# 🏗️ Project Refactor - Complete Guide

## ✅ What Was Done

### 1. Created Clean Project Structure
```
frontend/          - Frontend application
backend/           - Backend API server
legacy/            - Original files (backup)
```

### 2. Backend (Node.js Express)
**Why Node.js?**
- Your existing backend is already in Node.js
- Express is simpler and more common
- Better for real-time features
- Easy integration with existing codebase

**Files Created:**
- `backend/server.js` - Main server with `/api/openai` and `/api/astrology`
- `backend/package.json` - Minimal dependencies
- `backend/.env.example` - Environment template

### 3. Frontend Extraction
**Files Created:**
- `frontend/index.html` - Clean frontend (to be created from final-desktop.html)
- `frontend/assets/js/api-client.js` - New API client for backend calls
- `frontend/assets/js/*` - Essential JS files copied
- `frontend/assets/css/*` - CSS files copied

### 4. API Integration
- Frontend calls `POST /api/openai` for chat
- Frontend calls `POST /api/astrology` for birth charts
- All API keys stored in backend (never exposed)

---

## 📋 Next Steps (For You)

### Step 1: Create `frontend/index.html`
Copy `final-desktop.html` and update:
1. Change script paths: `js/config.js` → `assets/js/config.js`
2. Change CSS paths: `css/unified-buttons.css` → `assets/css/unified-buttons.css`
3. Update API calls to use new backend endpoints
4. Remove duplicate scripts/styles (keep all features)

### Step 2: Update API Calls in Frontend
In `frontend/index.html`, find `sendMessage()` and update:

**Before:**
```javascript
const chatResponse = await window.AstroClient.chatProxy(...);
```

**After:**
```javascript
const response = await window.APIClient.callOpenAI(message);
```

### Step 3: Update Profile Creation
In `createProfileFromChat()`, ensure it uses:

```javascript
const chartData = await window.AstroClient.fetchBirthChart({
  dob: apiDob,
  tob: tob,
  lat: coords.lat,
  lon: coords.lon,
  tz: coords.tz
});
```

This already calls `/api/astrology` via `astrology-api-client.js`.

---

## 🔧 Files to Update

### `frontend/index.html`
1. Update all `<script src="js/...">` to `<script src="assets/js/...">`
2. Update all `<link href="css/...">` to `<link href="assets/css/...">`
3. Update `sendMessage()` to use `window.APIClient.callOpenAI()`
4. Keep all CSS and HTML structure exactly the same

### `frontend/assets/js/astrology-api-client.js`
✅ Already updated to use `/api/astrology`

### `frontend/assets/js/api-client.js`
✅ Already created with `callOpenAI()` function

---

## 🚀 How to Run

### Backend:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm start
```

### Frontend:
```bash
cd frontend
# Use any HTTP server:
python -m http.server 8000
# OR
npx http-server -p 8000
# OR
# Open index.html with Live Server extension
```

---

## 📝 Summary

✅ **Backend created** - Node.js Express with `/api/openai` and `/api/astrology`
✅ **Frontend structure created** - `frontend/assets/` with JS and CSS
✅ **API client created** - `frontend/assets/js/api-client.js`
✅ **Original file backed up** - `legacy/final-desktop.html`
✅ **Documentation created** - `PROJECT_STRUCTURE.md` and this file

**Remaining:**
- Create `frontend/index.html` from `final-desktop.html` (update paths)
- Test API integration
- Deploy to production

---

**Status**: ✅ Backend and structure ready, frontend extraction pending

