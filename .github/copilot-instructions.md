## Front-end Development Strategy

- **Package Manager**: This project uses **bun** as the package manager. Always use `bun` commands instead of `npm` or `yarn`:
    - Install: `bun install` or `bun i`
    - Add package: `bun add <package>` or `bun add -d <package>` for dev
    - Remove package: `bun remove <package>`
    - Run scripts: `bun run <script>` or `bun <script>`
- **Environment Discovery**: Before running any build/dev command, run `cat package.json | head -20` to check the "type" field, "scripts", and key dependencies.
- **Holistic Linting**: When fixing a lint error, first run `bun run lint` to get the full list of issues. Fix all instances of the same error type in one pass.
- **Dev Server Management**: Always check whether there's an api folder in the project root. If it exists, use `vercel dev` to start the dev server instead of `bun dev` if implementing api-related tasks. For frontend-only development, `bun dev` calls the production API.
- **Port Management**: Before starting a dev server, use `lsof -i :<port>` to check if the port is in use. Only run `bun dev` once per workspace.
- **Port Verification**: Always check the config file (vite.config.ts) to confirm the port used for the dev server before attempting to open a page.
- **Build Debugging**: When debugging build tool errors, check the installed version (`bun pm ls <package>`) and consult the tool's migration guide if the error seems version-related.
- **Centralized Styling and String**: When adding new styles, first check for existing CSS variables or classes in global stylesheets to maintain design consistency. Always use centralized style variables for colors, fonts, and spacing, and centralized string constants for text.
- **Front-end Designing Skill**: Always check the front-end design skill when the task is front-end related.

## Browser Usage

## Planing

When Planning, always ask questions beforehand for the details if the prompt from the user wasn't clear enough.
