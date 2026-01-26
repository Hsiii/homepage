---
description: Fix a GitHub issue by its number, implement changes, and create a PR.
---

1. Execute `gh issue view [number]` to retrieve the issue's title, description, and comments.
2. Analyze the issue to understand the bug or feature request.
3. Search for relevant files and code sections using `grep_search` or `find_by_name`.
4. Create a new branch for the fix: `git switch -c fix/issue-[number]`.
5. Plan the steps required to finish the implementation.
6. Iterate through the following for every step:
   a. Implement the necessary code changes for the step.
   b. Verify the changes by confirming successful build and testing with browser.
   c. Commit the changes with a descriptive message.
7. Push the branch and create a Pull Request: `gh pr create --title "Fix #[number]: [Title]" --body "Fixes #[number]. [Description of changes]"`.
8. Provide the PR link to the user.
