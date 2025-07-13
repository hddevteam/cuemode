import * as assert from 'assert';
import { t, initializeI18n, changeLanguage, getCurrentLanguage } from '../../i18n';

/**
 * Internationalization tests for i18next-based system
 */
suite('I18n Tests', () => {
  
  suiteSetup(async () => {
    // Initialize i18n system before running tests
    await initializeI18n();
  });
  
  test('I18n should initialize correctly', async () => {
    // Test basic functionality
    await initializeI18n();
    const message = t('notifications.activated');
    assert.ok(typeof message === 'string');
    assert.ok(message.length > 0);
    assert.strictEqual(message, 'Teleprompter mode activated');
  });

  test('I18n.t should handle missing keys gracefully', () => {
    const message = t('nonexistent.key');
    assert.ok(typeof message === 'string');
    assert.ok(message.includes('nonexistent.key'));
  });

  test('I18n.t should handle interpolation', () => {
    const message = t('notifications.themeChanged', { theme: 'Dark' });
    assert.ok(typeof message === 'string');
    assert.ok(message.includes('Dark'));
    assert.strictEqual(message, 'Theme changed to Dark');
  });

  test('I18n should handle different locales', async () => {
    // Test English (default)
    const englishMessage = t('notifications.activated');
    assert.strictEqual(englishMessage, 'Teleprompter mode activated');
    
    // Switch to Chinese
    await changeLanguage('zh-CN');
    const chineseMessage = t('notifications.activated');
    assert.strictEqual(chineseMessage, '提词器模式已激活');
    
    // Switch back to English
    await changeLanguage('en');
    const backToEnglish = t('notifications.activated');
    assert.strictEqual(backToEnglish, 'Teleprompter mode activated');
  });

  test('All critical translation keys should work correctly', () => {
    const criticalKeys = [
      'commands.title',
      'notifications.activated',
      'errors.noActiveEditor',
      'ui.title',
      'themes.classic',
      'help.shortcuts.space'
    ];
    
    criticalKeys.forEach(key => {
      const message = t(key);
      assert.ok(typeof message === 'string');
      assert.ok(message.length > 0);
    });
  });

  test('I18n should handle empty or null keys', () => {
    const emptyMessage = t('');
    assert.ok(typeof emptyMessage === 'string');
    
    // Test null and undefined by casting
    const nullMessage = t(null as any);
    assert.ok(typeof nullMessage === 'string');
    
    const undefinedMessage = t(undefined as any);
    assert.ok(typeof undefinedMessage === 'string');
  });

  test('I18n should not throw errors for invalid input', () => {
    assert.doesNotThrow(() => {
      t('completely.invalid.key.that.does.not.exist');
    });
    
    assert.doesNotThrow(() => {
      t(123 as any);
    });
    
    assert.doesNotThrow(() => {
      t({} as any);
    });
  });


  test('Language changes should persist and getCurrentLanguage works', async () => {
    // Test getCurrentLanguage function
    const initialLanguage = getCurrentLanguage();
    assert.ok(typeof initialLanguage === 'string');
    assert.ok(['en', 'zh-CN'].includes(initialLanguage));
    
    // Change to Chinese and verify
    await changeLanguage('zh-CN');
    assert.strictEqual(getCurrentLanguage(), 'zh-CN');
    const chineseMessage = t('notifications.activated');
    assert.ok(chineseMessage.includes('提词器'));
    
    // Change back to English and verify
    await changeLanguage('en');
    assert.strictEqual(getCurrentLanguage(), 'en');
  });

  test('Interpolation should handle multiple parameters', () => {
    const message = t('notifications.spacesRemoved', { count: 5 });
    assert.ok(typeof message === 'string');
    assert.ok(message.includes('5'));
  });

  test('Missing interpolation parameters should not break', () => {
    // Should not throw even if parameter is missing
    assert.doesNotThrow(() => {
      const message = t('notifications.themeChanged');
      assert.ok(typeof message === 'string');
    });
  });


  test('Specific message categories should work in both languages', async () => {
    // Test themes, help, focus mode, and errors in both languages
    const testKeys = {
      themes: ['themes.classic', 'themes.sunset'],
      help: ['help.title', 'help.shortcuts.space'],
      focus: ['notifications.focusModeEnabled', 'notifications.focusModeDisabled'],
      errors: ['errors.noActiveEditor', 'errors.noContent']
    };
    
    // Test in English
    await changeLanguage('en');
    Object.values(testKeys).flat().forEach(key => {
      const message = t(key);
      assert.ok(typeof message === 'string');
      assert.ok(message.length > 0);
    });
    
    // Test specific content in Chinese
    await changeLanguage('zh-CN');
    assert.ok(t('notifications.focusModeEnabled').includes('启用'));
    assert.ok(t('errors.noActiveEditor').includes('编辑器'));
    
    // Switch back to English
    await changeLanguage('en');
  });
});