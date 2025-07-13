# CueMode 开发指南

## 🏗️ 架构概览

CueMode 是一个现代化的 TypeScript VS Code 扩展，专注于性能、国际化、专注模式和可维护性。

### 核心组件

```sh
src/
├── extension.ts           # 主扩展入口点，包含 CueModeExtension 类
├── i18n.ts               # 基于 i18next 的国际化系统
├── types/                 # TypeScript 类型定义
│   └── index.ts          # 核心类型和接口
├── ui/                   # 用户界面组件
│   └── webview.ts        # Webview 管理和 HTML 生成
├── utils/                # 工具模块
│   ├── config.ts         # 配置管理和验证
│   └── theme.ts          # 主题系统，包含 7 个专业主题
├── locales/              # 语言资源文件
│   ├── en.json           # 英文翻译
│   └── zh-CN.json        # 中文翻译
└── test/                 # 测试套件
    ├── runTest.ts        # 测试运行器
    └── suite/            # 测试用例
        ├── extension.test.ts
        ├── i18n.test.ts
        ├── theme.test.ts
        ├── config.test.ts
        └── webview.test.ts
```

### 主要特性

#### 🎨 主题系统

- 7 个专业配色主题：经典、反转、午夜蓝、日落、森林、海洋、玫瑰
- 符合 WCAG AA 标准的色彩对比度（最低 4.5:1 比例）
- 支持在 webview 中使用 `T` 键和在 VS Code 中使用 `Ctrl+Shift+T` 进行实时主题切换
- 持久化主题偏好设置和自动验证
- 无障碍验证和对比度计算

#### ⌨️ 键盘快捷键

**VS Code 快捷键：**

- `Ctrl+Shift+P` (Cmd+Shift+P): 激活 CueMode
- `Ctrl+Shift+T` (Cmd+Shift+T): 更换主题
- `Ctrl+Shift+R` (Cmd+Shift+R): 移除前导空格

**Webview 快捷键：**

- `Space`: 开始/停止自动滚动
- `+/-`: 调整滚动速度
- `T`: 循环切换主题
- `F`: 切换专注模式
- `R`: 切换滚动方向
- `H`: 显示/隐藏帮助
- `Escape`: 退出提词器模式
- 方向键、Page Up/Down、Home/End: 导航

#### 🌐 国际化

- 基于 i18next 的翻译系统，具有类型安全性
- 从 VS Code 环境动态检测语言
- 支持英文和中文（zh-CN），使用 JSON 资源文件
- 可扩展的架构，支持更多语言
- 支持上下文感知翻译和复数形式
- 缺失键检测和回退处理
- UI 元素和错误消息的文化适配

#### 🎭 Webview 架构

- 符合内容安全策略，使用基于 nonce 的脚本加载
- 响应式设计，支持所有屏幕尺寸和移动端优化
- 通过消息传递实现实时内容同步
- 内存高效的 DOM 更新和生命周期管理
- 可配置速度和方向的自动滚动
- 可自定义行高亮和透明度的专注模式
- 交互式帮助系统，包含键盘快捷键参考

### 🎯 专注模式

- 智能文本高亮，提高阅读专注度
- 可配置专注区域行数（1-10 行）
- 可调节非专注文本透明度（0.1-0.8）
- 在 webview 中使用 `F` 键进行切换
- 持久化专注模式偏好设置

## 🛠️ 开发环境

### 前置要求

- Node.js 16.x 或更高版本
- VS Code 1.82.0 或更高版本
- TypeScript 5.1.6

### 设置

```bash
# 克隆并安装
git clone https://github.com/hddevteam/cuemode.git
cd cuemode
npm install

# 开发命令
npm run watch          # 自动编译 TypeScript
npm run compile        # 一次性编译
npm test              # 运行测试套件
npm run lint          # ESLint 验证
npm run package       # 创建 VSIX 包
```

### VS Code 开发

1. 在 VS Code 中打开项目
2. 按 `F5` 启动扩展开发主机
3. 在新窗口中测试扩展功能
4. 使用调试控制台进行日志记录和诊断

