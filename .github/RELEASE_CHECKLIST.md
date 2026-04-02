# CueMode Release Checklist

This checklist ensures a comprehensive and successful release process for CueMode VS Code extension.

## Recommended Workflow Order

### 🐞 Bug Fix / Feature Fix Workflow

- [ ] Issue exists and scope is clear before coding (link bug, user report, or release blocker)
- [ ] Create a dedicated branch from `main` before making changes
  - [ ] Suggested naming: `fix/<short-topic>` or `release/<version>`
- [ ] Write or update tests first for regressions / TDD reproduction
- [ ] Keep implementation commits separate from pure release metadata updates when practical
- [ ] Merge or fast-forward the validated fix back into `main` before publishing

### 🚦 Release Safety Rules

- [ ] Publish only from a **clean working tree** (`git status --short` returns nothing)
- [ ] The published VSIX must come from code that is already committed
- [ ] The release tag must point to the exact commit used for packaging / publishing
- [ ] Avoid publishing from an uncommitted workspace or a branch that is not pushed

## Pre-Release Preparation

### 🔍 Code Quality & Testing

- [ ] All TypeScript compilation errors resolved (`npm run compile`)
- [ ] All linting issues fixed (`npm run lint`)
- [ ] All tests passing (`npm test`) - latest test suite green
- [ ] Test coverage maintained at 80%+
- [ ] Integration tests for new features completed

### 📦 Version Management

- [ ] Latest code pulled from remote repository (`git pull origin main`)
- [ ] Release work starts from the correct base branch (`main`)
- [ ] All merged PRs and contributions are included
- [ ] Version number updated in `package.json`
- [ ] Version number updated in both Pages entry points:
  - [ ] `docs/index.html`
  - [ ] `docs/zh-cn.html`
- [ ] Version consistency across all documentation files and release notes
- [ ] Git working directory is clean (`git status`) - **Before package / publish / tag**

### 🌐 Internationalization (i18n)

- [ ] All hardcoded strings replaced with i18n keys
- [ ] Translation files updated for all 6 languages:
  - [ ] `src/locales/en.json` (English)
  - [ ] `src/locales/zh-CN.json` (Chinese Simplified)
  - [ ] `src/locales/de.json` (German)
  - [ ] `src/locales/fr.json` (French)
  - [ ] `src/locales/ja.json` (Japanese)
  - [ ] `src/locales/ko.json` (Korean)
- [ ] Translation key consistency validated across all languages
- [ ] i18next integration tested for all languages
- [ ] Dynamic language switching functionality verified

### 📝 Documentation Updates

- [ ] `CHANGELOG.md` updated with new version entry
- [ ] `CHANGELOG.zh-CN.md` synchronized with English version
- [ ] Version history summary table updated in both languages
- [ ] All new features documented with examples
- [ ] Feature cards updated in `docs/index.html` with new functionality
- [ ] Feature cards updated in `docs/zh-cn.html` with new functionality
- [ ] Font Awesome icon references fixed for proper display
- [ ] `README.md` updated with new features and version information
- [ ] `README.zh-CN.md` updated with new features and version information
- [ ] README feature descriptions synchronized with new functionality
- [ ] Breaking changes clearly highlighted - **No breaking changes**
- [ ] Migration guides provided if necessary - **Not needed**
- [ ] `.github/copilot-instructions.md` current version updated if release metadata changed

## Build & Package Optimization

### ⚡ Performance Optimization

- [ ] Package size optimized (`npm run package`)
- [ ] `.vscodeignore` updated to exclude unnecessary files:
  - [ ] Demo files (e.g., `demo.gif`)
  - [ ] Development artifacts
  - [ ] Source maps (if not needed for production)
  - [ ] Test files and documentation
- [ ] Build pipeline optimized (`npm run vscode:prepublish`)
- [ ] Resource bundling efficiency verified
- [ ] Memory usage profiled and optimized

### 📦 Package Creation

- [ ] VSIX package created successfully
- [ ] Package size is reasonable (target: <1MB for CueMode)
- [ ] Package contents verified:
  - [ ] All required source files included
  - [ ] All 6 language files included in `out/locales/`
  - [ ] No unnecessary files included
  - [ ] Package.json metadata correct

## Feature Validation

### 🎯 Core Features Testing

- [ ] Teleprompter mode activation/deactivation
- [ ] Auto-scroll functionality (Space key)
- [ ] Speed controls (+/- keys)
- [ ] Direction toggle (R key)
- [ ] Theme cycling (T key)
- [ ] Focus mode toggle (F key)
- [ ] Help dialog display (H key)
- [ ] Exit functionality (Esc key)
- [ ] Mirror flip toggle (M key)
- [ ] Markdown parsing toggle (D key)
- [ ] Line height adjustment (L key)

