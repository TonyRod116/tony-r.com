# General instructions

1. "Before writing any code, describe your approach and wait for approval. Always ask clarifying questions before writing any code if requirements are ambiguous."

2. "If a task requires changes to more than 3 files, stop and break it into smaller tasks first."

3. "After writing code, list what could break and suggest tests to cover it."

4. "When there’s a bug, start by writing a test that reproduces it, then fix it until the test passes."

5. "Every time I correct you, add a new rule to the CLAUDE .md file so it never happens again, make sure something similar is not there already, so check the contents first."


# Issue Tracking: Use Beads

All projects use **beads** (`bd`) for issue tracking.

## Required Workflow

Before starting any work:

1. Check for ready work:
   ```
   bd ready
   ```

2. Pick a task and claim it:
   ```
   bd update <issue-id> --status=in_progress
   ```

3. Work on the task (code, tests, docs)

4. When done, close it:
   ```
   bd close <issue-id>
   ```

## Creating New Issues

If you discover new work while implementing:
```
bd create --title="Issue title" --type=task|bug|feature --priority=2
```

## Rules

- ALWAYS check `bd ready` before asking "what should I work on?"
- ALWAYS update issue status to `in_progress` when you start working
- ALWAYS close issues when you complete them
- NEVER use markdown TODO lists for tracking work

---

# Branch Strategy

When starting work on an issue:
1. Create a branch using worktree: `git worktree add <path_to_new_worktree> <issue-id>-short-description`
2. Do the work on that worktree/branch
3. Commit frequently with meaningful messages
4. When complete: push and note the branch in the close message

---

# Verification

## Backend Verification

After making changes in the backend:
1. Make sure there are integration tests in place
2. Spin up containers as needed via testcontainers or Localstack (depending on what to test)
3. If tests don't pass, fix it before marking the task as complete

## Visual Verification

After making UI changes:
1. Use Playwright MCP to take screenshots of affected pages
2. Verify the changes match the expected design
3. Check both desktop and mobile viewports
4. If something looks wrong, fix it before marking the task complete

---

# Commit

Create well-formatted commits with conventional commit messages and emojis.

## Features:
- Runs pre-commit checks by default (lint, build, generate docs)
- Automatically stages files if none are staged
- Uses conventional commit format with descriptive emojis
- Suggests splitting commits for different concerns

## Usage:
- `/commit` - Standard commit with pre-commit checks
- `/commit --no-verify` - Skip pre-commit checks

## Commit Types:
- ✨ feat: New features
- 🐛 fix: Bug fixes
- 📝 docs: Documentation changes
- ♻️ refactor: Code restructuring without changing functionality
- 🎨 style: Code formatting, missing semicolons, etc.
- ⚡️ perf: Performance improvements
- ✅ test: Adding or correcting tests
- 🧑‍💻 chore: Tooling, configuration, maintenance
- 🚧 wip: Work in progress
- 🔥 remove: Removing code or files
- 🚑 hotfix: Critical fixes
- 🔒 security: Security improvements

## Process:
1. Check for staged changes (`git status`)
2. If no staged changes, review and stage appropriate files
3. Run pre-commit checks (unless --no-verify)
4. Analyze changes to determine commit type
5. Generate descriptive commit message
6. Include scope if applicable: `type(scope): description`
7. Add body for complex changes explaining why
8. Execute commit

## Rules:
- **NEVER** add `Co-authored-by: Cursor` or any `Co-authored-by` line to commit messages. Only the user must appear as author; do not append Cursor or AI co-author trailers.

## Best Practices:
- Keep commits atomic and focused
- Write in imperative mood ("Add feature" not "Added feature")
- Explain why, not just what
- Reference issues/PRs when relevant
- Split unrelated changes into separate commits

---

# Add to Changelog

Update the project's CHANGELOG.md file with a new entry.

## Usage:
`/add-to-changelog <version> <change_type> <message>`

## Parameters:
- `<version>`: Version number (e.g., "1.1.0")
- `<change_type>`: One of: "added", "changed", "deprecated", "removed", "fixed", "security"
- `<message>`: Description of the change

