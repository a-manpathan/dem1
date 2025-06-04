
# Azure Web App Deployment Guide for Healthcare Management System

This comprehensive guide provides step-by-step instructions for deploying and configuring the Healthcare Management System on Azure Web App with production-ready settings.

## Prerequisites

- Active Azure subscription
- Azure CLI installed and configured
- Git installed
- Node.js 18+ and npm installed
- Healthcare Management System source code

## 1. Azure Resource Setup

### 1.1 Login to Azure
```bash
# Login to Azure
az login

# Set default subscription (if you have multiple)
az account set --subscription "your-subscription-id"

# Verify login
az account show
```

### 1.2 Create Resource Group
```bash
# Create resource group
az group create \
  --name healthcare-rg \
  --location "East US 2"

# Verify resource group creation
az group show --name healthcare-rg
```

### 1.3 Create App Service Plan
```bash
# Create App Service Plan (Production-ready tier)
az appservice plan create \
  --name healthcare-plan \
  --resource-group healthcare-rg \
  --sku P1V3 \
  --is-linux

# For development/testing, use B1:
# --sku B1

# Verify App Service Plan
az appservice plan show --name healthcare-plan --resource-group healthcare-rg
```

### 1.4 Create Web App
```bash
# Create Web App with Node.js runtime
az webapp create \
  --name healthcare-app-unique \
  --resource-group healthcare-rg \
  --plan healthcare-plan \
  --runtime "NODE:18-lts"

# Note: Replace 'healthcare-app-unique' with a globally unique name
```

## 2. Application Configuration

### 2.1 Configure Application Settings
```bash
# Set Node.js version
az webapp config appsettings set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --settings WEBSITE_NODE_DEFAULT_VERSION="18.17.0"

# Set build configurations
az webapp config appsettings set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --settings \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    NODE_ENV=production
```

### 2.2 Configure Startup Command
```bash
# Set startup command for the application
az webapp config set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --startup-file "npm start"
```

### 2.3 Enable Continuous Deployment (GitHub)
```bash
# Configure GitHub deployment
az webapp deployment source config \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --repo-url https://github.com/yourusername/healthcare-app \
  --branch main \
  --manual-integration

# For private repositories, you'll need to set up deployment credentials
```

## 3. Build Configuration

### 3.1 Create Production Build Script
Create or update `package.json` with production build scripts:

```json
{
  "scripts": {
    "build": "vite build",
    "start": "npx serve -s dist -l 8080",
    "build:azure": "npm ci && npm run build"
  },
  "dependencies": {
    "serve": "^14.2.0"
  }
}
```

### 3.2 Create .deployment file
Create `.deployment` file in project root:

```ini
[config]
command = npm run build:azure
```

### 3.3 Create web.config for URL Rewriting
Create `web.config` in the `public` directory:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## 4. Database Configuration (Optional)

### 4.1 Create Azure Database for PostgreSQL
```bash
# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group healthcare-rg \
  --name healthcare-db-server \
  --location "East US 2" \
  --admin-user healthcare_admin \
  --admin-password "YourSecurePassword123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32

# Create database
az postgres flexible-server db create \
  --resource-group healthcare-rg \
  --server-name healthcare-db-server \
  --database-name healthcare_db
```

### 4.2 Configure Database Connection
```bash
# Set database connection string
az webapp config appsettings set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --settings \
    DATABASE_URL="postgresql://healthcare_admin:YourSecurePassword123!@healthcare-db-server.postgres.database.azure.com:5432/healthcare_db"
```

## 5. Security Configuration

### 5.1 Configure HTTPS
```bash
# Enable HTTPS only
az webapp update \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --https-only true

# Enable minimum TLS version
az webapp config set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --min-tls-version "1.2"
```

### 5.2 Configure Custom Domain (Optional)
```bash
# Map custom domain
az webapp config hostname add \
  --resource-group healthcare-rg \
  --webapp-name healthcare-app-unique \
  --hostname "your-domain.com"

# Enable SSL for custom domain
az webapp config ssl bind \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --certificate-thumbprint <certificate-thumbprint> \
  --ssl-type SNI
```

### 5.3 Environment Variables for Production
```bash
# Set production environment variables
az webapp config appsettings set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --settings \
    REACT_APP_API_URL="https://your-api-endpoint.com" \
    REACT_APP_ENVIRONMENT="production" \
    JWT_SECRET="your-jwt-secret" \
    ENCRYPTION_KEY="your-encryption-key"
```

## 6. Monitoring and Diagnostics

### 6.1 Enable Application Insights
```bash
# Create Application Insights
az monitor app-insights component create \
  --app healthcare-insights \
  --location "East US 2" \
  --resource-group healthcare-rg \
  --application-type web

# Get instrumentation key
az monitor app-insights component show \
  --app healthcare-insights \
  --resource-group healthcare-rg \
  --query instrumentationKey

# Configure App Insights in Web App
az webapp config appsettings set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --settings \
    APPINSIGHTS_INSTRUMENTATIONKEY="your-instrumentation-key"
```

### 6.2 Enable Diagnostic Logging
```bash
# Enable application logging
az webapp log config \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --application-logging true \
  --level information

# Enable web server logging
az webapp log config \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --web-server-logging filesystem
```

