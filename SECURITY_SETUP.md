# 🔐 Security Notice: Azure Resource Configuration

## ✅ GitHub Security Compliance

This repository follows security best practices:

- **No Secrets in Git**: All sensitive API keys and secrets are excluded from version control
- **Placeholder Values Only**: Committed `.env` files contain only safe placeholder values
- **Local Development Ready**: Working configurations are preserved in `.env.local` files (gitignored)

## 🚀 Quick Start for Development

1. **Backend is Ready**: The `.env.local` file already contains working Azure resource configurations
2. **Start Backend**: `cd apps/backend && pnpm dev` (will use .env.local automatically)
3. **Start Frontend**: `cd apps/frontend && pnpm dev`

## 📋 Azure Resources Configured

All development resources in the `rg-billigent-dev-eus2` resource group are connected:

- ✅ Azure OpenAI (`billigent-dev-openai-eus2`)
- ✅ Azure AI Search (`billigent-dev-search-basic-eus2`)
- ✅ Azure Storage (`billigentdevdlseus2`)
- ✅ Azure SQL (`billigent-dev-sql-eus2`)
- ✅ Azure Key Vault (`billigent-dev-kv-eus2`)

## 🔧 Environment File Structure

```
apps/backend/
├── .env              # Safe placeholder values (committed to git)
├── .env.local        # Real API keys and secrets (gitignored)
├── .env.example      # Template for new developers
└── .env.local.example # Template with placeholders
```

**Node.js automatically prioritizes `.env.local` over `.env`**, so your development environment will use the real credentials while keeping the repository secure.

---

This approach ensures:

- ✅ No accidental secret exposure in git history
- ✅ Working development environment out of the box
- ✅ GitHub security compliance
- ✅ Easy onboarding for new developers
