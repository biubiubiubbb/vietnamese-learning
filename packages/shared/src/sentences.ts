import type { Sentence } from './types';
import { EXTRA_SENTENCES } from './content-extra';

/**
 * 句子库：每课 3 句，第 1 句配 1 道挖空，第 2/3 句配 1 道词序或中译越。
 * 词块顺序 = 原句语序；order 练习的 answer 为词块下标顺序。
 */
export let SENTENCES: Sentence[] = [
  // ===== U1 =====
  {
    id: 's1-1-1', lessonId: 'l1-1', order: 1, tag: 'statement',
    vi: 'Tiếng Việt có hai mươi chín chữ cái.', zh: '越南语有 29 个字母。',
    chunks: [
      { vi: 'Tiếng Việt', zh: '越南语', role: 'subject', vocabId: 'u1-10' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'hai mươi chín', zh: '二十九', role: 'modifier' },
      { vi: 'chữ cái', zh: '字母', role: 'object', vocabId: 'u1-01' },
    ],
    exercises: [
      { id: 'se1-1-1', type: 'blank', chunkIndex: 2, answer: 'hai mươi chín', hint: '29，用越南语数字写法', explain: 'hai mươi chín = 29。' },
    ],
  },
  {
    id: 's1-1-2', lessonId: 'l1-1', order: 2, tag: 'statement',
    vi: 'Đ là một chữ cái đặc biệt.', zh: 'Đ 是一个特殊的字母。',
    chunks: [
      { vi: 'Đ', zh: '字母 Đ', role: 'subject' },
      { vi: 'là', zh: '是', role: 'predicate', vocabId: 'u2-11' },
      { vi: 'một chữ cái', zh: '一个字母', role: 'object', vocabId: 'u1-01' },
      { vi: 'đặc biệt', zh: '特殊的', role: 'modifier' },
    ],
    exercises: [],
  },
  {
    id: 's1-1-3', lessonId: 'l1-1', order: 3, tag: 'negative',
    vi: 'Tiếng Việt không có chữ f.', zh: '越南语里没有字母 f。',
    chunks: [
      { vi: 'Tiếng Việt', zh: '越南语', role: 'subject', vocabId: 'u1-10' },
      { vi: 'không có', zh: '没有', role: 'predicate', vocabId: 'u2-16' },
      { vi: 'chữ f', zh: '字母 f', role: 'object' },
    ],
    exercises: [
      { id: 'se1-1-2', type: 'order', answer: [0, 1, 2], explain: 'không có = 没有；越南语字母表里没有 f、j、w、z。' },
    ],
  },

  {
    id: 's1-2-1', lessonId: 'l1-2', order: 1, tag: 'statement',
    vi: 'Tiếng Việt có sáu thanh điệu.', zh: '越南语有六个声调。',
    chunks: [
      { vi: 'Tiếng Việt', zh: '越南语', role: 'subject', vocabId: 'u1-10' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'sáu', zh: '六', role: 'modifier', vocabId: 'u3-06' },
      { vi: 'thanh điệu', zh: '声调', role: 'object', vocabId: 'u1-02' },
    ],
    exercises: [
      { id: 'se1-2-1', type: 'blank', chunkIndex: 3, answer: 'thanh điệu', hint: '「声调」', explain: 'thanh điệu 是汉越词「声调」。' },
    ],
  },
  {
    id: 's1-2-2', lessonId: 'l1-2', order: 2, tag: 'statement',
    vi: 'Thanh sắc là thanh thứ hai.', zh: '锐声是第二个声调。',
    chunks: [
      { vi: 'Thanh sắc', zh: '锐声', role: 'subject', vocabId: 'u1-02' },
      { vi: 'là', zh: '是', role: 'predicate', vocabId: 'u2-11' },
      { vi: 'thanh thứ hai', zh: '第二个声调', role: 'object' },
    ],
    exercises: [],
  },
  {
    id: 's1-2-3', lessonId: 'l1-2', order: 3, tag: 'statement',
    vi: 'Hai thanh này rất khó.', zh: '这两个声调很难。',
    chunks: [
      { vi: 'Hai thanh này', zh: '这两个声调', role: 'subject' },
      { vi: 'rất khó', zh: '很难', role: 'predicate', vocabId: 'u1-11' },
    ],
    exercises: [
      { id: 'se1-2-2', type: 'translate', answer: 'Hai thanh này rất khó.', hint: 'Hai thanh này + rất khó', explain: 'rất 放在形容词前表「很」。' },
    ],
  },

  {
    id: 's1-3-1', lessonId: 'l1-3', order: 1, tag: 'statement',
    vi: 'Tôi đi Hà Nội.', zh: '我去河内。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'đi', zh: '去', role: 'predicate', vocabId: 'u7-01' },
      { vi: 'Hà Nội', zh: '河内', role: 'place', vocabId: 'u2-24' },
    ],
    exercises: [
      { id: 'se1-3-1', type: 'blank', chunkIndex: 2, answer: 'Hà Nội', hint: '地名「河内」', explain: 'đi + 地点 = 去某地。' },
    ],
  },
  {
    id: 's1-3-2', lessonId: 'l1-3', order: 2, tag: 'statement',
    vi: 'Bạn phát âm rất tốt.', zh: '你发音很好。',
    chunks: [
      { vi: 'Bạn', zh: '你', role: 'subject', vocabId: 'u2-06' },
      { vi: 'phát âm', zh: '发音', role: 'predicate', vocabId: 'u1-05' },
      { vi: 'rất tốt', zh: '很好', role: 'modifier' },
    ],
    exercises: [],
  },
  {
    id: 's1-3-3', lessonId: 'l1-3', order: 3, tag: 'statement',
    vi: 'Anh ấy là người Việt Nam.', zh: '他是越南人。',
    chunks: [
      { vi: 'Anh ấy', zh: '他', role: 'subject', vocabId: 'u2-07' },
      { vi: 'là', zh: '是', role: 'predicate', vocabId: 'u2-11' },
      { vi: 'người Việt Nam', zh: '越南人', role: 'object', vocabId: 'u2-12' },
    ],
    exercises: [
      { id: 'se1-3-2', type: 'order', answer: [0, 1, 2], explain: 'người + 国家 = 某国人，不能省 người。' },
    ],
  },

  {
    id: 's1-4-1', lessonId: 'l1-4', order: 1, tag: 'statement',
    vi: 'Tôi đọc tiếng Việt mỗi ngày.', zh: '我每天读越南语。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'đọc', zh: '读', role: 'predicate', vocabId: 'u1-08' },
      { vi: 'tiếng Việt', zh: '越南语', role: 'object', vocabId: 'u1-10' },
      { vi: 'mỗi ngày', zh: '每天', role: 'time', vocabId: 'u4-15' },
    ],
    exercises: [
      { id: 'se1-4-1', type: 'blank', chunkIndex: 3, answer: 'mỗi ngày', hint: '「每天」', explain: 'mỗi ngày 可放句首或句尾。' },
    ],
  },
  {
    id: 's1-4-2', lessonId: 'l1-4', order: 2, tag: 'statement',
    vi: 'Tôi viết chữ này.', zh: '我写这个字。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'viết', zh: '写', role: 'predicate', vocabId: 'u1-09' },
      { vi: 'chữ này', zh: '这个字', role: 'object' },
    ],
    exercises: [],
  },
  {
    id: 's1-4-3', lessonId: 'l1-4', order: 3, tag: 'statement',
    vi: 'Bây giờ là tám giờ.', zh: '现在是八点。',
    chunks: [
      { vi: 'Bây giờ', zh: '现在', role: 'time', vocabId: 'u3-23' },
      { vi: 'là', zh: '是', role: 'predicate', vocabId: 'u2-11' },
      { vi: 'tám giờ', zh: '八点', role: 'object', vocabId: 'u3-08' },
    ],
    exercises: [
      { id: 'se1-4-2', type: 'translate', answer: 'Bây giờ là tám giờ.', hint: 'Bây giờ + là + 钟点', explain: '报时用「Bây giờ là + 数字 + giờ」。' },
    ],
  },

  // ===== U2 =====
  {
    id: 's2-1-1', lessonId: 'l2-1', order: 1, tag: 'question',
    vi: 'Em khỏe không?', zh: '你好吗？',
    chunks: [
      { vi: 'Em', zh: '你（晚辈）', role: 'subject', vocabId: 'u2-09' },
      { vi: 'khỏe', zh: '健康 / 好', role: 'predicate', vocabId: 'u2-15' },
      { vi: 'không', zh: '吗（疑问）', role: 'particle', vocabId: 'u2-16' },
    ],
    note: '对晚辈或自称晚辈时用 em；句尾 không 不重读。',
    exercises: [
      { id: 'se2-1-1', type: 'blank', chunkIndex: 1, answer: 'khỏe', hint: '「健康 / 好」', explain: 'Anh khỏe không? = 你好吗？' },
    ],
  },
  {
    id: 's2-1-2', lessonId: 'l2-1', order: 2, tag: 'statement',
    vi: 'Chị cũng khỏe.', zh: '姐姐也很好。',
    chunks: [
      { vi: 'Chị', zh: '姐姐 / 你（女性）', role: 'subject', vocabId: 'u2-08' },
      { vi: 'cũng khỏe', zh: '也很好', role: 'predicate' },
    ],
    exercises: [],
  },
  {
    id: 's2-1-3', lessonId: 'l2-1', order: 3, tag: 'request',
    vi: 'Rất vui được gặp bạn.', zh: '很高兴认识你。',
    chunks: [
      { vi: 'Rất vui', zh: '很高兴', role: 'predicate', vocabId: 'u2-19' },
      { vi: 'được gặp', zh: '能见到', role: 'predicate', vocabId: 'u2-20' },
      { vi: 'bạn', zh: '你', role: 'object', vocabId: 'u2-06' },
    ],
    note: '初次见面的标准结束语，也可以放在打招呼之后。',
    exercises: [
      { id: 'se2-1-2', type: 'order', answer: [0, 1, 2], explain: 'Rất vui được gặp bạn 是固定寒暄句。' },
    ],
  },

  {
    id: 's2-2-1', lessonId: 'l2-2', order: 1, tag: 'statement',
    vi: 'Tôi là người Trung Quốc.', zh: '我是中国人。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'là', zh: '是', role: 'predicate', vocabId: 'u2-11' },
      { vi: 'người Trung Quốc', zh: '中国人', role: 'object', vocabId: 'u2-13' },
    ],
    exercises: [
      { id: 'se2-2-1', type: 'blank', chunkIndex: 2, answer: 'người Trung Quốc', hint: '「中国人」', explain: '「某国人」= người + 国家名。' },
    ],
  },
  {
    id: 's2-2-2', lessonId: 'l2-2', order: 2, tag: 'statement',
    vi: 'Tôi đến từ Bắc Kinh.', zh: '我来自北京。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'đến từ', zh: '来自', role: 'predicate', vocabId: 'u2-23' },
      { vi: 'Bắc Kinh', zh: '北京', role: 'place' },
    ],
    exercises: [],
  },
  {
    id: 's2-2-3', lessonId: 'l2-2', order: 3, tag: 'question',
    vi: 'Bạn tên là gì?', zh: '你叫什么名字？',
    chunks: [
      { vi: 'Bạn', zh: '你', role: 'subject', vocabId: 'u2-06' },
      { vi: 'tên là gì', zh: '叫什么名字', role: 'predicate', vocabId: 'u2-10' },
    ],
    note: 'gì 放在句尾表「什么」。',
    exercises: [
      { id: 'se2-2-2', type: 'translate', answer: 'Bạn tên là gì?', hint: 'Bạn + tên là gì', explain: '问名字固定说 Bạn tên là gì?。' },
    ],
  },

  {
    id: 's2-3-1', lessonId: 'l2-3', order: 1, tag: 'question',
    vi: 'Bạn có phải là sinh viên không?', zh: '你是大学生吗？',
    chunks: [
      { vi: 'Bạn', zh: '你', role: 'subject', vocabId: 'u2-06' },
      { vi: 'có phải là', zh: '是……吗', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'sinh viên', zh: '大学生', role: 'object', vocabId: 'u2-21' },
      { vi: 'không', zh: '吗', role: 'particle', vocabId: 'u2-16' },
    ],
    exercises: [
      { id: 'se2-3-1', type: 'blank', chunkIndex: 2, answer: 'sinh viên', hint: '「大学生」', explain: 'có phải là … không 是标准是非问句。' },
    ],
  },
  {
    id: 's2-3-2', lessonId: 'l2-3', order: 2, tag: 'statement',
    vi: 'Chị ấy là giáo viên.', zh: '她是教师。',
    chunks: [
      { vi: 'Chị ấy', zh: '她', role: 'subject', vocabId: 'u2-08' },
      { vi: 'là', zh: '是', role: 'predicate' },
      { vi: 'giáo viên', zh: '教师', role: 'object', vocabId: 'u2-22' },
    ],
    exercises: [],
  },
  {
    id: 's2-3-3', lessonId: 'l2-3', order: 3, tag: 'statement',
    vi: 'Tôi là sinh viên năm nhất.', zh: '我是大一学生。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'là', zh: '是', role: 'predicate' },
      { vi: 'sinh viên năm nhất', zh: '大一学生', role: 'object', vocabId: 'u2-21' },
    ],
    exercises: [
      { id: 'se2-3-2', type: 'order', answer: [0, 1, 2], explain: 'năm nhất = 第一年，即大一。' },
    ],
  },

  // ===== U3 =====
  {
    id: 's3-1-1', lessonId: 'l3-1', order: 1, tag: 'statement',
    vi: 'Một tuần có bảy ngày.', zh: '一周有七天。',
    chunks: [
      { vi: 'Một tuần', zh: '一周', role: 'subject', vocabId: 'u3-20' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'bảy ngày', zh: '七天', role: 'object', vocabId: 'u3-07' },
    ],
    note: '21 里的「一」变 mốt，15 里的 năm 变 lăm。',
    exercises: [
      { id: 'se3-1-1', type: 'blank', chunkIndex: 2, answer: 'bảy ngày', hint: '七天，数字用越南语', explain: 'bảy = 七，ngày = 天。' },
    ],
  },
  {
    id: 's3-1-2', lessonId: 'l3-1', order: 2, tag: 'statement',
    vi: 'Hôm nay là thứ hai.', zh: '今天是星期一。',
    chunks: [
      { vi: 'Hôm nay', zh: '今天', role: 'time', vocabId: 'u3-15' },
      { vi: 'là', zh: '是', role: 'predicate' },
      { vi: 'thứ hai', zh: '星期一', role: 'object', vocabId: 'u3-18' },
    ],
    exercises: [],
  },
  {
    id: 's3-1-3', lessonId: 'l3-1', order: 3, tag: 'statement',
    vi: 'Tôi có ba người bạn.', zh: '我有三个朋友。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'có', zh: '有', role: 'predicate' },
      { vi: 'ba người bạn', zh: '三个朋友', role: 'object' },
    ],
    exercises: [
      { id: 'se3-1-2', type: 'translate', answer: 'Tôi có ba người bạn.', hint: 'Tôi + có + ba người bạn', explain: 'ba = 三；数词 + 量词 người + 名词。' },
    ],
  },

  {
    id: 's3-2-1', lessonId: 'l3-2', order: 1, tag: 'statement',
    vi: 'Bây giờ là chín giờ.', zh: '现在是九点。',
    chunks: [
      { vi: 'Bây giờ', zh: '现在', role: 'time', vocabId: 'u3-23' },
      { vi: 'là', zh: '是', role: 'predicate' },
      { vi: 'chín giờ', zh: '九点', role: 'object', vocabId: 'u3-09' },
    ],
    exercises: [
      { id: 'se3-2-1', type: 'blank', chunkIndex: 2, answer: 'chín giờ', hint: '九点，数字用越南语', explain: 'chín = 九，giờ = 点。' },
    ],
  },
  {
    id: 's3-2-2', lessonId: 'l3-2', order: 2, tag: 'statement',
    vi: 'Hôm nay là thứ bảy.', zh: '今天是星期六。',
    chunks: [
      { vi: 'Hôm nay', zh: '今天', role: 'time' },
      { vi: 'là', zh: '是', role: 'predicate' },
      { vi: 'thứ bảy', zh: '星期六', role: 'object' },
    ],
    exercises: [],
  },
  {
    id: 's3-2-3', lessonId: 'l3-2', order: 3, tag: 'question',
    vi: 'Xin lỗi, mấy giờ rồi?', zh: '打扰一下，几点了？',
    chunks: [
      { vi: 'Xin lỗi', zh: '打扰一下', role: 'particle', vocabId: 'u7-17' },
      { vi: 'mấy giờ', zh: '几点', role: 'time', vocabId: 'u3-24' },
      { vi: 'rồi', zh: '了', role: 'particle' },
    ],
    note: '半点用 rưỡi：tám giờ rưỡi = 八点半。',
    exercises: [
      { id: 'se3-2-2', type: 'order', answer: [0, 1, 2], explain: 'mấy giờ rồi? 是问时间最常用的说法。' },
    ],
  },

  {
    id: 's3-3-1', lessonId: 'l3-3', order: 1, tag: 'statement',
    vi: 'Ngày mai là chủ nhật.', zh: '明天是星期天。',
    chunks: [
      { vi: 'Ngày mai', zh: '明天', role: 'time', vocabId: 'u3-16' },
      { vi: 'là', zh: '是', role: 'predicate' },
      { vi: 'chủ nhật', zh: '星期天', role: 'object', vocabId: 'u3-19' },
    ],
    note: '越南语日期顺序是「日-月」，与中文「月-日」相反。',
    exercises: [
      { id: 'se3-3-1', type: 'blank', chunkIndex: 2, answer: 'chủ nhật', hint: '汉越词「主日」', explain: 'chủ nhật = 星期天。' },
    ],
  },
  {
    id: 's3-3-2', lessonId: 'l3-3', order: 2, tag: 'statement',
    vi: 'Ngày mai tôi đi Hà Nội.', zh: '明天我去河内。',
    chunks: [
      { vi: 'Ngày mai', zh: '明天', role: 'time', vocabId: 'u3-16' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'đi', zh: '去', role: 'predicate', vocabId: 'u7-01' },
      { vi: 'Hà Nội', zh: '河内', role: 'place', vocabId: 'u2-24' },
    ],
    exercises: [],
  },
  {
    id: 's3-3-3', lessonId: 'l3-3', order: 3, tag: 'statement',
    vi: 'Hôm qua trời mưa.', zh: '昨天下雨了。',
    chunks: [
      { vi: 'Hôm qua', zh: '昨天', role: 'time', vocabId: 'u3-17' },
      { vi: 'trời mưa', zh: '下雨', role: 'predicate' },
    ],
    exercises: [
      { id: 'se3-3-2', type: 'translate', answer: 'Hôm qua trời mưa.', hint: 'Hôm qua + trời mưa', explain: '时间词放句首，动词不需要变形。' },
    ],
  },

  // ===== U4 =====
  {
    id: 's4-1-1', lessonId: 'l4-1', order: 1, tag: 'statement',
    vi: 'Gia đình tôi có bốn người.', zh: '我家有四口人。',
    chunks: [
      { vi: 'Gia đình tôi', zh: '我家', role: 'subject', vocabId: 'u4-01' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'bốn người', zh: '四口人', role: 'object', vocabId: 'u4-08' },
    ],
    exercises: [
      { id: 'se4-1-1', type: 'blank', chunkIndex: 2, answer: 'bốn người', hint: '四口人：数字 + người', explain: '表达「有」必须用 có。' },
    ],
  },
  {
    id: 's4-1-2', lessonId: 'l4-1', order: 2, tag: 'statement',
    vi: 'Tôi có một anh trai.', zh: '我有一个哥哥。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'có', zh: '有', role: 'predicate' },
      { vi: 'một anh trai', zh: '一个哥哥', role: 'object', vocabId: 'u4-04' },
    ],
    exercises: [],
  },
  {
    id: 's4-1-3', lessonId: 'l4-1', order: 3, tag: 'question',
    vi: 'Bạn có anh chị không?', zh: '你有哥哥姐姐吗？',
    chunks: [
      { vi: 'Bạn', zh: '你', role: 'subject' },
      { vi: 'có', zh: '有', role: 'predicate' },
      { vi: 'anh chị', zh: '哥哥姐姐', role: 'object' },
      { vi: 'không', zh: '吗', role: 'particle' },
    ],
    exercises: [
      { id: 'se4-1-2', type: 'order', answer: [0, 1, 2, 3], explain: 'có … không 是标准是非问句。' },
    ],
  },

  {
    id: 's4-2-1', lessonId: 'l4-2', order: 1, tag: 'statement',
    vi: 'Tôi dậy lúc sáu giờ.', zh: '我六点起床。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'dậy', zh: '起床', role: 'predicate', vocabId: 'u4-10' },
      { vi: 'lúc sáu giờ', zh: '六点', role: 'time', vocabId: 'u3-13' },
    ],
    exercises: [
      { id: 'se4-2-1', type: 'blank', chunkIndex: 2, answer: 'lúc sáu giờ', hint: 'lúc + 钟点', explain: '时刻前用介词 lúc。' },
    ],
  },
  {
    id: 's4-2-2', lessonId: 'l4-2', order: 2, tag: 'statement',
    vi: 'Bố tôi đi làm lúc tám giờ.', zh: '我爸爸八点上班。',
    chunks: [
      { vi: 'Bố tôi', zh: '我爸爸', role: 'subject', vocabId: 'u4-02' },
      { vi: 'đi làm', zh: '上班', role: 'predicate', vocabId: 'u4-12' },
      { vi: 'lúc tám giờ', zh: '八点', role: 'time' },
    ],
    exercises: [],
  },
  {
    id: 's4-2-3', lessonId: 'l4-2', order: 3, tag: 'statement',
    vi: 'Tối tôi ngủ lúc mười một giờ.', zh: '晚上我十一点睡觉。',
    chunks: [
      { vi: 'Tối', zh: '晚上', role: 'time' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'ngủ', zh: '睡觉', role: 'predicate', vocabId: 'u4-09' },
      { vi: 'lúc mười một giờ', zh: '十一点', role: 'time' },
    ],
    exercises: [
      { id: 'se4-2-2', type: 'translate', answer: 'Bố tôi đi làm lúc tám giờ.', hint: 'Bố tôi + đi làm + lúc tám giờ', explain: '主语 + 动词 + lúc + 时刻。' },
    ],
  },

  {
    id: 's4-3-1', lessonId: 'l4-3', order: 1, tag: 'statement',
    vi: 'Mỗi ngày tôi học tiếng Việt.', zh: '每天我学越南语。',
    chunks: [
      { vi: 'Mỗi ngày', zh: '每天', role: 'time', vocabId: 'u4-15' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'học', zh: '学习', role: 'predicate', vocabId: 'u4-13' },
      { vi: 'tiếng Việt', zh: '越南语', role: 'object', vocabId: 'u1-10' },
    ],
    exercises: [
      { id: 'se4-3-1', type: 'blank', chunkIndex: 3, answer: 'tiếng Việt', hint: '「越南语」', explain: 'học tiếng Việt = 学越南语。' },
    ],
  },
  {
    id: 's4-3-2', lessonId: 'l4-3', order: 2, tag: 'statement',
    vi: 'Tôi thường dậy sớm.', zh: '我通常起得早。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'thường', zh: '通常', role: 'modifier', vocabId: 'u4-16' },
      { vi: 'dậy sớm', zh: '起得早', role: 'predicate', vocabId: 'u4-10' },
    ],
    exercises: [],
  },
  {
    id: 's4-3-3', lessonId: 'l4-3', order: 3, tag: 'statement',
    vi: 'Tôi hay xem phim cuối tuần.', zh: '我周末经常看电影。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'hay', zh: '经常', role: 'modifier' },
      { vi: 'xem phim', zh: '看电影', role: 'predicate', vocabId: 'u4-14' },
      { vi: 'cuối tuần', zh: '周末', role: 'time' },
    ],
    exercises: [
      { id: 'se4-3-2', type: 'order', answer: [0, 1, 2, 3], explain: 'hay（经常）放在主语和动词之间。' },
    ],
  },

  // ===== U5 =====
  {
    id: 's5-1-1', lessonId: 'l5-1', order: 1, tag: 'statement',
    vi: 'Tôi muốn mua một cái áo.', zh: '我想买一件上衣。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'muốn mua', zh: '想买', role: 'predicate', vocabId: 'u8-15' },
      { vi: 'một cái áo', zh: '一件上衣', role: 'object', vocabId: 'u5-11' },
    ],
    note: '数词 + 量词 + 名词：một cái áo。',
    exercises: [
      { id: 'se5-1-1', type: 'blank', chunkIndex: 1, answer: 'muốn mua', hint: '「想买」', explain: 'muốn + 动词 = 想做某事。' },
    ],
  },
  {
    id: 's5-1-2', lessonId: 'l5-1', order: 2, tag: 'statement',
    vi: 'Tôi mua hai quyển sách.', zh: '我买两本书。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'mua', zh: '买', role: 'predicate', vocabId: 'u5-09' },
      { vi: 'hai quyển sách', zh: '两本书', role: 'object', vocabId: 'u5-03' },
    ],
    exercises: [],
  },
  {
    id: 's5-1-3', lessonId: 'l5-1', order: 3, tag: 'statement',
    vi: 'Chiếc xe máy này mới.', zh: '这辆摩托车很新。',
    chunks: [
      { vi: 'Chiếc xe máy này', zh: '这辆摩托车', role: 'subject', vocabId: 'u5-02' },
      { vi: 'mới', zh: '新', role: 'predicate' },
    ],
    exercises: [
      { id: 'se5-1-2', type: 'translate', answer: 'Chiếc xe máy này mới.', hint: 'Chiếc xe máy này + mới', explain: 'chiếc 是交通工具的量词。' },
    ],
  },

  {
    id: 's5-2-1', lessonId: 'l5-2', order: 1, tag: 'question',
    vi: 'Cái này bao nhiêu tiền?', zh: '这个多少钱？',
    chunks: [
      { vi: 'Cái này', zh: '这个', role: 'subject', vocabId: 'u5-01' },
      { vi: 'bao nhiêu tiền', zh: '多少钱', role: 'predicate', vocabId: 'u5-04' },
    ],
    note: 'bao nhiêu tiền 是整体固定搭配，不要拆开记。',
    exercises: [
      { id: 'se5-2-1', type: 'blank', chunkIndex: 1, answer: 'bao nhiêu tiền', hint: '「多少钱」', explain: '问价固定说 bao nhiêu tiền?。' },
    ],
  },
  {
    id: 's5-2-2', lessonId: 'l5-2', order: 2, tag: 'statement',
    vi: 'Áo này hai trăm nghìn.', zh: '这件衣服二十万盾。',
    chunks: [
      { vi: 'Áo này', zh: '这件衣服', role: 'subject', vocabId: 'u5-11' },
      { vi: 'hai trăm nghìn', zh: '二十万', role: 'predicate', vocabId: 'u3-11' },
    ],
    exercises: [],
  },
  {
    id: 's5-2-3', lessonId: 'l5-2', order: 3, tag: 'question',
    vi: 'Chị ơi, cái này bao nhiêu tiền?', zh: '大姐，这个多少钱？',
    chunks: [
      { vi: 'Chị ơi', zh: '大姐（招呼）', role: 'particle', vocabId: 'u2-08' },
      { vi: 'cái này', zh: '这个', role: 'subject', vocabId: 'u5-01' },
      { vi: 'bao nhiêu tiền', zh: '多少钱', role: 'predicate' },
    ],
    note: '口语常省 nghìn：năm mươi = 五万盾。',
    exercises: [
      { id: 'se5-2-2', type: 'order', answer: [0, 1, 2], explain: 'chị ơi 用在市场招呼女摊主。' },
    ],
  },

  {
    id: 's5-3-1', lessonId: 'l5-3', order: 1, tag: 'question',
    vi: 'Có màu đen không?', zh: '有黑色的吗？',
    chunks: [
      { vi: 'Có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'màu đen', zh: '黑色', role: 'object', vocabId: 'u5-13' },
      { vi: 'không', zh: '吗', role: 'particle', vocabId: 'u2-16' },
    ],
    exercises: [
      { id: 'se5-3-1', type: 'blank', chunkIndex: 1, answer: 'màu đen', hint: '「黑色」', explain: '颜色放 màu 后：màu đen。' },
    ],
  },
  {
    id: 's5-3-2', lessonId: 'l5-3', order: 2, tag: 'question',
    vi: 'Tôi có thể thử không?', zh: '我可以试试吗？',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'có thể', zh: '可以', role: 'predicate', vocabId: 'u8-16' },
      { vi: 'thử', zh: '试', role: 'predicate', vocabId: 'u5-17' },
      { vi: 'không', zh: '吗', role: 'particle' },
    ],
    exercises: [],
  },
  {
    id: 's5-3-3', lessonId: 'l5-3', order: 3, tag: 'exclaim',
    vi: 'Áo này chật quá.', zh: '这件衣服太紧了。',
    chunks: [
      { vi: 'Áo này', zh: '这件衣服', role: 'subject', vocabId: 'u5-11' },
      { vi: 'chật quá', zh: '太紧了', role: 'predicate' },
    ],
    exercises: [
      { id: 'se5-3-2', type: 'translate', answer: 'Áo này chật quá.', hint: 'Áo này + chật quá', explain: 'quá 放在形容词后表「太……」。' },
    ],
  },

  // ===== U6 =====
  {
    id: 's6-1-1', lessonId: 'l6-1', order: 1, tag: 'statement',
    vi: 'Tôi uống cà phê sữa đá.', zh: '我喝冰奶咖啡。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'uống', zh: '喝', role: 'predicate', vocabId: 'u6-02' },
      { vi: 'cà phê sữa đá', zh: '冰奶咖啡', role: 'object', vocabId: 'u6-05' },
    ],
    exercises: [
      { id: 'se6-1-1', type: 'blank', chunkIndex: 2, answer: 'cà phê sữa đá', hint: '「冰奶咖啡」', explain: '喝 = uống，吃 = ăn。' },
    ],
  },
  {
    id: 's6-1-2', lessonId: 'l6-1', order: 2, tag: 'statement',
    vi: 'Phở Hà Nội rất ngon.', zh: '河内河粉很好吃。',
    chunks: [
      { vi: 'Phở Hà Nội', zh: '河内河粉', role: 'subject', vocabId: 'u6-03' },
      { vi: 'rất ngon', zh: '很好吃', role: 'predicate', vocabId: 'u6-08' },
    ],
    exercises: [],
  },
  {
    id: 's6-1-3', lessonId: 'l6-1', order: 3, tag: 'statement',
    vi: 'Sáng tôi ăn phở.', zh: '早上我吃河粉。',
    chunks: [
      { vi: 'Sáng', zh: '早上', role: 'time' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'ăn', zh: '吃', role: 'predicate', vocabId: 'u6-01' },
      { vi: 'phở', zh: '河粉', role: 'object', vocabId: 'u6-03' },
    ],
    exercises: [
      { id: 'se6-1-2', type: 'order', answer: [0, 1, 2, 3], explain: '时间词放句首。' },
    ],
  },

  {
    id: 's6-2-1', lessonId: 'l6-2', order: 1, tag: 'request',
    vi: 'Cho tôi một phở bò.', zh: '给我一碗牛肉河粉。',
    chunks: [
      { vi: 'Cho tôi', zh: '给我', role: 'predicate', vocabId: 'u6-11' },
      { vi: 'một phở bò', zh: '一碗牛肉河粉', role: 'object', vocabId: 'u6-03' },
    ],
    exercises: [
      { id: 'se6-2-1', type: 'blank', chunkIndex: 1, answer: 'một phở bò', hint: '数量 + 菜名', explain: 'cho tôi + 数量 + 菜名是点餐核心句型。' },
    ],
  },
  {
    id: 's6-2-2', lessonId: 'l6-2', order: 2, tag: 'request',
    vi: 'Em ơi, tính tiền!', zh: '服务员，结账！',
    chunks: [
      { vi: 'Em ơi', zh: '服务员（招呼）', role: 'particle' },
      { vi: 'tính tiền', zh: '结账', role: 'predicate', vocabId: 'u6-13' },
    ],
    exercises: [],
  },
  {
    id: 's6-2-3', lessonId: 'l6-2', order: 3, tag: 'request',
    vi: 'Cho tôi xem thực đơn.', zh: '给我看看菜单。',
    chunks: [
      { vi: 'Cho tôi', zh: '给我', role: 'predicate' },
      { vi: 'xem', zh: '看', role: 'predicate' },
      { vi: 'thực đơn', zh: '菜单', role: 'object', vocabId: 'u6-12' },
    ],
    exercises: [
      { id: 'se6-2-2', type: 'translate', answer: 'Cho tôi xem thực đơn.', hint: 'Cho tôi + xem + thực đơn', explain: '点餐开场白。' },
    ],
  },

  {
    id: 's6-3-1', lessonId: 'l6-3', order: 1, tag: 'statement',
    vi: 'Tôi thích ăn cay.', zh: '我喜欢吃辣。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'thích', zh: '喜欢', role: 'predicate', vocabId: 'u8-06' },
      { vi: 'ăn cay', zh: '吃辣', role: 'object', vocabId: 'u6-09' },
    ],
    exercises: [
      { id: 'se6-3-1', type: 'blank', chunkIndex: 2, answer: 'ăn cay', hint: '「吃辣」', explain: 'thích 后直接跟动词，不需要变形。' },
    ],
  },
  {
    id: 's6-3-2', lessonId: 'l6-3', order: 2, tag: 'negative',
    vi: 'Tôi không ăn được cay.', zh: '我吃不了辣。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'không ăn được', zh: '吃不了', role: 'predicate' },
      { vi: 'cay', zh: '辣', role: 'object', vocabId: 'u6-09' },
    ],
    exercises: [],
  },
  {
    id: 's6-3-3', lessonId: 'l6-3', order: 3, tag: 'statement',
    vi: 'Tôi no rồi, cảm ơn.', zh: '我饱了，谢谢。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'no rồi', zh: '饱了', role: 'predicate', vocabId: 'u6-18' },
      { vi: 'cảm ơn', zh: '谢谢', role: 'particle', vocabId: 'u2-03' },
    ],
    exercises: [
      { id: 'se6-3-2', type: 'order', answer: [0, 1, 2], explain: 'no rồi = 已经饱了，是被劝菜时的礼貌推辞。' },
    ],
  },

  // ===== U7 =====
  {
    id: 's7-1-1', lessonId: 'l7-1', order: 1, tag: 'question',
    vi: 'Nhà vệ sinh ở đâu?', zh: '洗手间在哪里？',
    chunks: [
      { vi: 'Nhà vệ sinh', zh: '洗手间', role: 'subject' },
      { vi: 'ở đâu', zh: '在哪里', role: 'predicate', vocabId: 'u7-03' },
    ],
    exercises: [
      { id: 'se7-1-1', type: 'blank', chunkIndex: 1, answer: 'ở đâu', hint: '「在哪里」', explain: '… ở đâu? 是问路万能句。' },
    ],
  },
  {
    id: 's7-1-2', lessonId: 'l7-1', order: 2, tag: 'request',
    vi: 'Đi thẳng rồi rẽ trái.', zh: '直走，然后左转。',
    chunks: [
      { vi: 'Đi thẳng', zh: '直走', role: 'predicate', vocabId: 'u7-09' },
      { vi: 'rồi', zh: '然后', role: 'particle' },
      { vi: 'rẽ trái', zh: '左转', role: 'predicate', vocabId: 'u7-06' },
    ],
    exercises: [],
  },
  {
    id: 's7-1-3', lessonId: 'l7-1', order: 3, tag: 'statement',
    vi: 'Hồ Gươm ở gần đây.', zh: '还剑湖就在附近。',
    chunks: [
      { vi: 'Hồ Gươm', zh: '还剑湖', role: 'subject' },
      { vi: 'ở gần đây', zh: '在附近', role: 'predicate', vocabId: 'u7-04' },
    ],
    exercises: [
      { id: 'se7-1-2', type: 'translate', answer: 'Hồ Gươm ở gần đây.', hint: 'Hồ Gươm + ở gần đây', explain: 'gần đây = 这附近。' },
    ],
  },

  {
    id: 's7-2-1', lessonId: 'l7-2', order: 1, tag: 'statement',
    vi: 'Tôi đi làm bằng xe buýt.', zh: '我坐公交上班。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'đi làm', zh: '上班', role: 'predicate', vocabId: 'u4-12' },
      { vi: 'bằng xe buýt', zh: '坐公交', role: 'place', vocabId: 'u7-11' },
    ],
    exercises: [
      { id: 'se7-2-1', type: 'blank', chunkIndex: 2, answer: 'bằng xe buýt', hint: 'bằng + 交通工具', explain: '交通方式用介词 bằng。' },
    ],
  },
  {
    id: 's7-2-2', lessonId: 'l7-2', order: 2, tag: 'statement',
    vi: 'Đến sân bay mất bốn mươi phút.', zh: '到机场要四十分钟。',
    chunks: [
      { vi: 'Đến sân bay', zh: '到机场', role: 'place', vocabId: 'u7-16' },
      { vi: 'mất', zh: '花费', role: 'predicate', vocabId: 'u7-18' },
      { vi: 'bốn mươi phút', zh: '四十分钟', role: 'time', vocabId: 'u3-14' },
    ],
    exercises: [],
  },
  {
    id: 's7-2-3', lessonId: 'l7-2', order: 3, tag: 'statement',
    vi: 'Đi bộ mất mười phút.', zh: '走路要十分钟。',
    chunks: [
      { vi: 'Đi bộ', zh: '走路', role: 'predicate' },
      { vi: 'mất', zh: '花费', role: 'predicate' },
      { vi: 'mười phút', zh: '十分钟', role: 'time' },
    ],
    exercises: [
      { id: 'se7-2-2', type: 'order', answer: [0, 1, 2], explain: 'mất + 时间 = 花费多久；只有 đi bộ 不用 bằng。' },
    ],
  },

  {
    id: 's7-3-1', lessonId: 'l7-3', order: 1, tag: 'statement',
    vi: 'Tôi đã đặt phòng.', zh: '我订了房。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'đã', zh: '已经', role: 'modifier', vocabId: 'u8-09' },
      { vi: 'đặt phòng', zh: '订房', role: 'predicate' },
    ],
    exercises: [
      { id: 'se7-3-1', type: 'blank', chunkIndex: 2, answer: 'đặt phòng', hint: '「订房」', explain: 'đặt phòng 订房、trả phòng 退房。' },
    ],
  },
  {
    id: 's7-3-2', lessonId: 'l7-3', order: 2, tag: 'question',
    vi: 'Bạn có thể giúp tôi không?', zh: '你能帮我吗？',
    chunks: [
      { vi: 'Bạn', zh: '你', role: 'subject' },
      { vi: 'có thể', zh: '能', role: 'predicate', vocabId: 'u8-16' },
      { vi: 'giúp tôi', zh: '帮我', role: 'predicate' },
      { vi: 'không', zh: '吗', role: 'particle' },
    ],
    exercises: [],
  },
  {
    id: 's7-3-3', lessonId: 'l7-3', order: 3, tag: 'question',
    vi: 'Khách sạn này có wifi không?', zh: '这家酒店有 wifi 吗？',
    chunks: [
      { vi: 'Khách sạn này', zh: '这家酒店', role: 'subject', vocabId: 'u7-15' },
      { vi: 'có', zh: '有', role: 'predicate' },
      { vi: 'wifi', zh: 'wifi', role: 'object' },
      { vi: 'không', zh: '吗', role: 'particle' },
    ],
    exercises: [
      { id: 'se7-3-2', type: 'translate', answer: 'Khách sạn này có wifi không?', hint: 'Khách sạn này + có + wifi + không', explain: 'có … không 表「有没有」。' },
    ],
  },

  // ===== U8 =====
  {
    id: 's8-1-1', lessonId: 'l8-1', order: 1, tag: 'statement',
    vi: 'Tôi là kỹ sư phần mềm.', zh: '我是软件工程师。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'là', zh: '是', role: 'predicate' },
      { vi: 'kỹ sư phần mềm', zh: '软件工程师', role: 'object', vocabId: 'u8-03' },
    ],
    exercises: [
      { id: 'se8-1-1', type: 'blank', chunkIndex: 2, answer: 'kỹ sư phần mềm', hint: '汉越词「技师」', explain: 'kỹ sư = 工程师。' },
    ],
  },
  {
    id: 's8-1-2', lessonId: 'l8-1', order: 2, tag: 'question',
    vi: 'Bạn làm ở đâu?', zh: '你在哪里上班？',
    chunks: [
      { vi: 'Bạn', zh: '你', role: 'subject' },
      { vi: 'làm', zh: '做 / 工作', role: 'predicate', vocabId: 'u8-01' },
      { vi: 'ở đâu', zh: '在哪里', role: 'place', vocabId: 'u7-03' },
    ],
    exercises: [],
  },
  {
    id: 's8-1-3', lessonId: 'l8-1', order: 3, tag: 'statement',
    vi: 'Tôi làm ở bệnh viện.', zh: '我在医院工作。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'làm', zh: '工作', role: 'predicate' },
      { vi: 'ở bệnh viện', zh: '在医院', role: 'place' },
    ],
    exercises: [
      { id: 'se8-1-2', type: 'order', answer: [0, 1, 2], explain: 'làm ở + 地点 = 在某地工作。' },
    ],
  },

  {
    id: 's8-2-1', lessonId: 'l8-2', order: 1, tag: 'statement',
    vi: 'Tôi thích đọc sách.', zh: '我喜欢读书。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'thích', zh: '喜欢', role: 'predicate', vocabId: 'u8-06' },
      { vi: 'đọc sách', zh: '读书', role: 'object', vocabId: 'u8-07' },
    ],
    exercises: [
      { id: 'se8-2-1', type: 'blank', chunkIndex: 2, answer: 'đọc sách', hint: '「读书」', explain: 'thích + 动词原形。' },
    ],
  },
  {
    id: 's8-2-2', lessonId: 'l8-2', order: 2, tag: 'statement',
    vi: 'Sở thích của tôi là du lịch.', zh: '我的爱好是旅游。',
    chunks: [
      { vi: 'Sở thích của tôi', zh: '我的爱好', role: 'subject', vocabId: 'u8-05' },
      { vi: 'là', zh: '是', role: 'predicate' },
      { vi: 'du lịch', zh: '旅游', role: 'object', vocabId: 'u8-08' },
    ],
    exercises: [],
  },
  {
    id: 's8-2-3', lessonId: 'l8-2', order: 3, tag: 'statement',
    vi: 'Tối nay tôi bận.', zh: '今晚我忙。',
    chunks: [
      { vi: 'Tối nay', zh: '今晚', role: 'time' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'bận', zh: '忙', role: 'predicate', vocabId: 'u8-17' },
    ],
    note: 'rảnh（有空）↔ bận（忙）。',
    exercises: [
      { id: 'se8-2-2', type: 'translate', answer: 'Tối nay tôi bận.', hint: 'Tối nay + tôi + bận', explain: '时间词放句首即可。' },
    ],
  },

  {
    id: 's8-3-1', lessonId: 'l8-3', order: 1, tag: 'statement',
    vi: 'Tôi đã ăn rồi.', zh: '我已经吃过了。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'đã ăn', zh: '已经吃了', role: 'predicate', vocabId: 'u8-09' },
      { vi: 'rồi', zh: '了', role: 'particle' },
    ],
    exercises: [
      { id: 'se8-3-1', type: 'blank', chunkIndex: 1, answer: 'đã ăn', hint: '过去标记 đã + 吃', explain: 'đã … rồi = 已经……了。' },
    ],
  },
  {
    id: 's8-3-2', lessonId: 'l8-3', order: 2, tag: 'statement',
    vi: 'Tôi đang học tiếng Việt.', zh: '我正在学越南语。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'đang học', zh: '正在学', role: 'predicate', vocabId: 'u8-10' },
      { vi: 'tiếng Việt', zh: '越南语', role: 'object', vocabId: 'u1-10' },
    ],
    exercises: [],
  },
  {
    id: 's8-3-3', lessonId: 'l8-3', order: 3, tag: 'statement',
    vi: 'Năm sau tôi sẽ đến Việt Nam.', zh: '明年我要去越南。',
    chunks: [
      { vi: 'Năm sau', zh: '明年', role: 'time', vocabId: 'u8-14' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'sẽ đến', zh: '将要到', role: 'predicate', vocabId: 'u8-11' },
      { vi: 'Việt Nam', zh: '越南', role: 'place', vocabId: 'u2-14' },
    ],
    note: 'đã / đang / sẽ 都放在动词前。',
    exercises: [
      { id: 'se8-3-2', type: 'order', answer: [0, 1, 2, 3], explain: 'sẽ + 动词 = 将来。' },
    ],
  },
];

SENTENCES.push(...EXTRA_SENTENCES);

export let SENTENCE_IDS: string[] = SENTENCES.map((s) => s.id);
export const sentenceById: Map<string, Sentence> = new Map(SENTENCES.map((s) => [s.id, s]));

export function setSentences(items: Sentence[]): void {
  SENTENCES = items;
  SENTENCE_IDS = items.map((s) => s.id);
  sentenceById.clear();
  for (const item of items) sentenceById.set(item.id, item);
}

export function sentencesOfLesson(lessonId: string): Sentence[] {
  return SENTENCES.filter((s) => s.lessonId === lessonId).sort((a, b) => a.order - b.order);
}

export function exercisesOfLesson(lessonId: string) {
  return sentencesOfLesson(lessonId).flatMap((s) => s.exercises);
}
