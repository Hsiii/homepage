---
description: Check for outdated dependencies, update them one by one, and verify with builds/tests.
---

1. List all outdated dependencies:
   // turbo
   `npm outdated`
2. Create a new branch for the updates: `git switch -c chore/update-dependencies`.
3. Plan the update order (usually devDependencies first, then core dependencies).
4. Iterate through each dependency that needs an update:
   a. Update the dependency: `npm install [package-name]@latest`.
   b. Verify the changes by confirming successful build:
   // turbo
   `npm run build`
   c. (Optional) If the package affects the UI, start the dev server and verify in the browser.
   d. If any verification fails, investigate breaking changes and fix or revert.
   e. Commit the update: `git commit -am "chore: update [package-name] to latest"`.
5. After all updates are complete, provide a summary of updated packages and recommend creating a PR: `gh pr create --title "chore: update dependencies" --body "Updated outdated packages to their latest versions."`.
