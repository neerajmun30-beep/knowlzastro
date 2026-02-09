# 🚀 Production-Ready Backend & Frontend Setup

## ✅ Files Created

### Backend:
- `server/index.js` - Express server with `/astro`, `/astro-report`, `/chat` endpoints
- `server/.env.example` - Environment variables template

### Frontend:
- `js/astrology-api-client.js` - Frontend wrapper for backend endpoints
- `js/api-client.js` - Helper functions for chart rendering and reports
- `js/kundli-engine.js` - North Indian Kundli SVG renderer (longitude-aware)

## 📋 Setup Instructions

### 1. Install Backend Dependencies

```bash
cd server
npm init -y
npm install express node-fetch dotenv cors
```

### 2. Configure Environment Variables

Copy `server/.env.example` to `server/.env` and fill in real values:

```env
PORT=4000
DEFAULT_TIMEZONE=Asia/Kolkata

# Astrology provider
ASTRO_PROVIDER_URL=https://json.astrologyapi.com/v1/your_endpoint_here
ASTRO_AUTH_METHOD=basic   # or 'bearer'
ASTRO_APP_ID=your_app_id_here
ASTRO_APP_SECRET=your_app_secret_here
ASTRO_API_KEY=your_provider_api_key_if_bearer

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
```

### 3. Start the Server

```bash
node server/index.js
```

You should see: `Server listening on port 4000`

### 4. Test Endpoints

#### Test `/astro`:
```bash
curl -X POST http://localhost:4000/astro \
  -H "Content-Type: application/json" \
  -d '{"dob":"1990-08-14","tob":"15:05","lat":29.54,"lon":73.9,"tz":"Asia/Kolkata"}'
```

#### Test `/astro-report`:
```bash
curl -X POST http://localhost:4000/astro-report \
  -H "Content-Type: application/json" \
  -d '{"dob":"1990-08-14","tob":"15:05","lat":29.54,"lon":73.9,"tz":"Asia/Kolkata"}'
```

#### Test `/chat`:
```bash
curl -X POST http://localhost:4000/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

## 🔌 Frontend Integration

The frontend files are already created and ready to use. Your HTML should already reference:
- `js/kundli-engine.js`
- `js/astrology-api-client.js`

### Usage Examples:

#### Render Kundli:
```javascript
const formValues = { dob: '1990-01-01', tob: '12:00', lat: 28.67, lon: 77.22, tz: 'Asia/Kolkata' };

async function handleRenderKundli() {
  try {
    const data = await AstroClient.fetchBirthChart(formValues);
    const chartData = KundliEngine.mapAstroResponseToChartData(data);
    KundliEngine.renderKundli('kundli-container', chartData, { caption: `${formValues.dob} ${formValues.tob}` });
  } catch (err) {
    console.error('Render Kundli failed', err);
    alert('Unable to render Kundli. See console for details.');
  }
}
```

#### Generate Report:
```javascript
async function handleGenerateReport() {
  try {
    const resp = await AstroClient.generateAstroReport(formValues);
    const session = JSON.parse(localStorage.getItem('session_memory') || '{}');
    session.completeKundliReport = resp.report;
    session.chartData = resp.chartData;
    localStorage.setItem('session_memory', JSON.stringify(session));
    
    const repContainer = document.getElementById('astrology-report');
    if (repContainer) repContainer.innerHTML = resp.report.replace(/\n/g,'<br>');
  } catch (err) {
    console.error('Generate report failed', err);
    alert('Unable to generate report. See console.');
  }
}
```

## ⚠️ Important Notes

1. **CSP Configuration**: Ensure your Content-Security-Policy allows connections to `http://localhost:4000` (or your deployed backend URL) in the `connect-src` directive.

2. **API Keys**: Never commit `server/.env` to version control. It contains sensitive API keys.

3. **Provider Adaptation**: If your astrology provider returns different field names, paste a sample JSON response and the normalization logic in `server/index.js` can be adapted.

4. **No UI Changes**: All these files are logic-only. They don't modify HTML, CSS, or visual design.

## 🎯 Next Steps

1. ✅ Add real API keys to `server/.env`
2. ✅ Install dependencies and start server
3. ✅ Test endpoints with curl
4. ✅ Wire up existing UI buttons to call `AstroClient` and `AppAPI` functions
5. ✅ Verify Kundli rendering works with real data

---

**Status**: ✅ All files created and ready for integration

