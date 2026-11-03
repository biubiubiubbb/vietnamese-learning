import type { Dialogue, Exercise, GrammarPoint, Sentence, VocabItem } from './types';

export interface LessonExtra {
  vocabIds: string[];
  grammar: GrammarPoint[];
  dialogues: Dialogue[];
  exercises: Exercise[];
}

export const EXTRA_VOCAB: VocabItem[] = [
  // ===== U1 发音（补充概念词） =====
  { id: 'u1-13', vi: 'bảng chữ cái', zh: '字母表', pos: 'n', tags: ['grammar'], example: { vi: 'Bảng chữ cái tiếng Việt có 29 chữ.', zh: '越南语字母表有 29 个字母。' } },
  { id: 'u1-14', vi: 'chữ hoa', zh: '大写字母', pos: 'n', tags: ['grammar'], example: { vi: 'Tên riêng viết bằng chữ hoa.', zh: '专有名词用大写字母写。' } },
  { id: 'u1-15', vi: 'chữ thường', zh: '小写字母', pos: 'n', tags: ['grammar'], example: { vi: 'Câu này viết toàn chữ thường.', zh: '这句话全用小写字母。' } },
  { id: 'u1-16', vi: 'âm tiết', zh: '音节', pos: 'n', tags: ['grammar'], example: { vi: 'Mỗi âm tiết có một thanh điệu.', zh: '每个音节有一个声调。' } },
  { id: 'u1-17', vi: 'từ', zh: '词 / 单词', pos: 'n', tags: ['grammar', 'core'], example: { vi: 'Từ này nghĩa là gì?', zh: '这个词是什么意思？' } },
  { id: 'u1-18', vi: 'dấu sắc', zh: '锐声（二声）调号', pos: 'n', tags: ['grammar'], example: { vi: 'Tiếng Việt có dấu sắc.', zh: '越南语有锐声调号。' } },
  { id: 'u1-19', vi: 'dấu huyền', zh: '玄声（四声）调号', pos: 'n', tags: ['grammar'], example: { vi: 'Dấu huyền nằm trên chữ a.', zh: '玄声调号标在 a 上。' } },
  { id: 'u1-20', vi: 'dấu hỏi', zh: '问声（三声）调号', pos: 'n', tags: ['grammar'], example: { vi: 'Chữ ê có dấu hỏi.', zh: 'ê 上有问声调号。' } },
  { id: 'u1-21', vi: 'dấu ngã', zh: '跌声调号', pos: 'n', tags: ['grammar'], example: { vi: 'Dấu ngã khó phát âm.', zh: '跌声调号很难发音。' } },
  { id: 'u1-22', vi: 'dấu nặng', zh: '重声调号', pos: 'n', tags: ['grammar'], example: { vi: 'Dấu nặng nằm dưới chữ a.', zh: '重声调号标在 a 下方。' } },
  { id: 'u1-23', vi: 'âm', zh: '音 / 声音', pos: 'n', tags: ['grammar'], example: { vi: 'Âm này rất khó nghe.', zh: '这个音很难听清。' } },
  { id: 'u1-24', vi: 'giọng', zh: '嗓音 / 口音', pos: 'n', tags: ['grammar'], example: { vi: 'Giọng của cô ấy rất hay.', zh: '她的嗓音很好听。' } },
  { id: 'u1-25', vi: 'chuẩn', zh: '标准的', pos: 'adj', tags: ['grammar'], example: { vi: 'Phát âm của bạn rất chuẩn.', zh: '你的发音很标准。' } },
  { id: 'u1-26', vi: 'sai', zh: '错的', pos: 'adj', tags: ['grammar'], example: { vi: 'Câu này sai rồi.', zh: '这句话错了。' } },
  { id: 'u1-27', vi: 'sửa', zh: '改正 / 修正', pos: 'v', tags: ['grammar'], example: { vi: 'Thầy sửa lỗi phát âm cho tôi.', zh: '老师帮我改正发音错误。' } },
  { id: 'u1-28', vi: 'nguyên âm đôi', zh: '双元音', pos: 'n', tags: ['grammar'], example: { vi: 'ưa là một nguyên âm đôi.', zh: 'ưa 是一个双元音。' } },
  { id: 'u1-29', vi: 'dấu', zh: '符号 / 调号', pos: 'n', tags: ['grammar'], example: { vi: 'Chữ này có dấu.', zh: '这个字母有符号。' } },
  { id: 'u1-30', vi: 'đánh vần', zh: '拼读', pos: 'v', tags: ['grammar'], example: { vi: 'Bạn đánh vần từ này đi.', zh: '你拼一下这个词。' } },
  { id: 'u1-31', vi: 'luyện tập', zh: '练习', pos: 'v', tags: ['grammar', 'core'], example: { vi: 'Tôi luyện tập phát âm mỗi ngày.', zh: '我每天练习发音。' } },
  { id: 'u1-32', vi: 'ví dụ', zh: '例子', pos: 'n', tags: ['grammar'], example: { vi: 'Đây là một ví dụ.', zh: '这是一个例子。' } },

  // ===== U2 问候与自我介绍（补充） =====
  { id: 'u2-25', vi: 'chào buổi sáng', zh: '早上好', pos: 'phrase', tags: ['greeting'], example: { vi: 'Chào buổi sáng, chị Lan!', zh: '早上好，兰姐！' } },
  { id: 'u2-26', vi: 'chào buổi tối', zh: '晚上好', pos: 'phrase', tags: ['greeting'], example: { vi: 'Chào buổi tối, anh!', zh: '晚上好！' } },
  { id: 'u2-27', vi: 'hẹn gặp lại', zh: '回头见', pos: 'phrase', tags: ['greeting'], example: { vi: 'Tạm biệt, hẹn gặp lại.', zh: '再见，回头见。' } },
  { id: 'u2-28', vi: 'không có gì', zh: '不客气', pos: 'phrase', tags: ['greeting'], example: { vi: 'Không có gì, giúp bạn mà.', zh: '不客气，帮朋友嘛。' } },
  { id: 'u2-29', vi: 'lâu rồi không gặp', zh: '好久不见', pos: 'phrase', tags: ['greeting'], example: { vi: 'Chào em, lâu rồi không gặp!', zh: '你好，好久不见！' } },
  { id: 'u2-30', vi: 'dạo này', zh: '最近', pos: 'adv', tags: ['greeting', 'time'], example: { vi: 'Dạo này em thế nào?', zh: '你最近怎么样？' } },
  { id: 'u2-31', vi: 'quốc tịch', zh: '国籍', pos: 'n', hanViet: '国籍', tags: ['people'], example: { vi: 'Quốc tịch của tôi là Trung Quốc.', zh: '我的国籍是中国。' } },
  { id: 'u2-32', vi: 'nước', zh: '国家', pos: 'n', tags: ['people', 'core'], note: '此处指「国家」；另一个常用义是「水」。', example: { vi: 'Bạn là người nước nào?', zh: '你是哪国人？' } },
  { id: 'u2-33', vi: 'người nước ngoài', zh: '外国人', pos: 'n', tags: ['people'], example: { vi: 'Anh ấy là người nước ngoài.', zh: '他是外国人。' } },
  { id: 'u2-34', vi: 'thành phố', zh: '城市', pos: 'n', tags: ['travel'], example: { vi: 'Thượng Hải là thành phố lớn.', zh: '上海是大城市。' } },
  { id: 'u2-35', vi: 'giới thiệu', zh: '介绍', pos: 'v', tags: ['greeting'], example: { vi: 'Tôi giới thiệu bạn tôi với chị.', zh: '我把我朋友介绍给你。' } },
  { id: 'u2-36', vi: 'họ', zh: '姓', pos: 'n', tags: ['people'], example: { vi: 'Họ của tôi là Vương.', zh: '我姓王。' } },
  { id: 'u2-37', vi: 'nghề nghiệp', zh: '职业', pos: 'n', hanViet: '职业', tags: ['work', 'people'], example: { vi: 'Bạn làm nghề nghiệp gì?', zh: '你做什么职业？' } },
  { id: 'u2-38', vi: 'nhân viên', zh: '职员', pos: 'n', hanViet: '人员', tags: ['work', 'people'], example: { vi: 'Tôi là nhân viên văn phòng.', zh: '我是办公室职员。' } },
  { id: 'u2-39', vi: 'học sinh', zh: '学生（中小学）', pos: 'n', hanViet: '学生', tags: ['work', 'people'], example: { vi: 'Em gái tôi là học sinh.', zh: '我妹妹是学生。' } },
  { id: 'u2-40', vi: 'thư ký', zh: '秘书', pos: 'n', hanViet: '书记', tags: ['work', 'people'], example: { vi: 'Chị ấy là thư ký giám đốc.', zh: '她是经理秘书。' } },
  { id: 'u2-41', vi: 'giám đốc', zh: '经理 / 总监', pos: 'n', tags: ['work', 'people'], example: { vi: 'Anh ấy là giám đốc công ty.', zh: '他是公司经理。' } },
  { id: 'u2-42', vi: 'đồng nghiệp', zh: '同事', pos: 'n', hanViet: '同事', tags: ['work', 'people'], example: { vi: 'Cô ấy là đồng nghiệp của tôi.', zh: '她是我的同事。' } },

  // ===== U3 数字、时间与日期（补充） =====
  { id: 'u3-25', vi: 'mười lăm', zh: '十五', pos: 'num', tags: ['number'], example: { vi: 'Mười lăm phút.', zh: '十五分钟。' } },
  { id: 'u3-26', vi: 'hai mươi', zh: '二十', pos: 'num', tags: ['number'], example: { vi: 'Hai mươi nghìn đồng.', zh: '两万盾。' } },
  { id: 'u3-27', vi: 'ba mươi', zh: '三十', pos: 'num', tags: ['number'], example: { vi: 'Ba mươi phút.', zh: '三十分钟。' } },
  { id: 'u3-28', vi: 'một trăm', zh: '一百', pos: 'num', tags: ['number'], example: { vi: 'Một trăm nghìn.', zh: '十万。' } },
  { id: 'u3-29', vi: 'một nghìn', zh: '一千', pos: 'num', tags: ['number'], example: { vi: 'Một nghìn đồng.', zh: '一千盾。' } },
  { id: 'u3-30', vi: 'số', zh: '数字 / 号码', pos: 'n', tags: ['number'], example: { vi: 'Số điện thoại của tôi là gì?', zh: '我的电话号码是多少？' } },
  { id: 'u3-31', vi: 'buổi sáng', zh: '早上 / 上午', pos: 'n', tags: ['time'], example: { vi: 'Buổi sáng tôi uống cà phê.', zh: '早上我喝咖啡。' } },
  { id: 'u3-32', vi: 'buổi chiều', zh: '下午', pos: 'n', tags: ['time'], example: { vi: 'Buổi chiều tôi đi học.', zh: '下午我去上学。' } },
  { id: 'u3-33', vi: 'buổi tối', zh: '晚上', pos: 'n', tags: ['time'], example: { vi: 'Buổi tối tôi học tiếng Việt.', zh: '晚上我学越南语。' } },
  { id: 'u3-34', vi: 'buổi trưa', zh: '中午', pos: 'n', tags: ['time'], example: { vi: 'Buổi trưa tôi ăn cơm.', zh: '中午我吃饭。' } },
  { id: 'u3-35', vi: 'sớm', zh: '早', pos: 'adj', tags: ['time'], example: { vi: 'Tôi dậy sớm.', zh: '我起得早。' } },
  { id: 'u3-36', vi: 'muộn', zh: '晚 / 迟', pos: 'adj', tags: ['time'], example: { vi: 'Tôi đi ngủ muộn.', zh: '我睡得晚。' } },
  { id: 'u3-37', vi: 'tháng mười hai', zh: '十二月', pos: 'n', tags: ['time'], example: { vi: 'Tháng mười hai có ba mươi mốt ngày.', zh: '十二月有三十一天。' } },
  { id: 'u3-38', vi: 'sinh nhật', zh: '生日', pos: 'n', tags: ['time'], example: { vi: 'Sinh nhật tôi là ngày mười tháng ba.', zh: '我的生日是三月十号。' } },
  { id: 'u3-39', vi: 'cuối tuần', zh: '周末', pos: 'n', tags: ['time'], example: { vi: 'Cuối tuần tôi đi dạo.', zh: '周末我散步。' } },
  { id: 'u3-40', vi: 'tuần này', zh: '这周', pos: 'n', tags: ['time'], example: { vi: 'Tuần này tôi bận lắm.', zh: '这周我很忙。' } },
  { id: 'u3-41', vi: 'tháng sau', zh: '下个月', pos: 'n', tags: ['time'], example: { vi: 'Tháng sau tôi đi Hà Nội.', zh: '下个月我去河内。' } },
  { id: 'u3-42', vi: 'ngày lễ', zh: '节日', pos: 'n', tags: ['time'], example: { vi: 'Ngày lễ tôi nghỉ.', zh: '节日我休息。' } },
  { id: 'u3-43', vi: 'hôm kia', zh: '前天', pos: 'n', tags: ['time'], example: { vi: 'Hôm kia trời mưa.', zh: '前天下雨了。' } },
  { id: 'u3-44', vi: 'ngày kia', zh: '后天', pos: 'n', tags: ['time'], example: { vi: 'Ngày kia tôi đi học.', zh: '后天我去上学。' } },

  // ===== U4 家庭与日常（补充） =====
  { id: 'u4-21', vi: 'ông', zh: '爷爷 / 外祖父', pos: 'n', tags: ['family'], example: { vi: 'Ông tôi bảy mươi tuổi.', zh: '我爷爷七十岁。' } },
  { id: 'u4-22', vi: 'bà', zh: '奶奶 / 外祖母', pos: 'n', tags: ['family'], example: { vi: 'Bà tôi nấu ăn rất ngon.', zh: '我奶奶做饭很好吃。' } },
  { id: 'u4-23', vi: 'cháu', zh: '孙子 / 侄孙', pos: 'n', tags: ['family', 'people'], example: { vi: 'Cháu rất thích ông bà.', zh: '我很喜欢爷爷奶奶。' } },
  { id: 'u4-24', vi: 'chú', zh: '叔叔（父亲的弟弟）', pos: 'n', tags: ['family', 'people'], example: { vi: 'Chú tôi ở Hà Nội.', zh: '我叔叔在河内。' } },
  { id: 'u4-25', vi: 'cô', zh: '姑姑 / 阿姨', pos: 'n', tags: ['family', 'people'], example: { vi: 'Cô tôi là giáo viên.', zh: '我姑姑是老师。' } },
  { id: 'u4-26', vi: 'dì', zh: '姨妈（母亲的姐妹）', pos: 'n', tags: ['family', 'people'], example: { vi: 'Dì tôi sống ở Đà Nẵng.', zh: '我姨妈住在岘港。' } },
  { id: 'u4-27', vi: 'ăn trưa', zh: '吃午饭', pos: 'v', tags: ['food'], example: { vi: 'Tôi ăn trưa lúc mười hai giờ.', zh: '我十二点吃午饭。' } },
  { id: 'u4-28', vi: 'ăn tối', zh: '吃晚饭', pos: 'v', tags: ['food'], example: { vi: 'Tôi ăn tối lúc bảy giờ.', zh: '我七点吃晚饭。' } },
  { id: 'u4-29', vi: 'về nhà', zh: '回家', pos: 'v', tags: ['core'], example: { vi: 'Tôi về nhà lúc sáu giờ chiều.', zh: '我下午六点回家。' } },
  { id: 'u4-30', vi: 'đi học', zh: '上学 / 去上课', pos: 'v', tags: ['work'], example: { vi: 'Tôi đi học lúc bảy giờ.', zh: '我七点去上学。' } },
  { id: 'u4-31', vi: 'thức', zh: '醒 / 醒着', pos: 'v', tags: ['core'], example: { vi: 'Tôi thức lúc sáu giờ.', zh: '我六点醒。' } },
  { id: 'u4-32', vi: 'ngủ trưa', zh: '午睡', pos: 'v', tags: ['core'], example: { vi: 'Tôi ngủ trưa ba mươi phút.', zh: '我午睡三十分钟。' } },
  { id: 'u4-33', vi: 'đánh răng', zh: '刷牙', pos: 'v', tags: ['core'], example: { vi: 'Tôi đánh răng rồi đi ngủ.', zh: '我刷牙然后睡觉。' } },
  { id: 'u4-34', vi: 'tắm', zh: '洗澡', pos: 'v', tags: ['core'], example: { vi: 'Tôi tắm mỗi ngày.', zh: '我每天洗澡。' } },
  { id: 'u4-35', vi: 'luôn luôn', zh: '总是', pos: 'adv', tags: ['time', 'grammar'], example: { vi: 'Tôi luôn luôn dậy sớm.', zh: '我总是早起。' } },
  { id: 'u4-36', vi: 'hay', zh: '经常', pos: 'adv', tags: ['time', 'grammar'], example: { vi: 'Tôi hay xem phim cuối tuần.', zh: '我周末经常看电影。' } },
  { id: 'u4-37', vi: 'thỉnh thoảng', zh: '偶尔', pos: 'adv', tags: ['time', 'grammar'], example: { vi: 'Thỉnh thoảng tôi đi dạo.', zh: '偶尔我散步。' } },
  { id: 'u4-38', vi: 'hiếm khi', zh: '很少', pos: 'adv', tags: ['time', 'grammar'], example: { vi: 'Hiếm khi tôi đi ngủ muộn.', zh: '我很少晚睡。' } },
  { id: 'u4-39', vi: 'nghỉ', zh: '休息', pos: 'v', tags: ['hobby'], example: { vi: 'Chủ nhật tôi nghỉ.', zh: '星期天我休息。' } },
  { id: 'u4-40', vi: 'thư giãn', zh: '放松', pos: 'v', tags: ['hobby'], example: { vi: 'Cuối tuần tôi thư giãn ở nhà.', zh: '周末我在家放松。' } },

  // ===== U5 购物（补充） =====
  { id: 'u5-19', vi: 'con', zh: '（动物的）量词「只」', pos: 'n', tags: ['shopping', 'grammar'], note: '量词，用于动物；u4-08 的 con 指「孩子」。', example: { vi: 'Tôi có hai con chó.', zh: '我有两只狗。' } },
  { id: 'u5-20', vi: 'cuốn', zh: '本（书）', pos: 'n', tags: ['shopping', 'grammar'], example: { vi: 'Một cuốn sách mới.', zh: '一本新书。' } },
  { id: 'u5-21', vi: 'bộ', zh: '套', pos: 'n', tags: ['shopping', 'grammar'], example: { vi: 'Một bộ quần áo.', zh: '一套衣服。' } },
  { id: 'u5-22', vi: 'đôi', zh: '双', pos: 'n', tags: ['shopping', 'grammar'], example: { vi: 'Một đôi giày.', zh: '一双鞋。' } },
  { id: 'u5-23', vi: 'tờ', zh: '张（纸/报纸）', pos: 'n', tags: ['shopping', 'grammar'], example: { vi: 'Hai tờ báo.', zh: '两张报纸。' } },
  { id: 'u5-24', vi: 'bớt', zh: '减 / 便宜一点', pos: 'v', tags: ['shopping'], example: { vi: 'Bớt cho tôi mười nghìn nhé.', zh: '便宜我一万盾吧。' } },
  { id: 'u5-25', vi: 'giá', zh: '价格', pos: 'n', tags: ['shopping'], example: { vi: 'Giá của cái này bao nhiêu?', zh: '这个的价格是多少？' } },
  { id: 'u5-26', vi: 'tiền mặt', zh: '现金', pos: 'n', tags: ['shopping'], example: { vi: 'Tôi trả bằng tiền mặt.', zh: '我用现金付。' } },
  { id: 'u5-27', vi: 'thẻ', zh: '卡', pos: 'n', tags: ['shopping'], example: { vi: 'Tôi trả bằng thẻ.', zh: '我刷卡。' } },
  { id: 'u5-28', vi: 'hóa đơn', zh: '发票 / 账单', pos: 'n', tags: ['shopping'], example: { vi: 'Hóa đơn là hai trăm nghìn.', zh: '账单是二十万盾。' } },
  { id: 'u5-29', vi: 'đổi', zh: '换', pos: 'v', tags: ['shopping'], example: { vi: 'Tôi muốn đổi cái khác.', zh: '我想换一个。' } },
  { id: 'u5-30', vi: 'giảm giá', zh: '打折', pos: 'v', tags: ['shopping'], example: { vi: 'Cửa hàng giảm giá hôm nay.', zh: '商店今天打折。' } },
  { id: 'u5-31', vi: 'đen', zh: '黑色', pos: 'adj', tags: ['shopping'], example: { vi: 'Tôi thích màu đen.', zh: '我喜欢黑色。' } },
  { id: 'u5-32', vi: 'trắng', zh: '白色', pos: 'adj', tags: ['shopping'], example: { vi: 'Có màu trắng không?', zh: '有白色的吗？' } },
  { id: 'u5-33', vi: 'vàng', zh: '黄色', pos: 'adj', tags: ['shopping'], example: { vi: 'Áo màu vàng.', zh: '黄色的衣服。' } },
  { id: 'u5-34', vi: 'hồng', zh: '粉色', pos: 'adj', tags: ['shopping'], example: { vi: 'Cô ấy thích màu hồng.', zh: '她喜欢粉色。' } },
  { id: 'u5-35', vi: 'nâu', zh: '棕色', pos: 'adj', tags: ['shopping'], example: { vi: 'Giày màu nâu.', zh: '棕色的鞋。' } },
  { id: 'u5-36', vi: 'xám', zh: '灰色', pos: 'adj', tags: ['shopping'], example: { vi: 'Áo màu xám.', zh: '灰色的衣服。' } },
  { id: 'u5-37', vi: 'rộng', zh: '宽松', pos: 'adj', tags: ['shopping'], example: { vi: 'Áo này rộng quá.', zh: '这件衣服太宽松。' } },
  { id: 'u5-38', vi: 'chật', zh: '紧', pos: 'adj', tags: ['shopping'], example: { vi: 'Cái này hơi chật.', zh: '这个有点紧。' } },

  // ===== U6 饮食（补充） =====
  { id: 'u6-19', vi: 'bánh mì', zh: '法包 / 越南三明治', pos: 'n', tags: ['food'], example: { vi: 'Tôi ăn bánh mì buổi sáng.', zh: '我早上吃法包。' } },
  { id: 'u6-20', vi: 'bún', zh: '米线', pos: 'n', tags: ['food'], example: { vi: 'Tôi thích ăn bún.', zh: '我喜欢吃米线。' } },
  { id: 'u6-21', vi: 'bánh xèo', zh: '越南煎饼', pos: 'n', tags: ['food'], example: { vi: 'Bánh xèo rất ngon.', zh: '越南煎饼很好吃。' } },
  { id: 'u6-22', vi: 'chả giò', zh: '春卷', pos: 'n', tags: ['food'], example: { vi: 'Tôi thích chả giò.', zh: '我喜欢春卷。' } },
  { id: 'u6-23', vi: 'nước mắm', zh: '鱼露', pos: 'n', tags: ['food'], example: { vi: 'Nước mắm là gia vị Việt Nam.', zh: '鱼露是越南调料。' } },
  { id: 'u6-24', vi: 'sữa', zh: '牛奶', pos: 'n', tags: ['food'], example: { vi: 'Tôi uống sữa mỗi sáng.', zh: '我每天早上喝牛奶。' } },
  { id: 'u6-25', vi: 'chua', zh: '酸', pos: 'adj', tags: ['food'], example: { vi: 'Món này hơi chua.', zh: '这个菜有点酸。' } },
  { id: 'u6-26', vi: 'mặn', zh: '咸', pos: 'adj', tags: ['food'], example: { vi: 'Món này rất mặn.', zh: '这个菜很咸。' } },
  { id: 'u6-27', vi: 'ít', zh: '少', pos: 'adj', tags: ['food', 'shopping'], example: { vi: 'Ít ớt thôi.', zh: '少放点辣椒。' } },
  { id: 'u6-28', vi: 'nhiều', zh: '多', pos: 'adj', tags: ['food', 'shopping'], example: { vi: 'Cửa hàng có nhiều trái cây.', zh: '商店有很多水果。' } },
  { id: 'u6-29', vi: 'hành', zh: '葱', pos: 'n', tags: ['food'], example: { vi: 'Cho tôi ít hành.', zh: '给我少放点葱。' } },
  { id: 'u6-30', vi: 'ớt', zh: '辣椒', pos: 'n', tags: ['food'], example: { vi: 'Tôi không ăn ớt.', zh: '我不吃辣椒。' } },
  { id: 'u6-31', vi: 'bát', zh: '碗', pos: 'n', tags: ['food'], example: { vi: 'Một bát phở.', zh: '一碗河粉。' } },
  { id: 'u6-32', vi: 'đĩa', zh: '盘子', pos: 'n', tags: ['food'], example: { vi: 'Một đĩa chả giò.', zh: '一盘春卷。' } },
  { id: 'u6-33', vi: 'ly', zh: '杯子', pos: 'n', tags: ['food'], example: { vi: 'Một ly trà đá.', zh: '一杯冰茶。' } },
  { id: 'u6-34', vi: 'béo', zh: '油腻 / 肥', pos: 'adj', tags: ['food'], example: { vi: 'Tôi không ăn được đồ béo.', zh: '我吃不了油腻的东西。' } },
  { id: 'u6-35', vi: 'chay', zh: '素', pos: 'adj', tags: ['food'], example: { vi: 'Tôi ăn chay.', zh: '我吃素。' } },
  { id: 'u6-36', vi: 'đường', zh: '糖', pos: 'n', tags: ['food'], note: '指「糖」；u7-13 的 đường 指「道路」。', example: { vi: 'Cho thêm đường không?', zh: '要加糖吗？' } },
  { id: 'u6-37', vi: 'muối', zh: '盐', pos: 'n', tags: ['food'], example: { vi: 'Món này thiếu muối.', zh: '这个菜缺盐。' } },
  { id: 'u6-38', vi: 'tiêu', zh: '胡椒', pos: 'n', tags: ['food'], example: { vi: 'Cho ít tiêu thôi.', zh: '少放点胡椒。' } },
  { id: 'u6-39', vi: 'chanh', zh: '柠檬', pos: 'n', tags: ['food'], example: { vi: 'Cho tôi một miếng chanh.', zh: '给我一块柠檬。' } },
  { id: 'u6-40', vi: 'tỏi', zh: '蒜', pos: 'n', tags: ['food'], example: { vi: 'Món này có tỏi.', zh: '这个菜有大蒜。' } },

  // ===== U7 出行与酒店（补充） =====
  { id: 'u7-19', vi: 'ngã tư', zh: '十字路口', pos: 'n', tags: ['travel'], example: { vi: 'Rẽ phải ở ngã tư.', zh: '在十字路口右转。' } },
  { id: 'u7-20', vi: 'ngã ba', zh: '三岔路口', pos: 'n', tags: ['travel'], example: { vi: 'Ngã ba này rất đông xe.', zh: '这个三岔口车很多。' } },
  { id: 'u7-21', vi: 'bên trái', zh: '左边', pos: 'n', tags: ['travel'], example: { vi: 'Cửa hàng ở bên trái.', zh: '商店在左边。' } },
  { id: 'u7-22', vi: 'bên phải', zh: '右边', pos: 'n', tags: ['travel'], example: { vi: 'Ngân hàng ở bên phải.', zh: '银行在右边。' } },
  { id: 'u7-23', vi: 'quay lại', zh: '掉头 / 返回', pos: 'v', tags: ['travel'], example: { vi: 'Bạn cần quay lại.', zh: '你需要掉头。' } },
  { id: 'u7-24', vi: 'đối diện', zh: '对面', pos: 'n', tags: ['travel'], example: { vi: 'Khách sạn ở đối diện.', zh: '酒店在对面。' } },
  { id: 'u7-25', vi: 'xe đạp', zh: '自行车', pos: 'n', tags: ['travel'], example: { vi: 'Tôi đi học bằng xe đạp.', zh: '我骑自行车上学。' } },
  { id: 'u7-26', vi: 'ô tô', zh: '汽车', pos: 'n', tags: ['travel'], example: { vi: 'Tôi đi bằng ô tô.', zh: '我坐汽车去。' } },
  { id: 'u7-27', vi: 'tàu hỏa', zh: '火车', pos: 'n', tags: ['travel'], example: { vi: 'Đi tàu hỏa mất ba giờ.', zh: '坐火车要三小时。' } },
  { id: 'u7-28', vi: 'máy bay', zh: '飞机', pos: 'n', tags: ['travel'], example: { vi: 'Tôi đi Hà Nội bằng máy bay.', zh: '我坐飞机去河内。' } },
  { id: 'u7-29', vi: 'xe ôm', zh: '摩的', pos: 'n', tags: ['travel'], example: { vi: 'Tôi đi xe ôm về nhà.', zh: '我坐摩的回家。' } },
  { id: 'u7-30', vi: 'bến', zh: '车站 / 码头', pos: 'n', tags: ['travel'], example: { vi: 'Bến xe ở gần đây.', zh: '车站在附近。' } },
  { id: 'u7-31', vi: 'vé', zh: '票', pos: 'n', tags: ['travel'], example: { vi: 'Một vé tàu bao nhiêu tiền?', zh: '一张火车票多少钱？' } },
  { id: 'u7-32', vi: 'đi bộ', zh: '步行', pos: 'v', tags: ['travel'], example: { vi: 'Tôi đi bộ đến trường.', zh: '我走路去学校。' } },
  { id: 'u7-33', vi: 'đặt phòng', zh: '订房', pos: 'v', tags: ['travel'], example: { vi: 'Tôi muốn đặt phòng đôi.', zh: '我想订双人间。' } },
  { id: 'u7-34', vi: 'nhận phòng', zh: '入住', pos: 'v', tags: ['travel'], example: { vi: 'Mấy giờ nhận phòng?', zh: '几点可以入住？' } },
  { id: 'u7-35', vi: 'trả phòng', zh: '退房', pos: 'v', tags: ['travel'], example: { vi: 'Tôi muốn trả phòng.', zh: '我想退房。' } },
  { id: 'u7-36', vi: 'phòng đơn', zh: '单人间', pos: 'n', tags: ['travel'], example: { vi: 'Còn phòng đơn không?', zh: '还有单人间吗？' } },
  { id: 'u7-37', vi: 'phòng đôi', zh: '双人间', pos: 'n', tags: ['travel'], example: { vi: 'Tôi đặt phòng đôi hai đêm.', zh: '我订双人间两晚。' } },
  { id: 'u7-38', vi: 'chìa khóa', zh: '钥匙', pos: 'n', tags: ['travel'], example: { vi: 'Đây là chìa khóa phòng.', zh: '这是房间钥匙。' } },
  { id: 'u7-39', vi: 'hộ chiếu', zh: '护照', pos: 'n', tags: ['travel'], example: { vi: 'Tôi cần hộ chiếu để nhận phòng.', zh: '我需要护照办理入住。' } },
  { id: 'u7-40', vi: 'giúp', zh: '帮助', pos: 'v', tags: ['travel', 'core'], example: { vi: 'Bạn có thể giúp tôi không?', zh: '你能帮我吗？' } },

  // ===== U8 工作、爱好与计划（补充） =====
  { id: 'u8-19', vi: 'làm việc', zh: '工作 / 上班', pos: 'v', tags: ['work'], example: { vi: 'Tôi làm việc ở văn phòng.', zh: '我在办公室工作。' } },
  { id: 'u8-20', vi: 'văn phòng', zh: '办公室', pos: 'n', hanViet: '文房', tags: ['work'], example: { vi: 'Văn phòng tôi ở tầng ba.', zh: '我办公室在三楼。' } },
  { id: 'u8-21', vi: 'bệnh viện', zh: '医院', pos: 'n', hanViet: '病院', tags: ['work'], example: { vi: 'Bố tôi làm ở bệnh viện.', zh: '我爸爸在医院工作。' } },
  { id: 'u8-22', vi: 'trường học', zh: '学校', pos: 'n', hanViet: '场学', tags: ['work'], example: { vi: 'Trường học ở gần nhà tôi.', zh: '学校在我家附近。' } },
  { id: 'u8-23', vi: 'lương', zh: '工资', pos: 'n', tags: ['work'], example: { vi: 'Lương tháng này bao nhiêu?', zh: '这个月工资多少？' } },
  { id: 'u8-24', vi: 'họp', zh: '开会', pos: 'v', tags: ['work'], example: { vi: 'Chiều nay tôi họp.', zh: '今天下午我开会。' } },
  { id: 'u8-25', vi: 'nghỉ hưu', zh: '退休', pos: 'v', tags: ['work'], example: { vi: 'Ông tôi đã nghỉ hưu.', zh: '我爷爷已经退休了。' } },
  { id: 'u8-26', vi: 'nghe nhạc', zh: '听音乐', pos: 'v', tags: ['hobby'], example: { vi: 'Tôi thích nghe nhạc.', zh: '我喜欢听音乐。' } },
  { id: 'u8-27', vi: 'chơi thể thao', zh: '做运动', pos: 'v', tags: ['hobby'], example: { vi: 'Tôi chơi thể thao mỗi tuần.', zh: '我每周做运动。' } },
  { id: 'u8-28', vi: 'nấu ăn', zh: '做饭', pos: 'v', tags: ['hobby', 'food'], example: { vi: 'Cô ấy thích nấu ăn.', zh: '她喜欢做饭。' } },
  { id: 'u8-29', vi: 'chụp ảnh', zh: '拍照', pos: 'v', tags: ['hobby'], example: { vi: 'Tôi thích chụp ảnh.', zh: '我喜欢拍照。' } },
  { id: 'u8-30', vi: 'đi dạo', zh: '散步', pos: 'v', tags: ['hobby'], example: { vi: 'Cuối tuần tôi đi dạo.', zh: '周末我散步。' } },
  { id: 'u8-31', vi: 'sưu tầm', zh: '收藏', pos: 'v', tags: ['hobby'], example: { vi: 'Anh ấy sưu tầm tem.', zh: '他收藏邮票。' } },
  { id: 'u8-32', vi: 'khiêu vũ', zh: '跳舞', pos: 'v', tags: ['hobby'], example: { vi: 'Cô ấy thích khiêu vũ.', zh: '她喜欢跳舞。' } },
  { id: 'u8-33', vi: 'năm ngoái', zh: '去年', pos: 'n', tags: ['time'], example: { vi: 'Năm ngoái tôi đi Việt Nam.', zh: '去年我去越南。' } },
  { id: 'u8-34', vi: 'tuần trước', zh: '上周', pos: 'n', tags: ['time'], example: { vi: 'Tuần trước tôi bận.', zh: '上周我很忙。' } },
  { id: 'u8-35', vi: 'cuối năm', zh: '年底', pos: 'n', tags: ['time'], example: { vi: 'Cuối năm tôi về nhà.', zh: '年底我回家。' } },
  { id: 'u8-36', vi: 'vừa', zh: '刚刚', pos: 'adv', tags: ['time', 'grammar'], example: { vi: 'Tôi vừa đến.', zh: '我刚到。' } },
  { id: 'u8-37', vi: 'sắp', zh: '即将', pos: 'adv', tags: ['time', 'grammar'], example: { vi: 'Tôi sắp đi Hà Nội.', zh: '我即将去河内。' } },
  { id: 'u8-38', vi: 'hoàn thành', zh: '完成', pos: 'v', tags: ['work'], example: { vi: 'Tôi đã hoàn thành công việc.', zh: '我完成了工作。' } },
  { id: 'u8-39', vi: 'công tác', zh: '出差', pos: 'v', tags: ['work', 'travel'], example: { vi: 'Tuần sau tôi đi công tác.', zh: '下周我出差。' } },
];

