import type { Unit, Lesson } from './types';
import { EXTRA_LESSONS } from './content-extra';

export let UNITS: Unit[] = [
  { id: 'a1-u1', level: 'A1', order: 1, title: '发音与字母', subtitle: '29 个字母、6 个声调、难发音突破', lessonIds: ['l1-1', 'l1-2', 'l1-3', 'l1-4'] },
  { id: 'a1-u2', level: 'A1', order: 2, title: '问候与自我介绍', subtitle: '称呼体系、问好、国籍与职业', lessonIds: ['l2-1', 'l2-2', 'l2-3'] },
  { id: 'a1-u3', level: 'A1', order: 3, title: '数字、时间与日期', subtitle: '数字、钟点、星期与日期表达', lessonIds: ['l3-1', 'l3-2', 'l3-3'] },
  { id: 'a1-u4', level: 'A1', order: 4, title: '家庭与日常', subtitle: '家庭成员、日常作息与频率', lessonIds: ['l4-1', 'l4-2', 'l4-3'] },
  { id: 'a2-u5', level: 'A2', order: 5, title: '购物与价格', subtitle: '量词、问价、颜色与试穿', lessonIds: ['l5-1', 'l5-2', 'l5-3'] },
  { id: 'a2-u6', level: 'A2', order: 6, title: '饮食与点餐', subtitle: '美食词汇、点餐句型、口味偏好', lessonIds: ['l6-1', 'l6-2', 'l6-3'] },
  { id: 'a2-u7', level: 'A2', order: 7, title: '出行与问路', subtitle: '方位、交通方式、问路对话', lessonIds: ['l7-1', 'l7-2', 'l7-3'] },
  { id: 'a2-u8', level: 'A2', order: 8, title: '工作、爱好与计划', subtitle: '职业、爱好、过去现在将来', lessonIds: ['l8-1', 'l8-2', 'l8-3'] },
];

