# Deploying LocalHands Frontend on Vercel

This guide will walk you through deploying the LocalHands frontend application to Vercel step by step.

## Prerequisites

1. **Vercel Account**: Sign up for a free account at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be pushed to a GitHub repository
3. **Backend API URL**: Have your backend API URL ready (the deployed backend endpoint)

## Step 1: Prepare Your Project

### 1.1 Push Code to GitHub
Ensure your frontend code is pushed to a GitHub repository:

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 1.2 Check Environment Variables
Identify any environment variables your app needs. Common ones for LocalHands:

- `NEXT_PUBLIC_API_URL` - Your backend API URL
- Any other API keys or configuration

## Step 2: Deploy to Vercel

### 2.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the `localhands-frontend` directory

### 2.2 Configure Build Settings

Vercel will automatically detect Next.js and set these defaults:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### 2.3 Add Environment Variables

1. In the Vercel dashboard, go to **"Environment Variables"**
2. Add your backend API URL:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-url.com/api`
   - **Environment**: Production, Preview, Development (select all)

3. Add any other required environment variables

### 2.4 Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your application
3. Wait for the deployment to complete (usually 2-5 minutes)

## Step 3: Post-Deployment Configuration

### 3.1 Verify Deployment

1. Visit your Vercel URL (e.g., `your-app.vercel.app`)
2. Test key functionality:
   - Page navigation
   - API calls to backend
   - Authentication flow
   - Map functionality

### 3.2 Custom Domain (Optional)

1. In Vercel dashboard, go to **"Domains"**
2. Add your custom domain
3. Follow DNS configuration instructions

### 3.3 Update Backend CORS

Ensure your backend allows requests from your Vercel domain:

```javascript
// Example CORS configuration
const corsOptions = {
  origin: [
    'https://your-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
};
```

## Step 4: Common Issues & Solutions

### Issue 1: API Calls Failing

**Problem**: Frontend can't reach backend API
**Solution**: 
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend CORS settings
- Ensure backend is deployed and accessible

### Issue 2: Build Errors

**Problem**: Build fails during deployment
**Solution**:
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify Next.js configuration

### Issue 3: Environment Variables Not Working

**Problem**: Environment variables undefined in app
**Solution**:
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Restart deployment after adding variables
- Check variable names match exactly

## Step 5: Best Practices

### 5.1 Automatic Deployments

Enable automatic deployments:
- Go to **"Settings"** → **"Git"**
- Enable **"Auto-deploy"** for your main branch

### 5.2 Preview Deployments

Vercel automatically creates preview deployments for:
- Pull requests
- Git pushes to non-main branches

### 5.3 Performance Optimization

- Enable Vercel Analytics
- Set up custom error pages
- Configure caching headers for static assets

## Step 6: Monitoring

### 6.1 Vercel Analytics

1. Go to **"Analytics"** in Vercel dashboard
2. Enable analytics for your project
3. Monitor performance and usage

### 6.2 Logs

- View real-time logs in Vercel dashboard
- Check function logs for API issues
- Monitor build logs for deployment problems

## Troubleshooting Commands

If you need to debug locally with production settings:

```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables locally
vercel env pull .env.production

# Build with production settings
npm run build

# Start production server
npm start
```

## Summary

Your LocalHands frontend is now deployed on Vercel! Key points to remember:

1. **Environment Variables** must be properly configured
2. **Backend CORS** needs to allow your Vercel domain
3. **Automatic deployments** streamline your workflow
4. **Monitor performance** using Vercel Analytics

For additional help, visit [Vercel's documentation](https://vercel.com/docs).
