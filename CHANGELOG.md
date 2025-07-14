# Changelog

All notable changes to the CueMode Teleprompter extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.1] - 2025-07-14 - Build Process & Package Optimization

### 🔧 Build Process Improvements

- **Enhanced Build Pipeline**: Improved vscode:prepublish script with proper esbuild integration
- **Package Optimization**: Added esbuild bundling for better performance and smaller bundle size
- **Localization Package Files**: Added VS Code package localization files for marketplace display
  - Added `package.nls.de.json` for German marketplace listing
  - Added `package.nls.fr.json` for French marketplace listing  
  - Added `package.nls.ja.json` for Japanese marketplace listing
  - Added `package.nls.ko.json` for Korean marketplace listing
- **Improved .vscodeignore**: Better exclusion of development files for smaller package size
- **Release Process Enhancement**: Updated release checklist with git pull requirement

### 🐛 Bug Fixes

- **Command Registration**: Fixed 'cuemode.cueMode' command not found issue
- **Build Script**: Resolved esbuild integration in prepublish workflow
- **Package Size**: Optimized final package size to 64KB (target: <1MB)

### 📦 Package Information

- **Package Size**: 64KB (optimized)
- **Bundle Size**: 158.4KB (esbuild optimized)
- **Files Included**: 20 files with comprehensive localization support
- **Languages Supported**: 6 languages in both runtime and marketplace listings

## [2.1.0] - 2025-07-14 - Focus Mode & Internationalization System Reconstruction

### 🌟 New Features

- **Enhanced Focus Mode**: Improved focused reading mode with keyboard toggle functionality
  - Press `F` key in teleprompter mode to instantly toggle focus mode on/off
  - Configurable focus opacity (0.1-0.8, default 0.3)
  - Adjustable focus lines (1-10 lines, default 3 lines)
  - Added `toggleFocusMode` command with keyboard shortcut
- **Smart Gradient Blur Algorithm**: Provides smooth reading experience with buffer zones
- **Focus Indicator**: Visual display of the current active reading area

### 🌐 Internationalization System Reconstruction

- **i18next Integration**: Replaced custom internationalization system with industry-standard i18next library
- **Dynamic Language Switching**: Support for runtime language switching without extension restart
- **Enhanced Translation Features**:
  - Support for `{{variable}}` syntax interpolation
  - Pluralization support
  - Context-aware translations
  - Missing key handling and fallback mechanisms
- **Automatic Language Detection**: Automatically detect language from VS Code environment or system locale settings
- **Type Safety**: Improved type safety for translation keys and parameters

- **Six New Languages Added**: Complete localization support for:
  - 🇺🇸 **English (en)** - Native language with complete feature set
  - 🇨� **Chinese Simplified (zh-CN)** - 简体中文完整本地化
  - �🇩🇪 **German (de)** - Deutsche Übersetzung für professionelle Nutzung
  - 🇫🇷 **French (fr)** - Traduction française complète et professionnelle
  - 🇯🇵 **Japanese (ja)** - 日本語による完全なローカライゼーション
  - 🇰🇷 **Korean (ko)** - 전문적인 한국어 현지화

- **Professional Teleprompter Terminology**: Industry-accurate translations for all features
- **Comprehensive Translation Coverage**: All UI elements, commands, notifications, and help text translated
- **Enhanced i18n Testing**: Expanded test suite to validate all 6 supported languages
- **Eliminated Hardcoded Text**: All user-facing strings now use the internationalization system

### 🔧 Architecture Improvements

- **🌐 Advanced Internationalization Framework**:
  - Migrated from TypeScript files to JSON-based translation system
  - Implemented centralized `src/i18n.ts` manager with i18next integration
  - Added `src/locales/` directory with 6 complete language files
  - Type-safe translation keys with compile-time validation
  - Asynchronous language loading with fallback mechanisms

- **File Structure Reorganization**:
  - Removed `src/i18n/` TypeScript files directory
  - Added `src/locales/` JSON translation files directory
  - Added centralized `src/i18n.ts` internationalization manager
- **Configuration Schema Updates**: Extended configuration interface with focus mode related properties
- **Dependency Management**: Added i18next as production dependency for professional i18n support

### ⚡ Performance & Size Optimization

