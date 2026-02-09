# 📋 Mandatory Files for Working Web App

## ✅ Active Files (Use These)

### Frontend Application
```
frontend/
├── index.html                    ← MAIN APP FILE (Use this!)
├── assets/
│   ├── js/
│   │   ├── api-client.js         ← Calls /api/openai
│   │   ├── astrology-api-client.js ← Calls /api/astrology
│   │   ├── config.js             ← API configuration
│   │   ├── kundli-engine.js      ← Kundli chart renderer
│   │   ├── geolocation-enhanced.js ← Location database
│   │   └── error-handler.js      ← Error handling
│   └── css/
│       ├── unified-buttons.css
│       ├── dialog-modals.css
│       ├── card-system.css
│       └── navbars.css
```

### Backend API Server
```
backend/
├── server.js                     ← MAIN SERVER (Use this!)
├── package.json                  ← Dependencies
└── .env.example                  ← Environment template
```

---

## 🗑️ Files Moved to Legacy (Don't Use)

### Duplicate HTML Files
- ❌ `legacy/final-desktop-duplicate.html` - Use `frontend/index.html` instead
- ❌ `legacy/final-mobile-app-duplicate.html` - Use `frontend/index.html` (responsive)
- ❌ `legacy/Desktop-old.html` - Old version
- ❌ `legacy/mobile-app-old.html` - Old version

### Duplicate Server Files
- ❌ `legacy/server-old.js` - Use `backend/server.js` instead

### Backup Files
- ✅ `legacy/final-desktop.html` - Original backup (keep for reference)

---

## 📁 Other Files (Still Referenced)

### Root JS/CSS (Kept for Other Files)
- ✅ `js/*.js` - Still referenced by `pages/*.html` and other files
- ✅ `css/*.css` - Still referenced by other files

**Note**: These are kept because other files in the project still reference them. The main app (`frontend/index.html`) uses `frontend/assets/js/` and `frontend/assets/css/` instead.

---

## 🎯 Quick Reference

### To Run the App:
1. **Backend**: `cd backend && npm start`
2. **Frontend**: Open `frontend/index.html` in browser

### To Develop:
- Edit `frontend/index.html` for UI changes
- Edit `backend/server.js` for API changes
- Edit `frontend/assets/js/*.js` for frontend logic

### Don't Edit:
- ❌ Any files in `legacy/` folder
- ❌ Old HTML files (if any remain in root)

---

## ✅ Cleanup Complete

- ✅ Duplicate files removed
- ✅ Mandatory files identified
- ✅ Project structure organized
- ✅ Ready for development

**Status**: ✅ **PROJECT CLEANED AND READY**

