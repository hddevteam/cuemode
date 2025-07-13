# CueMode Extension Tests

This document describes the testing setup for the CueMode VS Code extension.

## Test Structure

The test suite is organized into several categories:

### 1. Extension Integration Tests (`extension.test.ts`)

- Tests the main extension activation and deactivation
- Verifies extension presence and command registration
- Tests the `cuemode.cueMode` command availability
- Validates configuration accessibility
- Tests the CueModeExtension class functionality

### 2. Configuration Manager Tests (`config.test.ts`)

- Tests the ConfigManager class methods
- Validates `getSafeConfig()` returns correct configuration structure
- Tests configuration property types (string, number, boolean)
- Validates color theme values against supported themes
- Tests configuration validation logic for:
  - fontSize, maxWidth, lineHeight, padding ranges
  - scrollSpeed, startingPosition, focusOpacity values
  - focusLineCount and focusMode settings
  - New focus mode properties (opacity, line count, toggle functionality)

### 3. Theme Manager Tests (`theme.test.ts`)

- Tests the ThemeManager class functionality
- Validates all 7 supported themes: `classic`, `inverted`, `midnightBlue`, `sunset`, `forest`, `ocean`, `rose`
- Tests theme color validation (backgroundColor, textColor)
- Validates CSS color format compliance
- Tests fallback behavior for invalid theme names (returns classic theme)
- Verifies theme structure and property existence

### 4. Internationalization Tests (`i18n.test.ts`)

- Tests the i18next-based I18n system
- Validates `initializeI18n()` initialization
- Tests message key resolution with `t()` function
- Tests interpolation functionality with variables
- Verifies fallback behavior for missing keys
- Tests language switching across all 6 supported languages:
  - English (`en`)
  - Chinese (`zh-CN`)
  - German (`de`)
  - French (`fr`)
  - Japanese (`ja`)
  - Korean (`ko`)
- Validates `changeLanguage()` and `getCurrentLanguage()` functions
- Tests professional teleprompter terminology translations

### 5. WebView Manager Tests (`webview.test.ts`)

- Tests the WebViewManager class
- Validates webview creation and lifecycle management
- Tests `isActive()`, `create()`, `close()`, and `updateConfig()` methods
- Verifies webview content generation and HTML structure
- Tests configuration updates and theme changes
- Validates CSS generation and style injection
- Tests scroll functionality and content handling

## Running Tests

### Prerequisites

Make sure you have installed all dependencies:

```bash
npm install
```

### Compile TypeScript

Before running tests, compile the TypeScript code:

```bash
npm run compile
```

### Run All Tests

```bash
npm test
```

### Run Integration Tests

```bash
npm run test:integration
```

### Run Unit Tests

```bash
npm run test:unit
```

### Run Specific Test Files

You can run specific test suites by using Mocha directly:

```bash
# Run only configuration tests
npx mocha out/test/suite/config.test.js

# Run only theme tests
npx mocha out/test/suite/theme.test.js

# Run only i18n tests
npx mocha out/test/suite/i18n.test.js

# Run only webview tests
npx mocha out/test/suite/webview.test.js

# Run only extension tests
npx mocha out/test/suite/extension.test.js
```

## Test Configuration

### Test Runner Setup

- **Framework**: Mocha with TDD interface
- **Timeout**: 10,000ms for each test
- **Reporter**: Spec reporter with colored output
- **File Pattern**: `**/**.test.js` in the test directory

### VS Code Test Environment

- Uses `@vscode/test-electron` for VS Code integration testing
- Runs with `--disable-extensions` to avoid conflicts
- Extension development path set to project root
- Tests run in isolated VS Code instance

## Test Coverage

The tests cover the following areas:

### Core Functionality

- Extension activation and deactivation
- Command registration (`cuemode.cueMode`)
- Configuration management and validation
- Error handling and fallback behavior

### User Interface

