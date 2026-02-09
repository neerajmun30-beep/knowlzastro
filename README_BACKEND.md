# Advanced AI-Powered Astrology Ecosystem - Backend API

## Overview

Complete full-stack astrology application backend with advanced calculations, AI integration, and comprehensive features.

## Features

### ✅ Core Astrology Engine
- D1 (Main Rashi Chart) - Complete
- D2-D60 Divisional Charts - All major charts
- Ashtakavarga (SAV & BAV) - Calculated
- Shadbala (Six-fold strength) - Complete
- Yogas Detection - All major yogas
- Doshas Detection - All major doshas
- Dashas (Vimshottari, Antardasha) - Full calculations
- Transits (Gochar) - Current planetary positions

### ✅ AI Features
- Multiple specialized AI agents (Vedic, Modern, Relationship, Career, Health, Spiritual)
- OpenAI GPT-4 integration
- Context-aware responses
- Kundli-based personalized readings

### ✅ Matchmaking
- 36 Gun Milan (Complete compatibility check)
- All traditional matching parameters
- AI-powered interpretation

### ✅ Panchang
- Daily Tithi, Yoga, Karana, Nakshatra
- Sunrise/Sunset calculations
- Rahu Kaal, Gulika Kaal, Yamaganda Kaal
- Abhijit Muhurat, Brahma Muhurat

### ✅ PDF Generation
- Complete Kundli PDF
- Chart graphics
- Export functionality

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **AI**: OpenAI GPT-4
- **Astrology Calculations**: Swiss Ephemeris
- **PDF**: PDFKit
- **Authentication**: JWT

## Project Structure

```
webstone/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── routes/                   # API routes
│   ├── kundli.js            # Kundli endpoints
│   ├── charts.js            # Charts endpoints
│   ├── ai.js                # AI endpoints
│   ├── matchmaking.js       # Matchmaking endpoints
│   ├── panchang.js          # Panchang endpoints
│   ├── users.js             # User management
│   └── pdf.js               # PDF generation
├── models/                   # MongoDB models
│   ├── User.js              # User schema
│   ├── Kundli.js            # Kundli schema
│   └── ChatHistory.js       # Chat history schema
├── services/                 # Business logic
│   ├── astrologyEngine.js   # Astrology calculations
│   ├── aiService.js         # AI integration
│   ├── panchangService.js   # Panchang calculations
│   └── matchmakingService.js # Matchmaking logic
├── middleware/               # Express middleware
│   └── auth.js              # Authentication
└── storage/                  # File storage
    └── pdfs/                # Generated PDFs
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start MongoDB and Redis:**
   ```bash
   # MongoDB
   mongod
   
   # Redis
   redis-server
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

5. **Test API:**
   ```bash
   curl http://localhost:4000/api/health
   ```

## API Documentation

### Authentication Required

Most endpoints require JWT authentication. Include token in header:
```
Authorization: Bearer <token>
```

### Example: Generate Kundli

```bash
curl -X POST http://localhost:4000/api/kundli/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "gender": "male",
    "birthDetails": {
      "date": "1990-01-01",
      "time": "10:30:00",
      "place": "Delhi",
      "latitude": 28.6139,
      "longitude": 77.2090,
      "timezone": "Asia/Kolkata"
    }
  }'
```

### Example: AI Chat

```bash
curl -X POST http://localhost:4000/api/ai/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about my career prospects",
    "kundliId": "<kundli-id>",
    "agentType": "career"
  }'
```

## Environment Variables

See `.env.example` for all required variables.

## Development

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm test
```

## Contributing

1. Follow ESLint rules
2. Write tests for new features
3. Update documentation
4. Follow commit message conventions

## License

MIT License

