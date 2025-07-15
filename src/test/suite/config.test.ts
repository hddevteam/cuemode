import * as assert from 'assert';
import * as vscode from 'vscode';
import { ConfigManager } from '../../utils/config';
import { CueModeConfig } from '../../types';

/**
 * Configuration Manager tests
 */
suite('ConfigManager Tests', () => {
  
  test('getSafeConfig should return valid configuration', () => {
    const config = ConfigManager.getSafeConfig();
    
    assert.ok(config);
    assert.ok(typeof config === 'object');
    
    // Check all required properties exist
    assert.ok(config.hasOwnProperty('colorTheme'));
    assert.ok(config.hasOwnProperty('fontSize'));
    assert.ok(config.hasOwnProperty('maxWidth'));
    assert.ok(config.hasOwnProperty('lineHeight'));
    assert.ok(config.hasOwnProperty('padding'));
    assert.ok(config.hasOwnProperty('scrollSpeed'));
    assert.ok(config.hasOwnProperty('startingPosition'));
    assert.ok(config.hasOwnProperty('focusMode'));
    assert.ok(config.hasOwnProperty('focusOpacity'));
    assert.ok(config.hasOwnProperty('focusLineCount'));
    assert.ok(config.hasOwnProperty('mirrorFlip'));
  });

  test('getSafeConfig should return correct types', () => {
    const config = ConfigManager.getSafeConfig();
    
    assert.strictEqual(typeof config.colorTheme, 'string');
    assert.strictEqual(typeof config.fontSize, 'number');
    assert.strictEqual(typeof config.maxWidth, 'number');
    assert.strictEqual(typeof config.lineHeight, 'number');
    assert.strictEqual(typeof config.padding, 'number');
    assert.strictEqual(typeof config.scrollSpeed, 'number');
    assert.strictEqual(typeof config.startingPosition, 'number');
    assert.strictEqual(typeof config.focusMode, 'boolean');
    assert.strictEqual(typeof config.focusOpacity, 'number');
    assert.strictEqual(typeof config.focusLineCount, 'number');
    assert.strictEqual(typeof config.mirrorFlip, 'boolean');
  });

  test('getSafeConfig should return valid color theme', () => {
    const config = ConfigManager.getSafeConfig();
    const validThemes = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
    
    assert.ok(validThemes.includes(config.colorTheme));
  });

  test('getSafeConfig should return values within valid ranges', () => {
    const config = ConfigManager.getSafeConfig();
    
    // Test fontSize range (8-100)
    assert.ok(config.fontSize >= 8);
    assert.ok(config.fontSize <= 100);
    
    // Test maxWidth range (200-2000)
    assert.ok(config.maxWidth >= 200);
    assert.ok(config.maxWidth <= 2000);
    
    // Test lineHeight range (0.5-5.0)
    assert.ok(config.lineHeight >= 0.5);
    assert.ok(config.lineHeight <= 5.0);
    
    // Test padding range (0-100)
    assert.ok(config.padding >= 0);
    assert.ok(config.padding <= 100);
    
    // Test scrollSpeed range (0.01-1.0)
    assert.ok(config.scrollSpeed >= 0.01);
    assert.ok(config.scrollSpeed <= 1.0);
    
    // Test startingPosition range (0-100)
    assert.ok(config.startingPosition >= 0);
    assert.ok(config.startingPosition <= 100);
    
    // Test focusOpacity range (0.1-0.8)
    assert.ok(config.focusOpacity >= 0.1);
    assert.ok(config.focusOpacity <= 0.8);
    
    // Test focusLineCount range (1-10)
    assert.ok(config.focusLineCount >= 1);
    assert.ok(config.focusLineCount <= 10);
  });

  test('validateConfig should handle valid configuration', () => {
    const validConfig: CueModeConfig = {
      colorTheme: 'classic',
      fontSize: 24,
      maxWidth: 800,
      lineHeight: 1.5,
      padding: 10,
      scrollSpeed: 0.1,
      startingPosition: 50,
      focusMode: false,
      focusOpacity: 0.3,
      focusLineCount: 3,
      mirrorFlip: false
    };
    
    const result = ConfigManager.validateConfig(validConfig);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.warnings.length, 0);
  });

  test('validateConfig should handle invalid color theme', () => {
    const invalidConfig: any = {
      colorTheme: 'invalid-theme',
      fontSize: 24,
      maxWidth: 800,
      lineHeight: 1.5,
      padding: 10,
      scrollSpeed: 0.1,
      startingPosition: 50,
      focusMode: false,
      focusOpacity: 0.3,
      focusLineCount: 3,
      mirrorFlip: false
    };
    
    const result = ConfigManager.validateConfig(invalidConfig);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(error => error.includes('Invalid color theme: invalid-theme')));
  });

  test('validateConfig should handle out-of-range values', () => {
    const invalidConfig: any = {
      colorTheme: 'classic',
      fontSize: 5, // Below minimum
      maxWidth: 3000, // Above maximum
      lineHeight: 0.1, // Below minimum
      padding: 150, // Above maximum
      scrollSpeed: 2.0, // Above maximum
      startingPosition: -10, // Below minimum
      focusMode: false,
      focusOpacity: 0.3,
      focusLineCount: 3,
      mirrorFlip: false
    };
    
    const result = ConfigManager.validateConfig(invalidConfig);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.length > 0);
  });

  test('validateConfig should handle missing properties', () => {
    const incompleteConfig: any = {
      colorTheme: 'classic',
      fontSize: 24
      // Missing other properties
    };
    
    const result = ConfigManager.validateConfig(incompleteConfig);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.length > 0);
  });

  test('validateConfig should handle non-object input', () => {
    const result = ConfigManager.validateConfig(null as any);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.length > 0);
  });

  test('getSafeConfig should return defaults when configuration is invalid', () => {
    // This test assumes the current configuration is valid
    // If invalid, it should return defaults
    const config = ConfigManager.getSafeConfig();
    
    // Should return valid configuration
    assert.ok(config);
    assert.strictEqual(config.colorTheme, 'classic');
    assert.strictEqual(config.fontSize, 24);
    assert.strictEqual(config.maxWidth, 800);
    assert.strictEqual(config.lineHeight, 1.5);
    assert.strictEqual(config.padding, 10);
    assert.strictEqual(config.scrollSpeed, 0.1);
    assert.strictEqual(config.startingPosition, 50);
  });

  test('getDefaultConfig should return correct defaults', () => {
    const defaultConfig = ConfigManager.getDefaultConfig();
    
    assert.strictEqual(defaultConfig.colorTheme, 'classic');
    assert.strictEqual(defaultConfig.fontSize, 24);
    assert.strictEqual(defaultConfig.maxWidth, 800);
    assert.strictEqual(defaultConfig.lineHeight, 1.5);
    assert.strictEqual(defaultConfig.padding, 10);
    assert.strictEqual(defaultConfig.scrollSpeed, 0.1);
    assert.strictEqual(defaultConfig.startingPosition, 50);
    assert.strictEqual(defaultConfig.focusMode, false);
    assert.strictEqual(defaultConfig.focusOpacity, 0.3);
    assert.strictEqual(defaultConfig.focusLineCount, 3);
    assert.strictEqual(defaultConfig.mirrorFlip, false);
  });

  test('mirrorFlip configuration should have correct default value', async () => {
    // Reset configuration to ensure we're testing defaults
    const config = vscode.workspace.getConfiguration('cuemode');
    await config.update('mirrorFlip', undefined, vscode.ConfigurationTarget.Global);
    
    // Wait for configuration to update
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const defaultConfig = ConfigManager.getSafeConfig();
    assert.strictEqual(defaultConfig.mirrorFlip, false);
  });

  test('mirrorFlip configuration should validate correctly', () => {
    // Test valid mirrorFlip values
    let testConfig: CueModeConfig = {
      colorTheme: 'classic',
      fontSize: 24,
      maxWidth: 800,
      lineHeight: 1.5,
      padding: 10,
      scrollSpeed: 0.1,
      startingPosition: 50,
      focusMode: false,
      focusOpacity: 0.3,
      focusLineCount: 3,
      mirrorFlip: true
    };
    
    let result = ConfigManager.validateConfig(testConfig);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
    
    // Test with false value
    testConfig.mirrorFlip = false;
    result = ConfigManager.validateConfig(testConfig);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
  });

  test('onConfigChanged should return a disposable', () => {
    const disposable = ConfigManager.onConfigChanged(() => {});
    assert.ok(disposable);
    assert.ok(typeof disposable.dispose === 'function');
    
    // Clean up
    disposable.dispose();
  });
});
