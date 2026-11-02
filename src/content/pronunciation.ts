import type { AlphabetItem, ToneItem, SoundGroup, MinimalPair, RuleNote } from './types';

export const ALPHABET: AlphabetItem[] = [
  { letter: 'A a', name: 'a', ipa: '/aː/', zhApprox: '啊（长）' },
  { letter: 'Ă ă', name: 'á', ipa: '/a/', zhApprox: '啊（短促）', note: '比 a 短一半' },
  { letter: 'Â â', name: 'ớ', ipa: '/ə/', zhApprox: '短促的「呃」' },
  { letter: 'B b', name: 'bê', ipa: '/ɓ/', zhApprox: '浊音 b，声带振动', note: '与普通话 b（实为不送气 p）不同' },
  { letter: 'C c', name: 'xê', ipa: '/k/', zhApprox: 'g（如「哥」的声母）' },
  { letter: 'D d', name: 'dê', ipa: '/z/（北）/j/（南）', zhApprox: '河内音读 z', note: '河内读 z，南部读 y' },
  { letter: 'Đ đ', name: 'đê', ipa: '/ɗ/', zhApprox: '浊音 d，带内爆', note: '与 d 是两个不同字母' },
  { letter: 'E e', name: 'e', ipa: '/ɛ/', zhApprox: '欸（开口大）' },
  { letter: 'Ê ê', name: 'ê', ipa: '/e/', zhApprox: '欸（开口小、更闭）' },
  { letter: 'G g', name: 'gê', ipa: '/ɣ/', zhApprox: '舌根摩擦，无中文对应', note: 'gh 只用于 e/ê/i 前' },
  { letter: 'H h', name: 'hát', ipa: '/h/', zhApprox: '喝' },
  { letter: 'I i', name: 'i', ipa: '/i/', zhApprox: '衣' },
  { letter: 'K k', name: 'ca', ipa: '/k/', zhApprox: 'g，用于 i/e/ê 前' },
  { letter: 'L l', name: 'lờ', ipa: '/l/', zhApprox: '勒' },
  { letter: 'M m', name: 'mờ', ipa: '/m/', zhApprox: '摸' },
  { letter: 'N n', name: 'nờ', ipa: '/n/', zhApprox: '讷' },
  { letter: 'O o', name: 'o', ipa: '/ɔ/', zhApprox: '喔（开口大）' },
  { letter: 'Ô ô', name: 'ô', ipa: '/o/', zhApprox: '喔（圆唇更闭）' },
  { letter: 'Ơ ơ', name: 'ơ', ipa: '/ɤ/', zhApprox: '呃（不圆唇的 o）', note: '中文没有，重点练' },
  { letter: 'P p', name: 'pê', ipa: '/p/', zhApprox: '坡（只用于外来词）' },
  { letter: 'Q q', name: 'quy', ipa: '/kw/', zhApprox: 'gu（总与 u 连写 qu）' },
  { letter: 'R r', name: 'rờ', ipa: '/z/（北）/r/（南）', zhApprox: '河内音读 z' },
  { letter: 'S s', name: 'sờ', ipa: '/s/', zhApprox: '思' },
  { letter: 'T t', name: 'tê', ipa: '/t/', zhApprox: 'd（不送气，如「的」）', note: '不送气，别读成「特」' },
  { letter: 'U u', name: 'u', ipa: '/u/', zhApprox: '乌' },
  { letter: 'Ư ư', name: 'ư', ipa: '/ɨ/', zhApprox: '「资」的韵母拉长', note: '中文没有，重点练' },
  { letter: 'V v', name: 'vê', ipa: '/v/（北）/j/（南）', zhApprox: '微（咬唇）' },
  { letter: 'X x', name: 'xít', ipa: '/s/', zhApprox: '思' },
  { letter: 'Y y', name: 'y', ipa: '/i/', zhApprox: '衣' },
];

export const TONES: ToneItem[] = [
  { name: 'ngang 平声', mark: '无符号', sample: 'a', contour: 'M 8 34 L 62 34', zhFeel: '≈ 普通话一声（阴平），平稳中高', example: { vi: 'ba', zh: '三 / 爸爸' } },
  { name: 'sắc 锐声', mark: '´', sample: 'á', contour: 'M 8 42 L 62 12', zhFeel: '≈ 普通话二声（阳平），上扬', example: { vi: 'bá', zh: '伯母' } },
  { name: 'huyền 玄声', mark: '`', sample: 'à', contour: 'M 8 12 L 62 42', zhFeel: '≈ 普通话四声（去声），下降', example: { vi: 'bà', zh: '奶奶 / 夫人' } },
  { name: 'hỏi 问声', mark: '̉', sample: 'ả', contour: 'M 8 30 Q 22 48 36 40 Q 50 32 62 10', zhFeel: '≈ 普通话三声，先降后升', example: { vi: 'bả', zh: '诱饵' } },
  { name: 'ngã 跌声', mark: '̃', sample: 'ã', contour: 'M 8 40 L 28 10 L 40 34 L 62 8', zhFeel: '≈ 三声加喉部顿挫（中间断一下）', example: { vi: 'bã', zh: '（地名用字）' } },
  { name: 'nặng 重声', mark: '̣', sample: 'ạ', contour: 'M 8 18 L 34 44 L 62 44', zhFeel: '≈ 短促低降，戛然而止', example: { vi: 'bạ', zh: '（感叹词）' } },
];

