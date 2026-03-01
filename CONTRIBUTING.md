# Contributing to CueMode - Professional Teleprompter

Thank you for your interest in contributing to CueMode! This document provides guidelines and information for contributors.

## 🎯 Project Overview

CueMode is a professional teleprompter extension for VS Code, designed specifically for content creators, educators, and developers who create video content. The extension transforms VS Code into a professional teleprompting tool with auto-scroll functionality, customizable themes, and distraction-free reading experience optimized for video recording and live presentations.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **VS Code** (v1.82.0 or higher)
- **Git**

### Setting Up the Development Environment

For detailed setup instructions, please see our comprehensive development guide:

📖 **[Development Guide (DEVELOPMENT.md)](DEVELOPMENT.md)**
🇨🇳 **[开发指南 (project_docs/0-development.zh-CN.md)](project_docs/0-development.zh-CN.md)**

Quick start:

```bash
git clone https://github.com/hddevteam/cuemode.git
cd cuemode
npm install
npm run compile
```

## 🔧 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow the coding guidelines below
- Write tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
npm test
npm run lint
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

## 📋 Coding Guidelines

### Code Style

- Use **2 spaces** for indentation
- Follow **ESLint** configuration
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and interfaces
- Add **JSDoc** comments for public functions

### File Organization

See detailed architecture in [DEVELOPMENT.md](DEVELOPMENT.md#architecture-overview).

### Git Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or updates
- `chore:` - Build process or auxiliary tool changes

Examples:

```
feat: add new color theme support
fix: resolve webview rendering issue
docs: update installation instructions
```

## 🧪 Testing

For comprehensive testing guidelines, see [DEVELOPMENT.md](DEVELOPMENT.md#testing-strategy).

### Quick Testing

```bash
npm test                 # Full test suite
npm run lint            # Code quality checks
```

## 📖 Documentation

Refer to our development documentation:

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Complete development guide
- **[project_docs/0-development.zh-CN.md](project_docs/0-development.zh-CN.md)** - 中文开发指南

### Documentation Requirements

- Add JSDoc comments for all public functions
- Update README.md for user-facing changes
- Update development guide for architectural changes

## 🎨 UI/UX Guidelines

### WebView Design

- Maintain clean, minimal interface
- Ensure high contrast for readability
- Support responsive design for different screen sizes
- Follow VS Code design principles

### Color Themes

- Ensure accessibility compliance
- Test with different VS Code themes
- Maintain consistent visual hierarchy

## 🐛 Bug Reports

When reporting bugs:

1. Use the bug report template
2. Include steps to reproduce
3. Provide environment information
4. Add screenshots if applicable

## 💡 Feature Requests

When requesting features:

1. Use the feature request template
2. Describe the use case clearly
3. Consider implementation complexity
4. Provide mockups if applicable

## 📊 Performance Considerations

See detailed performance guidelines in [DEVELOPMENT.md](DEVELOPMENT.md#performance-optimization).

## 🚫 What We Don't Accept

- Changes that break existing functionality
- Code without tests
- Undocumented public APIs
- Performance regressions
- Features that significantly increase bundle size

## 📞 Getting Help

- 💬 **Discussions**: Use GitHub Discussions for questions
- 🐛 **Issues**: Report bugs using issue templates
- 📧 **Email**: Contact maintainers for security issues

## 📄 License

By contributing to CueMode, you agree that your contributions will be licensed under the same license as the project.

## 🎉 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- GitHub contributor statistics

## 🔄 Review Process

1. **Automated Checks**: All PRs must pass automated tests
2. **Code Review**: At least one maintainer review required
3. **Testing**: Manual testing for UI/UX changes
4. **Documentation**: Verify documentation is updated

## 📋 Checklist for Contributors

Before submitting your PR:

- [ ] Code follows project style guidelines
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] PR template is filled out completely
- [ ] Changes are tested manually
- [ ] No console errors or warnings

Thank you for contributing to CueMode! 🚀
