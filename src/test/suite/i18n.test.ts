import * as assert from 'assert';
import { t, initializeI18n, changeLanguage, getCurrentLanguage, getAvailableLanguages } from '../../i18n';

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
    assert.ok(['en', 'zh-CN', 'ja', 'ko', 'fr', 'de'].includes(initialLanguage));
    
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


  test('All available languages should be supported', async () => {
    const availableLanguages = getAvailableLanguages();
    assert.strictEqual(availableLanguages.length, 6);
    
    const expectedLanguages = ['en', 'zh-CN', 'ja', 'ko', 'fr', 'de'];
    expectedLanguages.forEach(langCode => {
      const lang = availableLanguages.find(l => l.code === langCode);
      assert.ok(lang, `Language ${langCode} should be available`);
      assert.ok(lang.name && lang.name.length > 0, `Language ${langCode} should have a name`);
      assert.ok(lang.nativeName && lang.nativeName.length > 0, `Language ${langCode} should have a native name`);
    });
  });

  test('All new languages should load and work correctly', async () => {
    const testKey = 'notifications.activated';
    const expectedTranslations = {
      'ja': 'テレプロンプターモードが有効になりました',
      'ko': '텔레프롬프터 모드가 활성화되었습니다',
      'fr': 'Mode télésouffleur activé',
      'de': 'Teleprompter-Modus aktiviert'
    };

    for (const [langCode, expectedText] of Object.entries(expectedTranslations)) {
      await changeLanguage(langCode);
      const message = t(testKey);
      assert.strictEqual(message, expectedText, `Translation for ${langCode} should match expected text`);
      assert.strictEqual(getCurrentLanguage(), langCode, `Current language should be ${langCode}`);
    }
    
    // Switch back to English
    await changeLanguage('en');
  });

  test('Theme translations should work in all languages', async () => {
    const themes = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
    const languages = ['en', 'zh-CN', 'ja', 'ko', 'fr', 'de'];

    for (const lang of languages) {
      await changeLanguage(lang);
      for (const theme of themes) {
        const translation = t(`themes.${theme}`);
        assert.ok(typeof translation === 'string', `Theme ${theme} should have string translation in ${lang}`);
        assert.ok(translation.length > 0, `Theme ${theme} should have non-empty translation in ${lang}`);
        assert.notStrictEqual(translation, `themes.${theme}`, `Theme ${theme} should be translated in ${lang}`);
      }
    }
    
    await changeLanguage('en');
  });

  test('Help shortcuts should be translated in all languages', async () => {
    const shortcuts = ['space', 'plus', 'minus', 'r', 'escape', 'arrows', 'pageUpDown', 'homeEnd', 't', 'f', 'h'];
    const languages = ['en', 'zh-CN', 'ja', 'ko', 'fr', 'de'];

    for (const lang of languages) {
      await changeLanguage(lang);
      
      // Test help title
      const helpTitle = t('help.title');
      assert.ok(typeof helpTitle === 'string', `Help title should be translated in ${lang}`);
      assert.ok(helpTitle.length > 0, `Help title should not be empty in ${lang}`);
      
      // Test all shortcuts
      for (const shortcut of shortcuts) {
        const translation = t(`help.shortcuts.${shortcut}`);
        assert.ok(typeof translation === 'string', `Shortcut ${shortcut} should have string translation in ${lang}`);
        assert.ok(translation.length > 0, `Shortcut ${shortcut} should have non-empty translation in ${lang}`);
      }
    }
    
    await changeLanguage('en');
  });

  test('Error messages should be translated in all languages', async () => {
    const errorKeys = ['noActiveEditor', 'noContent', 'webviewFailed', 'configInvalid', 'noSelection', 'initializationFailed'];
    const languages = ['en', 'zh-CN', 'ja', 'ko', 'fr', 'de'];

    for (const lang of languages) {
      await changeLanguage(lang);
      for (const errorKey of errorKeys) {
        const translation = t(`errors.${errorKey}`);
        assert.ok(typeof translation === 'string', `Error ${errorKey} should have string translation in ${lang}`);
        assert.ok(translation.length > 0, `Error ${errorKey} should have non-empty translation in ${lang}`);
        assert.notStrictEqual(translation, `errors.${errorKey}`, `Error ${errorKey} should be translated in ${lang}`);
      }
    }
    
    await changeLanguage('en');
  });

  test('Interpolation should work in all languages', async () => {
    const languages = ['en', 'zh-CN', 'ja', 'ko', 'fr', 'de'];
    
    for (const lang of languages) {
      await changeLanguage(lang);
      
      // Test theme interpolation
      const themeMessage = t('notifications.themeChanged', { theme: 'Dark' });
      assert.ok(typeof themeMessage === 'string', `Theme interpolation should work in ${lang}`);
      assert.ok(themeMessage.includes('Dark'), `Theme interpolation should include 'Dark' in ${lang}`);
      
      // Test count interpolation
      const countMessage = t('notifications.spacesRemoved', { count: 5 });
      assert.ok(typeof countMessage === 'string', `Count interpolation should work in ${lang}`);
      assert.ok(countMessage.includes('5'), `Count interpolation should include '5' in ${lang}`);
      
      // Test filename interpolation
      const titleMessage = t('ui.title', { filename: 'test.txt' });
      assert.ok(typeof titleMessage === 'string', `Filename interpolation should work in ${lang}`);
      assert.ok(titleMessage.includes('test.txt'), `Filename interpolation should include 'test.txt' in ${lang}`);
    }
    
    await changeLanguage('en');
  });

  test('Language switching should preserve state correctly', async () => {
    // Start with English
    await changeLanguage('en');
    const englishMessage = t('notifications.activated');
    
    // Switch through all languages and back
    const languages = ['zh-CN', 'ja', 'ko', 'fr', 'de'];
    for (const lang of languages) {
      await changeLanguage(lang);
      assert.strictEqual(getCurrentLanguage(), lang);
      const message = t('notifications.activated');
      assert.notStrictEqual(message, englishMessage, `Translation should be different in ${lang}`);
    }
    
    // Switch back to English and verify
    await changeLanguage('en');
    assert.strictEqual(getCurrentLanguage(), 'en');
    const backToEnglish = t('notifications.activated');
    assert.strictEqual(backToEnglish, englishMessage, 'Should return to original English translation');
  });

  test('Specific message categories should work in all languages', async () => {
    // Test themes, help, focus mode, and errors in all languages
    const testKeys = {
      themes: ['themes.classic', 'themes.sunset'],
      help: ['help.title', 'help.shortcuts.space'],
      focus: ['notifications.focusModeEnabled', 'notifications.focusModeDisabled'],
      errors: ['errors.noActiveEditor', 'errors.noContent']
    };
    
    const languages = ['en', 'zh-CN', 'ja', 'ko', 'fr', 'de'];
    
    for (const lang of languages) {
      await changeLanguage(lang);
      Object.values(testKeys).flat().forEach(key => {
        const message = t(key);
        assert.ok(typeof message === 'string', `Key ${key} should return string in ${lang}`);
        assert.ok(message.length > 0, `Key ${key} should not be empty in ${lang}`);
        assert.notStrictEqual(message, key, `Key ${key} should be translated in ${lang}`);
      });
    }
    
    // Test specific content checks for some languages
    await changeLanguage('zh-CN');
    assert.ok(t('notifications.focusModeEnabled').includes('启用'));
    assert.ok(t('errors.noActiveEditor').includes('编辑器'));
    
    await changeLanguage('ja');
    assert.ok(t('notifications.focusModeEnabled').includes('有効'));
    assert.ok(t('errors.noActiveEditor').includes('エディター'));
    
    await changeLanguage('ko');
    assert.ok(t('notifications.focusModeEnabled').includes('활성화'));
    assert.ok(t('errors.noActiveEditor').includes('편집기'));
    
    await changeLanguage('fr');
    assert.ok(t('notifications.focusModeEnabled').includes('activé'));
    assert.ok(t('errors.noActiveEditor').includes('éditeur'));
    
    await changeLanguage('de');
    assert.ok(t('notifications.focusModeEnabled').includes('aktiviert'));
    assert.ok(t('errors.noActiveEditor').includes('Editor'));
    
    // Switch back to English
    await changeLanguage('en');
  });

  test('All translation files should have consistent key structure', async () => {
    const languages = ['en', 'zh-CN', 'ja', 'ko', 'fr', 'de'];
    
    // Get all keys from English (reference)
    await changeLanguage('en');
    const criticalKeys = [
      'commands.title',
      'commands.description', 
      'commands.changeTheme',
      'commands.removeLeadingSpaces',
      'commands.toggleFocusMode',
      'notifications.activated',
      'notifications.deactivated',
      'notifications.themeChanged',
      'notifications.focusModeEnabled',
      'notifications.focusModeDisabled',
      'errors.noActiveEditor',
      'errors.noContent',
      'errors.webviewFailed',
      'ui.title',
      'ui.close',
      'ui.help',
      'help.title',
      'help.shortcuts.space',
      'help.shortcuts.escape',
      'themes.classic',
      'themes.inverted',
      'accessibility.scrollIndicator'
    ];
    
    // Test that all keys exist in all languages
    for (const lang of languages) {
      await changeLanguage(lang);
      for (const key of criticalKeys) {
        const translation = t(key);
        assert.ok(typeof translation === 'string', `Key ${key} should exist in ${lang}`);
        assert.ok(translation.length > 0, `Key ${key} should not be empty in ${lang}`);
        assert.notStrictEqual(translation, key, `Key ${key} should be translated in ${lang}`);
      }
    }
    
    await changeLanguage('en');
  });

  test('Language fallback should work correctly', async () => {
    // Test that changing to an unsupported language falls back gracefully
    await changeLanguage('en');
    const originalMessage = t('notifications.activated');
    
    // Try to change to unsupported language
    try {
      await changeLanguage('unsupported-lang');
      // Should still work, might fallback to English or stay on current
      const fallbackMessage = t('notifications.activated');
      assert.ok(typeof fallbackMessage === 'string');
      assert.ok(fallbackMessage.length > 0);
    } catch (error) {
      // It's okay if it throws, we just want to ensure it doesn't break the system
      console.warn('Language fallback test: ', error);
    }
    
    // Ensure we can still switch to a valid language
    await changeLanguage('en');
    const finalMessage = t('notifications.activated');
    assert.strictEqual(finalMessage, originalMessage);
  });

  test('Native language names should be correct', () => {
    const availableLanguages = getAvailableLanguages();
    const expectedNativeNames: { [key: string]: string } = {
      'en': 'English',
      'zh-CN': '简体中文',
      'ja': '日本語',
      'ko': '한국어', 
      'fr': 'Français',
      'de': 'Deutsch'
    };
    
    availableLanguages.forEach(lang => {
      const expectedNative = expectedNativeNames[lang.code];
      assert.ok(expectedNative, `Expected native name for ${lang.code}`);
      assert.strictEqual(lang.nativeName, expectedNative, `Native name for ${lang.code} should be correct`);
    });
  });
});