## 🧪 测试策略

### 测试覆盖率

- 覆盖所有主要组件的综合测试套件
- 针对扩展激活、配置管理和主题系统的单元测试
- 命令工作流和 webview 功能的集成测试
- 使用模拟 VS Code 环境的 i18n 系统测试
- 主题切换验证和无障碍合规性
- 配置验证和错误处理测试

### 运行测试

```bash
npm test                    # 完整测试套件
npm run test:unit          # 仅单元测试（Mocha）
npm run test:integration   # 集成测试（VS Code 测试运行器）
npm run pretest            # 测试前编译和检查
```

## 📦 构建和部署

### 包创建

```bash
npm run package
```

这将创建一个准备发布到 VS Code 市场的 `.vsix` 文件。

### 发布到市场

```bash
vsce publish --pat YOUR_PERSONAL_ACCESS_TOKEN
```

### 版本管理

我们遵循语义化版本控制（semver）：

- **主版本** (x.0.0): 破坏性变更
- **次版本** (x.y.0): 新功能，向后兼容
- **修订版** (x.y.z): 错误修复，向后兼容

## 🔧 配置架构

### 扩展设置

```json
{
  "cuemode.colorTheme": {
    "type": "string",
    "enum": ["classic", "inverted", "midnightBlue", "sunset", "forest", "ocean", "rose"],
    "default": "classic"
  },
  "cuemode.maxWidth": {
    "type": "number",
    "default": 800,
    "minimum": 200,
    "maximum": 2000
  },
  "cuemode.fontSize": {
    "type": "number",
    "default": 24,
    "minimum": 8,
    "maximum": 100
  },
  "cuemode.lineHeight": {
    "type": "number",
    "default": 1.5,
    "minimum": 0.5,
    "maximum": 5
  },
  "cuemode.padding": {
    "type": "number",
    "default": 10,
    "minimum": 0,
    "maximum": 100
  },
  "cuemode.scrollSpeed": {
    "type": "number",
    "default": 0.1,
    "minimum": 0.01,
    "maximum": 1
  },
  "cuemode.startingPosition": {
    "type": "number",
    "default": 50,
    "minimum": 0,
    "maximum": 100
  },
  "cuemode.focusMode": {
    "type": "boolean",
    "default": false
  },
  "cuemode.focusOpacity": {
    "type": "number",
    "default": 0.3,
    "minimum": 0.1,
    "maximum": 0.8
  },
  "cuemode.focusLineCount": {
    "type": "number",
    "default": 3,
    "minimum": 1,
    "maximum": 10
  }
}
```

### 命令定义

```json
{
  "commands": [
    {
      "command": "cuemode.cueMode",
      "title": "%cuemode.cueMode%"
    },
    {
      "command": "cuemode.changeTheme",
      "title": "%cuemode.changeTheme%"
    },
    {
      "command": "cuemode.removeLeadingSpaces",
      "title": "%cuemode.removeLeadingSpaces%"
    },
    {
      "command": "cuemode.toggleFocusMode",
      "title": "%cuemode.toggleFocusMode%"
    }
  ]
}
```

## 🎯 性能优化

### 内存管理

- 正确释放事件监听器
- 高效的 webview 生命周期管理
- 最小化 DOM 操作
- 优化主题切换

### 实时更新

- 防抖的文本更改处理器
- 选择性 DOM 更新
- 基于 CSS 的平滑过渡动画
- 高效的前导空格移除字符串处理

## 🔒 安全考虑

### 内容安全策略

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'none'; 
               script-src 'nonce-{nonce}'; 
               style-src 'unsafe-inline';">
```

### 输入验证

- webview 中的用户输入清理
- 验证配置值
- 扩展和 webview 之间的安全消息传递

## 🌍 国际化实现

### 基于 I18next 的系统

```typescript
// 使用单例模式的 I18nManager 类
export class I18nManager {
  private i18n: typeof i18next;
  
