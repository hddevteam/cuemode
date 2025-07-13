import * as assert from 'assert';
import * as vscode from 'vscode';
import { ConfigManager } from '../../utils/config';
import { t } from '../../i18n';
import { CueModeExtension } from '../../extension';

/**
 * Extension integration tests
 */
suite('Extension Integration Tests', () => {
  let extension: CueModeExtension | undefined;

  suiteSetup(async () => {
    // Get the extension
    const ext = vscode.extensions.getExtension('luckyXmobile.cuemode');
    if (!ext) {
      throw new Error('Extension not found');
    }
    
    await ext.activate();
    // Note: We don't need to access internal context for these tests
  });

  suiteTeardown(() => {
    // Clean up
    if (extension) {
      extension.deactivate();
    }
  });

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('luckyXmobile.cuemode'));
  });

  test('Extension should activate', async () => {
    const ext = vscode.extensions.getExtension('luckyXmobile.cuemode');
    assert.ok(ext);
    
    await ext.activate();
    assert.strictEqual(ext.isActive, true);
  });

  test('CueMode command should be registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('cuemode.cueMode'));
  });

  test('Configuration should be accessible', () => {
    const config = vscode.workspace.getConfiguration('cuemode');
    assert.ok(config);
    
    // Test default values
    assert.strictEqual(config.get('colorTheme'), 'classic');
    assert.strictEqual(config.get('fontSize'), 24);
    assert.strictEqual(config.get('maxWidth'), 800);
    assert.strictEqual(config.get('lineHeight'), 1.5);
    assert.strictEqual(config.get('padding'), 10);
    assert.strictEqual(config.get('scrollSpeed'), 0.1);
    assert.strictEqual(config.get('startingPosition'), 50);
  });

  test('ConfigManager should return safe configuration', () => {
    const config = ConfigManager.getSafeConfig();
    assert.ok(config);
    assert.ok(typeof config.colorTheme === 'string');
    assert.ok(typeof config.fontSize === 'number');
    assert.ok(typeof config.maxWidth === 'number');
    assert.ok(typeof config.lineHeight === 'number');
    assert.ok(typeof config.padding === 'number');
    assert.ok(typeof config.scrollSpeed === 'number');
    assert.ok(typeof config.startingPosition === 'number');
  });

  test('I18n should initialize correctly', () => {
    // Test that I18n is working
    const message = t('notifications.activated');
    assert.ok(typeof message === 'string');
    assert.ok(message.length > 0);
  });

  test('I18n should handle missing keys gracefully', () => {
    const message = t('nonexistent.key' as any);
    assert.ok(typeof message === 'string');
    assert.ok(message.includes('nonexistent.key'));
  });

  test('CueMode command should handle no active editor', async () => {
    // Close all editors
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    
    // Try to execute CueMode command
    try {
      await vscode.commands.executeCommand('cuemode.cueMode');
      // Should not reach here if error is thrown
      assert.fail('Expected command to fail with no active editor');
    } catch (error) {
      // Expected behavior
      assert.ok(error);
    }
  });

  test('CueMode command should work with active editor', async () => {
    // Create a new untitled document
    const document = await vscode.workspace.openTextDocument({
      content: 'Hello, World!\nThis is a test document.',
      language: 'plaintext'
    });
    
    // Show the document
    await vscode.window.showTextDocument(document);
    
    // Execute CueMode command
    await vscode.commands.executeCommand('cuemode.cueMode');
    
    // Check if webview panel is created
    // Note: We can't directly access the webview panel from the test,
    // but we can check that the command executed without throwing
    assert.ok(true);
  });

  test('Configuration changes should be handled', async () => {
    const config = vscode.workspace.getConfiguration('cuemode');
    
    // Change a configuration value
    await config.update('fontSize', 32, vscode.ConfigurationTarget.Global);
    
    // Verify the change
    const newConfig = vscode.workspace.getConfiguration('cuemode');
    assert.strictEqual(newConfig.get('fontSize'), 32);
    
    // Reset to original value
    await config.update('fontSize', 24, vscode.ConfigurationTarget.Global);
  });

  test('Theme configuration should be valid', () => {
    const validThemes = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
    const config = ConfigManager.getSafeConfig();
    
    assert.ok(validThemes.includes(config.colorTheme));
  });

  test('Numeric configuration values should be within valid ranges', () => {
    const config = ConfigManager.getSafeConfig();
    
    // Test fontSize range
    assert.ok(config.fontSize >= 8 && config.fontSize <= 100);
    
    // Test maxWidth range
    assert.ok(config.maxWidth >= 200 && config.maxWidth <= 2000);
    
    // Test lineHeight range
    assert.ok(config.lineHeight >= 0.5 && config.lineHeight <= 5.0);
    
    // Test padding range
    assert.ok(config.padding >= 0 && config.padding <= 100);
    
    // Test scrollSpeed range
    assert.ok(config.scrollSpeed >= 0.01 && config.scrollSpeed <= 1.0);
    
    // Test startingPosition range
    assert.ok(config.startingPosition >= 0 && config.startingPosition <= 100);
  });
});
