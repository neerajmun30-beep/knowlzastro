/**
 * Backend Server - Node.js Express
 * 
 * Why Node.js Express?
 * - Your existing backend is already in Node.js (server/index.js)
 * - Express is simpler and more common for API servers
 * - Easy to integrate with existing codebase
 * - Better for real-time features (chat, streaming)
 * 
 * This is a minimal, production-ready backend that exposes:
 * - POST /api/openai - OpenAI chat endpoint
 * - POST /api/astrology - Astrology API endpoint
 */

require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
const UNIVERSAL_ASTRO_PROMPT = require('./universal-astrology-prompt');
const vedAstroService = require('./vedastro-service');

const app = express();

// Middleware
app.use(cors()); // Allow frontend to call backend
app.use(express.json({ limit: '10mb' })); // Parse JSON requests

const PORT = process.env.PORT || 4000;

/**
 * Utility: Safe JSON fetch with error handling
 */
async function safeFetchJson(url, opts) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    try {
      return { ok: res.ok, status: res.status, data: JSON.parse(text), rawText: text };
    } catch {
      return { ok: res.ok, status: res.status, data: null, rawText: text };
    }
  } catch (error) {
    return { ok: false, status: 0, data: null, rawText: error.message };
  }
}

/**
 * POST /api/openai
 * Chat endpoint using OpenAI API
 * 
 * Request body: { message: string, messages?: array, model?: string }
 * Response: { success: true, response: string }
 */
app.post('/api/openai', async (req, res) => {
  console.log('\n💬 ========== OPENAI API CALL RECEIVED ==========');
  console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { message, messages, model = 'gpt-4o-mini' } = req.body;
    
    // Validate input
    if (!message && (!messages || !Array.isArray(messages) || messages.length === 0)) {
      return res.status(400).json({
        success: false,
        error: 'Message or messages array is required'
      });
    }
    
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in .env file.'
      });
    }
    
    // Build messages array for OpenAI
    const openaiMessages = messages || [
      { role: 'system', content: UNIVERSAL_ASTRO_PROMPT },
      { role: 'user', content: message }
    ];
    
    console.log('📡 Calling OpenAI API...');
    const startTime = Date.now();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    const duration = Date.now() - startTime;
    console.log('📥 OpenAI response received in', duration + 'ms');
    console.log('📥 Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      return res.status(response.status).json({
        success: false,
        error: 'OpenAI API error',
        detail: errorText
      });
    }
    
    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No response generated';
    
    console.log('✅ OpenAI response generated:', aiResponse.substring(0, 100) + '...');
    
    return res.json({
      success: true,
      response: aiResponse,
      model: data.model,
      usage: data.usage
    });
    
  } catch (error) {
    console.error('❌ OpenAI endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      detail: error.message
    });
  }
});

/**
 * POST /api/astrology
 * Astrology API endpoint - calls external astrology provider
 * 
 * Request body: { dob: string, tob: string, lat: number, lon: number, tz?: string }
 * Response: { success: true, data: { planets: [...], ascendant_long: number, ... } }
 */
