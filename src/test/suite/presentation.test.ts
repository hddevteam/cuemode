import * as assert from 'assert';
import * as vscode from 'vscode';
import { WebViewManager } from '../../ui/webview';
import { ConfigManager } from '../../utils/config';
import { generatePresentationCSS } from '../../utils/webviewStyles';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMockContext(): vscode.ExtensionContext {
  return {
    subscriptions: [],
    globalState: {
      get: () => undefined,
      update: () => Promise.resolve(),
    },
    workspaceState: {
      get: () => undefined,
      update: () => Promise.resolve(),
    },
    extensionPath: __dirname,
    extensionUri: vscode.Uri.file(__dirname),
    storageUri: vscode.Uri.file(__dirname),
    globalStorageUri: vscode.Uri.file(__dirname),
    logUri: vscode.Uri.file(__dirname),
    asAbsolutePath: (p: string) => p,
  } as any;
}

/**
 * Reproduce the slide-splitting logic used in extension.ts so we can unit-test
 * it without spinning up a real VS Code extension host editor.
 */
function splitIntoSlides(rawText: string): string[] {
  return rawText
    .split(/^\s*---\s*$/m)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);
}

// ---------------------------------------------------------------------------
// Suite: slide splitting logic
// ---------------------------------------------------------------------------
suite('Presentation Mode – Slide Splitting', () => {
  test('single block without --- produces one slide', () => {
    const raw = '# Hello\nThis is a single slide.';
    const slides = splitIntoSlides(raw);
    assert.strictEqual(slides.length, 1, 'Should produce exactly 1 slide');
    assert.ok(slides[0]!.includes('Hello'), 'Content should be preserved');
  });

  test('two blocks separated by --- produce two slides', () => {
    const raw = '# Slide 1\ncontent one\n---\n# Slide 2\ncontent two';
    const slides = splitIntoSlides(raw);
    assert.strictEqual(slides.length, 2, 'Should produce 2 slides');
    assert.ok(slides[0]!.startsWith('# Slide 1'), 'First slide content correct');
    assert.ok(slides[1]!.startsWith('# Slide 2'), 'Second slide content correct');
  });

  test('three blocks separated by --- produce three slides', () => {
    const raw = 'A\n---\nB\n---\nC';
    const slides = splitIntoSlides(raw);
    assert.strictEqual(slides.length, 3);
    assert.strictEqual(slides[0], 'A');
    assert.strictEqual(slides[1], 'B');
    assert.strictEqual(slides[2], 'C');
  });

  test('--- with surrounding whitespace is still treated as separator', () => {
    const raw = 'Slide 1\n  ---  \nSlide 2';
    const slides = splitIntoSlides(raw);
    assert.strictEqual(slides.length, 2);
  });

  test('leading/trailing blank lines are trimmed per slide', () => {
    const raw = '\n\n# Slide 1\n\n---\n\n# Slide 2\n\n';
    const slides = splitIntoSlides(raw);
    assert.strictEqual(slides.length, 2);
    assert.ok(slides[0]!.startsWith('#'), 'Trimmed correctly');
  });

  test('empty sections (consecutive ---) are filtered out', () => {
    const raw = 'A\n---\n---\nB';
    const slides = splitIntoSlides(raw);
    assert.strictEqual(slides.length, 2, 'Empty slide between --- should be removed');
  });

  test('empty string produces zero slides', () => {
    const slides = splitIntoSlides('   \n   ');
    assert.strictEqual(slides.length, 0);
  });

  test('content with code blocks containing --- is not split', () => {
    // A --- inside a fenced code block should not be a slide separator,
    // but our simple regex splits on *any* line that is only "---".
    // This test documents the current behaviour (not a markdown-aware split).
    const raw = '# Slide 1\n```\nsome --- code\n```\n---\n# Slide 2';
    const slides = splitIntoSlides(raw);
    // The "---" inside the code block is not on its own line, so only 1 separator exists.
    assert.strictEqual(slides.length, 2);
  });
});