export let LESSONS: Lesson[] = [
  // ===== U1 =====
  {
    id: 'l1-1', unitId: 'a1-u1', order: 1, title: '29 个字母',
    goals: ['认识越南语 29 个字母', '分清有帽子的元音 ă â ê ô ơ ư', '记住 đ 和 d 是两个字母'],
    vocabIds: ['u1-01', 'u1-03', 'u1-04', 'u1-10', 'u1-12'],
    grammar: [{
      id: 'g1-1', title: '越南语字母 = 拉丁字母 + 变音符号',
      explanation: '越南语用拉丁字母书写，共 29 个字母。在英文 26 个字母基础上去掉 f、j、w、z，增加 ă、â、đ、ê、ô、ơ、ư 七个带符号字母。每个字母就是一个音，拼写和发音基本一一对应，比英语规律得多。',
      examples: [
        { vi: 'a, ă, â', zh: '三个不同的 a' },
        { vi: 'd, đ', zh: '两个不同的 d，发音完全不同' },
      ],
      tips: ['đ 是独立字母，不是 d 加了符号', '排序和查词典时 ă â đ ê ô ơ ư 各占一个位置'],
    }],
    dialogues: [{
      id: 'd1-1', title: '课堂问答',
      lines: [
        { speaker: '老师', vi: 'Tiếng Việt có bao nhiêu chữ cái?', zh: '越南语有多少个字母？' },
        { speaker: '学生', vi: 'Có hai mươi chín chữ cái.', zh: '有 29 个字母。' },
      ],
    }],
    exercises: [
      { id: 'e1-1-1', type: 'choice', prompt: '越南语一共有多少个字母？', options: ['26 个', '29 个', '32 个', '24 个'], answer: 1, explain: '26 个拉丁字母减去 f、j、w、z，加上 ă、â、đ、ê、ô、ơ、ư，共 29 个。' },
      { id: 'e1-1-2', type: 'choice', prompt: '下面哪个是越南语特有的字母？', audioText: 'đờ', options: ['d', 'đ', 'f', 'j'], answer: 1, explain: 'đ（读 /ɗ/）是越南语特有字母；f、j 在越南语中基本不用。' },
      { id: 'e1-1-3', type: 'fill', prompt: '用中文回答：越南语字母表里，â 这类字母上的符号叫什么？（提示：两个字，越南语叫 dấu）', answer: '符号', accept: ['变音符号', '声调符号', '帽'], hint: '也写作「帽」，比如 ô 戴了一顶帽子', explain: '元音上的 ^ ◠ 等叫 dấu（符号），与声调符号不同。' },
    ],
  },
  {
    id: 'l1-2', unitId: 'a1-u1', order: 2, title: '六个声调',
    goals: ['分辨 6 个声调的调型', '用普通话四声找到体感', '分清 hỏi 和 ngã'],
    vocabIds: ['u1-02', 'u1-05', 'u1-06', 'u1-07', 'u1-11'],
    grammar: [{
      id: 'g1-2', title: '6 个声调 ↔ 普通话体感对照',
      explanation: '越南语 6 个声调中，ngang（平）≈一声、sắc（锐）≈二声、huyền（玄）≈四声、hỏi（问）≈三声；ngã（跌）像三声中间喉头断一下；nặng（重）短促低降、戛然而止。调号写在元音上（重声点在下面）。',
      examples: [
        { vi: 'ma / má / mà / mả / mã / mạ', zh: '鬼 / 妈妈 / 但是 / 坟墓 / 马（借）/ 秧苗' },
        { vi: 'ba / bà', zh: '三 / 奶奶' },
      ],
      tips: ['同一个 ma 六个调六个意思，声调就是词义的一部分', 'hỏi 和 ngã 最容易混：ngã 中间有喉塞的「顿挫」'],
    }],
    dialogues: [{
      id: 'd1-2', title: '声调游戏',
      lines: [
        { speaker: '老师', vi: 'Nghe kỹ: ba hay bà?', zh: '仔细听：ba 还是 bà？' },
        { speaker: '学生', vi: 'Bà — bà của em.', zh: '是 bà——我的奶奶。' },
      ],
    }],
    exercises: [
      { id: 'e1-2-1', type: 'choice', prompt: '「má」的调型最接近普通话几声？', audioText: 'má', options: ['一声', '二声', '三声', '四声'], answer: 1, explain: 'má 是 sắc 锐声，上扬，接近二声。' },
      { id: 'e1-2-2', type: 'choice', prompt: '「mả」和「mã」的区别在于？', options: ['元音不同', 'mã 中间有喉部顿挫', '辅音不同', '没有区别'], answer: 1, explain: '两者都是先降后升，但 ngã（mã）中间有喉塞断裂感。' },
      { id: 'e1-2-3', type: 'fill', prompt: '听音选词：请打出你听到的词（鬼 / 妈妈 / 但是 / 秧苗，用拼音标调式写法）', audioText: 'mạ', answer: 'mạ', hint: '短促低降，戛然而止', explain: 'mạ 是 nặng 重声，调号点在元音下方。' },
    ],
  },
  {
    id: 'l1-3', unitId: 'a1-u1', order: 3, title: '声母难点',
    goals: ['读准浊音 b 和 đ', '学会舌根鼻音 ng 开头', '分清 t（不送气）和 th（送气）'],
    vocabIds: ['u1-06', 'u1-08', 'u1-11', 'u2-15', 'u2-16'],
    grammar: [{
      id: 'g1-3', title: '中文母语者四大声母坎',
      explanation: 'b /ɓ/、đ /ɗ/ 是浊音，发音时声带先振动；普通话的 b、d 其实是不送气清音，别套用。ng /ŋ/ 在中文只做韵尾（昂 ang），越南语可以放开头。t /t/ 不送气，像普通话 d；th /tʰ/ 才是送气的「特」。',
      examples: [
        { vi: 'ba / đi', zh: '三 / 去（浊音开头）' },
        { vi: 'nghe / nghi', zh: '听 / 怀疑（ng 开头）' },
        { vi: 'tôi / thôi', zh: '我（不送气）/ 算了（送气）' },
      ],
      tips: ['把手放在喉咙上：发 b/đ 时声带先振动', '练 ng 开头：先说「昂」，再把开头的 ng 单独拿出来'],
    }],
    dialogues: [{
      id: 'd1-3', title: '纠音',
      lines: [
        { speaker: 'A', vi: 'Tôi đi.', zh: '我去。（误读成送气 t）' },
        { speaker: 'B', vi: 'Không, tôi — t không có hơi.', zh: '不对，tôi——t 不送气。' },
        { speaker: 'A', vi: 'À, tôi đi. Đúng không?', zh: '啊，tôi đi。对了吗？' },
        { speaker: 'B', vi: 'Đúng rồi!', zh: '对了！' },
      ],
    }],
    exercises: [
      { id: 'e1-3-1', type: 'choice', prompt: '听音：这个词的声母是浊音还是清音？', audioText: 'đi', options: ['浊音 đ', '清音 t', '送气 th', '鼻音 n'], answer: 0, explain: 'đi 的 đ 是浊内爆音 /ɗ/。' },
      { id: 'e1-3-2', type: 'choice', prompt: '「tôi」的 t 应该怎么读？', audioText: 'tôi', options: ['像「偷」的 t（送气）', '像「都」的 d（不送气）', '像「口」的 k', '鼻音'], answer: 1, explain: '越南语 t 不送气，听感接近普通话的 d。' },
      { id: 'e1-3-3', type: 'fill', prompt: '听音打词（提示：听 / 声母是 ng）', audioText: 'nghe', answer: 'nghe', hint: '意思是「听」', explain: 'nghe /ŋe/，舌根鼻音开头。' },
    ],
  },
  {
    id: 'l1-4', unitId: 'a1-u1', order: 4, title: '韵母与标调',
    goals: ['读准 ơ 和 ư', '学会 -p -t -k 闭口音尾', '掌握标调优先级'],
    vocabIds: ['u1-05', 'u1-07', 'u1-08', 'u1-09', 'u1-11'],
    grammar: [{
      id: 'g1-4', title: '标调优先级与闭口韵尾',
      explanation: '标调：有带符元音（ê ơ â ô ă ư）就标它；没有则标主要元音；qu 和 gi 视为一个辅音，标在后面的元音上（quyển 标在 ê 上）。闭口韵尾 -p -t -k 收尾时气流突然截断，不爆破，类似粤语入声。',
      examples: [
        { vi: 'tiếng Việt / quyển / giờ', zh: '标调位置示范' },
        { vi: 'họp / một / học', zh: '闭口音尾，戛然而止' },
      ],
      tips: ['ơ 和 ô 只差圆唇：ô 圆、ơ 扁', 'ư 和 u 同理：u 圆、ư 扁，想想「资」的韵母'],
    }],
    dialogues: [],
    exercises: [
      { id: 'e1-4-1', type: 'choice', prompt: '「quyển」的声调符号应该标在哪个字母上？', options: ['q 上', 'u 上', 'y 上', 'ê 上'], answer: 3, explain: 'qu 视为一个辅音，且 ê 是带符元音，标在 ê 上。' },
      { id: 'e1-4-2', type: 'choice', prompt: '听音：这是 ơ 还是 ô？', audioText: 'phở', options: ['ơ（扁唇）', 'ô（圆唇）'], answer: 0, explain: 'phở 是 ơ，嘴唇不圆。' },
      { id: 'e1-4-3', type: 'fill', prompt: '听音打词（提示：数字「一」，闭口 -t 尾）', audioText: 'một', answer: 'một', hint: '气流在 t 处突然截断', explain: 'một，闭口音尾 -t̚ 不爆破。' },
    ],
  },

  // ===== U2 =====
  {
    id: 'l2-1', unitId: 'a1-u2', order: 1, title: '打招呼与称呼',
    goals: ['会用 xin chào 打招呼', '分清 anh / chị / em 的用法', '会回应 cảm ơn'],
    vocabIds: ['u2-01', 'u2-02', 'u2-03', 'u2-04', 'u2-07', 'u2-08', 'u2-09', 'u2-15', 'u2-16'],
    grammar: [{
      id: 'g2-1', title: '越南语的「你」不是一个词',
      explanation: '越南语没有通用的「你」，称呼取决于对方年龄和性别：anh（对稍年长男性）、chị（对稍年长女性）、em（对年幼者）、ông/bà（对长辈）。自称也随对方变化：对 anh 自称 em，对 em 自称 anh/chị。不确定时用 bạn（平辈）。',
      examples: [
        { vi: 'Chào anh!', zh: '你好！（对年轻男性）' },
        { vi: 'Em chào chị!', zh: '姐姐好！（晚辈对女性）' },
      ],
      tips: ['中文一句「你好」，越南语要先判断对方是谁', '初见长辈用 con/cháu 自称更礼貌'],
    }],
    dialogues: [{
      id: 'd2-1', title: '早晨问候',
      lines: [
        { speaker: 'Minh', vi: 'Chào chị Lan!', zh: '兰姐好！' },
        { speaker: 'Lan', vi: 'Chào em Minh! Em khỏe không?', zh: '明弟好！你好吗？' },
        { speaker: 'Minh', vi: 'Em khỏe, cảm ơn chị. Còn chị?', zh: '我很好，谢谢姐。姐呢？' },
        { speaker: 'Lan', vi: 'Chị cũng khỏe.', zh: '我也很好。' },
      ],
    }],
    exercises: [
      { id: 'e2-1-1', type: 'choice', prompt: '对一位 25 岁女性同事打招呼，应该说：', options: ['Chào anh!', 'Chào chị!', 'Chào em!', 'Chào ông!'], answer: 1, explain: '对稍年长的年轻女性用 chị。' },
      { id: 'e2-1-2', type: 'choice', prompt: '听音，这句话是对谁说的？', audioText: 'Chào em!', options: ['对长辈', '对平辈男性', '对年幼者', '对老师'], answer: 2, explain: 'em 用于称呼年幼者或晚辈。' },
      { id: 'e1-2-3b', type: 'fill', prompt: '补全对话：Chào anh! Anh ___ không?（你好吗）', answer: 'khỏe', hint: '「健康/好」', explain: 'Anh khỏe không? = 你好吗？' },
    ],
  },
  {
    id: 'l2-2', unitId: 'a1-u2', order: 2, title: '自我介绍',
    goals: ['会用 Tôi là… 介绍自己', '会说国籍：người Trung Quốc', '会问对方名字'],
    vocabIds: ['u2-05', 'u2-06', 'u2-10', 'u2-11', 'u2-12', 'u2-13', 'u2-14', 'u2-21', 'u2-23', 'u2-24'],
    grammar: [{
      id: 'g2-2', title: '自我介绍三连：là / đến từ / tên là',
      explanation: '「Tôi là + 名字」我是某某；「Tôi là người + 国家」我是某国人；「Tôi đến từ + 城市」我来自某地。问名字：Bạn tên là gì?（你叫什么名字？）',
      examples: [
        { vi: 'Tôi là Minh. Tôi là người Trung Quốc.', zh: '我叫明。我是中国人。' },
        { vi: 'Tôi đến từ Bắc Kinh.', zh: '我来自北京。' },
      ],
      tips: ['người + 国家名 = 某国人：người Việt Nam（越南人）、người Nhật（日本人）'],
    }],
    dialogues: [{
      id: 'd2-2', title: '初次见面',
      lines: [
        { speaker: 'Lan', vi: 'Xin chào! Tôi là Lan.', zh: '你好！我叫兰。' },
        { speaker: '王', vi: 'Chào bạn! Tôi là Vương.', zh: '你好！我姓王。' },
        { speaker: 'Lan', vi: 'Bạn là người nước nào?', zh: '你是哪国人？' },
        { speaker: '王', vi: 'Tôi là người Trung Quốc. Tôi đến từ Bắc Kinh.', zh: '我是中国人，来自北京。' },
      ],
    }],
    exercises: [
      { id: 'e2-2-1', type: 'choice', prompt: '「我是中国人」怎么说？', options: ['Tôi là Trung Quốc.', 'Tôi là người Trung Quốc.', 'Tôi người Trung Quốc.', 'Tôi đến Trung Quốc.'], answer: 1, explain: '「某国人」= người + 国家名，不能省 người。' },
      { id: 'e2-2-2', type: 'fill', prompt: '补全：Tôi đến ___ Bắc Kinh.（我来自北京）', answer: 'từ', hint: 'đến ___ = 来自', explain: 'đến từ + 地名 = 来自某地。' },
      { id: 'e2-2-3', type: 'choice', prompt: '听音，说话人来自哪里？', audioText: 'Tôi đến từ Hà Nội.', options: ['北京', '胡志明市', '河内', '上海'], answer: 2, explain: 'Hà Nội = 河内。' },
    ],
  },
  {
    id: 'l2-3', unitId: 'a1-u2', order: 3, title: '职业与礼貌确认',
    goals: ['会说常见职业', '会用 có…không 提问', '礼貌结束对话'],
    vocabIds: ['u2-17', 'u2-18', 'u2-19', 'u2-20', 'u2-21', 'u2-22', 'u2-04', 'u2-10'],
    grammar: [{
      id: 'g2-3', title: 'có…không 疑问句与职业表达',
      explanation: '用「Bạn có phải là + 职业 + không?」问「你是……吗？」。职业名词：sinh viên（大学生）、giáo viên（教师）、bác sĩ（医生）、kỹ sư（工程师）。回答：Vâng, tôi là… / Không, tôi là…',
      examples: [
        { vi: 'Bạn có phải là sinh viên không?', zh: '你是大学生吗？' },
        { vi: 'Vâng, tôi là sinh viên năm nhất.', zh: '是的，我是大一学生。' },
      ],
      tips: ['Vâng 是礼貌的「是」，对长辈一定要加', '结束对话：Rất vui được gặp bạn（很高兴认识你）'],
    }],
    dialogues: [{
      id: 'd2-3', title: '聊职业',
      lines: [
        { speaker: 'A', vi: 'Bạn có phải là giáo viên không?', zh: '你是老师吗？' },
        { speaker: 'B', vi: 'Không, tôi là sinh viên.', zh: '不是，我是大学生。' },
        { speaker: 'A', vi: 'À, rất vui được gặp bạn!', zh: '啊，很高兴认识你！' },
        { speaker: 'B', vi: 'Tôi cũng rất vui. Tạm biệt!', zh: '我也很高兴。再见！' },
      ],
    }],
    exercises: [
      { id: 'e2-3-1', type: 'choice', prompt: '「你是大学生吗？」的正确说法是：', options: ['Bạn là sinh viên?', 'Bạn có phải là sinh viên không?', 'Bạn sinh viên không?', 'Sinh viên bạn?'], answer: 1, explain: 'có phải là … không 是标准的是非问句结构。' },
      { id: 'e2-3-2', type: 'fill', prompt: '补全：Rất ___ được gặp bạn.（很高兴认识你）', answer: 'vui', hint: '高兴', explain: 'Rất vui được gặp bạn 是初次见面的标准结束语。' },
      { id: 'e2-3-3', type: 'choice', prompt: '「giáo viên」对应的汉字是：', options: ['教员', '教师', '教授', '教练'], answer: 0, explain: 'giáo viên 是汉越词「教员」，泛指教师。' },
    ],
  },

  // ===== U3 =====
  {
    id: 'l3-1', unitId: 'a1-u3', order: 1, title: '数字 1–10',
    goals: ['背熟 1–10', '注意 một / mốt 的变体', '会用数字回答数量'],
    vocabIds: ['u3-01', 'u3-02', 'u3-03', 'u3-04', 'u3-05', 'u3-06', 'u3-07', 'u3-08', 'u3-09', 'u3-10', 'u3-24'],
    grammar: [{
      id: 'g3-1', title: '一到十与变体',
      explanation: 'một hai ba bốn năm sáu bảy tám chín mười。注意：21、31 里的「一」变 mốt（hai mươi mốt），15 变 mười lăm（不是 năm）。越南语数字读写一致，没有英文 eleven 这种例外。',
      examples: [
        { vi: 'hai mươi mốt', zh: '二十一（một → mốt）' },
        { vi: 'mười lăm', zh: '十五（năm → lăm）' },
      ],
      tips: ['một 是闭口音 -t 尾，气流截断要干脆'],
    }],
    dialogues: [{
      id: 'd3-1', title: '数数',
      lines: [
        { speaker: '老师', vi: 'Đếm từ một đến mười.', zh: '从一数到十。' },
        { speaker: '学生', vi: 'Một, hai, ba, bốn, năm, sáu, bảy, tám, chín, mười!', zh: '一二三四五六七八九十！' },
      ],
    }],
    exercises: [
      { id: 'e3-1-1', type: 'choice', prompt: '听音，这是数字几？', audioText: 'bảy', options: ['五', '六', '七', '八'], answer: 2, explain: 'bảy = 七。' },
      { id: 'e3-1-2', type: 'choice', prompt: '「二十一」的正确说法是：', options: ['hai mươi một', 'hai mươi mốt', 'hai một', 'mươi hai một'], answer: 1, explain: '21、31……中的「一」变读 mốt。' },
      { id: 'e3-1-3', type: 'fill', prompt: '写出数字「九」的越南语', answer: 'chín', hint: 'ch 开头', explain: 'chín = 九。' },
    ],
  },
  {
    id: 'l3-2', unitId: 'a1-u3', order: 2, title: '钟点与星期',
    goals: ['会问/答时间', '记住星期一到星期日', '掌握「半」和「刻」'],
    vocabIds: ['u3-13', 'u3-14', 'u3-18', 'u3-19', 'u3-20', 'u3-23', 'u3-24', 'u3-08'],
    grammar: [{
      id: 'g3-2', title: '时间与星期的说法',
      explanation: '问时间：Mấy giờ rồi?（几点了？）回答：Bây giờ là + 数字 + giờ。半点用 rưỡi（tám giờ rưỡi = 八点半）。星期：thứ hai（一）到 thứ bảy（六），星期日是 chủ nhật（主日）。',
      examples: [
        { vi: 'Bây giờ là tám giờ rưỡi.', zh: '现在八点半。' },
        { vi: 'Hôm nay là thứ sáu.', zh: '今天星期五。' },
      ],
      tips: ['thứ hai 字面是「第二」，越南语从星期一算起', 'chủ nhật 是汉越词「主日」'],
    }],
    dialogues: [{
      id: 'd3-2', title: '问时间',
      lines: [
        { speaker: 'A', vi: 'Xin lỗi, mấy giờ rồi?', zh: '打扰一下，几点了？' },
        { speaker: 'B', vi: 'Chín giờ rưỡi.', zh: '九点半。' },
        { speaker: 'A', vi: 'Hôm nay là thứ mấy?', zh: '今天星期几？' },
        { speaker: 'B', vi: 'Thứ bảy.', zh: '星期六。' },
      ],
    }],
    exercises: [
      { id: 'e3-2-1', type: 'choice', prompt: '「星期日」在越南语里是：', options: ['thứ bảy', 'thứ tám', 'chủ nhật', 'thứ một'], answer: 2, explain: '星期日是 chủ nhật（汉越词「主日」），不是 thứ bảy（星期六）。' },
      { id: 'e3-2-2', type: 'choice', prompt: '听音：现在几点？', audioText: 'Bây giờ là tám giờ rưỡi.', options: ['八点', '八点半', '九点', '七点半'], answer: 1, explain: 'rưỡi = 半。' },
      { id: 'e3-2-3', type: 'fill', prompt: '补全：Mấy ___ rồi?（几点了）', answer: 'giờ', hint: '钟点', explain: 'Mấy giờ rồi? 是问时间的标准句。' },
    ],
  },
  {
    id: 'l3-3', unitId: 'a1-u3', order: 3, title: '日期与今天明天',
    goals: ['会说日期（日-月顺序）', '掌握 hôm nay / ngày mai / hôm qua', '会问「几号」'],
    vocabIds: ['u3-15', 'u3-16', 'u3-17', 'u3-21', 'u3-22', 'u3-11', 'u3-12', 'u3-20'],
    grammar: [{
      id: 'g3-3', title: '日期表达：先日后月',
      explanation: '越南语日期顺序是「日-月-年」：ngày 1 tháng 6 = 六月一日。问日期：Hôm nay là ngày bao nhiêu?（今天几号？）时间词放句首或句尾：Hôm nay tôi đi học = Tôi đi học hôm nay。',
      examples: [
        { vi: 'Ngày hai tháng chín là Quốc khánh Việt Nam.', zh: '九月二日是越南国庆。' },
        { vi: 'Ngày mai tôi đi Hà Nội.', zh: '明天我去河内。' },
      ],
      tips: ['与中文「月日」相反，先日后月', '百位以上：một trăm（100）、hai nghìn（2000）'],
    }],
    dialogues: [{
      id: 'd3-3', title: '约时间',
      lines: [
        { speaker: 'A', vi: 'Hôm nay là ngày bao nhiêu?', zh: '今天几号？' },
        { speaker: 'B', vi: 'Ngày mười lăm tháng sáu.', zh: '六月十五号。' },
        { speaker: 'A', vi: 'Ngày mai bạn có rảnh không?', zh: '明天你有空吗？' },
        { speaker: 'B', vi: 'Có, ngày mai là chủ nhật.', zh: '有，明天是星期天。' },
      ],
    }],
    exercises: [
      { id: 'e3-3-1', type: 'choice', prompt: '「六月一日」的正确说法是：', options: ['tháng sáu ngày một', 'ngày một tháng sáu', 'một sáu', 'ngày sáu tháng một'], answer: 1, explain: '先日后月：ngày một tháng sáu。' },
      { id: 'e3-3-2', type: 'fill', prompt: '补全：___ qua trời mưa.（昨天下雨了）', answer: 'Hôm', hint: 'hôm ___ = 昨天', explain: 'hôm qua = 昨天。' },
      { id: 'e3-3-3', type: 'choice', prompt: '听音：说话人什么时候去河内？', audioText: 'Ngày mai tôi đi Hà Nội.', options: ['今天', '昨天', '明天', '下周'], answer: 2, explain: 'ngày mai = 明天。' },
    ],
  },

  // ===== U4 =====
  {
    id: 'l4-1', unitId: 'a1-u4', order: 1, title: '家庭成员',
    goals: ['说出核心家庭成员', '用 có 表达拥有', '介绍家里有几口人'],
    vocabIds: ['u4-01', 'u4-02', 'u4-03', 'u4-04', 'u4-05', 'u4-06', 'u4-07', 'u4-08', 'u4-19', 'u4-20'],
    grammar: [{
      id: 'g4-1', title: '用 có 说「有」',
      explanation: '「有」= có：Gia đình tôi có bốn người（我家有四口人）。问「有没有」= có … không：Bạn có anh chị không?（你有兄弟姐妹吗？）否定：không có（没有）。',
      examples: [
        { vi: 'Tôi có một anh trai và một em gái.', zh: '我有一个哥哥和一个妹妹。' },
        { vi: 'Bạn có em không? — Không, tôi không có em.', zh: '你有弟妹吗？——没有。' },
      ],
      tips: ['anh trai 哥哥、chị gái 姐姐，后面的 trai/gái 表性别'],
    }],
    dialogues: [{
      id: 'd4-1', title: '聊家庭',
      lines: [
        { speaker: 'A', vi: 'Gia đình bạn có mấy người?', zh: '你家有几口人？' },
        { speaker: 'B', vi: 'Có bốn người: bố, mẹ, anh trai và tôi.', zh: '四口人：爸爸、妈妈、哥哥和我。' },
        { speaker: 'A', vi: 'Anh trai bạn bao nhiêu tuổi?', zh: '你哥哥多大？' },
        { speaker: 'B', vi: 'Hai mươi lăm tuổi.', zh: '二十五岁。' },
      ],
    }],
    exercises: [
      { id: 'e4-1-1', type: 'choice', prompt: '「我家有四口人」怎么说？', options: ['Gia đình tôi bốn người.', 'Gia đình tôi có bốn người.', 'Tôi có gia đình bốn.', 'Bốn người có gia đình.'], answer: 1, explain: '表达「有」必须用 có。' },
      { id: 'e4-1-2', type: 'choice', prompt: '「em gái」是：', options: ['弟弟', '妹妹', '女儿', '孙女'], answer: 1, explain: 'em + gái（女）= 妹妹；em trai = 弟弟。' },
      { id: 'e4-1-3', type: 'fill', prompt: '补全：Bạn có anh chị ___?（你有哥哥姐姐吗）', answer: 'không', hint: '疑问句尾', explain: 'có … không 是标准是非问句。' },
    ],
  },
  {
    id: 'l4-2', unitId: 'a1-u4', order: 2, title: '日常作息',
    goals: ['说出一天的作息', '时间状语放句首', '用 lúc 表时刻'],
    vocabIds: ['u4-09', 'u4-10', 'u4-11', 'u4-12', 'u4-13', 'u4-14', 'u3-23', 'u3-13'],
    grammar: [{
      id: 'g4-2', title: '作息表达：主语 + 动词 + lúc + 时刻',
      explanation: '「我六点起床」= Tôi dậy lúc sáu giờ。lúc 引出具体时刻。一天的活动链：dậy（起床）→ ăn sáng（吃早饭）→ đi làm / đi học（上班/上学）→ ăn trưa（午饭）→ về nhà（回家）→ ăn tối（晚饭）→ ngủ（睡觉）。',
      examples: [
        { vi: 'Tôi dậy lúc sáu giờ, rồi ăn sáng.', zh: '我六点起床，然后吃早饭。' },
        { vi: 'Bố tôi đi làm lúc tám giờ.', zh: '我爸爸八点上班。' },
      ],
      tips: ['rồi（然后）可以把动作串成链'],
    }],
    dialogues: [{
      id: 'd4-2', title: '一天的安排',
      lines: [
        { speaker: 'A', vi: 'Bạn dậy lúc mấy giờ?', zh: '你几点起床？' },
        { speaker: 'B', vi: 'Tôi dậy lúc sáu giờ rưỡi.', zh: '我六点半起床。' },
        { speaker: 'A', vi: 'Rồi bạn làm gì?', zh: '然后呢？' },
        { speaker: 'B', vi: 'Ăn sáng, rồi đi học lúc bảy giờ.', zh: '吃早饭，然后七点去上学。' },
      ],
    }],
    exercises: [
      { id: 'e4-2-1', type: 'choice', prompt: '「我十一点睡觉」怎么说？', options: ['Tôi ngủ mười một giờ.', 'Tôi ngủ lúc mười một giờ.', 'Tôi lúc ngủ mười một giờ.', 'Ngủ tôi lúc mười một.'], answer: 1, explain: '时刻前要用介词 lúc。' },
      { id: 'e4-2-2', type: 'choice', prompt: '听音：他几点上班？', audioText: 'Bố tôi đi làm lúc tám giờ.', options: ['七点', '八点', '九点', '八点半'], answer: 1, explain: 'tám giờ = 八点。' },
      { id: 'e4-2-3', type: 'fill', prompt: '补全：Ăn sáng, ___ đi học.（吃完早饭，然后去上学）', answer: 'rồi', hint: '「然后」', explain: 'rồi 连接先后动作。' },
    ],
  },
  {
    id: 'l4-3', unitId: 'a1-u4', order: 3, title: '频率与习惯',
    goals: ['用 mỗi ngày / thường 表频率', '描述自己的习惯', '用 hay 表「经常」'],
    vocabIds: ['u4-15', 'u4-16', 'u4-17', 'u4-18', 'u4-13', 'u4-14', 'u2-18'],
    grammar: [{
      id: 'g4-3', title: '频率副词的位置',
      explanation: 'mỗi ngày（每天）放句首或句尾；thường（通常）、hay（经常）放在主语和动词之间：Tôi thường dậy sớm。频率从高到低：luôn luôn（总是）> thường（通常）> hay（经常）> thỉnh thoảng（偶尔）> hiếm khi（很少）。',
      examples: [
        { vi: 'Mỗi ngày tôi học tiếng Việt ba mươi phút.', zh: '每天我学三十分钟越南语。' },
        { vi: 'Tôi hay xem phim cuối tuần.', zh: '我周末经常看电影。' },
      ],
      tips: ['hay 也是「好、精彩」的意思，看位置区分', 'thỉnh thoảng（偶尔）是汉越词「请详」的讹变，死记即可'],
    }],
    dialogues: [{
      id: 'd4-3', title: '周末干嘛',
      lines: [
        { speaker: 'A', vi: 'Cuối tuần bạn thường làm gì?', zh: '周末你通常干什么？' },
        { speaker: 'B', vi: 'Tôi thường đọc sách ở nhà.', zh: '我通常在家看书。' },
        { speaker: 'A', vi: 'Bạn có hay xem phim không?', zh: '你经常看电影吗？' },
        { speaker: 'B', vi: 'Thỉnh thoảng thôi.', zh: '偶尔而已。' },
      ],
    }],
    exercises: [
      { id: 'e4-3-1', type: 'choice', prompt: '「Tôi thường dậy sớm」中 thường 的位置是：', options: ['句首', '主语和动词之间', '句尾', '动词后'], answer: 1, explain: '频率副词 thường / hay 放在主语和动词之间。' },
      { id: 'e4-3-2', type: 'choice', prompt: '频率最高的是：', options: ['thỉnh thoảng', 'hay', 'thường', 'luôn luôn'], answer: 3, explain: 'luôn luôn = 总是，频率最高。' },
      { id: 'e4-3-3', type: 'fill', prompt: '补全：___ ngày tôi đọc sách.（每天我读书）', answer: 'Mỗi', hint: '「每」', explain: 'mỗi ngày = 每天。' },
    ],
  },

  // ===== U5 =====
  {
    id: 'l5-1', unitId: 'a2-u5', order: 1, title: '量词入门',
    goals: ['掌握 cái / chiếc / quyển', '知道越南语量词不能省', '区分 cái 和 chiếc'],
    vocabIds: ['u5-01', 'u5-02', 'u5-03', 'u5-11', 'u5-12', 'u4-17', 'u7-10'],
    grammar: [{
      id: 'g5-1', title: '越南语量词比中文更「必须」',
      explanation: '数词 + 量词 + 名词：một cái áo（一件上衣）、hai quyển sách（两本书）。cái 是最通用的量词（普通物品）；chiếc 用于单个的、成对中的一只或交通工具（chiếc xe）；quyển/cuốn 用于书本。',
      examples: [
        { vi: 'một cái bàn / hai chiếc dép / ba quyển sách', zh: '一张桌子 / 两只拖鞋 / 三本书' },
        { vi: 'Chiếc xe máy này mới.', zh: '这辆摩托车很新。' },
      ],
      tips: ['拿不准就用 cái，出错率最低', 'con 用于动物和某些物品：con chó（狗）、con dao（刀）'],
    }],
    dialogues: [{
      id: 'd5-1', title: '在商店',
      lines: [
        { speaker: '店员', vi: 'Anh muốn mua gì?', zh: '您想买什么？' },
        { speaker: '客人', vi: 'Tôi muốn mua một cái áo.', zh: '我想买一件上衣。' },
      ],
    }],
    exercises: [
      { id: 'e5-1-1', type: 'choice', prompt: '「两本书」应该说：', options: ['hai sách', 'hai cái sách', 'hai quyển sách', 'hai con sách'], answer: 2, explain: '书的量词是 quyển。' },
      { id: 'e5-1-2', type: 'choice', prompt: '摩托车用哪个量词？', options: ['cái', 'chiếc', 'quyển', 'con'], answer: 1, explain: '交通工具用 chiếc：chiếc xe máy。' },
      { id: 'e5-1-3', type: 'fill', prompt: '补全：một ___ áo（一件上衣）', answer: 'cái', hint: '最通用的量词', explain: '普通物品用 cái。' },
    ],
  },
  {
    id: 'l5-2', unitId: 'a2-u5', order: 2, title: '问价与砍价',
    goals: ['会问 bao nhiêu tiền', '听懂大数字报价', '会说贵/便宜'],
    vocabIds: ['u5-04', 'u5-05', 'u5-06', 'u5-07', 'u5-08', 'u5-09', 'u5-10', 'u3-11', 'u3-12'],
    grammar: [{
      id: 'g5-2', title: '问价与越南盾数字',
      explanation: '问价：Cái này bao nhiêu tiền?（这个多少钱？）越南盾面额大，口语常省 nghìn：năm mươi = 五万盾。报价结构：数字 + nghìn đồng。评价：đắt quá（太贵了）/ rẻ quá（太便宜了）/ quá 表「太」。',
      examples: [
        { vi: 'Áo này hai trăm nghìn.', zh: '这件衣服二十万盾。' },
        { vi: 'Đắt quá! Bớt chút đi.', zh: '太贵了！便宜点吧。' },
      ],
      tips: ['1 人民币 ≈ 3500 盾，心算时除以三千多', 'Bớt đi 是市场砍价万能句'],
    }],
    dialogues: [{
      id: 'd5-2', title: '市场砍价',
      lines: [
        { speaker: '客人', vi: 'Chị ơi, cái này bao nhiêu tiền?', zh: '大姐，这个多少钱？' },
        { speaker: '摊主', vi: 'Một trăm năm mươi nghìn.', zh: '十五万。' },
        { speaker: '客人', vi: 'Đắt quá! Một trăm được không?', zh: '太贵了！十万行吗？' },
        { speaker: '摊主', vi: 'Được rồi, được rồi.', zh: '行吧行吧。' },
      ],
    }],
    exercises: [
      { id: 'e5-2-1', type: 'choice', prompt: '「这个多少钱？」怎么说？', options: ['Cái này mấy tiền?', 'Cái này bao nhiêu tiền?', 'Cái này tiền bao nhiêu?', 'Bao nhiêu cái này?'], answer: 1, explain: 'bao nhiêu tiền 放在名词后。' },
      { id: 'e5-2-2', type: 'choice', prompt: '听音：价格是多少？', audioText: 'Hai trăm nghìn đồng.', options: ['两万盾', '二十万盾', '两百万盾', '两千盾'], answer: 1, explain: 'hai trăm nghìn = 200,000 盾。' },
      { id: 'e5-2-3', type: 'fill', prompt: '补全：Đắt ___!（太贵了）', answer: 'quá', hint: '表示「太」的副词', explain: 'quá 放在形容词后表「太……」。' },
    ],
  },
  {
    id: 'l5-3', unitId: 'a2-u5', order: 3, title: '颜色与试穿',
    goals: ['说出常见颜色', '要求试穿', '表达尺码问题'],
    vocabIds: ['u5-13', 'u5-14', 'u5-15', 'u5-17', 'u5-18', 'u5-11', 'u5-16', 'u2-18'],
    grammar: [{
      id: 'g5-3', title: '颜色与试穿句型',
      explanation: '颜色放在 màu 后：màu đỏ（红）、màu xanh（蓝绿）、màu vàng（黄）、màu đen（黑）、màu trắng（白）。试穿：Tôi có thể thử không?（我可以试试吗？）尺码问题：rộng quá（太肥）、chật quá（太紧）、dài quá（太长）、ngắn quá（太短）、vừa（合身）。',
      examples: [
        { vi: 'Có màu đen không?', zh: '有黑色的吗？' },
        { vi: 'Áo này chật quá, có size lớn hơn không?', zh: '这件太紧，有大一号的吗？' },
      ],
      tips: ['xanh 一个词涵盖蓝和绿：xanh da trời（天蓝）、xanh lá cây（叶绿）'],
    }],
    dialogues: [{
      id: 'd5-3', title: '买衣服',
      lines: [
        { speaker: '客人', vi: 'Áo này có màu đen không?', zh: '这件有黑色的吗？' },
        { speaker: '店员', vi: 'Có. Anh mặc size gì?', zh: '有。您穿什么码？' },
        { speaker: '客人', vi: 'Size L. Tôi có thể thử không?', zh: 'L 码。我可以试吗？' },
        { speaker: '店员', vi: 'Được, phòng thử bên kia.', zh: '可以，试衣间在那边。' },
      ],
    }],
    exercises: [
      { id: 'e5-3-1', type: 'choice', prompt: '「我可以试穿吗？」怎么说？', options: ['Tôi thử không?', 'Tôi có thể thử không?', 'Thử tôi được không?', 'Tôi muốn thử áo.'], answer: 1, explain: 'có thể … không 礼貌地询问许可。' },
      { id: 'e5-3-2', type: 'choice', prompt: '衣服「太紧」是：', options: ['rộng quá', 'chật quá', 'dài quá', 'vừa'], answer: 1, explain: 'chật = 紧；rộng = 宽松。' },
      { id: 'e5-3-3', type: 'fill', prompt: '补全：Có màu ___ không?（有红色的吗）', answer: 'đỏ', hint: '红色', explain: 'màu đỏ = 红色。' },
    ],
  },

  // ===== U6 =====
  {
    id: 'l6-1', unitId: 'a2-u6', order: 1, title: '越南美食词汇',
    goals: ['认识 phở、cơm、cà phê', '会说吃喝', '描述味道'],
    vocabIds: ['u6-01', 'u6-02', 'u6-03', 'u6-04', 'u6-05', 'u6-06', 'u6-07', 'u6-08'],
    grammar: [{
      id: 'g6-1', title: '吃喝与招牌美食',
      explanation: 'ăn（吃）+ 食物，uống（喝）+ 饮品。必会美食：phở（河粉）、bánh mì（法包）、cơm（米饭）、bún（米线）、cà phê sữa đá（冰奶咖啡）、trà đá（冰茶）。味道：ngon（好吃）、cay（辣）、ngọt（甜）、chua（酸）、mặn（咸）。',
      examples: [
        { vi: 'Phở bò là món ăn nổi tiếng của Việt Nam.', zh: '牛肉河粉是越南名菜。' },
        { vi: 'Sáng tôi uống cà phê sữa đá.', zh: '早上我喝冰奶咖啡。' },
      ],
      tips: ['phở 的 ơ 不圆唇，别读成「佛」', 'bánh mì 源自法国法棍，汉越词「饼面」'],
    }],
    dialogues: [{
      id: 'd6-1', title: '聊美食',
      lines: [
        { speaker: 'A', vi: 'Bạn đã ăn phở chưa?', zh: '你吃过河粉了吗？' },
        { speaker: 'B', vi: 'Rồi! Phở rất ngon.', zh: '吃过了！河粉很好吃。' },
        { speaker: 'A', vi: 'Bạn thích uống gì?', zh: '你喜欢喝什么？' },
        { speaker: 'B', vi: 'Tôi thích uống cà phê sữa đá.', zh: '我喜欢喝冰奶咖啡。' },
      ],
    }],
    exercises: [
      { id: 'e6-1-1', type: 'choice', prompt: '「喝咖啡」的动词用：', options: ['ăn', 'uống', 'dùng', 'hít'], answer: 1, explain: '喝 = uống；吃 = ăn。' },
      { id: 'e6-1-2', type: 'choice', prompt: '听音：他点了什么？', audioText: 'Cho tôi một phở bò.', options: ['牛肉河粉', '鸡肉米线', '冰咖啡', '法包'], answer: 0, explain: 'phở bò = 牛肉河粉。' },
      { id: 'e6-1-3', type: 'fill', prompt: '补全：Món này ___ quá!（这个菜太好吃了）', answer: 'ngon', hint: '好吃', explain: 'ngon quá = 太好吃了。' },
    ],
  },
  {
    id: 'l6-2', unitId: 'a2-u6', order: 2, title: '点餐实战',
    goals: ['用 cho tôi 点餐', '看懂菜单结构', '会结账'],
    vocabIds: ['u6-11', 'u6-12', 'u6-13', 'u6-14', 'u6-15', 'u6-16', 'u6-17'],
    grammar: [{
      id: 'g6-2', title: '点餐三连',
      explanation: '进店：Cho tôi xem thực đơn（给我看菜单）。点单：Cho tôi + 数量 + 菜名（Cho tôi một phở bò）。结账：Tính tiền! 或 Em ơi, tính tiền!（服务员，买单！）。不要辣：không cay / ít cay thôi。',
      examples: [
        { vi: 'Cho tôi hai cơm gà, một trà đá.', zh: '给我两份鸡饭、一杯冰茶。' },
        { vi: 'Ít cay thôi, cảm ơn.', zh: '少放辣，谢谢。' },
      ],
      tips: ['叫服务员：em ơi（对年轻人）/ anh ơi / chị ơi', 'quán 是街边小馆，nhà hàng 是正式餐厅'],
    }],
    dialogues: [{
      id: 'd6-2', title: '在河粉店',
      lines: [
        { speaker: '客人', vi: 'Em ơi, cho anh xem thực đơn.', zh: '服务员，给我看下菜单。' },
        { speaker: '店员', vi: 'Vâng, đây ạ.', zh: '好的，给您。' },
        { speaker: '客人', vi: 'Cho tôi một phở bò, ít hành.', zh: '给我一碗牛肉河粉，少放葱。' },
        { speaker: '店员', vi: 'Vâng. Anh có uống gì không?', zh: '好。您喝点什么吗？' },
        { speaker: '客人', vi: 'Một trà đá. Cảm ơn em.', zh: '一杯冰茶。谢谢。' },
      ],
    }],
    exercises: [
      { id: 'e6-2-1', type: 'choice', prompt: '结账时喊：', options: ['Xin lỗi!', 'Tính tiền!', 'Cho tôi!', 'Bao nhiêu!'], answer: 1, explain: 'Tính tiền = 结账/买单。' },
      { id: 'e6-2-2', type: 'fill', prompt: '补全：Cho ___ một phở bò.（给我一碗牛肉河粉）', answer: 'tôi', hint: 'cho ___ = 给我', explain: 'cho tôi + 数量 + 菜名是点餐核心句型。' },
      { id: 'e6-2-3', type: 'choice', prompt: '「少放辣」是：', options: ['không cay', 'ít cay thôi', 'cay quá', 'nhiều cay'], answer: 1, explain: 'ít … thôi = 少一点……就好。' },
    ],
  },
  {
    id: 'l6-3', unitId: 'a2-u6', order: 3, title: '口味与偏好',
    goals: ['表达喜欢/不喜欢', '说出口味偏好', '招待与回应'],
    vocabIds: ['u6-09', 'u6-10', 'u6-18', 'u6-08', 'u8-06', 'u6-16', 'u6-17', 'u2-18'],
    grammar: [{
      id: 'g6-3', title: '表达偏好：thích / không thích / không ăn được',
      explanation: 'Tôi thích + 名词/动词（我喜欢……）；Tôi không thích …（不喜欢）；Tôi không ăn được cay（我吃不了辣，được 表能力）。请客：Mời bạn ăn cơm（请你吃饭）。回应：Tôi no rồi, cảm ơn（我饱了，谢谢）。',
      examples: [
        { vi: 'Tôi thích ăn cay nhưng không thích ngọt.', zh: '我喜欢吃辣但不喜欢甜。' },
        { vi: 'Tôi không uống được bia.', zh: '我喝不了酒。' },
      ],
      tips: ['được 放动词后表「能/可以」', '被劝菜时 Tôi no rồi 是礼貌推辞'],
    }],
    dialogues: [{
      id: 'd6-3', title: '口味调查',
      lines: [
        { speaker: 'A', vi: 'Bạn có ăn được cay không?', zh: '你能吃辣吗？' },
        { speaker: 'B', vi: 'Được, tôi thích cay lắm!', zh: '能，我超爱辣！' },
        { speaker: 'A', vi: 'Còn đồ ngọt?', zh: '那甜食呢？' },
        { speaker: 'B', vi: 'Tôi không thích ngọt lắm.', zh: '我不太喜欢甜的。' },
      ],
    }],
    exercises: [
      { id: 'e6-3-1', type: 'choice', prompt: '「我吃不了辣」怎么说？', options: ['Tôi không thích cay.', 'Tôi không ăn được cay.', 'Tôi không ăn cay được.', 'Cay tôi không ăn.'], answer: 1, explain: 'không … được 表能力，「吃不了」；không thích 是「不喜欢」。' },
      { id: 'e6-3-2', type: 'fill', prompt: '补全：Tôi ___ rồi, cảm ơn.（我饱了，谢谢）', answer: 'no', hint: '饱', explain: 'no rồi = 已经饱了。' },
      { id: 'e6-3-3', type: 'choice', prompt: '听音：他喜欢什么口味？', audioText: 'Tôi thích ăn cay.', options: ['甜', '辣', '酸', '咸'], answer: 1, explain: 'cay = 辣。' },
    ],
  },

  // ===== U7 =====
  {
    id: 'l7-1', unitId: 'a2-u7', order: 1, title: '问路与方位',
    goals: ['会问 ở đâu', '听懂指路：rẽ trái/phải', '会说远近'],
    vocabIds: ['u7-01', 'u7-03', 'u7-04', 'u7-05', 'u7-06', 'u7-07', 'u7-08', 'u7-09', 'u7-17'],
    grammar: [{
      id: 'g7-1', title: '问路三件套',
      explanation: '开场：Xin lỗi（打扰一下）。询问：… ở đâu?（……在哪里？）。指路：đi thẳng（直走）、rẽ trái（左转）、rẽ phải（右转）、ở bên trái/phải（在左/右边）、gần đây（附近）、xa lắm（很远）。',
      examples: [
        { vi: 'Xin lỗi, nhà vệ sinh ở đâu?', zh: '打扰一下，洗手间在哪？' },
        { vi: 'Đi thẳng, rồi rẽ trái.', zh: '直走，然后左转。' },
      ],
      tips: ['越南语右是 phải，和中文同音联想「排右」', 'ngã tư（十字路口）、ngã ba（三岔口）'],
    }],
    dialogues: [{
      id: 'd7-1', title: '问路',
      lines: [
        { speaker: '游客', vi: 'Xin lỗi, hồ Gươm ở đâu?', zh: '打扰一下，还剑湖在哪？' },
        { speaker: '路人', vi: 'Đi thẳng đường này, rồi rẽ phải.', zh: '沿这条路直走，然后右转。' },
        { speaker: '游客', vi: 'Xa không ạ?', zh: '远吗？' },
        { speaker: '路人', vi: 'Không xa, gần đây thôi.', zh: '不远，就在附近。' },
      ],
    }],
    exercises: [
      { id: 'e7-1-1', type: 'choice', prompt: '「左转」是：', options: ['đi thẳng', 'rẽ trái', 'rẽ phải', 'quay lại'], answer: 1, explain: 'rẽ trái = 左转；rẽ phải = 右转。' },
      { id: 'e7-1-2', type: 'fill', prompt: '补全：Nhà vệ sinh ___ đâu?（洗手间在哪里）', answer: 'ở', hint: '「在」', explain: '… ở đâu? 是问路万能句。' },
      { id: 'e7-1-3', type: 'choice', prompt: '听音：指路人说怎么走？', audioText: 'Đi thẳng, rồi rẽ phải.', options: ['直走右转', '直走左转', '右转直走', '掉头'], answer: 0, explain: 'đi thẳng 直走，rẽ phải 右转。' },
    ],
  },
  {
    id: 'l7-2', unitId: 'a2-u7', order: 2, title: '交通方式',
    goals: ['说出常见交通工具', '用 bằng 表方式', '会说花多少时间'],
    vocabIds: ['u7-10', 'u7-11', 'u7-12', 'u7-13', 'u7-16', 'u7-18', 'u7-02', 'u3-14'],
    grammar: [{
      id: 'g7-2', title: 'đi bằng + 交通工具',
      explanation: '交通方式用 bằng：đi bằng xe máy（骑摩托去）、đi bằng xe buýt（坐公交）、đi bộ（走路，例外不加 bằng）。耗时：mất + 时间：Đi bộ mất mười phút（走路要十分钟）。',
      examples: [
        { vi: 'Tôi đi làm bằng xe buýt.', zh: '我坐公交上班。' },
        { vi: 'Đến sân bay mất bốn mươi phút.', zh: '到机场要四十分钟。' },
      ],
      tips: ['只有 đi bộ（步行）不用 bằng', '越南街头最多的是 xe máy（摩托车）'],
    }],
    dialogues: [{
      id: 'd7-2', title: '怎么去机场',
      lines: [
        { speaker: 'A', vi: 'Đến sân bay bằng gì?', zh: '去机场坐什么？' },
        { speaker: 'B', vi: 'Bạn có thể đi bằng taxi.', zh: '你可以坐出租车。' },
        { speaker: 'A', vi: 'Mất bao lâu?', zh: '要多久？' },
        { speaker: 'B', vi: 'Mất khoảng bốn mươi phút.', zh: '大约四十分钟。' },
      ],
    }],
    exercises: [
      { id: 'e7-2-1', type: 'choice', prompt: '「坐公交上班」怎么说？', options: ['Đi làm xe buýt.', 'Đi làm bằng xe buýt.', 'Đi làm bộ xe buýt.', 'Bằng đi làm xe buýt.'], answer: 1, explain: '方式用介词 bằng。' },
      { id: 'e7-2-2', type: 'choice', prompt: '哪个短语表示「花费时间」？', options: ['làm', 'mất', 'mua', 'mở'], answer: 1, explain: 'mất + 时间 = 花费多久。' },
      { id: 'e7-2-3', type: 'fill', prompt: '补全：Đi bộ ___ mười phút.（走路要十分钟）', answer: 'mất', hint: '花费', explain: 'mất + 时长。' },
    ],
  },
  {
    id: 'l7-3', unitId: 'a2-u7', order: 3, title: '酒店与求助',
    goals: ['酒店入住基本对话', '礼貌请求帮助', '看懂地图词汇'],
    vocabIds: ['u7-15', 'u7-14', 'u7-17', 'u7-05', 'u7-04', 'u8-16', 'u7-02'],
    grammar: [{
      id: 'g7-3', title: '礼貌请求：Cho tôi hỏi / Làm ơn',
      explanation: '求助句型：Cho tôi hỏi…（请问……）、Làm ơn + 动词（劳驾……）、Bạn có thể giúp tôi không?（你能帮我吗？）。酒店：đặt phòng（订房）、nhận phòng（入住）、trả phòng（退房）、phòng đơn/đôi（单/双人间）。',
      examples: [
        { vi: 'Cho tôi hỏi, khách sạn này có wifi không?', zh: '请问这家酒店有 wifi 吗？' },
        { vi: 'Tôi đã đặt phòng đôi.', zh: '我订了一间双人间。' },
      ],
      tips: ['làm ơn 比 xin lỗi 更正式', '护照 = hộ chiếu（汉越词「护照」）'],
    }],
    dialogues: [{
      id: 'd7-3', title: '酒店前台',
      lines: [
        { speaker: '客人', vi: 'Xin chào, tôi đã đặt phòng.', zh: '你好，我订了房。' },
        { speaker: '前台', vi: 'Vâng, tên anh là gì?', zh: '好的，您贵姓？' },
        { speaker: '客人', vi: 'Vương. Phòng đôi, hai đêm.', zh: '王。双人间，两晚。' },
        { speaker: '前台', vi: 'Vâng, phòng 502. Đây là chìa khóa.', zh: '好的，502 房。这是钥匙。' },
      ],
    }],
    exercises: [
      { id: 'e7-3-1', type: 'choice', prompt: '「我订了房」怎么说？', options: ['Tôi muốn phòng.', 'Tôi đã đặt phòng.', 'Tôi có phòng.', 'Tôi trả phòng.'], answer: 1, explain: 'đặt phòng = 订房；trả phòng = 退房。' },
      { id: 'e7-3-2', type: 'choice', prompt: '「hộ chiếu」对应的汉字是：', options: ['户籍', '护照', '会照', '户照'], answer: 1, explain: 'hộ chiếu = 护照，汉越词。' },
      { id: 'e7-3-3', type: 'fill', prompt: '补全：Bạn có ___ giúp tôi không?（你能帮我吗）', answer: 'thể', hint: 'có ___ = 能', explain: 'có thể = 可以、能。' },
    ],
  },

  // ===== U8 =====
  {
    id: 'l8-1', unitId: 'a2-u8', order: 1, title: '职业与工作',
    goals: ['说出常见职业', '介绍自己的工作', '用 ở 表工作地点'],
    vocabIds: ['u8-01', 'u8-02', 'u8-03', 'u8-04', 'u2-22', 'u4-12', 'u8-17'],
    grammar: [{
      id: 'g8-1', title: '谈工作：làm gì / làm ở đâu',
      explanation: '问职业：Bạn làm nghề gì? / Bạn làm công việc gì?（你做什么工作？）回答：Tôi là + 职业。工作地点：Tôi làm ở + 地点（Tôi làm ở công ty phần mềm 我在软件公司上班）。',
      examples: [
        { vi: 'Anh ấy là kỹ sư phần mềm.', zh: '他是软件工程师。' },
        { vi: 'Tôi làm ở bệnh viện.', zh: '我在医院工作。' },
      ],
      tips: ['很多职业是汉越词：kỹ sư 技师、bác sĩ 博士（医生）、luật sư 律师'],
    }],
    dialogues: [{
      id: 'd8-1', title: '谈工作',
      lines: [
        { speaker: 'A', vi: 'Bạn làm công việc gì?', zh: '你做什么工作？' },
        { speaker: 'B', vi: 'Tôi là kỹ sư phần mềm.', zh: '我是软件工程师。' },
        { speaker: 'A', vi: 'Bạn làm ở đâu?', zh: '你在哪上班？' },
        { speaker: 'B', vi: 'Tôi làm ở một công ty ở Hà Nội.', zh: '我在河内一家公司上班。' },
      ],
    }],
    exercises: [
      { id: 'e8-1-1', type: 'choice', prompt: '「你在哪上班？」怎么说？', options: ['Bạn làm gì?', 'Bạn làm ở đâu?', 'Bạn ở đâu làm?', 'Làm bạn ở đâu?'], answer: 1, explain: 'làm ở + 地点 = 在某地工作。' },
      { id: 'e8-1-2', type: 'choice', prompt: '「luật sư」是：', options: ['老师', '律师', '医生', '会计'], answer: 1, explain: 'luật sư = 律师（汉越词）。' },
      { id: 'e8-1-3', type: 'fill', prompt: '补全：Tôi là kỹ ___ phần mềm.（软件工程师）', answer: 'sư', hint: 'kỹ ___ = 技师', explain: 'kỹ sư = 工程师（汉越词「技师」）。' },
    ],
  },
  {
    id: 'l8-2', unitId: 'a2-u8', order: 2, title: '爱好与闲暇',
    goals: ['说出自己的爱好', '问别人的爱好', '表达有空/忙'],
    vocabIds: ['u8-05', 'u8-06', 'u8-07', 'u8-08', 'u8-17', 'u8-18', 'u6-08', 'u4-14'],
    grammar: [{
      id: 'g8-2', title: 'thích + 动词原形',
      explanation: '爱好句型：Sở thích của tôi là…（我的爱好是……）；Tôi thích + 动词/名词：Tôi thích đọc sách（我喜欢读书）、Tôi thích du lịch（我喜欢旅游）。问：Sở thích của bạn là gì? / Bạn thích làm gì?',
      examples: [
        { vi: 'Tôi thích nghe nhạc và xem phim.', zh: '我喜欢听音乐和看电影。' },
        { vi: 'Cuối tuần rảnh, tôi hay đi du lịch.', zh: '周末有空，我常去旅游。' },
      ],
      tips: ['thích 后直接跟动词，不需要任何变化', 'rảnh（有空）↔ bận（忙）是一对反义词'],
    }],
    dialogues: [{
      id: 'd8-2', title: '聊爱好',
      lines: [
        { speaker: 'A', vi: 'Sở thích của bạn là gì?', zh: '你的爱好是什么？' },
        { speaker: 'B', vi: 'Tôi thích đọc sách và du lịch.', zh: '我喜欢读书和旅游。' },
        { speaker: 'A', vi: 'Tối nay bạn rảnh không?', zh: '今晚你有空吗？' },
        { speaker: 'B', vi: 'Xin lỗi, tối nay tôi bận.', zh: '抱歉，今晚我忙。' },
      ],
    }],
    exercises: [
      { id: 'e8-2-1', type: 'choice', prompt: '「我喜欢读书」怎么说？', options: ['Tôi thích đọc sách.', 'Tôi thích đọc sách thích.', 'Tôi đọc sách thích.', 'Thích tôi đọc sách.'], answer: 0, explain: 'thích + 动词原形。' },
      { id: 'e8-2-2', type: 'choice', prompt: '「有空」的反义词是：', options: ['vui', 'bận', 'mệt', 'no'], answer: 1, explain: 'rảnh（有空）↔ bận（忙）。' },
      { id: 'e8-2-3', type: 'fill', prompt: '补全：Sở thích của tôi là du ___.（我的爱好是旅游）', answer: 'lịch', hint: 'du ___ = 游历', explain: 'du lịch = 旅游（汉越词「游历」）。' },
    ],
  },
  {
    id: 'l8-3', unitId: 'a2-u8', order: 3, title: '过去、现在、将来',
    goals: ['用 đã / đang / sẽ 表时态', '说出未来计划', '对比中越时态表达'],
    vocabIds: ['u8-09', 'u8-10', 'u8-11', 'u8-12', 'u8-13', 'u8-14', 'u8-15', 'u8-16'],
    grammar: [{
      id: 'g8-3', title: '三个时间标记：đã / đang / sẽ',
      explanation: '越南语动词不变形，用时间标记：đã + 动词（已经……了，过去）、đang + 动词（正在……，进行）、sẽ + 动词（将要……，将来）。和中文「了/着/过」类似但更简单。计划：kế hoạch của tôi là… / Tôi sẽ…',
      examples: [
        { vi: 'Tôi đã ăn rồi.', zh: '我已经吃过了。' },
        { vi: 'Tôi đang học tiếng Việt.', zh: '我正在学越南语。' },
        { vi: 'Năm sau tôi sẽ đến Việt Nam.', zh: '明年我要去越南。' },
      ],
      tips: ['三个标记都放在动词前', 'rồi 常和 đã 搭配，加强「已完成」'],
    }],
    dialogues: [{
      id: 'd8-3', title: '未来计划',
      lines: [
        { speaker: 'A', vi: 'Bạn đang làm gì đấy?', zh: '你在干嘛呢？' },
        { speaker: 'B', vi: 'Tôi đang học tiếng Việt.', zh: '我在学越南语。' },
        { speaker: 'A', vi: 'Tuần sau bạn có kế hoạch gì?', zh: '下周你有什么计划？' },
        { speaker: 'B', vi: 'Tôi sẽ đi Hà Nội công tác.', zh: '我要去河内出差。' },
      ],
    }],
    exercises: [
      { id: 'e8-3-1', type: 'choice', prompt: '「我正在学越南语」怎么说？', options: ['Tôi đã học tiếng Việt.', 'Tôi đang học tiếng Việt.', 'Tôi sẽ học tiếng Việt.', 'Tôi học đang tiếng Việt.'], answer: 1, explain: 'đang + 动词 = 正在进行。' },
      { id: 'e8-3-2', type: 'choice', prompt: '听音：说话人什么时候去越南？', audioText: 'Năm sau tôi sẽ đến Việt Nam.', options: ['去年', '现在', '明年', '下周'], answer: 2, explain: 'năm sau = 明年，sẽ = 将要。' },
      { id: 'e8-3-3', type: 'fill', prompt: '补全：Tôi ___ ăn rồi.（我已经吃过了）', answer: 'đã', hint: '过去标记', explain: 'đã … rồi = 已经……了。' },
    ],
  },
];

