---
description: Run code linters, check for common issues, and summarize findings.
---

1. Run ESLint to check for code quality and style issues:
   // turbo
   `npx eslint .`
2. Run Prettier to check for formatting consistency:
   // turbo
   `npx prettier --check .`
3. Perform a manual review of recent changes or specific directories, looking for:
    - Dead code or unused imports.
    - Consistency with project naming conventions.
    - Potential performance bottlenecks (e.g., unnecessary re-renders).
    - Hardcoded values that should be in constants.
4. Summarize the findings into:
    - **Critical**: Issues that must be fixed (errors, bugs).
    - **Warnings**: Potential issues or style inconsistencies.
    - **Suggestions**: Refactoring opportunities or optimizations.