- **Dramatic Package Size Reduction**: Extension package optimized from **6.8MB to 70KB** (99% reduction!)
- **Intelligent File Exclusion**: Optimized `.vscodeignore` to exclude unnecessary files:
  - Removed demo.gif (6.1MB) from distribution package
  - Excluded source files, documentation, and development artifacts
- **Build Pipeline Enhancement**: Added automated optimization scripts
  - Code minification and cleanup
  - Efficient resource bundling
  - Debug information removal
- **Faster Installation**: Significantly reduced download and installation time

### 🚀 User Experience Enhancements

- **Real-time Configuration Updates**: Focus mode settings take effect in real-time without restart
- **Enhanced Keyboard Shortcuts**:
  - `F` key: Toggle focus mode
  - `T` key: Cycle theme switching
  - Improved help system with localized shortcut descriptions
- **Visual Feedback Optimization**:
  - Focus area indicator with beautiful styling design
  - Improved line wrapping for better focus mode compatibility
  - Clear visual feedback for different modes and states

### 🧪 Quality Assurance

- **🌐 Comprehensive Multilingual Testing**:
  - Automated test suite covering all 6 supported languages
  - Translation key consistency validation across all locales
  - Cultural adaptation and character encoding verification
  - Language switching and persistence testing
  - Pluralization and interpolation functionality testing

- **Enhanced Test Suite**:
  - Comprehensive test coverage for new i18next system
  - Focus mode configuration and behavior testing
  - Updated configuration property tests
  - Cross-language UI consistency validation
- **Type Safety Improvements**: Enhanced type definitions for i18n functions to prevent runtime errors

### 🛠️ Technical Improvements

- **🌐 Multilingual Build System**: 
  - Automatic copying of JSON translation files during compilation
  - Build validation for translation file integrity
  - Optimized resource bundling for all language assets
  - Cultural-specific build optimizations

- **Build System Optimization**: Automatic copying of JSON translation files
- **Performance Optimizations**:
  - Efficient translation loading and caching with i18next
  - Language-specific resource optimization 
  - Optimized focus mode blur calculations using requestAnimationFrame
  - Improved memory management and resource cleanup
- **Asynchronous Extension Activation**: Proper async activation flow for i18n initialization

### 🎯 Accessibility Improvements

- **Screen Reader Support**: Enhanced ARIA labels and semantic markup
- **Keyboard Navigation**: Improved keyboard-only navigation experience
- **Visual Feedback**: Clear visual indicators for different modes and states

## [2.0.0] - 2025-07-12 - Professional Teleprompter 2.0

### 🚀 Major Features

- **T Key Theme Cycling**: Press 'T' in teleprompter mode to instantly cycle through themes
- **Professional Command Suite**: Added `changeTheme` and `removeLeadingSpaces` commands
- **Advanced Keyboard Shortcuts**:
  - `Ctrl+Shift+T` (Cmd+Shift+T on Mac) - Change theme via menu
  - `Ctrl+Shift+R` (Cmd+Shift+R on Mac) - Remove leading spaces
  - `T` key in teleprompter mode - Instant theme cycling
- **Content Preprocessing**: New command to clean up indented text for presentations
- **Interactive Help System**: Enhanced help panel with click-outside-to-close functionality

### 🎯 Professional Teleprompter Focus

- **TypeScript Migration**: Complete codebase rewrite for better maintainability
- **Comprehensive Testing**: 71 test cases ensuring reliability
- **Auto-scroll Controls**: Professional Space bar controls
- **Real-time Speed Adjustment**: +/- keys for live pace control
- **Direction Toggle**: R key for reverse scrolling
- **Minimalist UI**: Distraction-free reading experience
- **Professional Themes**: Optimized for video recording and presentations

### 🌐 Enhanced User Experience

- **Non-intrusive Notifications**: Auto-dismissing status bar messages (2-3 seconds)
- **Seamless UX**: Removed modal dialogs for quick status feedback
- **Internationalization**: Full English and Chinese support
- **Enhanced Error Handling**: Professional-grade logging and recovery

### 🛠️ Technical Improvements

- Migrated from `showInformationMessage` to `setStatusBarMessage` for better UX
- Added `cycleTheme` message type to WebView communication
- Enhanced command registration and cleanup
- Improved memory management for event listeners
- Strict TypeScript types and comprehensive error handling