export const EXTRA_SENTENCES: Sentence[] = [
  // ===== U1 =====
  {
    id: 's1-1-4', lessonId: 'l1-1', order: 4, tag: 'statement',
    vi: 'Chữ cái này viết bằng chữ hoa.', zh: '这个字母用大写写。',
    chunks: [
      { vi: 'Chữ cái này', zh: '这个字母', role: 'subject', vocabId: 'u1-01' },
      { vi: 'viết', zh: '写', role: 'predicate', vocabId: 'u1-09' },
      { vi: 'bằng chữ hoa', zh: '用大写', role: 'modifier', vocabId: 'u1-14' },
    ],
    exercises: [
      { id: 'se1-1-3', type: 'blank', chunkIndex: 2, answer: 'bằng chữ hoa', hint: '「用大写字母」', explain: 'bằng 引出方式，chữ hoa = 大写字母。' },
    ],
  },
  {
    id: 's1-1-5', lessonId: 'l1-1', order: 5, tag: 'statement',
    vi: 'Mỗi âm tiết có một thanh điệu.', zh: '每个音节有一个声调。',
    chunks: [
      { vi: 'Mỗi âm tiết', zh: '每个音节', role: 'subject', vocabId: 'u1-16' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'một thanh điệu', zh: '一个声调', role: 'object', vocabId: 'u1-02' },
    ],
    exercises: [],
  },
  {
    id: 's1-1-6', lessonId: 'l1-1', order: 6, tag: 'question',
    vi: 'Từ này đọc thế nào?', zh: '这个词怎么读？',
    chunks: [
      { vi: 'Từ này', zh: '这个词', role: 'subject', vocabId: 'u1-17' },
      { vi: 'đọc', zh: '读', role: 'predicate', vocabId: 'u1-08' },
      { vi: 'thế nào', zh: '怎么样', role: 'particle' },
    ],
    exercises: [
      { id: 'se1-1-4', type: 'translate', answer: 'Từ này đọc thế nào?', hint: 'Từ này + đọc + thế nào', explain: 'thế nào 放句尾表「怎么样」。' },
    ],
  },

  {
    id: 's1-2-4', lessonId: 'l1-2', order: 4, tag: 'statement',
    vi: 'Dấu hỏi là thanh thứ ba.', zh: '问声是第三个声调。',
    chunks: [
      { vi: 'Dấu hỏi', zh: '问声调号', role: 'subject', vocabId: 'u1-20' },
      { vi: 'là', zh: '是', role: 'predicate', vocabId: 'u2-11' },
      { vi: 'thanh thứ ba', zh: '第三个声调', role: 'object' },
    ],
    exercises: [
      { id: 'se1-2-3', type: 'blank', chunkIndex: 0, answer: 'Dấu hỏi', hint: '「问声调号」', explain: 'dấu hỏi 对应普通话三声的调型。' },
    ],
  },
  {
    id: 's1-2-5', lessonId: 'l1-2', order: 5, tag: 'statement',
    vi: 'Mỗi từ có một thanh điệu.', zh: '每个词有一个声调。',
    chunks: [
      { vi: 'Mỗi từ', zh: '每个词', role: 'subject', vocabId: 'u1-17' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'một thanh điệu', zh: '一个声调', role: 'object', vocabId: 'u1-02' },
    ],
    exercises: [],
  },
  {
    id: 's1-2-6', lessonId: 'l1-2', order: 6, tag: 'negative',
    vi: 'Chữ a không có dấu.', zh: '字母 a 没有调号。',
    chunks: [
      { vi: 'Chữ a', zh: '字母 a', role: 'subject' },
      { vi: 'không có', zh: '没有', role: 'predicate', vocabId: 'u2-16' },
      { vi: 'dấu', zh: '调号', role: 'object', vocabId: 'u1-29' },
    ],
    exercises: [
      { id: 'se1-2-4', type: 'order', answer: [0, 1, 2], explain: '平声 ngang 不写调号，所以 chữ a 没有 dấu。' },
    ],
  },

  {
    id: 's1-3-4', lessonId: 'l1-3', order: 4, tag: 'statement',
    vi: 'Th là âm bật hơi.', zh: 'th 是送气音。',
    chunks: [
      { vi: 'Th', zh: '声母 th', role: 'subject' },
      { vi: 'là', zh: '是', role: 'predicate', vocabId: 'u2-11' },
      { vi: 'âm bật hơi', zh: '送气音', role: 'object', vocabId: 'u1-23' },
    ],
    exercises: [
      { id: 'se1-3-3', type: 'blank', chunkIndex: 2, answer: 'âm bật hơi', hint: '「送气音」', explain: 'th 发音时送气，t 不送气。' },
    ],
  },
  {
    id: 's1-3-5', lessonId: 'l1-3', order: 5, tag: 'statement',
    vi: 'Phát âm của bạn rất chuẩn.', zh: '你的发音很标准。',
    chunks: [
      { vi: 'Phát âm của bạn', zh: '你的发音', role: 'subject', vocabId: 'u1-05' },
      { vi: 'rất chuẩn', zh: '很标准', role: 'predicate', vocabId: 'u1-25' },
    ],
    exercises: [],
  },
  {
    id: 's1-3-6', lessonId: 'l1-3', order: 6, tag: 'statement',
    vi: 'Tôi sửa lại chữ này.', zh: '我改正这个字。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'sửa lại', zh: '改正', role: 'predicate', vocabId: 'u1-27' },
      { vi: 'chữ này', zh: '这个字', role: 'object' },
    ],
    exercises: [
      { id: 'se1-3-4', type: 'translate', answer: 'Tôi sửa lại chữ này.', hint: 'Tôi + sửa lại + chữ này', explain: 'sửa lại = 改正过来。' },
    ],
  },

  {
    id: 's1-4-4', lessonId: 'l1-4', order: 4, tag: 'statement',
    vi: 'Chữ ê có dấu hỏi.', zh: 'ê 上有问声调号。',
    chunks: [
      { vi: 'Chữ ê', zh: '字母 ê', role: 'subject' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'dấu hỏi', zh: '问声调号', role: 'object', vocabId: 'u1-20' },
    ],
    exercises: [
      { id: 'se1-4-3', type: 'blank', chunkIndex: 2, answer: 'dấu hỏi', hint: '「问声调号」', explain: '有带符字母 ê 时，调号优先标在 ê 上。' },
    ],
  },
  {
    id: 's1-4-5', lessonId: 'l1-4', order: 5, tag: 'statement',
    vi: 'Tôi luyện tập phát âm mỗi ngày.', zh: '我每天练习发音。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'luyện tập', zh: '练习', role: 'predicate', vocabId: 'u1-31' },
      { vi: 'phát âm', zh: '发音', role: 'object', vocabId: 'u1-05' },
      { vi: 'mỗi ngày', zh: '每天', role: 'time', vocabId: 'u4-15' },
    ],
    exercises: [],
  },
  {
    id: 's1-4-6', lessonId: 'l1-4', order: 6, tag: 'statement',
    vi: 'Đây là một ví dụ.', zh: '这是一个例子。',
    chunks: [
      { vi: 'Đây', zh: '这', role: 'subject' },
      { vi: 'là', zh: '是', role: 'predicate', vocabId: 'u2-11' },
      { vi: 'một ví dụ', zh: '一个例子', role: 'object', vocabId: 'u1-32' },
    ],
    exercises: [
      { id: 'se1-4-4', type: 'translate', answer: 'Đây là một ví dụ.', hint: 'Đây + là + một ví dụ', explain: 'Đây là… 用于指认或举例。' },
    ],
  },

  // ===== U2 =====
  {
    id: 's2-1-4', lessonId: 'l2-1', order: 4, tag: 'request',
    vi: 'Chào buổi sáng, chị Lan!', zh: '早上好，兰姐！',
    chunks: [
      { vi: 'Chào buổi sáng', zh: '早上好', role: 'predicate', vocabId: 'u2-25' },
      { vi: 'chị Lan', zh: '兰姐', role: 'object', vocabId: 'u2-08' },
    ],
    exercises: [
      { id: 'se2-1-3', type: 'blank', chunkIndex: 0, answer: 'Chào buổi sáng', hint: '「早上好」', explain: 'buổi sáng = 早上。' },
    ],
  },
  {
    id: 's2-1-5', lessonId: 'l2-1', order: 5, tag: 'question',
    vi: 'Dạo này em thế nào?', zh: '你最近怎么样？',
    chunks: [
      { vi: 'Dạo này', zh: '最近', role: 'time', vocabId: 'u2-30' },
      { vi: 'em', zh: '你（晚辈）', role: 'subject', vocabId: 'u2-09' },
      { vi: 'thế nào', zh: '怎么样', role: 'particle' },
    ],
    exercises: [],
  },
  {
    id: 's2-1-6', lessonId: 'l2-1', order: 6, tag: 'statement',
    vi: 'Không có gì, tạm biệt!', zh: '不客气，再见！',
    chunks: [
      { vi: 'Không có gì', zh: '不客气', role: 'predicate', vocabId: 'u2-28' },
      { vi: 'tạm biệt', zh: '再见', role: 'particle', vocabId: 'u2-04' },
    ],
    exercises: [
      { id: 'se2-1-4', type: 'translate', answer: 'Không có gì, tạm biệt!', hint: 'Không có gì + tạm biệt', explain: '回应感谢用 không có gì。' },
    ],
  },

  {
    id: 's2-2-4', lessonId: 'l2-2', order: 4, tag: 'statement',
    vi: 'Tôi đến từ Thượng Hải.', zh: '我来自上海。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'đến từ', zh: '来自', role: 'predicate', vocabId: 'u2-23' },
      { vi: 'Thượng Hải', zh: '上海', role: 'place' },
    ],
    exercises: [
      { id: 'se2-2-3', type: 'blank', chunkIndex: 2, answer: 'Thượng Hải', hint: '地名「上海」', explain: 'đến từ + 地名 = 来自某地。' },
    ],
  },
  {
    id: 's2-2-5', lessonId: 'l2-2', order: 5, tag: 'question',
    vi: 'Bạn là người nước nào?', zh: '你是哪国人？',
    chunks: [
      { vi: 'Bạn', zh: '你', role: 'subject', vocabId: 'u2-06' },
      { vi: 'là người nước', zh: '是哪国人', role: 'predicate', vocabId: 'u2-32' },
      { vi: 'nào', zh: '哪', role: 'particle' },
    ],
    exercises: [],
  },
  {
    id: 's2-2-6', lessonId: 'l2-2', order: 6, tag: 'statement',
    vi: 'Tôi giới thiệu bạn tôi.', zh: '我介绍我的朋友。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'giới thiệu', zh: '介绍', role: 'predicate', vocabId: 'u2-35' },
      { vi: 'bạn tôi', zh: '我的朋友', role: 'object', vocabId: 'u2-06' },
    ],
    exercises: [
      { id: 'se2-2-4', type: 'order', answer: [0, 1, 2], explain: 'giới thiệu + 人 = 介绍某人。' },
    ],
  },

  {
    id: 's2-3-4', lessonId: 'l2-3', order: 4, tag: 'statement',
    vi: 'Tôi là nhân viên.', zh: '我是职员。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'là', zh: '是', role: 'predicate', vocabId: 'u2-11' },
      { vi: 'nhân viên', zh: '职员', role: 'object', vocabId: 'u2-38' },
    ],
    exercises: [
      { id: 'se2-3-3', type: 'blank', chunkIndex: 2, answer: 'nhân viên', hint: '「职员」', explain: 'nhân viên 是汉越词「人员」，指职员。' },
    ],
  },
  {
    id: 's2-3-5', lessonId: 'l2-3', order: 5, tag: 'statement',
    vi: 'Anh ấy là giám đốc công ty.', zh: '他是公司经理。',
    chunks: [
      { vi: 'Anh ấy', zh: '他', role: 'subject', vocabId: 'u2-07' },
      { vi: 'là', zh: '是', role: 'predicate' },
      { vi: 'giám đốc công ty', zh: '公司经理', role: 'object', vocabId: 'u2-41' },
    ],
    exercises: [],
  },
  {
    id: 's2-3-6', lessonId: 'l2-3', order: 6, tag: 'statement',
    vi: 'Rất vui được làm việc với bạn.', zh: '很高兴和你一起工作。',
    chunks: [
      { vi: 'Rất vui', zh: '很高兴', role: 'predicate', vocabId: 'u2-19' },
      { vi: 'được làm việc', zh: '能工作', role: 'predicate', vocabId: 'u8-01' },
      { vi: 'với bạn', zh: '和你', role: 'object', vocabId: 'u2-06' },
    ],
    exercises: [
      { id: 'se2-3-4', type: 'translate', answer: 'Rất vui được làm việc với bạn.', hint: 'Rất vui + được làm việc + với bạn', explain: 'với = 和/与。' },
    ],
  },

  // ===== U3 =====
  {
    id: 's3-1-4', lessonId: 'l3-1', order: 4, tag: 'statement',
    vi: 'Tôi có hai mươi nghìn đồng.', zh: '我有两万盾。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'hai mươi nghìn đồng', zh: '两万盾', role: 'object', vocabId: 'u3-26' },
    ],
    exercises: [
      { id: 'se3-1-3', type: 'blank', chunkIndex: 2, answer: 'hai mươi nghìn đồng', hint: '「两万盾」', explain: 'hai mươi = 20；nghìn = 千。' },
    ],
  },
  {
    id: 's3-1-5', lessonId: 'l3-1', order: 5, tag: 'statement',
    vi: 'Một năm có mười hai tháng.', zh: '一年有十二个月。',
    chunks: [
      { vi: 'Một năm', zh: '一年', role: 'subject', vocabId: 'u3-05' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'mười hai tháng', zh: '十二个月', role: 'object', vocabId: 'u3-21' },
    ],
    exercises: [],
  },
  {
    id: 's3-1-6', lessonId: 'l3-1', order: 6, tag: 'statement',
    vi: 'Tôi hai mươi lăm tuổi.', zh: '我二十五岁。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'hai mươi lăm tuổi', zh: '二十五岁', role: 'predicate', vocabId: 'u4-19' },
    ],
    exercises: [
      { id: 'se3-1-4', type: 'translate', answer: 'Tôi hai mươi lăm tuổi.', hint: 'Tôi + hai mươi lăm tuổi', explain: '25 读 hai mươi lăm，不说 năm。' },
    ],
  },

  {
    id: 's3-2-4', lessonId: 'l3-2', order: 4, tag: 'statement',
    vi: 'Buổi sáng tôi uống cà phê.', zh: '早上我喝咖啡。',
    chunks: [
      { vi: 'Buổi sáng', zh: '早上', role: 'time', vocabId: 'u3-31' },
      { vi: 'tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'uống', zh: '喝', role: 'predicate', vocabId: 'u6-02' },
      { vi: 'cà phê', zh: '咖啡', role: 'object', vocabId: 'u6-05' },
    ],
    exercises: [
      { id: 'se3-2-3', type: 'blank', chunkIndex: 0, answer: 'Buổi sáng', hint: '「早上」', explain: 'buổi sáng = 早上/上午。' },
    ],
  },
  {
    id: 's3-2-5', lessonId: 'l3-2', order: 5, tag: 'statement',
    vi: 'Bây giờ là bảy giờ tối.', zh: '现在是晚上七点。',
    chunks: [
      { vi: 'Bây giờ', zh: '现在', role: 'time', vocabId: 'u3-23' },
      { vi: 'là', zh: '是', role: 'predicate', vocabId: 'u2-11' },
      { vi: 'bảy giờ tối', zh: '晚上七点', role: 'object', vocabId: 'u3-33' },
    ],
    exercises: [],
  },
  {
    id: 's3-2-6', lessonId: 'l3-2', order: 6, tag: 'statement',
    vi: 'Chiều nay tôi đi học lúc hai giờ.', zh: '今天下午我两点去上学。',
    chunks: [
      { vi: 'Chiều nay', zh: '今天下午', role: 'time', vocabId: 'u3-32' },
      { vi: 'tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'đi học', zh: '去上学', role: 'predicate', vocabId: 'u4-30' },
      { vi: 'lúc hai giờ', zh: '两点', role: 'time', vocabId: 'u3-13' },
    ],
    exercises: [
      { id: 'se3-2-4', type: 'translate', answer: 'Chiều nay tôi đi học lúc hai giờ.', hint: 'Chiều nay + tôi + đi học + lúc hai giờ', explain: '时段词放句首，具体时刻前用 lúc。' },
    ],
  },

  {
    id: 's3-3-4', lessonId: 'l3-3', order: 4, tag: 'statement',
    vi: 'Sinh nhật tôi là ngày mười tháng ba.', zh: '我的生日是三月十号。',
    chunks: [
      { vi: 'Sinh nhật tôi', zh: '我的生日', role: 'subject', vocabId: 'u3-38' },
      { vi: 'là', zh: '是', role: 'predicate', vocabId: 'u2-11' },
      { vi: 'ngày mười tháng ba', zh: '三月十号', role: 'object', vocabId: 'u3-22' },
    ],
    exercises: [
      { id: 'se3-3-3', type: 'blank', chunkIndex: 2, answer: 'ngày mười tháng ba', hint: '日 + 月，用越南语', explain: '日期顺序是「日-月」。' },
    ],
  },
  {
    id: 's3-3-5', lessonId: 'l3-3', order: 5, tag: 'statement',
    vi: 'Tuần này tôi bận lắm.', zh: '这周我很忙。',
    chunks: [
      { vi: 'Tuần này', zh: '这周', role: 'time', vocabId: 'u3-40' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'bận lắm', zh: '很忙', role: 'predicate', vocabId: 'u8-17' },
    ],
    exercises: [],
  },
  {
    id: 's3-3-6', lessonId: 'l3-3', order: 6, tag: 'statement',
    vi: 'Cuối tuần tôi sẽ đi Hà Nội.', zh: '周末我要去河内。',
    chunks: [
      { vi: 'Cuối tuần', zh: '周末', role: 'time', vocabId: 'u3-39' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'sẽ đi', zh: '要去', role: 'predicate', vocabId: 'u8-11' },
      { vi: 'Hà Nội', zh: '河内', role: 'place', vocabId: 'u2-24' },
    ],
    exercises: [
      { id: 'se3-3-4', type: 'translate', answer: 'Cuối tuần tôi sẽ đi Hà Nội.', hint: 'Cuối tuần + tôi + sẽ đi + Hà Nội', explain: 'sẽ + 动词表将来。' },
    ],
  },

  // ===== U4 =====
  {
    id: 's4-1-4', lessonId: 'l4-1', order: 4, tag: 'statement',
    vi: 'Ông tôi bảy mươi tuổi.', zh: '我爷爷七十岁。',
    chunks: [
      { vi: 'Ông tôi', zh: '我爷爷', role: 'subject', vocabId: 'u4-21' },
      { vi: 'bảy mươi tuổi', zh: '七十岁', role: 'predicate', vocabId: 'u4-19' },
    ],
    exercises: [
      { id: 'se4-1-3', type: 'blank', chunkIndex: 1, answer: 'bảy mươi tuổi', hint: '「七十岁」', explain: '数词 + tuổi 表年龄，句中没有动词。' },
    ],
  },
  {
    id: 's4-1-5', lessonId: 'l4-1', order: 5, tag: 'statement',
    vi: 'Gia đình tôi có ông bà.', zh: '我家有爷爷奶奶。',
    chunks: [
      { vi: 'Gia đình tôi', zh: '我家', role: 'subject', vocabId: 'u4-01' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'ông bà', zh: '爷爷奶奶', role: 'object', vocabId: 'u4-21' },
    ],
    exercises: [],
  },
  {
    id: 's4-1-6', lessonId: 'l4-1', order: 6, tag: 'statement',
    vi: 'Cháu rất thích ông bà.', zh: '我很喜欢爷爷奶奶。',
    chunks: [
      { vi: 'Cháu', zh: '我（孙辈）', role: 'subject', vocabId: 'u4-23' },
      { vi: 'rất thích', zh: '很喜欢', role: 'predicate', vocabId: 'u8-06' },
      { vi: 'ông bà', zh: '爷爷奶奶', role: 'object', vocabId: 'u4-22' },
    ],
    exercises: [
      { id: 'se4-1-4', type: 'translate', answer: 'Cháu rất thích ông bà.', hint: 'Cháu + rất thích + ông bà', explain: '对祖父母自称 cháu。' },
    ],
  },

  {
    id: 's4-2-4', lessonId: 'l4-2', order: 4, tag: 'statement',
    vi: 'Tôi ăn trưa lúc mười hai giờ.', zh: '我十二点吃午饭。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'ăn trưa', zh: '吃午饭', role: 'predicate', vocabId: 'u4-27' },
      { vi: 'lúc mười hai giờ', zh: '十二点', role: 'time', vocabId: 'u3-13' },
    ],
    exercises: [
      { id: 'se4-2-3', type: 'blank', chunkIndex: 2, answer: 'lúc mười hai giờ', hint: '「十二点」', explain: '具体时刻前用 lúc。' },
    ],
  },
  {
    id: 's4-2-5', lessonId: 'l4-2', order: 5, tag: 'statement',
    vi: 'Tôi về nhà lúc sáu giờ chiều.', zh: '我下午六点回家。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'về nhà', zh: '回家', role: 'predicate', vocabId: 'u4-29' },
      { vi: 'lúc sáu giờ chiều', zh: '下午六点', role: 'time', vocabId: 'u3-32' },
    ],
    exercises: [],
  },
  {
    id: 's4-2-6', lessonId: 'l4-2', order: 6, tag: 'statement',
    vi: 'Tôi đánh răng rồi đi ngủ.', zh: '我刷牙然后睡觉。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'đánh răng', zh: '刷牙', role: 'predicate', vocabId: 'u4-33' },
      { vi: 'rồi', zh: '然后', role: 'particle' },
      { vi: 'đi ngủ', zh: '去睡觉', role: 'predicate', vocabId: 'u4-09' },
    ],
    exercises: [
      { id: 'se4-2-4', type: 'translate', answer: 'Tôi đánh răng rồi đi ngủ.', hint: 'Tôi + đánh răng + rồi + đi ngủ', explain: 'rồi 连接先后动作。' },
    ],
  },

  {
    id: 's4-3-4', lessonId: 'l4-3', order: 4, tag: 'statement',
    vi: 'Tôi luôn luôn dậy sớm.', zh: '我总是早起。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'luôn luôn', zh: '总是', role: 'modifier', vocabId: 'u4-35' },
      { vi: 'dậy sớm', zh: '早起', role: 'predicate', vocabId: 'u4-10' },
    ],
    exercises: [
      { id: 'se4-3-3', type: 'blank', chunkIndex: 1, answer: 'luôn luôn', hint: '「总是」', explain: 'luôn luôn 放主语和动词之间。' },
    ],
  },
  {
    id: 's4-3-5', lessonId: 'l4-3', order: 5, tag: 'statement',
    vi: 'Thỉnh thoảng tôi nghỉ ở nhà.', zh: '偶尔我在家休息。',
    chunks: [
      { vi: 'Thỉnh thoảng', zh: '偶尔', role: 'modifier', vocabId: 'u4-37' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'nghỉ', zh: '休息', role: 'predicate', vocabId: 'u4-39' },
      { vi: 'ở nhà', zh: '在家', role: 'place', vocabId: 'u4-17' },
    ],
    exercises: [],
  },
  {
    id: 's4-3-6', lessonId: 'l4-3', order: 6, tag: 'statement',
    vi: 'Hiếm khi tôi đi ngủ muộn.', zh: '我很少晚睡。',
    chunks: [
      { vi: 'Hiếm khi', zh: '很少', role: 'modifier', vocabId: 'u4-38' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'đi ngủ', zh: '去睡觉', role: 'predicate', vocabId: 'u4-09' },
      { vi: 'muộn', zh: '晚', role: 'modifier', vocabId: 'u3-36' },
    ],
    exercises: [
      { id: 'se4-3-4', type: 'translate', answer: 'Hiếm khi tôi đi ngủ muộn.', hint: 'Hiếm khi + tôi + đi ngủ + muộn', explain: 'hiếm khi = 很少，放句首或动词前。' },
    ],
  },

  // ===== U5 =====
  {
    id: 's5-1-4', lessonId: 'l5-1', order: 4, tag: 'statement',
    vi: 'Tôi mua một bộ quần áo.', zh: '我买一套衣服。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'mua', zh: '买', role: 'predicate', vocabId: 'u5-09' },
      { vi: 'một bộ quần áo', zh: '一套衣服', role: 'object', vocabId: 'u5-21' },
    ],
    exercises: [
      { id: 'se5-1-3', type: 'blank', chunkIndex: 2, answer: 'một bộ quần áo', hint: '「一套衣服」', explain: 'bộ 是「套」的量词。' },
    ],
  },
  {
    id: 's5-1-5', lessonId: 'l5-1', order: 5, tag: 'statement',
    vi: 'Cửa hàng có nhiều quyển sách.', zh: '商店有很多书。',
    chunks: [
      { vi: 'Cửa hàng', zh: '商店', role: 'subject', vocabId: 'u5-16' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'nhiều quyển sách', zh: '很多书', role: 'object', vocabId: 'u5-20' },
    ],
    exercises: [],
  },
  {
    id: 's5-1-6', lessonId: 'l5-1', order: 6, tag: 'statement',
    vi: 'Tôi có hai con chó.', zh: '我有两只狗。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'hai con chó', zh: '两只狗', role: 'object', vocabId: 'u5-19' },
    ],
    exercises: [
      { id: 'se5-1-4', type: 'translate', answer: 'Tôi có hai con chó.', hint: 'Tôi + có + hai con chó', explain: '动物用量词 con。' },
    ],
  },

  {
    id: 's5-2-4', lessonId: 'l5-2', order: 4, tag: 'statement',
    vi: 'Cái này rẻ quá!', zh: '这个太便宜了！',
    chunks: [
      { vi: 'Cái này', zh: '这个', role: 'subject', vocabId: 'u5-01' },
      { vi: 'rẻ quá', zh: '太便宜了', role: 'predicate', vocabId: 'u5-08' },
    ],
    exercises: [
      { id: 'se5-2-3', type: 'blank', chunkIndex: 1, answer: 'rẻ quá', hint: '「太便宜了」', explain: 'quá 放形容词后表「太」。' },
    ],
  },
  {
    id: 's5-2-5', lessonId: 'l5-2', order: 5, tag: 'statement',
    vi: 'Tôi muốn giảm giá.', zh: '我想要打折。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'muốn', zh: '想要', role: 'predicate', vocabId: 'u8-15' },
      { vi: 'giảm giá', zh: '打折', role: 'object', vocabId: 'u5-30' },
    ],
    exercises: [],
  },
  {
    id: 's5-2-6', lessonId: 'l5-2', order: 6, tag: 'statement',
    vi: 'Hóa đơn là hai trăm nghìn.', zh: '账单是二十万盾。',
    chunks: [
      { vi: 'Hóa đơn', zh: '账单', role: 'subject', vocabId: 'u5-28' },
      { vi: 'là', zh: '是', role: 'predicate', vocabId: 'u2-11' },
      { vi: 'hai trăm nghìn', zh: '二十万盾', role: 'object', vocabId: 'u3-28' },
    ],
    exercises: [
      { id: 'se5-2-4', type: 'translate', answer: 'Hóa đơn là hai trăm nghìn.', hint: 'Hóa đơn + là + hai trăm nghìn', explain: 'hai trăm nghìn = 200,000。' },
    ],
  },

  {
    id: 's5-3-4', lessonId: 'l5-3', order: 4, tag: 'question',
    vi: 'Có màu trắng không?', zh: '有白色的吗？',
    chunks: [
      { vi: 'Có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'màu trắng', zh: '白色', role: 'object', vocabId: 'u5-32' },
      { vi: 'không', zh: '吗', role: 'particle', vocabId: 'u2-14' },
    ],
    exercises: [
      { id: 'se5-3-3', type: 'blank', chunkIndex: 1, answer: 'màu trắng', hint: '「白色」', explain: '颜色词前加 màu。' },
    ],
  },
  {
    id: 's5-3-5', lessonId: 'l5-3', order: 5, tag: 'statement',
    vi: 'Áo này rộng quá.', zh: '这件衣服太宽松。',
    chunks: [
      { vi: 'Áo này', zh: '这件衣服', role: 'subject', vocabId: 'u5-11' },
      { vi: 'rộng quá', zh: '太宽松', role: 'predicate', vocabId: 'u5-37' },
    ],
    exercises: [],
  },
  {
    id: 's5-3-6', lessonId: 'l5-3', order: 6, tag: 'statement',
    vi: 'Tôi muốn đổi cái khác.', zh: '我想换一个。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'muốn đổi', zh: '想换', role: 'predicate', vocabId: 'u5-29' },
      { vi: 'cái khác', zh: '别的', role: 'object' },
    ],
    exercises: [
      { id: 'se5-3-4', type: 'translate', answer: 'Tôi muốn đổi cái khác.', hint: 'Tôi + muốn đổi + cái khác', explain: 'khác = 别的/其他的。' },
    ],
  },

  // ===== U6 =====
  {
    id: 's6-1-4', lessonId: 'l6-1', order: 4, tag: 'statement',
    vi: 'Tôi ăn bánh mì buổi sáng.', zh: '我早上吃法包。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject', vocabId: 'u2-05' },
      { vi: 'ăn', zh: '吃', role: 'predicate', vocabId: 'u6-01' },
      { vi: 'bánh mì', zh: '法包', role: 'object', vocabId: 'u6-19' },
      { vi: 'buổi sáng', zh: '早上', role: 'time', vocabId: 'u3-31' },
    ],
    exercises: [
      { id: 'se6-1-3', type: 'blank', chunkIndex: 2, answer: 'bánh mì', hint: '「法包」', explain: 'bánh mì 是越南最常见的早餐。' },
    ],
  },
  {
    id: 's6-1-5', lessonId: 'l6-1', order: 5, tag: 'statement',
    vi: 'Tôi thích bánh xèo.', zh: '我喜欢越南煎饼。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'thích', zh: '喜欢', role: 'predicate', vocabId: 'u8-06' },
      { vi: 'bánh xèo', zh: '越南煎饼', role: 'object', vocabId: 'u6-21' },
    ],
    exercises: [],
  },
  {
    id: 's6-1-6', lessonId: 'l6-1', order: 6, tag: 'statement',
    vi: 'Món này rất mặn.', zh: '这个菜很咸。',
    chunks: [
      { vi: 'Món này', zh: '这个菜', role: 'subject' },
      { vi: 'rất mặn', zh: '很咸', role: 'predicate', vocabId: 'u6-26' },
    ],
    exercises: [
      { id: 'se6-1-4', type: 'translate', answer: 'Món này rất mặn.', hint: 'Món này + rất mặn', explain: 'món = 菜/菜品。' },
    ],
  },

  {
    id: 's6-2-4', lessonId: 'l6-2', order: 4, tag: 'request',
    vi: 'Cho tôi thêm một bát cơm.', zh: '再给我一碗饭。',
    chunks: [
      { vi: 'Cho tôi', zh: '给我', role: 'predicate', vocabId: 'u6-11' },
      { vi: 'thêm', zh: '再加', role: 'modifier' },
      { vi: 'một bát cơm', zh: '一碗饭', role: 'object', vocabId: 'u6-31' },
    ],
    exercises: [
      { id: 'se6-2-3', type: 'blank', chunkIndex: 2, answer: 'một bát cơm', hint: '「一碗饭」', explain: 'bát 是「碗」的量词。' },
    ],
  },
  {
    id: 's6-2-5', lessonId: 'l6-2', order: 5, tag: 'negative',
    vi: 'Tôi không ăn ớt.', zh: '我不吃辣椒。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'không ăn', zh: '不吃', role: 'predicate', vocabId: 'u2-16' },
      { vi: 'ớt', zh: '辣椒', role: 'object', vocabId: 'u6-30' },
    ],
    exercises: [],
  },
  {
    id: 's6-2-6', lessonId: 'l6-2', order: 6, tag: 'request',
    vi: 'Cho tôi một ly trà đá.', zh: '给我一杯冰茶。',
    chunks: [
      { vi: 'Cho tôi', zh: '给我', role: 'predicate' },
      { vi: 'một ly', zh: '一杯', role: 'object', vocabId: 'u6-33' },
      { vi: 'trà đá', zh: '冰茶', role: 'object', vocabId: 'u6-06' },
    ],
    exercises: [
      { id: 'se6-2-4', type: 'translate', answer: 'Cho tôi một ly trà đá.', hint: 'Cho tôi + một ly + trà đá', explain: 'ly 是「杯」的量词。' },
    ],
  },

  {
    id: 's6-3-4', lessonId: 'l6-3', order: 4, tag: 'negative',
    vi: 'Tôi không thích ăn ngọt.', zh: '我不喜欢吃甜的。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'không thích', zh: '不喜欢', role: 'predicate', vocabId: 'u8-06' },
      { vi: 'ăn ngọt', zh: '吃甜的', role: 'object', vocabId: 'u6-10' },
    ],
    exercises: [
      { id: 'se6-3-3', type: 'blank', chunkIndex: 2, answer: 'ăn ngọt', hint: '「吃甜的」', explain: 'ngọt = 甜。' },
    ],
  },
  {
    id: 's6-3-5', lessonId: 'l6-3', order: 5, tag: 'statement',
    vi: 'Món này hơi chua.', zh: '这个菜有点酸。',
    chunks: [
      { vi: 'Món này', zh: '这个菜', role: 'subject' },
      { vi: 'hơi chua', zh: '有点酸', role: 'predicate', vocabId: 'u6-25' },
    ],
    exercises: [],
  },
  {
    id: 's6-3-6', lessonId: 'l6-3', order: 6, tag: 'statement',
    vi: 'Tôi ăn chay.', zh: '我吃素。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'ăn chay', zh: '吃素', role: 'predicate', vocabId: 'u6-35' },
    ],
    exercises: [
      { id: 'se6-3-4', type: 'translate', answer: 'Tôi ăn chay.', hint: 'Tôi + ăn chay', explain: 'ăn chay = 吃素。' },
    ],
  },

  // ===== U7 =====
  {
    id: 's7-1-4', lessonId: 'l7-1', order: 4, tag: 'statement',
    vi: 'Ngân hàng ở bên phải.', zh: '银行在右边。',
    chunks: [
      { vi: 'Ngân hàng', zh: '银行', role: 'subject' },
      { vi: 'ở', zh: '在', role: 'predicate', vocabId: 'u4-18' },
      { vi: 'bên phải', zh: '右边', role: 'place', vocabId: 'u7-22' },
    ],
    exercises: [
      { id: 'se7-1-3', type: 'blank', chunkIndex: 2, answer: 'bên phải', hint: '「右边」', explain: 'bên phải = 右边；bên trái = 左边。' },
    ],
  },
  {
    id: 's7-1-5', lessonId: 'l7-1', order: 5, tag: 'statement',
    vi: 'Đi thẳng đến ngã tư.', zh: '直走到十字路口。',
    chunks: [
      { vi: 'Đi thẳng', zh: '直走', role: 'predicate', vocabId: 'u7-09' },
      { vi: 'đến', zh: '到', role: 'predicate' },
      { vi: 'ngã tư', zh: '十字路口', role: 'place', vocabId: 'u7-19' },
    ],
    exercises: [],
  },
  {
    id: 's7-1-6', lessonId: 'l7-1', order: 6, tag: 'statement',
    vi: 'Khách sạn ở đối diện.', zh: '酒店在对面。',
    chunks: [
      { vi: 'Khách sạn', zh: '酒店', role: 'subject', vocabId: 'u7-15' },
      { vi: 'ở', zh: '在', role: 'predicate' },
      { vi: 'đối diện', zh: '对面', role: 'place', vocabId: 'u7-24' },
    ],
    exercises: [
      { id: 'se7-1-4', type: 'translate', answer: 'Khách sạn ở đối diện.', hint: 'Khách sạn + ở + đối diện', explain: 'đối diện = 在……对面。' },
    ],
  },

  {
    id: 's7-2-4', lessonId: 'l7-2', order: 4, tag: 'statement',
    vi: 'Tôi đi học bằng xe đạp.', zh: '我骑自行车上学。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'đi học', zh: '上学', role: 'predicate', vocabId: 'u4-30' },
      { vi: 'bằng xe đạp', zh: '骑自行车', role: 'modifier', vocabId: 'u7-25' },
    ],
    exercises: [
      { id: 'se7-2-3', type: 'blank', chunkIndex: 2, answer: 'bằng xe đạp', hint: '「骑自行车」', explain: 'bằng + 交通工具表方式。' },
    ],
  },
  {
    id: 's7-2-5', lessonId: 'l7-2', order: 5, tag: 'question',
    vi: 'Mất bao lâu?', zh: '要多久？',
    chunks: [
      { vi: 'Mất', zh: '花费（时间）', role: 'predicate', vocabId: 'u7-18' },
      { vi: 'bao lâu', zh: '多久', role: 'particle' },
    ],
    exercises: [],
  },
  {
    id: 's7-2-6', lessonId: 'l7-2', order: 6, tag: 'statement',
    vi: 'Đi tàu hỏa mất ba giờ.', zh: '坐火车要三小时。',
    chunks: [
      { vi: 'Đi tàu hỏa', zh: '坐火车', role: 'subject', vocabId: 'u7-27' },
      { vi: 'mất', zh: '花费', role: 'predicate' },
      { vi: 'ba giờ', zh: '三小时', role: 'object', vocabId: 'u3-13' },
    ],
    exercises: [
      { id: 'se7-2-4', type: 'translate', answer: 'Đi tàu hỏa mất ba giờ.', hint: 'Đi tàu hỏa + mất + ba giờ', explain: 'mất + 时间 = 花费多少时间。' },
    ],
  },

  {
    id: 's7-3-4', lessonId: 'l7-3', order: 4, tag: 'statement',
    vi: 'Tôi muốn trả phòng.', zh: '我想退房。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'muốn', zh: '想', role: 'predicate', vocabId: 'u8-15' },
      { vi: 'trả phòng', zh: '退房', role: 'object', vocabId: 'u7-35' },
    ],
    exercises: [
      { id: 'se7-3-3', type: 'blank', chunkIndex: 2, answer: 'trả phòng', hint: '「退房」', explain: 'trả phòng = 退房；nhận phòng = 入住。' },
    ],
  },
  {
    id: 's7-3-5', lessonId: 'l7-3', order: 5, tag: 'statement',
    vi: 'Phòng đôi hai đêm.', zh: '双人间两晚。',
    chunks: [
      { vi: 'Phòng đôi', zh: '双人间', role: 'subject', vocabId: 'u7-37' },
      { vi: 'hai đêm', zh: '两晚', role: 'object' },
    ],
    exercises: [],
  },
  {
    id: 's7-3-6', lessonId: 'l7-3', order: 6, tag: 'question',
    vi: 'Cho tôi hỏi, thang máy ở đâu?', zh: '请问电梯在哪里？',
    chunks: [
      { vi: 'Cho tôi hỏi', zh: '请问', role: 'predicate', vocabId: 'u6-11' },
      { vi: 'thang máy', zh: '电梯', role: 'subject' },
      { vi: 'ở đâu', zh: '在哪里', role: 'particle' },
    ],
    exercises: [
      { id: 'se7-3-4', type: 'translate', answer: 'Cho tôi hỏi, thang máy ở đâu?', hint: 'Cho tôi hỏi + thang máy + ở đâu', explain: 'ở đâu = 在哪里。' },
    ],
  },

  // ===== U8 =====
  {
    id: 's8-1-4', lessonId: 'l8-1', order: 4, tag: 'statement',
    vi: 'Tôi làm việc ở văn phòng.', zh: '我在办公室工作。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'làm việc', zh: '工作', role: 'predicate', vocabId: 'u8-19' },
      { vi: 'ở văn phòng', zh: '在办公室', role: 'place', vocabId: 'u8-20' },
    ],
    exercises: [
      { id: 'se8-1-3', type: 'blank', chunkIndex: 2, answer: 'ở văn phòng', hint: '「在办公室」', explain: 'ở + 地点 = 在……工作。' },
    ],
  },
  {
    id: 's8-1-5', lessonId: 'l8-1', order: 5, tag: 'statement',
    vi: 'Công ty tôi có nhiều đồng nghiệp.', zh: '我公司有很多同事。',
    chunks: [
      { vi: 'Công ty tôi', zh: '我公司', role: 'subject', vocabId: 'u8-02' },
      { vi: 'có', zh: '有', role: 'predicate', vocabId: 'u2-17' },
      { vi: 'nhiều đồng nghiệp', zh: '很多同事', role: 'object', vocabId: 'u2-42' },
    ],
    exercises: [],
  },
  {
    id: 's8-1-6', lessonId: 'l8-1', order: 6, tag: 'statement',
    vi: 'Bố tôi là bác sĩ ở bệnh viện.', zh: '我爸爸是医院的医生。',
    chunks: [
      { vi: 'Bố tôi', zh: '我爸爸', role: 'subject', vocabId: 'u4-02' },
      { vi: 'là bác sĩ', zh: '是医生', role: 'predicate', vocabId: 'u8-04' },
      { vi: 'ở bệnh viện', zh: '在医院', role: 'place', vocabId: 'u8-21' },
    ],
    exercises: [
      { id: 'se8-1-4', type: 'translate', answer: 'Bố tôi là bác sĩ ở bệnh viện.', hint: 'Bố tôi + là bác sĩ + ở bệnh viện', explain: '职业 + ở + 工作地点。' },
    ],
  },

  {
    id: 's8-2-4', lessonId: 'l8-2', order: 4, tag: 'statement',
    vi: 'Tôi thích nghe nhạc.', zh: '我喜欢听音乐。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'thích', zh: '喜欢', role: 'predicate', vocabId: 'u8-06' },
      { vi: 'nghe nhạc', zh: '听音乐', role: 'object', vocabId: 'u8-26' },
    ],
    exercises: [
      { id: 'se8-2-3', type: 'blank', chunkIndex: 2, answer: 'nghe nhạc', hint: '「听音乐」', explain: 'nghe = 听；nhạc = 音乐。' },
    ],
  },
  {
    id: 's8-2-5', lessonId: 'l8-2', order: 5, tag: 'statement',
    vi: 'Cô ấy thích nấu ăn.', zh: '她喜欢做饭。',
    chunks: [
      { vi: 'Cô ấy', zh: '她', role: 'subject', vocabId: 'u2-07' },
      { vi: 'thích', zh: '喜欢', role: 'predicate', vocabId: 'u8-06' },
      { vi: 'nấu ăn', zh: '做饭', role: 'object', vocabId: 'u8-28' },
    ],
    exercises: [],
  },
  {
    id: 's8-2-6', lessonId: 'l8-2', order: 6, tag: 'statement',
    vi: 'Cuối tuần tôi thường đi dạo.', zh: '周末我通常散步。',
    chunks: [
      { vi: 'Cuối tuần', zh: '周末', role: 'time', vocabId: 'u3-39' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'thường đi dạo', zh: '通常散步', role: 'predicate', vocabId: 'u8-30' },
    ],
    exercises: [
      { id: 'se8-2-4', type: 'translate', answer: 'Cuối tuần tôi thường đi dạo.', hint: 'Cuối tuần + tôi + thường đi dạo', explain: 'thường = 通常，放动词前。' },
    ],
  },

  {
    id: 's8-3-4', lessonId: 'l8-3', order: 4, tag: 'statement',
    vi: 'Năm ngoái tôi đã đi Việt Nam.', zh: '去年我去过越南。',
    chunks: [
      { vi: 'Năm ngoái', zh: '去年', role: 'time', vocabId: 'u8-33' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'đã đi', zh: '去了', role: 'predicate', vocabId: 'u8-09' },
      { vi: 'Việt Nam', zh: '越南', role: 'place', vocabId: 'u2-14' },
    ],
    exercises: [
      { id: 'se8-3-3', type: 'blank', chunkIndex: 0, answer: 'Năm ngoái', hint: '「去年」', explain: 'năm ngoái = 去年；năm sau = 明年。' },
    ],
  },
  {
    id: 's8-3-5', lessonId: 'l8-3', order: 5, tag: 'statement',
    vi: 'Tôi vừa đến.', zh: '我刚到。',
    chunks: [
      { vi: 'Tôi', zh: '我', role: 'subject' },
      { vi: 'vừa đến', zh: '刚到', role: 'predicate', vocabId: 'u8-36' },
    ],
    exercises: [],
  },
  {
    id: 's8-3-6', lessonId: 'l8-3', order: 6, tag: 'statement',
    vi: 'Tuần sau tôi sẽ đi công tác.', zh: '下周我要出差。',
    chunks: [
      { vi: 'Tuần sau', zh: '下周', role: 'time', vocabId: 'u8-13' },
      { vi: 'tôi', zh: '我', role: 'subject' },
      { vi: 'sẽ đi', zh: '要去', role: 'predicate', vocabId: 'u8-11' },
      { vi: 'công tác', zh: '出差', role: 'object', vocabId: 'u8-39' },
    ],
    exercises: [
      { id: 'se8-3-4', type: 'translate', answer: 'Tuần sau tôi sẽ đi công tác.', hint: 'Tuần sau + tôi + sẽ đi + công tác', explain: 'sẽ + 动词表将来。' },
    ],
  },
];

