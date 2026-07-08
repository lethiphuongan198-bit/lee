import { Product, Feedback, FAQItem } from "./types";

export const categories = [
  { id: "all", name: "Tất Cả" },
  { id: "lips", name: "Trang Điểm Môi" },
  { id: "skincare", name: "Dưỡng Da Mặt" },
  { id: "hair", name: "Chăm Sóc Tóc" },
  { id: "body", name: "Chăm Sóc Cơ Thể" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Son Lụa Không Chì Cỏ Mềm",
    category: "lips",
    price: 195000,
    image: "https://picsum.photos/seed/lipstick/600/500",
    shortDescription: "Son môi 100% thiên nhiên, mềm mịn như lụa, an toàn tuyệt đối cho cả mẹ bầu.",
    description: "Son Lụa Không Chì là dòng sản phẩm biểu tượng của Cỏ Mềm, chứa 100% thành phần thiên nhiên lành tính. Với chất son mịn mượt, lên màu chuẩn tự nhiên, sản phẩm giúp đôi môi căng mọng quyến rũ mà không lo thâm môi, bảo vệ sức khỏe tối đa.",
    ingredients: [
      "Dầu quả bơ (Avocado oil): Dưỡng ẩm sâu, ngừa khô ráp môi.",
      "Dầu hạnh nhân (Sweet almond oil): Chống oxy hóa, giúp môi mịn màng.",
      "Sáp ong tự nhiên: Tạo hàng rào bảo vệ và giữ độ bám màu tự nhiên.",
      "Màu khoáng tự nhiên: Đạt tiêu chuẩn FDA Hoa Kỳ cực kỳ an toàn."
    ],
    usage: "Thoa trực tiếp lên môi một lượng vừa đủ. Có thể thoa nhiều lớp để đạt độ đậm màu như ý muốn. Thích hợp sử dụng hàng ngày.",
    rating: 5,
    salesCount: 1450,
    isNew: true
  },
  {
    id: "2",
    name: "Dầu Gội Thảo Dược Tóc Mây",
    category: "hair",
    price: 325000,
    image: "https://picsum.photos/seed/shampoo/600/500",
    shortDescription: "Giảm rụng tóc, kích thích mọc tóc tự nhiên từ bồ kết, vỏ bưởi và cỏ mần trầu.",
    description: "Sự kết hợp hoàn hảo giữa phương pháp chăm sóc tóc truyền thống của phụ nữ Việt với công nghệ sản xuất hiện đại. Dầu Gội Tóc Mây giúp loại bỏ bã nhờn, làm sạch da đầu nhẹ nhàng, ngăn ngừa rụng tóc hiệu quả và nuôi dưỡng mái tóc suôn mượt, bồng bềnh như mây.",
    ingredients: [
      "Bồ kết cô đặc: Làm sạch da đầu, giữ tóc đen mượt tự nhiên.",
      "Tinh dầu bưởi: Kích thích mọc tóc, kháng khuẩn và lưu hương thơm dịu mát.",
      "Cỏ mần trầu & Hương nhu: Nuôi dưỡng chân tóc khỏe mạnh, giảm gãy rụng.",
      "Vitamin B5: Phục hồi tóc hư tổn từ sâu bên trong."
    ],
    usage: "Làm ướt tóc và da đầu. Lấy một lượng dầu gội vừa đủ (khoảng 3-5ml) thoa đều, tạo bọt nhẹ nhàng và massage da đầu trong 2-3 phút, sau đó xả sạch với nước.",
    rating: 4.9,
    salesCount: 890
  },
  {
    id: "3",
    name: "Bột Tắm Tảo Dược Sáng Da",
    category: "body",
    price: 180000,
    image: "https://picsum.photos/seed/powder/600/500",
    shortDescription: "Tẩy tế bào chết nhẹ nhàng, dưỡng da sáng mịn khỏe mạnh tự nhiên từ cà phê và tảo xoắn.",
    description: "Mang spa thiên nhiên về ngôi nhà của bạn với Bột Tắm Tảo Dược. Sản phẩm kết hợp cà phê nguyên chất giúp tẩy tế bào chết cơ thể, cùng tảo xoắn giàu dưỡng chất cải thiện tông da, mờ thâm mụn lưng, mang lại làn da mịn màng, khỏe khoắn.",
    ingredients: [
      "Bột cà phê Robusta: Tẩy sạch lớp tế bào chết sần sùi, kích thích tuần hoàn máu.",
      "Tảo xoắn Spirulina: Giàu acid amin và vitamin giúp chống oxy hóa, sáng mịn da.",
      "Bột hoa cúc La Mã: Làm dịu da, giảm kích ứng, chống viêm mụn.",
      "Đất sét Kaolin: Hút sạch bã nhờn sâu trong lỗ chân lông."
    ],
    usage: "Trộn 2-3 thìa bột tắm với nước, sữa chua hoặc sữa tươi không đường tạo hỗn hợp sệt. Làm ướt cơ thể, thoa đều hỗn hợp lên da và massage nhẹ nhàng từ 5-10 phút, đặc biệt là các vùng da thô ráp như cùi chỏ, đầu gối hoặc vùng mụn lưng. Sau đó tắm sạch lại bằng nước ấm.",
    rating: 4.8,
    salesCount: 1200,
    isNew: true
  },
  {
    id: "4",
    name: "Serum Hoàng Lan Ngừa Lão Hóa",
    category: "skincare",
    price: 260000,
    image: "https://picsum.photos/seed/serum/600/500",
    shortDescription: "Cấp ẩm chuyên sâu, giảm mờ nếp nhăn và phục hồi vẻ trẻ trung rạng rỡ đầy sức sống.",
    description: "Tinh chất ngăn ngừa lão hóa cao cấp với chiết xuất hoa Hoàng Lan nồng nàn. Serum thấm sâu nuôi dưỡng các tế bào da, tăng cường đàn hồi, cải thiện nếp nhăn nông và tạo lớp màng giữ ẩm bền bỉ cho làn da căng bóng mịn màng suốt cả ngày dài.",
    ingredients: [
      "Tinh dầu hoa Hoàng Lan (Ylang Ylang): Cân bằng bã nhờn, săn chắc da, tạo hương thơm thư giãn.",
      "Dầu Argan Organic: Giàu Vitamin E chống oxy hóa, ngăn ngừa nếp nhăn.",
      "Hyaluronic Acid (HA): Cấp nước đa tầng, giữ ẩm vượt trội.",
      "Chiết xuất trà xanh: Kháng viêm, bảo vệ da trước tác hại môi trường."
    ],
    usage: "Sử dụng sau bước làm sạch và toner. Nhỏ 2-3 giọt serum lên các điểm trên mặt, vỗ nhẹ nhàng và massage theo chiều từ dưới lên trên, từ trong ra ngoài để dưỡng chất thẩm thấu sâu.",
    rating: 4.9,
    salesCount: 650
  },
  {
    id: "5",
    name: "Kem Dưỡng Ẩm Rau Má Ngừa Mụn",
    category: "skincare",
    price: 165000,
    image: "https://picsum.photos/seed/centella/600/500",
    shortDescription: "Làm dịu nốt mụn sưng đỏ, dưỡng ẩm dịu nhẹ và phục hồi tổn thương da hoàn hảo.",
    description: "Kem dưỡng ẩm chuyên biệt dành cho da dầu mụn và nhạy cảm. Với chiết xuất rau má lành tính, sản phẩm hỗ trợ làm dịu các vùng da tổn thương do mụn, cấp nước nhẹ nhàng không gây bít tắc lỗ chân lông, giúp tái tạo hàng rào bảo vệ da khỏe mạnh.",
    ingredients: [
      "Chiết xuất rau má (Centella): Làm dịu sưng viêm, thúc đẩy lành thương tổn da.",
      "Niacinamide (Vitamin B3): Kiểm soát dầu thừa, se khít lỗ chân lông và làm mờ thâm mụn.",
      "Tinh dầu tràm trà: Kháng khuẩn tự nhiên, ngăn ngừa hình thành nhân mụn mới.",
      "Glycerin thực vật: Giữ nước tự nhiên cho da ẩm mịn mượt mà."
    ],
    usage: "Sau khi sử dụng serum, lấy một lượng kem vừa đủ (bằng hạt đậu) chấm đều lên các điểm trên mặt và thoa nhẹ nhàng cho kem thẩm thấu hết. Dùng đều đặn 2 lần sáng và tối.",
    rating: 5,
    salesCount: 950
  },
  {
    id: "6",
    name: "Bọt Rửa Mặt Tơ Tằm Dịu Nhẹ",
    category: "skincare",
    price: 150000,
    image: "https://picsum.photos/seed/foaming/600/500",
    shortDescription: "Làm sạch sâu bã nhờn mà vẫn giữ màng ẩm tự nhiên mềm mại mượt mà như tơ tằm.",
    description: "Sản phẩm sữa rửa mặt tạo bọt sẵn vô cùng tiện lợi. Lớp bọt siêu mịn dày đặc như kén tơ tằm lướt nhẹ trên da, len lỏi sâu làm sạch dầu thừa bụi bẩn mà không hề gây chà xát hay khô căng, mang lại trải nghiệm rửa mặt êm dịu, sảng khoái.",
    ingredients: [
      "Chiết xuất kén tơ tằm tự nhiên: Giàu Sericin dưỡng ẩm bảo vệ màng da mềm mại.",
      "Betaine từ củ cải đường: Làm sạch lành tính, cân bằng độ pH lý tưởng (5.5).",
      "Chiết xuất lô hội: Cấp ẩm tức thì, làm mát và làm dịu da.",
      "Tinh dầu oải hương: Tạo hương thơm thanh khiết, thư thái tinh thần."
    ],
    usage: "Làm ướt mặt. Nhấn vòi pump lấy một lượng bọt vừa đủ thoa đều lên da mặt, massage nhẹ nhàng vòng tròn trong 30-60 giây để cuốn trôi bụi bẩn. Rửa sạch lại bằng nước mát.",
    rating: 4.8,
    salesCount: 1100
  }
];

