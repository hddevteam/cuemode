# CueMode Development Guide

## 🏗️ Architecture Overview

CueMode is built as a modern TypeScript VS Code extension with a focus on performance, internationalization, focus mode, and maintainability.

### Core Components

```sh
src/
├── extension.ts           # Main extension entry point with CueModeExtension class
├── i18n.ts               # i18next-based internationalization system
├── types/                 # TypeScript type definitions
│   └── index.ts          # Core types and interfaces
├── ui/                   # User interface components
│   └── webview.ts        # Webview management and HTML generation
├── utils/                # Utility modules
│   ├── config.ts         # Configuration management with validation
│   └── theme.ts          # Theme system with 7 professional themes
├── locales/              # Language resource files
│   ├── en.json           # English translations
│   ├── zh-CN.json        # Chinese translations
│   ├── de.json           # German translations
│   ├── fr.json           # French translations
│   ├── ja.json           # Japanese translations
│   └── ko.json           # Korean translations
└── test/                 # Test suite
    ├── runTest.ts        # Test runner
    └── suite/            # Test cases
        ├── extension.test.ts
        ├── i18n.test.ts
        ├── theme.test.ts
        ├── config.test.ts
        └── webview.test.ts
```

### Key Features

#### 🎨 Theme System

- 7 professional color themes: Classic, Inverted, Midnight Blue, Sunset, Forest, Ocean, Rose
- WCAG AA compliant color contrast (4.5:1 ratio minimum)
- Live theme switching with `T` key in webview and `Ctrl+Shift+T` in VS Code
- Persistent theme preferences with automatic validation
- Accessibility validation and contrast ratio calculation

#### ⌨️ Keyboard Shortcuts

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

#### 🌐 Internationalization

- i18next-based translation system with type safety
- Dynamic language detection from VS Code environment
- Support for 6 languages: English (en), Chinese (zh-CN), German (de), French (fr), Japanese (ja), Korean (ko)
- Professional teleprompter terminology localization
- Extensible architecture for additional languages
- Context-aware translations with pluralization support
- Missing key detection and fallback handling
- Cultural adaptation for UI elements and error messages

#### 🎭 Webview Architecture

- Content Security Policy compliant with nonce-based script loading
- Responsive design for all screen sizes with mobile optimization
- Real-time content synchronization with message passing
- Memory-efficient DOM updates and lifecycle management
- Auto-scroll with configurable speed and direction
- Focus mode with customizable line highlighting and opacity
- Interactive help system with keyboard shortcut reference

### 🎯 Enhanced Focus Mode

- Improved focused reading mode with keyboard toggle functionality
- Smart gradient blur algorithm for smooth reading experience
- Configurable focus opacity (0.1-0.8, default 0.3)
- Adjustable focus lines (1-10 lines, default 3 lines)
- Toggle with `F` key in webview for instant on/off switching
- Visual focus indicator with beautiful styling design
- Real-time configuration updates without restart
- Persistent focus mode preferences

## 🛠️ Development Environment

### Prerequisites

- Node.js 16.x or higher
- VS Code 1.82.0 or higher
- TypeScript 5.1.6

### Setup

```bash
# Clone and install
git clone https://github.com/hddevteam/cuemode.git
cd cuemode
npm install

# Development commands
npm run watch          # Auto-compile TypeScript
npm run compile        # One-time compilation
npm test              # Run test suite
npm run lint          # ESLint validation
npm run package       # Create VSIX package
```

### VS Code Development

1. Open project in VS Code
2. Press `F5` to launch Extension Development Host
3. Test extension functionality in the new window
4. Use Debug Console for logging and diagnostics

## 🧪 Testing Strategy

### Test Coverage

- Comprehensive test suite covering all major components
- Unit tests for extension activation, configuration management, and theme system
- Integration tests for command workflows and webview functionality
- I18n system testing with mock VS Code environment
- Theme switching validation and accessibility compliance
- Configuration validation and error handling tests

