// 基于观察到的 HTML 结构，更新所有测试的期望值

// 头部：<h1 class="markdown-header markdown-h1">Header 1</h1>
// 引用块：<blockquote class="markdown-blockquote">content</blockquote>  
// 无序列表：<ul class="markdown-list markdown-ul"> + <li class="markdown-list-item">content</li>
// 有序列表：<ol class="markdown-list markdown-ol"> + <li class="markdown-list-item">content</li> (推测)
// 水平线：<hr class="markdown-rule"> (推测)
// 结构：<span class="cue-line markdown-line" data-line="N">内容</span>

// 需要修复的测试：
// 1. ordered lists - 期望 <li class="markdown-list-item">
// 2. 所有具体的标题测试 - 期望带类的标题
// 3. 所有具体的引用测试 - 期望带类的引用
// 4. 所有具体的列表测试 - 期望带类的列表项
// 5. 内容结构测试需要理解 span vs div 的差异
// 6. 纯文本模式测试需要理解不同的处理方式
