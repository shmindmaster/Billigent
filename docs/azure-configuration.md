# Azure Services Configuration Guide

This document outlines the configuration required for Azure services integration in Billigent.

## 🔐 **Required Environment Variables**

### Azure OpenAI Configuration
```bash
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
```

### Azure AI Search Configuration
```bash
AZURE_SEARCH_ENDPOINT=https://your-search-service.search.windows.net
AZURE_SEARCH_API_KEY=your-search-api-key-here
AZURE_SEARCH_INDEX_NAME=clinical-documents
```

### Azure Data Lake Configuration (for FHIR data ingestion)
```bash
AZURE_STORAGE_ACCOUNT_NAME=yourstorageaccount
AZURE_STORAGE_ACCOUNT_KEY=your-storage-account-key
AZURE_STORAGE_CONTAINER_NAME=fhir-data
```

### Azure SQL Database (for operational working sets)
```bash
AZURE_SQL_SERVER=your-sql-server.database.windows.net
AZURE_SQL_DATABASE=your-database-name
AZURE_SQL_USER=your-username
AZURE_SQL_PASSWORD=your-password
# Or use Managed Identity (leave user/password empty)
```

### Azure Redis Cache
```bash
AZURE_REDIS_HOST=your-redis-host.redis.cache.windows.net
AZURE_REDIS_PORT=6380
AZURE_REDIS_SSL=true
AZURE_REDIS_PASSWORD=your-redis-password
```

### Azure Cosmos DB
```bash
AZURE_COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
AZURE_COSMOS_KEY=your-cosmos-key
AZURE_COSMOS_DATABASE=billigent
AZURE_COSMOS_CONTAINER=evidence-bundles
```

## 🚀 **Setup Instructions**

### 1. Azure OpenAI Setup
1. Create an Azure OpenAI resource in your Azure portal
2. Deploy the required models:
   - GPT-4o-mini for text generation
   - text-embedding-3-small for embeddings
3. Copy the endpoint and API key to your environment variables

### 2. Azure AI Search Setup
1. Create an Azure AI Search service
2. Create a search index with the following schema:
   ```json
   {
     "name": "clinical-documents",
     "fields": [
       {
         "name": "id",
         "type": "Edm.String",
         "key": true
       },
       {
         "name": "content",
         "type": "Edm.String",
         "searchable": true,
         "analyzer": "en.microsoft"
       },
       {
         "name": "vector",
         "type": "Collection(Edm.Single)",
         "dimensions": 1536,
         "vectorSearchProfile": "my-vector-profile"
       },
       {
         "name": "metadata",
         "type": "Edm.String",
         "searchable": false
       }
     ],
     "vectorSearch": {
       "profiles": [
         {
           "name": "my-vector-profile",
           "algorithm": "hnsw"
         }
       ]
     }
   }
   ```

### 3. Azure SQL Database Setup
1. **Create SQL Server** (if not exists):
   ```bash
   az sql server create \
     --name billigent-sql-dev \
     --resource-group rg-billigent-dev-eus2 \
     --location eastus2 \
     --admin-user your-admin-username \
     --admin-password your-admin-password
   ```

2. **Create Database**:
   ```bash
   az sql db create \
     --name billigent \
     --resource-group rg-billigent-dev-eus2 \
     --server billigent-sql-dev \
     --edition Standard \
     --capacity 10
   ```

3. **Configure Firewall Rules**:
   ```bash
   az sql server firewall-rule create \
     --resource-group rg-billigent-dev-eus2 \
     --server billigent-sql-dev \
     --name AllowAzureServices \
     --start-ip-address 0.0.0.0 \
     --end-ip-address 0.0.0.0
   ```

4. **Enable Managed Identity** (optional):
   ```bash
   az sql server update \
     --resource-group rg-billigent-dev-eus2 \
     --name billigent-sql-dev \
     --identity-type SystemAssigned
   ```

### 4. Azure Cosmos DB Setup
1. **Create Cosmos DB Account**:
   ```bash
   az cosmosdb create \
     --name billigent-cosmos-dev \
     --resource-group rg-billigent-dev-eus2 \
     --locations regionName=eastus2 failoverPriority=0 isZoneRedundant=false \
     --capabilities EnableServerless \
     --default-consistency-level Session \
     --enable-analytical-storage true
   ```

2. **Create Database**:
   ```bash
   az cosmosdb sql database create \
     --account-name billigent-cosmos-dev \
     --resource-group rg-billigent-dev-eus2 \
     --name billigent
   ```

