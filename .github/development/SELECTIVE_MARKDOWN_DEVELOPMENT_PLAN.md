# Selective Markdown Parsing Feature Development Plan

## 📋 Overview

This document outlines the development plan for implementing the Selective Markdown Parsing feature for CueMode VS Code Extension (Issue #4). The feature enables configurable markdown syntax parsing and rendering in teleprompter mode, allowing users to choose which markdown elements to display while maintaining the clean, distraction-free reading experience.

## 🎯 Requirements Analysis

### User Story

As a content creator using CueMode for presentations and video recording, I need the ability to selectively parse markdown syntax in my scripts so that I can maintain proper formatting (headers, emphasis, lists) while having control over which elements are rendered to avoid visual clutter during recording.

### Extended Feature Justification

**Tables** - Essential for professional presentations involving data, pricing, comparisons
**Task Lists** - Valuable for tutorials, project demonstrations, and checklist presentations  
**Horizontal Rules** - Critical for section separation in long scripts and presentations
**Strikethrough** - Useful for showing corrections, updates, or comparison content

### Technical Requirements

- **Selective Parsing**: Parse only user-selected markdown elements (headers, emphasis, lists, etc.)
- **Toggle Functionality**: Users should be able to enable/disable markdown mode entirely
- **Feature Granularity**: Individual control over specific markdown features (headers, bold, italic, lists, code, links, blockquotes)
- **Persistent Settings**: Markdown preferences should be saved across sessions
- **Real-time Updates**: Markdown rendering should apply immediately without requiring restart
- **Keyboard Shortcuts**: Quick toggle access for professional use
- **Performance Optimized**: Lightweight parsing with minimal performance impact
- **Theme Integration**: Markdown styles should respect all 7 existing color themes
- **Focus Mode Compatible**: Markdown elements should work with existing focus mode

### Technical Constraints

- Must maintain existing functionality and performance (< 100ms activation time)
- Should integrate seamlessly with current theme and focus systems
- Must follow existing i18n architecture for UI text
- Should be accessible via keyboard shortcuts
- Bundle size increase should be minimal (< 10KB)
- Must work across all supported platforms (Windows, macOS, Linux)
- Should degrade gracefully when markdown parsing fails

## 🚀 Development Phases

### Phase 1: Configuration Foundation ✅ COMPLETED

**Duration**: 1-2 days  
**Objective**: Establish markdown configuration structure and validation  
**Completion Date**: 2025-08-04

#### Checklist

- [x] Add `markdownMode` boolean configuration option to package.json
- [x] Add `markdownFeatures` object configuration for selective features
- [x] Update TypeScript types in `src/types/index.ts`
- [x] Add configuration validation in `src/utils/config.ts`
- [x] Add i18n strings for markdown feature
- [x] Update configuration schema documentation
- [x] Register VS Code commands for markdown functionality
- [x] Add keyboard shortcuts for markdown commands
- [x] Update all package.nls files for internationalization support

#### Implementation Details

```json
{
  "cuemode.markdownMode": {
    "type": "boolean",
    "default": false,
    "description": "Enable markdown parsing and rendering"
  },
  "cuemode.markdownFeatures": {
    "type": "object",
    "default": {
      "headers": true,
      "emphasis": true,
      "lists": true,
      "links": false,
      "code": true,
      "blockquotes": true,
      "tables": true,
      "taskLists": true,
      "strikethrough": false,
      "horizontalRule": true
    },
    "properties": {
      "headers": { "type": "boolean", "default": true },
      "emphasis": { "type": "boolean", "default": true },
      "lists": { "type": "boolean", "default": true },
      "links": { "type": "boolean", "default": false },
      "code": { "type": "boolean", "default": true },
      "blockquotes": { "type": "boolean", "default": true },
      "tables": { "type": "boolean", "default": true },
      "taskLists": { "type": "boolean", "default": true },
      "strikethrough": { "type": "boolean", "default": false },
      "horizontalRule": { "type": "boolean", "default": true }
    }
  }
}
```

#### Checkpoint 1 ✅ COMPLETED

- [x] Configuration options appear in VS Code settings
- [x] TypeScript compilation passes without errors
- [x] Configuration validation works correctly
- [x] All existing tests pass (82/82 tests passing)
- [x] i18n strings added for English and Chinese
- [x] All package.nls files updated for multi-language support
- [x] VS Code commands registered and functional
- [x] Keyboard shortcuts configured
- [x] Configuration foundation ready for parser implementation
- [x] Commit: `feat: add selective markdown configuration foundation`

---

### Phase 2: Lightweight Markdown Parser ✅ COMPLETED

**Duration**: 2-3 days  
**Objective**: Implement custom lightweight markdown parser  
**Completion Date**: 2025-08-04

#### Checklist

- [x] Create `src/utils/markdown.ts` parser module
- [x] Implement selective parsing for headers (# ## ###)
- [x] Add emphasis parsing (**bold**, *italic*)
- [x] Implement list parsing (- * +, 1. 2. 3.)
- [x] Add inline code parsing (`code`)
- [x] Implement code block parsing (```language```)
- [x] Add blockquote parsing (> quote)
- [x] Add optional link parsing ([text](url))
- [x] Implement table parsing (| col1 | col2 |)
- [x] Add task list parsing (- [x] done, - [ ] todo)
- [x] Implement strikethrough parsing (~~text~~)
- [x] Add horizontal rule parsing (---)
- [x] Implement parser performance optimization
- [x] Add parser error handling and fallback
- [x] Create comprehensive unit tests (22 test cases)
- [x] Add HTML escaping for XSS prevention
- [x] Create CSS styling system for markdown elements

#### Implementation Details

```typescript
export interface MarkdownFeatures {
  headers: boolean;
  emphasis: boolean;
  lists: boolean;
  links: boolean;
  code: boolean;
  blockquotes: boolean;
  // Extended features for professional teleprompter use
  tables: boolean;        // Table support for data presentation
  taskLists: boolean;     // Task lists for tutorials and checklists
  strikethrough: boolean; // Strikethrough text for comparisons
  horizontalRule: boolean; // Horizontal rules for section separation
}

export class MarkdownParser {
  static parse(content: string, features: MarkdownFeatures): string;
  private static parseHeaders(content: string): string;
  private static parseEmphasis(content: string): string;
  private static parseLists(content: string): string;
  private static parseCode(content: string): string;
  private static parseBlockquotes(content: string): string;
  private static parseLinks(content: string): string;
  // Extended parsing methods
  private static parseTables(content: string): string;
  private static parseTaskLists(content: string): string;
  private static parseStrikethrough(content: string): string;
  private static parseHorizontalRule(content: string): string;
}
```

#### Checkpoint 2

- [ ] All markdown parsing functions work correctly
- [ ] Selective feature parsing implemented
- [ ] Parser performance < 50ms for 10KB content
- [ ] Error handling and fallback mechanisms work
- [ ] Unit tests cover all parsing functions
- [ ] Commit: `feat: implement lightweight selective markdown parser`

---

### Phase 3: WebView Integration

**Duration**: 2-3 days  
**Objective**: Integrate markdown parsing into webview rendering system

#### Checklist

- [ ] Update `src/ui/webview.ts` processContent method
- [ ] Add markdown rendering pipeline
- [ ] Implement markdown CSS styles for all themes
- [ ] Update theme system to support markdown elements
- [ ] Ensure markdown compatibility with focus mode
- [ ] Add markdown content caching for performance
- [ ] Test markdown rendering with all 7 color themes
- [ ] Implement real-time markdown toggle

#### Implementation Details

```typescript
private processContent(content: string): string {
  if (this.state.config.markdownMode) {
    return this.processMarkdownContent(content);
  }
  return this.processPlainTextContent(content);
}

private processMarkdownContent(content: string): string {
  const features = this.state.config.markdownFeatures;
  const parsedContent = MarkdownParser.parse(content, features);
  return this.wrapContentWithClasses(parsedContent);
}
```

#### Checkpoint 3

- [ ] Markdown content renders correctly in webview
- [ ] All themes display markdown elements properly
- [ ] Focus mode works with markdown content
- [ ] Real-time markdown toggle functional
- [ ] Performance benchmarks maintained
- [ ] WCAG AA contrast ratios maintained for markdown elements
- [ ] Commit: `feat: integrate markdown parsing into webview rendering`

---

### Phase 4: User Interface Integration

**Duration**: 1-2 days  
**Objective**: Add markdown controls and keyboard shortcuts

#### Checklist

- [ ] Add keyboard shortcut `D` for markdown toggle in webview
- [ ] Add VS Code command `Ctrl+Shift+D` for markdown toggle
- [ ] Update webview keyboard handler for markdown shortcuts
- [ ] Add markdown toggle to command palette
- [ ] Update help text with markdown shortcuts
- [ ] Add visual indicator for markdown mode status
- [ ] Add quick configuration command for markdown features
- [ ] Test keyboard shortcuts across platforms

#### Implementation Details

- Add `D` key shortcut in webview for markdown toggle
- Register `cuemode.toggleMarkdownMode` VS Code command
- Register `cuemode.configureMarkdownFeatures` VS Code command
- Update help overlay with new shortcuts
- Add status indicator similar to mirror flip

#### Checkpoint 4

- [ ] Keyboard shortcuts work correctly
- [ ] Command palette integration functional
- [ ] Help text updated and accurate
- [ ] Visual status indicator shows markdown state
- [ ] Quick configuration workflow implemented
- [ ] Cross-platform keyboard shortcuts tested
- [ ] Commit: `feat: add markdown UI integration with status indicator`

---

### Phase 5: Theme Integration & Styling

**Duration**: 1-2 days  
**Objective**: Implement markdown styles for all themes with accessibility compliance

#### Checklist

- [ ] Update `src/utils/theme.ts` to include markdown styles
- [ ] Create markdown CSS for each of the 7 themes
- [ ] Ensure WCAG AA compliance (4.5:1 contrast ratio)
- [ ] Test markdown elements with focus mode blur effects
- [ ] Implement smooth transitions for markdown elements
- [ ] Add responsive design for markdown elements
- [ ] Test accessibility with screen readers
- [ ] Validate color contrast for all themes

#### Implementation Details

```typescript
export interface MarkdownThemeStyles {
  header: { color: string; fontWeight: string; };
  emphasis: { fontWeight: string; fontStyle: string; };
  list: { marginLeft: string; color: string; };
  code: { backgroundColor: string; color: string; fontFamily: string; };
  blockquote: { borderLeft: string; paddingLeft: string; color: string; };
  link: { color: string; textDecoration: string; };
}
```

#### Checkpoint 5

- [ ] All themes have properly styled markdown elements
- [ ] WCAG AA contrast ratios verified for all themes
- [ ] Markdown elements work correctly with focus mode
- [ ] Screen reader accessibility maintained
- [ ] Responsive design tested on different screen sizes
- [ ] Smooth transitions implemented
- [ ] Commit: `feat: implement accessible markdown themes for all color schemes`

---

### Phase 6: Configuration Persistence & Commands

**Duration**: 1 day  
**Objective**: Ensure markdown settings persist and provide management commands

#### Checklist

- [ ] Integrate with existing configuration system
- [ ] Load markdown state on webview initialization
- [ ] Save markdown state changes automatically
- [ ] Test configuration persistence across VS Code restarts
- [ ] Implement configuration synchronization
- [ ] Add markdown feature configuration UI
- [ ] Test configuration edge cases

#### Implementation Details

- Use existing ConfigManager for markdown settings
- Implement automatic state saving for both mode and features
- Load saved state on webview creation
- Add command for configuring individual markdown features

#### Checkpoint 6

- [ ] Markdown settings persist across VS Code sessions
- [ ] Configuration loads correctly on startup
- [ ] Feature-level configuration works properly
- [ ] State synchronization functional
- [ ] Configuration UI accessible and intuitive
- [ ] Commit: `feat: implement markdown configuration persistence and management`

---

### Phase 7: Testing & Quality Assurance

**Duration**: 2-3 days  
**Objective**: Comprehensive testing and quality assurance

#### Checklist

- [ ] Write unit tests for markdown parser
- [ ] Add integration tests for webview markdown rendering
- [ ] Test with all 7 color themes
- [ ] Test keyboard shortcuts on all platforms
- [ ] Performance testing with large markdown content
- [ ] Accessibility testing for markdown mode
- [ ] Test compatibility with existing features (focus mode, mirror flip)
- [ ] Test configuration edge cases and error scenarios
- [ ] Cross-browser compatibility testing
- [ ] Test real-world markdown content scenarios

#### Implementation Details

```typescript
describe('MarkdownParser', () => {
  it('should parse headers correctly');
  it('should handle emphasis text');
  it('should parse lists properly');
  it('should parse code blocks and inline code');
  it('should handle blockquotes');
  it('should parse links when enabled');
  it('should respect selective feature configuration');
  it('should handle malformed markdown gracefully');
  it('should maintain performance benchmarks');
});
```

#### Checkpoint 7

- [ ] All unit tests pass (target: 95+ tests)
- [ ] Integration tests complete successfully
- [ ] Performance benchmarks met (< 50ms parsing, < 100ms activation)
- [ ] Cross-platform compatibility verified
- [ ] Accessibility standards maintained
- [ ] Feature compatibility with focus mode and mirror flip verified
- [ ] Error handling and fallback mechanisms tested
- [ ] Commit: `test: add comprehensive markdown parsing test suite`

---

### Phase 8: Documentation & Finalization

**Duration**: 1-2 days  
**Objective**: Complete documentation and prepare for release

#### Checklist

- [ ] Update README.md with markdown feature
- [ ] Add markdown section to user documentation
- [ ] Update CHANGELOG.md
- [ ] Create demo content showcasing markdown features
- [ ] Update keyboard shortcuts documentation
- [ ] Document configuration options
- [ ] Update package.json metadata
- [ ] Prepare release notes
- [ ] Create markdown feature usage examples

#### Implementation Details

- Document new configuration options and their effects
- Create comprehensive usage examples
- Update all relevant documentation files
- Prepare marketing materials highlighting markdown capability

#### Checkpoint 8

- [ ] Documentation complete and accurate
- [ ] CHANGELOG updated with new feature
- [ ] README includes markdown information
- [ ] Package.json version updated to 2.3.0
- [ ] Usage examples created and tested
- [ ] All documentation reviewed and approved
- [ ] Markdown syntax support clearly documented
- [ ] Commit: `docs: add selective markdown parsing feature documentation`

---

## 🛠️ Technical Implementation Details

### Markdown Parser Implementation

```typescript
export class MarkdownParser {
  private static readonly HEADER_REGEX = /^(#{1,6})\s+(.+)$/gm;
  private static readonly BOLD_REGEX = /\*\*(.*?)\*\*/g;
  private static readonly ITALIC_REGEX = /\*(.*?)\*/g;
  private static readonly LIST_REGEX = /^[\s]*[-*+]\s+(.+)$/gm;
  private static readonly ORDERED_LIST_REGEX = /^[\s]*\d+\.\s+(.+)$/gm;
  private static readonly CODE_BLOCK_REGEX = /```[\s\S]*?```/g;
  private static readonly INLINE_CODE_REGEX = /`([^`]+)`/g;
  private static readonly BLOCKQUOTE_REGEX = /^>\s+(.+)$/gm;
  private static readonly LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  // Extended features
  private static readonly TABLE_REGEX = /^\|(.+)\|$/gm;
  private static readonly TABLE_SEPARATOR_REGEX = /^\|[\s]*:?-+:?[\s]*\|/gm;
  private static readonly TASK_LIST_REGEX = /^[\s]*[-*+]\s+\[([ x])\]\s+(.+)$/gm;
  private static readonly STRIKETHROUGH_REGEX = /~~(.*?)~~/g;
  private static readonly HORIZONTAL_RULE_REGEX = /^[\s]*[-*_]{3,}[\s]*$/gm;
}
```

### Configuration Schema

```json
{
  "cuemode.markdownMode": {
    "type": "boolean",
    "default": false,
    "description": "Enable selective markdown parsing in teleprompter mode"
  },
  "cuemode.markdownFeatures": {
    "type": "object",
    "default": {
      "headers": true,
      "emphasis": true,
      "lists": true,
      "links": false,
      "code": true,
      "blockquotes": true,
      "tables": true,
      "taskLists": true,
      "strikethrough": false,
      "horizontalRule": true
    },
    "description": "Configure which markdown features to parse"
  }
}
```

### Keyboard Shortcuts

- **Webview**: `D` key to toggle markdown mode
- **VS Code**: `Ctrl+Shift+D` (Cmd+Shift+D on macOS) to toggle markdown
- **Configuration**: Command palette access to markdown feature configuration

### TypeScript Types

```typescript
interface CueModeConfig {
  // ...existing properties...
  markdownMode: boolean;
  markdownFeatures: MarkdownFeatures;
}

interface MarkdownFeatures {
  headers: boolean;
  emphasis: boolean;
  lists: boolean;
  links: boolean;
  code: boolean;
  blockquotes: boolean;
}
```

## 📊 Success Criteria

### Functional Requirements

- [ ] Markdown parsing toggles correctly with keyboard shortcut
- [ ] Selected markdown elements render properly when enabled
- [ ] Settings persist across VS Code sessions
- [ ] Minimal performance impact (< 50ms parsing time)
- [ ] Works with all existing themes and features
- [ ] Selective feature configuration functions correctly

### Technical Requirements

- [ ] Code follows existing project patterns
- [ ] Comprehensive test coverage (target: 95+ tests)
- [ ] TypeScript compilation without errors
- [ ] ESLint passes without warnings
- [ ] Documentation complete and accurate
- [ ] Bundle size increase < 10KB

### User Experience Requirements

- [ ] Intuitive keyboard shortcut placement
- [ ] Clear visual feedback for markdown state
- [ ] Smooth rendering transitions
- [ ] Accessible to screen readers
- [ ] Professional content creation workflow support
- [ ] Configuration interface is user-friendly

## 🔄 Git Commit Strategy

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Planned Commits

1. `feat: add selective markdown configuration foundation`
2. `feat: implement lightweight selective markdown parser`
3. `feat: integrate markdown parsing into webview rendering`
4. `feat: add markdown UI integration with status indicator`
5. `feat: implement accessible markdown themes for all color schemes`
6. `feat: implement markdown configuration persistence and management`
7. `test: add comprehensive markdown parsing test suite`
8. `docs: add selective markdown parsing feature documentation`

## 🚨 Risk Analysis

### Technical Risks

- **Performance Impact**: Custom parsing might slow down large content
- **Theme Compatibility**: Markdown styles might clash with existing themes
- **Focus Mode Integration**: Markdown elements might interfere with focus blur
- **Accessibility**: Markdown elements might break screen reader compatibility
- **Bundle Size**: Additional parsing code might increase extension size

### Mitigation Strategies

- Implement performance benchmarking at each phase
- Test all themes with markdown content during development
- Ensure focus mode blur effects work with markdown elements
- Comprehensive accessibility testing with screen readers
- Monitor bundle size and optimize parser implementation

## 📈 Performance Benchmarks

### Target Metrics

- **Parsing Time**: < 50ms for 10KB markdown content
- **Toggle Response Time**: < 100ms
- **Memory Usage**: < 5MB additional overhead
- **Activation Time**: Maintain < 100ms extension activation
- **Bundle Size**: < 10KB increase

### Testing Protocol

- Measure parsing performance with various content sizes
- Test on low-end devices
- Monitor memory usage during extended markdown use
- Validate smooth rendering at 60fps
- Benchmark against plain text mode

## 🎉 Release Preparation

### Pre-release Checklist

- [ ] All phase checkpoints completed
- [ ] Comprehensive testing completed
- [ ] Documentation updated
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Accessibility compliance verified
- [ ] Cross-platform testing completed

### Release Notes Template

```markdown
## 📝 Selective Markdown Parsing

- Added configurable markdown syntax parsing for teleprompter mode
- Support for headers, emphasis, lists, code blocks, blockquotes, and links
- Individual control over which markdown features to enable
- New keyboard shortcut: D key to toggle markdown mode
- Seamless integration with all existing themes and features
- Optimized for content creators and presentation workflows
```

## 📝 Notes

### Development Environment

- VS Code Extension Development Host
- TypeScript 5.1.6
- Node.js 16.x or higher
- Mocha testing framework
- Custom markdown parser (no third-party dependencies)

### Testing Strategy

- Unit tests for parser functionality
- Integration tests for webview rendering
- Performance tests for optimization
- Accessibility tests for compliance
- Cross-platform compatibility tests

### Accessibility Considerations

- Screen reader compatibility for markdown elements
- High contrast mode support
- Keyboard navigation accessibility
- WCAG AA compliance for all markdown styles
- Focus indicators for markdown elements

### Markdown Feature Scope

**Included Features:**
- Headers (H1-H6): `# ## ### #### ##### ######`
- Bold text: `**bold**`
- Italic text: `*italic*`
- Unordered lists: `- * +`
- Ordered lists: `1. 2. 3.`
- Inline code: `` `code` ``
- Code blocks: ``` ```language``` ```
- Blockquotes: `> quote`
- Links: `[text](url)` (optional)
- Tables: `| col1 | col2 |` (professional presentations)
- Task lists: `- [x] done` and `- [ ] todo` (tutorials/checklists)
- Strikethrough: `~~deleted~~` (comparisons, optional)
- Horizontal rules: `---` (section separation)

**Excluded Features (for simplicity):**
- Images (teleprompter is primarily text-focused)
- Complex nested structures
- Mathematical formulas
- Footnotes
- Definition lists
- Advanced table features (colspan, rowspan)

---

**Total Estimated Development Time**: 10-14 days  
**Priority**: High (User-requested feature)  
**Complexity**: Medium-High (New parsing system with theme integration)  
**Risk Level**: Medium (New parser implementation with performance considerations)
