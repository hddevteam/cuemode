# Changelog

All notable changes to the CueMode Teleprompter extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [Unreleased]

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
| 2.0.0   | 2025-07-12  | **Professional Teleprompter 2.0** - T Key Cycling, TypeScript Migration, 71 Tests |
| 1.1.3   | 2025-07-12  | Bug fixes, performance improvements |
| 1.1.0   | 2024-XX-XX  | Real-time updates, live sync, improved positioning |
| 1.0.0   | 2024-XX-XX  | Initial release, basic functionality |

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