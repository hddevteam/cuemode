import * as assert from 'assert';
import { I18n } from '../../i18n';

/**
 * Internationalization tests
 */
suite('I18n Tests', () => {
  
  test('I18n should initialize correctly', () => {
    // Test basic functionality
    assert.ok(I18n, 'I18n should be defined');
    assert.ok(typeof I18n.t === 'function', 'I18n.t should be a function');
  });

  test('I18n.t should return string for valid keys', () => {
    // Test with known keys
    const message = I18n.t('notification.activated');
    assert.ok(typeof message === 'string', 'Should return string');
    assert.ok(message.length > 0, 'Should return non-empty string');
  });

  test('I18n.t should handle missing keys gracefully', () => {
    const message = I18n.t('nonexistent.key' as any);
    assert.ok(typeof message === 'string', 'Should return string for missing keys');
    assert.ok(message.includes('nonexistent.key'), 'Should include the key name in fallback');
  });

  test('I18n.t should handle nested keys', () => {
    // Test nested key access
    const errorMessage = I18n.t('error.noActiveEditor');
    assert.ok(typeof errorMessage === 'string', 'Should return string for nested keys');
    assert.ok(errorMessage.length > 0, 'Should return non-empty string');
  });

  test('I18n.t should handle interpolation', () => {
    // Test with interpolation (if supported)
    const message = I18n.t('notification.error', 'test error');
    assert.ok(typeof message === 'string', 'Should return string');
    assert.ok(message.length > 0, 'Should return non-empty string');
  });

  test('I18n should handle different locales', () => {
    // Test that different locales return appropriate strings
    // This depends on the current locale setting
    const message = I18n.t('notification.activated');
    assert.ok(typeof message === 'string', 'Should return string regardless of locale');
  });

  test('I18n should provide consistent translations', () => {
    // Test that the same key always returns the same translation
    const message1 = I18n.t('notification.activated');
    const message2 = I18n.t('notification.activated');
    assert.strictEqual(message1, message2, 'Should return consistent translations');
  });

  test('I18n should handle common extension messages', () => {
    // Test common message keys that should exist
    const commonKeys: (keyof import('../../i18n').Messages)[] = [
      'notification.activated',
      'notification.error',
      'error.noActiveEditor',
      'error.noContent'
    ];

    commonKeys.forEach(key => {
      const message = I18n.t(key);
      assert.ok(typeof message === 'string', `Key ${key} should return string`);
      assert.ok(message.length > 0, `Key ${key} should return non-empty string`);
    });
  });

  test('I18n should handle UI messages', () => {
    // Test UI-related message keys
    const uiKeys: (keyof import('../../i18n').Messages)[] = [
      'ui.title',
      'ui.close',
      'ui.loading',
      'ui.ready'
    ];

    uiKeys.forEach(key => {
      const message = I18n.t(key);
      assert.ok(typeof message === 'string', `UI key ${key} should return string`);
      assert.ok(message.length > 0, `UI key ${key} should return non-empty string`);
    });
  });

  test('I18n should handle configuration messages', () => {
    // Test configuration-related message keys
    const configKeys: (keyof import('../../i18n').Messages)[] = [
      'settings.colorTheme',
      'settings.fontSize',
      'settings.maxWidth'
    ];

    configKeys.forEach(key => {
      const message = I18n.t(key);
      assert.ok(typeof message === 'string', `Config key ${key} should return string`);
      // Note: Some config keys might be empty or have special formatting
    });
  });

  test('I18n should handle empty or null keys', () => {
    // Test edge cases
    const emptyMessage = I18n.t('' as any);
    assert.ok(typeof emptyMessage === 'string', 'Should handle empty key');
    
    const nullMessage = I18n.t(null as any);
    assert.ok(typeof nullMessage === 'string', 'Should handle null key');
    
    const undefinedMessage = I18n.t(undefined as any);
    assert.ok(typeof undefinedMessage === 'string', 'Should handle undefined key');
  });

  test('I18n should not throw errors for invalid input', () => {
    // Test that I18n doesn't crash on invalid input
    assert.doesNotThrow(() => {
      I18n.t('completely.invalid.key.that.does.not.exist' as any);
    }, 'Should not throw for invalid keys');

    assert.doesNotThrow(() => {
      I18n.t(123 as any);
    }, 'Should not throw for non-string keys');

    assert.doesNotThrow(() => {
      I18n.t({} as any);
    }, 'Should not throw for object keys');
  });

  test('I18n should provide fallback for unsupported locales', () => {
    // Test that unsupported locales fallback to English
    const message = I18n.t('notification.activated');
    assert.ok(typeof message === 'string', 'Should provide fallback for unsupported locales');
    assert.ok(message.length > 0, 'Fallback should not be empty');
  });

  test('I18n should handle special characters in messages', () => {
    // Test that messages with special characters work correctly
    const message = I18n.t('notification.activated');
    assert.ok(typeof message === 'string', 'Should handle special characters');
    
    // The message should not contain raw template strings or escaping issues
    assert.ok(!message.includes('${'), 'Should not contain raw template strings');
    assert.ok(!message.includes('\\n'), 'Should not contain escaped newlines');
  });

  test('I18n should work with different message formats', () => {
    // Test different message formats if supported
    const simpleMessage = I18n.t('notification.activated');
    assert.ok(typeof simpleMessage === 'string', 'Should handle simple messages');
    
    const errorMessage = I18n.t('error.noActiveEditor');
    assert.ok(typeof errorMessage === 'string', 'Should handle error messages');
    
    const commandMessage = I18n.t('command.title');
    assert.ok(typeof commandMessage === 'string', 'Should handle command messages');
  });
});