for (const lesson of LESSONS) {
  const extra = EXTRA_LESSONS[lesson.id];
  if (!extra) continue;
  lesson.vocabIds.push(...extra.vocabIds);
  lesson.grammar.push(...extra.grammar);
  lesson.dialogues.push(...extra.dialogues);
  lesson.exercises.push(...extra.exercises);
}

export const lessonById: Map<string, Lesson> = new Map(LESSONS.map((l) => [l.id, l]));
export const unitById: Map<string, Unit> = new Map(UNITS.map((u) => [u.id, u]));

export function setCurriculum(units: Unit[], lessons: Lesson[]): void {
  UNITS = units;
  LESSONS = lessons;
  unitById.clear();
  for (const unit of units) unitById.set(unit.id, unit);
  lessonById.clear();
  for (const lesson of lessons) lessonById.set(lesson.id, lesson);
}

export function getNextLesson(lessonId: string): Lesson | null {
  const idx = LESSONS.findIndex((l) => l.id === lessonId);
  return idx >= 0 && idx < LESSONS.length - 1 ? LESSONS[idx + 1] : null;
}

export function getPrevLesson(lessonId: string): Lesson | null {
  const idx = LESSONS.findIndex((l) => l.id === lessonId);
  return idx > 0 ? LESSONS[idx - 1] : null;
}

export function unitOfLesson(lesson: Lesson): Unit | undefined {
  return unitById.get(lesson.unitId);
}

export function unitProgress(unit: Unit, completed: string[]): { done: number; total: number } {
  const done = unit.lessonIds.filter((id) => completed.includes(id)).length;
  return { done, total: unit.lessonIds.length };
}