3. **Create Containers**:
   ```bash
   # Evidence bundles container
   az cosmosdb sql container create \
     --account-name billigent-cosmos-dev \
     --resource-group rg-billigent-dev-eus2 \
     --database-name billigent \
     --name evidence-bundles \
     --partition-key-path "/patientId"

   # Attribution tracking container
   az cosmosdb sql container create \
     --account-name billigent-cosmos-dev \
     --resource-group rg-billigent-dev-eus2 \
     --database-name billigent \
     --name attribution-tracking \
     --partition-key-path "/bundleId"

   # Document versions container
   az cosmosdb sql container create \
     --account-name billigent-cosmos-dev \
     --resource-group rg-billigent-dev-eus2 \
     --database-name billigent \
     --name document-versions \
     --partition-key-path "/documentId"

   # Collaboration sessions container
   az cosmosdb sql container create \
     --account-name billigent-cosmos-dev \
     --resource-group rg-billigent-dev-eus2 \
     --database-name billigent \
     --name collaboration-sessions \
     --partition-key-path "/sessionId"
   ```

### 5. Azure Data Lake Setup
1. Create an Azure Storage account
2. Enable Data Lake Storage Gen2
3. Create a container for FHIR data
4. Set up appropriate access policies

### 4. Azure SQL Database Setup
1. Create an Azure SQL Database
2. Configure firewall rules
3. Set up authentication (preferably Managed Identity)
4. Run the database migration scripts

### 5. Azure Redis Cache Setup
1. Create an Azure Redis Cache instance
2. Configure SSL and authentication
3. Set up appropriate network security

### 6. Azure Cosmos DB Setup
1. Create a Cosmos DB account
2. Create a database and container
3. Configure throughput and partitioning strategy

## 🔒 **Security Best Practices**

### 1. Use Managed Identity When Possible
- Configure Azure services to use Managed Identity instead of API keys
- This provides automatic credential rotation and better security

### 2. Network Security
- Use Azure Private Link for database connections
- Configure firewall rules to restrict access
- Use VNet integration where possible

### 3. Key Management
- Store sensitive configuration in Azure Key Vault
- Use environment-specific configuration
- Rotate keys regularly

### 4. Access Control
- Follow the principle of least privilege
- Use Azure RBAC for service access
- Monitor access logs

## 📊 **Performance Configuration**

### 1. Connection Pooling
```bash
MAX_CONCURRENT_REQUESTS=100
REQUEST_TIMEOUT=30000
```

### 2. Search Optimization
```bash
SEARCH_TIMEOUT=10000
```

### 3. OpenAI Optimization
```bash
OPENAI_TIMEOUT=60000
```

## 🧪 **Testing Configuration**

### 1. Health Check Endpoint
Test Azure services health at: `/api/strategy/health/azure`

### 2. Mock Data Fallback
Set `ENABLE_MOCK_DATA=true` to fall back to mock data if Azure services are unavailable

### 3. Feature Flags
```bash
ENABLE_AZURE_OPENAI=true
ENABLE_AZURE_SEARCH=true
ENABLE_AZURE_DATA_LAKE=true
```

## 🚨 **Troubleshooting**

### Common Issues

1. **Authentication Errors**
   - Verify API keys and endpoints
   - Check service permissions
   - Ensure Managed Identity is properly configured

2. **Network Connectivity**
   - Verify firewall rules
   - Check VNet configuration
   - Test connectivity from your deployment environment

3. **Performance Issues**
   - Monitor service metrics
   - Check throttling limits
   - Optimize query patterns

4. **Cost Optimization**
   - Monitor usage patterns
   - Set up budget alerts
   - Use appropriate service tiers

## 📈 **Monitoring and Logging**

### 1. Azure Monitor
- Set up metrics collection
- Configure alerting rules
- Monitor service health

### 2. Application Insights
- Track request performance
- Monitor dependencies
- Set up custom metrics

### 3. Log Analytics
- Centralize logging
- Set up queries for troubleshooting
- Configure retention policies

## 🔄 **Deployment**

### 1. Development Environment
- Use local environment variables
- Connect to Azure services directly
- Enable mock data fallback

### 2. Production Environment
- Use Azure Key Vault for secrets
- Configure Managed Identity
- Set up proper monitoring and alerting
- Use Azure DevOps or GitHub Actions for CI/CD

### 3. Environment-Specific Configuration
- Use different service instances per environment
- Configure appropriate scaling rules
- Set up disaster recovery procedures