export const CONSONANT_GROUPS: SoundGroup[] = [
  {
    title: '中文没有的声母',
    items: [
      { sound: 'b', ipa: '/ɓ/', zhApprox: '浊音，声带先振动再爆破', example: { vi: 'ba', zh: '三' }, note: '不是普通话的 b（不送气清音）' },
      { sound: 'đ', ipa: '/ɗ/', zhApprox: '浊音 d，轻微内爆', example: { vi: 'đi', zh: '去' } },
      { sound: 'ng / ngh', ipa: '/ŋ/', zhApprox: '「昂」的尾音放到开头', example: { vi: 'nghe', zh: '听' }, note: '中文只出现在韵尾' },
      { sound: 'nh', ipa: '/ɲ/', zhApprox: '「捏」的声母', example: { vi: 'nhà', zh: '家' } },
    ],
  },
  {
    title: '易读错的声母',
    items: [
      { sound: 't', ipa: '/t/', zhApprox: '不送气，像普通话 d', example: { vi: 'tôi', zh: '我' }, note: '读「偷」就错了' },
      { sound: 'tr / ch', ipa: '/c//ʈ/', zhApprox: '卷舌，近似「知」', example: { vi: 'trà', zh: '茶' } },
      { sound: 'kh', ipa: '/x/', zhApprox: '「喝」但舌根摩擦', example: { vi: 'không', zh: '不' } },
      { sound: 'gi', ipa: '/z/（北）', zhApprox: '河内读 z', example: { vi: 'gì', zh: '什么' } },
      { sound: 'ph', ipa: '/f/', zhApprox: '「夫」', example: { vi: 'phở', zh: '河粉' } },
    ],
  },
];

export const VOWEL_GROUPS: SoundGroup[] = [
  {
    title: '中文没有的元音',
    items: [
      { sound: 'ơ', ipa: '/ɤ/', zhApprox: '嘴巴扁平的「呃」，不圆唇', example: { vi: 'phở', zh: '河粉' }, note: '与 ô 对比：ô 圆唇' },
      { sound: 'ư', ipa: '/ɨ/', zhApprox: '「资」的韵母拉长、舌位更高', example: { vi: 'từ', zh: '从 / 字' }, note: '与 u 对比：u 圆唇' },
      { sound: 'â', ipa: '/ə/', zhApprox: '短促的「呃」', example: { vi: 'cần', zh: '需要' }, note: '不能单独成音节结尾' },
      { sound: 'ă', ipa: '/a/', zhApprox: '短促的「啊」', example: { vi: 'ăn', zh: '吃' }, note: '长度只有 a 的一半' },
    ],
  },
  {
    title: '闭口音尾（入声）',
    items: [
      { sound: '-p', ipa: '/p̚/', zhApprox: '双唇闭拢不爆破', example: { vi: 'họp', zh: '开会' } },
      { sound: '-t', ipa: '/t̚/', zhApprox: '舌尖抵住不爆破', example: { vi: 'một', zh: '一' } },
      { sound: '-k / -c', ipa: '/k̚/', zhApprox: '舌根抬起不爆破', example: { vi: 'học', zh: '学习' } },
      { sound: '-m', ipa: '/m/', zhApprox: '双唇闭拢的鼻音尾', example: { vi: 'tạm', zh: '暂时' } },
    ],
  },
];

export const MINIMAL_PAIRS: MinimalPair[] = [
  { pair: ['hỏi', 'hỏĩ'], zh: ['问', '—'], point: '问声 hỏi vs 跌声 ngã' },
  { pair: ['ba', 'bà'], zh: ['三', '奶奶'], point: '平声 vs 玄声' },
  { pair: ['ma', 'mà', 'má'], zh: ['鬼', '但是', '妈妈'], point: '平 / 玄 / 锐三调对比' },
  { pair: ['có', 'cơ'], zh: ['有', '饭（旧）'], point: '圆唇 ô vs 不圆唇 ơ' },
  { pair: ['từ', 'tú'], zh: ['从', '醉（古）'], point: '不圆唇 ư vs 圆唇 u' },
  { pair: ['bạn', 'pạn'], zh: ['朋友', '（误读）'], point: '浊音 b vs 清音 p' },
  { pair: ['đi', 'di'], zh: ['去', '移动'], point: '浊 đ vs 北越 z 音 d' },
  { pair: ['nghe', 'nhe'], zh: ['听', '（误读）'], point: '舌根鼻音 ng vs 舌尖 n' },
];

export const TONE_RULES: RuleNote[] = [
  {
    title: '声调符号标在哪个元音上',
    body: '一个音节有多个元音时，按优先级标注：① 带符号的元音优先（ê / ơ / â / ô / ă / ư）；② 都没有时标在主要元音上；③ 双元音标在第二个元音。',
    examples: [
      { vi: 'tiếng', zh: '声调标在 ê 上' },
      { vi: 'khỏe', zh: 'e 是主要元音' },
      { vi: 'quyển', zh: 'qu 视为一个辅音，标在 ê 上' },
    ],
  },
  {
    title: 'qu 和 gi 视为一个辅音',
    body: 'qu 里的 u 不是元音、gi 里的 i 不是元音，标调时跳过它们，标在后面的元音上。',
    examples: [
      { vi: 'quyển', zh: '册（量词）' },
      { vi: 'giờ', zh: '小时 / 现在' },
    ],
  },
  {
    title: 'nặng 重声的写法',
    body: '重声符号（点）永远写在元音正下方，其他五个调号写在元音上方。',
    examples: [{ vi: 'học / họp / một', zh: '短促收尾，戛然而止' }],
  },
  {
    title: '汉越词记忆法',
    body: '约 60% 越南语词汇来自古汉语（汉越词），发音与粤语/古汉语接近。看到 quốc gia（国家）、lịch sử（历史）、học sinh（学生），直接用汉字联想记忆。',
    examples: [
      { vi: 'quốc gia ↔ 国家', zh: '国家' },
      { vi: 'cảm ơn ↔ 感恩', zh: '谢谢' },
      { vi: 'tạm biệt ↔ 暂别', zh: '再见' },
    ],
  },
];
