import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Configure AWS
const lambda = new AWS.Lambda({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const cloudwatch = new AWS.CloudWatch({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.AWS_SECRET_ACCESS_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Lambda functions categorized by type
const LAMBDA_AGENTS = {
  'Bookmark Management': [
    'addBookmark-main',
    'addBookmark-dev',
    'removeBookmark-main',
    'removeBookmark-dev',
    'getBookmarkStatus-main',
    'getBookmarkStatus-dev',
    'fetchBookmarks-main',
    'fetchBookmarks-dev',
  ],
  'Opportunity Processing': [
    'fetchOpportunity-main',
    'fetchOpportunity-dev',
    'fetchOpportunities-main',
    'fetchOpportunities-dev',
    'OpportunityCsvLoader',
    'opDelta-main',
  ],
  'Text Extraction': [
    'PDFTextExtractor',
    'tiffMetaExtractor',
    'pdf-extractor',
    'extractTextFromPDF',
  ],
  'Statistics': [
    'fetchStats-main',
    'fetchStats-dev',
  ],
  'Authentication': [
    'amplify-login-create-auth-challenge-580cd631',
    'amplify-login-create-auth-challenge-773a5dd7',
    'amplify-login-define-auth-challenge-580cd631',
    'amplify-login-define-auth-challenge-773a5dd7',
    'amplify-login-custom-message-580cd631',
    'amplify-login-custom-message-773a5dd7',
    'amplify-login-verify-auth-challenge-580cd631',
    'amplify-login-verify-auth-challenge-773a5dd7',
    'Govpulse-PreAuth-Trigger',
  ],
  'Data Processing': [
    'instructionPrompt-olt2k',
    'instructionPrompt-5oh0i',
    'syntheticlab-query-service',
    'CloudWatchToDatadogConverter',
    'DatadogImporterUserForgotPassword',
    'DatadogImporterUserRegistrationFunction',
    'CloudwatchAlarmReporter',
  ],
  'Utilities': [
    'ResourceExplorer',
    'govpulse-landingpage-signup',
    'govpulse-signup',
  ],
};

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

/**
 * GET /api/agents
 * Get all Lambda functions with their metadata
 */
app.get('/api/agents', async (req, res) => {
  try {
    const agents = [];

    for (const [category, functionNames] of Object.entries(LAMBDA_AGENTS)) {
      for (const functionName of functionNames) {
        try {
          const params = { FunctionName: functionName };
          const data = await lambda.getFunction(params).promise();

          agents.push({
            id: functionName,
            name: functionName,
            category,
            runtime: data.Configuration.Runtime,
            memorySize: data.Configuration.MemorySize,
            timeout: data.Configuration.Timeout,
            lastModified: data.Configuration.LastModified,
            codeSize: data.Configuration.CodeSize,
            arn: data.Configuration.FunctionArn,
            status: 'Active',
          });
        } catch (err) {
          console.error(`Error fetching ${functionName}:`, err.message);
          agents.push({
            id: functionName,
            name: functionName,
            category,
            status: 'Error',
            error: err.message,
          });
        }
      }
    }

    res.json({
      total: agents.length,
      agents,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch agents',
      message: err.message,
    });
  }
});

/**
 * GET /api/agents/:functionName/metrics
 * Get CloudWatch metrics for a specific Lambda function
 */
app.get('/api/agents/:functionName/metrics', async (req, res) => {
  const { functionName } = req.params;
  const { period = '3600', startTime, endTime } = req.query;

  try {
    const now = new Date();
    const start = startTime ? new Date(startTime) : new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const end = endTime ? new Date(endTime) : now;

    const params = {
      MetricName: 'Invocations',
      Namespace: 'AWS/Lambda',
      Dimensions: [
        {
          Name: 'FunctionName',
          Value: functionName,
        },
      ],
      StartTime: start,
      EndTime: end,
      Period: parseInt(period),
      Statistics: ['Sum', 'Average'],
    };

    const data = await cloudwatch.getMetricStatistics(params).promise();

    res.json({
      functionName,
      metrics: data.Datapoints || [],
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch metrics',
      message: err.message,
    });
  }
});

/**
 * GET /api/agents/:functionName/logs
 * Get recent logs for a Lambda function
 */
app.get('/api/agents/:functionName/logs', async (req, res) => {
  const { functionName } = req.params;
  const { limit = '50' } = req.query;

  // Note: Full CloudWatch logs access requires additional permissions
  // This is a placeholder for the implementation
  res.json({
    functionName,
    logs: [],
    message: 'Logs endpoint requires CloudWatch Logs permissions configuration',
  });
});

/**
 * POST /api/agents/:functionName/invoke
 * Invoke a Lambda function (for testing/admin)
 */
app.post('/api/agents/:functionName/invoke', async (req, res) => {
  const { functionName } = req.params;
  const { payload = {} } = req.body;

  try {
    const params = {
      FunctionName: functionName,
      Payload: JSON.stringify(payload),
    };

    const data = await lambda.invoke(params).promise();

    res.json({
      functionName,
      invocationId: data.LogResult,
      statusCode: data.StatusCode,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to invoke function',
      message: err.message,
    });
  }
});

/**
 * GET /api/stats
 * Get overall dashboard statistics
 */
app.get('/api/stats', async (req, res) => {
  try {
    let totalFunctions = 0;
    let activeCount = 0;
    let errorCount = 0;

    for (const functionNames of Object.values(LAMBDA_AGENTS)) {
      totalFunctions += functionNames.length;
    }

    res.json({
      totalFunctions,
      activeCount: totalFunctions,
      errorCount,
      categories: Object.keys(LAMBDA_AGENTS).length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: err.message,
    });
  }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════╗`);
  console.log(`║  AWS Agents Dashboard Server                     ║`);
  console.log(`║  Running on http://localhost:${PORT}` + ' '.repeat(PORT.toString().length <= 4 ? 26 : 20) + `║`);
  console.log(`╚════════════════════════════════════════════════════╝\n`);
});
