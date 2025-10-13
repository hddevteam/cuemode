# CueMode 新功能开发文档

## 功能概述

本次开发实现了两个增强Markdown渲染体验的新功能：

### 1. 分级标题字体大小差异化

**目的：** 提供更清晰的视觉层级结构，使不同级别的标题更容易区分。

**实现细节：**

| 标题级别 | 字体大小倍率 | 说明 |
|---------|------------|------|
| H1 | 2.0x | 最大标题，带底部边框 |
| H2 | 1.7x | 次级标题，带底部边框 |
| H3 | 1.4x | 中型标题 |
| H4 | 1.2x | 标准大标题 |
| H5 | 1.05x | 略大于正文 |
| H6 | 0.95x | 略小于正文，半透明 |

**代码位置：**
- `src/utils/markdownStyles.ts` - 更新了 `.markdown-h1` 到 `.markdown-h6` 的字体大小样式

**响应式设计：**
- 在小屏幕（<768px）上，标题大小会自动调整以适应移动设备
- H1: 1.7em, H2: 1.5em, H3: 1.3em, H4: 1.15em

### 2. HTML 注释可见化显示

**目的：** 允许用户在Markdown文本中添加注释和备注，并在提词器模式下以不显眼的方式显示。

**使用场景：**
- 演示幻灯片分隔符：`<!-- 幻灯片 1 结束 -->`
- 演讲提示：`<!-- 注意：这里需要强调重点 -->`
- 时间标记：`<!-- 5分钟标记 -->`
- 交互提示：`<!-- 在这里停顿并询问观众问题 -->`

**显示效果：**
- 使用半透明文本（opacity: 0.4）
- 小号字体（0.85em）
- 斜体样式
- 特殊标记符号（※）
- 等宽字体显示注释内容

**示例：**

输入：
```markdown
# 一级标题

这是正文内容。

<!-- 这是一个注释：演示幻灯片分隔符 -->

## 二级标题

更多内容。

<!-- 提示：可以在这里停顿 -->
```

渲染效果：
- 标题以不同大小显示
- 注释以灰色、小号、斜体显示，前面带有 ※ 标记

**代码位置：**
- `src/utils/markdown.ts` - 添加了 `parseHtmlComments()` 方法
- `src/utils/markdownStyles.ts` - 添加了 `.markdown-comment` 相关样式

## 技术实现

### MarkdownParser 更新

在 `src/utils/markdown.ts` 中：

```typescript
/**
 * Parse HTML comments (<!-- comment -->)
 * Display them in a subtle, unobtrusive way
 */
private static parseHtmlComments(content: string): { html: string; found: boolean } {
  let found = false;
  const html = content.replace(/<!--\s*(.+?)\s*-->/g, (_match, commentText) => {
    found = true;
    return `<div class="markdown-comment"><span class="markdown-comment-marker">※</span> <span class="markdown-comment-text">${this.escapeHtml(commentText)}</span></div>`;
  });
  return { html, found };
}
```

**关键点：**
- 使用正则表达式 `/<!--\s*(.+?)\s*-->/g` 匹配HTML注释
- 注释内容通过 `escapeHtml()` 转义以防止XSS攻击
- 注释被解析为带有特殊CSS类的HTML结构
- 在解析流程的最早阶段执行（在代码块之前），确保注释始终被处理

### CSS 样式更新

在 `src/utils/markdownStyles.ts` 中：

```css
/* Markdown HTML Comments - Subtle, unobtrusive display */
.markdown-comment {
  color: ${theme.textColor};
  opacity: 0.4;
  font-size: 0.85em;
  font-style: italic;
  padding: 0.3em 0;
  margin: 0.2em 0;
  line-height: 1.3;
}

.markdown-comment-marker {
  font-style: normal;
  opacity: 0.6;
  margin-right: 0.3em;
}

.markdown-comment-text {
  font-family: 'Courier New', Consolas, 'Liberation Mono', Menlo, monospace;
}
```

## 测试验证

### 编译测试
```bash
npm run compile
```
✅ **通过** - 无TypeScript编译错误

### 完整测试套件
```bash
npm test
```
✅ **通过** - 134/134 测试全部通过

### 手动测试文件
创建了 `.temp/test-files/test-new-features.md` 用于手动测试：
- 包含所有6个级别的标题
- 包含多个HTML注释示例
- 演示注释与其他Markdown元素的兼容性

## 兼容性

### 主题兼容性
✅ 所有7个主题（Classic, Inverted, Midnight Blue, Sunset, Forest, Ocean, Rose）

### Focus Mode 兼容性
✅ 注释会随Focus Mode一起模糊/聚焦

### 响应式设计
✅ 小屏幕自动调整标题和注释大小

### 国际化
✅ 注释内容支持所有Unicode字符，包括中文、日文、韩文等

## 使用指南

### 基本用法

1. **在Markdown文件中添加注释：**
```markdown
<!-- 这是一个注释 -->
```

2. **使用不同级别的标题：**
```markdown
# 一级标题 - 最大
## 二级标题 - 较大
### 三级标题 - 中等
#### 四级标题 - 标准
##### 五级标题 - 略小
###### 六级标题 - 最小
```

### 最佳实践

1. **演示幻灯片分隔：**
```markdown
## 第一部分内容
...
<!-- 幻灯片 1 结束 -->

## 第二部分内容
...
<!-- 幻灯片 2 结束 -->
```

2. **演讲提示：**
```markdown
## 重要观点

这是核心内容。

<!-- 注意：在这里强调并重复一遍 -->
```

3. **时间管理：**
```markdown
<!-- 10分钟标记：应该讲到这里 -->

## 接下来的议题
```

4. **交互提示：**
```markdown
这是一个关键概念。

<!-- 停顿：询问观众是否有问题 -->
```

## 未来增强

可能的未来改进方向：

1. **注释高亮模式：**
   - 添加快捷键切换注释的显示/隐藏
   - 可配置注释的不透明度

2. **注释分类：**
   - 支持不同类型的注释（提示、警告、时间标记等）
   - 使用不同颜色或图标区分

3. **注释交互：**
   - 点击注释可以展开显示详细信息
   - 支持注释中的简单格式化

4. **导出功能：**
   - 导出时可选择是否包含注释
   - 生成演讲稿和提词器稿两个版本

## 性能影响

- **解析性能：** 注释解析使用高效的正则表达式，对性能影响可忽略不计
- **渲染性能：** 额外的CSS类不会影响渲染速度
- **内存占用：** 注释内容较短，内存影响极小

## 总结

本次更新为CueMode的Markdown渲染功能带来了两个实用的增强：

1. **视觉层级更清晰：** 通过差异化的标题字体大小，文档结构一目了然
2. **注释可见化：** 支持在演示时显示备注和提示，提升专业演讲体验

这些功能与现有的Focus Mode、Mirror Flip、主题系统等完美集成，为用户提供更加专业和灵活的提词器体验。
