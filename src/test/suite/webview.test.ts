import * as assert from 'assert';
import * as vscode from 'vscode';
import { WebViewManager } from '../../ui/webview';
import { ConfigManager } from '../../utils/config';

/**
 * WebView Manager tests
 */
suite('WebViewManager Tests', () => {
  let webViewManager: WebViewManager;
  let mockContext: vscode.ExtensionContext;

  suiteSetup(() => {
    // Create mock context
    mockContext = {
      subscriptions: [],
      globalState: {
        get: () => undefined,
        update: () => Promise.resolve()
      },
      workspaceState: {
        get: () => undefined,
        update: () => Promise.resolve()
      },
      extensionPath: __dirname,
      extensionUri: vscode.Uri.file(__dirname),
      storageUri: vscode.Uri.file(__dirname),
      globalStorageUri: vscode.Uri.file(__dirname),
      logUri: vscode.Uri.file(__dirname),
      asAbsolutePath: (path: string) => path
    } as any;

    webViewManager = new WebViewManager(mockContext);
  });

  suiteTeardown(() => {
    // Clean up
    if (webViewManager && webViewManager.isActive()) {
      webViewManager.close();
    }
  });

  test('WebViewManager should be created successfully', () => {
    assert.ok(webViewManager, 'WebViewManager should be created');
    assert.ok(typeof webViewManager.isActive === 'function', 'Should have isActive method');
    assert.ok(typeof webViewManager.create === 'function', 'Should have create method');
    assert.ok(typeof webViewManager.close === 'function', 'Should have close method');
    assert.ok(typeof webViewManager.updateConfig === 'function', 'Should have updateConfig method');
  });

  test('WebViewManager should start inactive', () => {
    assert.strictEqual(webViewManager.isActive(), false, 'Should start inactive');
  });

  test('WebViewManager should create webview successfully', async () => {
    const content = 'Hello, World!\nThis is a test content.';
    const filename = 'test.txt';
    const config = ConfigManager.getSafeConfig();

    await webViewManager.create(content, filename, config);
    
    assert.ok(webViewManager.isActive(), 'Should be active after creation');
  });

  test('WebViewManager should handle empty content', async () => {
    const content = '';
    const filename = 'empty.txt';
    const config = ConfigManager.getSafeConfig();

    // Should not throw error
    await webViewManager.create(content, filename, config);
    assert.ok(webViewManager.isActive(), 'Should be active even with empty content');
  });

  test('WebViewManager should handle long content', async () => {
    const content = 'Long content line.\n'.repeat(1000);
    const filename = 'long.txt';
    const config = ConfigManager.getSafeConfig();

    await webViewManager.create(content, filename, config);
    assert.ok(webViewManager.isActive(), 'Should handle long content');
  });

  test('WebViewManager should handle special characters', async () => {
    const content = 'Special characters: áéíóú ñ 中文 русский 日本語 🎉';
    const filename = 'special.txt';
    const config = ConfigManager.getSafeConfig();

    await webViewManager.create(content, filename, config);
    assert.ok(webViewManager.isActive(), 'Should handle special characters');
  });

  test('WebViewManager should handle different file extensions', async () => {
    const testCases = [
      { content: 'console.log("Hello");', filename: 'test.js' },
      { content: 'def hello():\n    pass', filename: 'test.py' },
      { content: '# Markdown\n\nContent here', filename: 'test.md' },
      { content: '<html><body>Hello</body></html>', filename: 'test.html' }
    ];

    const config = ConfigManager.getSafeConfig();

    for (const testCase of testCases) {
      await webViewManager.create(testCase.content, testCase.filename, config);
      assert.ok(webViewManager.isActive(), `Should handle ${testCase.filename}`);
      webViewManager.close();
    }
  });

  test('WebViewManager should update configuration', async () => {
    const content = 'Test content';
    const filename = 'test.txt';
    const config = ConfigManager.getSafeConfig();

    await webViewManager.create(content, filename, config);
    
    // Update configuration
    const newConfig = { ...config, fontSize: 32 };
    webViewManager.updateConfig(newConfig);
    
    assert.ok(webViewManager.isActive(), 'Should remain active after config update');
  });

  test('WebViewManager should close webview', async () => {
    const content = 'Test content';
    const filename = 'test.txt';
    const config = ConfigManager.getSafeConfig();

    await webViewManager.create(content, filename, config);
    assert.ok(webViewManager.isActive(), 'Should be active before closing');
    
    webViewManager.close();
    assert.ok(!webViewManager.isActive(), 'Should be inactive after closing');
  });

  test('WebViewManager should handle multiple create calls', async () => {
    const content1 = 'First content';
    const content2 = 'Second content';
    const filename = 'test.txt';
    const config = ConfigManager.getSafeConfig();

    await webViewManager.create(content1, filename, config);
    assert.ok(webViewManager.isActive(), 'Should be active after first create');

    // Second create should replace the first
    await webViewManager.create(content2, filename, config);
    assert.ok(webViewManager.isActive(), 'Should still be active after second create');
  });

  test('WebViewManager should handle invalid configuration gracefully', async () => {
    const content = 'Test content';
    const filename = 'test.txt';
    const invalidConfig = {
      colorTheme: 'invalid-theme' as any,
      fontSize: -10,
      maxWidth: 0,
      lineHeight: 0,
      padding: -5,
      scrollSpeed: 0,
      startingPosition: -10,
      focusMode: false,
      focusOpacity: 0.3,
      focusLineCount: 3,
      mirrorFlip: false,
      markdownMode: false,
      markdownFeatures: {
        headers: true,
        emphasis: true,
        lists: true,
        links: false,
        code: true,
        blockquotes: true,
        tables: true,
        taskLists: true,
        strikethrough: false,
        horizontalRule: true
      }
    };

    // Should not throw error
    await webViewManager.create(content, filename, invalidConfig);
    assert.ok(webViewManager.isActive(), 'Should handle invalid config gracefully');
  });

  test('WebViewManager should handle content with HTML entities', async () => {
    const content = 'HTML entities: < > & " \' & &amp; &lt; &gt;';
    const filename = 'entities.txt';
    const config = ConfigManager.getSafeConfig();

    await webViewManager.create(content, filename, config);
    assert.ok(webViewManager.isActive(), 'Should handle HTML entities');
  });

  test('WebViewManager should handle content with line breaks', async () => {
    const content = 'Line 1\nLine 2\r\nLine 3\rLine 4';
    const filename = 'lines.txt';
    const config = ConfigManager.getSafeConfig();

    await webViewManager.create(content, filename, config);
    assert.ok(webViewManager.isActive(), 'Should handle different line breaks');
  });

  test('WebViewManager should handle content with tabs', async () => {
    const content = 'Tabs:\tTab 1\t\tTab 2\n\tIndented line';
    const filename = 'tabs.txt';
    const config = ConfigManager.getSafeConfig();

    await webViewManager.create(content, filename, config);
    assert.ok(webViewManager.isActive(), 'Should handle tabs');
  });

  test('WebViewManager should handle repeated close calls', () => {
    // Should not throw error on multiple close calls
    assert.doesNotThrow(() => {
      webViewManager.close();
      webViewManager.close();
      webViewManager.close();
    }, 'Should handle repeated close calls');
  });

  test('WebViewManager should handle update config when inactive', () => {
    const config = ConfigManager.getSafeConfig();
    
    // Should not throw error when updating config on inactive webview
    assert.doesNotThrow(() => {
      webViewManager.updateConfig(config);
    }, 'Should handle config update when inactive');
  });

  test('WebViewManager should handle very long filenames', async () => {
    const content = 'Test content';
    const filename = 'very-long-filename-that-might-cause-issues-in-some-systems.txt';
    const config = ConfigManager.getSafeConfig();

    await webViewManager.create(content, filename, config);
    assert.ok(webViewManager.isActive(), 'Should handle long filenames');
  });

  test('WebViewManager should handle filenames with special characters', async () => {
    const content = 'Test content';
    const filename = 'file-with-special-chars_äöü.txt';
    const config = ConfigManager.getSafeConfig();

    await webViewManager.create(content, filename, config);
    assert.ok(webViewManager.isActive(), 'Should handle special characters in filename');
  });

  test('WebViewManager should handle different themes', async () => {
    const content = 'Test content';
    const filename = 'test.txt';
    const themes = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];

    for (const theme of themes) {
      const config = { ...ConfigManager.getSafeConfig(), colorTheme: theme as any };
      await webViewManager.create(content, filename, config);
      assert.ok(webViewManager.isActive(), `Should handle ${theme} theme`);
      webViewManager.close();
    }
  });
});
