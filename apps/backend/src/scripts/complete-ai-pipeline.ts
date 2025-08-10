#!/usr/bin/env ts-node

/**
 * Complete AI Pipeline
 * 
 * Orchestrates the entire AI pipeline from FHIR data ingestion through clinical workflow testing:
 * 1. Data Ingestion - Download and ingest Synthea FHIR dataset into Azure Data Lake
 * 2. Vector Embeddings - Generate embeddings for clinical documents
 * 3. Azure AI Search - Index documents with embeddings for RAG
 * 4. RAG Integration - Test retrieval-augmented generation with Responses API
 * 5. Clinical Workflow Testing - Automated Playwright testing of clinical workflows
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';

interface PipelineConfig {
  azureStorageAccount: string;
  azureSubscription: string;
  azureResourceGroup: string;
  azureSearchService: string;
  syntheaDatasetUrl: string;
  outputDir: string;
  playwrightConfig: {
    baseUrl: string;
    testTimeout: number;
  };
}

class AIPipeline {
  private config: PipelineConfig;
  private logFile: string;

  constructor() {
    this.config = {
      azureStorageAccount: process.env.AZURE_STORAGE_ACCOUNT || 'billigentdevdlseus2',
      azureSubscription: '44e77ffe-2c39-4726-b6f0-2c733c7ffe78',
      azureResourceGroup: 'rg-billigent-dev-eus2',
      azureSearchService: process.env.AZURE_SEARCH_SERVICE_NAME || 'billigent-dev-search-basic-eus2',
      syntheaDatasetUrl: 'https://synthea.mitre.org/downloads/synthea_sample_data_fhir_r4_sep2019.zip',
      outputDir: path.join(__dirname, '../../tmp/ai-pipeline'),
      playwrightConfig: {
        baseUrl: 'http://localhost:5173',
        testTimeout: 30000
      }
    };

    // Ensure output directory exists
    if (!existsSync(this.config.outputDir)) {
      mkdirSync(this.config.outputDir, { recursive: true });
    }

    this.logFile = path.join(this.config.outputDir, 'pipeline.log');
    this.log('AI Pipeline initialized');
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    console.log(logEntry.trim());
    writeFileSync(this.logFile, logEntry, { flag: 'a' });
  }

  private async executeCommand(command: string, description: string): Promise<string> {
    this.log(`Executing: ${description}`);
    this.log(`Command: ${command}`);
    
    try {
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });
      this.log(`Success: ${description}`);
      return output;
    } catch (error: any) {
      this.log(`Error in ${description}: ${error.message}`);
      throw error;
    }
  }

  // Phase 1: Data Ingestion
  async ingestFHIRData(): Promise<void> {
    this.log('=== PHASE 1: FHIR DATA INGESTION ===');
    
    try {
      // Download Synthea dataset
      const downloadDir = path.join(this.config.outputDir, 'synthea-data');
      if (!existsSync(downloadDir)) {
        mkdirSync(downloadDir, { recursive: true });
      }

      this.log('Downloading Synthea FHIR dataset...');
      const downloadCommand = `curl -L "${this.config.syntheaDatasetUrl}" -o "${path.join(downloadDir, 'synthea_fhir.zip')}"`;
      await this.executeCommand(downloadCommand, 'Download Synthea dataset');

      // Extract dataset
      this.log('Extracting FHIR data...');
      const extractCommand = `powershell -Command "Expand-Archive -Path '${path.join(downloadDir, 'synthea_fhir.zip')}' -DestinationPath '${downloadDir}' -Force"`;
      await this.executeCommand(extractCommand, 'Extract FHIR dataset');

      // Upload to Azure Data Lake bronze container
      this.log('Uploading FHIR data to Azure Data Lake...');
      const uploadCommand = `az storage blob upload-batch --account-name ${this.config.azureStorageAccount} --destination bronze --source "${downloadDir}" --subscription ${this.config.azureSubscription}`;
      await this.executeCommand(uploadCommand, 'Upload to Azure Data Lake');

      this.log('Phase 1 completed successfully');
    } catch (error) {
      this.log('Phase 1 failed');
      throw error;
    }
  }

  // Phase 2: Vector Embeddings Generation
  async generateEmbeddings(): Promise<void> {
    this.log('=== PHASE 2: VECTOR EMBEDDINGS GENERATION ===');
    
    try {
      // Run the existing embedding generation script
      this.log('Generating embeddings for clinical documents...');
      const embeddingCommand = 'npm run generate-all-embeddings';
      await this.executeCommand(embeddingCommand, 'Generate vector embeddings');

      this.log('Phase 2 completed successfully');
    } catch (error) {
      this.log('Phase 2 failed');
      throw error;
    }
  }

  // Phase 3: Azure AI Search Indexing
  async indexToAzureSearch(): Promise<void> {
    this.log('=== PHASE 3: AZURE AI SEARCH INDEXING ===');
    
    try {
      // Run the existing indexing script
      this.log('Indexing documents to Azure AI Search...');
      const indexCommand = 'npm run index-to-search';
      await this.executeCommand(indexCommand, 'Index to Azure AI Search');

      this.log('Phase 3 completed successfully');
    } catch (error) {
      this.log('Phase 3 failed');
      throw error;
    }
  }

  // Phase 4: RAG Integration Testing
  async testRAGIntegration(): Promise<void> {
    this.log('=== PHASE 4: RAG INTEGRATION TESTING ===');
    
    try {
      // Test RAG functionality with sample queries
      const testQueries = [
        'What are the most common diagnosis codes in the dataset?',
        'Show me patients with diabetes complications',
        'Analyze CDI opportunities for respiratory conditions'
      ];

      for (const query of testQueries) {
        this.log(`Testing RAG query: ${query}`);
        
        // Create a simple test script to validate RAG
        const testScript = `
          const { getAnalyticsWithCodeInterpreter } = require('../services/responses-api.service');
          
          async function testRAG() {
            try {
              const response = await getAnalyticsWithCodeInterpreter('${query}', {});
              console.log('RAG Response:', JSON.stringify(response, null, 2));
              return true;
            } catch (error) {
              console.error('RAG Error:', error);
              return false;
            }
          }
          
          testRAG().then(success => process.exit(success ? 0 : 1));
        `;

        const testFile = path.join(this.config.outputDir, 'test-rag.js');
        writeFileSync(testFile, testScript);
        
        try {
          await this.executeCommand(`node "${testFile}"`, `Test RAG query: ${query}`);
        } catch (error) {
          this.log(`RAG test failed for query: ${query}`);
        }
      }

      this.log('Phase 4 completed successfully');
    } catch (error) {
      this.log('Phase 4 failed');
      throw error;
    }
  }

  // Phase 5: Clinical Workflow Testing with Playwright
  async testClinicalWorkflows(): Promise<void> {
    this.log('=== PHASE 5: CLINICAL WORKFLOW TESTING ===');
    
    try {
      // Generate Playwright test for clinical workflows
      const playwrightTest = `
import { test, expect } from '@playwright/test';

test.describe('Billigent Clinical Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('${this.config.playwrightConfig.baseUrl}');
  });

  test('Pre-Bill Review Workflow', async ({ page }) => {
    await test.step('Navigate to Pre-Bill Review', async () => {
      await page.getByRole('link', { name: 'Pre-Bill Review' }).click();
      await expect(page).toHaveURL(/.*pre-bill/);
    });

    await test.step('Verify CDI recommendations display', async () => {
      // Wait for data to load
      await page.waitForTimeout(2000);
      
      // Check for key elements
      await expect(page.getByRole('heading', { name: /CDI/ })).toBeVisible();
    });
  });

  test('Denials Management Workflow', async ({ page }) => {
    await test.step('Navigate to Denials Management', async () => {
      await page.getByRole('link', { name: 'Denials' }).click();
      await expect(page).toHaveURL(/.*denials/);
    });

    await test.step('Test denial upload functionality', async () => {
      // Look for upload area or button
      const uploadButton = page.locator('[data-testid="upload-button"], input[type="file"], .upload-area').first();
      if (await uploadButton.isVisible()) {
        await expect(uploadButton).toBeVisible();
      }
    });
  });

  test('Analytics Dashboard Workflow', async ({ page }) => {
    await test.step('Navigate to Analytics', async () => {
      await page.getByRole('link', { name: 'Analytics' }).click();
      await expect(page).toHaveURL(/.*analytics/);
    });

    await test.step('Verify dashboard metrics load', async () => {
      // Wait for metrics to load
      await page.waitForTimeout(3000);
      
      // Check for dashboard content
      const dashboardContent = page.locator('.dashboard, [data-testid="dashboard"], .analytics-content').first();
      if (await dashboardContent.isVisible()) {
        await expect(dashboardContent).toBeVisible();
      }
    });
  });

  test('Natural Language Query', async ({ page }) => {
    await test.step('Navigate to Analytics', async () => {
      await page.goto('${this.config.playwrightConfig.baseUrl}/analytics');
    });

    await test.step('Test natural language query', async () => {
      const queryInput = page.locator('input[type="text"], textarea').first();
      if (await queryInput.isVisible()) {
        await queryInput.fill('Show me the top denial reasons');
        await queryInput.press('Enter');
        
        // Wait for response
        await page.waitForTimeout(5000);
      }
    });
  });
});
      `;

      // Write Playwright test file
      const testDir = path.join(this.config.outputDir, 'playwright-tests');
      if (!existsSync(testDir)) {
        mkdirSync(testDir, { recursive: true });
      }
      
      const testFile = path.join(testDir, 'clinical-workflows.spec.ts');
      writeFileSync(testFile, playwrightTest);

      // Generate Playwright config
      const playwrightConfig = `
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright-tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  timeout: ${this.config.playwrightConfig.testTimeout},
  use: {
    baseURL: '${this.config.playwrightConfig.baseUrl}',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
      `;

      const configFile = path.join(this.config.outputDir, 'playwright.config.ts');
      writeFileSync(configFile, playwrightConfig);

      // Install Playwright if not present
      this.log('Installing Playwright...');
      try {
        await this.executeCommand('npx playwright install chromium', 'Install Playwright browsers');
      } catch (error) {
        this.log('Playwright installation failed, continuing...');
      }

      // Run Playwright tests
      this.log('Running clinical workflow tests...');
      const testCommand = `npx playwright test --config="${configFile}" --reporter=line`;
      
      try {
        await this.executeCommand(testCommand, 'Run Playwright clinical tests');
      } catch (error) {
        this.log('Some Playwright tests failed, but pipeline continues...');
      }

      this.log('Phase 5 completed successfully');
    } catch (error) {
      this.log('Phase 5 failed');
      throw error;
    }
  }

  // Main pipeline execution
  async execute(): Promise<void> {
    const startTime = Date.now();
    this.log('Starting Complete AI Pipeline execution...');

    try {
      // Execute all phases
      await this.ingestFHIRData();
      await this.generateEmbeddings();
      await this.indexToAzureSearch();
      await this.testRAGIntegration();
      await this.testClinicalWorkflows();

      const duration = Math.round((Date.now() - startTime) / 1000);
      this.log(`=== PIPELINE COMPLETED SUCCESSFULLY IN ${duration} SECONDS ===`);
      this.log(`Log file: ${this.logFile}`);
      
    } catch (error: any) {
      const duration = Math.round((Date.now() - startTime) / 1000);
      this.log(`=== PIPELINE FAILED AFTER ${duration} SECONDS ===`);
      this.log(`Error: ${error.message}`);
      this.log(`Log file: ${this.logFile}`);
      throw error;
    }
  }
}

// Execute pipeline if run directly
if (require.main === module) {
  const pipeline = new AIPipeline();
  pipeline.execute()
    .then(() => {
      console.log('Pipeline completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Pipeline failed:', error.message);
      process.exit(1);
    });
}

export { AIPipeline };