## Examples:
- `/add-to-changelog 1.1.0 added "New markdown to BlockDoc conversion feature"`
- `/add-to-changelog 1.0.2 fixed "Bug in HTML renderer causing incorrect output"`

## Steps:
1. Check for existing CHANGELOG.md or create if missing
2. Find or create section for the specified version
3. Add the new entry under the appropriate change type
4. Format according to Keep a Changelog conventions
5. Write the updated changelog back to file
6. Optionally commit the changes with appropriate message

## Format:
Follow [Keep a Changelog](https://keepachangelog.com) format:
- Group changes by type
- List changes as bullet points
- Include date for version sections
- Keep entries concise but descriptive

---

# Check

Perform comprehensive code quality and security checks.

## Primary Task:
Run `npm run check` (or project-specific check command) and resolve any resulting errors.

## Important:
- DO NOT commit any code during this process
- DO NOT change version numbers
- Focus only on fixing issues identified by checks

## Common Checks Include:
1. **Linting**: Code style and syntax errors
2. **Type Checking**: TypeScript/Flow type errors
3. **Unit Tests**: Failing test cases
4. **Security Scan**: Vulnerability detection
5. **Code Formatting**: Style consistency
6. **Build Verification**: Compilation errors

## Process:
1. Run the check command
2. Analyze output for errors and warnings
3. Fix issues in priority order:
   - Build-breaking errors first
   - Test failures
   - Linting errors
   - Warnings
4. Re-run checks after each fix
5. Continue until all checks pass

## For Different Project Types:
- **JavaScript/TypeScript**: `npm run check` or `yarn check`
- **Python**: `black`, `isort`, `flake8`, `mypy`
- **Rust**: `cargo check`, `cargo clippy`
- **Go**: `go vet`, `golint`
- **Swift**: `swift-format`, `swiftlint`

---

# Clean

Fix all code formatting and quality issues in the entire codebase.

## Python Projects:
Fix all `black`, `isort`, `flake8`, and `mypy` issues

### Steps:
1. **Format with Black**: `black .`
2. **Sort imports with isort**: `isort .`
3. **Fix flake8 issues**: `flake8 . --extend-ignore=E203`
4. **Resolve mypy type errors**: `mypy .`

## JavaScript/TypeScript Projects:
Fix all ESLint, Prettier, and TypeScript issues

### Steps:
1. **Format with Prettier**: `npx prettier --write .`
2. **Fix ESLint issues**: `npx eslint . --fix`
3. **Check TypeScript**: `npx tsc --noEmit`

## General Process:
1. Run automated formatters first
2. Fix remaining linting issues manually
3. Resolve type checking errors
4. Verify all tools pass with no errors
5. Review changes before committing

## Common Issues:
- Import order conflicts between tools
- Line length violations
- Unused imports/variables
- Type annotation requirements
- Missing return types
- Inconsistent quotes/semicolons

---

# Design and Architecture

## ADR

- Use ADRs whenever there's a significant change in current architecture
- Use ADRs when designing a new system or service
- Use Markdown format and version those files
- Use Google's ADR format

---

# Code Analysis

Perform advanced code analysis with multiple inspection options.

## Analysis Menu:

### 1. Knowledge Graph Generation
- Map relationships between components
- Visualize dependencies
- Identify architectural patterns

### 2. Code Quality Evaluation
- Complexity metrics
- Maintainability index
- Technical debt assessment
- Code duplication detection

### 3. Performance Analysis
- Identify bottlenecks
- Memory usage patterns
- Algorithm complexity
- Database query optimization

### 4. Security Review
- Vulnerability scanning
- Input validation checks
- Authentication/authorization review
- Sensitive data handling

### 5. Architecture Review
- Design pattern adherence
- SOLID principles compliance
- Coupling and cohesion analysis
- Module boundaries

### 6. Test Coverage Analysis
- Coverage percentages
- Untested code paths
- Test quality assessment
- Missing edge cases

## Process:
1. Select analysis type based on need
2. Run appropriate tools and inspections
3. Generate comprehensive report
4. Provide actionable recommendations
5. Prioritize improvements by impact

## Output Format:
- Executive summary
- Detailed findings
- Risk assessment
- Improvement roadmap
- Code examples where relevant

---

# Implement Task

Approach task implementation methodically with careful planning and execution.

## Process:

### 1. Think Through Strategy
- Understand the complete requirement
- Identify key components needed
- Consider dependencies and constraints
- Plan the implementation approach

### 2. Evaluate Approaches
- List possible implementation strategies
- Compare pros and cons of each
- Consider:
  - Performance implications
  - Maintainability
  - Scalability
  - Code reusability
  - Testing complexity

### 3. Consider Tradeoffs
- Short-term vs long-term benefits
- Complexity vs simplicity
- Performance vs readability
- Flexibility vs focused solution
- Time to implement vs perfect solution

### 4. Implementation Steps
1. Break down into subtasks
2. Start with core functionality
3. Implement incrementally
4. Test each component
5. Integrate components
6. Add error handling
7. Optimize if needed
8. Document decisions

### 5. Best Practices
- Write tests first (TDD approach)
- Keep functions small and focused
- Use meaningful names
- Comment complex logic
- Handle edge cases
- Consider future maintenance

## Checklist:
- [ ] Requirements fully understood
- [ ] Approach documented
- [ ] Tests written
- [ ] Code implemented
- [ ] Edge cases handled
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Performance acceptable

---

# Five Whys Analysis

Use the "Five Whys" root cause analysis technique to deeply understand problems.

## Process:

### 1. Define the Problem
Clearly state the issue or symptom

### 2. Ask "Why?" Five Times
- Why did this problem occur? → Answer 1
- Why did Answer 1 happen? → Answer 2
- Why did Answer 2 happen? → Answer 3
- Why did Answer 3 happen? → Answer 4
- Why did Answer 4 happen? → Answer 5 (Root Cause)

### 3. Validate Root Cause
- Verify the logical chain
- Check if addressing root cause prevents recurrence
- Consider multiple root causes if applicable

### 4. Develop Solutions
- Address the root cause, not just symptoms
- Create preventive measures
- Consider systemic improvements

## Example:
**Problem**: Application crashes when processing large files

1. **Why?** → The application runs out of memory
2. **Why?** → It loads entire file into memory at once
3. **Why?** → The file parser wasn't designed for streaming
4. **Why?** → Initial requirements only specified small files
5. **Why?** → Requirements gathering didn't consider future growth

**Root Cause**: Incomplete requirements gathering process
**Solution**: Implement streaming parser and improve requirements process

## Best Practices:
- Focus on process, not people
- Look for systemic issues
- Document the analysis
- Involve relevant stakeholders
- Test solutions address root cause

---

# Context Prime

Prime Claude with comprehensive project understanding.

## Standard Context Loading:
1. Read README.md for project overview
2. Read CLAUDE.md for AI-specific instructions
3. List project files excluding ignored paths
4. Review key configuration files
5. Understand project structure and conventions

## Steps:
1. **Project Overview**:
   - Read README.md
   - Identify project type and purpose
   - Note key technologies and dependencies

2. **AI Guidelines**:
   - Read CLAUDE.md if present
   - Load project-specific AI instructions
   - Note coding standards and preferences

3. **Repository Structure**:
   - Run: `git ls-files | head -50` for initial structure
   - Identify main directories and their purposes
   - Note naming conventions

4. **Configuration Review**:
   - Package manager files (package.json, Cargo.toml, etc.)
   - Build configuration
   - Environment setup

5. **Development Context**:
   - Identify test framework
   - Note CI/CD configuration
   - Review contribution guidelines

## Advanced Options:
- Load specific subsystem context
- Focus on particular technology stack
- Include recent commit history
- Load custom command definitions

## Output:
Establish clear understanding of:
- Project goals and constraints
- Technical architecture
- Development workflow
- Collaboration parameters
