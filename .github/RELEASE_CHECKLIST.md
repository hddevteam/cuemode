# CueMode Release Checklist

This checklist ensures a comprehensive and successful release process for CueMode VS Code extension.

## Pre-Release Preparation

### 🔍 Code Quality & Testing
- [x] All TypeScript compilation errors resolved (`npm run compile`)
- [x] All linting issues fixed (`npm run lint`)
- [x] All tests passing (`npm test`) - 82/82 tests passing
- [x] Test coverage maintained at 80%+
- [x] Integration tests for new features completed
- [ ] Manual testing on Windows, macOS, and Linux

### 📦 Version Management
- [x] Latest code pulled from remote repository (`git pull origin main`)
- [x] All merged PRs and contributions are included
- [x] Version number updated in `package.json` - v2.2.0
- [x] Version number updated in `docs/index.html` JSON-LD schema
- [x] Version consistency across all documentation files
- [x] Git working directory is clean (`git status`)

### 🌐 Internationalization (i18n)
- [x] All hardcoded strings replaced with i18n keys
- [x] Translation files updated for all 6 languages:
  - [x] `src/locales/en.json` (English)
  - [x] `src/locales/zh-CN.json` (Chinese Simplified)
  - [x] `src/locales/de.json` (German)
  - [x] `src/locales/fr.json` (French)
  - [x] `src/locales/ja.json` (Japanese)
  - [x] `src/locales/ko.json` (Korean)
- [x] Translation key consistency validated across all languages
- [x] i18next integration tested for all languages
- [x] Dynamic language switching functionality verified

### 📝 Documentation Updates
- [x] `CHANGELOG.md` updated with new version entry
- [x] `CHANGELOG.zh-CN.md` synchronized with English version
- [x] Version history summary table updated in both languages
- [x] All new features documented with examples
- [x] Feature cards updated in `docs/index.html` with new functionality
- [x] Feature cards updated in `docs/zh-cn.html` with new functionality
- [ ] Breaking changes clearly highlighted
- [ ] Migration guides provided if necessary

## Build & Package Optimization

### ⚡ Performance Optimization
- [x] Package size optimized (`npm run package`)
- [x] `.vscodeignore` updated to exclude unnecessary files:
  - [x] Demo files (e.g., `demo.gif`)
  - [x] Development artifacts
  - [x] Source maps (if not needed for production)
  - [x] Test files and documentation
- [x] Build pipeline optimized (`npm run vscode:prepublish`)
- [x] Resource bundling efficiency verified
- [x] Memory usage profiled and optimized

### 📦 Package Creation
- [x] VSIX package created successfully
- [x] Package size is reasonable (target: <1MB for CueMode) - 66.85KB
- [x] Package contents verified:
  - [x] All required source files included
  - [x] All 6 language files included in `out/locales/`
  - [x] No unnecessary files included
  - [x] Package.json metadata correct

## Feature Validation

### 🎯 Core Features Testing
- [x] Teleprompter mode activation/deactivation
- [x] Auto-scroll functionality (Space key)
- [x] Speed controls (+/- keys)
- [x] Direction toggle (R key)
- [x] Theme cycling (T key)
- [x] Focus mode toggle (F key)
- [x] Help dialog display (H key)
- [x] Exit functionality (Esc key)
- [x] Mirror flip toggle (M key) - New in v2.2.0

### 🎨 UI/UX Testing
- [x] All 7 color themes working correctly
- [x] Help dialog layout optimized (no text ellipsis)
- [x] Responsive design on different screen sizes
- [x] Keyboard shortcuts documented and functional
- [x] Visual indicators for focus mode working
- [x] Theme switching animations smooth
- [x] Mirror flip status indicator positioned correctly

### 🌐 Internationalization Testing
- [x] Language auto-detection from VS Code environment
- [x] Manual language switching functionality
- [x] All UI elements translated in each language
- [x] Proper text rendering for all character sets
- [x] Right-to-left language support (if applicable)
- [x] Pluralization rules working correctly

## Release Execution

### 📋 Git Management
- [ ] All changes committed with descriptive messages
- [ ] Version tag created (`git tag -a v{version}`)
- [ ] Tag includes comprehensive release notes
- [ ] Code pushed to remote repository (`git push origin main`)
- [ ] Tags pushed to remote repository (`git push origin --tags`)

### 🚀 VS Code Marketplace
- [ ] Extension published to marketplace (`vsce publish`)
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
- [x] GitHub Pages updated (`docs/index.html`)
- [x] Chinese documentation updated (`docs/zh-cn.html`)
- [x] Version badges updated on both pages
- [x] Feature descriptions synchronized
- [x] Meta descriptions updated with new features
- [ ] Language support statistics updated

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

**Last Updated**: 2025-07-14 for CueMode v2.1.0  
**Checklist Version**: 1.0  
**Applicable From**: CueMode v2.1.0+
