# VedAstro.org Integration Guide

## Overview

This guide explains how to integrate all features from [VedAstro.org](https://vedastro.org/Home.html) into the Knowlzastro app.

## Features from VedAstro.org

### ✅ 1. AI Astrologer
**Status**: Already Integrated
- Chat interface available in `final desktop.html`
- Uses `generateIntelligentResponse()` function
- Can be enhanced with VedAstro API calls

### ✅ 2. Numerology
**Status**: Integrated via `js/vedastro-integration.js`
- **Function**: `vedAstro.calculateNumerology(name)`
- Calculates:
  - Destiny Number
  - Soul Number  
  - Personality Number
- **Usage**:
```javascript
const numerology = vedAstro.calculateNumerology("John Doe");
console.log(numerology.destinyNumber); // 5
console.log(numerology.interpretation); // "Adventurous, freedom-loving, curious"
```

### ✅ 3. Perfect Time Finder (Muhurat)
**Status**: Integrated via `js/vedastro-integration.js`
- **Function**: `vedAstro.findPerfectTime(activity, location, dateRange)`
- Activities supported:
  - Marriage
  - Business start
  - Travel
  - House purchase
- **Usage**:
```javascript
const muhurat = await vedAstro.findPerfectTime('marriage', 'Mumbai, India');
console.log(muhurat.recommendations); // Best days, best times
```

### ✅ 4. Life Path Predictor
**Status**: Integrated via API wrapper
- **Function**: `vedAstro.predictLifePath(birthDetails)`
- Uses existing Dasha analysis
- Provides life predictions based on planetary periods

### ✅ 5. Find Soulmate
**Status**: Integrated via API wrapper
- **Function**: `vedAstro.findSoulmate(birthDetails1, birthDetails2)`
- Uses existing compatibility matching (36 Gun Milan)
- Enhanced with VedAstro API for deeper analysis

### ✅ 6. Your Soul Age
**Status**: Integrated via `js/vedastro-integration.js`
- **Function**: `vedAstro.calculateSoulAge(birthDetails)`
- Calculates spiritual maturity level
- **Usage**:
```javascript
const soulAge = vedAstro.calculateSoulAge({
    dateOfBirth: '1990-01-15',
    timeOfBirth: '10:30',
    placeOfBirth: 'Mumbai, India'
});
console.log(soulAge.soulAge); // 'mature'
console.log(soulAge.description); // 'Mastering life lessons'
```

### ✅ 7. Predict Sports Game
**Status**: Integrated via API wrapper
- **Function**: `vedAstro.predictSportsGame(gameType, teams, matchDate)`
- Predicts sports outcomes based on planetary positions
- **Usage**:
```javascript
const prediction = await vedAstro.predictSportsGame(
    'cricket',
    ['Team A', 'Team B'],
    '2024-12-25'
);
```

### ✅ 8. Easy API
**Status**: Integrated via `js/vedastro-integration.js`
- **Function**: `vedAstro.callVedAstroAPI(endpoint, data)`
- Unified wrapper for all VedAstro API endpoints
- **Usage**:
```javascript
const result = await vedAstro.callVedAstroAPI('kundli', birthDetails);
```

### ✅ 9. Horoscope
**Status**: Integrated via API wrapper
- **Function**: `vedAstro.generateHoroscope(birthDetails, type)`
- Types: 'daily', 'weekly', 'monthly', 'yearly'
- Uses existing horoscope generation

### ✅ 10. Match Score
**Status**: Integrated via API wrapper
- **Function**: `vedAstro.calculateMatchScore(birthDetails1, birthDetails2)`
- Uses existing 36 Gun Milan calculation
- Enhanced with VedAstro API

### ✅ 11. Birth Time Finder
**Status**: Integrated via API wrapper
- **Function**: `vedAstro.findBirthTime(birthDetails, knownEvents)`
- Reverse engineers birth time from life events
- **Usage**:
```javascript
const birthTime = await vedAstro.findBirthTime(
    { dateOfBirth: '1990-01-15', placeOfBirth: 'Mumbai' },
    [
        { event: 'marriage', date: '2015-06-10' },
        { event: 'career_milestone', date: '2020-03-15' }
    ]
);
```

## Dat Folder Setup

If you have a `dat` folder from VedAstro:

1. **Place dat folder** in the root directory: `D:\webstone\dat\`

2. **Folder structure should be**:
```
dat/
├── cities.json          # City database for geolocation
├── nakshatras.json      # Nakshatra data
├── ephemeris/           # Swiss Ephemeris data files
│   ├── sepl_18.se1
│   └── ...
└── other data files
```

3. **The integration will automatically**:
   - Load city database for faster lookups
   - Load nakshatra data for calculations
   - Use local ephemeris data if available
   - Fall back to API if dat folder not found

## API Configuration

To use VedAstro API endpoints:

1. **Update API base URL** in `js/vedastro-integration.js`:
```javascript
this.apiBaseUrl = 'https://api.vedastro.org'; // Update with actual endpoint
```

2. **Or use local API** if running VedAstro locally:
```javascript
this.apiBaseUrl = 'http://localhost:5000/api'; // Local VedAstro server
```

## Integration into Pages

### Add to HTML pages:

```html
<!-- Load VedAstro Integration -->
<script src="js/vedastro-integration.js"></script>

<script>
    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', async () => {
        await window.vedAstro.initialize();
        
        // Now you can use all VedAstro features
        const numerology = window.vedAstro.calculateNumerology("User Name");
        const soulAge = window.vedAstro.calculateSoulAge(birthDetails);
        // etc.
    });
</script>
```

### Example: Numerology Page

```javascript
function calculateNumerology() {
    const name = document.getElementById('user-name').value;
    const result = vedAstro.calculateNumerology(name);
    
    document.getElementById('destiny-number').textContent = result.destinyNumber;
    document.getElementById('soul-number').textContent = result.soulNumber;
    document.getElementById('interpretation').textContent = result.interpretation;
}
```

### Example: Muhurat Finder

```javascript
async function findMuhurat() {
    const activity = document.getElementById('activity').value;
    const location = document.getElementById('location').value;
    
    const muhurat = await vedAstro.findPerfectTime(activity, location);
    
    // Display results
    muhurat.recommendations.bestDays.forEach(day => {
        // Show best days
    });
}
```

## Testing

1. **Test Numerology**:
   ```javascript
   const num = vedAstro.calculateNumerology("John Doe");
   console.log(num);
   ```

2. **Test Soul Age**:
   ```javascript
   const age = vedAstro.calculateSoulAge({
       dateOfBirth: '1990-01-15',
       timeOfBirth: '10:30',
       placeOfBirth: 'Mumbai'
   });
   console.log(age);
   ```

3. **Test API Calls** (if API available):
   ```javascript
   const horoscope = await vedAstro.generateHoroscope(birthDetails, 'daily');
   console.log(horoscope);
   ```

## Next Steps

1. ✅ **Extract VedAstro-master.zip** if needed
2. ✅ **Place dat folder** in root directory (if available)
3. ✅ **Update API endpoints** in `vedastro-integration.js`
4. ✅ **Add VedAstro script** to all relevant HTML pages
5. ✅ **Test each feature** individually
6. ✅ **Connect to UI** - Add buttons/forms on pages to use these features

## Files Created

- ✅ `js/vedastro-integration.js` - Main integration module
- ✅ `VEDASTRO_INTEGRATION_GUIDE.md` - This guide

## Support

For VedAstro API documentation:
- Website: https://vedastro.org/Home.html
- GitHub: https://github.com/VedAstro/VedAstro
- API Docs: Check VedAstro repository for API documentation

