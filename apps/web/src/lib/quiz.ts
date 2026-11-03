export function normalizeAnswer(s: string): string {
  return s
    .normalize('NFC')
    .trim()
    .toLowerCase()
    .replace(/^[.!?,。！？，]+|[.!?,。！？，]+$/g, '')
    .replace(/\s+/g, ' ');
}

export function checkFill(input: string, answer: string, accept?: string[]): boolean {
  const norm = normalizeAnswer(input);
  if (norm === normalizeAnswer(answer)) return true;
  return (accept ?? []).some((a) => normalizeAnswer(a) === norm);
}

/** 去掉声调与 đ 的钩，用于「补全声调」的宽松比对。 */
export function stripTones(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** 按题目要求的严格/去声调模式判定答案。 */
export function checkAnswer(input: string, answer: string, mode: 'exact' | 'toneless'): boolean {
  return mode === 'toneless'
    ? normalizeAnswer(input) === normalizeAnswer(answer)
    : checkFill(input, answer);
}