### Running Tests

```bash
npm test                    # Full test suite
npm run test:unit          # Unit tests only (Mocha)
npm run test:integration   # Integration tests (VS Code Test Runner)
npm run pretest            # Compile and lint before testing
```

## 📦 Build and Deployment

### Package Creation

```bash
npm run package
```

This creates a `.vsix` file ready for VS Code Marketplace publishing.

### Publishing to Marketplace

```bash
vsce publish --pat YOUR_PERSONAL_ACCESS_TOKEN
```

### Version Management

We follow Semantic Versioning (semver):

- **Major** (x.0.0): Breaking changes
- **Minor** (x.y.0): New features, backward compatible
- **Patch** (x.y.z): Bug fixes, backward compatible

## 🔧 Configuration Schema

### Extension Settings

```json
{
  "cuemode.colorTheme": {
    "type": "string",
    "enum": ["classic", "inverted", "midnightBlue", "sunset", "forest", "ocean", "rose"],
    "default": "classic"
  },
  "cuemode.maxWidth": {
    "type": "number",
    "default": 800,
    "minimum": 200,
    "maximum": 2000
  },
  "cuemode.fontSize": {
    "type": "number",
    "default": 24,
    "minimum": 8,
    "maximum": 100
  },
  "cuemode.lineHeight": {
    "type": "number",
    "default": 1.5,
    "minimum": 0.5,
    "maximum": 5
  },
  "cuemode.padding": {
    "type": "number",
    "default": 10,
    "minimum": 0,
    "maximum": 100
  },
  "cuemode.scrollSpeed": {
    "type": "number",
    "default": 0.1,
    "minimum": 0.01,
    "maximum": 1
  },
  "cuemode.startingPosition": {
    "type": "number",
    "default": 50,
    "minimum": 0,
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
  }
}
```

### Command Definitions

```json
{
  "commands": [
    {
      "command": "cuemode.cueMode",
      "title": "%cuemode.cueMode%"
    },
    {
      "command": "cuemode.changeTheme",
      "title": "%cuemode.changeTheme%"
    },
    {
      "command": "cuemode.removeLeadingSpaces",
      "title": "%cuemode.removeLeadingSpaces%"
    },
    {
      "command": "cuemode.toggleFocusMode",
      "title": "%cuemode.toggleFocusMode%"
    }
  ]
}
```

## 🎯 Performance Optimization

### Memory Management

- Proper disposal of event listeners
- Efficient webview lifecycle management
- Minimal DOM manipulation
- Optimized theme switching

### Real-time Updates

- Debounced text change handlers
- Selective DOM updates
- CSS-based animations for smooth transitions
- Efficient string processing for leading space removal

## 🔒 Security Considerations

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'none'; 
               script-src 'nonce-{nonce}'; 
               style-src 'unsafe-inline';">
```

### Input Validation

- Sanitized user input in webview
- Validated configuration values
- Secure message passing between extension and webview

## 🌍 Internationalization Implementation

### I18next-based System

```typescript
// I18nManager class with singleton pattern
export class I18nManager {
  private i18n: typeof i18next;
  
