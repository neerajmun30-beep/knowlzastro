/**
 * API Key Setup Script
 * Helps verify API key configuration
 * Run: node setup-api-keys.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('🔑 API Key Setup Verification\n');
console.log('='.repeat(50));

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env file not found!');
    console.log('📝 Creating .env file from .env.example...');
    
    const examplePath = path.join(__dirname, '.env.example');
    if (fs.existsSync(examplePath)) {
        fs.copyFileSync(examplePath, envPath);
        console.log('✅ .env file created!');
        console.log('📝 Please edit .env file and add your API keys.');
        process.exit(0);
    } else {
        console.log('❌ .env.example not found. Please create .env manually.');
        process.exit(1);
    }
}

console.log('✅ .env file found!\n');

// Check API keys
const checks = [
    {
        name: 'OpenAI API Key',
        key: 'OPENAI_API_KEY',
        required: true,
        description: 'Required for AI chat responses',
        url: 'https://platform.openai.com/api-keys'
    },
    {
        name: 'JWT Secret',
        key: 'JWT_SECRET',
        required: true,
        description: 'Required for user authentication',
        url: 'https://jwt.io/'
    },
    {
        name: 'MongoDB URI',
        key: 'MONGODB_URI',
        required: false,
        description: 'Optional - for backend database',
        url: 'https://www.mongodb.com/'
    },
    {
        name: 'VedAstro API Key',
        key: 'VEDASTRO_API_KEY',
        required: false,
        description: 'Optional - for enhanced astrology calculations',
        url: 'https://vedastro.org/'
    },
    {
        name: 'Vedic API Key',
        key: 'VEDIC_API_KEY',
        required: false,
        description: 'Optional - for Nakshatra calculations',
        url: 'Check your Vedic API provider'
    },
    {
        name: 'Redis URL',
        key: 'REDIS_URL',
        required: false,
        description: 'Optional - for caching',
        url: 'https://redis.io/'
    }
];

console.log('📋 Checking API Keys:\n');

let allRequiredSet = true;
let optionalSet = 0;

checks.forEach(check => {
    const value = process.env[check.key];
    const isSet = value && value !== `your-${check.key.toLowerCase().replace(/_/g, '-')}-here`;
    
    if (isSet) {
        console.log(`✅ ${check.name}: Set`);
        if (!check.required) optionalSet++;
    } else if (check.required) {
        console.log(`❌ ${check.name}: NOT SET (Required)`);
        console.log(`   📝 ${check.description}`);
        console.log(`   🔗 Get it: ${check.url}`);
        allRequiredSet = false;
    } else {
        console.log(`⚪ ${check.name}: Not set (Optional)`);
        console.log(`   📝 ${check.description}`);
    }
    console.log('');
});

console.log('='.repeat(50));
console.log('\n📊 Summary:\n');

if (allRequiredSet) {
    console.log('✅ All required API keys are configured!');
    console.log(`⚪ ${optionalSet} optional key(s) configured\n`);
    
    // Test OpenAI if key is set
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
        console.log('🧪 Testing OpenAI API connection...\n');
        
        const OpenAI = require('openai');
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        openai.models.list()
            .then(() => {
                console.log('✅ OpenAI API connection successful!');
                console.log('✅ Your API key is valid and working.\n');
            })
            .catch(err => {
                console.log('⚠️  OpenAI API test failed:');
                console.log(`   ${err.message}\n`);
                console.log('💡 Make sure:');
                console.log('   1. Your API key is correct');
                console.log('   2. You have credits in your OpenAI account');
                console.log('   3. Your internet connection is working\n');
            });
    }
    
    console.log('🚀 Next steps:');
    console.log('   1. Start backend server: npm start');
    console.log('   2. Open final desktop.html in browser');
    console.log('   3. Test chat - should use OpenAI API\n');
    
} else {
    console.log('❌ Some required API keys are missing!\n');
    console.log('📝 To fix:');
    console.log('   1. Open .env file');
    console.log('   2. Add missing API keys');
    console.log('   3. Run this script again: node setup-api-keys.js\n');
}

