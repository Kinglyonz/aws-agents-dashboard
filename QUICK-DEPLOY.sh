#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  AWS Enterprise Security Operations Center                ║"
echo "║  Quick Deployment Script                                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "server-enterprise.js" ]; then
    echo "❌ Error: server-enterprise.js not found"
    echo "Please run this script from the aws-agents-dashboard directory"
    exit 1
fi

echo "Step 1: Backing up current files..."
cp server.js server-old.js 2>/dev/null || echo "No existing server.js to backup"
cp public/index.html public/index-old.html 2>/dev/null || echo "No existing index.html to backup"
echo "✅ Backup complete"
echo ""

echo "Step 2: Installing enterprise version..."
cp server-enterprise.js server.js
cp public/index-enterprise.html public/index.html
echo "✅ Enterprise files installed"
echo ""

echo "Step 3: Checking Git status..."
if [ -d ".git" ]; then
    echo "✅ Git repository detected"

    echo "Step 4: Committing changes..."
    git add .
    git commit -m "Upgrade to Enterprise Security Operations Center v2.0

Features:
- AI-powered log analysis with AWS Bedrock Claude 3.5
- Real-time security monitoring via Security Hub + GuardDuty
- Compliance tracking (SOC 2, PCI-DSS, HIPAA, CIS)
- Cost analysis and optimization recommendations
- Security event timeline
- Enterprise SOC-style dark mode UI

This transforms the basic Lambda dashboard into a full enterprise
Security Operations Center suitable for executive presentations."

    echo "✅ Changes committed"
    echo ""

    echo "Step 5: Pushing to GitHub..."
    git push origin main

    if [ $? -eq 0 ]; then
        echo "✅ Pushed to GitHub successfully!"
        echo ""
        echo "╔═══════════════════════════════════════════════════════════╗"
        echo "║  🚀 DEPLOYMENT STARTED!                                   ║"
        echo "╚═══════════════════════════════════════════════════════════╝"
        echo ""
        echo "DigitalOcean will automatically deploy your changes."
        echo ""
        echo "📊 Your dashboard will be live in 2-3 minutes at:"
        echo "   https://king-prawn-app-cemui.ondigitalocean.app"
        echo ""
        echo "⚙️  Next steps:"
        echo "   1. Enable AWS Security Hub (see DEPLOYMENT-GUIDE.md)"
        echo "   2. Enable AWS GuardDuty for threat detection"
        echo "   3. Enable AWS Bedrock Claude 3.5 Sonnet access"
        echo "   4. Wait 1-2 hours for first Security Hub scan"
        echo "   5. Test all features!"
        echo ""
        echo "📖 Full deployment guide: DEPLOYMENT-GUIDE.md"
        echo ""
    else
        echo "❌ Push failed. Check your Git configuration"
        exit 1
    fi
else
    echo "⚠️  No Git repository found"
    echo ""
    echo "You need to push these changes to GitHub manually:"
    echo "  1. Initialize Git: git init"
    echo "  2. Add remote: git remote add origin YOUR_REPO_URL"
    echo "  3. Commit: git add . && git commit -m 'Enterprise SOC upgrade'"
    echo "  4. Push: git push origin main"
fi

echo "✨ Deployment script complete!"
