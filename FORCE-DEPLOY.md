# Force Deploy Enterprise Dashboard to DigitalOcean

## Problem
DigitalOcean is showing the OLD dashboard instead of the new Enterprise Security Operations Center, even though the code is in GitHub.

## Solution: Force Rebuild in DigitalOcean

### Step 1: Go to Your App
1. Visit https://cloud.digitalocean.com/apps
2. Click on your app (likely named "aws-agents-dashboard" or similar)

### Step 2: Check Current Deployment
1. Look at the top - you'll see the current deployment status
2. Click on "Deployments" tab
3. You should see recent deployments listed

### Step 3: Force Rebuild
**This is the key step:**

1. In the top right, click the **"Actions"** dropdown menu
2. Select **"Force Rebuild and Deploy"**
3. Wait 2-3 minutes for the rebuild

OR

1. Go to "Settings" tab
2. Scroll to "App-Level Configuration"
3. Click "Edit" next to "Auto Deploy"
4. Make sure "Autodeploy code changes" is **CHECKED**
5. Click "Save"
6. Then go back to deployments and click **"Create Deployment"**

### Step 4: Watch Build Logs
1. Click on the deployment that's now building
2. Click "Build Logs" to watch the build
3. Look for:
   ```
   Installing dependencies from package.json
   > aws-agents-dashboard@2.0.0 start
   > node server.js
   ```

### Step 5: Verify Enterprise Version
Once deployed (2-3 minutes), visit your dashboard URL.

You should now see:
- **Dark blue/purple background** (not dark gray)
- **"AWS Enterprise Security Operations Center"** title
- **Security Score** gauge at the top
- **AI Log Analyzer** section
- **Compliance** scores (SOC 2, PCI, HIPAA, CIS)

---

## Alternative: Trigger Deploy via GitHub

If the Force Rebuild doesn't work, trigger a new deployment by pushing a tiny change:

```bash
cd /Users/khalillyons/aws-agents-dashboard

# Make a tiny change to force deploy
echo "# Enterprise v2.0" >> README-ENTERPRISE.md

# Commit and push
git add .
git commit -m "Trigger deployment - Enterprise v2.0"
git push origin main
```

Then wait 2-3 minutes and check your DigitalOcean app again.

---

## What You Should See After Successful Deploy

### OLD Dashboard (What you see now):
- Title: "AWS Lambda Agents Dashboard"
- Gray/dark background
- Shows "TOTAL AGENTS" and "ACTIVE FUNCTIONS"
- Lambda function cards

### NEW Enterprise Dashboard (What you should see):
- Title: "AWS Enterprise Security Operations Center"
- Dark blue (#0a0e27) background
- Security Score: 91/100 (or similar)
- Threat Level: LOW/MEDIUM/HIGH indicator
- AI Log Analyzer with text input
- Compliance tracking section
- Cost analysis section
- Security event timeline

---

## Troubleshooting

### Still showing old dashboard after rebuild?

**Check 1**: Verify the deployment completed
- Go to DigitalOcean → Your App → Deployments
- Latest deployment should show "Active" with a green checkmark

**Check 2**: Clear browser cache
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Or open in incognito mode

**Check 3**: Check which commit was deployed
- In DigitalOcean Deployments tab
- Click on the active deployment
- Look for "Commit SHA"
- Should be `4fd2165` or later

**Check 4**: Verify autodeploy is enabled
- Settings → App-Level Configuration
- "Autodeploy code changes" should be checked

---

## Quick Verification Commands

### Check GitHub has enterprise code:
```bash
cd /Users/khalillyons/aws-agents-dashboard
git log -1 --oneline
# Should show: 4fd2165 Fix DigitalOcean deployment configuration
```

### Check local works:
Your local server is running right now at: **http://localhost:5001**
Open that to see what it SHOULD look like when deployed.

---

## Summary

✅ Code is correct in GitHub
✅ Local version works perfectly
❌ DigitalOcean is serving old cached version

**Fix**: Force rebuild in DigitalOcean web interface (Actions → Force Rebuild and Deploy)

This should take 2-3 minutes and then your enterprise dashboard will be live!