### 🎨 UI/UX Testing

- [ ] All 7 color themes working correctly
- [ ] Help dialog layout optimized (no text ellipsis)
- [ ] Responsive design on different screen sizes
- [ ] Keyboard shortcuts documented and functional
- [ ] Visual indicators for focus mode working
- [ ] Theme switching animations smooth
- [ ] Mirror flip status indicator positioned correctly
- [ ] Markdown mode status indicator working
- [ ] Line height adjustment feedback working

### 🌐 Internationalization Testing

- [ ] Language auto-detection from VS Code environment
- [ ] Manual language switching functionality
- [ ] All UI elements translated in each language
- [ ] Proper text rendering for all character sets
- [ ] Right-to-left language support (if applicable)
- [ ] Pluralization rules working correctly

## Release Execution

### 📋 Git Management

- [ ] Bug fix / feature fix committed on dedicated branch first
- [ ] Release commit created on `main` (or merged to `main`) with descriptive English message
- [ ] `main` pushed to remote **before or together with** release tagging
- [ ] Version tag created on the exact release commit (`git tag -a v{version}`)
- [ ] Tag includes comprehensive release notes
- [ ] Code pushed to remote repository (`git push origin main`)
- [ ] Tag pushed to remote repository (`git push origin v{version}`)
- [ ] Post-push verification: `git status --short` still clean

### 🚀 VS Code Marketplace

- [ ] Extension published to marketplace (`vsce publish` / `npm exec vsce publish`)
- [ ] Publish command executed from a clean checkout of the tagged release commit
- [ ] Publication successful (check marketplace URL)
- [ ] Extension description and metadata accurate
- [ ] Screenshots and documentation up to date
- [ ] Marketplace listing reflects new features

### 🌟 GitHub Release

- [ ] GitHub Release created (`gh release create`)
- [ ] Release notes comprehensive and well-formatted
- [ ] VSIX file attached to release
- [ ] Release marked as "Latest" if it's the current version
- [ ] Release description includes:
  - [ ] Major features overview
  - [ ] Breaking changes (if any)
  - [ ] Installation instructions
  - [ ] Supported languages list
  - [ ] Changelog link

## Post-Release Verification

### 🔍 Quality Assurance

- [ ] Extension installs correctly from marketplace
- [ ] All features work in fresh VS Code installation
- [ ] No console errors or warnings
- [ ] Performance metrics within acceptable ranges
- [ ] User-reported issues addressed promptly

### 📖 Documentation Sync

- [ ] GitHub Pages English page live and updated (`docs/index.html`)
- [ ] GitHub Pages Chinese page live and updated (`docs/zh-cn.html`)
- [ ] Version badges updated on both pages
- [ ] Feature descriptions synchronized
- [ ] Meta descriptions updated with new features
- [ ] Language support statistics updated
- [x] GitHub repository description updated with new features
- [x] GitHub repository topics/tags updated to reflect new capabilities

### 📊 Monitoring & Analytics

- [ ] Download statistics monitored
- [ ] User feedback and reviews monitored
- [ ] Error reporting systems checked
- [ ] Performance metrics tracked
- [ ] Community response assessed

## Rollback Plan

### 🚨 Emergency Procedures

- [ ] Rollback procedure documented
- [ ] Previous version VSIX file preserved
- [ ] Marketplace rollback process understood
- [ ] Git revert procedures documented
- [ ] Communication plan for users in case of issues

## Release Communication

### 📢 Announcement Channels

- [ ] Release announcement prepared
- [ ] Social media posts scheduled (if applicable)
- [ ] Community notifications sent
- [ ] Contributor acknowledgments included
- [ ] User migration guides published

---

## Checklist Usage Notes

### For AI Agents:

- Use this checklist as a comprehensive guide for release validation
- Verify each item before proceeding to the next section
- Document any deviations or issues encountered
- Ensure all translations and documentation are synchronized
- Pay special attention to internationalization completeness
- Do not publish before the release commit and tag are aligned with the packaged source
- Prefer dedicated fix / release branches over direct edits on `main`

### For Human Reviewers:

- Review checklist completion before final release approval
- Spot-check critical items manually
- Validate that all automated checks passed
- Ensure user experience remains consistent across languages

### Version-Specific Notes:

- Update this checklist as new features are added
- Maintain checklist version history for future reference
- Adapt checklist items based on lessons learned from each release

---

**Last Updated**: 2026-04-02 for CueMode v3.0.2  
**Checklist Version**: 1.3  
**Applicable From**: CueMode v3.0.2+