export const EXTRA_LESSONS: Record<string, LessonExtra> = {
  'l1-1': {
    vocabIds: ['u1-13', 'u1-14', 'u1-15', 'u1-16', 'u1-17'],
    grammar: [{
      id: 'g1-1b', title: '每个音节至少有一个元音',
      explanation: '越南语的音节以元音为核心。单元音 a、e、i、o、u 可以直接构成音节，例如 e（怕）；辅音不能单独发音，必须搭配元音，例如 b 要读成 bê（字母名），在单词里必须跟元音：ba、bê。拼读时先找元音，再拼前面的辅音和后面的韵尾。',
      examples: [
        { vi: 'e / ăn', zh: '「怕」/「吃」——都以元音为核心' },
        { vi: 'ba / bê', zh: '辅音 b 必须带元音' },
      ],
      tips: ['看到单词先找元音，元音决定读音和声调', '辅音字母名不等于它在单词里的发音'],
    }],
    dialogues: [{
      id: 'd1-1b', title: '拼读练习',
      lines: [
        { speaker: 'A', vi: 'Từ này đánh vần thế nào?', zh: '这个词怎么拼？' },
        { speaker: 'B', vi: 'T-h-ư, thư.', zh: 't-h-ư，thư。' },
        { speaker: 'A', vi: 'Còn từ "nghe"?', zh: '那 nghe 呢？' },
        { speaker: 'B', vi: 'N-g-h-e, nghe.', zh: 'n-g-h-e，nghe。' },
      ],
    }],
    exercises: [
      { id: 'e1-1-4', type: 'choice', prompt: '「chữ hoa」是什么意思？', options: ['大写字母', '小写字母', '音节', '声调'], answer: 0, explain: 'chữ hoa = 大写字母；chữ thường = 小写字母。' },
      { id: 'e1-1-5', type: 'fill', prompt: '「音节」的越南语是 ___', answer: 'âm tiết', hint: 'âm = 音，tiết = 节', explain: 'âm tiết 是汉越词「音节」。' },
      { id: 'e1-1-6', type: 'choice', prompt: '越南语的辅音能单独构成音节吗？', options: ['能，比如 b', '不能，必须搭配元音', '只在句首能', '只在数字里能'], answer: 1, explain: '音节必须有元音，辅音只能出现在元音前后。' },
    ],
  },

  'l1-2': {
    vocabIds: ['u1-18', 'u1-19', 'u1-20', 'u1-21', 'u1-22'],
    grammar: [{
      id: 'g1-2b', title: '平声不标调，其余五个都要标',
      explanation: '六个声调里只有 ngang（平声）不写任何符号，所以「a」看起来和拉丁字母一样。其余五个声调必须标：sắc 标锐号 ´、huyền 标 `、hỏi 标 ̉、ngã 标 ~、nặng 标下面的点。声调是词的一部分，漏标会改变词义。',
      examples: [
        { vi: 'ma / má / mà / mả / mã / mạ', zh: '平 / 锐 / 玄 / 问 / 跌 / 重' },
        { vi: 'a / á', zh: '平声不标 / 锐声标 ´' },
      ],
      tips: ['写调号前先确认词是哪个声调', '键盘输入时可用 Telex：a + s 得到 á'],
    }],
    dialogues: [{
      id: 'd1-2b', title: '声调辨别',
      lines: [
        { speaker: 'A', vi: 'Nghe kỹ: cá hay cà?', zh: '仔细听：cá 还是 cà？' },
        { speaker: 'B', vi: 'Cá — con cá.', zh: 'cá——鱼。' },
        { speaker: 'A', vi: 'Đúng rồi. Cá là dấu sắc, cà là dấu huyền.', zh: '对了。cá 是锐声，cà 是玄声。' },
        { speaker: 'B', vi: 'Em nhớ rồi.', zh: '我记住了。' },
      ],
    }],
    exercises: [
      { id: 'e1-2-4', type: 'choice', prompt: '平声（ngang）需要写调号吗？', options: ['要，写 ´', '不要，什么都不写', '要，写 ~', '只在句首写'], answer: 1, explain: 'ngang 是平声，不标任何调号。' },
      { id: 'e1-2-5', type: 'fill', prompt: 'dấu hỏi 对应普通话的第几声？', answer: '3', accept: ['三', '第三', '三声', '3'], hint: '先降后升', explain: 'dấu hỏi 的调型接近普通话三声。' },
      { id: 'e1-2-6', type: 'choice', prompt: '「cá」和「cà」的区别是：', options: ['声调不同', '元音不同', '辅音不同', '意思相同'], answer: 0, explain: 'cá 是锐声，cà 是玄声，声调不同则词义不同。' },
    ],
  },

  'l1-3': {
    vocabIds: ['u1-23', 'u1-24', 'u1-25', 'u1-26', 'u1-27'],
    grammar: [{
      id: 'g1-3b', title: '四个容易混的送气/擦音声母',
      explanation: 'ph 读 /f/，像普通话的 f；th 读 /tʰ/，是送气的 t；kh 读 /x/，接近「喝」的 h；ch 读舌面音，接近不送气的「机」。这四个声母在中文里没有完全对应的音，要靠听感模仿，不要直接套用拼音。',
      examples: [
        { vi: 'phở / thôi', zh: '河粉 / 算了（f 与送气 t）' },
        { vi: 'không / chào', zh: '不 / 你好（h 与舌面音）' },
      ],
      tips: ['th 和 t 只差送气，练「偷」和「都」的差别', 'kh 不要读成普通话的 k'],
    }],
    dialogues: [{
      id: 'd1-3b', title: 't 与 th',
      lines: [
        { speaker: 'A', vi: 'Bạn đọc "tôi" hay "thôi"?', zh: '你读的是 tôi 还是 thôi？' },
        { speaker: 'B', vi: 'Tôi — tôi đi học.', zh: 'tôi——我去上学。' },
        { speaker: 'A', vi: 'Còn "thôi"?', zh: '那 thôi 呢？' },
        { speaker: 'B', vi: 'Thôi — thôi, về nhà.', zh: 'thôi——算了，回家吧。' },
      ],
    }],
    exercises: [
      { id: 'e1-3-4', type: 'choice', prompt: '声母 ph 的发音最接近：', options: ['f', 'p', 'b', 'm'], answer: 0, explain: 'ph 读 /f/，不是送气的 p。' },
      { id: 'e1-3-5', type: 'fill', prompt: '「không」的声母是 ___（两个字母）', answer: 'kh', hint: '喉音', explain: 'không 的声母是 kh，读 /x/。' },
      { id: 'e1-3-6', type: 'choice', prompt: '下面哪个是送气音？', options: ['t', 'th', 'đ', 'b'], answer: 1, explain: 'th 是送气 t；t 不送气，đ、b 是浊音。' },
    ],
  },

  'l1-4': {
    vocabIds: ['u1-28', 'u1-29', 'u1-30', 'u1-31', 'u1-32'],
    grammar: [{
      id: 'g1-4b', title: '塞音尾与鼻音尾的区别',
      explanation: '闭口韵尾 -p、-t、-k（写作 c 时读 /k/）是塞音尾，发音结束时气流被完全截断，不能拖长；-m、-n、-ng 是鼻音尾，气流从鼻腔出来，可以拖长。对比：mát（凉）vs màn（幕）、học（学）vs hồng（红）。',
      examples: [
        { vi: 'mát / màn', zh: '凉 / 幕（-t 对 -n）' },
        { vi: 'học / hồng', zh: '学 / 红（-c 对 -ng）' },
      ],
      tips: ['塞音尾要「戛然而止」，不要加元音', '越南语没有普通话的儿化韵'],
    }],
    dialogues: [{
      id: 'd1-4b', title: '标调位置',
      lines: [
        { speaker: 'A', vi: 'Từ "quyển" có dấu ở đâu?', zh: 'quyển 的调号在哪里？' },
        { speaker: 'B', vi: 'Dấu hỏi ở chữ ê.', zh: '问声调号在 ê 上。' },
        { speaker: 'A', vi: 'Đúng. Còn "của"?', zh: '对。那 của 呢？' },
        { speaker: 'B', vi: 'Dấu hỏi ở chữ a.', zh: '问声调号在 a 上。' },
      ],
    }],
    exercises: [
      { id: 'e1-4-4', type: 'choice', prompt: '「của」的声调符号标在哪个字母上？', options: ['c', 'u', 'a', '每个字母都标'], answer: 2, explain: 'của 的调号标在主要元音 a 上。' },
      { id: 'e1-4-5', type: 'choice', prompt: '下面哪个不是闭口塞音尾？', options: ['-p', '-t', '-k', '-m'], answer: 3, explain: '-m 是鼻音尾，可以拖长。' },
      { id: 'e1-4-6', type: 'fill', prompt: '「học」的韵尾字母是 ___', answer: 'c', hint: '写作 c，读作 /k/', explain: 'học 以 c 结尾，实际读塞音 /k/。' },
    ],
  },

  'l2-1': {
    vocabIds: ['u2-25', 'u2-26', 'u2-27', 'u2-28', 'u2-29', 'u2-30'],
    grammar: [{
      id: 'g2-1b', title: '称呼与自称必须成对',
      explanation: '越南语称呼是成对出现的：对 ông/bà/chú/bác/cô/dì 自称 cháu 或 con；对 anh/chị 自称 em；对 em 自称 anh/chị；对 bạn 自称 mình 或 tôi。称呼用错比语法错误更失礼。句尾加 ạ 表示尊敬。',
      examples: [
        { vi: 'Cháu chào ông ạ!', zh: '爷爷好！（对长辈）' },
        { vi: 'Dạ, cháu tên là Minh ạ.', zh: '是的，我叫明。' },
      ],
      tips: ['初次见长辈用 cháu 自称最稳妥', 'ạ 只加在句尾，不改变句意'],
    }],
    dialogues: [{
      id: 'd2-1b', title: '偶遇',
      lines: [
        { speaker: 'A', vi: 'Chào chị! Lâu rồi không gặp.', zh: '你好！好久不见。' },
        { speaker: 'B', vi: 'Chào em! Dạo này em thế nào?', zh: '你好！你最近怎么样？' },
        { speaker: 'A', vi: 'Em vẫn khỏe. Chị thì sao?', zh: '我还是很好。姐呢？' },
        { speaker: 'B', vi: 'Chị cũng khỏe.', zh: '我也很好。' },
      ],
    }],
    exercises: [
      { id: 'e2-1-4', type: 'choice', prompt: '早上见面应该说：', options: ['Chào buổi sáng', 'Chào buổi tối', 'Chúc ngủ ngon', 'Tạm biệt'], answer: 0, explain: 'chào buổi sáng = 早上好。' },
      { id: 'e2-1-5', type: 'fill', prompt: '「不客气」= không có ___', answer: 'gì', hint: '「什么」', explain: 'không có gì 字面是「没什么」。' },
      { id: 'e2-1-6', type: 'choice', prompt: '「hẹn gặp lại」是什么意思？', options: ['回头见', '早上好', '不客气', '最近'], answer: 0, explain: 'hẹn gặp lại = 约好再见，即回头见。' },
    ],
  },

  'l2-2': {
    vocabIds: ['u2-31', 'u2-32', 'u2-33', 'u2-34', 'u2-35', 'u2-36'],
    grammar: [{
      id: 'g2-2b', title: '否定身份与询问来源',
      explanation: '「不是」用 không phải là：Tôi không phải là giáo viên。问来自哪里：Bạn đến từ đâu? 回答：Tôi đến từ + 地名。问国籍：Bạn là người nước nào? 问名字：Bạn tên là gì?',
      examples: [
        { vi: 'Tôi không phải là người Việt Nam.', zh: '我不是越南人。' },
        { vi: 'Bạn đến từ đâu? — Tôi đến từ Thượng Hải.', zh: '你来自哪里？——我来自上海。' },
      ],
      tips: ['đâu 问地点，gì 问名字/事物', 'nào 问选择，nước nào = 哪个国家'],
    }],
    dialogues: [{
      id: 'd2-2b', title: '介绍朋友',
      lines: [
        { speaker: 'A', vi: 'Đây là bạn tôi, Minh.', zh: '这是我朋友，明。' },
        { speaker: 'B', vi: 'Chào Minh! Bạn đến từ đâu?', zh: '你好明！你来自哪里？' },
        { speaker: 'C', vi: 'Chào chị! Tôi đến từ Thượng Hải.', zh: '你好！我来自上海。' },
        { speaker: 'B', vi: 'Rất vui được gặp bạn.', zh: '很高兴认识你。' },
      ],
    }],
    exercises: [
      { id: 'e2-2-4', type: 'choice', prompt: '「你来自哪里？」怎么说？', options: ['Bạn tên là gì?', 'Bạn đến từ đâu?', 'Bạn làm gì?', 'Bạn là ai?'], answer: 1, explain: 'đến từ đâu = 来自哪里。' },
      { id: 'e2-2-5', type: 'fill', prompt: '「国籍」= quốc ___', answer: 'tịch', hint: '汉越词', explain: 'quốc tịch 是汉越词「国籍」。' },
      { id: 'e2-2-6', type: 'choice', prompt: '「họ」的意思是：', options: ['名字', '姓', '国籍', '城市'], answer: 1, explain: 'họ = 姓；tên = 名字。' },
    ],
  },

  'l2-3': {
    vocabIds: ['u2-37', 'u2-38', 'u2-39', 'u2-40', 'u2-41', 'u2-42'],
    grammar: [{
      id: 'g2-3b', title: '礼貌应答 Vâng / Dạ 与 ạ',
      explanation: '肯定回答用 vâng（对平辈或长辈）或 dạ（更客气，南方常用）；否定用 không ạ。句尾的 ạ 表示尊敬，常与 vâng/dạ 搭配。职业问答：Bạn làm nghề gì? — Tôi là + 职业。',
      examples: [
        { vi: 'Dạ, cháu là học sinh ạ.', zh: '是的，我是学生。' },
        { vi: 'Không ạ, em không phải là giáo viên.', zh: '不是，我不是老师。' },
      ],
      tips: ['dạ 比 vâng 更谦恭', '回答长辈时句尾加 ạ 更自然'],
    }],
    dialogues: [{
      id: 'd2-3b', title: '问职业',
      lines: [
        { speaker: 'A', vi: 'Bạn làm nghề gì?', zh: '你做什么工作？' },
        { speaker: 'B', vi: 'Tôi là nhân viên. Còn bạn?', zh: '我是职员。你呢？' },
        { speaker: 'A', vi: 'Tôi là học sinh. Em gái tôi là thư ký.', zh: '我是学生。我妹妹是秘书。' },
        { speaker: 'B', vi: 'Hay quá!', zh: '真不错！' },
      ],
    }],
    exercises: [
      { id: 'e2-3-4', type: 'choice', prompt: '对长辈应答「是」，最礼貌的是：', options: ['Dạ', 'Ừ', 'Không', 'Này'], answer: 0, explain: 'dạ/vâng 是礼貌的「是」，dạ 更谦恭。' },
      { id: 'e2-3-5', type: 'fill', prompt: '「职业」= nghề ___', answer: 'nghiệp', hint: '汉越词', explain: 'nghề nghiệp = 职业。' },
      { id: 'e2-3-6', type: 'choice', prompt: '「thư ký」是：', options: ['秘书', '老师', '经理', '职员'], answer: 0, explain: 'thư ký 是汉越词「书记」，现代指秘书。' },
    ],
  },

  'l3-1': {
    vocabIds: ['u3-25', 'u3-26', 'u3-27', 'u3-28', 'u3-29', 'u3-30'],
    grammar: [{
      id: 'g3-1b', title: '11–99 的读法与三个变体',
      explanation: '11–19 用 mười + 个位数，其中 15 读 mười lăm（不是 năm）。20–99 用「十位数 + mươi + 个位数」：21 读 hai mươi mốt（1 → mốt）、24 读 hai mươi tư（4 → tư，也可读 bốn）、25 读 hai mươi lăm（5 → lăm）。100 以上：một trăm、một nghìn。',
      examples: [
        { vi: '35 / 41 / 55', zh: 'ba mươi lăm / bốn mươi mốt / năm mươi lăm' },
        { vi: 'một trăm hai mươi', zh: '一百二十' },
      ],
      tips: ['mươi 只用于 20 以上，不能说 mười mươi', '21、31 的「一」一定变 mốt'],
    }],
    dialogues: [{
      id: 'd3-1b', title: '问数量',
      lines: [
        { speaker: 'A', vi: 'Bạn có bao nhiêu quyển sách?', zh: '你有多少本书？' },
        { speaker: 'B', vi: 'Hai mươi lăm quyển.', zh: '二十五本。' },
        { speaker: 'A', vi: 'Nhiều quá!', zh: '好多啊！' },
        { speaker: 'B', vi: 'Ừ, tôi thích đọc sách.', zh: '嗯，我喜欢读书。' },
      ],
    }],
    exercises: [
      { id: 'e3-1-4', type: 'choice', prompt: '数字 15 的正确读法是：', options: ['mười năm', 'mười lăm', 'một năm', 'mươi lăm'], answer: 1, explain: '15 的「五」变读 lăm：mười lăm。' },
      { id: 'e3-1-5', type: 'fill', prompt: '20 = hai ___', answer: 'mươi', hint: '二十的「十」', explain: '20 读 hai mươi，不说 hai mười。' },
      { id: 'e3-1-6', type: 'choice', prompt: '「35」的正确读法是：', options: ['ba mươi lăm', 'ba lăm', 'ba mươi năm', 'ba mươi mốt'], answer: 0, explain: '35 = ba mươi lăm，个位 5 变 lăm。' },
    ],
  },

  'l3-2': {
    vocabIds: ['u3-31', 'u3-32', 'u3-33', 'u3-34', 'u3-35', 'u3-36'],
    grammar: [{
      id: 'g3-2b', title: '时段词与「上午八点」',
      explanation: '问时段用 buổi nào?。时段：buổi sáng（早上/上午）、buổi trưa（中午）、buổi chiều（下午）、buổi tối（晚上）。说具体时刻时，时段词放 giờ 后：tám giờ sáng（上午八点）、bảy giờ tối（晚上七点），比「buổi sáng tám giờ」更自然。',
      examples: [
        { vi: 'Tám giờ sáng tôi đi làm.', zh: '我上午八点上班。' },
        { vi: 'Buổi tối tôi học tiếng Việt.', zh: '晚上我学越南语。' },
      ],
      tips: ['giờ 后面直接跟 sáng/chiều/tối 表时段', 'trưa 指 11–13 点前后'],
    }],
    dialogues: [{
      id: 'd3-2b', title: '下午的安排',
      lines: [
        { speaker: 'A', vi: 'Chiều nay bạn làm gì?', zh: '今天下午你做什么？' },
        { speaker: 'B', vi: 'Tôi đi học lúc hai giờ.', zh: '我两点去上学。' },
        { speaker: 'A', vi: 'Buổi tối thì sao?', zh: '晚上呢？' },
        { speaker: 'B', vi: 'Tôi học tiếng Việt lúc bảy giờ.', zh: '我七点学越南语。' },
      ],
    }],
    exercises: [
      { id: 'e3-2-4', type: 'choice', prompt: '「buổi chiều」是：', options: ['早上', '中午', '下午', '晚上'], answer: 2, explain: 'buổi chiều = 下午。' },
      { id: 'e3-2-5', type: 'fill', prompt: '「上午八点」= tám giờ ___', answer: 'sáng', hint: '早上', explain: '时段词放在 giờ 后：tám giờ sáng。' },
      { id: 'e3-2-6', type: 'choice', prompt: '「今天星期几？」怎么说？', options: ['Hôm nay là ngày bao nhiêu?', 'Hôm nay là thứ mấy?', 'Hôm nay là mấy giờ?', 'Hôm nay là tháng mấy?'], answer: 1, explain: 'thứ mấy = 星期几；ngày bao nhiêu 问日期。' },
    ],
  },

  'l3-3': {
    vocabIds: ['u3-37', 'u3-38', 'u3-39', 'u3-40', 'u3-41', 'u3-42', 'u3-43', 'u3-44'],
    grammar: [{
      id: 'g3-3b', title: '年份、生日与相对时间',
      explanation: '问年份：Năm nay là năm bao nhiêu? 年份逐位读：hai nghìn hai mươi lăm（2025）。生日：Sinh nhật của bạn là ngày bao nhiêu? 相对时间：hôm kia（前天）、hôm qua（昨天）、hôm nay（今天）、ngày mai（明天）、ngày kia（后天）；tuần này（这周）、tháng sau（下个月）。',
      examples: [
        { vi: 'Năm nay là năm hai nghìn hai mươi lăm.', zh: '今年是 2025 年。' },
        { vi: 'Sinh nhật tôi là ngày mười tháng ba.', zh: '我生日是三月十号。' },
      ],
      tips: ['「后天」是 ngày kia，不是 ngày mai kia', '年份不用「万」，用 nghìn'],
    }],
    dialogues: [{
      id: 'd3-3b', title: '聊生日',
      lines: [
        { speaker: 'A', vi: 'Sinh nhật bạn là ngày bao nhiêu?', zh: '你生日几号？' },
        { speaker: 'B', vi: 'Ngày mười tháng ba. Còn bạn?', zh: '三月十号。你呢？' },
        { speaker: 'A', vi: 'Sinh nhật tôi là ngày hai tháng chín.', zh: '我生日是九月二号。' },
        { speaker: 'B', vi: 'Đó là ngày Quốc khánh Việt Nam!', zh: '那是越南国庆！' },
      ],
    }],
    exercises: [
      { id: 'e3-3-4', type: 'choice', prompt: '「我的生日是三月十号」怎么说？', options: ['Sinh nhật tôi là ngày mười tháng ba.', 'Sinh nhật tôi là tháng ba ngày mười.', 'Sinh nhật tôi là ngày ba tháng mười.', 'Sinh nhật tôi là mười ba.'], answer: 0, explain: '日期顺序是 ngày + 日 + tháng + 月。' },
      { id: 'e3-3-5', type: 'fill', prompt: '「今年」= năm ___', answer: 'nay', hint: 'năm ___ = 今年', explain: 'năm nay = 今年。' },
      { id: 'e3-3-6', type: 'choice', prompt: '「下个月」是：', options: ['tháng trước', 'tháng sau', 'tuần sau', 'năm sau'], answer: 1, explain: 'tháng sau = 下个月；tháng trước = 上个月。' },
    ],
  },

  'l4-1': {
    vocabIds: ['u4-21', 'u4-22', 'u4-23', 'u4-24', 'u4-25', 'u4-26'],
    grammar: [{
      id: 'g4-1b', title: '亲属称谓分父系和母系',
      explanation: '越南语亲属称谓区分父系与母系：chú 是父亲的弟弟、bác 是父母的兄姐、cô 是父亲的姐妹、dì 是母亲的姐妹；ông/bà 统称祖父母与外祖父母。称呼长辈时自称 cháu。',
      examples: [
        { vi: 'Chú tôi ở Hà Nội.', zh: '我叔叔在河内。' },
        { vi: 'Dì tôi sống ở Đà Nẵng.', zh: '我姨妈住在岘港。' },
      ],
      tips: ['bác 不分性别，指父母同辈的兄姐', 'cô 和 dì 都译「阿姨」，但父系母系不同'],
    }],
    dialogues: [{
      id: 'd4-1b', title: '介绍家人',
      lines: [
        { speaker: 'A', vi: 'Đây là ai?', zh: '这是谁？' },
        { speaker: 'B', vi: 'Đây là ông tôi. Còn đây là bà tôi.', zh: '这是我爷爷。这是我奶奶。' },
        { speaker: 'A', vi: 'Ông bà bạn bao nhiêu tuổi?', zh: '你爷爷奶奶多大年纪？' },
        { speaker: 'B', vi: 'Ông bảy mươi, bà sáu mươi tám.', zh: '爷爷七十，奶奶六十八。' },
      ],
    }],
    exercises: [
      { id: 'e4-1-4', type: 'choice', prompt: '「爷爷」是：', options: ['ông', 'bà', 'chú', 'dì'], answer: 0, explain: 'ông = 爷爷/外祖父；bà = 奶奶/外祖母。' },
      { id: 'e4-1-5', type: 'fill', prompt: '「孙子/侄孙」称呼自己是 ___', answer: 'cháu', hint: '对祖父母、叔伯的自称', explain: '对长辈自称 cháu。' },
      { id: 'e4-1-6', type: 'choice', prompt: '「bác」指：', options: ['父母的兄姐', '父亲的弟弟', '母亲的姐妹', '哥哥'], answer: 0, explain: 'bác 指父母同辈的兄姐，不区分性别。' },
    ],
  },

  'l4-2': {
    vocabIds: ['u4-27', 'u4-28', 'u4-29', 'u4-30', 'u4-31', 'u4-32', 'u4-33', 'u4-34'],
    grammar: [{
      id: 'g4-2b', title: '一天的活动链与时间位置',
      explanation: '描述作息按时间顺序串起动作：thức（醒）→ dậy（起床）→ đánh răng（刷牙）→ ăn sáng（吃早饭）→ đi học/đi làm → ăn trưa → ngủ trưa → về nhà → ăn tối → đi ngủ。时间状语可放句首，也可放在动词后：Tôi về nhà lúc sáu giờ chiều。',
      examples: [
        { vi: 'Buổi sáng tôi đánh răng rồi ăn sáng.', zh: '早上我刷牙然后吃早饭。' },
        { vi: 'Tôi ngủ trưa ba mươi phút.', zh: '我午睡三十分钟。' },
      ],
      tips: ['rồi 连接先后动作', 'lúc + 具体时刻'],
    }],
    dialogues: [{
      id: 'd4-2b', title: '午休',
      lines: [
        { speaker: 'A', vi: 'Buổi trưa bạn làm gì?', zh: '中午你做什么？' },
        { speaker: 'B', vi: 'Tôi ăn trưa rồi ngủ trưa.', zh: '我吃午饭然后午睡。' },
        { speaker: 'A', vi: 'Bạn ngủ trưa bao lâu?', zh: '你午睡多久？' },
        { speaker: 'B', vi: 'Khoảng ba mươi phút.', zh: '大约三十分钟。' },
      ],
    }],
    exercises: [
      { id: 'e4-2-4', type: 'choice', prompt: '「吃午饭」是：', options: ['ăn sáng', 'ăn trưa', 'ăn tối', 'ăn cơm'], answer: 1, explain: 'ăn trưa = 吃午饭；ăn tối = 吃晚饭。' },
      { id: 'e4-2-5', type: 'fill', prompt: '「回家」= về ___', answer: 'nhà', hint: '「家」', explain: 'về nhà = 回家。' },
      { id: 'e4-2-6', type: 'choice', prompt: '「我下午六点回家」怎么说？', options: ['Tôi về nhà lúc sáu giờ chiều.', 'Tôi về nhà sáu giờ chiều lúc.', 'Tôi lúc về nhà sáu giờ chiều.', 'Về nhà tôi lúc sáu giờ chiều.'], answer: 0, explain: '主语 + 动词 + lúc + 钟点 + 时段。' },
    ],
  },

  'l4-3': {
    vocabIds: ['u4-35', 'u4-36', 'u4-37', 'u4-38', 'u4-39', 'u4-40'],
    grammar: [{
      id: 'g4-3b', title: '频率副词梯级与「每 + 时间」',
      explanation: '频率从高到低：luôn luôn（总是）> thường（通常）> hay（经常）> thỉnh thoảng（偶尔）> hiếm khi（很少）。mỗi + 时间 = 每……：mỗi ngày（每天）、mỗi tuần（每周）、mỗi tháng（每月）。频率副词放主语后、动词前。',
      examples: [
        { vi: 'Tôi hay đi dạo cuối tuần.', zh: '我周末经常散步。' },
        { vi: 'Mỗi tuần tôi học ba lần.', zh: '我每周学三次。' },
      ],
      tips: ['lần = 次：một lần、ba lần', 'thỉnh thoảng 可放句首'],
    }],
    dialogues: [{
      id: 'd4-3b', title: '习惯对比',
      lines: [
        { speaker: 'A', vi: 'Bạn có hay đi dạo không?', zh: '你经常散步吗？' },
        { speaker: 'B', vi: 'Thỉnh thoảng thôi. Tôi hay xem phim.', zh: '偶尔而已。我经常看电影。' },
        { speaker: 'A', vi: 'Tôi thì luôn luôn dậy sớm.', zh: '我总是早起。' },
        { speaker: 'B', vi: 'Giỏi quá!', zh: '真厉害！' },
      ],
    }],
    exercises: [
      { id: 'e4-3-4', type: 'choice', prompt: '「hiếm khi」的意思是：', options: ['总是', '经常', '偶尔', '很少'], answer: 3, explain: 'hiếm khi = 很少；thỉnh thoảng = 偶尔。' },
      { id: 'e4-3-5', type: 'fill', prompt: '「偶尔」= thỉnh ___', answer: 'thoảng', hint: 'thỉnh ___', explain: 'thỉnh thoảng = 偶尔。' },
      { id: 'e4-3-6', type: 'choice', prompt: '「我每周学越南语」怎么说？', options: ['Mỗi tuần tôi học tiếng Việt.', 'Tuần mỗi tôi học tiếng Việt.', 'Tôi mỗi học tuần tiếng Việt.', 'Học tôi mỗi tuần tiếng Việt.'], answer: 0, explain: 'mỗi + 时间放句首或动词前。' },
    ],
  },

  'l5-1': {
    vocabIds: ['u5-19', 'u5-20', 'u5-21', 'u5-22', 'u5-23'],
    grammar: [{
      id: 'g5-1b', title: '量词扩展：con、cuốn、bộ、đôi、tờ',
      explanation: '越南语数词和名词之间必须有量词：con 用于动物（hai con chó）、cuốn 用于书/卷（một cuốn sách）、bộ 用于成套物品（một bộ quần áo）、đôi 用于成对物品（một đôi giày）、tờ 用于纸张/报纸（hai tờ báo）。',
      examples: [
        { vi: 'Một bộ quần áo / một đôi giày', zh: '一套衣服 / 一双鞋' },
        { vi: 'Hai tờ báo / một cuốn sách', zh: '两张报纸 / 一本书' },
      ],
      tips: ['量词不能省略：不说 một sách', 'đôi 本身就含「两个」的意思'],
    }],
    dialogues: [{
      id: 'd5-1b', title: '买衣服',
      lines: [
        { speaker: 'A', vi: 'Chị cần gì?', zh: '你需要什么？' },
        { speaker: 'B', vi: 'Tôi muốn mua một bộ quần áo.', zh: '我想买一套衣服。' },
        { speaker: 'A', vi: 'Bộ này thế nào?', zh: '这套怎么样？' },
        { speaker: 'B', vi: 'Được, tôi lấy bộ này.', zh: '好，我拿这套。' },
      ],
    }],
    exercises: [
      { id: 'e5-1-4', type: 'choice', prompt: '「一双鞋」的量词是：', options: ['bộ', 'đôi', 'cuốn', 'tờ'], answer: 1, explain: '成对物品用 đôi：một đôi giày。' },
      { id: 'e5-1-5', type: 'fill', prompt: '「一套衣服」= một ___ quần áo', answer: 'bộ', hint: '「套」', explain: 'bộ 表示成套。' },
      { id: 'e5-1-6', type: 'choice', prompt: '量词 con 通常用于：', options: ['动物', '书', '衣服', '纸'], answer: 0, explain: 'con 用于动物，如 hai con chó。' },
    ],
  },

  'l5-2': {
    vocabIds: ['u5-24', 'u5-25', 'u5-26', 'u5-27', 'u5-28', 'u5-29', 'u5-30'],
    grammar: [{
      id: 'g5-2b', title: '越南盾口语与大数字',
      explanation: '越南盾面额大，口语常省略 nghìn（千）或 trăm（百）：năm mươi = 50,000 盾、hai trăm = 200,000 盾。砍价用 bớt（减一点）或 giảm giá（打折）；付款方式：tiền mặt（现金）、thẻ（卡）；hóa đơn 是账单/发票。',
      examples: [
        { vi: 'Bớt cho tôi mười nghìn nhé.', zh: '便宜我一万盾吧。' },
        { vi: 'Tôi trả bằng thẻ.', zh: '我刷卡。' },
      ],
      tips: ['nhé 放句尾让请求更柔和', '说价格时先确认单位，避免误解'],
    }],
    dialogues: [{
      id: 'd5-2b', title: '砍价',
      lines: [
        { speaker: 'A', vi: 'Cái này bao nhiêu tiền?', zh: '这个多少钱？' },
        { speaker: 'B', vi: 'Hai trăm nghìn đồng.', zh: '二十万盾。' },
        { speaker: 'A', vi: 'Bớt cho tôi mười nghìn nhé.', zh: '便宜我一万盾吧。' },
        { speaker: 'B', vi: 'Được, một trăm chín mươi nghìn.', zh: '好，十九万。' },
      ],
    }],
    exercises: [
      { id: 'e5-2-4', type: 'choice', prompt: '「bớt」在购物时是什么意思？', options: ['减价/便宜一点', '加价', '付钱', '换货'], answer: 0, explain: 'bớt = 减一点，用于砍价。' },
      { id: 'e5-2-5', type: 'fill', prompt: '「账单/发票」= hóa ___', answer: 'đơn', hint: 'hóa ___', explain: 'hóa đơn 是账单/发票。' },
      { id: 'e5-2-6', type: 'choice', prompt: '「我用现金付款」怎么说？', options: ['Tôi trả bằng tiền mặt.', 'Tôi trả bằng thẻ.', 'Tôi mua tiền mặt.', 'Tôi đổi tiền mặt.'], answer: 0, explain: 'trả bằng + 支付方式。' },
    ],
  },

  'l5-3': {
    vocabIds: ['u5-31', 'u5-32', 'u5-33', 'u5-34', 'u5-35', 'u5-36', 'u5-37', 'u5-38'],
    grammar: [{
      id: 'g5-3b', title: '颜色、尺码与程度词 quá',
      explanation: '颜色词：đen 黑、trắng 白、vàng 黄、hồng 粉、nâu 棕、xám 灰。说「某颜色的」用 màu + 颜色：màu trắng。尺码形容词：rộng 宽松、chật 紧、dài 长、ngắn 短、vừa 合身。quá 放形容词后表示「太」：chật quá（太紧）。',
      examples: [
        { vi: 'Có màu vàng không?', zh: '有黄色的吗？' },
        { vi: 'Cái này chật quá.', zh: '这个太紧了。' },
      ],
      tips: ['问尺码：Có size/cỡ lớn hơn không?', 'vừa 也可表示「正好、刚合适」'],
    }],
    dialogues: [{
      id: 'd5-3b', title: '换颜色和尺码',
      lines: [
        { speaker: 'A', vi: 'Có màu trắng không?', zh: '有白色的吗？' },
        { speaker: 'B', vi: 'Có, đây ạ.', zh: '有，给您。' },
        { speaker: 'A', vi: 'Cái này hơi chật. Có size lớn hơn không?', zh: '这个有点紧。有大一号的吗？' },
        { speaker: 'B', vi: 'Có, để tôi lấy.', zh: '有，我去拿。' },
      ],
    }],
    exercises: [
      { id: 'e5-3-4', type: 'choice', prompt: '「白色」是：', options: ['đen', 'trắng', 'vàng', 'xám'], answer: 1, explain: 'trắng = 白色；đen = 黑色。' },
      { id: 'e5-3-5', type: 'fill', prompt: '「太紧了」= chật ___', answer: 'quá', hint: '「太」', explain: 'quá 放形容词后。' },
      { id: 'e5-3-6', type: 'choice', prompt: '「vừa」在试衣服时表示：', options: ['太大', '太紧', '合身', '太长'], answer: 2, explain: 'vừa = 合身/正合适。' },
    ],
  },

  'l6-1': {
    vocabIds: ['u6-19', 'u6-20', 'u6-21', 'u6-22', 'u6-23', 'u6-24', 'u6-25', 'u6-26'],
    grammar: [{
      id: 'g6-1b', title: '越南常见食物与吃/喝搭配',
      explanation: '主食类：phở（河粉）、bún（米线）、cơm（米饭）、bánh mì（法包）、bánh xèo（煎饼）、chả giò（春卷）。调味：nước mắm（鱼露）、ớt（辣椒）、chanh（柠檬）。固体食物用 ăn（吃），饮料用 uống（喝）；汤类也用 ăn。',
      examples: [
        { vi: 'Tôi ăn phở, uống trà đá.', zh: '我吃河粉，喝冰茶。' },
        { vi: 'Bánh mì Việt Nam rất ngon.', zh: '越南法包很好吃。' },
      ],
      tips: ['phở 是汤粉，动词仍用 ăn', 'ngon = 好吃'],
    }],
    dialogues: [{
      id: 'd6-1b', title: '聊越南菜',
      lines: [
        { speaker: 'A', vi: 'Bạn thích món Việt Nam không?', zh: '你喜欢越南菜吗？' },
        { speaker: 'B', vi: 'Có, tôi thích bánh mì và phở.', zh: '喜欢，我喜欢法包和河粉。' },
        { speaker: 'A', vi: 'Còn bánh xèo?', zh: '那越南煎饼呢？' },
        { speaker: 'B', vi: 'Cũng ngon lắm.', zh: '也很好吃。' },
      ],
    }],
    exercises: [
      { id: 'e6-1-4', type: 'choice', prompt: '「法包」是：', options: ['bánh mì', 'bún', 'chả giò', 'phở'], answer: 0, explain: 'bánh mì = 越南法包。' },
      { id: 'e6-1-5', type: 'fill', prompt: '「鱼露」= nước ___', answer: 'mắm', hint: 'nước ___', explain: 'nước mắm = 鱼露。' },
      { id: 'e6-1-6', type: 'choice', prompt: '吃河粉 phở 时，越南语用哪个动词？', options: ['uống', 'ăn', 'xem', 'mua'], answer: 1, explain: '汤粉也用 ăn，不用 uống。' },
    ],
  },

  'l6-2': {
    vocabIds: ['u6-27', 'u6-28', 'u6-29', 'u6-30', 'u6-31', 'u6-32', 'u6-33'],
    grammar: [{
      id: 'g6-2b', title: '点餐数量与忌口表达',
      explanation: '点餐句式：Cho tôi + 数量 + 菜名。量词：bát（碗）、đĩa（盘）、ly（杯）。少放用 ít + 名词：ít hành（少放葱）、ít ớt（少放辣椒）；不要用 không + 名词；加用 thêm：thêm một bát cơm。',
      examples: [
        { vi: 'Cho tôi một bát phở, ít hành.', zh: '给我一碗河粉，少放葱。' },
        { vi: 'Không ớt, cảm ơn.', zh: '不要辣椒，谢谢。' },
      ],
      tips: ['thêm = 再加', '点餐句尾加 ạ 更礼貌'],
    }],
    dialogues: [{
      id: 'd6-2b', title: '点餐',
      lines: [
        { speaker: 'A', vi: 'Cho tôi một bát phở.', zh: '给我一碗河粉。' },
        { speaker: 'B', vi: 'Có ớt không?', zh: '要辣椒吗？' },
        { speaker: 'A', vi: 'Ít ớt thôi. Và thêm một ly trà đá.', zh: '少放辣椒。再加一杯冰茶。' },
        { speaker: 'B', vi: 'Được ạ.', zh: '好的。' },
      ],
    }],
    exercises: [
      { id: 'e6-2-4', type: 'choice', prompt: '「一碗」的量词是：', options: ['ly', 'đĩa', 'bát', 'con'], answer: 2, explain: 'bát = 碗；ly = 杯。' },
      { id: 'e6-2-5', type: 'fill', prompt: '「少放辣椒」= ___ ớt', answer: 'ít', hint: '「少」', explain: 'ít = 少；nhiều = 多。' },
      { id: 'e6-2-6', type: 'choice', prompt: '「再加一碗饭」怎么说？', options: ['Cho tôi thêm một bát cơm.', 'Cho tôi bớt một bát cơm.', 'Cho tôi không một bát cơm.', 'Cho tôi ít một bát cơm.'], answer: 0, explain: 'thêm = 再加。' },
    ],
  },

  'l6-3': {
    vocabIds: ['u6-34', 'u6-35', 'u6-36', 'u6-37', 'u6-38', 'u6-39', 'u6-40'],
    grammar: [{
      id: 'g6-3b', title: '味道形容词与「吃不了」',
      explanation: '味道：ngọt 甜、chua 酸、mặn 咸、cay 辣、béo 油腻。表达「吃不了/喝不了」用 không + 动词 + được：Tôi không ăn được đồ béo。吃素 = ăn chay。调料：đường 糖、muối 盐、tiêu 胡椒、chanh 柠檬、tỏi 蒜。',
      examples: [
        { vi: 'Tôi không ăn được đồ béo.', zh: '我吃不了油腻的东西。' },
        { vi: 'Tôi ăn chay.', zh: '我吃素。' },
      ],
      tips: ['béo 也可形容人「胖」', 'cay = 辣，ớt = 辣椒'],
    }],
    dialogues: [{
      id: 'd6-3b', title: '忌口',
      lines: [
        { speaker: 'A', vi: 'Món này có cay không?', zh: '这个菜辣吗？' },
        { speaker: 'B', vi: 'Hơi cay. Bạn ăn được không?', zh: '有点辣。你吃得了吗？' },
        { speaker: 'A', vi: 'Tôi ăn chay.', zh: '我吃素。' },
        { speaker: 'B', vi: 'Vậy bạn gọi món chay nhé.', zh: '那你点素的吧。' },
      ],
    }],
    exercises: [
      { id: 'e6-3-4', type: 'choice', prompt: '「吃素」是：', options: ['ăn chay', 'ăn mặn', 'ăn ngọt', 'ăn no'], answer: 0, explain: 'ăn chay = 吃素。' },
      { id: 'e6-3-5', type: 'fill', prompt: '「酸」= ___', answer: 'chua', hint: '味道词', explain: 'chua = 酸；ngọt = 甜。' },
      { id: 'e6-3-6', type: 'choice', prompt: '「我吃不了油腻的东西」怎么说？', options: ['Tôi không ăn được đồ béo.', 'Tôi không thích ăn chay.', 'Tôi ăn được đồ béo.', 'Tôi không uống đồ béo.'], answer: 0, explain: 'không + 动词 + được 表「做不了」。' },
    ],
  },

  'l7-1': {
    vocabIds: ['u7-19', 'u7-20', 'u7-21', 'u7-22', 'u7-23', 'u7-24'],
    grammar: [{
      id: 'g7-1b', title: '方位词与指路动词',
      explanation: '方位：bên trái 左边、bên phải 右边、đối diện 对面、gần đây 附近。指路：đi thẳng 直走、rẽ trái 左转、rẽ phải 右转、quay lại 掉头。问地点：… ở đâu? 或 … ở bên nào?；ngã tư 是十字路口、ngã ba 是三岔口。',
      examples: [
        { vi: 'Ngân hàng ở bên trái.', zh: '银行在左边。' },
        { vi: 'Rẽ phải ở ngã tư.', zh: '在十字路口右转。' },
      ],
      tips: ['bên nào = 哪一边', 'đi thẳng 后接 đến + 地点'],
    }],
    dialogues: [{
      id: 'd7-1b', title: '问路',
      lines: [
        { speaker: 'A', vi: 'Xin lỗi, ngân hàng ở đâu?', zh: '请问银行在哪里？' },
        { speaker: 'B', vi: 'Đi thẳng, rồi rẽ phải ở ngã tư.', zh: '直走，然后在十字路口右转。' },
        { speaker: 'A', vi: 'Có xa không?', zh: '远吗？' },
        { speaker: 'B', vi: 'Không, gần thôi.', zh: '不远，就在附近。' },
      ],
    }],
    exercises: [
      { id: 'e7-1-4', type: 'choice', prompt: '「对面」是：', options: ['bên trái', 'bên phải', 'đối diện', 'ngã tư'], answer: 2, explain: 'đối diện = 在对面。' },
      { id: 'e7-1-5', type: 'fill', prompt: '「十字路口」= ngã ___', answer: 'tư', hint: 'ngã ___', explain: 'ngã tư = 十字路口；ngã ba = 三岔口。' },
      { id: 'e7-1-6', type: 'choice', prompt: '「掉头」是：', options: ['đi thẳng', 'quay lại', 'rẽ trái', 'đi bộ'], answer: 1, explain: 'quay lại = 掉头/返回。' },
    ],
  },

  'l7-2': {
    vocabIds: ['u7-25', 'u7-26', 'u7-27', 'u7-28', 'u7-29', 'u7-30', 'u7-31', 'u7-32'],
    grammar: [{
      id: 'g7-2b', title: '交通工具与耗时问法',
      explanation: '交通工具：xe đạp 自行车、xe máy 摩托车、ô tô 汽车、xe buýt 公交、tàu hỏa 火车、máy bay 飞机、xe ôm 摩的。方式用 bằng + 交通工具；步行是 đi bộ，不加 bằng。问耗时：Mất bao lâu? 回答 mất + 时间。',
      examples: [
        { vi: 'Đi bằng tàu hỏa mất ba giờ.', zh: '坐火车要三小时。' },
        { vi: 'Tôi đi bộ đến trường.', zh: '我走路去学校。' },
      ],
      tips: ['vé 是票：vé tàu、vé máy bay', 'bến xe 是汽车站'],
    }],
    dialogues: [{
      id: 'd7-2b', title: '出行方式',
      lines: [
        { speaker: 'A', vi: 'Bạn đi Hà Nội bằng gì?', zh: '你坐什么去河内？' },
        { speaker: 'B', vi: 'Tôi đi bằng tàu hỏa.', zh: '我坐火车。' },
        { speaker: 'A', vi: 'Mất bao lâu?', zh: '要多久？' },
        { speaker: 'B', vi: 'Khoảng ba giờ.', zh: '大约三小时。' },
      ],
    }],
    exercises: [
      { id: 'e7-2-4', type: 'choice', prompt: '「自行车」是：', options: ['xe đạp', 'xe máy', 'ô tô', 'xe ôm'], answer: 0, explain: 'xe đạp = 自行车。' },
      { id: 'e7-2-5', type: 'fill', prompt: '「坐火车」= đi bằng ___', answer: 'tàu hỏa', accept: ['tàu hoả'], hint: '「火车」', explain: 'tàu hỏa = 火车。' },
      { id: 'e7-2-6', type: 'choice', prompt: '问「要多久？」怎么说？', options: ['Bao nhiêu tiền?', 'Mất bao lâu?', 'Ở đâu?', 'Bao nhiêu tuổi?'], answer: 1, explain: 'mất bao lâu = 花费多久。' },
    ],
  },

  'l7-3': {
    vocabIds: ['u7-33', 'u7-34', 'u7-35', 'u7-36', 'u7-37', 'u7-38', 'u7-39', 'u7-40'],
    grammar: [{
      id: 'g7-3b', title: '酒店流程与礼貌请求',
      explanation: '酒店流程：đặt phòng 订房 → nhận phòng 入住 → trả phòng 退房。房型：phòng đơn 单人间、phòng đôi 双人间。求助句式：Cho tôi hỏi…（请问……）、Bạn có thể giúp tôi không?（你能帮我吗？）、Làm ơn…（请……）。',
      examples: [
        { vi: 'Tôi đặt phòng đôi hai đêm.', zh: '我订双人间两晚。' },
        { vi: 'Bạn có thể giúp tôi không?', zh: '你能帮我吗？' },
      ],
      tips: ['chìa khóa = 钥匙，hộ chiếu = 护照', 'mấy giờ = 几点'],
    }],
    dialogues: [{
      id: 'd7-3b', title: '订房',
      lines: [
        { speaker: 'A', vi: 'Tôi muốn đặt phòng đôi.', zh: '我想订双人间。' },
        { speaker: 'B', vi: 'Mấy đêm ạ?', zh: '几晚？' },
        { speaker: 'A', vi: 'Hai đêm. Có phòng không?', zh: '两晚。有房吗？' },
        { speaker: 'B', vi: 'Có, đây là chìa khóa.', zh: '有，这是钥匙。' },
      ],
    }],
    exercises: [
      { id: 'e7-3-4', type: 'choice', prompt: '「退房」是：', options: ['đặt phòng', 'nhận phòng', 'trả phòng', 'phòng đơn'], answer: 2, explain: 'trả phòng = 退房；nhận phòng = 入住。' },
      { id: 'e7-3-5', type: 'fill', prompt: '「单人间」= phòng ___', answer: 'đơn', hint: 'phòng ___', explain: 'phòng đơn = 单人间；phòng đôi = 双人间。' },
      { id: 'e7-3-6', type: 'choice', prompt: '「护照」是：', options: ['chìa khóa', 'hộ chiếu', 'vé', 'bến'], answer: 1, explain: 'hộ chiếu = 护照。' },
    ],
  },

  'l8-1': {
    vocabIds: ['u8-19', 'u8-20', 'u8-21', 'u8-22', 'u8-23', 'u8-24', 'u8-25'],
    grammar: [{
      id: 'g8-1b', title: '职业与工作地点问答',
      explanation: '问职业：Bạn làm nghề gì? / Bạn làm công việc gì? 回答：Tôi là + 职业。问工作地点：Bạn làm việc ở đâu? 回答：Tôi làm việc ở + 地点（văn phòng、bệnh viện、trường học、công ty）。làm việc 比 làm 更正式。',
      examples: [
        { vi: 'Tôi là nhân viên văn phòng.', zh: '我是办公室职员。' },
        { vi: 'Tôi làm việc ở bệnh viện.', zh: '我在医院工作。' },
      ],
      tips: ['nghề nghiệp = 职业', 'làm ở đâu 问地点'],
    }],
    dialogues: [{
      id: 'd8-1b', title: '在哪里工作',
      lines: [
        { speaker: 'A', vi: 'Bạn làm việc ở đâu?', zh: '你在哪里工作？' },
        { speaker: 'B', vi: 'Tôi làm việc ở bệnh viện.', zh: '我在医院工作。' },
        { speaker: 'A', vi: 'Bạn là bác sĩ à?', zh: '你是医生吗？' },
        { speaker: 'B', vi: 'Vâng, tôi là bác sĩ.', zh: '是的，我是医生。' },
      ],
    }],
    exercises: [
      { id: 'e8-1-4', type: 'choice', prompt: '「办公室」是：', options: ['văn phòng', 'bệnh viện', 'trường học', 'công ty'], answer: 0, explain: 'văn phòng = 办公室。' },
      { id: 'e8-1-5', type: 'fill', prompt: '「工资」= ___', answer: 'lương', hint: '每月收入', explain: 'lương = 工资。' },
      { id: 'e8-1-6', type: 'choice', prompt: '「你在哪里工作？」怎么说？', options: ['Bạn làm nghề gì?', 'Bạn làm việc ở đâu?', 'Bạn sống ở đâu?', 'Bạn đi đâu?'], answer: 1, explain: 'làm việc ở đâu = 在哪里工作。' },
    ],
  },

  'l8-2': {
    vocabIds: ['u8-26', 'u8-27', 'u8-28', 'u8-29', 'u8-30', 'u8-31', 'u8-32'],
    grammar: [{
      id: 'g8-2b', title: '爱好表达与频率',
      explanation: '问爱好：Sở thích của bạn là gì? 回答：Tôi thích + 动词/名词。常见爱好：nghe nhạc、nấu ăn、chụp ảnh、đi dạo、chơi thể thao、sưu tầm、khiêu vũ。频率用 thường / hay + 动词；chơi 可与运动搭配：chơi thể thao、chơi bóng đá。',
      examples: [
        { vi: 'Tôi thích chụp ảnh.', zh: '我喜欢拍照。' },
        { vi: 'Tôi hay đi dạo cuối tuần.', zh: '我周末经常散步。' },
      ],
      tips: ['sở thích = 爱好', 'thích 后可接动词原形'],
    }],
    dialogues: [{
      id: 'd8-2b', title: '聊爱好',
      lines: [
        { speaker: 'A', vi: 'Sở thích của bạn là gì?', zh: '你的爱好是什么？' },
        { speaker: 'B', vi: 'Tôi thích chụp ảnh và đi dạo.', zh: '我喜欢拍照和散步。' },
        { speaker: 'A', vi: 'Tôi thì thích nấu ăn.', zh: '我喜欢做饭。' },
        { speaker: 'B', vi: 'Hay quá!', zh: '真好！' },
      ],
    }],
    exercises: [
      { id: 'e8-2-4', type: 'choice', prompt: '「散步」是：', options: ['đi dạo', 'chụp ảnh', 'nghe nhạc', 'nấu ăn'], answer: 0, explain: 'đi dạo = 散步。' },
      { id: 'e8-2-5', type: 'fill', prompt: '「拍照」= chụp ___', answer: 'ảnh', hint: 'chụp ___', explain: 'chụp ảnh = 拍照。' },
      { id: 'e8-2-6', type: 'choice', prompt: '「我喜欢做饭」怎么说？', options: ['Tôi thích nấu ăn.', 'Tôi thích nghe nhạc.', 'Tôi thích đi dạo.', 'Tôi thích chụp ảnh.'], answer: 0, explain: 'nấu ăn = 做饭。' },
    ],
  },

  'l8-3': {
    vocabIds: ['u8-33', 'u8-34', 'u8-35', 'u8-36', 'u8-37', 'u8-38', 'u8-39'],
    grammar: [{
      id: 'g8-3b', title: '时间标记与 vừa / sắp',
      explanation: 'đã（过去）、đang（进行）、sẽ（将来）都放动词前。vừa（刚刚）表最近过去，sắp（即将）表最近将来，常与 rồi 搭配：Tôi vừa đến rồi。相对时间：năm ngoái（去年）、năm sau（明年）、tuần trước（上周）、tuần sau（下周）。',
      examples: [
        { vi: 'Tôi vừa ăn xong.', zh: '我刚吃完。' },
        { vi: 'Tôi sắp đi Hà Nội.', zh: '我即将去河内。' },
      ],
      tips: ['xong 放动词后表完成', 'vừa 与 rồi 常同现'],
    }],
    dialogues: [{
      id: 'd8-3b', title: '下周计划',
      lines: [
        { speaker: 'A', vi: 'Tuần sau bạn làm gì?', zh: '下周你做什么？' },
        { speaker: 'B', vi: 'Tôi sẽ đi công tác.', zh: '我要出差。' },
        { speaker: 'A', vi: 'Đi đâu?', zh: '去哪里？' },
        { speaker: 'B', vi: 'Tôi đi Hà Nội ba ngày.', zh: '我去河内三天。' },
      ],
    }],
    exercises: [
      { id: 'e8-3-4', type: 'choice', prompt: '「去年」是：', options: ['năm sau', 'năm ngoái', 'tuần trước', 'tháng sau'], answer: 1, explain: 'năm ngoái = 去年；năm sau = 明年。' },
      { id: 'e8-3-5', type: 'fill', prompt: '「刚刚」= ___', answer: 'vừa', hint: '表最近过去', explain: 'vừa = 刚刚；sắp = 即将。' },
      { id: 'e8-3-6', type: 'choice', prompt: '「下周我要出差」怎么说？', options: ['Tuần sau tôi sẽ đi công tác.', 'Tuần trước tôi đã đi công tác.', 'Năm sau tôi sẽ đi công tác.', 'Hôm nay tôi đi công tác.'], answer: 0, explain: 'tuần sau = 下周；sẽ 表将来。' },
    ],
  },
};
