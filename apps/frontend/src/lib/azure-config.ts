/**
 * Azure Configuration Service
 * Centralized configuration management for Azure services
 */

import { AzureConfiguration } from '@/types/azure-config';

class AzureConfigService {
  private config: AzureConfiguration;

  constructor() {
    this.config = this.loadConfiguration();
  }

  private loadConfiguration(): AzureConfiguration {
    // Load from environment variables with fallbacks
    return {
      // Azure Cosmos DB
      cosmosEndpoint: this.getEnvVar('VITE_AZURE_COSMOS_ENDPOINT', ''),
      cosmosKey: this.getEnvVar('VITE_AZURE_COSMOS_KEY', ''),
      cosmosDatabase: this.getEnvVar('VITE_AZURE_COSMOS_DATABASE', 'billigent'),
      
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
    if (import.meta.env[key]) {
      return import.meta.env[key] as string;
    }
    
    // Fallback to process.env for Node.js compatibility
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
    
    return defaultValue;
  }

  getConfig(): AzureConfiguration {
    return this.config;
  }
}

export const azureConfig = new AzureConfigService();
export default azureConfig;