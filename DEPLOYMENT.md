# Deployment Guide - Advanced AI-Powered Astrology Ecosystem

## Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0.0
- Redis >= 7.0.0
- npm >= 9.0.0

## Installation Steps

### 1. Clone Repository
```bash
git clone <repository-url>
cd webstone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Configure Environment Variables

Required variables in `.env`:
- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT tokens
- `OPENAI_API_KEY` - OpenAI API key for AI features

### 5. Start MongoDB and Redis

**MongoDB:**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or using local installation
mongod
```

**Redis:**
```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:latest

# Or using local installation
redis-server
```

### 6. Run Database Migrations
```bash
# Database will auto-create collections on first use
# No migrations needed for initial setup
```

### 7. Start Development Server
```bash
npm run dev
```

### 8. Start Production Server
```bash
npm start
```

## Production Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name astrology-api
pm2 save
pm2 startup
```

### Using Docker
```bash
docker build -t astrology-app .
docker run -d -p 4000:4000 --env-file .env astrology-app
```

### Using Docker Compose
```bash
docker-compose up -d
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Kundli
- `POST /api/kundli/generate` - Generate Kundli
- `GET /api/kundli/:id` - Get Kundli details
- `GET /api/kundli` - Get all user Kundlis

### Charts
- `POST /api/charts/divisional` - Get divisional charts
- `POST /api/charts/ashtakvarga` - Get Ashtakavarga
- `POST /api/charts/shadbala` - Get Shadbala

### AI
- `POST /api/ai/chat` - AI chat endpoint
- `POST /api/ai/reading` - Get AI-generated reading

### Matchmaking
- `POST /api/matchmaking/match` - Match two Kundlis

### Panchang
- `POST /api/panchang/daily` - Get daily Panchang
- `GET /api/panchang/horoscope` - Get daily horoscope

### PDF
- `POST /api/pdf/generate` - Generate PDF Kundli

## Testing

```bash
npm test
```

## Monitoring

- Health check: `GET /api/health`
- Server logs: Check console output or PM2 logs
- Database: MongoDB Compass or mongo shell
- Redis: Redis CLI

## Troubleshooting

### MongoDB Connection Issues
- Check MongoDB is running: `mongosh`
- Verify connection string in `.env`
- Check network connectivity

### Redis Connection Issues
- Check Redis is running: `redis-cli ping`
- Verify Redis URL in `.env`
- Check port 6379 is not blocked

### OpenAI API Issues
- Verify API key in `.env`
- Check API quota and billing
- Test with simple request

## Performance Optimization

1. Enable Redis caching for frequently accessed data
2. Use MongoDB indexes for faster queries
3. Implement rate limiting (already included)
4. Use CDN for static assets
5. Enable compression (gzip)

## Security

1. Never commit `.env` file
2. Use strong JWT secrets
3. Enable HTTPS in production
4. Regular security updates
5. Rate limiting enabled by default

## Scaling

For high traffic:
1. Use MongoDB replica sets
2. Redis cluster for caching
3. Load balancer for multiple instances
4. Horizontal scaling with PM2 cluster mode