export const feedbacks: Feedback[] = [
  {
    id: "1",
    name: "Nguyễn Thùy Linh",
    avatar: "https://picsum.photos/seed/avatar1/100/100",
    role: "Sinh viên Marketing - ĐH Ngoại Thương",
    rating: 5,
    comment: "Mình cực kỳ thích dòng Son Lụa của Cỏ Mềm! Màu lên rất tự nhiên, môi không bị khô mà quan trọng nhất là son không chì, rất an toàn. Thiết kế bao bì bằng giấy kraft nhìn thân thiện và mộc mạc lắm."
  },
  {
    id: "2",
    name: "Phạm Minh Anh",
    avatar: "https://picsum.photos/seed/avatar2/100/100",
    role: "Mẹ bầu 6 tháng - Biên tập viên thời trang",
    rating: 5,
    comment: "Từ lúc mang bầu, mình đổi toàn bộ mỹ phẩm sang Cỏ Mềm. Cả bọt rửa mặt tơ tằm và kem dưỡng rau má đều rất dịu nhẹ, da nhạy cảm lúc bầu của mình hoàn toàn không bị kích ứng. Cảm ơn Cỏ Mềm vì những sản phẩm Lành và Thật!"
  },
  {
    id: "3",
    name: "Lê Hoàng Yến",
    avatar: "https://picsum.photos/seed/avatar3/100/100",
    role: "Chuyên viên trang điểm tự do",
    rating: 5,
    comment: "Dầu gội Tóc Mây thực sự cứu cánh cho mái tóc xơ rụng sau sinh của mình. Tóc tơ con mọc lên tua tủa sau 2 tháng chăm chỉ gội xả. Mùi bưởi hương nhu tự nhiên thơm dễ chịu vô cùng, cảm giác thư giãn như ở spa."
  },
  {
    id: "4",
    name: "Trần Mai Phương",
    avatar: "https://picsum.photos/seed/avatar4/100/100",
    role: "Nhân viên Văn phòng",
    rating: 5,
    comment: "Thương hiệu Việt Nam nhưng chất lượng không thua kém gì các thương hiệu organic của nước ngoài. Đóng gói rất chu đáo, hạn chế sử dụng túi nilon, bảo vệ môi trường tuyệt vời. Sẽ ủng hộ dài dài!"
  }
];

