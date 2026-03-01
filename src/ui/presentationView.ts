import type { CueModeConfig } from '../types';
import { ThemeManager } from '../utils/theme';
import { MarkdownParser } from '../utils/markdown';
import { generateMarkdownCSS } from '../utils/markdownStyles';
import { generatePresentationCSS } from '../utils/webviewStyles';
import { t, getCurrentLanguage } from '../i18n';

/**
 * Block-level HTML tags that should NOT be wrapped in <p> tags.
 * Used by wrapPresentationParagraphs to distinguish prose text from block elements.
 */
const BLOCK_ELEMENT_PATTERN =
  /^<(h[1-6]|p|div|ul|ol|li|blockquote|pre|table|thead|tbody|tr|th|td|hr|figure|figcaption|section|article|aside|nav|header|footer|details|summary)[^>]*>/i;

/**
 * Wrap plain-text segments in the presentation HTML with proper <p> tags so that
 * markdown paragraph and line-break semantics are preserved independently from the
 * CueMode (teleprompter) content renderer.
 *
 * Rules (aligned with CommonMark / GFM):
 *  - Blank lines between segments → separate <p> elements
 *  - Single newlines inside a prose segment → <br> (GFM soft line-break extension)
 *  - Segments that already start with a block-level HTML tag are left unchanged
 */
function wrapPresentationParagraphs(html: string): string {
  // Split on one-or-more blank lines to get paragraph-level segments
  const segments = html.split(/\n{2,}/);

  const wrapped = segments
    .map(segment => {
      const trimmed = segment.trim();
      if (!trimmed) return '';

      // If the segment is already a block-level element, leave it as-is
      if (BLOCK_ELEMENT_PATTERN.test(trimmed)) {
        return trimmed;
      }

      // Convert single newlines within a prose paragraph to <br> (GFM soft line-breaks)
      const lineContent = trimmed.replace(/\n/g, '<br>');
      return `<p class="pm-paragraph">${lineContent}</p>`;
    })
    .filter(s => s !== '');

  return wrapped.join('\n');
}

/**
 * Generate HTML for presentation (slide) mode.
 */