app.post('/api/astrology', async (req, res) => {
  console.log('\n🔮 ========== ASTROLOGY API CALL RECEIVED ==========');
  console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { dob, tob, lat, lon, tz } = req.body;
    
    // Validate input
    if (!dob || !tob || lat === undefined || lon === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: dob, tob, lat, lon are required'
      });
    }
    
    // Get API credentials from environment
    const ASTRO_API_KEY = process.env.ASTRO_API_KEY || process.env.ASTROLOGY_API_KEY || '';
    const ASTRO_USER_ID = process.env.ASTRO_USER_ID || process.env.ASTRO_APP_ID || '';
    const ASTRO_PROVIDER_URL = process.env.ASTRO_PROVIDER_URL || 'https://json.astrologyapi.com/v1/birth_details';
    
    if (!ASTRO_API_KEY) {
      console.error('❌ ASTRO_API_KEY not configured');
      return res.status(500).json({
        success: false,
        error: 'Astrology API key not configured. Please set ASTRO_API_KEY in .env file.'
      });
    }
    
    // Parse date format (handle DD/MM/YYYY or YYYY-MM-DD)
    let dateStr = dob;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    
    // Parse time format (handle 12-hour or 24-hour)
    let timeStr = tob;
    if (timeStr && (timeStr.includes('AM') || timeStr.includes('PM'))) {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':');
      let hour24 = parseInt(hours);
      if (period === 'PM' && hour24 !== 12) hour24 += 12;
      if (period === 'AM' && hour24 === 12) hour24 = 0;
      timeStr = `${hour24.toString().padStart(2, '0')}:${minutes}`;
    }
    
    // Build payload for AstrologyAPI.com
    const [year, month, day] = dateStr.split('-');
    const [hour, minute] = timeStr.split(':');
    
    const payload = {
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year),
      hour: parseInt(hour),
      minute: parseInt(minute || '0'),
      latitude: Number(lat),
      longitude: Number(lon),
      timezone: parseFloat((tz || 'Asia/Kolkata').replace('Asia/Kolkata', '5.5').replace(/[^0-9.-]/g, '')) || 5.5
    };
    
    // Setup authentication (Basic Auth for AstrologyAPI.com)
    const headers = { 'Content-Type': 'application/json' };
    
    let userId = ASTRO_USER_ID;
    let apiKey = ASTRO_API_KEY;
    
    // If API key contains colon, split into user_id:api_key
    if (ASTRO_API_KEY.includes(':')) {
      const parts = ASTRO_API_KEY.split(':');
      userId = parts[0];
      apiKey = parts[1] || parts[0];
    } else if (ASTRO_API_KEY && !ASTRO_USER_ID) {
      // Use API key as both user_id and api_key if no separate user_id
      userId = ASTRO_API_KEY;
      apiKey = ASTRO_API_KEY;
    }
    
    if (userId && apiKey) {
      headers['Authorization'] = 'Basic ' + Buffer.from(`${userId}:${apiKey}`).toString('base64');
      console.log('🔐 Using Basic Auth with user_id:', userId.substring(0, 5) + '...');
    } else {
      return res.status(500).json({
        success: false,
        error: 'Authentication credentials incomplete. Set ASTRO_USER_ID and ASTRO_API_KEY in .env'
      });
    }
    
    console.log('📡 Calling AstrologyAPI.com:', ASTRO_PROVIDER_URL);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    
    const startTime = Date.now();
    const fetched = await safeFetchJson(ASTRO_PROVIDER_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: headers
    });
    const duration = Date.now() - startTime;
    
    console.log('📥 API Response Status:', fetched.status);
    console.log('⏱️ API Call Duration:', duration + 'ms');
    
    if (!fetched.ok) {
      console.error('❌ Astrology API Error:', fetched.status, fetched.rawText);
      return res.status(502).json({
        success: false,
        error: 'Astrology provider error',
        status: fetched.status,
        detail: fetched.rawText,
        hint: fetched.status === 401 ? 'Check ASTRO_USER_ID and ASTRO_API_KEY' : 'Check API credentials and endpoint URL'
      });
    }
    
    if (!fetched.data) {
      console.error('❌ No data in API response');
      return res.status(502).json({
        success: false,
        error: 'Empty response from astrology provider',
        detail: fetched.rawText
      });
    }
    
    const providerData = fetched.data;
    console.log('✅ API Response received, processing...');
    
    // Normalize response data
    const normalized = {
      raw: providerData,
      planets: [],
      ascendant_long: null,
      houses: {}
    };
    
    // Extract planets (try multiple response formats)
    let planetsArr = [];
    if (Array.isArray(providerData.planets)) {
      planetsArr = providerData.planets;
    } else if (providerData.data && Array.isArray(providerData.data.planets)) {
      planetsArr = providerData.data.planets;
    } else if (providerData.birth_details && Array.isArray(providerData.birth_details.planets)) {
      planetsArr = providerData.birth_details.planets;
    }
    
    if (planetsArr.length > 0) {
      planetsArr.forEach(p => {
        const name = p.name || p.planet || p.planet_name || String(p);
        let lon = p.longitude ?? p.lon ?? p.degree ?? p.deg ?? null;
        if (typeof lon === 'string') {
          const match = lon.match(/(\d+\.?\d*)/);
          if (match) lon = parseFloat(match[1]);
        }
        normalized.planets.push({
          name,
          longitude: typeof lon === 'number' ? lon : null,
          raw: p,
          retrograde: p.retrograde ?? false,
          nakshatra: p.nakshatra ?? null,
          sign: p.sign ?? null,
          house: p.house ?? null
        });
      });
    }
    
    // Extract ascendant
    const ascCandidates = [
      providerData.ascendant_longitude,
      providerData.lagna_longitude,
      providerData.lagna,
      providerData.ascendant,
      providerData.asc_l,
      providerData.lagna_deg
    ];
    for (const c of ascCandidates) {
      if (typeof c === 'number') {
        normalized.ascendant_long = c;
        break;
      } else if (typeof c === 'string' && c.match(/^\d+(\.\d+)?/)) {
        normalized.ascendant_long = parseFloat(c);
        break;
      }
    }
    
    // Extract houses
    if (providerData.houses && Array.isArray(providerData.houses)) {
      providerData.houses.forEach((house, index) => {
        normalized.houses[index + 1] = house;
      });
    } else if (providerData.houses && typeof providerData.houses === 'object') {
      normalized.houses = providerData.houses;
    }
    
    console.log('✅ Normalized data:', {
      planets: normalized.planets.length,
      ascendant: normalized.ascendant_long
    });
    
    if (normalized.planets.length === 0) {
      return res.status(502).json({
        success: false,
        error: 'Could not extract planet data from API response',
        rawResponse: providerData
      });
    }
    
    return res.json({
      success: true,
      data: normalized
    });
    
  } catch (error) {
    console.error('❌ Astrology endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      detail: error.message
    });
  }
});

