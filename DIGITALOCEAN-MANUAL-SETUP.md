# DigitalOcean Manual Setup Guide

## Issue: Dashboard URL Not Resolving

The URL `king-prawn-app-cemui.ondigitalocean.app` is not resolving, which means either:
1. The DigitalOcean app was deleted
2. The app failed to deploy and was disabled
3. The URL changed

## Step-by-Step Fix

### Step 1: Check Your DigitalOcean Apps

1. Go to https://cloud.digitalocean.com/apps
2. Log in with your account
3. Look for an app named "aws-agents-dashboard" or "king-prawn"

**If you see the app:**
- Click on it
- Check the "Settings" tab for the current URL
- Check "Runtime Logs" for deployment errors
- Continue to Step 2

**If you DON'T see the app:**
- The app was deleted
- Continue to Step 3 to create a new one

---

### Step 2: Fix Existing App

If the app exists but isn't working:

#### 2A. Check Settings

1. Click on your app in DigitalOcean
2. Go to "Settings" → "Components"
3. Verify:
   - **Build Command**: `npm install`
   - **Run Command**: `node server.js`
   - **HTTP Port**: `5001`

#### 2B. Set Environment Variables

1. Go to "Settings" → "Environment Variables"
2. Add these variables (if not already set):

```
AWS_REGION = us-east-1
AWS_ACCESS_KEY_ID = your_access_key_id
AWS_SECRET_ACCESS_KEY = your_secret_access_key
PORT = 5001
NODE_ENV = production
```

3. Make sure they're marked as "Encrypted"

#### 2C. Force Rebuild

1. Go to "Deployments" tab
2. Click "Force Rebuild & Deploy"
3. Wait 2-3 minutes
4. Check "Runtime Logs" for errors

---

### Step 3: Create New App (If App Doesn't Exist)

#### 3A. Create App

1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Choose "GitHub" as source
4. Connect your GitHub account (if not already)
5. Select repository: **Kinglyonz/aws-agents-dashboard**
6. Select branch: **main**
7. Check "Autodeploy" to redeploy on Git push
8. Click "Next"

#### 3B. Configure Resources

1. **Name**: aws-enterprise-security-ops
2. **Region**: New York (or your preferred region)
3. **Environment Type**: Node.js
4. **Instance Size**: Basic ($5/month)
5. Click "Edit Plan" to verify:
   - **Build Command**: `npm install`
   - **Run Command**: `node server.js`
   - **HTTP Port**: `5001`

#### 3C. Environment Variables

Click "Environment Variables" and add:

| Key | Value | Type |
|-----|-------|------|
| `AWS_REGION` | `us-east-1` | Encrypted |
| `AWS_ACCESS_KEY_ID` | `your_access_key_id` | Encrypted |
| `AWS_SECRET_ACCESS_KEY` | `your_secret_access_key` | Encrypted |
| `PORT` | `5001` | Plain Text |
| `NODE_ENV` | `production` | Plain Text |

**IMPORTANT**: Replace `your_access_key_id` and `your_secret_access_key` with your actual AWS credentials.

#### 3D. Launch App

1. Review your settings
2. Click "Create Resources"
3. Wait 2-3 minutes for deployment
4. DigitalOcean will give you a new URL like:
   - `random-name-xxxxx.ondigitalocean.app`

---

### Step 4: Test Deployment

Once the app is deployed:

#### 4A. Get Your URL

1. In DigitalOcean Apps dashboard
2. Copy your app's URL (shown at the top)

#### 4B. Test Health Endpoint

```bash
curl https://YOUR-APP-URL.ondigitalocean.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-05T...",
  "version": "2.0.0-enterprise"
}
```

#### 4C. Visit Dashboard

Open in browser:
```
https://YOUR-APP-URL.ondigitalocean.app
```

You should see:
- Dark SOC-style UI
- Security Score gauge
- AI Log Analyzer
- Compliance tracking
- Cost analysis

---

## Troubleshooting

### Build Fails with "Module not found"

**Fix**: Ensure `package.json` has correct dependencies
```bash
cd /Users/khalillyons/aws-agents-dashboard
git add .
git commit -m "Update dependencies"
git push origin main
```

### "AWS credentials not configured" Error

**Fix**: Check environment variables in DigitalOcean
1. Go to Settings → Environment Variables
2. Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set
3. Click "Save" and force rebuild

### Port Binding Error in Logs

**Fix**: Ensure PORT environment variable is set to `5001`
1. Add environment variable: `PORT = 5001`
2. Verify Run Command is `node server.js`
3. Force rebuild

### ES6 Import Errors

**Fix**: Ensure Node.js version is 18+
1. Check that `.node-version` file exists with content `18.18.0`
2. Verify `package.json` has `"type": "module"`
3. Force rebuild

---

## Quick Reference Commands

### Check if files are committed
```bash
cd /Users/khalillyons/aws-agents-dashboard
git status
```

### Push latest changes
```bash
git add .
git commit -m "Update configuration"
git push origin main
```

### Test local deployment
```bash
npm install
node server.js
# Visit http://localhost:5001
```

---

## What You'll See When Working

### In Browser
- Dark blue/purple SOC-style interface
- "AWS Enterprise Security Operations Center" header
- Real-time security metrics
- AI-powered log analysis input box
- Compliance framework scores (SOC 2, PCI, HIPAA, CIS)

### In DigitalOcean Logs (Successful Deployment)
```
> aws-agents-dashboard@2.0.0 start
> node server.js

╔═══════════════════════════════════════════════════════════╗
║  AWS Enterprise Security Operations Center               ║
║  Running on http://localhost:5001                          ║
║                                                           ║
║  Features:                                                ║
║  ✓ Security Dashboard with AI-powered analysis            ║
║  ✓ Real-time threat detection & timeline                  ║
║  ✓ Compliance monitoring (SOC 2, PCI, HIPAA, CIS)         ║
║  ✓ Cost analysis & optimization                           ║
║  ✓ Resource inventory & health monitoring                 ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Need Help?

1. **Check DigitalOcean Status**: https://cloud.digitalocean.com/apps
2. **View Runtime Logs**: Click your app → Runtime Logs tab
3. **View Build Logs**: Click your app → Build Logs tab
4. **GitHub Repository**: https://github.com/Kinglyonz/aws-agents-dashboard

---

## Next Steps After Deployment Works

1. ✅ Dashboard loads successfully
2. ✅ Note your new DigitalOcean URL
3. ✅ Enable AWS Security Hub (see DEPLOYMENT-GUIDE.md)
4. ✅ Enable AWS GuardDuty
5. ✅ Enable AWS Bedrock Claude 3.5 Sonnet
6. ✅ Test all features
7. ✅ Schedule boss meeting to show off your enterprise security operations center!

---

**Current Files Ready for Deployment**:
- ✅ server.js (enterprise backend)
- ✅ public/index.html (enterprise frontend)
- ✅ package.json (with Node 18+ requirement)
- ✅ .node-version (18.18.0)
- ✅ .do/app.yaml (DigitalOcean config)

Everything is ready - you just need to configure it in DigitalOcean's web interface!
