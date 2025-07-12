# CueMode Development Guide

## 🏗️ Architecture Overview

CueMode 2.0 is built as a modern TypeScript VS Code extension with a focus on performance, internationalization, and maintainability.

### Core Components

```
src/
├── extension.ts           # Main extension entry point
├── types/                 # TypeScript type definitions
│   └── index.ts          # Core types and interfaces
├── ui/                   # User interface components
│   └── webview.ts        # Webview management and HTML generation
├── utils/                # Utility modules
│   ├── config.ts         # Configuration management
│   └── theme.ts          # Theme system and color schemes
└── i18n/                 # Internationalization
    ├── index.ts          # I18n manager and type definitions
    ├── en.ts             # English language pack
    └── zh-cn.ts          # Chinese language pack
```

### Key Features

#### 🎨 Theme System
- 7 professional color themes
- WCAG AA compliant color contrast
- Live theme switching with `T` key
- Persistent theme preferences

#### ⌨️ Keyboard Shortcuts
- `Ctrl+Shift+P` (Cmd+Shift+P): Toggle prompter mode
- `T`: Cycle through themes
- `R`: Remove leading spaces/indentation
- `Escape`: Exit prompter mode

#### 🌐 Internationalization
- Dynamic language detection based on VS Code settings
- Support for English and Chinese (zh-cn)
- Extensible architecture for additional languages
- Cultural adaptation for UI elements

#### 🎭 Webview Architecture
- Content Security Policy compliant
- Responsive design for all screen sizes
- Real-time content synchronization
- Memory-efficient DOM updates

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
- 71 comprehensive test cases
- Unit tests for all core functions
- Integration tests for command workflows
- Theme switching validation
- I18n functionality testing

### Running Tests
```bash
npm test                    # Full test suite
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:coverage      # Coverage report
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
  "cuemode.theme": {
    "type": "string",
    "enum": ["classic", "inverted", "midnightBlue", "warmGray", "softYellow", "highContrast", "customizable"],
    "default": "classic"
  },
  "cuemode.fontSize": {
    "type": "number",
    "default": 24,
    "minimum": 12,
    "maximum": 72
  }
}
```

### Command Definitions
```json
{
  "commands": [
    {
      "command": "cuemode.togglePrompterMode",
      "title": "Toggle Prompter Mode"
    },
    {
      "command": "cuemode.changeTheme",
      "title": "Change Theme"
    },
    {
      "command": "cuemode.removeLeadingSpaces",
      "title": "Remove Leading Spaces"
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

### Language Detection
```typescript
// Automatic language detection
const language = vscode.env.language;
const isChineseVariant = /^zh(-cn|-tw|-hk)?$/i.test(language);
const currentLocale = isChineseVariant ? 'zh-cn' : 'en';
```

### Message Structure
```typescript
interface Messages {
  commands: {
    prompterModeActivated: string;
    prompterModeDeactivated: string;
    themeChanged: string;
    leadingSpacesRemoved: string;
  };
  themes: {
    classic: string;
    inverted: string;
    // ... other themes
  };
  // ... other categories
}
```

## 🚀 Future Enhancements

### Planned Features
- Additional theme customization options
- More keyboard shortcuts
- Enhanced accessibility features
- Support for additional languages
- Integration with presentation tools

### Technical Improvements
- WebView optimization
- Enhanced test coverage
- Performance monitoring
- Error reporting system

## 📊 Performance Metrics

### Current Benchmarks
- Extension activation: < 100ms
- Theme switching: < 50ms
- Text updates: < 10ms latency
- Memory usage: < 10MB active

### Optimization Goals
- Maintain < 100ms activation time
- Zero memory leaks
- Smooth 60fps animations
- Support for 10,000+ character documents

## 🐛 Debugging Guide

### Common Issues
1. **Extension not activating**: Check VS Code version compatibility
2. **Theme not switching**: Verify webview communication
3. **I18n not working**: Check language detection logic
4. **Performance issues**: Profile memory usage and event handlers

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