  public async initialize(): Promise<void> {
    await this.i18n.init({
      lng: this.detectLanguage(),
      fallbackLng: 'en',
      resources: {
        en: { translation: await this.loadTranslationResource('en') },
        'zh-CN': { translation: await this.loadTranslationResource('zh-CN') },
        de: { translation: await this.loadTranslationResource('de') },
        fr: { translation: await this.loadTranslationResource('fr') },
        ja: { translation: await this.loadTranslationResource('ja') },
        ko: { translation: await this.loadTranslationResource('ko') }
      },
      interpolation: { escapeValue: false },
      pluralSeparator: '_',
      missingKeyHandler: (lng, ns, key, fallbackValue) => {
        console.warn(`Missing translation: ${key} in ${lng}`);
        return fallbackValue || key;
      }
    });
  }
}
```

### Language Detection

```typescript
private detectLanguage(): string {
  // VS Code environment detection
  if (vscode.env && vscode.env.language) {
    const lang = vscode.env.language;
    if (lang.startsWith('zh')) return 'zh-CN';
    if (lang.startsWith('de')) return 'de';
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('ko')) return 'ko';
    return 'en';
  }
  
  // Environment variable fallback
  if (process.env.VSCODE_NLS_CONFIG) {
    const nlsConfig = JSON.parse(process.env.VSCODE_NLS_CONFIG);
    const locale = nlsConfig.locale;
    if (locale?.startsWith('zh')) return 'zh-CN';
    if (locale?.startsWith('de')) return 'de';
    if (locale?.startsWith('fr')) return 'fr';
    if (locale?.startsWith('ja')) return 'ja';
    if (locale?.startsWith('ko')) return 'ko';
  }
  
  return 'en';
}
```

### Translation Structure

```json
{
  "commands": {
    "title": "Teleprompter Mode",
    "changeTheme": "Change Teleprompter Theme",
    "removeLeadingSpaces": "Remove Leading Spaces",
    "toggleFocusMode": "Toggle Focus Mode"
  },
  "notifications": {
    "activated": "Teleprompter mode activated",
    "themeChanged": "Theme changed to {{theme}}",
    "spacesRemoved": "Leading spaces removed from {{count}} line",
    "spacesRemoved_plural": "Leading spaces removed from {{count}} lines",
    "focusModeEnabled": "Focus mode enabled",
    "focusModeDisabled": "Focus mode disabled"
  },
  "themes": {
    "classic": "Classic",
    "inverted": "Inverted",
    "midnightBlue": "Midnight Blue",
    "sunset": "Sunset",
    "forest": "Forest",
    "ocean": "Ocean",
    "rose": "Rose"
  }
}
```

## 🚀 Future Enhancements

### Planned Features

- Additional theme customization options with user-defined colors
- Enhanced focus mode with paragraph-level highlighting
- Support for additional languages (Spanish, Italian, Portuguese)
- Integration with presentation tools and streaming software
- Auto-scroll with eye-tracking integration
- Voice control for hands-free operation
- Advanced focus algorithms with AI-powered text analysis

### Technical Improvements

- WebView optimization with focus mode performance enhancements
- Enhanced test coverage for all 6 languages
- Performance monitoring with focus mode metrics
- Error reporting system with i18n support
- Build system optimization for JSON translation files

## 📊 Performance Metrics

### Current Benchmarks

- Extension activation: < 100ms (including i18n initialization)
- Theme switching: < 50ms (with CSS variable updates)
- Configuration updates: < 10ms latency
- Memory usage: < 15MB active (including i18next resources)
- Webview rendering: < 200ms for 10,000+ character documents

### Optimization Goals

- Maintain < 100ms activation time
- Zero memory leaks
- Smooth 60fps animations
- Support for 10,000+ character documents

## 🐛 Debugging Guide

### Common Issues

1. **Extension not activating**: Check VS Code version compatibility (requires 1.82.0+)
2. **Theme not switching**: Verify webview communication and message passing
3. **I18n not working**: Check language detection logic and JSON resource loading for all 6 supported languages
4. **Focus mode not working**: Verify configuration validation, CSS application, and gradient blur algorithm
5. **Performance issues**: Profile memory usage, event handlers, and webview lifecycle
6. **Configuration errors**: Check settings validation and fallback handling

### Debug Tools

- VS Code Extension Development Host
- Browser Developer Tools for webview
- VS Code Output Panel for extension logs
- Node.js debugger for backend logic

## 📈 Analytics and Monitoring

### Usage Metrics

- Command invocation frequency
- Theme preference distribution
- User engagement patterns
- Error rate monitoring

### Performance Tracking

- Extension load time
- Memory consumption
- CPU usage patterns
- User satisfaction scores

---

For detailed API documentation, see the inline TypeScript documentation in the source files.

For contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).