export function generatePresentationHTML(
  slides: string[],
  config: CueModeConfig,
  filename: string
): string {
  const themeCSS = ThemeManager.generateCSS(
    config.colorTheme,
    config.fontSize,
    config.lineHeight,
    config.maxWidth,
    config.padding
  );
  const markdownCSS = generateMarkdownCSS(ThemeManager.getTheme(config.colorTheme));
  const presentationCSS = generatePresentationCSS();

  // Render each slide content via markdown parser, then apply presentation-specific
  // paragraph wrapping (independent from the CueMode / teleprompter content renderer).
  const renderedSlides = slides
    .map((slideText, idx) => {
      let innerHtml: string;
      try {
        const parsed = MarkdownParser.parse(slideText.trim(), config.markdownFeatures);
        // Apply presentation-mode paragraph semantics (markdown line-break rules).
        // This is intentionally separate from contentRenderer.ts used by CueMode.
        innerHtml = wrapPresentationParagraphs(parsed.html);
      } catch {
        innerHtml = `<pre>${slideText
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</pre>`;
      }
      return `<div class="pm-slide${idx === 0 ? ' active' : ''}" data-slide="${idx}">
        <div class="pm-slide-inner">${innerHtml}</div>
      </div>`;
    })
    .join('\n');

  const isSingle = slides.length === 1;
  const prevLabel = t('presentation.prev');
  const nextLabel = t('presentation.next');
  const closeLabel = t('presentation.close');
  const helpLabel = t('presentation.help');
  const helpTitle = t('presentation.helpTitle');
  const lang = getCurrentLanguage();

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
  <title>${t('presentation.title', { filename })}</title>
  <style>
    ${themeCSS}
    ${markdownCSS}
    ${presentationCSS}
  </style>
</head>
<body>
  <!-- Top controls -->
  <div class="pm-controls" id="pm-controls">
    <button class="pm-ctrl-btn" onclick="pmClose()">${closeLabel}</button>
    <button class="pm-ctrl-btn" onclick="pmToggleHelp()">${helpLabel}</button>
  </div>

  <!-- Slide container -->
  <div class="pm-slide-container${isSingle ? ' pm-single' : ''}">
    ${renderedSlides}
  </div>

  <!-- Navigation bar (hidden when only 1 slide) -->
  <div class="pm-nav" id="pm-nav"${isSingle ? ' style="display:none"' : ''}>
    <button class="pm-nav-btn" id="pm-prev" onclick="pmPrev()" disabled>${prevLabel}</button>
    <span class="pm-counter" id="pm-counter">1 / ${slides.length}</span>
    <button class="pm-nav-btn" id="pm-next" onclick="pmNext()"${slides.length <= 1 ? ' disabled' : ''}>${nextLabel}</button>
  </div>

  <!-- Help overlay -->
  <div class="pm-help" id="pm-help">
    <h3>${helpTitle}</h3>
    <ul>
      <li><kbd>← →</kbd><span>${t('presentation.shortcutLeft')} / ${t('presentation.shortcutRight')}</span></li>
      <li><kbd>Space</kbd><span>${t('presentation.shortcutRight')}</span></li>
      <li><kbd>T</kbd><span>${t('presentation.shortcutT')}</span></li>
      <li><kbd>L</kbd><span>${t('presentation.shortcutL')}</span></li>
      <li><kbd>[</kbd><span>${t('presentation.shortcutBracketL')}</span></li>
      <li><kbd>]</kbd><span>${t('presentation.shortcutBracketR')}</span></li>
      <li><kbd>H</kbd><span>${t('presentation.shortcutH')}</span></li>
      <li><kbd>Esc</kbd><span>${t('presentation.shortcutEsc')}</span></li>
    </ul>
    <hr style="border-color:rgba(255,255,255,0.2);margin:10px 0">
    <p style="font-size:0.85em;opacity:0.85;margin:0"><strong>${t('presentation.separatorLabel')}:</strong> <code>${t('presentation.separatorValue')}</code></p>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const slides = document.querySelectorAll('.pm-slide');
    const totalSlides = ${slides.length};
    let current = 0;
    let navTimeout;

    function pmGoTo(idx) {
      if (idx < 0 || idx >= totalSlides) return;
      slides[current].classList.remove('active');
      current = idx;
      slides[current].classList.add('active');
      document.getElementById('pm-counter').textContent = (current + 1) + ' / ' + totalSlides;
      document.getElementById('pm-prev').disabled = current === 0;
      document.getElementById('pm-next').disabled = current === totalSlides - 1;
    }

    function pmNext() { pmGoTo(current + 1); }
    function pmPrev() { pmGoTo(current - 1); }

    function pmClose() { vscode.postMessage({ type: 'close' }); }

    function pmToggleHelp() {
      const help = document.getElementById('pm-help');
      help.classList.toggle('visible');
    }

    // Show nav bar on mouse move (for slide navigation only)
    function pmShowNav() {
      clearTimeout(navTimeout);
      const nav = document.getElementById('pm-nav');
      if (totalSlides <= 1) return;
      nav.classList.remove('hidden');
      navTimeout = setTimeout(() => nav.classList.add('hidden'), 3000);
    }
    document.addEventListener('mousemove', pmShowNav);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          pmNext(); e.preventDefault(); break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          pmPrev(); e.preventDefault(); break;
        case ' ':
          pmNext(); e.preventDefault(); break;
        case 'Escape':
          {
            const help = document.getElementById('pm-help');
            if (help.classList.contains('visible')) { help.classList.remove('visible'); }
            else { pmClose(); }
          }
          break;
        case 't': case 'T':
          vscode.postMessage({ type: 'cycleTheme' }); e.preventDefault(); break;
        case 'h': case 'H':
          pmToggleHelp(); e.preventDefault(); break;
        case 'l': case 'L':
          vscode.postMessage({ type: 'adjustLineHeight' }); e.preventDefault(); break;
        case '[':
          vscode.postMessage({ type: 'decreaseFontSize' }); e.preventDefault(); break;
        case ']':
          vscode.postMessage({ type: 'increaseFontSize' }); e.preventDefault(); break;
      }
    });

    // Controls bar: visible for 5 s on entry, then CSS :hover takes over
    const ctrl = document.getElementById('pm-controls');
    ctrl.classList.add('pm-entering');
    setTimeout(() => ctrl.classList.remove('pm-entering'), 5000);

    // Nav bar: auto-hide after 2 s initially
    setTimeout(() => document.getElementById('pm-nav').classList.add('hidden'), 2000);

    // Listen for theme update messages from extension
    window.addEventListener('message', event => {
      // Full HTML reload is triggered by extension; nothing extra needed here.
    });
  </script>
</body>
</html>`;
}
