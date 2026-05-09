# Deployment Guide - AgriCommerce

This guide covers deploying the AgriCommerce application to production.

## Prerequisites

- Node.js 18+ installed locally
- MongoDB Atlas account (free tier available)
- Vercel account (for hosting) - optional, can use other platforms
- GitHub account

## Environment Setup

### 1. Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Update the following variables:

- **MONGODB_URI**: Your MongoDB Atlas connection string
  - Get it from MongoDB Atlas → Connect → Drivers → Connection String
  - Format: `mongodb+srv://username:password@cluster.xxx.mongodb.net/dbname`

- **JWT_SECRET**: Generate a strong random string
  ```bash
  openssl rand -base64 32
  ```

- **NEXT_PUBLIC_API_URL**: Your production URL (e.g., `https://yourdomain.com`)

### 2. MongoDB Atlas Setup (5 minutes)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project and cluster (Free M0 tier)
4. Set Network Access to allow your IP or use `0.0.0.0/0` for anywhere
5. Create database user with strong password
6. Copy connection string and add to `.env.local`

## Deployment Options

### Option A: Vercel (Recommended - Free)

Vercel is optimized for Next.js and provides free hosting for hobby projects.

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Then set environment variables in Vercel dashboard:
- Project Settings → Environment Variables
- Add: MONGODB_URI, JWT_SECRET, NEXT_PUBLIC_API_URL

### Option B: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI="your-connection-string"
heroku config:set JWT_SECRET="your-secret"

# Deploy
git push heroku main
```

### Option C: Docker (Any Server)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t agricommerce .
docker run -p 3000:3000 agricommerce
```

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build production
npm run build

# Start production server
npm start
```

Visit http://localhost:3000

## Security Checklist

- [ ] Set strong JWT_SECRET in production
- [ ] Update admin credentials (see DATABASE_SETUP.md)
- [ ] Use MongoDB Atlas with proper network access
- [ ] Enable HTTPS on production domain
- [ ] Set environment variables securely (not in git)
- [ ] Review API endpoints for unauthorized access
- [ ] Set up monitoring and error logging

## Troubleshooting

### MongoDB Connection Error
- Check MONGODB_URI format
- Verify IP whitelist in MongoDB Atlas
- Ensure database user password doesn't have special characters (encode in URL)

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Production Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor database performance
- Set up alerts for failed API requests
- Use analytics to track user behavior

## Next Steps

1. Customize admin authentication (currently hardcoded)
2. Add user registration system
3. Implement payment processing
4. Add email notifications
5. Set up automated backups for MongoDB

For more help, see DATABASE_SETUP.md
