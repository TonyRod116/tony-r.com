# AI Shared Instructions

This file is the single source of truth for AI agent instructions in this repository.

## Project Scope

- These instructions apply to all work in this repository.
- Default scope is the current task area only. Do not modify unrelated business logic.
- If `frontend/` and `backend/` exist, keep behavior and boundaries clear:
  - Frontend work must not change backend internals unless explicitly required.
  - Backend work must not change frontend UI behavior unless explicitly required.

## Core Working Rules

1. Before implementing non-trivial code, describe the approach and ask clarifying questions if requirements are ambiguous.
2. If a task needs changes across more than 3 files, split it into smaller, reviewable steps.
3. For bug fixes, first reproduce with a test when practical, then implement the fix.
4. After code changes, list risks/regression points and the checks/tests that cover them.
5. Never add `Co-authored-by:` trailers in commits.

## Issue Workflow (Beads)

This repo uses `bd` (beads) for issue tracking.

- Start: `bd ready`
- Claim: `bd update <id> --status in_progress`
- Inspect: `bd show <id>`
- Create follow-up: `bd create --title="..." --type=task|bug|feature --priority=2`
- Close: `bd close <id>`
- Sync: `bd sync`

Rules:
- Check `bd ready` before asking what to work on.
- Move issues to `in_progress` when starting.
- Close completed issues.
- Do not use markdown TODO lists as the source of issue tracking.

## Branch and Commit Hygiene

- Prefer one branch/worktree per issue.
- Commit in small, atomic steps with conventional commit format.
- Keep commit messages imperative and scoped when useful.

## Cross-Agent Continuity (Handoff/Memory)

At session start:
- Read `README.md`.
- Read this file (`AI_SHARED_INSTRUCTIONS.md`).
- Read `PROJECT_STATE.md` if present.
- Check `bd ready`.

At session end:
- Update `PROJECT_STATE.md` with current status, pending work, and next actions (if file is used in this repo).
- Ensure any discovered follow-up work is tracked as `bd` issues.

## Archivos de IA (AI Files)

The term **"archivos de IA"** refers to the following configuration files:
- `AI_SHARED_INSTRUCTIONS.md` (Single source of truth)
- `GEMINI.md`
- `CLAUDE.md`
- `CURSOR.md`
- `CODEX.md`
- `AGENTS.md`

## Mandatory Cross-CLI Sync Rule

Any change to the project's instructions MUST be applied to all "archivos de IA" to ensure consistency across different AI interfaces (Gemini CLI, Claude CLI, Cursor, Codex, etc.).

The process is:
1. Edit `AI_SHARED_INSTRUCTIONS.md`.
2. Run `./scripts/sync-ai-instructions.sh`.
3. Commit `AI_SHARED_INSTRUCTIONS.md` and all synchronized files together.

## Session Close Verification

Before finishing work:
- Run project checks/tests/lint relevant to changed areas (for JS/TS commonly `npm run check`).
- For UI changes, verify desktop and mobile behavior.
- For backend changes, ensure tests (including integration when relevant) pass.
- Confirm prohibited areas were not modified unintentionally.
- Confirm git status is clean or only contains intentional changes.

## Prohibited Changes Without Explicit Request

- Do not modify secrets, deployment credentials, or environment configs unrelated to the task.
- Do not refactor unrelated modules.
- Do not rewrite repository-wide conventions unless explicitly requested.
