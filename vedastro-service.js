/**
 * VedAstro Master Data Service
 * Connects to VedAstro.org API and master data
 * 
 * This service provides access to VedAstro's comprehensive astrology calculations
 * including chart generation, divisional charts, dashas, and more.
 */

const fetch = require('node-fetch');

class VedAstroService {
    constructor() {
        // VedAstro.org API endpoints
        this.apiBaseUrl = process.env.VEDASTRO_API_URL || 'https://api.vedastro.org';
        this.apiKey = process.env.VEDASTRO_API_KEY || '';
        
        // Local VedAstro master data path (if available)
        this.masterDataPath = process.env.VEDASTRO_MASTER_DATA_PATH || './VedAstro-master';
    }

    /**
     * Generate complete Kundli using VedAstro master data
     */
    async generateKundli(birthDetails) {
        try {
            const { dob, tob, lat, lon, tz } = birthDetails;
            
            // Call VedAstro API for complete chart
            const response = await fetch(`${this.apiBaseUrl}/api/kundli`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
                },
                body: JSON.stringify({
                    date: dob,
                    time: tob,
                    latitude: lat,
                    longitude: lon,
                    timezone: tz || 'Asia/Kolkata'
                })
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    data: this.normalizeVedAstroResponse(data)
                };
            }

            // Fallback to local calculation if API not available
            return await this.generateKundliLocal(birthDetails);
        } catch (error) {
            console.error('VedAstro API error:', error);
            // Fallback to local calculation
            return await this.generateKundliLocal(birthDetails);
        }
    }

    /**
     * Generate divisional charts (D1-D60)
     */
    async generateDivisionalCharts(birthDetails, chartTypes = ['D1', 'D2', 'D9', 'D10']) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/divisional-charts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
                },
                body: JSON.stringify({
                    birthDetails,
                    chartTypes
                })
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('VedAstro divisional charts error:', error);
        }

        return null;
    }

    /**
     * Calculate Dasha periods
     */
    async calculateDasha(birthDetails) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/dasha`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
                },
                body: JSON.stringify(birthDetails)
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('VedAstro dasha calculation error:', error);
        }

        return null;
    }

    /**
     * Calculate 36 Gun Milan (compatibility)
     */
    async calculateMatchScore(birthDetails1, birthDetails2) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/match-score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
                },
                body: JSON.stringify({
                    person1: birthDetails1,
                    person2: birthDetails2
                })
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('VedAstro match score error:', error);
        }

        return null;
    }

    /**
     * Get daily Panchang
     */
    async getPanchang(date, location) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/panchang`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
                },
                body: JSON.stringify({
                    date: date || new Date().toISOString().split('T')[0],
                    latitude: location.lat,
                    longitude: location.lon,
                    timezone: location.tz || 'Asia/Kolkata'
                })
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('VedAstro panchang error:', error);
        }

        return null;
    }

    /**
     * Find Muhurat (auspicious time)
     */
    async findMuhurat(activity, dateRange, location) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/muhurat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
                },
                body: JSON.stringify({
                    activity,
                    dateRange,
                    location
                })
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('VedAstro muhurat error:', error);
        }

        return null;
    }

    /**
     * Normalize VedAstro API response to standard format
     */
    normalizeVedAstroResponse(data) {
        // Convert VedAstro response to our standard format
        return {
            planets: data.planets || data.Planets || [],
            houses: data.houses || data.Houses || [],
            ascendant: data.ascendant || data.Ascendant || null,
            lagna: data.lagna || data.Lagna || null,
            nakshatra: data.nakshatra || data.Nakshatra || null,
            dasha: data.dasha || data.Dasha || null,
            raw: data // Keep raw data for reference
        };
    }

    /**
     * Fallback: Generate Kundli locally using basic calculations
     */
    async generateKundliLocal(birthDetails) {
        // This would use local Swiss Ephemeris or basic calculations
        // For now, return a placeholder structure
        return {
            success: false,
            error: 'VedAstro API not available. Please configure VEDASTRO_API_URL and VEDASTRO_API_KEY in .env',
            data: null
        };
    }

    /**
     * Check if VedAstro service is available
     */
    async checkAvailability() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/health`, {
                method: 'GET',
                headers: {
                    ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
                }
            });

            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new VedAstroService();