/**
 * POST /api/google-ai
 * AI-based astro analysis using Google Gemini API
 * 
 * Request body: { message: string, chartData?: object, sessionContext?: object }
 * Response: { success: true, response: string }
 */

app.post('/api/google-ai', async (req, res) => {
  console.log('\n🔮 ========== GOOGLE AI (ASTRO ANALYSIS) API CALL RECEIVED ==========');
  console.log('📥 Request body:', JSON.stringify({ ...req.body, message: (req.body.message || '').substring(0, 100) + '...' }, null, 2));
  
  try {
    const { message, chartData, sessionContext } = req.body;
    
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    const GOOGLE_AI_MODEL = process.env.GOOGLE_AI_MODEL || 'gemini-2.0-flash';
    
    if (!GOOGLE_AI_API_KEY) {
      console.error('❌ GOOGLE_AI_API_KEY not configured');
      return res.status(500).json({
        success: false,
        error: 'Google AI API key not configured. Please set GOOGLE_AI_API_KEY in .env file.'
      });
    }
    
    // Build context from chart data and session
    let contextBlock = '';
    if (chartData && typeof chartData === 'object') {
      contextBlock += '\n\n**Chart Data:**\n' + JSON.stringify(chartData, null, 2);
    }
    if (sessionContext && typeof sessionContext === 'object') {
      contextBlock += '\n\n**Session Context (user profile, beliefs, etc.):**\n' + JSON.stringify(sessionContext, null, 2);
    }
    
    const userPrompt = message + contextBlock;
    
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_AI_MODEL}:generateContent?key=${GOOGLE_AI_API_KEY}`;
    
    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: UNIVERSAL_ASTRO_PROMPT }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.95
      }
    };
    
    console.log('📡 Calling Google Gemini API...');
    const startTime = Date.now();
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const duration = Date.now() - startTime;
    console.log('📥 Google AI response received in', duration + 'ms');
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Google AI API error:', response.status, errorText);
      return res.status(response.status >= 500 ? 502 : response.status).json({
        success: false,
        error: 'Google AI API error',
        detail: errorText
      });
    }
    
    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiText) {
      console.error('❌ No text in Gemini response:', JSON.stringify(data).substring(0, 300));
      return res.status(502).json({
        success: false,
        error: 'No response generated from Google AI',
        detail: data
      });
    }
    
    console.log('✅ Google AI astro analysis generated');
    
    return res.json({
      success: true,
      response: aiText,
      model: GOOGLE_AI_MODEL,
      usage: data.usageMetadata || null
    });
    
  } catch (error) {
    console.error('❌ Google AI endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      detail: error.message
    });
  }
});

/**
 * POST /api/vedastro/kundli
 * Generate Kundli using VedAstro master data
 */
app.post('/api/vedastro/kundli', async (req, res) => {
  console.log('\n🔮 ========== VEDASTRO KUNDLI API CALL ==========');
  console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { dob, tob, lat, lon, tz } = req.body;
    
    if (!dob || !tob || lat === undefined || lon === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: dob, tob, lat, lon are required'
      });
    }

    const result = await vedAstroService.generateKundli({
      dob, tob, lat, lon, tz
    });

    if (result.success) {
      return res.json({
        success: true,
        data: result.data
      });
    } else {
      return res.status(502).json({
        success: false,
        error: result.error || 'VedAstro service unavailable'
      });
    }
  } catch (error) {
    console.error('❌ VedAstro Kundli endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      detail: error.message
    });
  }
});

/**
 * POST /api/vedastro/dasha
 * Calculate Dasha periods using VedAstro
 */
app.post('/api/vedastro/dasha', async (req, res) => {
  try {
    const result = await vedAstroService.calculateDasha(req.body);
    
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(502).json({
        success: false,
        error: 'VedAstro dasha calculation unavailable'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/vedastro/match-score
 * Calculate 36 Gun Milan using VedAstro
 */
app.post('/api/vedastro/match-score', async (req, res) => {
  try {
    const { person1, person2 } = req.body;
    
    if (!person1 || !person2) {
      return res.status(400).json({
        success: false,
        error: 'person1 and person2 birth details are required'
      });
    }

    const result = await vedAstroService.calculateMatchScore(person1, person2);
    
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(502).json({
        success: false,
        error: 'VedAstro match score calculation unavailable'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/vedastro/panchang
 * Get daily Panchang using VedAstro
 */
app.post('/api/vedastro/panchang', async (req, res) => {
  try {
    const { date, location } = req.body;
    
    if (!location || location.lat === undefined || location.lon === undefined) {
      return res.status(400).json({
        success: false,
        error: 'location with lat and lon is required'
      });
    }

    const result = await vedAstroService.getPanchang(date, location);
    
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(502).json({
        success: false,
        error: 'VedAstro panchang unavailable'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/vedastro/muhurat
 * Find Muhurat (auspicious time) using VedAstro
 */
app.post('/api/vedastro/muhurat', async (req, res) => {
  try {
    const { activity, dateRange, location } = req.body;
    
    if (!activity || !location) {
      return res.status(400).json({
        success: false,
        error: 'activity and location are required'
      });
    }

    const result = await vedAstroService.findMuhurat(activity, dateRange, location);
    
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(502).json({
        success: false,
        error: 'VedAstro muhurat calculation unavailable'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/vedastro/health
 * Check VedAstro service availability
 */
app.get('/api/vedastro/health', async (req, res) => {
  const isAvailable = await vedAstroService.checkAvailability();
  res.json({
    success: true,
    available: isAvailable,
    service: 'VedAstro',
    timestamp: new Date().toISOString()
  });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   POST /api/openai - OpenAI chat`);
  console.log(`   POST /api/astrology - Astrology API`);
  console.log(`   POST /api/google-ai - Google AI astro analysis`);
  console.log(`   POST /api/vedastro/kundli - VedAstro Kundli generation`);
  console.log(`   POST /api/vedastro/dasha - VedAstro Dasha calculation`);
  console.log(`   POST /api/vedastro/match-score - VedAstro 36 Gun Milan`);
  console.log(`   POST /api/vedastro/panchang - VedAstro Panchang`);
  console.log(`   POST /api/vedastro/muhurat - VedAstro Muhurat finder`);
  console.log(`   GET  /api/vedastro/health - VedAstro service health`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`\n⚠️  Make sure to set API keys in backend/.env file`);
  console.log(`   Optional: Set VEDASTRO_API_URL and VEDASTRO_API_KEY for VedAstro integration\n`);
});

