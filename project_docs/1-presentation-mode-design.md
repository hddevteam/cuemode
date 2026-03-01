# CueMode 演示模式 (Presentation Mode) 设计文档

## 背景与需求

CueMode 目前提供专业的提词器功能（自动滚屏跟随阅读），主要应用于视频节目录制、直播等场景。
但在“讲课”、“代码评审”或“技术分享”场景下，讲师常常需要：

1. 提取一段特定代码或总结文本。
2. 将其在屏幕正中间**大字号、带有格式地集中展示**。
3. 不需要自动滚动，而是需要受控的分步展示或单页静态展示。

因此，我们计划引入**“演示模式” (Presentation Mode)** 功能，帮助开发者和教育工作者快速将选中文本或整个 Markdown 内容转换为高清晰度、无干扰的讲课幻灯片。

## 场景描述 (Use Cases)

- **片段精讲**：讲师在编辑器中选中了几行核心代码或一段文字，通过快捷键启动“演示模式”，屏幕立即进入全屏居中状态，将这段代码以带高亮的格式展示在正中央，作为该部分讲解的视觉焦点。
- **大纲过场**：讲师打开一个 Markdown 文件（讲义大纲），启动“演示模式”。讲稿按照 Markdown 的分割符 (`---`) 切分为多个“幻灯片 (Slides)”，讲师可以使用左右方向键、空格键在屏幕正中间单步切换展示内容。

## 功能核心特性

1. **触发源支持**：
   - **选中文本触发**：优先捕获活动编辑器中被选中的文本。如果文本较短，则完全居中显示。
   - **全文触发**：若没有选中任何文本，且当前为 `.md` 文件，则解析全文。
2. **中心化布局 (Centered Display)**：
   - 水平居中 + 垂直居中。让视觉焦点始终固守在屏幕中央。
   - 响应式字体缩放：内容较少时提供更大的字号表现力。
3. **分片展示 (Slide Navigation)**（针对全文）：
   - 统一使用 `---` 对 Markdown 内容进行分页切片。
   - 提供快捷的翻页功能（方向键 `←` / `→`，`PageUp` / `PageDown`，单击鼠标）。
4. **完美承袭 CueMode 现有设施**：
   - 兼容现有的 7 款专业前景色主题 (T 键快速切换)。
   - 继续隐藏不必要的 VS Code UI（侧边栏、状态栏），实现沉浸式授课。
   - 继续使用原有的 Markdown 渲染器，支持代码高亮、表格、加粗等标准语法。

## 技术实现方案

### 1. 新增指令与配置

- 新增 Command：`cuemode.presentationMode` (在 `package.json` 的 `contributes.commands` 中注册，并配置对应的快捷键如 `Ctrl+Shift+L`)。
- 新增 Config 配置项：
  - `cuemode.presentation.autoFitFontSize`: 是否根据文本长短自动缩放字号（布尔值，默认 `true`）。

### 2. Webview 状态改造

在目前的 `WebviewUI` 与 `UiState` 中增加一个 `mode: 'teleprompter' | 'presentation'` 标识。
当 `mode === 'presentation'` 时：

- DOM 结构附加 `.presentation-mode` CSS class。
- 禁用自动滚动逻辑 (`autoScroll`)。
- 隐藏提词器模式特存的组件（如阅读基准线等）。

### 3. CSS 样式设计

在 `src/utils/webviewStyles.ts` 中针对演示模式添加专属样式：

```css
.presentation-mode #content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center; /* 短文本可选居中对齐 */
}
/* 覆盖段落和代码块默认的左对齐，如果需要也可以保持左对齐但外层容器居中 */
.presentation-mode #content > section.slide {
  display: none; /* 隐藏非当前页 */
  width: 100%;
}
.presentation-mode #content > section.slide.active {
  display: block;
  animation: fadeIn 0.3s ease;
}
```

### 4. 文本解析与渲染

如果进入演示模式：

1. **文本预处理**：将文档按照分隔符切分为多个块（Slides Array）。
2. **HTML 包装**：使用现有的 `MarkdownParser` 对每一个数组元素进行解析，将其分别用 `<section class="slide">...</section>` 包裹。
3. **注入通信**：通过 Webview 的 `postMessage` 向前端发送这些 slides。
4. **前端状态存储**：在 Webview 内部的 script 中维护当前 `currentSlideIndex`，侦听键盘与鼠标事件进行前后的索引切换并更新 DOM `active` 状态。

## 迭代计划 (Phases)

| 阶段        | 目标与产出                                                                                                                             |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 1** | **核心静态展示**。<br>实现基础的 `cuemode.presentationMode` 命令，支持选中文字或短文本转化为无滚动的单页垂直全居中展示。适配所有主题。 |
| **Phase 2** | **分页与导航**。<br>实现 Markdown 文档的分页切割，支持键盘事件控制前后翻页（Slide 逻辑）。                                             |
| **Phase 3** | **进阶增强**。<br>提供演讲者视图（双屏情况）、引入动效、自动缩放文本字号、支持页面过渡效果。                                           |

## 结语

“演示模式”将CueMode的边界从“个人录制辅助”拓展到“在线授课与演示互动”。它不需要重新造一个完整的 PPT 轮子，而是充分发挥现有的极简无干扰架构以及 Markdown 渲染能力，极大降低使用者在代码讲解时的准备门槛。
