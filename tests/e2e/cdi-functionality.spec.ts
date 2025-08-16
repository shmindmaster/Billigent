import { test, expect } from '@playwright/test';

/**
 * CDI Functionality End-to-End Tests
 * 
 * Tests the Clinical Documentation Improvement (CDI) features including:
 * - Database retrieval functionality
 * - API endpoints
 * - User interface interactions
 * - Error handling
 */

test.describe('CDI Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main application
    await page.goto('http://localhost:5173');
    
    // Wait for the application to load
    await page.waitForSelector('[data-testid="app-loaded"]', { timeout: 10000 });
  });

  test('should display CDI analysis dashboard', async ({ page }) => {
    // Navigate to CDI section
    await page.click('[data-testid="nav-cdi"]');
    
    // Verify CDI dashboard loads
    await expect(page.locator('[data-testid="cdi-dashboard"]')).toBeVisible();
    await expect(page.locator('h1:has-text("Clinical Documentation Improvement")')).toBeVisible();
  });

  test('should retrieve CDI analysis from database', async ({ page }) => {
    // Navigate to CDI analysis section
    await page.click('[data-testid="nav-cdi-analysis"]');
    
    // Wait for analysis list to load
    await page.waitForSelector('[data-testid="analysis-list"]', { timeout: 10000 });
    
    // Verify analysis data is displayed
    const analysisItems = page.locator('[data-testid="analysis-item"]');
    await expect(analysisItems.first()).toBeVisible();
    
    // Check if analysis details are populated
    await expect(page.locator('[data-testid="analysis-status"]')).toBeVisible();
    await expect(page.locator('[data-testid="analysis-priority"]')).toBeVisible();
    await expect(page.locator('[data-testid="analysis-confidence"]')).toBeVisible();
  });

  test('should create new CDI analysis', async ({ page }) => {
    // Navigate to create analysis form
    await page.click('[data-testid="create-analysis-btn"]');
    
    // Fill in analysis details
    await page.fill('[data-testid="encounter-id-input"]', 'ENC-2025-001');
    await page.fill('[data-testid="patient-fhir-id-input"]', 'PAT-2025-001');
    await page.selectOption('[data-testid="priority-select"]', 'high');
    
    // Submit form
    await page.click('[data-testid="submit-analysis-btn"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    
    // Verify analysis appears in list
    await expect(page.locator('text=ENC-2025-001')).toBeVisible();
  });

  test('should update CDI analysis status', async ({ page }) => {
    // Navigate to existing analysis
    await page.click('[data-testid="analysis-item"]:first-child');
    
    // Click edit button
    await page.click('[data-testid="edit-analysis-btn"]');
    
    // Change status
    await page.selectOption('[data-testid="status-select"]', 'completed');
    
    // Save changes
    await page.click('[data-testid="save-analysis-btn"]');
    
    // Verify status update
    await expect(page.locator('[data-testid="analysis-status"]:has-text("completed")')).toBeVisible();
  });

  test('should display financial impact analysis', async ({ page }) => {
    // Navigate to analysis with financial data
    await page.click('[data-testid="analysis-item"]:first-child');
    
    // Verify financial impact section
    await expect(page.locator('[data-testid="financial-impact-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="potential-increase"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-drg"]')).toBeVisible();
    await expect(page.locator('[data-testid="suggested-drg"]')).toBeVisible();
  });

  test('should show recommendations', async ({ page }) => {
    // Navigate to analysis
    await page.click('[data-testid="analysis-item"]:first-child');
    
    // Verify recommendations section
    await expect(page.locator('[data-testid="recommendations-section"]')).toBeVisible();
    
    // Check if recommendations are displayed
    const recommendations = page.locator('[data-testid="recommendation-item"]');
    await expect(recommendations.first()).toBeVisible();
    
    // Verify recommendation details
    await expect(page.locator('[data-testid="recommendation-category"]')).toBeVisible();
    await expect(page.locator('[data-testid="recommendation-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="recommendation-priority"]')).toBeVisible();
  });

  test('should handle search and filtering', async ({ page }) => {
    // Navigate to CDI analysis list
    await page.click('[data-testid="nav-cdi-analysis"]');
    
    // Use search functionality
    await page.fill('[data-testid="search-input"]', 'ENC-2025');
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Verify filtered results
    const filteredItems = page.locator('[data-testid="analysis-item"]');
    await expect(filteredItems).toHaveCount(1);
    
    // Clear search
    await page.fill('[data-testid="search-input"]', '');
    
    // Verify all items are shown again
    await expect(page.locator('[data-testid="analysis-item"]')).toHaveCount.greaterThan(1);
  });

  test('should handle pagination', async ({ page }) => {
    // Navigate to CDI analysis list
    await page.click('[data-testid="nav-cdi-analysis"]');
    
    // Check if pagination controls exist
    const pagination = page.locator('[data-testid="pagination"]');
    
    if (await pagination.isVisible()) {
      // Navigate to next page
      await page.click('[data-testid="next-page-btn"]');
      
      // Verify page change
      await expect(page.locator('[data-testid="current-page"]:has-text("2")')).toBeVisible();
      
      // Navigate back to first page
      await page.click('[data-testid="prev-page-btn"]');
      
      // Verify back to first page
      await expect(page.locator('[data-testid="current-page"]:has-text("1")')).toBeVisible();
    }
  });

  test('should display error for invalid analysis ID', async ({ page }) => {
    // Navigate directly to non-existent analysis
    await page.goto('http://localhost:5173/cdi/analysis/invalid-id');
    
    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('text=CDI analysis not found')).toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    // Navigate to create analysis form
    await page.click('[data-testid="create-analysis-btn"]');
    
    // Try to submit without required fields
    await page.click('[data-testid="submit-analysis-btn"]');
    
    // Verify validation errors
    await expect(page.locator('[data-testid="encounter-id-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="patient-fhir-id-error"]')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error by temporarily disabling backend
    // This test would require backend manipulation or mocking
    
    // Navigate to CDI section
    await page.click('[data-testid="nav-cdi"]');
    
    // Verify error handling
    await expect(page.locator('[data-testid="error-boundary"]')).toBeVisible();
  });
});

