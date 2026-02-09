# 🔮 Astrology API Setup - AstrologyAPI.com

## ✅ API Key Configured

**API Key**: `DzfmbtAzjI2L8sRupUgn57nIjhJjM8wV2gloU16J`  
**Provider**: AstrologyAPI.com  
**Endpoint**: `https://json.astrologyapi.com/v1/birth_details`

## 📋 Configuration

### Backend Configuration (`server/.env`)

```env
PORT=4000
DEFAULT_TIMEZONE=Asia/Kolkata

# Astrology API - AstrologyAPI.com
ASTRO_API_KEY=DzfmbtAzjI2L8sRupUgn57nIjhJjM8wV2gloU16J
ASTRO_PROVIDER_URL=https://json.astrologyapi.com/v1/birth_details
ASTRO_AUTH_METHOD=basic

# OpenAI (Add your key)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
```

## 🔧 Authentication Methods

The backend supports two authentication methods:

### 1. Basic Authentication (Default)
AstrologyAPI.com typically uses Basic Auth with `app_id:app_secret` format:
- If API key contains `:`, it's split into app_id and app_secret
- Otherwise, API key is used as both app_id and app_secret

### 2. Bearer Token
If `ASTRO_AUTH_METHOD=bearer` is set, the API key is used as Bearer token.

## 🚀 Usage

### Start the Server

```bash
cd server
npm install express node-fetch dotenv cors
node index.js
```

### Test the API

```bash
curl -X POST http://localhost:4000/astro \
  -H "Content-Type: application/json" \
  -d '{
    "dob": "1990-08-14",
    "tob": "15:05",
    "lat": 29.54,
    "lon": 73.9,
    "tz": "Asia/Kolkata"
  }'
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "planets": [
      {
        "name": "Sun",
        "longitude": 120.5,
        "retrograde": false,
        "nakshatra": "Uttara Phalguni"
      },
      ...
    ],
    "ascendant_long": 45.2,
    "raw": { ... }
  }
}
```

## 📚 Available Endpoints

The backend supports these AstrologyAPI.com endpoints:

1. **Birth Details** (`/v1/birth_details`) - Complete birth chart
2. **Planet Positions** (`/v1/planets`) - Planetary positions
3. **Nakshatra** (`/v1/nakshatra`) - Nakshatra details
4. **Dasha** (`/v1/dasha`) - Dasha periods

To use different endpoints, update `ASTRO_PROVIDER_URL` in `server/.env`.

## ⚠️ Troubleshooting

### If API returns 401 Unauthorized:

1. **Check API Key Format**: 
   - AstrologyAPI.com might require `app_id:app_secret` format
   - Try setting `ASTRO_APP_ID` and `ASTRO_APP_SECRET` separately

2. **Try Bearer Token**:
   - Set `ASTRO_AUTH_METHOD=bearer` in `.env`

3. **Verify API Key**:
   - Check if the API key is active in your AstrologyAPI.com dashboard
   - Ensure the key has access to the required endpoints

### If API returns 404:

- Verify the endpoint URL is correct
- Check AstrologyAPI.com documentation for the correct endpoint path

## 🔗 Frontend Integration

The frontend automatically uses the backend API through:
- `js/astrology-api-client.js` - Frontend wrapper
- `js/api-client.js` - Helper functions
- `js/kundli-engine.js` - Chart rendering

No frontend changes needed - the API key is handled server-side for security.

---

**Status**: ✅ API Key configured and ready to use

