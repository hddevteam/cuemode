# Copilot Instructions for CueMode Extension

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a VS Code extension project. Please use the get_vscode_api with a query as input to fetch the latest VS Code API references.

## Project Overview

CueMode is a VS Code extension that provides professional teleprompter functionality for presentations and demonstrations:

- Transform VS Code into a fullscreen presentation tool with distraction-free interface
- 7 professional color themes with WCAG AA compliance
- Real-time text display with auto-scroll capabilities
- Comprehensive keyboard shortcuts for seamless control
- Multi-language interface (English and Chinese with extensible i18next architecture)
- Advanced focus mode for improved reading concentration
- Performance-optimized with < 100ms activation time

## Available Development Tools

### Local Tools & CLI
- **GitHub CLI (`gh`)**: Used for repository management, issue tracking, and automated workflows
  - Branch operations and pull requests
  - Issue and release management
  - CI/CD workflow interaction
  - Repository configuration

- **SVG Conversion (`rsvg-convert`)**:
  - Converting SVG assets to PNG/PDF
  - Icon and badge generation
  - Documentation graphics processing
  - Build-time asset optimization

### Tool Usage Guidelines

#### GitHub CLI Best Practices
- Use `gh` for automated workflows and CI/CD integration
- Maintain consistent commit messages and branch naming
- Follow repository governance through CLI commands
- Automate release and version management

#### SVG Asset Management
- Convert icons and badges during build process
- Maintain vector source files in repository
- Generate optimized assets for documentation
- Support high DPI and accessibility requirements

### Integration with VS Code Extension
- GitHub CLI for extension publishing workflow
- SVG conversion for extension icons and badges
- Automated asset pipeline in build process
- Quality assurance and release automation

## Project Status

- **VS Code Marketplace**: Published as "CueMode" (luckyxmobile.cuemode)
- **GitHub Repository**: <https://github.com/hddevteam/cuemode>
- **Current Version**: 2.1.0
- **License**: MIT
- **Target Audience**: Developers, presenters, educators, streamers, content creators

## Architecture

```
src/
├── extension.ts           # Main extension entry point with CueModeExtension class
├── i18n.ts               # i18next-based internationalization system
├── types/                # TypeScript type definitions
│   └── index.ts          # Core types and interfaces
├── ui/                   # User interface components
│   └── webview.ts        # Webview management and HTML generation
├── utils/                # Utility modules
│   ├── config.ts         # Configuration management with validation
│   └── theme.ts          # Theme system with 7 professional themes
├── locales/              # Language resource files
│   ├── en.json           # English translations
│   └── zh-CN.json        # Chinese translations
└── test/                 # Comprehensive test suite
    ├── runTest.ts        # Test runner
    └── suite/            # Test cases
```

## Key Features

### 🎨 Professional Theme System

- **7 Built-in Themes**: Classic, Inverted, Midnight Blue, Sunset, Forest, Ocean, Rose
- **WCAG AA Compliant**: 4.5:1 color contrast ratio minimum
- **Live Theme Switching**: `T` key in webview, `Ctrl+Shift+T` in VS Code
- **Accessibility Validation**: Automatic contrast ratio calculation
- **Persistent Preferences**: Theme settings saved across sessions

### ⌨️ Comprehensive Keyboard Shortcuts

**VS Code Shortcuts:**

- `Ctrl+Shift+P` (Cmd+Shift+P): Activate CueMode
- `Ctrl+Shift+T` (Cmd+Shift+T): Change theme
- `Ctrl+Shift+R` (Cmd+Shift+R): Remove leading spaces

**Webview Shortcuts:**

- `Space`: Start/Stop auto-scroll
- `+/-`: Adjust scroll speed
- `T`: Cycle through themes
- `F`: Toggle focus mode
- `R`: Toggle scroll direction
- `H`: Show/Hide help
- `Escape`: Exit prompter mode
- Arrow keys, Page Up/Down, Home/End: Navigation

### 🎯 Focus Mode

- **Intelligent Text Highlighting**: Improves reading concentration
- **Configurable Line Count**: 1-10 lines focus area
- **Adjustable Opacity**: 0.1-0.8 for non-focused text
- **Toggle Control**: `F` key in webview
- **Persistent Settings**: Focus mode preferences saved

### 🌐 Advanced Internationalization

- **i18next-based System**: Type-safe translations with pluralization
- **Dynamic Language Detection**: From VS Code environment
- **Resource Management**: JSON-based translation files
- **Extensible Architecture**: Easy to add new languages
- **Context-aware Translations**: Cultural adaptation support

### 🚀 Performance Features

- **Fast Activation**: < 100ms including i18n initialization
- **Memory Efficient**: < 15MB active usage
- **Smooth Animations**: 60fps with CSS transitions
- **Real-time Updates**: Debounced text changes
- **Content Security Policy**: Nonce-based script loading

## Coding Guidelines

