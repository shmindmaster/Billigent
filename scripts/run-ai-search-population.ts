/**
 * Run AI Search Population Script
 * 
 * This script executes the AI Search population process to index clinical knowledge
 * from the Azure Data Lake for use in RAG (Retrieval-Augmented Generation) queries.
 * 
 * Usage: npm run populate-ai-search
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as winston from 'winston';

const execAsync = promisify(exec);

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'ai-search-population.log' })
  ]
});

/**
 * Main execution function
 */
async function runAISearchPopulation() {
  try {
    logger.info('Starting AI Search population process...');
    logger.info('This will index clinical knowledge from Azure Data Lake into AI Search');

    // Check if all required environment variables are set
    const requiredEnvVars = [
      'AZURE_OPENAI_ENDPOINT',
      'AZURE_OPENAI_KEY', 
      'AZURE_SEARCH_ENDPOINT',
      'AZURE_SEARCH_KEY',
      'AZURE_STORAGE_ACCOUNT',
      'AZURE_STORAGE_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      logger.error('Missing required environment variables:', missingVars);
      logger.error('Please ensure all Azure service credentials are configured in .env files');
      process.exit(1);
    }

    logger.info('Environment variables validated ✓');

    // Build the TypeScript files first
    logger.info('Building TypeScript files...');
    try {
      const { stdout: buildStdout } = await execAsync('npx tsc --build', {
        cwd: process.cwd()
      });
      logger.info('TypeScript build completed ✓');
      if (buildStdout) {
        logger.info('Build output:', buildStdout);
      }
    } catch (buildError: any) {
      logger.warn('TypeScript build had warnings/errors:', buildError.stdout || buildError.message);
      // Continue execution as this might just be warnings
    }

    // Execute the AI Search population script
    logger.info('Executing AI Search population script...');
    logger.info('This process may take several minutes depending on data volume...');

    const startTime = Date.now();

    const { stdout, stderr } = await execAsync(
      'npx tsx src/scripts/populate-ai-search.ts',
      {
        cwd: './apps/backend',
        timeout: 30 * 60 * 1000, // 30 minutes timeout
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large outputs
      }
    );

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    logger.info(`AI Search population completed successfully in ${duration} seconds ✓`);

    if (stdout) {
      logger.info('Script output:');
      console.log(stdout);
    }

    if (stderr) {
      logger.warn('Script warnings:');
      console.warn(stderr);
    }

    logger.info('Clinical knowledge index is now ready for RAG queries');
    logger.info('You can now test the enhanced CDI workflow with real clinical data');

  } catch (error: any) {
    logger.error('AI Search population failed:', error.message);
    
    if (error.stdout) {
      logger.error('Error output:', error.stdout);
    }
    
    if (error.stderr) {
      logger.error('Error details:', error.stderr);
    }

    logger.error('Troubleshooting steps:');
    logger.error('1. Verify Azure service credentials in .env files');
    logger.error('2. Check Azure service status and quotas');
    logger.error('3. Ensure Data Lake contains FHIR data in silver/fhir/ directory');
    logger.error('4. Verify network connectivity to Azure services');

    process.exit(1);
  }
}

/**
 * Validate environment setup
 */
function validateEnvironment() {
  logger.info('Validating environment setup...');

  // Check Node.js version
  const nodeVersion = process.version;
  logger.info(`Node.js version: ${nodeVersion}`);

  // Check working directory
  const cwd = process.cwd();
  logger.info(`Working directory: ${cwd}`);

  // Check if we're in the correct project structure
  const fs = require('fs');
  const requiredFiles = [
    'package.json',
    'apps/backend/package.json',
    'apps/backend/src/scripts/populate-ai-search.ts'
  ];

  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    logger.error('Missing required files:', missingFiles);
    logger.error('Please ensure you are running this script from the project root directory');
    process.exit(1);
  }

  logger.info('Environment validation completed ✓');
}

/**
 * Display help information
 */
function displayHelp() {
  console.log(`
AI Search Population Script
===========================

This script populates Azure AI Search with clinical knowledge from Azure Data Lake
to enable Retrieval-Augmented Generation (RAG) for the CDI workflow.

Prerequisites:
- Azure OpenAI service configured with gpt-5-mini and text-embedding-3-large
- Azure AI Search service (Basic tier or higher)
- Azure Data Lake Storage with FHIR data in silver/fhir/ directory
- Environment variables configured in .env files

Usage:
  npm run populate-ai-search
  node scripts/run-ai-search-population.js
  npx tsx scripts/run-ai-search-population.ts

Environment Variables Required:
- AZURE_OPENAI_ENDPOINT
- AZURE_OPENAI_KEY
- AZURE_SEARCH_ENDPOINT
- AZURE_SEARCH_KEY
- AZURE_STORAGE_ACCOUNT
- AZURE_STORAGE_KEY

Process:
1. Validates environment setup
2. Builds TypeScript files
3. Executes AI Search population script
4. Indexes clinical knowledge for RAG queries

Expected Duration: 5-15 minutes depending on data volume
`);
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  displayHelp();
  process.exit(0);
}

// Main execution
(async () => {
  logger.info('='.repeat(60));
  logger.info('AI SEARCH POPULATION SCRIPT');
  logger.info('='.repeat(60));

  validateEnvironment();
  await runAISearchPopulation();

  logger.info('='.repeat(60));
  logger.info('POPULATION COMPLETED SUCCESSFULLY');
  logger.info('='.repeat(60));
})().catch(error => {
  logger.error('Unexpected error:', error);
  process.exit(1);
});
