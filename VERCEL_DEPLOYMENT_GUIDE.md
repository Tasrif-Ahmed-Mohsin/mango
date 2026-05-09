# Vercel Deployment - Step by Step Guide

## ✅ Prerequisites Checklist

Before deploying, ensure you have:

- [ ] Vercel account (create free at https://vercel.com)
- [ ] GitHub account connected to Vercel
- [ ] MongoDB Atlas account with database set up
- [ ] MongoDB connection string (URI)
- [ ] Strong JWT_SECRET generated

## Step 1: Generate Strong Secrets

Open PowerShell and run:

```powershell
# Generate JWT_SECRET (copy the output)
$bytes = [System.Text.Encoding]::UTF8.GetBytes((Get-Random -Count 32 | ForEach-Object { [char]$_ }))
$secret = [Convert]::ToBase64String($bytes)
Write-Host "JWT_SECRET: $secret"
```

Or use this simpler method:
```
JWT_SECRET: generate-random-32-character-string
Example: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

## Step 2: MongoDB Connection String

1. Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Log in to your account
3. Click on your cluster → Connect
4. Select "Drivers" → "Node.js"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `mango`

Example: 
```
mongodb+srv://username:password@cluster0.xxx.mongodb.net/mango?retryWrites=true&w=majority
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Website (Easiest)

1. Go to https://vercel.com
2. Click "New Project"
3. Import GitHub repository: `mango`
4. Click "Import"
5. Configure project:
   - Framework: Next.js (auto-detected)
   - Root Directory: ./ (default)
   - Click "Continue"

6. **Add Environment Variables:**
   - Click "Add Environment Variable"
   - Add each variable:
     - Name: `MONGODB_URI`
       Value: `mongodb+srv://username:password@cluster.xxx/mango...`
     - Name: `JWT_SECRET`
       Value: `your-generated-secret-here`
     - Name: `NEXT_PUBLIC_API_URL`
       Value: `https://your-app-name.vercel.app`
   
7. Click "Deploy"
8. Wait 2-3 minutes for build to complete

### Option B: Using Vercel CLI

```powershell
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod

# 4. When prompted, set environment variables:
# - MONGODB_URI
# - JWT_SECRET
# - NEXT_PUBLIC_API_URL
```

## Step 4: Configure Environment Variables in Vercel Dashboard

After initial deployment:

1. Go to https://vercel.com/dashboard
2. Select your project: `mango`
3. Go to Settings → Environment Variables
4. Verify these variables exist:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_API_URL`

## Step 5: Test Your Deployment

After deployment completes:

1. Visit your Vercel app URL: `https://mango-xxxx.vercel.app`
2. Test homepage loads
3. Test product catalog
4. Test shopping cart
5. Test admin login: `admin@agricommerce.com` / `admin123`

## Step 6: Update Admin Credentials (Important!)

1. Go to `/admin` page
2. Update admin email and password in MongoDB or code
3. Or modify `src/app/api/auth/login/route.ts` to use secure credentials

## Step 7: Set Up Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain (e.g., `mango-store.com`)
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_API_URL` in environment variables

---

## 🔗 API Endpoints (After Deployment)

All API routes will be available at:
```
https://mango-xxxx.vercel.app/api/...
```

Examples:
- `https://mango-xxxx.vercel.app/api/products`
- `https://mango-xxxx.vercel.app/api/categories`
- `https://mango-xxxx.vercel.app/api/orders`
- `https://mango-xxxx.vercel.app/api/auth/login`

---

## ⚠️ Important Notes

### Security
- Never commit `.env.local` to Git ✓ (already in .gitignore)
- Use strong JWT_SECRET in production
- Change admin credentials immediately
- Keep MongoDB credentials secure in Vercel dashboard

### Database Limits (Free MongoDB Atlas)
- 512 MB storage limit
- Monitor usage in MongoDB Atlas dashboard
- Upgrade if needed

### Vercel Limits (Free Tier)
- Unlimited deployments
- 100 GB bandwidth/month
- 50,000 function executions/month
- Perfect for hobby projects

---

## Troubleshooting

### Build Fails on Vercel
```bash
# Test locally first
npm run build
npm start

# Check for errors, then redeploy
```

### MongoDB Connection Error
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (should include Vercel IPs)
- Ensure database user password doesn't have special chars or encode them

### API Routes Return 500 Error
- Check Vercel logs: Dashboard → your-project → Deployments → View logs
- Verify environment variables are set
- Check MongoDB connection in logs

### Static Files Not Loading
- Check `public/` folder exists
- Verify file paths in code are relative

---

## Deployment Checklist

- [ ] GitHub account connected to Vercel
- [ ] MongoDB Atlas cluster created
- [ ] Connection string copied correctly
- [ ] JWT_SECRET generated and strong
- [ ] `.env.local` NOT committed to Git
- [ ] Project builds locally: `npm run build`
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] Build succeeds on Vercel (check logs)
- [ ] Homepage loads after deployment
- [ ] API routes respond correctly
- [ ] Admin login works
- [ ] Shopping cart works
- [ ] Orders can be created
- [ ] Admin credentials updated (security)

---

## Next Steps After Deployment

1. ✅ Test all features work on Vercel
2. ✅ Monitor MongoDB usage
3. ✅ Set up error tracking (optional)
4. ✅ Add custom domain (optional)
5. ✅ Enable analytics (optional)
6. ✅ Update DNS for custom domain
7. ✅ Share your live app!

---

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Your Project GitHub**: https://github.com/Tasrif-Ahmed-Mohsin/mango
- **Vercel Docs**: https://vercel.com/docs
- **Next.js on Vercel**: https://nextjs.org/docs/getting-started/deployment

---

**Status: Ready to Deploy! 🚀**

Your project is fully configured for Vercel. Both frontend and backend will run on the same Vercel instance!
