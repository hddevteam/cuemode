# Copilot Instructions for CueMode Extension

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a VS Code extension project. Please use the get_vscode_api with a query as input to fetch the latest VS Code API references.

## Project Overview
CueMode is a VS Code extension that provides "Prompter Mode" functionality for presentations and demonstrations:
- Transform VS Code into a fullscreen presentation tool
- Customizable themes and color schemes
- Real-time text display for presentations
- Keyboard shortcuts for seamless control
- Multi-language interface (English and Chinese with extensible architecture)

## Project Status
- **VS Code Marketplace**: Published as "CueMode" (luckyxmobile.cuemode)
- **GitHub Repository**: https://github.com/hddevteam/cuemode
- **Current Version**: 1.1.3 (migrating to TypeScript)
- **License**: MIT
- **Target Audience**: Developers, presenters, educators, streamers

## Architecture
- `src/extension.ts` - Main extension entry point (TypeScript)
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions (configuration, theme management)
- `src/ui/` - User interface components (webview management)
- `src/i18n/` - Internationalization support
  - `index.ts` - I18n manager and interface definitions
  - `en.ts` - English language pack
  - `zh-cn.ts` - Chinese language pack
- `webview.html` - Legacy webview template (being phased out)
- `extension.js` - Legacy main file (being replaced by TypeScript)

## Key Features
- **Fullscreen Mode**: Transform VS Code into a presentation display
- **Theme System**: 7 built-in color themes with accessibility support
- **Keyboard Shortcuts**: 
  - `Ctrl+Shift+P` (Cmd+Shift+P on Mac) → "CueMode: Toggle Prompter Mode"
  - `Escape` to exit prompter mode
- **Real-time Updates**: Live text updates as you type
- **Multi-language Support**: English and Chinese interface
- **Configurable Settings**: Font size, themes, display options

## Coding Guidelines
1. **Follow TypeScript best practices** for VS Code extensions
2. **Use VS Code API properly** - always check API references before implementation
3. **Error handling** - provide comprehensive error handling and user feedback
4. **Accessibility** - ensure color contrast ratios meet WCAG standards
5. **Performance** - optimize for smooth real-time updates
6. **Memory efficiency** - properly dispose of resources and event listeners
7. **Internationalization (i18n)** - ALWAYS use the I18n system for user-facing text
8. **Code comments** - write all code comments in English for international collaboration
9. **Language consistency** - maintain consistent terminology across all supported languages
10. **Commit messages** - write all commit messages in English

## TypeScript Migration
The project is currently migrating from JavaScript to TypeScript:
- ✅ Complete TypeScript architecture in `src/` directory
- ✅ Type definitions for all components
- ✅ Strict TypeScript configuration
- ✅ ESLint integration for TypeScript
- 🔄 Legacy `extension.js` will be replaced by `src/extension.ts`
- 🔄 Legacy `webview.html` will be replaced by generated HTML in `src/ui/webview.ts`

## Internationalization (i18n) Guidelines

### Text Localization Rules
1. **NEVER hardcode user-facing text** - always use `I18n.t()` for any text shown to users
2. **Import I18n** in all files that display user messages: `import { I18n } from '../i18n'`
3. **Use consistent message keys** - follow the established naming convention in language files
4. **Test both languages** - ensure features work correctly in both English and Chinese

### I18n System Usage
```typescript
// ✅ Correct - using I18n system
vscode.window.showInformationMessage(I18n.t('commands.prompterModeActivated'));

// ❌ Wrong - hardcoded text
vscode.window.showInformationMessage('Prompter mode activated');
```

### Adding New Text
1. Add the text key to `src/i18n/en.ts` (English)
2. Add the corresponding translation to `src/i18n/zh-cn.ts` (Chinese)
3. Update the `Messages` interface in `src/i18n/index.ts` if needed
4. Use `I18n.t('category.key')` in your code

### Language Detection Priority
1. VS Code language setting (`vscode.env.language`)
2. Chinese variants (zh-cn, zh) → Chinese interface
3. All others → English interface (default)

## Dependencies
- **Core**: VS Code Extension API (vscode)
- **Development**: TypeScript, ESLint, @types/vscode
- **Build**: esbuild or webpack for bundling (to be configured)
- **Testing**: @vscode/test-electron for extension testing

## Configuration Schema
The extension contributes the following configuration options:
- `cuemode.theme` - Color theme selection
- `cuemode.fontSize` - Font size for prompter text
- `cuemode.autoHide` - Auto-hide VS Code UI elements
- `cuemode.transparency` - Background transparency level

## Command Palette Integration
- `cuemode.togglePrompterMode` - Toggle prompter mode on/off
- `cuemode.changeTheme` - Change color theme
- `cuemode.resetSettings` - Reset to default settings

## Development Workflow

### Development Setup
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Test the extension
npm run test
```

### Testing
- Use F5 in VS Code to launch Extension Development Host
- Test in both English and Chinese locales
- Verify keyboard shortcuts work correctly
- Test theme switching and configuration changes

### Build and Package
```bash
# Build for production
npm run build

# Package the extension
vsce package
```

### Commit Guidelines
- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Write in English for international collaboration
- Reference issues: `closes #123` or `fixes #456`
- Keep commits focused and atomic

## Error Handling Patterns
1. **Graceful Degradation**: Extension should work even if some features fail
2. **User Feedback**: Always inform users about errors with actionable messages
3. **Logging**: Use VS Code's output channel for debugging information
4. **Recovery**: Provide ways to recover from error states

## Performance Considerations
1. **WebView Optimization**: Minimize DOM updates and use efficient rendering
2. **Memory Management**: Properly dispose of event listeners and resources
3. **Startup Time**: Lazy load non-essential components
4. **Real-time Updates**: Debounce rapid text changes to prevent UI lag

## Security Guidelines
1. **Content Security Policy**: Implement strict CSP for webview content
2. **User Input Validation**: Sanitize all user inputs
3. **File System Access**: Validate file paths and permissions
4. **No Arbitrary Code Execution**: Avoid eval() and similar functions

## Accessibility Requirements
1. **Color Contrast**: All themes must meet WCAG AA standards (4.5:1 ratio)
2. **Keyboard Navigation**: All features accessible via keyboard
3. **Screen Reader Support**: Proper ARIA labels and semantic HTML
4. **Focus Management**: Clear focus indicators and logical tab order

## Browser Compatibility
Since this runs in VS Code's Electron environment:
- Target modern JavaScript features (ES2020+)
- Use VS Code's built-in APIs instead of Node.js when possible
- Test on Windows, macOS, and Linux

## Future Roadmap
- Enhanced theme customization
- Plugin system for custom themes
- Integration with presentation tools
- Remote presentation capabilities
- Advanced text formatting options

## Resources
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Internationalization Guide](https://code.visualstudio.com/api/references/extension-guidelines#internationalization)