1. **Follow TypeScript best practices** for VS Code extensions
2. **Use VS Code API properly** - always check API references before implementation
3. **Error handling** - provide comprehensive error handling and user feedback
4. **Accessibility** - ensure color contrast ratios meet WCAG AA standards (4.5:1 minimum)
5. **Performance** - optimize for smooth real-time updates and < 100ms activation
6. **Memory efficiency** - properly dispose of resources and event listeners
7. **Internationalization (i18n)** - ALWAYS use the i18next system for user-facing text
8. **Code comments** - write all code comments in English for international collaboration
9. **Language consistency** - maintain consistent terminology across all supported languages
10. **Commit messages** - write all commit messages in English
11. **Testing** - maintain 80%+ test coverage with comprehensive unit and integration tests

## TypeScript Migration

The project has completed its TypeScript migration:

- ✅ Complete TypeScript architecture in `src/` directory
- ✅ Type definitions for all components with strict mode
- ✅ Comprehensive ESLint configuration
- ✅ Full test coverage for all components
- ✅ Performance optimization and memory management
- ✅ i18next integration with type safety

## Internationalization (i18n) Guidelines

### i18next-based System Usage

```typescript
// Import the i18next-based system
import { I18nManager } from './i18n';

// Initialize (done automatically in extension activation)
await I18nManager.getInstance().initialize();

// Use translations
const message = I18nManager.getInstance().t('notifications.activated');
vscode.window.showInformationMessage(message);
```

### Text Localization Rules

1. **NEVER hardcode user-facing text** - always use `I18nManager.getInstance().t()` for any text shown to users
2. **Import I18nManager** in all files that display user messages: `import { I18nManager } from '../i18n'`
3. **Use consistent message keys** - follow the established naming convention in JSON files
4. **Test both languages** - ensure features work correctly in both English and Chinese
5. **Handle pluralization** - use i18next pluralization features for count-based messages

### Adding New Text

1. Add the text key to `src/locales/en.json` (English)
2. Add the corresponding translation to `src/locales/zh-CN.json` (Chinese)
3. Use `I18nManager.getInstance().t('category.key')` in your code
4. For pluralization: `I18nManager.getInstance().t('category.key', { count: number })`

### Language Detection Priority

1. VS Code language setting (`vscode.env.language`)
2. Environment variable (`process.env.VSCODE_NLS_CONFIG`)
3. Chinese variants (zh-cn, zh) → Chinese interface
4. All others → English interface (default)

## Configuration Schema

The extension supports comprehensive configuration options:

```json
{
  "cuemode.colorTheme": {
    "type": "string",
    "enum": ["classic", "inverted", "midnightBlue", "sunset", "forest", "ocean", "rose"],
    "default": "classic"
  },
  "cuemode.fontSize": {
    "type": "number",
    "default": 24,
    "minimum": 8,
    "maximum": 100
  },
  "cuemode.focusMode": {
    "type": "boolean",
    "default": false
  },
  "cuemode.focusOpacity": {
    "type": "number",
    "default": 0.3,
    "minimum": 0.1,
    "maximum": 0.8
  },
  "cuemode.focusLineCount": {
    "type": "number",
    "default": 3,
    "minimum": 1,
    "maximum": 10
  },
  "cuemode.scrollSpeed": {
    "type": "number",
    "default": 0.1,
    "minimum": 0.01,
    "maximum": 1
  }
}
```

## Command Palette Integration

- `cuemode.cueMode` - Toggle teleprompter mode
- `cuemode.changeTheme` - Change color theme
- `cuemode.removeLeadingSpaces` - Remove leading spaces from text
- `cuemode.toggleFocusMode` - Toggle focus mode

## Development Workflow

### Development Setup

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Run tests
npm test

