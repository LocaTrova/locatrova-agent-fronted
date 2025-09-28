To maximize effectiveness, clarity, and agent usability, here is a **refactored `AGENTS.md` template** following 2025's best practices for agent-oriented documentation. This structure is based on leading recommendations: keep it concise, structured, AI-focused, modular, and explicitly reference auxiliary docs. It should complement (not duplicate) your `README.md` or human developer guides.

***

# AGENTS.md

**Purpose:**  
This file gives precise, machine-readable guidance for AI coding agents.  
It defines setup, environment, coding standards, system-specific conventions, and agent operations.  
*Do not duplicate README contents. Reference supporting documents where necessary.*

***

## 1. Directory Overview

- List key folders, their primary purpose, and rules if relevant for agents (e.g., where to place new API endpoints, UI files, tests).
  - Example:
    - `/client/` – Front-end React SPA. Put all new pages in `/client/pages/` unless domain-specific.
    - `/server/` – Express API code.
    - `/shared/` – Shared types and schemas (always use for contract types).
    - `/tests/` – All new tests must be placed near code-under-test or in `/tests/`.
- If the project is a monorepo, mention AGENTS.md inheritance/nesting rules.

***

## 2. Key Commands & Environments

- **Dev Start:** `pnpm dev`
- **Build:** `pnpm build`
- **Run Tests:** `pnpm test`
- **Lint/Typecheck:** `pnpm lint`, `pnpm typecheck`
- **Env Selection:** Use `.env` for local, `.env.production` for prod.

*Agents: Use `pnpm` for all package operations. Default to Node 20+ runtime.*

***

## 3. Coding Conventions

- **Language:** TypeScript (strict mode, no implicit anys)
- **Linting:** Run Prettier & Eslint after each file edit
- **Formatting:** 2-space indent, single quotes
- **Types:** Type all functions, props, and exported members
- **Docs:** Add JSDoc for all exported functions and classes
- **Testing:** Co-locate tests with source, prefer Vitest + React Testing Library AAA testing.
- **Patterns:** Respect SOLID and DRY principles; all logic must be composable and testable. 

***

## 4. File Placement & Naming

- **UI Components:** Put generic ones in `/client/components/ui/`, domain logic in `/client/features/<domain>/components/`
- **API Routes:** Add new endpoints in `/server/routes/`, use `snake_case` for filenames
- **Shared Types/Schemas:** All API contracts go in `/shared/`. Do **not** redefine contracts; reference existing types or create new ones here.

***

## 5. Actions Prohibited for AI Agents

- Never edit or delete migration/history files (`/migrations/`)
- Never auto-update lockfiles/package managers unless commenting in a PR
- Never commit secrets, keys, `.env` files, or credentials
- Never attempt destructive or schema-altering DB/API migrations without human approval

***

## 6. Supplemental References

- For project rationale, patterns, domain rules, and flowcharts, see `/docs/architecture.md` and `/README.md`
- For custom workflow instructions (PRs, CI/CD, deployment), see `/docs/contributing.md`
- For environment and secrets, see `/docs/environment.md`

***

## 7. Agent-Specific Settings

- **MCP/Tool Config:**  
  - [x] Node.js agent runtime, 4GB memory limit per job
  - [x] Can use MCP DevOps API, but not MCP Admin endpoints unless whitelisted
  - [x] Temp files must be cleaned up after agent session ends
  - [x] Agents can call POST `/api/agents/notify` to report AI-driven changes
  - [x] All generated code MUST pass lint and test checks before merge

***

## 8. Last Updated

- `2025-09-28`
- Please keep this file concise: fewer than 100 lines, limit duplication, link to other docs.

***


