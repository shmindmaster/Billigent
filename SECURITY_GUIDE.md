# Billigent Security and Secrets Management Guide

## 🔐 Environment Variables & Secrets Management

### **File Structure for Environment Variables**

```
apps/backend/
├── .env                    # Tracked in git - PLACEHOLDER VALUES ONLY
├── .env.example           # Tracked in git - Documentation
├── .env.local.example     # Tracked in git - Template for actual values
└── .env.local             # NOT tracked - Actual secrets for local development
```

### **Security Rules**

#### ✅ **Safe to Commit (Tracked by Git)**

- `.env` - Contains placeholder values like `your-api-key-here`
- `.env.example` - Documentation of required variables
- `.env.local.example` - Template with placeholder markers `<ACTUAL_VALUE>`

#### ❌ **NEVER Commit (Excluded by .gitignore)**

- `.env.local` - Contains actual API keys and secrets
- Any file with real Azure keys, database passwords, or tokens

### **Setup Instructions**

#### **For Local Development:**

1. Copy the example file:

   ```bash
   cp apps/backend/.env.local.example apps/backend/.env.local
   ```

2. Replace placeholder values in `.env.local` with actual secrets:

   ```bash
   # Replace <ACTUAL_OPENAI_API_KEY> with real key
   AZURE_OPENAI_API_KEY=your-real-api-key-here
   ```

3. **Never commit `.env.local`** - this file is automatically ignored by git

#### **For Production Deployment:**

1. Use Azure Key Vault for secret management
2. Set environment variables in Azure App Service configuration
3. Use managed identities where possible to avoid storing keys

### **Current Azure Resources**

#### **Azure OpenAI (MahumTech Subscription)**

- **Service:** `lawli-ai-hub-east-foundry`
- **Endpoint:** `https://lawli-ai-hub-east-foundry.openai.azure.com/`
- **Models:** GPT-5-mini, text-embedding-3-small

#### **Azure AI Search**

- **Service:** `billigent-dev-search-basic-eus2`
- **Endpoint:** `https://billigent-dev-search-basic-eus2.search.windows.net`
- **SKU:** Basic (15GB storage)

#### **Azure SQL Database**

- **Server:** `billigent-dev-sql-eus2.database.windows.net`
- **Database:** `BilligentAppDev`
- **Username:** `billigentadmindev`

#### **Azure Data Lake Storage**

- **Account:** `billigentdevdlseus2`
- **Container:** `data` (with public blob access for stakeholder review)

### **GitHub Security Features**

#### **Push Protection**

- GitHub automatically scans for secrets in commits
- Blocks pushes containing API keys, passwords, tokens
- **Current Status:** ✅ Active and working properly

#### **Secret Scanning**

- Monitors repository for accidentally committed secrets
- Sends alerts for detected secrets in commit history
- **Resolution:** Remove secrets from code, use environment variables instead

### **Best Practices**

#### **1. Environment Variable Loading**

```typescript
// ✅ GOOD: Use environment variables with validation
constructor(config?: Partial<Config>) {
  this.config = {
    apiKey: process.env.AZURE_OPENAI_API_KEY || config?.apiKey || '',
    endpoint: process.env.AZURE_OPENAI_ENDPOINT || config?.endpoint || '',
    ...config
  };

  // Validate required configuration
  if (!this.config.apiKey) {
    throw new Error('AZURE_OPENAI_API_KEY environment variable is required');
  }
}

// ❌ BAD: Hardcoded secrets as fallbacks
constructor() {
  this.apiKey = process.env.API_KEY || 'sk-1234567890abcdef'; // NEVER DO THIS
}
```

#### **2. Secret Rotation**

- Rotate API keys regularly (monthly recommended)
- Update both Azure resources and local `.env.local` files
- Use Azure Key Vault for automatic rotation in production

#### **3. Development Workflow**

```bash
# 1. Pull latest code
git pull origin main

# 2. Copy environment template (only first time)
cp apps/backend/.env.local.example apps/backend/.env.local

# 3. Add real secrets to .env.local (never committed)
# 4. Develop and test locally
# 5. Commit code changes (secrets stay in .env.local)
git add .
git commit -m "feature: implement new functionality"
git push origin main
```

### **Emergency Procedures**

#### **If Secrets Are Accidentally Committed:**

1. **Immediately rotate the exposed secrets** in Azure portal
2. Update `.env.local` with new secrets
3. Remove secrets from git history:

   ```bash
   # Remove from current commit
   git reset --soft HEAD~1
   git reset HEAD .env
   git commit -m "Remove accidentally committed secrets"

   # Or use git filter-branch for historical commits
   ```

4. Force push to update remote repository
5. Inform team members to pull latest changes

#### **Production Secret Compromise:**

1. Immediately disable compromised keys in Azure
2. Generate new secrets
3. Update production environment variables
4. Monitor for unauthorized access
5. Review audit logs

### **Monitoring & Compliance**

#### **HIPAA Compliance**

- All API keys must be stored securely
- Database connections must use encrypted connections
- Audit trails for all secret access and rotation

#### **Security Monitoring**

- Enable Azure Key Vault logging
- Monitor failed authentication attempts
- Set up alerts for unusual access patterns
- Regular security audits of environment configurations

---

**Remember: When in doubt, DON'T commit it. Secrets should never be in source code.**
