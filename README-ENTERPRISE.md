# AWS Enterprise Security Operations Center

**Version 2.0 - Enterprise Edition**
**Built with**: Node.js, Express, AWS SDK, AWS Bedrock AI
**Target Users**: CISOs, Security Teams, IT Managers, Executives

---

## Overview

This is a **production-ready, enterprise-grade AWS Security Operations Center** that provides real-time security monitoring, AI-powered log analysis, compliance tracking, and cost optimization - all in a single dashboard.

Perfect for:
- 🏢 **Executive meetings** - Show your AWS security posture at a glance
- 🛡️ **Security teams** - Monitor threats and investigate incidents
- 💰 **Cost optimization** - Identify savings opportunities
- ✅ **Compliance audits** - Generate SOC 2, PCI, HIPAA, CIS reports

---

## Key Features

### 1. Security Dashboard
- **Real-time security score** (0-100) based on AWS Security Hub findings
- **Threat level indicator** (CRITICAL/HIGH/MEDIUM/LOW)
- **Active incidents** breakdown by severity
- **Critical security alerts** with affected resources
- **Public resource detection** (S3 buckets, databases, etc.)

### 2. AI-Powered Log Analyzer 🤖
Ask questions in natural language:
- *"Why did the payment Lambda fail?"*
- *"Show me all admin logins from outside USA today"*
- *"What caused the database connection timeout?"*

The AI (AWS Bedrock Claude 3.5 Sonnet) analyzes CloudWatch logs and provides:
- Executive summary
- Root cause analysis
- Timeline of events
- Actionable recommendations

### 3. Compliance Monitoring
Track compliance across multiple frameworks:
- **SOC 2 Type II** - Trust Services Criteria
- **PCI-DSS 4.0** - Payment Card Industry
- **HIPAA** - Healthcare data protection
- **CIS AWS Foundations** - Best practices

Features:
- Real-time compliance scores
- Control-level pass/fail status
- Remediation guidance for failing controls
- One-click PDF reports for auditors

### 4. Security Event Timeline
24-hour view of all security events:
- AWS Security Hub findings
- GuardDuty threat detections
- CloudTrail API activity
- Security group changes
- IAM role assumptions

Each event includes:
- Severity scoring (0-100)
- Affected resources
- Actor information (user, IP, location)
- Timestamp and correlation

### 5. Cost Analysis
- Current month AWS spending
- Cost breakdown by service
- Savings recommendations (right-sizing, reserved instances, zombie resources)
- Budget vs actual comparison
- Forecasted end-of-month cost

### 6. Resource Inventory
Complete catalog of AWS resources:
- Count by type (Lambda, S3, EC2, RDS, DynamoDB, etc.)
- Environment classification (production, development, unknown)
- Health status (healthy, warning, critical)
- Zombie resource detection (unused >30 days)

---

## Tech Stack

**Backend**:
- Node.js 18+ with Express
- AWS SDK v2
- AWS Bedrock Runtime (for AI)
- In-memory caching (5-60 minute TTL)

**Frontend**:
- Vanilla JavaScript (no framework needed)
- SOC-style dark mode UI
- Real-time updates (30-second refresh)
- Mobile responsive

**AWS Services Used**:
- AWS Lambda
- AWS Security Hub
- AWS GuardDuty
- AWS Config
- AWS Cost Explorer
- AWS Bedrock (Claude 3.5 Sonnet)
- AWS CloudWatch Logs
- AWS S3
- AWS EC2
- AWS IAM
- AWS Resource Groups Tagging API

---

## Quick Start

### 1. Deploy to DigitalOcean (Easiest)

```bash
cd /Users/khalillyons/aws-agents-dashboard
./QUICK-DEPLOY.sh
```

This script will:
1. Backup your current files
2. Install enterprise version
3. Commit to Git
4. Push to GitHub
5. Trigger DigitalOcean auto-deployment

**Dashboard live in 2-3 minutes** at: https://king-prawn-app-cemui.ondigitalocean.app

### 2. Run Locally

```bash
cd /Users/khalillyons/aws-agents-dashboard
npm install
node server-enterprise.js
```

Open: http://localhost:5001

### 3. Environment Variables