# Lint code
npm run lint
```

### Testing Strategy

- **Unit Tests**: All core components with Mocha
- **Integration Tests**: VS Code Test Runner
- **Coverage Target**: 80%+ test coverage
- **Performance Tests**: Activation time and memory usage
- **Accessibility Tests**: Color contrast validation
- **Markdown Rendering Tests**: Dedicated debugging tools for comprehensive markdown parsing validation

### Debugging Tools

The project includes advanced debugging tools for markdown rendering:

#### File Organization for Testing

**Temporary File Structure:**
```
.temp/
├── debug/          # Generated HTML debug files
├── test-files/     # Temporary test markdown files
└── reports/        # Test reports and analysis
```

**File Management Rules:**
- All temporary test files should be created in `.temp/test-files/`
- Generated debug HTML files should be output to `.temp/debug/`
- Use descriptive naming: `test-[feature]-[variant].md` and `debug-[feature]-[variant].html`
- The `.temp/` directory is gitignored and can be safely deleted
- Keep only essential debug tools (`cuemode-renderer.js`, `debug-md.js`) in root

#### CueModeRenderer (cuemode-renderer.js)
- **Purpose**: Production-grade debugging renderer using real extension modules
- **Features**: Real MarkdownParser, ThemeManager, CSS generation with debug capabilities
- **Usage**: `const renderer = new CueModeRenderer(options); renderer.renderFile(markdownPath, outputPath);`
- **Output**: Interactive HTML with debug information, block boundaries, and real-time style adjustment

#### CLI Debugging Tool (debug-md.js)
- **Purpose**: Command-line interface for quick markdown file testing
- **Usage**: `node debug-md.js <markdown-file> [options]`
- **Options**: 
  - `--fontSize=<number>`: Font size (default: 25)
  - `--lineHeight=<number>`: Line height (default: 1)
  - `--padding=<number>`: Padding (default: 10)
  - `--theme=<theme>`: Theme (default: rose)
  - `--output=<file>`: Output filename
- **Features**: Automatic browser opening, detailed statistics, interactive debugging

#### Integration Testing Workflow

1. **Create test markdown file**: `echo "# Test" > .temp/test-files/test-[feature].md`
2. **Generate debug HTML**: `node debug-md.js .temp/test-files/test-[feature].md --output=.temp/debug/debug-[feature].html`
3. **Visual validation**: Open `.temp/debug/debug-[feature].html` in browser for proper rendering
4. **Code inspection**: Use browser developer tools to verify CSS application
5. **Performance analysis**: Monitor rendering statistics and block processing
6. **Cleanup**: Remove temporary files after testing

#### Example Testing Commands

```bash
# Create test file in proper location
echo "# Test Content" > .temp/test-files/test-feature.md

# Generate debug output with organized file structure
node debug-md.js .temp/test-files/test-indentation.md --output=.temp/debug/debug-indentation.html

# Test specific features with custom settings
node debug-md.js .temp/test-files/test-complex.md --fontSize=30 --theme=dark --output=.temp/debug/debug-complex.html

# Quick theme testing with organized output
node debug-md.js .temp/test-files/sample.md --theme=ocean --fontSize=25 --output=.temp/debug/debug-ocean-theme.html

# Clean up temporary files when done
rm -rf .temp/debug/*.html .temp/test-files/*.md
```

#### Debug Features

- **Visual Block Boundaries**: Red borders around logical blocks
- **Element Type Highlighting**: Color-coded backgrounds (blue=headers, yellow=tables, purple=code, green=lists)
- **Interactive Inspection**: Click any block to see details in console
- **Real-time Style Adjustment**: CSS debugging capabilities
- **Statistics Display**: Block count, filtering results, configuration details
- **CSS Synchronization**: Identical styling between extension and debugging tools

### Performance Benchmarks

- **Extension activation**: < 100ms (including i18n initialization)
- **Theme switching**: < 50ms (with CSS variable updates)
- **Configuration updates**: < 10ms latency
- **Memory usage**: < 15MB active (including i18next resources)
- **Webview rendering**: < 200ms for 10,000+ character documents

## Security Guidelines

1. **Content Security Policy**: Implement strict CSP with nonce-based script loading
2. **User Input Validation**: Sanitize all user inputs in webview
3. **File System Access**: Validate file paths and permissions
4. **No Arbitrary Code Execution**: Avoid eval() and similar functions
5. **Message Passing**: Secure communication between extension and webview

## Accessibility Requirements

1. **Color Contrast**: All themes must meet WCAG AA standards (4.5:1 ratio minimum)
2. **Keyboard Navigation**: All features accessible via keyboard shortcuts
3. **Screen Reader Support**: Proper ARIA labels and semantic HTML
4. **Focus Management**: Clear focus indicators and logical tab order
5. **Contrast Validation**: Automatic contrast ratio calculation and validation

## Error Handling Patterns

1. **Graceful Degradation**: Extension should work even if some features fail
2. **User Feedback**: Always inform users about errors with actionable messages using i18n
3. **Logging**: Use VS Code's output channel for debugging information
4. **Recovery**: Provide ways to recover from error states
5. **Comprehensive Testing**: Unit tests for error scenarios

## Future Roadmap

### Advanced Features

- **Presentation Mode**: Time indicators, speaker notes, progress display
- **Usage Analytics**: Reading speed analysis, personalized recommendations
- **Multi-user Collaboration**: Remote control, real-time synchronization
- **AI Integration**: Smart content analysis, speech rate suggestions
- **Plugin System**: Third-party themes, custom extensions

### Additional Languages

- Japanese, Korean, French, German support
- Community-driven translation contributions
- Cultural adaptation for UI elements

## Dependencies

- **Core**: VS Code Extension API (vscode) ^1.82.0
- **Internationalization**: i18next ^23.0.0
- **Development**: TypeScript ^5.1.6, ESLint, @types/vscode
- **Testing**: @vscode/test-electron, Mocha
- **Build**: Node.js 16.x or higher

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [i18next Documentation](https://www.i18next.com/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