export const faqs: FAQItem[] = [
  {
    id: "faq1",
    question: "Mỹ phẩm Cỏ Mềm có phù hợp da nhạy cảm không?",
    answer: "Cỏ Mềm được nghiên cứu và sản xuất với tiêu chí 'Lành và Thật', sử dụng nguyên liệu thiên nhiên tinh khiết, loại bỏ hoàn toàn các chất kích ứng như Paraben, Silicone, Corticoid hay hương liệu nhân tạo đậm đặc. Hầu hết các sản phẩm đều cực kỳ dịu nhẹ và đã được kiểm nghiệm lâm sàng an toàn cho cả làn da nhạy cảm nhất."
  },
  {
    id: "faq2",
    question: "Có dùng được cho phụ nữ mang thai và cho con bú không?",
    answer: "Tuyệt đối an toàn! Triết lý cốt lõi của Cỏ Mềm bắt đầu từ mong muốn tạo ra những sản phẩm mỹ phẩm 'Lành' nhất cho cả gia đình, đặc biệt là phụ nữ mang thai và trẻ sơ sinh. Các dòng son lụa không chì, sữa tắm thiên nhiên, hay xà bông hữu cơ đều là sự lựa chọn tin cậy được hàng triệu mẹ bầu Việt Nam yêu thích."
  },
  {
    id: "faq3",
    question: "Cỏ Mềm có chính sách giao hàng toàn quốc không?",
    answer: "Cỏ Mềm hỗ trợ giao hàng toàn quốc nhanh chóng thông qua các đơn vị chuyển phát uy tín. Miễn phí vận chuyển cho mọi đơn hàng từ 300.000đ trở lên. Thời gian nhận hàng thông thường từ 1-3 ngày làm việc đối với khu vực nội thành Hà Nội, TP.HCM và 3-5 ngày đối với khu vực tỉnh thành khác."
  },
  {
    id: "faq4",
    question: "Chính sách đổi trả sản phẩm như thế nào?",
    answer: "Cỏ Mềm cam kết bảo vệ quyền lợi tối đa cho khách hàng: Hỗ trợ 1 đổi 1 hoặc hoàn tiền 100% trong vòng 7 ngày kể từ khi nhận sản phẩm nếu phát hiện lỗi do nhà sản xuất, bể vỡ trong quá trình vận chuyển, hoặc gây kích ứng da (chúng tôi có đội ngũ dược sĩ tư vấn hỗ trợ kiểm nghiệm lâm sàng và xử lý chu đáo)."
  }
];
