export interface EditorNavigationRequest {
  lineNumber: number;
  contextText?: string | undefined;
  clickedText?: string | undefined;
  beforeText?: string | undefined;
  afterText?: string | undefined;
  characterOffset?: number | undefined;
}

export interface EditorNavigationTarget {
  lineNumber: number;
  character: number;
  selectionLength: number;
}

export function resolveEditorNavigationTarget(
  documentText: string,
  request: EditorNavigationRequest
): EditorNavigationTarget {
  const lines = documentText.split('\n');
  const fallbackLine = clamp(request.lineNumber, 0, Math.max(lines.length - 1, 0));
  const targetLine = findBestLine(lines, request, fallbackLine);
  const lineText = lines[targetLine] ?? '';
  const character = findBestCharacter(lineText, request);
  const selectionLength = request.clickedText?.trim().length ?? 0;

  return {
    lineNumber: targetLine,
    character,
    selectionLength,
  };
}

function findBestLine(
  lines: string[],
  request: EditorNavigationRequest,
  fallbackLine: number
): number {
  const normalizedContext = normalizeForComparison(request.contextText);
  const normalizedClickedText = normalizeForComparison(request.clickedText);
  const normalizedBeforeText = normalizeForComparison(request.beforeText);
  const normalizedAfterText = normalizeForComparison(request.afterText);

  let bestLine = fallbackLine;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index] ?? '';
    const normalizedLine = normalizeForComparison(line);
    let score = Math.max(0, 80 - Math.abs(index - fallbackLine) * 4);

    if (normalizedContext) {
      if (normalizedLine.includes(normalizedContext)) {
        score += 1000 + normalizedContext.length;
      } else {
        score += overlapScore(normalizedLine, normalizedContext) * 120;
      }
    }

    if (normalizedClickedText && normalizedLine.includes(normalizedClickedText)) {
      score += 250 + normalizedClickedText.length * 4;
    }

    if (normalizedBeforeText && normalizedLine.includes(normalizedBeforeText)) {
      score += 100;
    }

    if (normalizedAfterText && normalizedLine.includes(normalizedAfterText)) {
      score += 100;
    }

    if (score > bestScore) {
      bestScore = score;
      bestLine = index;
    }
  }

  return bestLine;
}

function findBestCharacter(lineText: string, request: EditorNavigationRequest): number {
  const clickedText = request.clickedText?.trim();
  if (!clickedText) {
    return 0;
  }

  const occurrences = findAllOccurrences(lineText, clickedText);
  if (occurrences.length === 0) {
    return 0;
  }

  const normalizedBeforeText = normalizeForComparison(request.beforeText);
  const normalizedAfterText = normalizeForComparison(request.afterText);
  const expectedOffset = Math.max(0, request.characterOffset ?? 0);

  let bestCharacter = occurrences[0] ?? 0;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const occurrence of occurrences) {
    let score = 0;
    const normalizedPrefix = normalizeForComparison(lineText.slice(0, occurrence));
    const normalizedBeforeSlice = normalizeForComparison(
      lineText.slice(Math.max(0, occurrence - 80), occurrence)
    );
    const normalizedAfterSlice = normalizeForComparison(
      lineText.slice(occurrence + clickedText.length, occurrence + clickedText.length + 80)
    );

    score -= Math.abs(normalizedPrefix.length - expectedOffset) * 3;

    if (normalizedBeforeText && normalizedBeforeSlice.endsWith(normalizedBeforeText)) {
      score += 120;
    }

    if (normalizedAfterText && normalizedAfterSlice.startsWith(normalizedAfterText)) {
      score += 120;
    }

    if (score > bestScore) {
      bestScore = score;
      bestCharacter = occurrence;
    }
  }

  return bestCharacter;
}

function findAllOccurrences(lineText: string, searchText: string): number[] {
  const occurrences: number[] = [];
  let searchIndex = 0;

  while (searchIndex <= lineText.length) {
    const matchIndex = lineText.indexOf(searchText, searchIndex);
    if (matchIndex < 0) {
      break;
    }

    occurrences.push(matchIndex);
    searchIndex = matchIndex + 1;
  }

  return occurrences;
}

function overlapScore(lineText: string, queryText: string): number {
  if (!lineText || !queryText) {
    return 0;
  }

  const tokens = tokenize(queryText);
  if (tokens.length === 0) {
    return lineText.includes(queryText) ? 1 : 0;
  }

  const matchedTokenCount = tokens.filter(token => lineText.includes(token)).length;
  return matchedTokenCount / tokens.length;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .map(token => token.trim())
    .filter(token => token.length > 0);
}

export function normalizeForComparison(text: string | undefined): string {
  if (!text) {
    return '';
  }

  return text
    .replace(/\r/g, '')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*>+\s*/gm, '')
    .replace(/^\s*-\s+\[[ xX]\]\s+/gm, '')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\*\*|__|\*|_|~~|`/g, '')
    .replace(/<!--|-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