Required:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
PORT=5001
```

---

## AWS Setup

### Required AWS Services

1. **AWS Security Hub** - Security findings aggregation
   ```bash
   aws securityhub enable-security-hub --region us-east-1
   ```

2. **AWS GuardDuty** - Threat detection
   ```bash
   aws guardduty create-detector --enable --region us-east-1
   ```

3. **AWS Bedrock** - AI log analysis
   - Go to AWS Bedrock Console
   - Enable "Anthropic Claude 3.5 Sonnet" model access

4. **IAM Permissions** - Attach `SecurityAudit` policy + Bedrock access

*See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for detailed setup*

---

## API Endpoints

### Security
- `GET /api/security/dashboard` - Overall security posture
- `GET /api/security/timeline` - 24-hour security events
- `GET /api/compliance/:framework` - Compliance status (soc2, pci, hipaa, cis)

### AI Analysis
- `POST /api/ai/analyze-logs` - Natural language log analysis
  ```json
  {
    "query": "Why did the payment Lambda fail?",
    "logGroup": "/aws/lambda/process-payment",
    "timeRange": "last-1-hour"
  }
  ```

### Operations
- `GET /api/costs` - Cost analysis & recommendations
- `GET /api/resources` - Resource inventory
- `GET /api/health` - Health check

---

## Cost Breakdown

### DigitalOcean
- **Basic plan**: $5-12/month (no change)

### AWS Services
| Service | Cost | Notes |
|---------|------|-------|
| Security Hub | ~$5/month | After 10K free checks |
| GuardDuty | ~$5/month | After 30-day trial |
| Bedrock Claude | ~$10/month | Typical usage (~1M tokens) |
| Cost Explorer | Free | Included |
| CloudWatch | Free | Basic metrics |
| Lambda | Free | Covered by free tier |

**Total**: ~$25-35/month for full enterprise features
**Without AI**: ~$15-20/month (disable Bedrock)

Compare to commercial SIEM: $500-2000/month ✅ **97% cost savings**

---

## Use Cases

### For CISOs
- Weekly board presentations on security posture
- Incident response and forensic analysis
- Compliance audit preparation (SOC 2, PCI, HIPAA)
- Security team metrics and KPIs

### For DevOps Engineers
- Troubleshoot Lambda errors with AI in seconds
- Monitor production security in real-time
- Identify unused resources to reduce costs
- Automated compliance evidence collection

### For Executives
- One-page AWS security status for board meetings
- Cost optimization recommendations
- Risk assessment and mitigation tracking
- Prove security controls to customers

---

## Security Best Practices

✅ **DO**:
- Rotate AWS credentials regularly
- Use IAM roles with least-privilege permissions
- Enable MFA on AWS accounts
- Monitor the dashboard daily
- Set up budget alerts in AWS

❌ **DON'T**:
- Commit AWS credentials to Git (use environment variables)
- Share dashboard publicly (internal use only)
- Ignore critical security alerts
- Disable Security Hub to save costs

---

## Troubleshooting

**Q: Dashboard shows "AWS credentials not configured"**
A: Check DigitalOcean environment variables are set

**Q: Security data is all zeros**
A: Enable Security Hub in AWS Console, wait 1-2 hours for first scan

**Q: AI analysis returns "unavailable"**
A: Enable Bedrock Claude 3.5 Sonnet access in AWS Console

**Q: Compliance scores are 0%**
A: Enable compliance standards in Security Hub (CIS, PCI, etc.)

**Q: Cost is higher than expected**
A: Bedrock charges per token - set daily budget limits

*Full troubleshooting guide*: [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)

---

## Roadmap

### v2.1 (Next Month)
- [ ] Slack/email alerts for critical findings
- [ ] Multi-account AWS Organizations support
- [ ] Historical trend analysis (90-day security score)
- [ ] Automated remediation workflows
- [ ] Mobile app (iOS/Android)

### v2.2 (Future)
- [ ] SIEM integration (Splunk, Datadog, SumoLogic)
- [ ] Custom security policies builder
- [ ] Red team simulation mode
- [ ] Dark web monitoring
- [ ] Threat hunting tools

---

## Contributing

This is a private enterprise tool built using the **Context Engineering methodology** from Dr. Ernesto Lee's framework. It leverages:
- Structured PRD (Product Requirements Document)
- Research-driven development
- AI-assisted code generation
- Professional DevOps practices

Built by: Khalil Lyons (Orus Group)
Architecture: Enterprise Security Operations Center
Framework: Context Engineering + Claude Code

---

## License

Proprietary - Internal use only (Orus Group)

---

## Support

**Documentation**:
- [Deployment Guide](DEPLOYMENT-GUIDE.md) - Complete setup instructions
- [PRD](research/PRD-ENTERPRISE-SECURITY.md) - Product requirements
- [Viability Analysis](research/viability-analysis.md) - Technical assessment

**Quick Deploy**:
```bash
./QUICK-DEPLOY.sh
```

**Questions?**
Check the deployment guide first, then review AWS service status.

---

**Built with Context Engineering • Powered by AWS & AI • Ready for Enterprise** 🚀
