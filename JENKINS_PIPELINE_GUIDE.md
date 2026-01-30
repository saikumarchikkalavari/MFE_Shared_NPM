# Jenkins Pipeline Configuration

This document describes the Jenkins pipeline setup for the MFE_Shared_NPM project.

## Prerequisites

### Jenkins Setup

1. **NodeJS Plugin**
   - Install the NodeJS Plugin in Jenkins
   - Configure NodeJS 20.x in `Manage Jenkins > Global Tool Configuration`
   - Name it `NodeJS-20` (or update the pipeline to match your installation name)

2. **Required Plugins**
   - Pipeline
   - Git
   - NodeJS
   - HTML Publisher (for test coverage reports)
   - JUnit (for test results)

### Environment Variables

Configure these in Jenkins job settings or credentials:

```groovy
// Optional: Add to Jenkins credentials
AWS_ACCESS_KEY_ID       // For S3 deployment
AWS_SECRET_ACCESS_KEY   // For S3 deployment
DEPLOY_SERVER_URL       // Your deployment server
NOTIFICATION_EMAIL      // Email for build notifications
```

## Pipeline Overview

### Stages

1. **Checkout**
   - Clones the repository
   - Displays build information (Node version, branch, commit)

2. **Install Dependencies** (Parallel)
   - Installs npm packages for shared, host, and remote
   - Uses `npm ci` for reproducible builds
   - Runs in parallel for faster execution

3. **Lint & Type Check** (Parallel)
   - ESLint validation for all three projects
   - TypeScript type checking
   - Runs in parallel

4. **Run Tests**
   - Executes Jest tests with coverage
   - Generates JUnit XML and HTML coverage reports
   - Skippable via `SKIP_TESTS` parameter

5. **Build Shared Library**
   - Builds shared library with Rollup
   - Generates ESM and CJS bundles
   - Displays bundle sizes

6. **Build Applications** (Parallel)
   - Builds host application with Webpack
   - Builds remote application with Webpack
   - Displays bundle sizes
   - Runs in parallel

7. **Bundle Size Analysis** (Optional)
   - Detailed analysis of all bundle sizes
   - Enabled via `RUN_BUNDLE_ANALYSIS` parameter

8. **Package Artifacts**
   - Creates tar.gz archives of build outputs
   - Archives artifacts in Jenkins
   - Includes package.json for version tracking

9. **Deploy to Environment** (Conditional)
   - Only runs on main/develop/staging branches
   - Deploys based on `DEPLOY_ENVIRONMENT` parameter
   - Production requires manual approval

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `DEPLOY_ENVIRONMENT` | Choice | dev | Target environment (dev/staging/production) |
| `SKIP_TESTS` | Boolean | false | Skip test execution |
| `RUN_BUNDLE_ANALYSIS` | Boolean | false | Run detailed bundle analysis |

## Usage

### Standard Build

```bash
# Automatically triggered on git push
# Or manually trigger from Jenkins UI
```

### Build with Bundle Analysis

1. Click "Build with Parameters"
2. Check `RUN_BUNDLE_ANALYSIS`
3. Click "Build"

### Deploy to Staging

1. Click "Build with Parameters"
2. Select `DEPLOY_ENVIRONMENT: staging`
3. Click "Build"

### Deploy to Production

1. Click "Build with Parameters"
2. Select `DEPLOY_ENVIRONMENT: production`
3. Click "Build"
4. Approve deployment when prompted

## Artifacts

Build artifacts are archived and available for download:

- `shared-lib-{BUILD_NUMBER}.tar.gz` - Shared library build output
- `host-app-{BUILD_NUMBER}.tar.gz` - Host application build output
- `remote-app-{BUILD_NUMBER}.tar.gz` - Remote application build output

## Reports

### Test Coverage Report

- Available under "Test Coverage Report" link in build sidebar
- Shows line, branch, and function coverage
- Generated from Jest coverage output

### Test Results

- JUnit test results displayed in build results
- Tracks test trends over time

## Customization

### Adding Deployment Steps

Edit the `Deploy to Environment` stage in Jenkinsfile:

```groovy
stage('Deploy to Environment') {
    steps {
        script {
            switch(params.DEPLOY_ENVIRONMENT) {
                case 'dev':
                    sh '''
                        # Add your deployment commands
                        aws s3 sync host/dist/ s3://your-bucket/host/
                        aws s3 sync remote/dist/ s3://your-bucket/remote/
                    '''
                    break
                // ... other cases
            }
        }
    }
}
```

### Adding Notifications

Uncomment and configure the email notification sections in the `post` block:

```groovy
post {
    success {
        emailext (
            subject: "✅ Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: "Build completed successfully",
            to: "team@example.com"
        )
    }
}
```

### Integrating Slack/Teams

Add to `post` block:

```groovy
post {
    always {
        slackSend(
            channel: '#builds',
            color: currentBuild.result == 'SUCCESS' ? 'good' : 'danger',
            message: "Build ${env.BUILD_NUMBER}: ${currentBuild.result}"
        )
    }
}
```

## Optimization Tips

### Caching Dependencies

The pipeline uses npm cache to speed up builds:

```groovy
environment {
    NPM_CONFIG_CACHE = "${WORKSPACE}/.npm-cache"
}
```

### Parallel Execution

Independent stages run in parallel:
- Dependency installation (3 projects)
- Linting (3 projects)
- Building applications (host + remote)

### Build Artifacts

Only essential files are archived:
- `dist/` directories
- `package.json` files

## Troubleshooting

### Build Fails at "Install Dependencies"

**Issue:** `npm ci` fails with package-lock mismatch

**Solution:**
```bash
# Locally, ensure package-lock.json is up to date
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
```

### Tests Fail in Jenkins but Pass Locally

**Issue:** Environment differences

**Solution:**
- Check Node.js version matches local (use `node --version`)
- Ensure `CI=true` environment variable is set (already in pipeline)
- Check for missing test dependencies

### Build Timeout

**Issue:** Build exceeds 30-minute timeout

**Solution:**
- Increase timeout in pipeline options:
  ```groovy
  options {
      timeout(time: 60, unit: 'MINUTES')
  }
  ```
- Or optimize build with better caching

### Deployment Stage Skipped

**Issue:** Deploy stage doesn't run

**Cause:** Only runs on `main`, `develop`, or `staging` branches

**Solution:**
- Merge to appropriate branch
- Or remove branch condition from `when` block

## Performance Metrics

Expected build times (approximate):

| Stage | Duration |
|-------|----------|
| Checkout | 10-20s |
| Install Dependencies | 1-2 min |
| Lint & Type Check | 30-60s |
| Run Tests | 1-2 min |
| Build Shared Library | 10-20s |
| Build Applications | 1-3 min |
| Package Artifacts | 10-20s |
| **Total** | **5-10 min** |

## Security Best Practices

1. **Use Jenkins Credentials**
   ```groovy
   withCredentials([string(credentialsId: 'aws-key', variable: 'AWS_KEY')]) {
       sh 'aws s3 sync ...'
   }
   ```

2. **Lock Production Deployments**
   - Production requires manual approval (already implemented)
   - Consider role-based access control

3. **Audit Trail**
   - All deployments logged with build number
   - Artifacts archived for rollback capability

## Maintenance

### Weekly Tasks
- Review build logs for warnings
- Check disk space on Jenkins agent
- Verify all tests passing

### Monthly Tasks
- Update NodeJS version if needed
- Review and clean old build artifacts
- Update pipeline dependencies

## Support

For pipeline issues:
1. Check Jenkins console output
2. Review this documentation
3. Contact DevOps team
