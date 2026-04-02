---
description: 'Use when fixing bugs, preparing a patch release, reviewing release readiness, updating changelogs/docs for a release, creating tags, publishing to VS Code Marketplace, or creating GitHub Releases in the CueMode repository. Enforces issue-first, branch-first, TDD, and clean-release workflow rules.'
name: 'CueMode Bugfix and Release Workflow'
---

# CueMode Bugfix and Release Workflow

When a task involves a bug fix, regression, release preparation, or publishing work in this repository, follow these rules by default:

- Start from an issue, bug report, or explicit release scope whenever practical.
- Create a dedicated branch from `main` before implementation unless the user explicitly wants an emergency direct fix.
- Prefer TDD for regressions: reproduce with tests first, then fix.
- Do not publish from an uncommitted or dirty working tree.
- The packaged VSIX, Marketplace release, git tag, and GitHub Release should all correspond to the same committed source.
- Merge validated fixes into `main` before release packaging and publish steps.
- Re-check `git status --short` after release work; revert formatting-only leftovers instead of creating noise commits.

For the detailed procedure, load and follow:

- `./../skills/bugfix-and-release-workflow/SKILL.md`
- `./../RELEASE_CHECKLIST.md`

Repository-specific defaults:

- Treat `npm run test` as the release validation baseline.
- Do not rely on `npm run test:unit` alone for release readiness.
- Update both English and Chinese release surfaces together when user-visible behavior changes.
