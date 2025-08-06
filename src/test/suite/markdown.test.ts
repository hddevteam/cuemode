/**
 * Unit tests for MarkdownParser
 */

import * as assert from 'assert';
import { MarkdownParser } from '../../utils/markdown';
import { MarkdownFeatures } from '../../types';

suite('MarkdownParser Tests', () => {
  const defaultFeatures: MarkdownFeatures = {
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
  };

  const allFeatures: MarkdownFeatures = {
    headers: true,
    emphasis: true,
    lists: true,
    links: true,
    code: true,
    blockquotes: true,
    tables: true,
    taskLists: true,
    strikethrough: true,
    horizontalRule: true
  };

  const noFeatures: MarkdownFeatures = {
    headers: false,
    emphasis: false,
    lists: false,
    links: false,
    code: false,
    blockquotes: false,
    tables: false,
    taskLists: false,
    strikethrough: false,
    horizontalRule: false
  };

  test('should handle empty content', () => {
    const result = MarkdownParser.parse('', defaultFeatures);
    assert.strictEqual(result.html, '');
    assert.strictEqual(result.originalLength, 0);
    assert.strictEqual(result.parsedLength, 0);
    assert.strictEqual(result.elementsFound.length, 0);
  });

  test('should handle null/undefined content gracefully', () => {
    const result = MarkdownParser.parse(null as any, defaultFeatures);
    assert.strictEqual(result.html, '');
    assert.strictEqual(result.originalLength, 0);
  });

  test('should parse headers correctly', () => {
    const content = '# Header 1\n## Header 2\n### Header 3';
    const result = MarkdownParser.parse(content, { ...noFeatures, headers: true });
    
    assert.ok(result.html.includes('<h1 class="markdown-header markdown-h1">Header 1</h1>'));
    assert.ok(result.html.includes('<h2 class="markdown-header markdown-h2">Header 2</h2>'));
    assert.ok(result.html.includes('<h3 class="markdown-header markdown-h3">Header 3</h3>'));
    assert.ok(result.elementsFound.includes('headers'));
  });

  test('should skip headers when disabled', () => {
    const content = '# Header 1\n## Header 2';
    const result = MarkdownParser.parse(content, { ...noFeatures, headers: false });
    
    assert.strictEqual(result.html, content);
    assert.ok(!result.elementsFound.includes('headers'));
  });

  test('should parse emphasis correctly', () => {
    const content = '**bold** *italic* ***bold-italic*** __bold__ _italic_';
    const result = MarkdownParser.parse(content, { ...noFeatures, emphasis: true });
    
    assert.ok(result.html.includes('<strong class="markdown-bold">bold</strong>'));
    assert.ok(result.html.includes('<em class="markdown-italic">italic</em>'));
    assert.ok(result.html.includes('<strong class="markdown-bold-italic"><em>bold-italic</em></strong>'));
    assert.ok(result.elementsFound.includes('emphasis'));
  });

  test('should parse unordered lists correctly', () => {
    const content = '- Item 1\n- Item 2\n* Item 3\n+ Item 4';
    const result = MarkdownParser.parse(content, { ...noFeatures, lists: true });
    
    assert.ok(result.html.includes('<ul class="markdown-list markdown-ul">'));
    assert.ok(result.html.includes('<li class="markdown-list-item">Item 1</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item">Item 2</li>'));
    assert.ok(result.elementsFound.includes('lists'));
  });

  test('should parse ordered lists correctly', () => {
    const content = '1. First item\n2. Second item\n3. Third item';
    const result = MarkdownParser.parse(content, { ...noFeatures, lists: true });
    
    assert.ok(result.html.includes('<ol class="markdown-list markdown-ol">'));
    assert.ok(result.html.includes('<li class="markdown-list-item">First item</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item">Second item</li>'));
    assert.ok(result.elementsFound.includes('lists'));
  });

  test('should parse nested unordered lists correctly', () => {
    const content = '- Item 1\n  - Nested item 1\n  - Nested item 2\n- Item 2\n    - Deeply nested item';
    const result = MarkdownParser.parse(content, { ...noFeatures, lists: true });
    
    assert.ok(result.html.includes('<ul class="markdown-list markdown-ul">'));
    assert.ok(result.html.includes('<li class="markdown-list-item">Item 1</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item markdown-list-item-nested-2">Nested item 1</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item markdown-list-item-nested-2">Nested item 2</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item markdown-list-item-nested-3">Deeply nested item</li>'));
    assert.ok(result.elementsFound.includes('lists'));
  });

  test('should parse nested ordered lists correctly', () => {
    const content = '1. 主列表项\n  2. 子列表项1\n  3. 子列表项2\n4. 第二个主列表项\n    5. 更深的嵌套';
    const result = MarkdownParser.parse(content, { ...noFeatures, lists: true });
    
    assert.ok(result.html.includes('<ol class="markdown-list markdown-ol">'));
    assert.ok(result.html.includes('<li class="markdown-list-item">主列表项</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item markdown-list-item-nested-2">子列表项1</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item markdown-list-item-nested-2">子列表项2</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item markdown-list-item-nested-3">更深的嵌套</li>'));
    assert.ok(result.elementsFound.includes('lists'));
  });

  test('should parse mixed nested lists correctly', () => {
    const content = '1. Ordered item\n  - Unordered nested\n    - Deeper unordered\n2. Second ordered\n  1. Nested ordered';
    const result = MarkdownParser.parse(content, { ...noFeatures, lists: true });
    
    assert.ok(result.html.includes('<li class="markdown-list-item">Ordered item</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item markdown-list-item-nested-2">Unordered nested</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item markdown-list-item-nested-3">Deeper unordered</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item markdown-list-item-nested-2">Nested ordered</li>'));
    assert.ok(result.elementsFound.includes('lists'));
  });

  test('should parse inline code correctly', () => {
    const content = 'This is `inline code` in text.';
    const result = MarkdownParser.parse(content, { ...noFeatures, code: true });
    
    assert.ok(result.html.includes('<code class="markdown-inline-code">inline code</code>'));
    assert.ok(result.elementsFound.includes('inline-code'));
  });

  test('should parse code blocks correctly', () => {
    const content = '```javascript\nconst x = 42;\nconsole.log(x);\n```';
    const result = MarkdownParser.parse(content, { ...noFeatures, code: true });
    
    assert.ok(result.html.includes('<pre class="markdown-code-block" data-language="javascript">'));
    assert.ok(result.html.includes('<code>const x = 42;'));
    assert.ok(result.elementsFound.includes('code-blocks'));
  });

  test('should parse blockquotes correctly', () => {
    const content = '> This is a quote\n> Multi-line quote';
    const result = MarkdownParser.parse(content, { ...noFeatures, blockquotes: true });
    
    // New parser processes each blockquote line independently
    assert.ok(result.html.includes('<blockquote class="markdown-blockquote">This is a quote</blockquote>'));
    assert.ok(result.html.includes('<blockquote class="markdown-blockquote">Multi-line quote</blockquote>'));
    assert.ok(result.elementsFound.includes('blockquotes'));
  });

  test('should parse links correctly when enabled', () => {
    const content = 'Visit [GitHub](https://github.com) for code.';
    const result = MarkdownParser.parse(content, { ...noFeatures, links: true });
    
    assert.ok(result.html.includes('<a href="https://github.com" class="markdown-link"'));
    assert.ok(result.html.includes('target="_blank" rel="noopener noreferrer">GitHub</a>'));
    assert.ok(result.elementsFound.includes('links'));
  });

  test('should skip links when disabled', () => {
    const content = 'Visit [GitHub](https://github.com) for code.';
    const result = MarkdownParser.parse(content, { ...noFeatures, links: false });
    
    assert.strictEqual(result.html, content);
    assert.ok(!result.elementsFound.includes('links'));
  });

  test('should parse tables correctly', () => {
    const content = '| Name | Age |\n|------|-----|\n| John | 30 |\n| Jane | 25 |';
    const result = MarkdownParser.parse(content, { ...noFeatures, tables: true });
    
    assert.ok(result.html.includes('<table class="markdown-table">'));
    assert.ok(result.html.includes('<th class="markdown-table-header">Name</th>'));
    assert.ok(result.html.includes('<td class="markdown-table-cell">John</td>'));
    assert.ok(result.elementsFound.includes('tables'));
  });

  test('should parse complex tables with markdown syntax correctly', () => {
    const content = '| 功能 | 语法 | 效果 |\n|------|------|------|\n| 粗体 | `**文字**` | **文字** |\n| 斜体 | `*文字*` | *文字* |\n| 删除线 | `~~文字~~` | ~~文字~~ |';
    const result = MarkdownParser.parse(content, { ...noFeatures, tables: true, code: true, emphasis: true, strikethrough: true });
    
    assert.ok(result.html.includes('<table class="markdown-table">'));
    assert.ok(result.html.includes('<th class="markdown-table-header">功能</th>'));
    assert.ok(result.html.includes('<th class="markdown-table-header">语法</th>'));
    assert.ok(result.html.includes('<th class="markdown-table-header">效果</th>'));
    
    // Check that table cells contain the content
    assert.ok(result.html.includes('<td class="markdown-table-cell">粗体</td>'));
    assert.ok(result.html.includes('<td class="markdown-table-cell">斜体</td>'));
    assert.ok(result.html.includes('<td class="markdown-table-cell">删除线</td>'));
    
    // Check that markdown within table cells is parsed
    // Note: Code blocks within table cells may parse their content differently
    assert.ok(result.html.includes('class="markdown-inline-code"'));
    assert.ok(result.html.includes('<strong class="markdown-bold">文字</strong>'));
    assert.ok(result.html.includes('<em class="markdown-italic">文字</em>'));
    assert.ok(result.html.includes('<del class="markdown-strikethrough">文字</del>'));
    
    assert.ok(result.elementsFound.includes('tables'));
    assert.ok(result.elementsFound.includes('inline-code'));
    assert.ok(result.elementsFound.includes('emphasis'));
    assert.ok(result.elementsFound.includes('strikethrough'));
  });

  test('should parse task lists correctly', () => {
    const content = '- [x] Completed task\n- [ ] Incomplete task';
    const result = MarkdownParser.parse(content, { ...noFeatures, taskLists: true });
    
    assert.ok(result.html.includes('class="markdown-task-item markdown-task-checked"'));
    assert.ok(result.html.includes('class="markdown-task-item markdown-task-unchecked"'));
    assert.ok(result.html.includes('checked'));
    assert.ok(result.elementsFound.includes('task-lists'));
  });

  test('should parse strikethrough correctly when enabled', () => {
    const content = 'This is ~~deleted~~ text.';
    const result = MarkdownParser.parse(content, { ...noFeatures, strikethrough: true });
    
    assert.ok(result.html.includes('<del class="markdown-strikethrough">deleted</del>'));
    assert.ok(result.elementsFound.includes('strikethrough'));
  });

  test('should parse horizontal rules correctly', () => {
    const content = 'Above rule\n---\nBelow rule\n***\nAnother section\n___\nFinal section';
    const result = MarkdownParser.parse(content, { ...noFeatures, horizontalRule: true });
    
    assert.ok(result.html.includes('<hr class="markdown-hr">'));
    assert.strictEqual((result.html.match(/<hr class="markdown-hr">/g) || []).length, 3);
    assert.ok(result.elementsFound.includes('horizontal-rule'));
  });

  test('should handle mixed markdown content', () => {
    const content = `# Title
**Bold text** and *italic text*

- List item 1
- List item 2

\`inline code\` and:

\`\`\`javascript
console.log('hello');
\`\`\`

> Quote here

---

Final paragraph.`;

    const result = MarkdownParser.parse(content, allFeatures);
    
    assert.ok(result.elementsFound.includes('headers'));
    assert.ok(result.elementsFound.includes('emphasis'));
    assert.ok(result.elementsFound.includes('lists'));
    assert.ok(result.elementsFound.includes('inline-code'));
    assert.ok(result.elementsFound.includes('code-blocks'));
    assert.ok(result.elementsFound.includes('blockquotes'));
    assert.ok(result.elementsFound.includes('horizontal-rule'));
    assert.ok(result.elementsFound.length >= 7);
  });

  test('should escape HTML in code blocks', () => {
    const content = '```html\n<script>alert("xss")</script>\n```';
    const result = MarkdownParser.parse(content, { ...noFeatures, code: true });
    
    assert.ok(result.html.includes('&lt;script&gt;'));
    assert.ok(result.html.includes('&lt;/script&gt;'));
    assert.ok(!result.html.includes('<script>'));
  });

  test('should escape HTML in inline code', () => {
    const content = 'Use `<script>` tags carefully.';
    const result = MarkdownParser.parse(content, { ...noFeatures, code: true });
    
    assert.ok(result.html.includes('&lt;script&gt;'));
    assert.ok(!result.html.includes('<script>'));
  });

  test('should handle performance with large content', () => {
    const largeContent = '# Header\n'.repeat(1000) + 'Regular text\n'.repeat(1000);
    const startTime = Date.now();
    
    const result = MarkdownParser.parse(largeContent, defaultFeatures);
    
    const duration = Date.now() - startTime;
    assert.ok(duration < 100, `Parsing took ${duration}ms, should be < 100ms`);
    assert.ok(result.elementsFound.includes('headers'));
  });

  test('getStats should return correct statistics', () => {
    const content = '# Header\n**Bold** text';
    const result = MarkdownParser.parse(content, defaultFeatures);
    const stats = MarkdownParser.getStats(result);
    
    assert.strictEqual(stats.hasMarkdown, true);
    assert.ok(stats.elementsCount >= 2); // headers and emphasis
    assert.ok(stats.compressionRatio > 0);
  });

  test('should handle nested markdown correctly', () => {
    const content = '- **Bold item**\n- *Italic item*\n- `Code item`';
    const result = MarkdownParser.parse(content, allFeatures);
    
    assert.ok(result.html.includes('<strong class="markdown-bold">Bold item</strong>'));
    assert.ok(result.html.includes('<em class="markdown-italic">Italic item</em>'));
    assert.ok(result.html.includes('<code class="markdown-inline-code">Code item</code>'));
  });

  test('should handle edge cases gracefully', () => {
    const edgeCases = [
      '',
      '   ',
      '\n\n\n',
      '# ',
      '**',
      '- ',
      '> ',
      '```\n```',
      '|',
      '- [ ]',
      '~~',
      '---'
    ];

    edgeCases.forEach(content => {
      const result = MarkdownParser.parse(content, allFeatures);
      assert.ok(typeof result.html === 'string', `Failed for content: "${content}"`);
      assert.ok(typeof result.originalLength === 'number');
      assert.ok(Array.isArray(result.elementsFound));
    });
  });

  // Additional tests for recent fixes
  test('should parse consecutive ordered lists with correct numbering', () => {
    const content = '1. 第一项\n2. 第二项\n3. 第三项';
    const result = MarkdownParser.parse(content, { ...noFeatures, lists: true });
    
    // Should be a single <ol> containing all items, not separate <ol> tags
    const olMatches = result.html.match(/<ol[^>]*>/g);
    assert.strictEqual(olMatches?.length, 1, 'Should have exactly one <ol> tag');
    
    // Should have three <li> items
    const liMatches = result.html.match(/<li[^>]*>/g);
    assert.strictEqual(liMatches?.length, 3, 'Should have exactly three <li> tags');
    
    // Items should be in the correct order
    assert.ok(result.html.includes('<li class="markdown-list-item">第一项</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item">第二项</li>'));
    assert.ok(result.html.includes('<li class="markdown-list-item">第三项</li>'));
    assert.ok(result.elementsFound.includes('lists'));
  });

  test('should parse nested blockquotes with proper indentation', () => {
    const content = '> 普通引用\n>> 嵌套引用\n>>> 深度嵌套引用';
    const result = MarkdownParser.parse(content, { ...noFeatures, blockquotes: true });
    
    assert.ok(result.html.includes('<blockquote class="markdown-blockquote">普通引用</blockquote>'));
    assert.ok(result.html.includes('<blockquote class="markdown-blockquote markdown-blockquote-nested-2">嵌套引用</blockquote>'));
    assert.ok(result.html.includes('<blockquote class="markdown-blockquote markdown-blockquote-nested-3">深度嵌套引用</blockquote>'));
    assert.ok(result.elementsFound.includes('blockquotes'));
  });

  test('should handle Chinese markdown content correctly', () => {
    const content = `# 标题1
段落内容

## 标题2
另一个段落

1. 第一项
2. 第二项

[链接文字](https://example.com)

> 普通引用
>> 嵌套引用

~~删除线文字~~

- [x] 已完成任务
- [ ] 未完成任务`;

    const result = MarkdownParser.parse(content, allFeatures);
    
    // Check headers
    assert.ok(result.html.includes('<h1 class="markdown-header markdown-h1">标题1</h1>'));
    assert.ok(result.html.includes('<h2 class="markdown-header markdown-h2">标题2</h2>'));
    
    // Check lists with consecutive numbering
    const olMatches = result.html.match(/<ol[^>]*>/g);
    assert.strictEqual(olMatches?.length, 1, 'Should have exactly one ordered list');
    
    // Check links
    assert.ok(result.html.includes('<a href="https://example.com" class="markdown-link"'));
    assert.ok(result.html.includes('链接文字</a>'));
    
    // Check nested blockquotes
    assert.ok(result.html.includes('<blockquote class="markdown-blockquote">普通引用</blockquote>'));
    assert.ok(result.html.includes('<blockquote class="markdown-blockquote markdown-blockquote-nested-2">嵌套引用</blockquote>'));
    
    // Check strikethrough
    assert.ok(result.html.includes('<del class="markdown-strikethrough">删除线文字</del>'));
    
    // Check task lists
    assert.ok(result.html.includes('已完成任务'));
    assert.ok(result.html.includes('未完成任务'));
    
    // Check that all expected elements were found
    const expectedElements = ['headers', 'lists', 'links', 'blockquotes', 'strikethrough', 'task-lists'];
    expectedElements.forEach(element => {
      assert.ok(result.elementsFound.includes(element), `Should find ${element}`);
    });
  });

  test('should handle mixed unordered and ordered lists correctly', () => {
    const content = `# 测试混合列表

无序列表:
- 项目1
- 项目2
- 项目3

有序列表:
1. 步骤1
2. 步骤2
3. 步骤3

另一个无序列表:
* 星号项目1
* 星号项目2`;

    const result = MarkdownParser.parse(content, allFeatures);
    
    // Should have one ol and two ul tags
    const olMatches = result.html.match(/<ol[^>]*>/g);
    const ulMatches = result.html.match(/<ul[^>]*>/g);
    
    assert.strictEqual(olMatches?.length, 1, 'Should have exactly one ordered list');
    assert.strictEqual(ulMatches?.length, 2, 'Should have exactly two unordered lists');
    
    // Check content is preserved
    assert.ok(result.html.includes('项目1'));
    assert.ok(result.html.includes('步骤1'));
    assert.ok(result.html.includes('星号项目1'));
  });

  test('should maintain ordered list numbering after nested unordered lists', () => {
    const content = `1. 有序列表项 1
2. 有序列表项 2
   - 无序子项 A
   - 无序子项 B
3. 有序列表项 3
4. 有序列表项 4`;

    const result = MarkdownParser.parse(content, allFeatures);
    
    // 验证第三项应该有 start="3" 属性（避免重置为1）
    assert.ok(result.html.includes('start="3"'), 'Should have start="3" attribute for continued numbering');
    
    // 验证包含正确的内容
    assert.ok(result.html.includes('有序列表项 1'));
    assert.ok(result.html.includes('有序列表项 2'));
    assert.ok(result.html.includes('无序子项 A'));
    assert.ok(result.html.includes('无序子项 B'));
    assert.ok(result.html.includes('有序列表项 3'));
    assert.ok(result.html.includes('有序列表项 4'));
    
    // 验证有序列表和无序列表都有正确的类
    assert.ok(result.html.includes('markdown-ol'));
    assert.ok(result.html.includes('markdown-ul'));
  });

  test('should render task lists without unwanted line breaks', () => {
    const content = `任务列表

- [ ] 学习基础语法
- [x] 掌握高级特性  
- [ ] 完成项目实战`;

    const result = MarkdownParser.parse(content, allFeatures);
    
    // 验证任务列表结构是单行的，没有多余换行
    assert.ok(result.html.includes('markdown-task-item'), 'Should contain task list items');
    assert.ok(result.html.includes('markdown-task-checkbox'), 'Should contain task checkboxes');
    assert.ok(result.html.includes('markdown-task-text'), 'Should contain task text');
    
    // 验证HTML结构是紧凑的（没有换行在标签内）
    const taskItemMatches = result.html.match(/<div class="markdown-task-item[^>]*><input[^>]*><span[^>]*>[^<]*<\/span><\/div>/g);
    assert.ok(taskItemMatches && taskItemMatches.length >= 3, 'Should have compact task item structure without line breaks');
    
    // 验证checked和unchecked状态
    assert.ok(result.html.includes('markdown-task-unchecked'), 'Should have unchecked tasks');
    assert.ok(result.html.includes('markdown-task-checked'), 'Should have checked tasks');
    assert.ok(result.html.includes('checked'), 'Should have checked attribute for completed tasks');
  });
});
