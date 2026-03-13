# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Repository Overview

**Owner:** Auditkiller123 (boazstruik@gmail.com)
**Language:** Dutch (the owner writes content in Dutch)
**Created:** February 2026
**Status:** Early-stage / personal repository

This is currently a minimal personal repository. There is no application code yet — only a to-do list file. Future development may add software projects, scripts, or other content.

## Current Contents

| File | Description |
|------|-------------|
| `To do.txt` | Personal to-do list written in Dutch |

## Git Workflow

### Branches
- `main` — primary branch
- `master` — initial local branch (maps to `main` on remote)
- `claude/*` — branches used by AI assistants for automated changes

### Commit conventions
- Write commit messages in English
- Keep the first line under 72 characters
- Use the imperative mood: "Add file" not "Added file"

### Pushing changes
Always push to the designated feature branch:
```bash
git push -u origin <branch-name>
```

Branches created by Claude must follow the pattern: `claude/<description>-<session-id>`

## Conventions for AI Assistants

1. **Language:** The owner writes in Dutch. Respect Dutch content in existing files. Write code comments, commit messages, and documentation in English unless instructed otherwise.
2. **Minimal footprint:** This repo is intentionally lightweight. Do not add unnecessary files, boilerplate, or scaffolding unless explicitly requested.
3. **No assumed stack:** There is no established technology stack. If adding code, first confirm the language/framework with the user.
4. **Preserve existing content:** Do not modify or delete `To do.txt` unless explicitly asked.
5. **Documentation:** Keep this CLAUDE.md updated whenever the repository structure meaningfully changes.

## Development Setup

No build tools, package managers, or runtime dependencies are currently required. The repository contains only plain text files.

If a software project is added in the future, update this section with:
- Prerequisites and installation steps
- How to run the project locally
- How to run tests
- Build and deployment instructions

## Notes

- No `.gitignore` exists yet. Add one appropriate to the project type if/when code is introduced.
- No CI/CD pipelines are configured.
- No test infrastructure exists.
