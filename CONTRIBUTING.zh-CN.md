# CueMode 贡献指南

欢迎为 CueMode 2.0 - 专业提词器扩展做出贡献！我们很高兴有您的参与。

## 🤝 贡献方式

### 🐛 报告错误
- 使用 [GitHub Issues](https://github.com/hddevteam/cuemode/issues) 报告错误
- 提供详细的重现步骤
- 包含您的环境信息（VS Code 版本、操作系统等）

### 💡 建议新功能
- 在 GitHub Issues 中提出功能建议
- 详细描述功能的用途和好处
- 考虑现有功能的兼容性

### 📝 改进文档
- 修正文档中的错误或不清楚的地方
- 添加使用示例和教程
- 翻译文档到其他语言

### 💻 代码贡献
- 修复错误
- 实现新功能
- 性能优化
- 测试覆盖率提升

## 🛠️ 开发环境设置

### 前提条件
- Node.js 16.x 或更高版本
- npm 7.x 或更高版本
- VS Code 1.82.0 或更高版本
- Git

### 克隆和安装
```bash
# 克隆仓库
git clone https://github.com/hddevteam/cuemode.git
cd cuemode

# 安装依赖
npm install

# 编译项目
npm run compile

# 运行测试
npm test
```

### 开发工作流
```bash
# 启动监视模式（自动编译）
npm run watch

# 运行 ESLint 检查
npm run lint

# 运行特定测试
npm run test:unit

# 构建发布包
npm run package
```

## 📋 项目结构

```
cuemode/
├── src/                    # TypeScript 源代码
│   ├── extension.ts       # 主扩展文件
│   ├── types/             # TypeScript 类型定义
│   ├── ui/                # 用户界面组件
│   ├── utils/             # 工具函数
│   └── i18n/              # 国际化文件
├── test/                  # 测试文件
├── docs/                  # GitHub Pages 文档
├── images/                # 图标和截图
├── package.json           # 包配置
├── tsconfig.json          # TypeScript 配置
└── README.md              # 项目说明
```

## 🎯 编码规范

### TypeScript 指南
- 使用严格的 TypeScript 模式
- 为所有公共 API 提供类型定义
- 避免使用 `any` 类型
- 使用 JSDoc 注释记录函数和类

### 代码风格
- 使用 2 个空格缩进
- 使用单引号字符串
- 行末不要分号（除非必要）
- 函数和变量使用驼峰命名

### 示例代码
```typescript
/**
 * 管理提词器主题的工具类
 */
export class ThemeManager {
  private currentTheme: ColorTheme = 'classic';

  /**
   * 切换到下一个主题
   * @returns 新的主题名称
   */
  public cycleTheme(): ColorTheme {
    const themes = ['classic', 'inverted', 'midnightBlue'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.currentTheme = themes[nextIndex];
    return this.currentTheme;
  }
}
```

## 🧪 测试指南

### 测试类型
- **单元测试**: 测试单个函数和类
- **集成测试**: 测试组件间的交互
- **端到端测试**: 测试完整的用户工作流

### 运行测试
```bash
# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 生成覆盖率报告
npm run test:coverage
```

### 编写测试
```typescript
import { describe, it, expect } from 'mocha';
import { ThemeManager } from '../src/utils/theme';

describe('ThemeManager', () => {
  it('should cycle through themes correctly', () => {
    const themeManager = new ThemeManager();
    const firstTheme = themeManager.cycleTheme();
    const secondTheme = themeManager.cycleTheme();
    
    expect(firstTheme).to.not.equal(secondTheme);
  });
});
```

## 🌐 国际化指南

### 添加新的文本
1. 在 `src/i18n/en.ts` 中添加英文文本
2. 在 `src/i18n/zh-cn.ts` 中添加中文翻译
3. 更新 `src/i18n/index.ts` 中的类型定义

### 使用 i18n
```typescript
import { I18n } from '../i18n';

// 获取本地化文本
const message = I18n.t('notification.activated');

// 带参数的本地化文本
const messageWithParam = I18n.t('notification.themeChanged', themeName);
```

## 📦 提交指南

### 提交信息格式
使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
type(scope): description

[optional body]

[optional footer]
```

### 提交类型
- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例提交信息
```
feat(theme): add T key for instant theme cycling

- Add T key handler in webview
- Implement cycleTheme command
- Update help panel with new shortcut
- Add status bar notification for theme changes

Closes #123
```

## 🔄 Pull Request 流程

### 准备工作
1. Fork 项目到您的 GitHub 账户
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 进行您的修改
4. 添加或更新相关测试
5. 确保所有测试通过
6. 更新文档（如需要）

### 提交 PR
1. 将您的分支推送到 fork 的仓库
2. 在 GitHub 上创建 Pull Request
3. 填写 PR 模板中的所有信息
4. 等待代码审查

### PR 审查流程
- 自动化测试必须通过
- 至少需要一位维护者的审查
- 解决所有评审意见
- 确保文档是最新的

## 🚀 发布流程

### 版本号规则
我们遵循 [Semantic Versioning](https://semver.org/)：
- **主版本号**: 不兼容的 API 修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

### 发布检查清单
- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] CHANGELOG.md 已更新
- [ ] 版本号已更新
- [ ] GitHub Release 已创建

## 🎯 贡献目标

### 短期目标
- 提高测试覆盖率到 95%
- 完善中文文档
- 修复已知问题

### 长期目标
- 添加更多语言支持
- 增强可访问性
- 性能优化

## 💬 交流渠道

### GitHub
- **Issues**: 错误报告和功能请求
- **Discussions**: 一般讨论和问题
- **Wiki**: 深度文档和指南

### 代码审查
- 保持代码简洁易读
- 提供有意义的变量和函数名
- 添加必要的注释
- 考虑性能影响

## 🏆 贡献者识别

我们会在以下地方识别贡献者：
- README.md 中的贡献者列表
- 发布说明中的感谢
- GitHub 贡献者页面

## 📋 问题标签说明

- `bug`: 错误报告
- `enhancement`: 功能改进
- `documentation`: 文档相关
- `good first issue`: 适合新贡献者
- `help wanted`: 需要帮助
- `priority: high`: 高优先级
- `i18n`: 国际化相关

## ✅ 贡献清单

在提交贡献前，请确认：

- [ ] 代码遵循项目编码规范
- [ ] 添加了必要的测试
- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] 提交信息符合规范
- [ ] PR 描述清晰完整

## 🙏 感谢

感谢您考虑为 CueMode 做出贡献！每一个贡献都让这个项目变得更好。

如果您有任何问题，请随时通过 [GitHub Issues](https://github.com/hddevteam/cuemode/issues) 或 [GitHub Discussions](https://github.com/hddevteam/cuemode/discussions) 联系我们。

---

**一起让 CueMode 成为最好的提词器工具！** 🎬✨
