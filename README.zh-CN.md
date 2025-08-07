# CueMode - 开发者专业提词器

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/luckyXmobile.cuemode?style=flat-square&color=blue)](https://marketplace.visualstudio.com/items?itemName=luckyXmobile.cuemode)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/luckyXmobile.cuemode?style=flat-square&color=green)](https://marketplace.visualstudio.com/items?itemName=luckyXmobile.cuemode)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/luckyXmobile.cuemode?style=flat-square&color=orange)](https://marketplace.visualstudio.com/items?itemName=luckyXmobile.cuemode)
[![GitHub](https://img.shields.io/github/license/hddevteam/cuemode?style=flat-square)](https://github.com/hddevteam/cuemode/blob/main/LICENSE)
[![GitHub Pages](https://img.shields.io/badge/docs-GitHub%20Pages-blue?style=flat-square)](https://hddevteam.github.io/cuemode/)

> **[English README](./README.md) | [GitHub Pages](https://hddevteam.github.io/cuemode/)**

**将 VS Code 转换为专业提词器。** 非常适合编程直播、技术演示、教育视频和专业内容创作。具有即时主题切换、增强聚焦模式、自动滚屏控制和无干扰阅读体验。

![提词器演示](./images/demo.gif)

## 🎯 什么是 CueMode？

CueMode 是下一代提词器扩展，可将您的 VS Code 编辑器转换为专业的提词器解决方案。现在具有**即时主题循环**、**增强聚焦模式**、**扩展国际化支持**和**专业级功能**，专为开发者、教育工作者和内容创作者设计。

**✨ 2.3 版本功能：**

- **📝 选择性Markdown解析** - **新功能！** 智能markdown格式化演示，支持D键切换
- **📏 行间距调整** - **新功能！** 专业行距控制，支持L键循环切换（1.0、1.2、1.5、1.8、2.0）
- **🪞 M 键镜像翻转** - 专业的水平文本镜像功能，适用于提词器硬件设备
- **📍 智能状态指示器** - 具有智能定位功能的视觉反馈系统，避免 UI 冲突
- **🎨 T 键主题循环** - 演示期间即时切换所有 7 个专业主题
- **🔍 增强 F 键聚焦模式** - 智能渐变模糊算法，可配置聚焦行数（1-10行）和不透明度（0.1-0.8），提供卓越集中力
- **⚡ 增强命令** - 快速主题更改和文本预处理
- **📱 智能通知** - 非干扰性状态栏反馈
- **🌐 扩展国际化支持** - 支持 6 种语言：中文、英文、德文、法文、日文、韩文
- **🛠️ TypeScript 架构** - 健壮、可维护的代码库
- **🧪 全面测试** - 82 个测试用例确保可靠性

**核心提词器功能：**

- **自动滚动文本** - 流畅、可控的滚动速度，自然阅读
- **大字体显示** - 针对远距离阅读和摄像优化
- **高对比度显示** - 在任何光照条件下都清晰可见
- **隐形控制** - 录制/演示期间最小化 UI 干扰
- **键盘快捷键** - 专业提词器控制（开始/停止、速度调整）

只需选择您的脚本文本或打开演示笔记，从命令面板激活"提词器模式"，然后自信地开始演示。

## ✨ 专业提词器功能

CueMode 为现代内容创作者提供专业的提词器功能：

### 📺 **专业提词器控制**

- **自动滚屏功能** - 流畅、可定制的滚动速度
- **空格键控制** - 一键开始/停止滚动
- **速度调整** - 使用 +/- 键实时控制速度
- **方向切换** - 使用 R 键反向滚动
- **手动导航** - 方向键精确定位
- **🆕 T 键主题循环** - 演示期间即时更换主题

### 🎨 **优化显示**

- **大字体** - 完美的远距离阅读
- **居中布局** - 摄像工作的自然眼部运动
- **高对比度主题** - 任何光照条件下都清晰可见
- **极简界面** - 不干扰录制的隐藏控件

### 🎭 **专业主题**

- **经典** - 传统提词器黑底白字
- **反转** - 明亮环境下的白底黑字
- **午夜蓝** - 专业演播室外观
- **日落** - 温暖舒适的阅读体验
- **森林** - 长时间使用护眼
- **海洋** - 放松演示的平静蓝色
- **玫瑰** - 精致内容的优雅主题

### ⚙️ **提词器设置**

- **滚动速度** - 微调阅读节奏（0.1-5.0 范围）
- **字体大小** - 针对阅读距离优化（12-72pt）
- **行高** - 控制文本间距舒适度（1.0-3.0em）
- **内容宽度** - 设置最佳阅读宽度（400-1200px）
- **起始位置** - 定位文本以舒适阅读
- **内边距** - 根据设置调整边距
- **聚焦模式** - 增强渐变模糊集中模式（新！）

### 🚀 **完美的提词器使用场景**

- **YouTube 视频** - 在保持眼神接触的同时自然阅读脚本
- **直播流媒体** - 编程教程和技术讲座的流畅传达
- **视频教程** - 准备内容的专业演示
- **在线课程** - 自信的教育内容传达
- **网络研讨会** - 带脚本支持的专业演讲
- **产品演示** - 提词器辅助的一致信息传达
- **屏幕录制** - 专业视频内容
- **代码审查** - 专注重要细节
- **演示文稿** - 展示您的工作
- **专注开发** - 减少干扰

## 🚀 快速开始 - 提词器设置

### 安装

1. 打开 VS Code
2. 转到扩展（Ctrl+Shift+X / Cmd+Shift+X）
3. 搜索"CueMode"或"提词器"
4. 点击安装

**或者从 VS Code Marketplace 直接安装：**
[CueMode - Professional Teleprompter](https://marketplace.visualstudio.com/items?itemName=luckyXmobile.cuemode)

### 基本提词器使用

1. **准备脚本** - 创建或打开包含演示内容的文本文件
2. **选择脚本文本**（可选 - 如果未选择，将使用整个文件）
3. **激活提词器** - 使用 Ctrl+Shift+P（Mac 上 Cmd+Shift+P）并搜索"提词器模式"
4. **开始阅读** - 按空格键开始自动滚动
5. **演示时控制**：
   - **空格键**：开始/暂停自动滚动
   - **T 键**：**增强！** 即时切换所有 7 个主题
   - **F 键**：**新功能！** 开关增强聚焦模式和渐变模糊
   - **+/-**：实时调整阅读速度
   - **R 键**：反向滚动方向
   - **方向键**：手动导航

### 专业提词器快捷键

**🎯 主要控制：**

- **空格键** - 开始/暂停自动滚动（主要控制）
- **T 键** - **增强！** 即时循环所有 7 个专业主题
- **F 键** - **新功能！** 开关增强聚焦模式和智能渐变模糊
- **M 键** - **新功能！** 开关镜像翻转模式，适用于提词器硬件
- **+/-** - 实时增加/减少滚动速度
- **R 键** - 切换滚动方向（上/下）

**📱 导航：**

- **方向键** - 手动导航
- **Page Up/Down** - 快速手动滚动
- **Home/End** - 跳转到开始/结束

**⚙️ 高级控制：**

- **Ctrl+Shift+T**（Mac 上 Cmd+Shift+T）- **新功能！** 打开主题选择菜单
- **Ctrl+Shift+R**（Mac 上 Cmd+Shift+R）- **新功能！** 从文本中移除前导空格
- **H 键** - 显示/隐藏帮助面板
- **Esc 键** - 退出提词器模式

## ⚙️ 提词器配置

### 访问设置

1. 打开 VS Code 设置（Ctrl+, / Cmd+,）
2. 搜索"cuemode"
3. 根据需要调整提词器设置

### 关键设置

- **颜色主题** - 选择 7 个专业主题之一
- **字体大小** - 根据阅读距离调整（推荐 24-48pt）
- **滚动速度** - 设置舒适的阅读节奏（推荐 0.1-0.3）
- **最大宽度** - 控制文本行长度（推荐 800-1200px）
- **起始位置** - 在屏幕上定位内容（推荐 30-50%）
- **聚焦模式** - 启用增强集中模式（新！）
- **聚焦不透明度** - 调整模糊强度（0.1-0.8，默认 0.3）
- **聚焦行数** - 设置聚焦区域大小（1-10 行，默认 3 行）

## 🎯 专业使用技巧

### 📺 **视频录制设置**

1. **选择高对比度主题**（经典或反转）以获得最佳可读性
2. **增加字体大小**（32-48pt）以便远距离阅读
3. **调整滚动速度**以匹配您的自然说话节奏
4. **使用 T 键**在录制期间无缝切换主题
5. **启用聚焦模式**使用 F 键增强对当前内容的集中力

### 🎤 **直播流媒体技巧**

1. **练习快捷键**，特别是空格键、T 键和 F 键聚焦模式
2. **预设内容**，移除前导空格以获得清洁的显示
3. **使用 H 键**快速访问帮助（如果忘记快捷键）
4. **测试主题和聚焦模式**在您的照明设置下找到最佳可见性
5. **自定义聚焦设置**以匹配您的阅读偏好

### 📚 **教育内容**

1. **将复杂代码分解**为可管理的块
2. **使用较慢的滚动速度**进行详细解释
3. **利用手动导航**（方向键）突出特定部分
4. **准备备用主题**以适应不同的内容类型
5. **使用聚焦模式**在解释过程中突出关键概念

## 🆕 新功能详解

### 🔍 增强 F 键聚焦模式

在提词器模式下，只需按 F 键即可开关增强聚焦模式：

- **智能渐变模糊**：高级算法提供带有缓冲区的平滑阅读体验
- **可配置聚焦区域**：调整聚焦行数（1-10 行，默认 3 行）
- **可调节不透明度**：设置模糊不透明度（0.1-0.8，默认 0.3）
- **视觉聚焦指示器**：美丽的样式显示当前活跃阅读区域
- **实时更新**：设置立即生效，无需重启

### 🎨 T 键主题循环

在提词器模式下，只需按 T 键即可循环浏览所有主题：

- 经典 → 反转 → 午夜蓝 → 日落 → 森林 → 海洋 → 玫瑰 → 经典...
- 状态栏显示当前主题名称
- 设置自动保存

### ⚡ 增强命令

- **Ctrl+Shift+T**：打开主题选择菜单（带预览）
- **Ctrl+Shift+R**：智能移除前导空格和缩进

### 📱 智能通知

- 所有通知现在显示在状态栏中
- 2-3 秒后自动消失
- 不会打断您的工作流程

### 🌐 扩展国际化支持

- 支持 6 种语言：中文、英文、德文、法文、日文、韩文
- 专业提词器术语本地化
- 从 VS Code 环境自动语言检测

## 🤝 贡献

我们欢迎贡献！请查看我们的[贡献指南](CONTRIBUTING.md)了解详情。

开发设置请参考 [DEVELOPMENT.zh-CN.md](DEVELOPMENT.zh-CN.md)。

## 📝 许可证

此项目根据 [MIT 许可证](LICENSE) 获得许可。

## 🤝 参与贡献

我们非常欢迎您的贡献！无论是报告错误、建议新功能、改进文档还是提交代码，都是对项目的宝贵支持。

详细信息请查看：

- [贡献指南 (中文)](CONTRIBUTING.zh-CN.md)
- [Contributing Guide (English)](CONTRIBUTING.md)
- [开发指南 (中文)](DEVELOPMENT.zh-CN.md)
- [Development Guide (English)](DEVELOPMENT.md)

## 🔗 链接

- **VS Code Marketplace**: [CueMode](https://marketplace.visualstudio.com/items?itemName=luckyXmobile.cuemode)
- **GitHub 仓库**: [hddevteam/cuemode](https://github.com/hddevteam/cuemode)
- **项目文档**: [GitHub Pages](https://hddevteam.github.io/cuemode/zh-cn.html)
- **English Version**: [README.md](README.md)
- **开发指南**: [DEVELOPMENT.zh-CN.md](DEVELOPMENT.zh-CN.md)
- **路线图**: [ROADMAP.zh-CN.md](ROADMAP.zh-CN.md)
- **问题报告**: [GitHub Issues](https://github.com/hddevteam/cuemode/issues)

## 🌟 支持项目

如果 CueMode 帮助了您的内容创作，请考虑：

- ⭐ 在 GitHub 上给我们加星
- 📝 在 VS Code Marketplace 上留下评价
- 🐛 报告问题或建议功能
- 🤝 贡献代码或文档

---

**让您的演示更专业，让您的内容更出色！** 🎬✨
