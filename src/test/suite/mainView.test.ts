import * as assert from 'assert';
import { generateMainHTML } from '../../ui/mainView';

function makeConfig(showLineBreaks: boolean) {
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
    markdownMode: true,
    showLineBreaks,
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

suite('mainView', () => {
  test('generates core UI and embeds processed content', () => {
    const html = generateMainHTML({
      content: '# Demo',
      processedContent: '<div id="x">X</div>',
      filename: 'demo.md',
      config: makeConfig(true) as any,
    });

    assert.ok(html.includes('cue-controls'), 'Should include controls');
    assert.ok(html.includes('<div id="x">X</div>'), 'Should embed processed content');
    assert.ok(html.includes("case 'l':"), 'Should include L shortcut handler');
    assert.ok(html.includes("case '[':"), 'Should include [ shortcut handler');
    assert.ok(html.includes("case ']':"), 'Should include ] shortcut handler');
  });

  test('includes line-break marker CSS only when enabled', () => {
    const onHtml = generateMainHTML({
      content: 'x',
      processedContent: '<pre>x</pre>',
      filename: 'on.md',
      config: makeConfig(true) as any,
    });
    const offHtml = generateMainHTML({
      content: 'x',
      processedContent: '<pre>x</pre>',
      filename: 'off.md',
      config: makeConfig(false) as any,
    });

    assert.ok(onHtml.includes('cm-break-marker::before'));
    assert.ok(!offHtml.includes('cm-break-marker::before'));
  });

  test('includes lightweight content update and editor-cursor reveal handlers', () => {
    const html = generateMainHTML({
      content: '# Demo',
      processedContent: '<div id="x">X</div>',
      filename: 'demo.md',
      config: makeConfig(true) as any,
    });

    assert.ok(html.includes("message.type === 'contentUpdate'"));
    assert.ok(html.includes("message.type === 'revealEditorCursor'"));
    assert.ok(html.includes('scrollIntoView'));
  });
});
