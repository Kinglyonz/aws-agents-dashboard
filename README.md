# AWS Agents Dashboard - Gpulse

Professional monitoring dashboard for AWS Lambda functions and microservices used in the Gpulse platform.

## Features

✅ **Real-time Lambda Monitoring**
- View all 40+ Lambda functions deployed across Gpulse
- Monitor runtime, memory allocation, timeout, and code size
- Track function status and health

✅ **Organized by Category**
- Bookmark Management
- Opportunity Processing
- Text Extraction
- Statistics & Analytics
- Authentication & Security
- Data Processing
- Utilities

✅ **Search & Filter**
- Quick search by function name
- Filter by category
- Real-time dashboard updates

✅ **Professional UI**
- Dark theme optimized for ops teams
- Responsive grid layout
- Detailed agent metrics
- Auto-refresh every 30 seconds

## Quick Start

### Prerequisites
- Node.js 20.x or higher
- AWS credentials with Lambda read access
- Docker (for containerization)

### Local Development

1. **Clone/Setup**
```bash
cd ~/aws-agents-dashboard
npm install
```

2. **Configure AWS Credentials**
```bash
cp .env.example .env
# Edit .env with your AWS credentials
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1
```

3. **Run Locally**
```bash
npm start
# Visit http://localhost:5001
```

## Docker Deployment

### Build Image
```bash
docker build -t aws-agents-dashboard:latest .
```

### Run Container
```bash
docker run -p 5001:5001 \
  -e AWS_ACCESS_KEY_ID=your_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret \
  -e AWS_REGION=us-east-1 \
  aws-agents-dashboard:latest
```

## Deploy to DigitalOcean

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Add AWS Agents Dashboard"
git remote add origin https://github.com/YOUR_USERNAME/aws-agents-dashboard.git
git push -u origin main
```

### Step 2: Create DigitalOcean App

1. Go to DigitalOcean Dashboard
2. Click **Create** → **Apps**
3. Select your GitHub repository
4. Configure:
   - Branch: `main`
   - Build: Auto-detect Dockerfile
   - Port: `5001`
   - Instance: Basic ($5/month)

### Step 3: Set Environment Variables

In DigitalOcean App Settings:
```
AWS_ACCESS_KEY_ID = your_key
AWS_SECRET_ACCESS_KEY = your_secret
AWS_REGION = us-east-1
PORT = 5001
NODE_ENV = production
```

### Step 4: Deploy
Click **Create Resources** and wait 3-5 minutes for deployment.

Your dashboard will be live at:
```
https://aws-agents-dashboard-xxxxx.ondigitalocean.app
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Get All Agents
```
GET /api/agents
```
Response includes all Lambda functions with metadata.

### Get Metrics for Function
```
GET /api/agents/:functionName/metrics?period=3600&startTime=2025-12-01&endTime=2025-12-05
```

### Get Function Logs
```
GET /api/agents/:functionName/logs?limit=50
```

### Invoke Function (Admin)
```
POST /api/agents/:functionName/invoke
Body: { "payload": {...} }
```

### Dashboard Stats
```
GET /api/stats
```

## Lambda Functions Monitored

### Bookmark Management (6 functions)
- `addBookmark-main`, `addBookmark-dev`
- `removeBookmark-main`, `removeBookmark-dev`
- `getBookmarkStatus-main`, `getBookmarkStatus-dev`
- `fetchBookmarks-main`, `fetchBookmarks-dev`

### Opportunity Processing (6 functions)
- `fetchOpportunity-main`, `fetchOpportunity-dev`
- `fetchOpportunities-main`, `fetchOpportunities-dev`
- `OpportunityCsvLoader`
- `opDelta-main`

### Text Extraction (4 functions)
- `PDFTextExtractor`
- `tiffMetaExtractor`
- `pdf-extractor`
- `extractTextFromPDF`

### Statistics (2 functions)
- `fetchStats-main`, `fetchStats-dev`

### Authentication (9 functions)
- Cognito auth challenge and verification functions
- Custom message and pre-auth triggers

### Data Processing (7 functions)
- `instructionPrompt-*`
- `syntheticlab-query-service`
- CloudWatch to Datadog converters
- Alarm reporters

### Utilities (3 functions)
- `ResourceExplorer`
- `govpulse-landingpage-signup`
- `govpulse-signup`

## Architecture

```
┌─────────────────────────────────────────┐
│   Browser                               │
│   (Dashboard UI - HTML/CSS/JS)          │
└────────────────┬────────────────────────┘
                 │
                 │ HTTP
                 ▼
┌─────────────────────────────────────────┐
│   Node.js Server (Express)              │
│   - Fetch Lambda metadata               │
│   - CloudWatch metrics                  │
│   - Serve static files                  │
└────────────────┬────────────────────────┘
                 │
                 │ AWS SDK
                 ▼
┌─────────────────────────────────────────┐
│   AWS Services                          │
│   - Lambda API                          │
│   - CloudWatch API                      │
│   - IAM (credentials)                   │
└─────────────────────────────────────────┘
```

## Cost Estimation

- **DigitalOcean Basic**: $5/month
- **AWS API Calls**: ~$0.02/month (minimal)
- **Total**: ~$5/month

## Security Notes

⚠️ **Important:**
- Never commit `.env` file with real credentials
- Use IAM roles instead of access keys in production
- Limit Lambda read-only access with IAM policies
- Rotate access keys regularly
- Restrict dashboard access with authentication

## Recommended IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:ListFunctions",
        "lambda:GetFunction",
        "lambda:GetFunctionConfiguration"
      ],
      "Resource": "arn:aws:lambda:*:*:function/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:ListMetrics"
      ],
      "Resource": "*"
    }
  ]
}
```

## Troubleshooting

### AWS Credentials Not Found
```bash
# Check if credentials are configured
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY

# Or check ~/.aws/credentials file
cat ~/.aws/credentials
```

### Docker Build Issues
```bash
# Check Docker is running
docker --version

# Build with verbose output
docker build -t aws-agents-dashboard:latest . --verbose
```

### DigitalOcean Deployment Failed
1. Check build logs in DigitalOcean console
2. Verify environment variables are set
3. Ensure AWS credentials have proper permissions
4. Check that port 5001 is correctly configured

## Next Steps

- [ ] Add authentication layer (OAuth2/JWT)
- [ ] Implement detailed function logs viewer
- [ ] Add CloudWatch alarms visualization
- [ ] Create cost breakdown by function
- [ ] Add invocation history and results
- [ ] Implement function performance charts
- [ ] Add integration with Slack/Email alerts

## Support

For issues or questions:
1. Check AWS credentials configuration
2. Verify IAM permissions
3. Review CloudWatch logs in AWS console
4. Check Docker container logs

## License

MIT
