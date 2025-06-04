# Step-by-Step Guide to Deploy Healthcare Management System on Azure

This comprehensive guide provides detailed instructions for deploying the Healthcare Management System on Azure with zero errors.

## Prerequisites

- Active Azure subscription
- Azure CLI installed and configured
- Git installed
- Node.js 18+ and npm installed
- Healthcare Management System source code

## 1. Prepare Your Application

### 1.1 Optimize Build Configuration

First, ensure your `package.json` has the correct build scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "start": "npx serve -s dist"
  },
  "dependencies": {
    "serve": "^14.2.0"
  }
}
```

### 1.2 Create a Web Configuration File

Create a `web.config` file in the `public` directory:

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
    <staticContent>
      <mimeMap fileExtension=".webmanifest" mimeType="application/manifest+json" />
    </staticContent>
  </system.webServer>
</configuration>
```

### 1.3 Test Your Build Locally

```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Test the build locally
npm run preview
```

Verify that everything works correctly before proceeding.

## 2. Set Up Azure Resources

### 2.1 Login to Azure

```bash
# Login to Azure
az login

# Set default subscription (if you have multiple)
az account set --subscription "your-subscription-id"
```

### 2.2 Create Resource Group

```bash
# Create resource group
az group create \
  --name healthcare-rg \
  --location "East US 2"
```

### 2.3 Create App Service Plan

```bash
# Create App Service Plan
az appservice plan create \
  --name healthcare-plan \
  --resource-group healthcare-rg \
  --sku B1 \
  --is-linux
```

### 2.4 Create Web App

```bash
# Create Web App with Node.js runtime
az webapp create \
  --name healthcare-app-unique \
  --resource-group healthcare-rg \
  --plan healthcare-plan \
  --runtime "NODE:18-lts"
```

Replace `healthcare-app-unique` with a globally unique name.

## 3. Configure Web App Settings

### 3.1 Set Node.js Version and Build Configuration

```bash
# Configure application settings
az webapp config appsettings set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --settings \
    WEBSITE_NODE_DEFAULT_VERSION="18.17.0" \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    NODE_ENV=production
```

### 3.2 Configure Startup Command

```bash
# Set startup command
az webapp config set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --startup-file "npm start"
```

### 3.3 Enable HTTPS Only

```bash
# Enable HTTPS only
az webapp update \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --https-only true
```

## 4. Deploy Your Application

Choose one of the following deployment methods:

### 4.1 Deploy via Local Git

```bash
# Configure local Git deployment
az webapp deployment source config-local-git \
  --resource-group healthcare-rg \
  --name healthcare-app-unique

# Get deployment credentials
az webapp deployment list-publishing-credentials \
  --resource-group healthcare-rg \
  --name healthcare-app-unique
```

Note the Git URL and credentials, then:

```bash
# Add Azure as remote repository
git remote add azure <git-url-from-previous-command>

# Push to Azure
git push azure main
```

### 4.2 Deploy via ZIP File (Alternative Method)

```bash
# Build the application
npm ci && npm run build

# Create deployment package
zip -r healthcare-app.zip dist

# Deploy ZIP file
az webapp deploy \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --src-path healthcare-app.zip \
  --type zip
```

### 4.3 Deploy via GitHub Actions (Recommended for CI/CD)

1. Create a `.github/workflows/azure-deploy.yml` file:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'healthcare-app-unique'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ./dist
```

2. Add your publish profile as a GitHub secret:
   - In Azure Portal, go to your Web App
   - Download the publish profile
   - In GitHub repository settings, add a new secret named `AZURE_WEBAPP_PUBLISH_PROFILE` with the content of the downloaded file

## 5. Verify Deployment

### 5.1 Check Deployment Status

```bash
# Check deployment status
az webapp deployment list \
  --resource-group healthcare-rg \
  --name healthcare-app-unique
```

### 5.2 View Logs for Troubleshooting

```bash
# Stream logs
az webapp log tail \
  --resource-group healthcare-rg \
  --name healthcare-app-unique
```

### 5.3 Test Your Application

Visit your application at `https://healthcare-app-unique.azurewebsites.net`

## 6. Common Issues and Solutions

### 6.1 Routing Issues

If you encounter 404 errors when refreshing pages or accessing routes directly:

1. Verify your `web.config` file is correctly placed in the `public` directory
2. Check that the URL rewrite rules are properly configured

### 6.2 Build Failures

If your build fails during deployment:

1. Check the deployment logs:
   ```bash
   az webapp log download \
     --resource-group healthcare-rg \
     --name healthcare-app-unique
   ```

2. Ensure all dependencies are properly listed in `package.json`
3. Verify that your build script works locally

### 6.3 Environment Variables

If your app requires environment variables:

```bash
# Set environment variables
az webapp config appsettings set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --settings \
    REACT_APP_API_URL="https://your-api-endpoint.com" \
    REACT_APP_ENVIRONMENT="production"
```

## 7. Performance Optimization

### 7.1 Enable Content Compression

```bash
# Enable compression
az webapp config set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --generic-configurations '{"httpCompression": {"dynamicCompression": true, "staticCompression": true}}'
```