## 7. Scaling Configuration

### 7.1 Configure Auto-scaling
```bash
# Create auto-scale profile
az monitor autoscale create \
  --resource-group healthcare-rg \
  --resource healthcare-app-unique \
  --resource-type Microsoft.Web/sites \
  --name healthcare-autoscale \
  --min-count 1 \
  --max-count 5 \
  --count 2

# Add scale-out rule
az monitor autoscale rule create \
  --resource-group healthcare-rg \
  --autoscale-name healthcare-autoscale \
  --condition "Percentage CPU > 70 avg 5m" \
  --scale out 1
```

### 7.2 Configure Health Checks
```bash
# Enable health check
az webapp config set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --health-check-path "/health"
```

## 8. Backup and Disaster Recovery

### 8.1 Configure Automated Backups
```bash
# Create storage account for backups
az storage account create \
  --name healthcarebackupstorage \
  --resource-group healthcare-rg \
  --location "East US 2" \
  --sku Standard_LRS

# Configure backup
az webapp config backup create \
  --resource-group healthcare-rg \
  --webapp-name healthcare-app-unique \
  --backup-name daily-backup \
  --container-url "https://healthcarebackupstorage.blob.core.windows.net/backups" \
  --frequency 1440 \
  --retain-one true \
  --retention 30
```

## 9. Deployment Process

### 9.1 Local Deployment Preparation
```bash
# Build the application locally
npm ci
npm run build

# Test the build
npm run preview
```

### 9.2 Deploy via Git
```bash
# Add Azure as remote repository
az webapp deployment source config-local-git \
  --resource-group healthcare-rg \
  --name healthcare-app-unique

# Get deployment credentials
az webapp deployment list-publishing-credentials \
  --resource-group healthcare-rg \
  --name healthcare-app-unique

# Deploy to Azure
git remote add azure https://healthcare-app-unique.scm.azurewebsites.net/healthcare-app-unique.git
git push azure main
```

### 9.3 Deploy via ZIP
```bash
# Create deployment package
zip -r healthcare-app.zip . -x "node_modules/*" ".git/*"

# Deploy ZIP file
az webapp deploy \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --src-path healthcare-app.zip \
  --type zip
```

## 10. Post-Deployment Configuration

### 10.1 Verify Deployment
```bash
# Check deployment status
az webapp show \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --query state

# Get application URL
az webapp show \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --query defaultHostName
```

### 10.2 Performance Testing
```bash
# Run basic connectivity test
curl -I https://healthcare-app-unique.azurewebsites.net

# Check application logs
az webapp log tail \
  --resource-group healthcare-rg \
  --name healthcare-app-unique
```

### 10.3 SSL/TLS Configuration
```bash
# Verify SSL configuration
az webapp config ssl list \
  --resource-group healthcare-rg

# Force HTTPS redirect
az webapp update \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --https-only true
```

## 11. Troubleshooting Common Issues

### 11.1 Build Failures
```bash
# Check build logs
az webapp log download \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --log-file build-logs.zip

# Debug build process
az webapp config appsettings set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --settings SCM_TRACE_LEVEL=4
```

### 11.2 Application Errors
```bash
# View real-time logs
az webapp log tail \
  --resource-group healthcare-rg \
  --name healthcare-app-unique

# Download application logs
az webapp log download \
  --resource-group healthcare-rg \
  --name healthcare-app-unique
```

### 11.3 Performance Issues
```bash
# Check resource utilization
az webapp show \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --query "{CPU: cpuQuota, Memory: memoryQuota}"

# Scale up if needed
az appservice plan update \
  --name healthcare-plan \
  --resource-group healthcare-rg \
  --sku P2V3
```

## 12. Maintenance and Updates

### 12.1 Regular Maintenance Tasks
```bash
# Update application settings
az webapp config appsettings set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --settings MAINTENANCE_MODE=true

# Restart application
az webapp restart \
  --resource-group healthcare-rg \
  --name healthcare-app-unique
```

### 12.2 Backup Verification
```bash
# List backups
az webapp config backup list \
  --resource-group healthcare-rg \
  --webapp-name healthcare-app-unique

# Test backup restoration
az webapp config backup restore \
  --resource-group healthcare-rg \
  --webapp-name healthcare-app-unique \
  --backup-name "backup-name"
```

## 13. Security Checklist

- [ ] HTTPS enforced
- [ ] TLS 1.2 minimum
- [ ] Application Insights enabled
- [ ] Diagnostic logging configured
- [ ] Auto-scaling rules set
- [ ] Backup strategy implemented
- [ ] Environment variables secured
- [ ] Custom domain configured (if applicable)
- [ ] Database firewall configured
- [ ] Health checks enabled

## 14. Cost Optimization

### 14.1 Monitor Costs
```bash
# Set up budget alerts
az consumption budget create \
  --budget-name healthcare-budget \
  --amount 100 \
  --resource-group healthcare-rg \
  --time-grain Monthly
```

### 14.2 Optimize Resources
- Use B-series VMs for development
- Implement auto-scaling to reduce costs
- Use Azure Reserved Instances for production
- Monitor and optimize database usage

This deployment guide ensures a production-ready Healthcare Management System on Azure with proper security, monitoring, and scalability configurations.
