# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD processes for the CogBolt project.

## Workflows

### 1. CI Workflow (`ci.yaml`)

**Triggers:**
- Push to `master` or `main` branches
- Pull requests

**Jobs:**
- Type checking with TypeScript
- Running tests (35 tests including OpenCog integration tests)
- Build verification

**Features:**
- Enhanced test reporting with summaries
- OpenCog integration validation
- Automated quality checks

### 2. Preview Deployment (`preview.yaml`)

**Triggers:**
- Pull request events (opened, synchronize, reopened)

**Jobs:**
- Build the application
- Run all tests
- Deploy to Cloudflare Pages (preview environment)
- Post preview URL as PR comment

**Features:**
- Unique preview deployment for each PR
- Automatic PR comments with preview URL
- OpenCog features highlighted in deployment notification
- Security: Only runs for PRs from the same repository

**Requirements:**
- `CLOUDFLARE_API_TOKEN` secret
- `CLOUDFLARE_ACCOUNT_ID` secret

### 3. Production Deployment (`deploy.yaml`)

**Triggers:**
- Push to `master` or `main` branches
- Manual trigger via `workflow_dispatch`

**Jobs:**
- Build the application
- Run all tests and type checks
- Deploy to Cloudflare Pages (production)
- Create deployment summary

**Features:**
- Production environment protection
- Comprehensive deployment summary
- OpenCog features documentation in deployment

**Requirements:**
- `CLOUDFLARE_API_TOKEN` secret
- `CLOUDFLARE_ACCOUNT_ID` secret

### 4. Semantic PR (`semantic-pr.yaml`)

**Triggers:**
- Pull request events (opened, reopened, edited, synchronize)

**Jobs:**
- Validate PR title follows semantic commit conventions

**Allowed Types:**
- `fix`, `feat`, `chore`, `build`, `ci`, `perf`, `docs`, `refactor`, `revert`, `test`

## Setup

### Required Secrets

Add these secrets to your GitHub repository settings:

1. **CLOUDFLARE_API_TOKEN**
   - Get from Cloudflare Dashboard > Profile > API Tokens
   - Needs "Cloudflare Pages - Edit" permission

2. **CLOUDFLARE_ACCOUNT_ID**
   - Found in Cloudflare Dashboard > Account Home
   - Look for "Account ID"

### Setup Steps

1. Go to repository Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add both secrets mentioned above

## Shared Actions

### Setup and Build (`actions/setup-and-build/action.yaml`)

Reusable action that:
- Sets up pnpm with version 9.4.0
- Configures Node.js 20.15.1
- Installs dependencies
- Builds the project

**Parameters:**
- `pnpm-version` (optional, default: 9.4.0)
- `node-version` (optional, default: 20.15.1)

## OpenCog Integration Tests

All workflows include validation of OpenCog components:
- AtomSpace store functionality
- CogServer terminal integration
- Multi-agent orchestration
- Cognitive processes

## Workflow Status

Check the status of workflows:
- Go to repository > Actions tab
- View recent workflow runs
- Click on a specific run for detailed logs

## Deployment URLs

### Preview Deployments
- Preview URLs are posted as PR comments
- Format: `https://[unique-id].cogbolt.pages.dev`
- Each PR gets a unique preview environment

### Production Deployment
- Production URL is set in the deployment environment
- Deployment summaries include the production URL

## Best Practices

1. **Always run tests locally before pushing:**
   ```bash
   pnpm test
   pnpm run typecheck
   pnpm run build
   ```

2. **Use semantic commit messages:**
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `chore:` for maintenance tasks

3. **Review preview deployments:**
   - Check the preview URL posted in PR comments
   - Verify OpenCog features are working
   - Test in preview before merging

4. **Monitor workflow runs:**
   - Check Actions tab regularly
   - Fix failing workflows promptly
   - Review deployment summaries

## Troubleshooting

### Workflow Fails

1. Check the workflow logs in Actions tab
2. Common issues:
   - Type errors: Run `pnpm run typecheck` locally
   - Test failures: Run `pnpm test` locally
   - Build errors: Run `pnpm run build` locally

### Deployment Fails

1. Verify Cloudflare secrets are set correctly
2. Check Cloudflare Pages dashboard for errors
3. Ensure account has proper permissions

### Preview Not Deploying

1. Verify PR is from the same repository (not a fork)
2. Check that secrets are accessible
3. Review workflow permissions in repository settings

## Maintenance

### Updating Node Version

Edit `.github/actions/setup-and-build/action.yaml`:
```yaml
node-version:
  default: '20.15.1'  # Update this
```

### Updating pnpm Version

Edit `package.json`:
```json
"packageManager": "pnpm@9.4.0"  // Update this
```

Then update `.github/actions/setup-and-build/action.yaml`:
```yaml
pnpm-version:
  default: '9.4.0'  # Update this
```

## Contributing

When modifying workflows:
1. Test changes in a feature branch first
2. Use workflow_dispatch trigger for testing
3. Document changes in this README
4. Follow the existing workflow patterns

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Pages GitHub Action](https://github.com/cloudflare/pages-action)
- [Semantic Release](https://github.com/semantic-release/semantic-release)
