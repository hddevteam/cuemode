# CueMode Extension Tests

This document describes the testing setup for the CueMode VS Code extension.

## Test Structure

The test suite is organized into several categories:

### 1. Integration Tests (`extension.test.ts`)
- Tests the main extension functionality
- Verifies command registration and execution
- Tests configuration management
- Validates extension activation/deactivation

### 2. Configuration Tests (`config.test.ts`)
- Tests the ConfigManager class
- Validates configuration validation logic
- Tests safe configuration retrieval
- Verifies default configuration handling

### 3. Theme Tests (`theme.test.ts`)
- Tests the ThemeManager class
- Validates all available themes
- Tests theme color validation
- Verifies CSS generation
- Tests accessibility features

### 4. Internationalization Tests (`i18n.test.ts`)
- Tests the I18n system
- Validates message key resolution
- Tests interpolation functionality
- Verifies fallback behavior

### 5. WebView Tests (`webview.test.ts`)
- Tests the WebViewManager class
- Validates webview creation and management
- Tests content handling
- Verifies configuration updates

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

### Run Unit Tests (individual test files)
```bash
npm run test:unit
```

### Run Specific Test Categories
You can run specific test suites by using VS Code's test runner or by using Mocha directly:

```bash
# Run only configuration tests
npx mocha out/test/suite/config.test.js

# Run only theme tests
npx mocha out/test/suite/theme.test.js

# Run only i18n tests
npx mocha out/test/suite/i18n.test.js

# Run only webview tests
npx mocha out/test/suite/webview.test.js
```

## Test Coverage

The tests cover the following areas:

### Core Functionality
- Extension activation and deactivation
- Command registration and execution
- Configuration management
- Error handling

### User Interface
- WebView creation and management
- Theme application
- Content rendering
- Configuration updates

### Internationalization
- Message translation
- Locale detection
- Fallback handling
- Special character support

### Configuration
- Validation logic
- Default values
- Range checking
- Type safety

### Themes
- Color theme definitions
- CSS generation
- Accessibility validation
- Contrast ratio checking

## Test Guidelines

When adding new tests:

1. **Follow the existing structure** - Place tests in the appropriate category file
2. **Use descriptive test names** - Test names should clearly describe what is being tested
3. **Test both positive and negative cases** - Include tests for both valid and invalid inputs
4. **Mock external dependencies** - Use mocks for VS Code APIs when necessary
5. **Clean up after tests** - Ensure tests don't leave behind state that affects other tests

## Common Test Patterns

### Testing VS Code Extensions
```typescript
test('Extension should activate correctly', async () => {
  const ext = vscode.extensions.getExtension('publisher.extension-name');
  assert.ok(ext);
  await ext.activate();
  assert.strictEqual(ext.isActive, true);
});
```

### Testing Configuration
```typescript
test('Configuration should validate correctly', () => {
  const config = ConfigManager.getSafeConfig();
  assert.ok(config);
  assert.ok(typeof config.fontSize === 'number');
});
```

### Testing Themes
```typescript
test('Theme should have valid colors', () => {
  const theme = ThemeManager.getTheme('classic');
  assert.ok(theme.backgroundColor);
  assert.ok(theme.textColor);
});
```

## Debugging Tests

To debug tests in VS Code:

1. Set breakpoints in your test files
2. Run the "Launch Tests" configuration from the debug panel
3. The debugger will stop at your breakpoints

## Continuous Integration

The tests are designed to run in CI environments. They:
- Don't require user interaction
- Clean up after themselves
- Have reasonable timeouts
- Handle missing dependencies gracefully

## Adding New Tests

When adding new functionality to the extension:

1. Write tests first (TDD approach)
2. Ensure all edge cases are covered
3. Test error conditions
4. Verify cleanup and disposal
5. Update this documentation if needed

## Troubleshooting

### Common Issues

1. **Tests fail with "Extension not found"**
   - Make sure the extension is properly compiled
   - Check that the extension ID matches in tests

2. **WebView tests fail**
   - Ensure VS Code test environment is properly set up
   - Check that mock context is complete

3. **Configuration tests fail**
   - Verify that default configuration is valid
   - Check that validation logic is consistent

4. **Theme tests fail**
   - Ensure all theme names are correct
   - Verify color format validation

### Getting Help

If you encounter issues with tests:
1. Check the VS Code extension development documentation
2. Look at similar extensions' test setups
3. Create an issue in the repository with detailed error information
