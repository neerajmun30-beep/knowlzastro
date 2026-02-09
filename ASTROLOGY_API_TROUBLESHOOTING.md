# 🔧 Astrology API Troubleshooting Guide

## ❌ Issue: API Not Returning Data

### Common Causes:

1. **Missing User ID**: AstrologyAPI.com requires BOTH `user_id` AND `api_key` for Basic Auth
2. **Wrong Authentication Format**: Must use Basic Auth with `user_id:api_key`
3. **Incorrect Payload Format**: API expects specific date/time format
4. **Wrong Endpoint**: Endpoint URL might be incorrect

## ✅ Solution Steps:

### Step 1: Check Your API Credentials

AstrologyAPI.com provides:
- **User ID** (also called App ID)
- **API Key** (also called App Secret)

You need BOTH. The key you provided (`DzfmbtAzjI2L8sRupUgn57nIjhJjM8wV2gloU16J`) might be:
- Just the API key (need user_id separately)
- Or in format `user_id:api_key`

### Step 2: Update `server/.env`

**Option A - Separate User ID and API Key:**
```env
ASTRO_USER_ID=your_user_id_here
ASTRO_API_KEY=DzfmbtAzjI2L8sRupUgn57nIjhJjM8wV2gloU16J
```

**Option B - Combined Format:**
```env
ASTRO_API_KEY=user_id:api_key
```

### Step 3: Check Server Logs

Start the server and check console output:
```bash
cd server
node index.js
```

Look for:
- `🔐 Using Basic Auth with user_id: ...` - Authentication setup
- `📡 Calling AstrologyAPI.com: ...` - API call
- `📥 API Response Status: ...` - Response status
- `❌` - Any errors

### Step 4: Test the API Directly

Test with curl to see raw response:
```bash
curl -X POST https://json.astrologyapi.com/v1/birth_details \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'user_id:api_key' | base64)" \
  -d '{
    "day": 14,
    "month": 8,
    "year": 1990,
    "hour": 15,
    "minute": 5,
    "latitude": 29.54,
    "longitude": 73.9,
    "timezone": 5.5
  }'
```

### Step 5: Verify API Key Format

Check your AstrologyAPI.com dashboard:
1. Login to https://astrologyapi.com
2. Go to API Keys section
3. Verify you have:
   - User ID / App ID
   - API Key / App Secret
4. Make sure the key is active and not expired

## 🔍 Debugging

The updated code now includes:
- ✅ Detailed console logging
- ✅ Multiple response format handling
- ✅ Better error messages
- ✅ Automatic date/time format conversion

## 📞 If Still Not Working

1. **Check API Status**: https://astrologyapi.com/api-status
2. **Contact Support**: mail@astrologyapi.com or +91 (22) 35715833
3. **Check Server Console**: Look for detailed error messages
4. **Verify Credentials**: Make sure user_id and api_key are correct

## 🎯 Quick Fix

If you only have the API key, you might need to:
1. Get your User ID from AstrologyAPI.com dashboard
2. Add it to `server/.env` as `ASTRO_USER_ID=your_user_id`
3. Restart the server

---

**Current Configuration:**
- API Key: `DzfmbtAzjI2L8sRupUgn57nIjhJjM8wV2gloU16J`
- Endpoint: `https://json.astrologyapi.com/v1/birth_details`
- Auth: Basic Auth (user_id:api_key)

