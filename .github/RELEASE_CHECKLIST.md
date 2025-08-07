# CueMode Release Checklist

This checklist ensures a comprehensive and successful release process for CueMode VS Code extension.

## Pre-Release Preparation

### 🔍 Code Quality & Testing
- [ ] All TypeScript compilation errors resolved (`npm run compile`)
- [ ] All linting issues fixed (`npm run lint`)
- [ ] All tests passing (`npm test`) - Target: 134/134 tests passing
- [ ] Test coverage maintained at 80%+
- [ ] Integration tests for new features completed
- [ ] Manual testing on Windows, macOS, and Linux

### 📦 Version Management
- [ ] Latest code pulled from remote repository (`git pull origin main`)
- [ ] All merged PRs and contributions are included
- [ ] Version number updated in `package.json` - v2.3.0
- [ ] Version number updated in `docs/index.html` JSON-LD schema
- [ ] Version consistency across all documentation files
- [ ] Git working directory is clean (`git status`)

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
- [ ] `README.md` updated with new features and version information
- [ ] `README.zh-CN.md` updated with new features and version information
- [ ] README badges updated to reflect new version
- [ ] README feature descriptions synchronized with new functionality
- [ ] Breaking changes clearly highlighted
- [ ] Migration guides provided if necessary

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
- [ ] Mirror flip toggle (M key) - New in v2.2.0
- [ ] Markdown parsing toggle (D key) - New in v2.3.0
- [ ] Line height adjustment (L key) - New in v2.3.0

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
- [ ] GitHub Pages updated (`docs/index.html`)
- [ ] Chinese documentation updated (`docs/zh-cn.html`)
- [ ] Version badges updated on both pages
- [ ] Feature descriptions synchronized
- [ ] Meta descriptions updated with new features
- [ ] Language support statistics updated
- [ ] GitHub repository description updated with new features
- [ ] GitHub repository topics/tags updated to reflect new capabilities

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

**Last Updated**: 2025-08-07 for CueMode v2.3.0  
**Checklist Version**: 1.2  
**Applicable From**: CueMode v2.3.0+