- WebView creation and management
- Theme application and CSS generation
- Content rendering and HTML structure
- Configuration updates and real-time changes

### Internationalization

- Message translation with i18next across 6 languages
- Locale switching (English/Chinese/German/French/Japanese/Korean)
- Interpolation with variables
- Fallback handling for missing keys
- Professional teleprompter terminology validation
- Language detection from VS Code environment

### Configuration Validation

- Type checking for all configuration properties
- Range validation for numeric values
- Enum validation for color themes
- Default value handling
- Focus mode configuration validation
- Real-time configuration update testing

### Theme System

- All 7 supported color themes
- CSS color format validation
- Theme structure validation
- Fallback theme handling

## Test Guidelines

When adding new tests:

1. **Follow the existing structure** - Place tests in the appropriate category file
2. **Use descriptive test names** - Test names should clearly describe what is being tested
3. **Test both positive and negative cases** - Include tests for valid and invalid inputs
4. **Mock external dependencies** - Use VS Code API mocks when necessary
5. **Clean up after tests** - Use `suiteTeardown()` for proper cleanup
6. **Initialize properly** - Use `suiteSetup()` for test initialization

## Common Test Patterns

### Testing VS Code Extensions

```typescript
suite('Extension Integration Tests', () => {
  test('Extension should activate', async () => {
    const ext = vscode.extensions.getExtension('luckyXmobile.cuemode');
    assert.ok(ext);
    await ext.activate();
    assert.strictEqual(ext.isActive, true);
  });
});
```

### Testing Configuration

```typescript
suite('ConfigManager Tests', () => {
  test('getSafeConfig should return valid configuration', () => {
    const config = ConfigManager.getSafeConfig();
    assert.ok(config);
    assert.strictEqual(typeof config.fontSize, 'number');
  });
});
```

### Testing Themes

```typescript
suite('ThemeManager Tests', () => {
  test('getTheme should return valid theme', () => {
    const theme = ThemeManager.getTheme('classic');
    assert.ok(theme.backgroundColor);
    assert.ok(theme.textColor);
  });
});
```

### Testing I18n

```typescript
suite('I18n Tests', () => {
  test('t should handle interpolation', () => {
    const message = t('notifications.themeChanged', { theme: 'Dark' });
    assert.ok(message.includes('Dark'));
  });
});
```

## Debugging Tests

To debug tests in VS Code:

1. Set breakpoints in your test files
2. Use the Debug Console to inspect variables
3. Run tests with VS Code's integrated test runner
4. Use `console.log()` for additional debugging output

## Continuous Integration

The tests are designed to run in CI environments:

- No user interaction required
- Proper cleanup after each test
- 10-second timeout for each test
- Graceful handling of missing dependencies

## Adding New Tests

When adding new functionality:

1. **Write tests first** (TDD approach)
2. **Ensure comprehensive coverage** of all code paths
3. **Test error conditions** and edge cases
4. **Verify proper cleanup** and resource disposal
5. **Update this documentation** if needed

## Troubleshooting

### Common Issues

1. **Tests fail with "Extension not found"**
   - Ensure the extension is compiled: `npm run compile`
   - Check extension ID matches: `luckyXmobile.cuemode`

2. **WebView tests fail**
   - Verify mock context is properly set up
   - Check VS Code test environment initialization

3. **Configuration tests fail**
   - Ensure default configuration values are valid
   - Check validation logic consistency

4. **Theme tests fail**
   - Verify all theme names are correct
   - Check CSS color format validation

5. **I18n tests fail**
   - Ensure locale files are copied: `npm run copy-resources`
   - Check i18next initialization
   - Verify all 6 language files are present in `src/locales/`
   - Test language switching functionality

### Getting Help

If you encounter test issues:

1. Check the VS Code extension development documentation
2. Review similar extensions' test setups
3. Create an issue with detailed error information
4. Verify TypeScript compilation is successful
