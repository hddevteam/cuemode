import * as assert from 'assert';
import { ThemeManager } from '../../utils/theme';
import { ColorTheme } from '../../types';

/**
 * Theme Manager tests
 */
suite('ThemeManager Tests', () => {
  
  test('getTheme should return valid theme for all supported themes', () => {
    const themes: ColorTheme[] = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
    
    themes.forEach(themeName => {
      const theme = ThemeManager.getTheme(themeName);
      
      assert.ok(theme, `Theme ${themeName} should be defined`);
      assert.ok(theme.backgroundColor, `Theme ${themeName} should have backgroundColor`);
      assert.ok(theme.textColor, `Theme ${themeName} should have textColor`);
      assert.ok(typeof theme.backgroundColor === 'string', `Theme ${themeName} backgroundColor should be string`);
      assert.ok(typeof theme.textColor === 'string', `Theme ${themeName} textColor should be string`);
    });
  });

  test('getTheme should return valid CSS colors', () => {
    const themes: ColorTheme[] = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
    
    themes.forEach(themeName => {
      const theme = ThemeManager.getTheme(themeName);
      
      // CSS color validation (basic patterns)
      const cssColorPattern = /^(#[0-9A-Fa-f]{3,6}|rgb\(|rgba\(|hsl\(|hsla\(|[a-zA-Z]+).*$/;
      
      assert.ok(
        cssColorPattern.test(theme.backgroundColor),
        `Theme ${themeName} backgroundColor should be valid CSS color: ${theme.backgroundColor}`
      );
      
      assert.ok(
        cssColorPattern.test(theme.textColor),
        `Theme ${themeName} textColor should be valid CSS color: ${theme.textColor}`
      );
    });
  });

  test('getTheme should return fallback for invalid theme', () => {
    const invalidTheme = 'nonexistent-theme' as ColorTheme;
    const theme = ThemeManager.getTheme(invalidTheme);
    
    // Should return classic theme as fallback
    const classicTheme = ThemeManager.getTheme('classic');
    assert.deepStrictEqual(theme, classicTheme);
  });

  test('getAllThemes should return all available themes', () => {
    const allThemes = ThemeManager.getAllThemes();
    
    assert.ok(allThemes);
    assert.ok(typeof allThemes === 'object');
    assert.ok(Object.keys(allThemes).length > 0);
    
    // Check that all expected themes are present
    const expectedThemes: ColorTheme[] = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
    expectedThemes.forEach(themeName => {
      assert.ok(
        allThemes.hasOwnProperty(themeName),
        `Theme ${themeName} should be in getAllThemes result`
      );
    });
  });

  test('isValidTheme should correctly validate theme names', () => {
    const validThemes: ColorTheme[] = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
    const invalidThemes = ['invalid', 'nonexistent', '', 'CLASSIC', 'Classic'];
    
    validThemes.forEach(theme => {
      const themeConfig = ThemeManager.getTheme(theme);
      const classicTheme = ThemeManager.getTheme('classic');
      
      // Valid themes should return their own config, not fallback to classic
      if (theme === 'classic') {
        assert.deepStrictEqual(themeConfig, classicTheme);
      } else {
        assert.notDeepStrictEqual(themeConfig, classicTheme, `${theme} should have unique config`);
      }
    });
    
    invalidThemes.forEach(theme => {
      const themeConfig = ThemeManager.getTheme(theme as ColorTheme);
      const classicTheme = ThemeManager.getTheme('classic');
      
      // Invalid themes should fallback to classic
      assert.deepStrictEqual(themeConfig, classicTheme, `${theme} should fallback to classic`);
    });
  });

  test('themes should have good contrast ratios', () => {
    const themes: ColorTheme[] = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
    
    themes.forEach(themeName => {
      const theme = ThemeManager.getTheme(themeName);
      
      // Basic contrast check - colors should be different
      assert.notStrictEqual(
        theme.backgroundColor.toLowerCase(),
        theme.textColor.toLowerCase(),
        `Theme ${themeName} should have different background and text colors`
      );
      
      // Test accessibility validation
      const isAccessible = ThemeManager.validateThemeAccessibility(themeName);
      assert.ok(isAccessible, `Theme ${themeName} should meet accessibility standards`);
    });
  });

  test('classic theme should have expected colors', () => {
    const theme = ThemeManager.getTheme('classic');
    
    // Classic theme should be white text on black background
    assert.strictEqual(theme.backgroundColor, '#000000', 'Classic theme should have black background');
    assert.strictEqual(theme.textColor, '#ffffff', 'Classic theme should have white text');
  });

  test('inverted theme should have expected colors', () => {
    const theme = ThemeManager.getTheme('inverted');
    
    // Inverted theme should be black text on white background
    assert.strictEqual(theme.backgroundColor, '#ffffff', 'Inverted theme should have white background');
    assert.strictEqual(theme.textColor, '#000000', 'Inverted theme should have black text');
  });

  test('getThemeNames should return all theme names', () => {
    const themeNames = ThemeManager.getThemeNames();
    
    assert.ok(themeNames);
    assert.ok(Array.isArray(themeNames));
    assert.strictEqual(themeNames.length, 7); // Should have 7 themes
    
    const expectedNames: ColorTheme[] = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
    expectedNames.forEach(name => {
      assert.ok(themeNames.includes(name), `Theme names should include ${name}`);
    });
  });

  test('isDarkTheme should correctly identify dark themes', () => {
    assert.ok(ThemeManager.isDarkTheme('classic'), 'Classic theme should be dark');
    assert.ok(!ThemeManager.isDarkTheme('inverted'), 'Inverted theme should not be dark');
    assert.ok(ThemeManager.isDarkTheme('midnightBlue'), 'Midnight blue theme should be dark');
    assert.ok(ThemeManager.isDarkTheme('sunset'), 'Sunset theme should be dark');
    assert.ok(ThemeManager.isDarkTheme('forest'), 'Forest theme should be dark');
    assert.ok(ThemeManager.isDarkTheme('ocean'), 'Ocean theme should be dark');
    assert.ok(ThemeManager.isDarkTheme('rose'), 'Rose theme should be dark');
  });

  test('getContrastRatio should return valid contrast ratios', () => {
    // Test with known colors
    const blackWhiteRatio = ThemeManager.getContrastRatio('#000000', '#ffffff');
    assert.ok(blackWhiteRatio > 20, 'Black and white should have very high contrast');
    
    const sameColorRatio = ThemeManager.getContrastRatio('#000000', '#000000');
    assert.strictEqual(sameColorRatio, 1, 'Same colors should have 1:1 contrast ratio');
  });

  test('generateCSS should return valid CSS string', () => {
    const css = ThemeManager.generateCSS('classic', 24, 1.5, 800, 10);
    
    assert.ok(css);
    assert.ok(typeof css === 'string');
    assert.ok(css.includes('--bg-color'), 'CSS should include background color variable');
    assert.ok(css.includes('--text-color'), 'CSS should include text color variable');
    assert.ok(css.includes('--font-size'), 'CSS should include font size variable');
    assert.ok(css.includes('body'), 'CSS should include body styles');
    assert.ok(css.includes('.cue-container'), 'CSS should include container styles');
  });

  test('validateThemeAccessibility should validate all themes', () => {
    const themes: ColorTheme[] = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
    
    themes.forEach(themeName => {
      const isAccessible = ThemeManager.validateThemeAccessibility(themeName);
      assert.ok(typeof isAccessible === 'boolean', `Theme ${themeName} accessibility should return boolean`);
      
      // All our themes should be accessible
      assert.ok(isAccessible, `Theme ${themeName} should be accessible`);
    });
  });
});