### 📈 Code Quality

- Professional teleprompter functionality focus
- Comprehensive testing framework (71 test cases)
- Enhanced keyboard shortcuts for professional use
- Enhanced error handling and logging
- Professional teleprompter themes optimization

### Added

- Professional teleprompter functionality focus
- TypeScript migration for better code maintainability
- Comprehensive testing framework (71 test cases)
- Auto-scroll teleprompter controls with Space bar
- Real-time speed adjustment with +/- keys
- Direction toggle with R key for reverse scrolling
- Enhanced keyboard shortcuts for professional use
- Minimalist UI for distraction-free reading
- Internationalization support (English/Chinese)
- Enhanced error handling and logging
- Professional teleprompter themes optimization

### Changed

- **BREAKING**: Repositioned as professional teleprompter tool
- Updated all documentation to focus on teleprompter use cases
- Modular architecture for better code organization
- Enhanced development tooling and build process
- Improved marketing copy emphasizing teleprompter functionality
- Updated package description and keywords for better discoverability

### Fixed

- Various stability improvements
- Cross-platform compatibility issues
- Auto-scroll performance optimizations

## [1.1.3] - 2025-07-12 - Professional Teleprompter Update

### Added

- ✨ **Auto-scroll teleprompter**: Professional scroll controls with Space bar
- ✨ **Real-time speed control**: Adjust reading pace with +/- keys during presentation
- ✨ **Direction toggle**: Reverse scrolling with R key for flexible reading
- ✨ **Enhanced keyboard shortcuts**: Complete professional teleprompter control set
- ✨ **Minimalist UI**: Hidden controls for distraction-free reading experience
- 🌐 **Multi-language support**: English and Chinese interface
- 📺 **Teleprompter optimization**: Improved themes and layout for video recording

### Changed

- **Rebranded as professional teleprompter**: All documentation updated
- **Enhanced user experience**: Immediate feedback and smooth controls
- **Professional focus**: Optimized for content creators and educators

### Fixed

- Bug fixes and stability improvements
- Performance optimizations for smooth auto-scrolling
- UI consistency across different themes

## [1.1.0] - 2024-XX-XX - Enhanced Presentation Features

### Added

- Real-time settings updates - changes now reflect immediately in teleprompter mode
- Live content synchronization - text modifications update without re-entering mode
- Improved starting position - content now centers for better teleprompter experience

### Changed

- Enhanced user experience with immediate feedback
- Better positioning algorithm for content display
- Improved presentation flow and usability

### Fixed

- Resolved issues with settings not applying immediately
- Fixed content positioning inconsistencies
- Improved overall stability

## [1.0.0] - 2024-XX-XX

### Added

- Initial release of CueMode extension
- Basic "Cue Mode" functionality for enhanced readability
- Multiple color themes (Classic, Inverted, Midnight Blue, Sunset, Forest, Ocean, Rose)
- Customizable settings for font size, line height, and layout
- Context menu integration for easy access
- Configurable scrolling speed and starting position
- WebView-based presentation interface

### Features

- Font size adjustment (default: 24pt)
- Line height control (default: 1.5em)
- Content width limitation (default: 800px)
- Padding customization (default: 10px)
- Scroll speed control (default: 0.1)
- Starting position configuration (default: 50%)
- Seven beautiful color themes to choose from

---

## Version History Summary

| Version | Release Date | Key Features |
|---------|-------------|--------------|
| 2.1.0   | 2025-07-14  | **Focus Mode & i18n System Reconstruction** - F-key toggle, 6-language support, i18next integration, enhanced testing |
| 2.0.0   | 2025-07-12  | **Professional Teleprompter 2.0** - T Key Cycling, TypeScript Migration, 71 Tests |
| 1.1.3   | 2025-07-12  | Bug fixes, performance improvements |
| 1.1.0   | 2024        | Real-time updates, live sync, improved positioning |
| 1.0.0   | 2024        | Initial release, basic functionality |

---

## Upgrade Guide

### From 1.1.0 to 1.1.3

- No breaking changes
- Automatic update through VS Code
- All existing settings preserved

### From 1.0.0 to 1.1.0

- No breaking changes
- New real-time update features automatically available
- Settings migration handled automatically

---

*For more information about upcoming features, see our [Roadmap](ROADMAP.md).*
