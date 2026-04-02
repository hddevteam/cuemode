---
name: bugfix-and-release-workflow
description: 'Use when reviewing or executing the CueMode bug fix and release process: issue creation, branch-first workflow, TDD reproduction, release commit preparation, version bump, tag creation, VS Code Marketplace publish, GitHub Pages verification, and GitHub Release publishing.'
argument-hint: 'Describe the bug fix or release target version, for example: review patch release flow for v3.0.3'
user-invocable: true
---

# CueMode Bug Fix and Release Workflow

This skill captures the recommended workflow for shipping CueMode fixes safely and repeatably.

## When to Use

- Reviewing how a bug fix should move from report to release
- Preparing a patch release such as `v3.0.x`
- Checking whether the repository is ready for `vsce publish`
- Avoiding process mistakes such as publishing from an uncommitted workspace
- Teaching contributors the expected release sequence for this repository

## Core Rules

1. **Start from an issue.** Every meaningful fix should be traceable to an issue, bug report, or release blocker note.
2. **Create a branch before editing.** Do not begin implementation directly on `main` unless there is an explicit emergency exception.
3. **Use TDD for regressions.** Reproduce the bug with tests first whenever practical.
4. **Publish only from committed code.** The packaged VSIX, Marketplace release, git tag, and GitHub Release must all map to the same committed source.
5. **Keep the working tree clean before publish/tag/release.** No stray formatting edits, no pending docs leftovers.

## Recommended Branch Strategy

### For normal bug fixes

- Branch from `main`
- Naming suggestions:
  - `fix/cursor-sync-lag`
  - `fix/double-click-editor-mapping`
  - `fix/issue-6-cursor-return`

### For release preparation

- If the fix branch already contains all release-ready changes, merge it into `main` first
- Optionally use a dedicated release branch only when there are release-only follow-up edits:
  - `release/3.0.2`

## Bug Fix Procedure

1. Create or confirm the issue.
2. Create a dedicated branch from `main`.
3. Reproduce the problem with tests.
4. Implement the smallest fix that makes the tests pass.
5. Run validation:
   - `npm run docs:check`
   - `npm run test`
6. Update docs only where the feature or fix is user-visible.
7. Commit the fix with a descriptive English commit message.
8. Merge or fast-forward the validated result into `main`.

## Release Procedure

1. Pull latest `main`.
2. Confirm all intended fixes are already merged.
3. Bump version and update release surfaces:
   - `package.json`
   - `CHANGELOG.md`
   - `CHANGELOG.zh-CN.md`
   - `README.md`
   - `README.zh-CN.md`
   - `docs/index.html`
   - `docs/zh-cn.html`
   - `.github/copilot-instructions.md` if current version is mentioned there
4. Run validation again:
   - `npm run docs:check`
   - `npm run test`
   - `npm run package`
5. Verify `git status --short` is empty or intentionally clean.
6. Commit the release metadata.
7. Push `main`.
8. Create the annotated tag on that exact commit:
   - `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
9. Push the tag.
10. Publish to Marketplace from that clean tagged state:
    - `npm exec vsce publish`
11. Create the GitHub Release and attach the VSIX.
12. Verify propagation:
    - Marketplace page shows the new version
    - GitHub Pages English page is updated
    - GitHub Pages Chinese page is updated

## Anti-Patterns to Avoid

- Starting implementation directly on `main`
- Publishing before the release commit exists
- Tagging a commit that is different from the published VSIX source
- Leaving formatting-only leftovers after release
- Updating only one language of docs or changelog
- Assuming Marketplace publish is blocked just because `VSCE_PAT` is not in the shell; cached credentials may still work

## Repository-Specific Notes

- For this repository, `npm run test` is the authoritative release validation path.
- `npm run test:unit` is not enough for release readiness because plain Mocha does not provide the full VS Code extension host environment.
- After release work, re-check for formatter-only drift in `package.json` and `docs/*.html` and revert it if it does not represent a meaningful content change.

## Reference

- Release checklist: `../../RELEASE_CHECKLIST.md`
