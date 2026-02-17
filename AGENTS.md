# Agent Instructions

Used by Cursor, Aider, and other AI coding agents. Follow these rules when editing this repo.

---

## General Rules

1. Before writing code, describe your approach and wait for approval. Ask clarifying questions if requirements are ambiguous.
2. If a task requires changes to more than 3 files, break it into smaller tasks first.
3. After writing code, list what could break and suggest tests to cover it.
4. When there's a bug, write a test that reproduces it, then fix it until the test passes.
5. When the user corrects you, add a new rule here (or in CLAUDE.md) so it doesn't happen again—check existing content first.

---

## Issue Tracking: Beads (bd)

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
bd create --title="Issue title" --type=task|bug|feature --priority=2
```

### Rules

- Check `bd ready` before asking "what should I work on?"
- Update issue status to `in_progress` when you start working.
- Close issues when you complete them.
- Do not use markdown TODO lists for tracking work.

---

## Branch Strategy

When starting work on an issue:

1. Create a branch (e.g. with worktree): `git worktree add <path> <issue-id>-short-description`
2. Do the work on that branch.
3. Commit frequently with meaningful messages.
4. When complete: push and note the branch in the close message.

---

## Landing the Plane (Session Completion)

When ending a work session, complete ALL steps below. Work is NOT complete until `git push` succeeds.

1. **File issues for remaining work** – Create issues for anything that needs follow-up.
2. **Run quality gates** (if code changed) – Tests, linters, builds.
3. **Update issue status** – Close finished work, update in-progress items.
4. **Push to remote** (mandatory):
   ```bash
   git pull --rebase
   bd sync
   git push
   git status   # MUST show "up to date with origin"
   ```
5. **Clean up** – Clear stashes, prune remote branches.
6. **Verify** – All changes committed AND pushed.
7. **Hand off** – Update PROJECT_STATE.md if relevant so the next session knows context.

**Critical:** Never stop before pushing. If push fails, resolve and retry until it succeeds.

---

## Commit

- Use conventional commit messages and (optionally) emojis.
- **Never** add `Co-authored-by:` to commit messages. Only the user must appear as author.
- Types: `feat`, `fix`, `docs`, `refactor`, `style`, `perf`, `test`, `chore`, `wip`, `remove`, `hotfix`, `security`.
- Scope when useful: `type(scope): description`.
- Keep commits atomic; write in imperative mood.

---

## Verification

- **Backend:** Ensure integration tests exist; use testcontainers/Localstack as needed. Fix failing tests before marking done.
- **UI:** After UI changes, verify visually (e.g. Playwright screenshots, desktop and mobile).

---

## Check / Clean

- **Check:** Run `npm run check` (or project check command). Do not commit during check; fix all errors.
- **Clean:** Fix formatting and lint (e.g. Prettier, ESLint for JS/TS; black, isort, flake8, mypy for Python).

---

## Design and Architecture

- Use ADRs (Architecture Decision Records) for significant architecture changes or new systems.
- Use Markdown and version ADR files; follow a standard format (e.g. Google's ADR format).

---

## Implement Task

1. Think through strategy and get approval if needed.
2. Break into subtasks; start with core functionality.
3. Implement incrementally; test each part.
4. Document decisions and update PROJECT_STATE.md when useful for the next session.

---

## Context for New Sessions

When starting a session:

1. Read **README.md** for project overview.
2. Read **AGENTS.md** (this file) for workflow and rules.
3. Read **PROJECT_STATE.md** for current focus and what to work on next.
4. Check `bd ready` for assigned work.

---

## Aider-Specific Note

When using **Aider** locally, pass this file and PROJECT_STATE.md for context, e.g.:

```bash
aider --message "Read AGENTS.md and PROJECT_STATE.md first"
```

Keep PROJECT_STATE.md updated with current work and next steps so the next Aider (or Cursor) session can resume effectively.
