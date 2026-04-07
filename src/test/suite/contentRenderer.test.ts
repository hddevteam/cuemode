import * as assert from 'assert';
import {
  parseMarkdownBlocks,
  processContent,
  processPlainTextContent,
} from '../../ui/contentRenderer';

function makeConfig(markdownMode: boolean) {
  return {
    colorTheme: 'classic',
    maxWidth: 800,
    fontSize: 24,
    lineHeight: 1.5,
    padding: 10,
    scrollSpeed: 0.1,
    startingPosition: 50,
    focusMode: false,
    focusOpacity: 0.3,
    focusLineCount: 3,
    mirrorFlip: false,
    markdownMode,
    showLineBreaks: true,
    markdownFeatures: {
      headers: true,
      emphasis: true,
      lists: true,
      links: true,
      code: true,
      blockquotes: true,
      tables: true,
      taskLists: true,
      strikethrough: true,
      horizontalRule: true,
    },
  };
}

suite('contentRenderer', () => {
  test('processPlainTextContent escapes HTML and preserves lines', () => {
    const html = processPlainTextContent('<a>\nB & C');
    assert.ok(html.includes('&lt;a&gt;'), 'Should escape angle brackets');
    assert.ok(html.includes('B &amp; C'), 'Should escape ampersand');
    assert.ok(html.includes('data-line="0"'), 'Should contain line 0 marker');
    assert.ok(html.includes('data-line="1"'), 'Should contain line 1 marker');
  });

  test('parseMarkdownBlocks splits top-level blocks and remaining text', () => {
    const blocks = parseMarkdownBlocks('<h1>A</h1><p>B</p>tail');
    assert.strictEqual(blocks.length, 3);
    assert.strictEqual(blocks[0], '<h1>A</h1>');
    assert.strictEqual(blocks[1], '<p>B</p>');
    assert.strictEqual(blocks[2], 'tail');
  });

  test('processContent in markdown mode returns markdown-content wrapper', () => {
    const html = processContent('# Title\n\nParagraph', makeConfig(true) as any);
    assert.ok(html.includes('markdown-content'), 'Should include markdown-content wrapper');
    assert.ok(html.includes('markdown-block'), 'Should include markdown block wrapper');
  });

  test('processContent in markdown mode preserves snake_case identifiers', () => {
    const html = processContent('light_is_on', makeConfig(true) as any);

    assert.ok(html.includes('light_is_on'), 'Should preserve the original snake_case text');
    assert.ok(!html.includes('markdown-italic'), 'Should not inject italic markup into identifier');
  });

  test('processContent in plain mode returns pre wrapper', () => {
    const html = processContent('plain text', makeConfig(false) as any);
    assert.ok(html.startsWith('<pre>'), 'Plain mode should return pre wrapper');
  });
});
