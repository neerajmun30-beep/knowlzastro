# 🚀 Knowlzastro Deployment Guide

## Current Setup

### Files Ready for Deployment
1. **index.html** - Frontend application
2. **admin.html** - Admin dashboard
3. No backend currently (demo mode)

---

## Deployment Options

### Option 1: Quick Deploy (Static Hosting)
**Platforms**: Netlify, Vercel, GitHub Pages

```bash
# Steps
1. Upload index.html and admin.html
2. Configure custom domain
3. Done! (Works in demo mode)
```

**Limitations**:
- No payment processing
- No user authentication
- Demo responses only

---

### Option 2: Full Stack Deploy

#### Frontend
```bash
# Deploy to Netlify
netlify deploy --prod
```

#### Backend (Next Steps)
```bash
# Create backend server
mkdir backend && cd backend
npm init -y
npm install express cors dotenv stripe openai

# Create server.js
# (See backend structure in PROJECT_SUMMARY.md)
```

#### Database
```bash
# PostgreSQL setup
createdb knowlzastro
psql knowlzastro < schema.sql
```

#### Payment Gateway
1. Sign up at https://razorpay.com
2. Get API keys
3. Configure in backend
4. Set up webhooks

---

## Environment Variables

### Frontend (.env)
```
VITE_BACKEND_URL=https://api.knowlzastro.com
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost/knowlzastro
OPENAI_API_KEY=sk-xxxxx
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
EMAIL_SERVICE_KEY=xxxxx
JWT_SECRET=xxxxx
```

---

## Production Checklist

### Security
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection

### Performance
- [ ] CDN configured
- [ ] Image optimization
- [ ] Code minification
- [ ] Database indexing
- [ ] Caching enabled

### Monitoring
- [ ] Error logging (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Uptime monitoring
- [ ] Payment tracking

---

## Testing

### Demo Mode (Current)
```javascript
// In index.html
generateIntelligentResponse(message)
// Returns intelligent demo responses
```

### Production Mode (Future)
```javascript
// With backend
async function generateResponse(message) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message })
    });
    return await response.json();
}
```

---

## Support

**Owner**: neerajmun26@gmail.com  
**Project**: Knowlzastro  
**Status**: MVP Ready

For backend development, see PROJECT_SUMMARY.md

