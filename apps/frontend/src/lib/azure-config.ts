/**
 * Azure Configuration Service
 * Centralized configuration management for Azure services
 */

interface AzureConfiguration {
  // Azure SQL Database
  sqlServer: string;
  sqlDatabase: string;
  sqlUsername: string;
  sqlPassword: string;
  
  // Azure OpenAI
  openaiEndpoint: string;
  openaiApiKey: string;
  openaiDeploymentName: string;
  
  // Azure AI Search
  searchEndpoint: string;
  searchApiKey: string;
  searchIndexName: string;
  
  // Azure Data Lake
  dataLakeAccountName: string;
  dataLakeAccountKey: string;
  dataLakeContainerName: string;
  
  // Application Settings
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
}

class AzureConfigService {
  private config: AzureConfiguration;

  constructor() {
    this.config = this.loadConfiguration();
  }

  private loadConfiguration(): AzureConfiguration {
    // Load from environment variables with fallbacks
    return {
      // Azure SQL Database
      sqlServer: this.getEnvVar('VITE_AZURE_SQL_SERVER', 'localhost'),
      sqlDatabase: this.getEnvVar('VITE_AZURE_SQL_DATABASE', 'billigent'),
      sqlUsername: this.getEnvVar('VITE_AZURE_SQL_USERNAME', 'sa'),
      sqlPassword: this.getEnvVar('VITE_AZURE_SQL_PASSWORD', 'YourPassword123!'),
      
      // Azure OpenAI (Responses or standard)
      openaiEndpoint: this.getEnvVar('VITE_AZURE_OPENAI_RESPONSES_ENDPOINT', this.getEnvVar('VITE_AZURE_OPENAI_ENDPOINT', '')),
      openaiApiKey: this.getEnvVar('VITE_AZURE_OPENAI_API_KEY', ''),
      openaiDeploymentName: this.getEnvVar('VITE_AZURE_OPENAI_DEPLOYMENT_NAME', 'gpt-4'),
      
      // Azure AI Search
      searchEndpoint: this.getEnvVar('VITE_AZURE_SEARCH_ENDPOINT', ''),
      searchApiKey: this.getEnvVar('VITE_AZURE_SEARCH_API_KEY', ''),
      searchIndexName: this.getEnvVar('VITE_AZURE_SEARCH_INDEX_NAME', 'clinical-documents'),
      
      // Azure Data Lake
      dataLakeAccountName: this.getEnvVar('VITE_AZURE_DATALAKE_ACCOUNT_NAME', ''),
      dataLakeAccountKey: this.getEnvVar('VITE_AZURE_DATALAKE_ACCOUNT_KEY', ''),
      dataLakeContainerName: this.getEnvVar('VITE_AZURE_DATALAKE_CONTAINER_NAME', 'clinical-data'),
      
      // Application Settings
      environment: (this.getEnvVar('VITE_NODE_ENV', 'development') as 'development' | 'staging' | 'production'),
      apiBaseUrl: this.getEnvVar('VITE_API_BASE_URL', this.getEnvVar('VITE_API_BASE', 'http://localhost:3001')),
    };
  }

  private getEnvVar(key: string, defaultValue: string = ''): string {
    // Try Vite environment variables first
    if ((import.meta as any)?.env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
    
    // Try process.env for Node.js environments
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
    
    return defaultValue;
  }

  /**
   * Get the complete configuration object
   */
  getConfig(): AzureConfiguration {
    return { ...this.config };
  }

  /**
   * Get SQL Database configuration
   */
  getSqlConfig() {
    return {
      server: this.config.sqlServer,
      database: this.config.sqlDatabase,
      username: this.config.sqlUsername,
      password: this.config.sqlPassword,
    };
  }

  /**
   * Get Azure OpenAI configuration
   */
  getOpenAIConfig() {
    return {
      endpoint: this.config.openaiEndpoint,
      apiKey: this.config.openaiApiKey,
      deploymentName: this.config.openaiDeploymentName,
    };
  }

  /**
   * Get Azure AI Search configuration
   */
  getSearchConfig() {
    return {
      endpoint: this.config.searchEndpoint,
      apiKey: this.config.searchApiKey,
      indexName: this.config.searchIndexName,
    };
  }

  /**
   * Get Azure Data Lake configuration
   */
  getDataLakeConfig() {
    return {
      accountName: this.config.dataLakeAccountName,
      accountKey: this.config.dataLakeAccountKey,
      containerName: this.config.dataLakeContainerName,
    };
  }

  /**
   * Check if running in production environment
   */
  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  /**
   * Check if running in development environment
   */
  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  /**
   * Validate required configuration values
   */
  validateConfig(): { valid: boolean; missing: string[] } {
    const requiredFields: (keyof AzureConfiguration)[] = [
      'sqlServer',
      'sqlDatabase',
      'openaiEndpoint',
      'openaiApiKey',
      'searchEndpoint',
      'searchApiKey',
    ];

    const missing: string[] = [];

    for (const field of requiredFields) {
      if (!this.config[field] || this.config[field] === '') {
        missing.push(field);
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }
}

// Create singleton instance
export const azureConfig = new AzureConfigService();

// Export types
export type { AzureConfiguration };
export { AzureConfigService };