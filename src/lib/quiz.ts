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
