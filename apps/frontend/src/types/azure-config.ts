export interface AzureConfiguration {
  // Azure Cosmos DB
  cosmosEndpoint: string;
  cosmosKey: string;
  cosmosDatabase: string;
  
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