  public async initialize(): Promise<void> {
    await this.i18n.init({
      lng: this.detectLanguage(),
      fallbackLng: 'en',
      resources: {
        en: { translation: await this.loadTranslationResource('en') },
        'zh-CN': { translation: await this.loadTranslationResource('zh-CN') }
      },
      interpolation: { escapeValue: false },
      pluralSeparator: '_',
      missingKeyHandler: (lng, ns, key, fallbackValue) => {
        console.warn(`Missing translation: ${key} in ${lng}`);
        return fallbackValue || key;
      }
    });
  }
}
```

### 语言检测

```typescript
private detectLanguage(): string {
  // VS Code 环境检测
  if (vscode.env && vscode.env.language) {
    return vscode.env.language.startsWith('zh') ? 'zh-CN' : 'en';
  }
  
  // 环境变量回退
  if (process.env.VSCODE_NLS_CONFIG) {
    const nlsConfig = JSON.parse(process.env.VSCODE_NLS_CONFIG);
    return nlsConfig.locale?.startsWith('zh') ? 'zh-CN' : 'en';
  }
  
  return 'en';
}
```

### 翻译结构

```json
{
  "commands": {
    "title": "提词器模式",
    "changeTheme": "更换提词器主题",
    "removeLeadingSpaces": "移除前导空格",
    "toggleFocusMode": "切换专注模式"
  },
  "notifications": {
    "activated": "提词器模式已激活",
    "themeChanged": "主题已更改为 {{theme}}",
    "spacesRemoved": "已从 {{count}} 行移除前导空格",
    "spacesRemoved_plural": "已从 {{count}} 行移除前导空格",
    "focusModeEnabled": "专注模式已启用",
    "focusModeDisabled": "专注模式已禁用"
  },
  "themes": {
    "classic": "经典",
    "inverted": "反转",
    "midnightBlue": "午夜蓝",
    "sunset": "日落",
    "forest": "森林",
    "ocean": "海洋",
    "rose": "玫瑰"
  }
}
```

## 🚀 未来增强

### 计划功能

- 用户自定义颜色的额外主题自定义选项
- 段落级高亮的增强专注模式
- 支持更多语言（法语、德语、日语）
- 与演示工具和流媒体软件的集成
- 眼动追踪集成的自动滚动
- 免提操作的语音控制

### 技术改进

- Webview 优化
- 增强测试覆盖率
- 性能监控
- 错误报告系统

## 📊 性能指标

### 当前基准

- 扩展激活: < 100ms（包括 i18n 初始化）
- 主题切换: < 50ms（使用 CSS 变量更新）
- 配置更新: < 10ms 延迟
- 内存使用: < 15MB 活动状态（包括 i18next 资源）
- Webview 渲染: 10,000+ 字符文档 < 200ms

### 优化目标

- 保持 < 100ms 激活时间
- 零内存泄漏
- 流畅的 60fps 动画
- 支持 10,000+ 字符文档

## 🐛 调试指南

### 常见问题

1. **扩展未激活**: 检查 VS Code 版本兼容性（需要 1.82.0+）
2. **主题未切换**: 验证 webview 通信和消息传递
3. **i18n 不工作**: 检查语言检测逻辑和 JSON 资源加载
4. **专注模式不工作**: 验证配置验证和 CSS 应用
5. **性能问题**: 分析内存使用、事件处理器和 webview 生命周期
6. **配置错误**: 检查设置验证和回退处理

### 调试工具

- VS Code 扩展开发主机
- webview 的浏览器开发者工具
- 扩展日志的 VS Code 输出面板
- 后端逻辑的 Node.js 调试器

## 📈 分析和监控

### 使用指标

- 命令调用频率
- 主题偏好分布
- 用户参与模式
- 错误率监控

### 性能跟踪

- 扩展加载时间
- 内存消耗
- CPU 使用模式
- 用户满意度评分

---

有关详细的 API 文档，请查看源文件中的内联 TypeScript 文档。

有关贡献指南，请参阅 [CONTRIBUTING.zh-CN.md](CONTRIBUTING.zh-CN.md)。