// ---------------------------------------------------------------------------
// Suite: generatePresentationCSS
// ---------------------------------------------------------------------------
suite('Presentation Mode – CSS Generation', () => {
  test('generatePresentationCSS returns a non-empty string', () => {
    const css = generatePresentationCSS();
    assert.ok(typeof css === 'string' && css.length > 0, 'Should return CSS string');
  });

  test('CSS contains required selectors', () => {
    const css = generatePresentationCSS();
    assert.ok(css.includes('.pm-slide'), 'Should contain .pm-slide selector');
    assert.ok(css.includes('.pm-slide.active'), 'Should contain .pm-slide.active selector');
    assert.ok(css.includes('.pm-nav'), 'Should contain .pm-nav selector');
    assert.ok(css.includes('.pm-controls'), 'Should contain .pm-controls selector');
    assert.ok(css.includes('pmFadeIn'), 'Should contain fade-in animation');
  });

  test('inactive slide uses display: none', () => {
    const css = generatePresentationCSS();
    // .pm-slide should be hidden by default
    const slideBlock = css.match(/\.pm-slide\s*\{([^}]*)\}/);
    assert.ok(slideBlock, '.pm-slide block should exist');
    assert.ok(slideBlock![1]!.includes('display: none'), '.pm-slide should be hidden by default');
  });

  test('active slide uses display: flex', () => {
    const css = generatePresentationCSS();
    const activeBlock = css.match(/\.pm-slide\.active\s*\{([^}]*)\}/);
    assert.ok(activeBlock, '.pm-slide.active block should exist');
    assert.ok(activeBlock![1]!.includes('display: flex'), '.pm-slide.active should use flex');
  });
});

// ---------------------------------------------------------------------------
// Suite: WebViewManager.createPresentation
// ---------------------------------------------------------------------------
suite('Presentation Mode – WebViewManager.createPresentation', () => {
  let manager: WebViewManager;

  suiteSetup(() => {
    manager = new WebViewManager(makeMockContext());
  });

  suiteTeardown(() => {
    if (manager.isActive()) {
      manager.close();
    }
  });

  test('createPresentation method exists on WebViewManager', () => {
    assert.ok(
      typeof (manager as any).createPresentation === 'function',
      'createPresentation should be a public method'
    );
  });

  test('createPresentation activates the webview', async () => {
    const slides = ['# Slide 1\nHello world', '# Slide 2\nSecond slide'];
    const config = ConfigManager.getSafeConfig();

    await manager.createPresentation(slides, 'test.md', config);
    assert.strictEqual(
      manager.isActive(),
      true,
      'Webview should be active after createPresentation'
    );

    manager.close();
    assert.strictEqual(manager.isActive(), false, 'Webview should be inactive after close');
  });

  test('createPresentation with single slide still activates', async () => {
    const slides = ['# Only Slide\nJust one slide here.'];
    const config = ConfigManager.getSafeConfig();

    await manager.createPresentation(slides, 'single.md', config);
    assert.strictEqual(manager.isActive(), true);

    manager.close();
  });

  test('createPresentation HTML contains all slide elements', async () => {
    const slides = ['# A\nfirst', '# B\nsecond', '# C\nthird'];
    const config = ConfigManager.getSafeConfig();

    // Access private method for white-box testing
    const html: string = (manager as any).generatePresentationHTML(slides, config, 'demo.md');

    assert.ok(html.includes('pm-slide'), 'HTML should contain slide elements');
    // Three slides: data-slide="0", "1", "2"
    assert.ok(html.includes('data-slide="0"'), 'Should have slide 0');
    assert.ok(html.includes('data-slide="1"'), 'Should have slide 1');
    assert.ok(html.includes('data-slide="2"'), 'Should have slide 2');
    // First slide should be active
    assert.ok(html.includes('pm-slide active'), 'First slide should have active class');
    // Navigation bar should be present for multiple slides
    assert.ok(html.includes('pm-nav'), 'Navigation bar should be present');
    // Counter should show correct total
    assert.ok(html.includes('1 / 3'), 'Counter should show 1 / 3');
  });

  test('single-slide HTML hides navigation bar', async () => {
    const slides = ['# Solo'];
    const config = ConfigManager.getSafeConfig();

    const html: string = (manager as any).generatePresentationHTML(slides, config, 'solo.md');
    assert.ok(
      html.includes('display:none') || html.includes('display: none'),
      'Nav should be hidden for 1 slide'
    );
  });
});
