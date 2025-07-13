# CueMode 扩展测试

本文档描述了 CueMode VS Code 扩展的测试设置。

## 测试结构

测试套件分为以下几个类别：

### 1. 扩展集成测试 (`extension.test.ts`)

- 测试主要扩展的激活和停用
- 验证扩展存在性和命令注册
- 测试 `cuemode.cueMode` 命令的可用性
- 验证配置可访问性
- 测试 CueModeExtension 类功能

### 2. 配置管理器测试 (`config.test.ts`)

- 测试 ConfigManager 类方法
- 验证 `getSafeConfig()` 返回正确的配置结构
- 测试配置属性类型（字符串、数字、布尔值）
- 验证颜色主题值是否符合支持的主题
- 测试配置验证逻辑：
  - fontSize、maxWidth、lineHeight、padding 范围
  - scrollSpeed、startingPosition、focusOpacity 值
  - focusLineCount 和 focusMode 设置

### 3. 主题管理器测试 (`theme.test.ts`)

- 测试 ThemeManager 类功能
- 验证所有 7 种支持的主题：`classic`、`inverted`、`midnightBlue`、`sunset`、`forest`、`ocean`、`rose`
- 测试主题颜色验证（backgroundColor、textColor）
- 验证 CSS 颜色格式合规性
- 测试无效主题名称的回退行为（返回经典主题）
- 验证主题结构和属性存在性

### 4. 国际化测试 (`i18n.test.ts`)

- 测试基于 i18next 的国际化系统
- 验证 `initializeI18n()` 初始化
- 测试使用 `t()` 函数的消息键解析
- 测试带变量的插值功能
- 验证缺失键的回退行为
- 测试英文和中文（`zh-CN`）之间的语言切换
- 验证 `changeLanguage()` 和 `getCurrentLanguage()` 函数

### 5. WebView 管理器测试 (`webview.test.ts`)

- 测试 WebViewManager 类
- 验证 webview 创建和生命周期管理
- 测试 `isActive()`、`create()`、`close()` 和 `updateConfig()` 方法
- 验证 webview 内容生成和 HTML 结构
- 测试配置更新和主题变更
- 验证 CSS 生成和样式注入
- 测试滚动功能和内容处理

## 运行测试

### 前置条件

确保已安装所有依赖：

```bash
npm install
```

### 编译 TypeScript

运行测试前，先编译 TypeScript 代码：

```bash
npm run compile
```

### 运行所有测试

```bash
npm test
```

### 运行集成测试

```bash
npm run test:integration
```

### 运行单元测试

```bash
npm run test:unit
```

### 运行特定测试文件

可以使用 Mocha 直接运行特定测试套件：

```bash
# 仅运行配置测试
npx mocha out/test/suite/config.test.js

# 仅运行主题测试
npx mocha out/test/suite/theme.test.js

# 仅运行国际化测试
npx mocha out/test/suite/i18n.test.js

# 仅运行 webview 测试
npx mocha out/test/suite/webview.test.js

# 仅运行扩展测试
npx mocha out/test/suite/extension.test.js
```

## 测试配置

### 测试运行器设置

- **框架**：使用 TDD 接口的 Mocha
- **超时**：每个测试 10,000ms
- **报告器**：带彩色输出的 Spec 报告器
- **文件模式**：测试目录中的 `**/**.test.js`

### VS Code 测试环境

- 使用 `@vscode/test-electron` 进行 VS Code 集成测试
- 使用 `--disable-extensions` 运行以避免冲突
- 扩展开发路径设置为项目根目录
- 测试在独立的 VS Code 实例中运行

## 测试覆盖

测试覆盖以下领域：

### 核心功能

- 扩展激活和停用
- 命令注册 (`cuemode.cueMode`)
- 配置管理和验证
- 错误处理和回退行为

### 用户界面

- WebView 创建和管理
- 主题应用和 CSS 生成
- 内容渲染和 HTML 结构
- 配置更新和实时更改

### 国际化

- 使用 i18next 的消息翻译
- 区域设置切换（英文/中文）
- 带变量的插值
- 缺失键的回退处理

### 配置验证

- 所有配置属性的类型检查
- 数值的范围验证
- 颜色主题的枚举验证
- 默认值处理

### 主题系统

- 所有 7 种支持的颜色主题
- CSS 颜色格式验证
- 主题结构验证
- 回退主题处理

## 测试指南

添加新测试时：

1. **遵循现有结构** - 将测试放在适当的类别文件中
2. **使用描述性测试名称** - 测试名称应清楚地描述被测试的内容
3. **测试正面和负面情况** - 包含有效和无效输入的测试
4. **模拟外部依赖** - 必要时使用 VS Code API 模拟
5. **测试后清理** - 使用 `suiteTeardown()` 进行适当清理
6. **正确初始化** - 使用 `suiteSetup()` 进行测试初始化

## 常见测试模式

### 测试 VS Code 扩展

```typescript
suite('Extension Integration Tests', () => {
  test('Extension should activate', async () => {
    const ext = vscode.extensions.getExtension('luckyXmobile.cuemode');
    assert.ok(ext);
    await ext.activate();
    assert.strictEqual(ext.isActive, true);
  });
});
```

### 测试配置

```typescript
suite('ConfigManager Tests', () => {
  test('getSafeConfig should return valid configuration', () => {
    const config = ConfigManager.getSafeConfig();
    assert.ok(config);
    assert.strictEqual(typeof config.fontSize, 'number');
  });
});
```

### 测试主题

```typescript
suite('ThemeManager Tests', () => {
  test('getTheme should return valid theme', () => {
    const theme = ThemeManager.getTheme('classic');
    assert.ok(theme.backgroundColor);
    assert.ok(theme.textColor);
  });
});
```

### 测试国际化

```typescript
suite('I18n Tests', () => {
  test('t should handle interpolation', () => {
    const message = t('notifications.themeChanged', { theme: 'Dark' });
    assert.ok(message.includes('Dark'));
  });
});
```

## 调试测试

在 VS Code 中调试测试：

1. 在测试文件中设置断点
2. 使用调试控制台检查变量
3. 使用 VS Code 的集成测试运行器运行测试
4. 使用 `console.log()` 进行额外的调试输出

## 持续集成

测试设计为在 CI 环境中运行：

- 无需用户交互
- 每次测试后正确清理
- 每个测试 10 秒超时
- 优雅处理缺失依赖

## 添加新测试

添加新功能时：

1. **测试先行**（TDD 方法）
2. **确保全面覆盖**所有代码路径
3. **测试错误条件**和边界情况
4. **验证正确清理**和资源处置
5. **更新此文档**（如需要）

## 故障排除

### 常见问题

1. **测试失败，提示"Extension not found"**
   - 确保扩展已编译：`npm run compile`
   - 检查扩展 ID 匹配：`luckyXmobile.cuemode`

2. **WebView 测试失败**
   - 验证模拟上下文设置正确
   - 检查 VS Code 测试环境初始化

3. **配置测试失败**
   - 确保默认配置值有效
   - 检查验证逻辑一致性

4. **主题测试失败**
   - 验证所有主题名称正确
   - 检查 CSS 颜色格式验证

5. **国际化测试失败**
   - 确保语言环境文件已复制：`npm run copy-resources`
   - 检查 i18next 初始化

### 获得帮助

如果遇到测试问题：

1. 查看 VS Code 扩展开发文档
2. 查看类似扩展的测试设置
3. 创建包含详细错误信息的 issue
4. 验证 TypeScript 编译成功