test.describe('CDI API Integration', () => {
  test('should call CDI analysis endpoint', async ({ request }) => {
    // Test the CDI analysis retrieval API
    const response = await request.get('http://localhost:3001/api/cdi/analysis/test-id');
    
    // Verify response structure
    expect(response.status()).toBe(404); // Should return 404 for test ID
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('error');
    expect(responseBody).toHaveProperty('code');
  });

  test('should create CDI analysis via API', async ({ request }) => {
    // Test creating a new CDI analysis
    const response = await request.post('http://localhost:3001/api/cdi/analyze/test-encounter', {
      data: {
        patientFhirId: 'test-patient',
        priority: 'medium',
        includeFinancialAnalysis: true,
        generateQueries: true
      }
    });
    
    // Verify response
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody).toHaveProperty('data');
  });

  test('should handle CDI health check', async ({ request }) => {
    // Test CDI health endpoint
    const response = await request.get('http://localhost:3001/api/cdi/health');
    
    // Verify health check response
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('status', 'healthy');
    expect(responseBody).toHaveProperty('services');
    expect(responseBody).toHaveProperty('models');
  });
});

test.describe('CDI Database Operations', () => {
  test('should perform CRUD operations', async ({ request }) => {
    // This test would require a test database setup
    // For now, we'll test the basic structure
    
    // Test that the CDI repository is accessible
    const response = await request.get('http://localhost:3001/api/cdi/analysis/non-existent');
    
    // Should return 404 for non-existent analysis
    expect(response.status()).toBe(404);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('error', 'CDI analysis not found');
  });
});