### 7.2 Configure Caching

Add the following to your `web.config`:

```xml
<staticContent>
  <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="30.00:00:00" />
</staticContent>
```

### 7.3 Scale Up if Needed

```bash
# Scale up to a higher tier if needed
az appservice plan update \
  --name healthcare-plan \
  --resource-group healthcare-rg \
  --sku P1V2
```

## 8. Security Enhancements

### 8.1 Enable Managed Identity

```bash
# Enable managed identity
az webapp identity assign \
  --resource-group healthcare-rg \
  --name healthcare-app-unique
```

### 8.2 Configure Security Headers

Add the following to your `web.config`:

```xml
<httpProtocol>
  <customHeaders>
    <add name="X-Content-Type-Options" value="nosniff" />
    <add name="X-XSS-Protection" value="1; mode=block" />
    <add name="X-Frame-Options" value="DENY" />
    <add name="Strict-Transport-Security" value="max-age=31536000; includeSubDomains" />
    <add name="Content-Security-Policy" value="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;" />
  </customHeaders>
</httpProtocol>
```

## 9. Monitoring and Maintenance

### 9.1 Enable Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app healthcare-insights \
  --location "East US 2" \
  --resource-group healthcare-rg \
  --application-type web

# Get instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app healthcare-insights \
  --resource-group healthcare-rg \
  --query instrumentationKey \
  --output tsv)

# Configure App Insights in Web App
az webapp config appsettings set \
  --resource-group healthcare-rg \
  --name healthcare-app-unique \
  --settings \
    APPINSIGHTS_INSTRUMENTATIONKEY="$INSTRUMENTATION_KEY"
```

### 9.2 Set Up Alerts

```bash
# Create alert for high response time
az monitor metrics alert create \
  --name "High Response Time" \
  --resource-group healthcare-rg \
  --scopes $(az webapp show --name healthcare-app-unique --resource-group healthcare-rg --query id -o tsv) \
  --condition "avg Response Time > 3000 milliseconds" \
  --description "Alert when response time exceeds 3 seconds" \
  --evaluation-frequency 5m \
  --window-size 5m
```

## 10. Backup Strategy

### 10.1 Configure Automated Backups

```bash
# Create storage account for backups
az storage account create \
  --name healthcarebackups \
  --resource-group healthcare-rg \
  --location "East US 2" \
  --sku Standard_LRS

# Get storage connection string
STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
  --name healthcarebackups \
  --resource-group healthcare-rg \
  --query connectionString \
  --output tsv)

# Create container
az storage container create \
  --name backups \
  --connection-string "$STORAGE_CONNECTION_STRING"

# Configure backup
az webapp config backup create \
  --resource-group healthcare-rg \
  --webapp-name healthcare-app-unique \
  --backup-name initial-backup \
  --container-url "https://healthcarebackups.blob.core.windows.net/backups" \
  --storage-account-key $(az storage account keys list --account-name healthcarebackups --resource-group healthcare-rg --query [0].value -o tsv)

# Set up scheduled backups
az webapp config backup update \
  --resource-group healthcare-rg \
  --webapp-name healthcare-app-unique \
  --frequency 1d \
  --retain-one true \
  --retention 10
```

## 11. Final Checklist

Before considering your deployment complete, verify:

- [ ] Application loads correctly at the root URL
- [ ] All routes work, including direct access and after refresh
- [ ] Static assets (images, CSS, JS) load properly
- [ ] HTTPS is enforced
- [ ] Application is responsive and performs well
- [ ] Monitoring is set up
- [ ] Backup strategy is in place
- [ ] Security headers are configured

## 12. Troubleshooting Guide

### 12.1 Application Not Loading

1. Check if the application is running:
   ```bash
   az webapp restart --name healthcare-app-unique --resource-group healthcare-rg
   ```

2. Verify startup command:
   ```bash
   az webapp config show --name healthcare-app-unique --resource-group healthcare-rg --query appCommandLine
   ```

### 12.2 Slow Performance

1. Check resource utilization:
   ```bash
   az monitor metrics list --resource healthcare-app-unique --resource-group healthcare-rg --resource-type "Microsoft.Web/sites" --metric "CpuPercentage" "MemoryPercentage"
   ```

2. Consider scaling up:
   ```bash
   az appservice plan update --name healthcare-plan --resource-group healthcare-rg --sku P1V2
   ```

### 12.3 Deployment Failures

1. Check deployment logs:
   ```bash
   az webapp log deployment show --name healthcare-app-unique --resource-group healthcare-rg
   ```

2. Try manual deployment via ZIP file as described in section 4.2

## Conclusion

By following this guide, you should have successfully deployed the Healthcare Management System on Azure with zero errors. The application should be running securely, with proper monitoring and backup strategies in place.

For ongoing maintenance, regularly check for:
- Security updates for your dependencies
- Performance metrics in Application Insights
- Successful backup operations
- Unusual patterns in application logs

For additional assistance, refer to the [Azure Web Apps documentation](https://docs.microsoft.com/en-us/azure/app-service/).