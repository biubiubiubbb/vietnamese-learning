export type Level = 'A1' | 'A2';
export type Pos = 'n' | 'v' | 'adj' | 'adv' | 'pron' | 'num' | 'clf' | 'prep' | 'conj' | 'part' | 'phrase';

export const POS_LABEL: Record<Pos, string> = {
  n: '名词', v: '动词', adj: '形容词', adv: '副词', pron: '代词',
  num: '数词', clf: '量词', prep: '介词', conj: '连词', part: '助词', phrase: '短语',
};

/* ---------- 词汇标签 ---------- */

export type VocabTag =
  | 'core' | 'greeting' | 'people' | 'number' | 'time'
  | 'family' | 'shopping' | 'food' | 'travel' | 'work' | 'hobby' | 'grammar';

export const TAG_LABEL: Record<VocabTag, string> = {
  core: '核心高频',
  greeting: '问候',
  people: '称谓',
  number: '数字',
  time: '时间',
  family: '家庭',
  shopping: '购物',
  food: '饮食',
  travel: '出行',
  work: '工作',
  hobby: '爱好',
  grammar: '语法',
};

/** 标签展示色（供筛选 chip 使用） */
export const TAG_COLOR: Record<VocabTag, string> = {
  core: 'var(--orange)',
  greeting: 'var(--teal)',
  people: 'var(--peach)',
  number: 'var(--yellow)',
  time: '#A78BFA',
  family: '#F59E8E',
  shopping: '#F6A6A0',
  food: '#7FB77E',
  travel: '#6FB3D2',
  work: '#E79A4F',
  hobby: '#C98BB8',
  grammar: '#8A7A66',
};

/* ---------- 句子模块 ---------- */

export type SentenceTag = 'statement' | 'question' | 'negative' | 'request' | 'exclaim';

export const SENTENCE_TAG_LABEL: Record<SentenceTag, string> = {
  statement: '陈述',
  question: '疑问',
  negative: '否定',
  request: '请求',
  exclaim: '感叹',
};

export const SENTENCE_TAG_COLOR: Record<SentenceTag, string> = {
  statement: 'var(--teal)',
  question: '#6FB3D2',
  negative: 'var(--orange)',
  request: '#A78BFA',
  exclaim: 'var(--yellow)',
};

export type ChunkRole = 'subject' | 'predicate' | 'object' | 'modifier' | 'time' | 'place' | 'particle';

export const CHUNK_ROLE_LABEL: Record<ChunkRole, string> = {
  subject: '主语',
  predicate: '谓语',
  object: '宾语',
  modifier: '修饰',
  time: '时间',
  place: '地点',
  particle: '语气',
};

export const CHUNK_ROLE_COLOR: Record<ChunkRole, string> = {
  subject: 'var(--teal)',
  predicate: 'var(--orange)',
  object: 'var(--yellow)',
  modifier: '#A78BFA',
  time: '#6FB3D2',
  place: '#7FB77E',
  particle: '#8A7A66',
};

export interface SentenceChunk {
  vi: string;
  zh: string;
  role: ChunkRole;
  vocabId?: string;
}

export type SentenceExercise =
  | { id: string; type: 'blank'; chunkIndex: number; answer: string; accept?: string[]; hint?: string; explain?: string }
  | { id: string; type: 'order'; answer: number[]; explain?: string }
  | { id: string; type: 'translate'; answer: string; accept?: string[]; hint?: string; explain?: string };

export interface Sentence {
  id: string;
  lessonId: string;
  order: number;
  vi: string;
  zh: string;
  tag: SentenceTag;
  chunks: SentenceChunk[];
  note?: string;
  exercises: SentenceExercise[];
}

export interface VocabItem {
  id: string;
  vi: string;
  zh: string;
  pos: Pos;
  hanViet?: string;
  example?: { vi: string; zh: string };
  note?: string;
  tags?: VocabTag[];
}

export interface DialogueLine {
  speaker: string;
  vi: string;
  zh: string;
}

export interface Dialogue {
  id: string;
  title: string;
  lines: DialogueLine[];
}

export interface GrammarPoint {
  id: string;
  title: string;
  explanation: string;
  examples: { vi: string; zh: string }[];
  tips?: string[];
}

export type Exercise =
  | {
      id: string;
      type: 'choice';
      prompt: string;
      audioText?: string;
      options: string[];
      answer: number;
      explain?: string;
    }
  | {
      id: string;
      type: 'fill';
      prompt: string;
      audioText?: string;
      answer: string;
      accept?: string[];
      hint?: string;
      explain?: string;
    };

export interface Lesson {
  id: string;
  unitId: string;
  order: number;
  title: string;
  goals: string[];
  vocabIds: string[];
  grammar: GrammarPoint[];
  dialogues: Dialogue[];
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  level: Level;
  order: number;
  title: string;
  subtitle: string;
  lessonIds: string[];
}

/* ---------- 发音中心 ---------- */

export interface AlphabetItem {
  letter: string;
  name: string;
  ipa: string;
  zhApprox: string;
  note?: string;
}

export interface ToneItem {
  name: string;
  mark: string;
  sample: string;
  contour: string;
  zhFeel: string;
  example: { vi: string; zh: string };
}

export interface SoundGroup {
  title: string;
  items: { sound: string; ipa: string; zhApprox: string; example: { vi: string; zh: string }; note?: string }[];
}

export interface MinimalPair {
  pair: string[];
  zh: string[];
  point: string;
}

export interface RuleNote {
  title: string;
  body: string;
  examples?: { vi: string; zh: string }[];
}
