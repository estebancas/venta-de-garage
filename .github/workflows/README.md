# GitHub Actions CI/CD

## Continuous Integration (CI)

### What runs on Pull Requests?

When you create a PR to `main`, the following checks run automatically:

1. **TypeScript Check** - Ensures no type errors (`npx tsc --noEmit`)
2. **Build Check** - Verifies the app builds successfully (`npm run build`)
3. **Linter** - Runs ESLint (doesn't fail the build, just warns)

### Environment Variables

The CI workflow uses mock environment variables for building. If you want to use real values:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add repository secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`
   - `R2_PUBLIC_URL`
   - `NEXT_PUBLIC_SINPE_PHONE`
   - `NEXT_PUBLIC_SINPE_NAME`

**Note:** The workflow will use mock values if secrets aren't set, which is fine for type checking and building.

### When does it run?

- ✅ On every **pull request** to `main`
- ✅ On every **push** to `main`

### What happens if checks fail?

- ❌ The PR will show a red X
- ❌ GitHub will block merging if you have branch protection rules enabled
- ✅ You can still push to your branch to fix issues

### How to enable branch protection?

To require CI checks before merging:

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable: "Require status checks to pass before merging"
4. Select: "TypeScript Check & Build"

This ensures no broken code gets merged into main! 🛡️
