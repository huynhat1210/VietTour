import type { Destination, Testimonial, Tour } from "@/types";

export const FALLBACK_DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: "Vịnh Hạ Long",
    slug: "ha-long",
    description:
      "Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ trên vịnh biển xanh ngọc.",
    region: "Quảng Ninh",
    featured: true,
    image: {
      url: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
      alternativeText: "Vịnh Hạ Long",
    },
    intro: "Vịnh Hạ Long được UNESCO công nhận là Di sản Thiên nhiên Thế giới với hàng ngàn hòn đảo đá vôi nhô lên từ làn nước xanh ngọc bích kỳ ảo. Đây là điểm đến không thể bỏ qua của du khách trong và ngoài nước khi ghé thăm miền Bắc Việt Nam.",
    spots: [
      {
        name: "Hang Sửng Sốt",
        description: "Hang động rộng lớn và đẹp bậc nhất vịnh Hạ Long, nằm ở khu vực trung tâm của Di sản Thế giới với hệ thống thạch nhũ lung linh kỳ vĩ.",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80"
      },
      {
        name: "Đảo Titop",
        description: "Nổi tiếng với bãi tắm hình vầng trăng khuyết và đỉnh núi cao lý tưởng để ngắm nhìn toàn cảnh Vịnh Hạ Long từ trên cao.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
      },
      {
        name: "Hang Luồn",
        description: "Địa điểm chèo thuyền Kayak hoặc đi đò nan lý tưởng đi qua cổng đá hình vòng cung để vào một hồ nước phẳng lặng bao quanh bởi vách đá dựng đứng.",
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80"
      }
    ],
    tips: [
      "Nên mang theo kính râm, kem chống nắng và mũ rộng vành khi tham gia hoạt động ngoài trời.",
      "Thời điểm đẹp nhất để đi du lịch vịnh Hạ Long là từ tháng 10 đến tháng 4 năm sau.",
      "Đừng quên trải nghiệm ngủ đêm trên du thuyền để đón bình minh và hoàng hôn tuyệt đẹp trên biển."
    ]
  },
  {
    id: 2,
    name: "Phố cổ Hội An",
    slug: "hoi-an",
    description:
      "Thành phố cổ lung linh đèn lồng, di sản văn hóa thế giới bên dòng sông Thu Bồn.",
    region: "Quảng Nam",
    featured: true,
    image: {
      url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80",
      alternativeText: "Phố cổ Hội An",
    },
    intro: "Phố cổ Hội An là một đô thị cổ nằm ở hạ lưu sông Thu Bồn, thuộc đồng bằng ven biển tỉnh Quảng Nam. Nhờ những chính sách bảo tồn tốt, Hội An hầu như vẫn giữ được nguyên vẹn quần thể kiến trúc cổ kính độc đáo.",
    spots: [
      {
        name: "Chùa Cầu (Cầu Nhật Bản)",
        description: "Biểu tượng lịch sử của Hội An, được các thương nhân Nhật Bản xây dựng vào khoảng thế kỷ 17 với kiến trúc mái vòm độc đáo.",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80"
      },
      {
        name: "Hội quán Phúc Kiến",
        description: "Công trình kiến trúc Trung Hoa tiêu biểu với không gian uy nghiêm, chạm khắc tinh xảo và là nơi thờ Thiên Hậu Thánh Mẫu.",
        image: "https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=800&q=80"
      },
      {
        name: "Sông Thu Bồn",
        description: "Nơi diễn ra hoạt động thả đèn hoa đăng lung linh lãng mạn vào mỗi tối rằm, mang đậm bản sắc văn hóa phố Hội.",
        image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800&q=80"
      }
    ],
    tips: [
      "Đi dạo phố cổ vào chiều tối để ngắm đèn lồng lung linh sắc màu.",
      "Thưởng thức các món đặc sản như Cao Lầu, Mì Quảng, bánh mì Phượng.",
      "Có thể thuê xe đạp để dạo quanh khu vực phố cổ và các làng nghề lân cận."
    ]
  },
  {
    id: 3,
    name: "Sa Pa",
    slug: "sa-pa",
    description:
      "Ruộng bậc thang mây mù, văn hóa các dân tộc vùng cao Tây Bắc.",
    region: "Lào Cai",
    featured: true,
    image: {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      alternativeText: "Sa Pa",
    },
    intro: "Sa Pa là thị xã vùng cao thuộc tỉnh Lào Cai, nổi tiếng với những thửa ruộng bậc thang kỳ vĩ uốn lượn quanh sườn núi, những đỉnh núi mây mù bao phủ quanh năm và bản sắc văn hóa phong phú của đồng bào các dân tộc thiểu số.",
    spots: [
      {
        name: "Đỉnh Fansipan",
        description: "Được mệnh danh là 'Nóc nhà Đông Dương' với độ cao 3.143m, nay đã có cáp treo hiện đại giúp du khách dễ dàng chinh phục.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
      },
      {
        name: "Bản Cát Cát",
        description: "Bản làng lâu đời của người Mông đen, lưu giữ nhiều nghề thủ công truyền thống và phong cảnh thác nước tuyệt đẹp.",
        image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80"
      },
      {
        name: "Thung lũng Mường Hoa",
        description: "Nơi có những thửa ruộng bậc thang đẹp nhất Sa Pa cùng bãi đá cổ với nhiều ký tự kỳ lạ chưa được giải mã.",
        image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=800&q=80"
      }
    ],
    tips: [
      "Mang theo trang phục ấm áp vì thời tiết Sa Pa có thể thay đổi nhanh chóng và rất lạnh về đêm.",
      "Thời điểm lúa chín vàng óng ả tuyệt nhất là từ cuối tháng 8 đến giữa tháng 9.",
      "Trải nghiệm tắm lá thuốc của người Dao đỏ để hồi phục thể lực sau những cung đường trekking."
    ]
  },
  {
    id: 4,
    name: "Đà Nẵng & Bà Nà Hills",
    slug: "da-nang",
    description:
      "Thành phố biển năng động với cầu Rồng, Bà Nà Hills và bãi biển Mỹ Khê.",
    region: "Đà Nẵng",
    featured: true,
    image: {
      url: "https://images.unsplash.com/photo-1583417319070-4a6bedd02e64?w=1200&q=80",
      alternativeText: "Đà Nẵng",
    },
    intro: "Đà Nẵng được mệnh danh là 'Thành phố đáng sống nhất Việt Nam' sở hữu cả núi, sông và những bãi biển cát trắng mịn trải dài tuyệt đẹp. Điểm đến năng động này thu hút đông đảo du khách nhờ cơ sở hạ tầng hiện đại cùng nhiều kỳ quan nhân tạo ấn tượng.",
    spots: [
      {
        name: "Cầu Vàng (Bà Nà Hills)",
        description: "Tác phẩm kiến trúc gây bão truyền thông quốc tế với hai bàn tay đá khổng lồ rêu phong nâng đỡ dải lụa vàng lơ lửng giữa mây ngàn.",
        image: "https://images.unsplash.com/photo-1583417319070-4a6bedd02e64?w=800&q=80"
      },
      {
        name: "Bãi biển Mỹ Khê",
        description: "Được tạp chí Forbes bình chọn là một trong sáu bãi biển quyến rũ nhất hành tinh với nước biển ấm và sóng êm đềm.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
      },
      {
        name: "Bán đảo Sơn Trà",
        description: "Lá phổi xanh của thành phố, nơi có chùa Linh Ứng với tượng Phật Quan Âm cao 67m hướng ra biển lớn và là mái nhà của loài Voọc chà vá chân nâu quý hiếm.",
        image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80"
      }
    ],
    tips: [
      "Nên đi cáp treo Bà Nà Hills vào sáng sớm để tránh đông đúc và tận hưởng không khí trong lành.",
      "Check-in Cầu Rồng phun lửa và nước vào tối thứ 7 và Chủ Nhật hàng tuần lúc 21:00.",
      "Thưởng thức hải sản tươi ngon dọc đường Võ Nguyên Giáp."
    ]
  },
  {
    id: 5,
    name: "Phú Quốc",
    slug: "phu-quoc",
    description: "Đảo ngọc với bãi biển trong xanh, san hô và resort nghỉ dưỡng cao cấp.",
    region: "Kiên Giang",
    featured: true,
    image: {
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&q=80",
      alternativeText: "Phú Quốc",
    },
    intro: "Đảo ngọc Phú Quốc là đảo lớn nhất Việt Nam nằm trong vịnh Thái Lan. Nơi đây nổi tiếng với những bãi biển hoang sơ cát trắng, nước biển xanh trong vắt cùng hệ sinh thái biển vô cùng phong phú.",
    spots: [
      {
        name: "Bãi Sao",
        description: "Bãi biển đẹp nhất Phú Quốc với bãi cát trắng mịn như kem và hàng dừa nghiêng bóng soi bóng xuống làn nước ngọc bích.",
        image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80"
      },
      {
        name: "VinWonders & Safari Phú Quốc",
        description: "Tổ hợp công viên chủ đề và công viên chăm sóc bảo tồn động vật bán hoang dã lớn hàng đầu Đông Nam Á.",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80"
      },
      {
        name: "Hòn Thơm",
        description: "Trải nghiệm cáp treo vượt biển 3 dây dài nhất thế giới để đến với thiên đường vui chơi giải trí trên biển đầy sôi động.",
        image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80"
      }
    ],
    tips: [
      "Mùa khô từ tháng 11 đến tháng 4 năm sau là thời điểm lý tưởng nhất để tham quan Phú Quốc.",
      "Thử trải nghiệm lặn ngắm san hô tại Nam Đảo hoặc Bắc Đảo.",
      "Ghé thăm chợ đêm Phú Quốc để mua quà lưu niệm và thưởng thức các món ăn vặt miền biển."
    ]
  },
  {
    id: 6,
    name: "Ninh Bình",
    slug: "ninh-binh",
    description: "Tràng An, Tam Cốc và quần thể danh thắng được UNESCO công nhận.",
    region: "Ninh Bình",
    featured: true,
    image: {
      url: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1200&q=80",
      alternativeText: "Ninh Bình",
    },
    intro: "Ninh Bình là vùng đất cố đô cổ kính sở hữu quần thể danh thắng Tràng An - di sản hỗn hợp thế giới đầu tiên tại Việt Nam được UNESCO công nhận. Nơi đây làm say lòng du khách bằng vẻ đẹp sơn thủy hữu tình tráng lệ.",
    spots: [
      {
        name: "Quần thể danh thắng Tràng An",
        description: "Hành trình đi thuyền qua các thung lũng nước ngập trong vắt xen kẽ giữa các dãy núi đá vôi kỳ vĩ và hệ thống hang động xuyên thủy kỳ ảo.",
        image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80"
      },
      {
        name: "Chùa Bái Đính",
        description: "Quần thể chùa lớn nhất Việt Nam sở hữu nhiều kỷ lục như hành lang La Hán dài nhất, tượng Phật bằng đồng dát vàng lớn nhất.",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800&q=80"
      },
      {
        name: "Hang Múa",
        description: "Thử thách leo 486 bậc đá lên đỉnh núi Múa để ngắm nhìn toàn cảnh cánh đồng lúa chín vàng Tam Cốc bên dòng sông Ngô Đồng thơ mộng.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
      }
    ],
    tips: [
      "Nên mang theo giày thể thao êm chân vì bạn sẽ cần đi bộ và leo bậc thang khá nhiều.",
      "Tháng 5 - tháng 6 là mùa lúa chín vàng ở Tam Cốc tuyệt đẹp để check-in.",
      "Thử đặc sản cơm cháy siêu giòn và thịt dê núi Ninh Bình nổi tiếng."
    ]
  },
  {
    id: 7,
    name: "Miền Tây sông nước",
    slug: "mien-tay",
    description: "Chợ nổi, vườn trái cây và văn hóa sông nước đặc sắc miền Tây Nam Bộ.",
    region: "Cần Thơ",
    featured: false,
    image: {
      url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80",
      alternativeText: "Miền Tây",
    },
    intro: "Khám phá miền Tây sông nước đầy hứa hẹn với cảnh sắc thiên nhiên tuyệt đẹp, ẩm thực địa phương phong phú và những nét văn hóa đặc sắc đang chờ đón bạn trải nghiệm.",
    spots: [
      {
        name: "Chợ nổi Cái Răng",
        description: "Chợ nổi bán sỉ lớn nhất vùng Đồng bằng sông Cửu Long, nét văn hóa giao thương độc đáo trên sông nước.",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80"
      },
      {
        name: "Vườn trái cây trĩu quả",
        description: "Thưởng thức các loại trái cây nhiệt đới tươi ngon vừa hái ngay tại vườn nhà của người dân miền Tây.",
        image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800&q=80"
      }
    ],
    tips: [
      "Tìm hiểu trước thời tiết mùa nước nổi hoặc mùa trái cây chín rộ.",
      "Chuẩn bị dép đi mưa hoặc giày dễ lau chùi để thuận tiện di chuyển lên xuống đò nan.",
      "Mua các đặc sản như kẹo dừa, bánh pía, trái cây sấy về làm quà."
    ]
  },
  {
    id: 8,
    name: "Đà Lạt",
    slug: "da-lat",
    description: "Thành phố ngàn hoa, khí hậu mát mẻ và kiến trúc Pháp cổ kính.",
    region: "Lâm Đồng",
    featured: true,
    image: {
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
      alternativeText: "Đà Lạt",
    },
    intro: "Đà Lạt nằm trên cao nguyên Lâm Viên thuộc tỉnh Lâm Đồng, là thành phố nghỉ dưỡng nổi tiếng với khí hậu quanh năm mát mẻ ôn hòa, ngàn hoa khoe sắc rực rỡ và những rừng thông xanh rì bao bọc.",
    spots: [
      {
        name: "Hồ Xuân Hương",
        description: "Trái tim của thành phố Đà Lạt, hồ nước nhân tạo thơ mộng với những hàng thông chạy dọc ven bờ xanh mát.",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
      },
      {
        name: "Thung lũng Tình yêu",
        description: "Điểm hẹn lãng mạn bậc nhất phố núi với thắng cảnh hồ Đa Thiện trong xanh và các lối đi rực rỡ sắc hoa.",
        image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80"
      },
      {
        name: "Thác Datanla",
        description: "Địa điểm lý tưởng cho các hoạt động mạo hiểm ngoài trời như đi xe trượt, leo thác đu dây vượt dòng nước mát lạnh.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80"
      }
    ],
    tips: [
      "Chuẩn bị áo ấm nhẹ hoặc khăn choàng vì nhiệt độ giảm nhanh về chiều tối.",
      "Trải nghiệm dạo chợ đêm và thưởng thức ly sữa đậu nành nóng hổi cùng bánh tráng nướng.",
      "Ghé thăm các quán cà phê ngắm đồi thông thơ mộng lúc hoàng hôn."
    ]
  },
  {
    id: 9,
    name: "Huế",
    slug: "hue",
    description: "Cố đô với Đại Nội, lăng tẩm và ẩm thực cung đình tinh tế.",
    region: "Thừa Thiên Huế",
    featured: true,
    image: {
      url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80",
      alternativeText: "Huế",
    },
    intro: "Huế là cố đô của Việt Nam dưới triều đại nhà Nguyễn (1802 - 1945), nơi còn lưu giữ di sản văn hóa vật thể và phi vật thể vô cùng đồ sộ. Thành phố bên dòng sông Hương thơ mộng luôn mang nét trầm mặc cổ kính đặc biệt.",
    spots: [
      {
        name: "Đại Nội Huế (Hoàng Thành)",
        description: "Khu di tích lịch sử cung điện nguy nga tráng lệ bậc nhất triều Nguyễn, biểu tượng cốt lõi của di sản cố đô.",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80"
      },
      {
        name: "Lăng Khải Định",
        description: "Công trình lăng tẩm kết hợp hài hòa và tinh xảo giữa kiến trúc cổ điển phương Đông và phương Tây hiện đại.",
        image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=80"
      },
      {
        name: "Chùa Thiên Mụ",
        description: "Ngôi chùa cổ kính nằm trên đồi Hà Khê tả ngạn sông Hương, nổi tiếng với tháp Phước Duyên 7 tầng sừng sững.",
        image: "https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=800&q=80"
      }
    ],
    tips: [
      "Nên thuê xích lô hoặc xe máy để di chuyển thong dung tham quan các lăng tẩm.",
      "Đi nghe ca Huế trên thuyền rồng trên sông Hương vào buổi tối để thưởng thức nét nghệ thuật đặc sắc.",
      "Thưởng thức bún bò Huế chính gốc cùng các loại bánh cung đình thơm ngon."
    ]
  },
];

export const FALLBACK_TOURS: Tour[] = [
  {
    id: 1,
    title: "Khám phá Hạ Long 2 ngày 1 đêm",
    slug: "ha-long-2n1d",
    shortDescription:
      "Du thuyền sang trọng, kayak, tắm biển và thưởng thức hải sản tươi sống.",
    description:
      "Hành trình khám phá vịnh Hạ Long trên du thuyền 4 sao. Bạn sẽ tham quan hang Sửng Sốt, chèo kayak qua hang Luồn, tắm biển tại đảo Titop và thưởng thức bữa tối hải sản trên boong tàu.",
    price: 2890000,
    duration: "2 ngày 1 đêm",
    location: "Quảng Ninh",
    maxGroupSize: 20,
    difficulty: "Dễ",
    featured: true,
    itinerary:
      "Ngày 1: Hà Nội - Hạ Long - Du thuyền - Hang Sửng Sốt - Kayak\nNgày 2: Titop - Trả phòng - Về Hà Nội",
    image: {
      url: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
      alternativeText: "Tour Hạ Long",
    },
    destination: FALLBACK_DESTINATIONS[0],
  },
  {
    id: 2,
    title: "Hội An - Đà Nẵng 3 ngày 2 đêm",
    slug: "hoi-an-da-nang-3n2d",
    shortDescription:
      "Phố cổ Hội An, Bà Nà Hills, Cầu Vàng và làng gốm Thanh Hà.",
    description:
      "Tour miền Trung kết hợp văn hóa và nghỉ dưỡng. Khám phá phố cổ Hội An về đêm, leo Bà Nà Hills, check-in Cầu Vàng và trải nghiệm làng nghề truyền thống.",
    price: 4590000,
    duration: "3 ngày 2 đêm",
    location: "Quảng Nam - Đà Nẵng",
    maxGroupSize: 15,
    difficulty: "Dễ",
    featured: true,
    itinerary:
      "Ngày 1: Đà Nẵng - Hội An - Phố cổ về đêm\nNgày 2: Bà Nà Hills - Cầu Vàng\nNgày 3: Làng gốm - Về Đà Nẵng",
    image: {
      url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
      alternativeText: "Tour Hội An Đà Nẵng",
    },
    destination: FALLBACK_DESTINATIONS[1],
  },
  {
    id: 3,
    title: "Trekking Sa Pa - Fansipan 3 ngày 2 đêm",
    slug: "sa-pa-fansipan-3n2d",
    shortDescription:
      "Chinh phục nóc nhà Đông Dương, homestay bản làng và ruộng bậc thang.",
    description:
      "Hành trình trekking qua các bản làng người H'Mông, Dao đỏ. Nghỉ homestay, ngắm hoàng hôn trên ruộng bậc thang và chinh phục đỉnh Fansipan bằng cáp treo.",
    price: 3290000,
    duration: "3 ngày 2 đêm",
    location: "Lào Cai",
    maxGroupSize: 12,
    difficulty: "Trung bình",
    featured: true,
    itinerary:
      "Ngày 1: Hà Nội - Sa Pa - Trek bản Cát Cát\nNgày 2: Trek Lao Chải - Tả Van - Homestay\nNgày 3: Fansipan - Về Hà Nội",
    image: {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      alternativeText: "Tour Sa Pa",
    },
    destination: FALLBACK_DESTINATIONS[2],
  },
  {
    id: 4,
    title: "Miền Tây sông nước 2 ngày 1 đêm",
    slug: "mien-tay-2n1d",
    shortDescription:
      "Chợ nổi Cái Răng, vườn trái cây, đờn ca tài tử và ẩm thực miền Tây.",
    description:
      "Khám phá đời sống sông nước miền Tây Nam Bộ. Tham quan chợ nổi sáng sớm, thuyền len lỏi kênh rạch, thưởng thức trái cây vườn nhà và nghe đờn ca tài tử.",
    price: 1890000,
    duration: "2 ngày 1 đêm",
    location: "Cần Thơ - An Giang",
    maxGroupSize: 25,
    difficulty: "Dễ",
    featured: false,
    itinerary:
      "Ngày 1: TP.HCM - Cần Thơ - Chợ nổi - Vườn trái cây\nNgày 2: Chùa Bửu Sơn Kỳ Hương - Về TP.HCM",
    image: {
      url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
      alternativeText: "Tour miền Tây",
    },
    destination: FALLBACK_DESTINATIONS[6],
  },
  {
    id: 5,
    title: "Phú Quốc nghỉ dưỡng 4 ngày 3 đêm",
    slug: "phu-quoc-4n3d",
    shortDescription:
      "Bãi biển trong xanh, lặn ngắm san hô, safari và sunset tại Dinh Cậu.",
    description:
      "Kỳ nghỉ biển đảo tại Phú Quốc. Lặn ngắm san hô, câu cá, tham quan Vinpearl Safari, chợ đêm Dinh Cậu và thưởng thức nước mắm Phú Quốc.",
    price: 5990000,
    duration: "4 ngày 3 đêm",
    location: "Kiên Giang",
    maxGroupSize: 18,
    difficulty: "Dễ",
    featured: true,
    itinerary:
      "Ngày 1: Bay Phú Quốc - Bãi Sao\nNgày 2: Lặn ngắm san hô - Câu cá\nNgày 3: Vinpearl Safari - Chợ đêm\nNgày 4: Mua sắm - Bay về",
    image: {
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
      alternativeText: "Tour Phú Quốc",
    },
    destination: FALLBACK_DESTINATIONS[4],
  },
  {
    id: 6,
    title: "Hà Nội - Ninh Bình 2 ngày 1 đêm",
    slug: "ninh-binh-2n1d",
    shortDescription:
      "Tràng An, Tam Cốc, chùa Bái Đính và ẩm thực Hà Nội phố cổ.",
    description:
      "Khám phá di sản thiên nhiên Tràng An, chèo thuyền Tam Cốc ngắm ruộng lúa, tham quan chùa Bái Đính và dạo phố cổ Hà Nội.",
    price: 2190000,
    duration: "2 ngày 1 đêm",
    location: "Hà Nội - Ninh Bình",
    maxGroupSize: 20,
    difficulty: "Dễ",
    featured: false,
    itinerary:
      "Ngày 1: Hà Nội - Ninh Bình - Tràng An - Tam Cốc\nNgày 2: Chùa Bái Đính - Phố cổ Hà Nội",
    image: {
      url: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80",
      alternativeText: "Tour Ninh Bình",
    },
    destination: FALLBACK_DESTINATIONS[5],
  },
  {
    id: 7,
    title: "Hạ Long 5 sao 3 ngày 2 đêm",
    slug: "ha-long-5sao-3n2d",
    shortDescription: "Du thuyền 5 sao, bữa tối BBQ trên boong, spa và sunset party.",
    description: "Trải nghiệm Hạ Long đẳng cấp trên du thuyền 5 sao.",
    price: 6890000,
    duration: "3 ngày 2 đêm",
    location: "Quảng Ninh",
    maxGroupSize: 12,
    difficulty: "Dễ",
    featured: true,
    itinerary: "Ngày 1-3: Hạ Long 5 sao",
    image: { url: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80", alternativeText: "Hạ Long 5 sao" },
    destination: FALLBACK_DESTINATIONS[0],
  },
  {
    id: 8,
    title: "Đà Nẵng - Bà Nà Hills 2 ngày 1 đêm",
    slug: "da-nang-ba-na-2n1d",
    shortDescription: "Cầu Vàng, Fantasy Park và bãi biển Mỹ Khê.",
    description: "Trải nghiệm Bà Nà Hills và biển Mỹ Khê.",
    price: 2790000,
    duration: "2 ngày 1 đêm",
    location: "Đà Nẵng",
    maxGroupSize: 22,
    difficulty: "Dễ",
    featured: true,
    itinerary: "Ngày 1-2: Bà Nà - Biển",
    image: { url: "https://images.unsplash.com/photo-1583417319070-4a6bedd02e64?w=800&q=80", alternativeText: "Bà Nà Hills" },
    destination: FALLBACK_DESTINATIONS[3],
  },
  {
    id: 9,
    title: "Đà Lạt ngàn hoa 3 ngày 2 đêm",
    slug: "da-lat-3n2d",
    shortDescription: "Thung lũng tình yêu, Datanla, chợ đêm và cafe view đồi.",
    description: "Khám phá Đà Lạt mộng mơ với vườn hoa và đồi chè.",
    price: 3190000,
    duration: "3 ngày 2 đêm",
    location: "Lâm Đồng",
    maxGroupSize: 16,
    difficulty: "Dễ",
    featured: true,
    itinerary: "Ngày 1-3: Đà Lạt",
    image: { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", alternativeText: "Đà Lạt" },
    destination: FALLBACK_DESTINATIONS[7],
  },
  {
    id: 10,
    title: "Huế - Đà Nẵng di sản 4 ngày 3 đêm",
    slug: "hue-da-nang-4n3d",
    shortDescription: "Đại Nội Huế, lăng Khải Định, Hội An và Cầu Rồng.",
    description: "Hành trình di sản miền Trung qua Huế, Hội An và Đà Nẵng.",
    price: 5490000,
    duration: "4 ngày 3 đêm",
    location: "Huế - Đà Nẵng",
    maxGroupSize: 18,
    difficulty: "Dễ",
    featured: true,
    itinerary: "Ngày 1-4: Di sản miền Trung",
    image: { url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80", alternativeText: "Huế Đà Nẵng" },
    destination: FALLBACK_DESTINATIONS[8],
  },
  {
    id: 11,
    title: "Ninh Bình - Pù Luông 3 ngày 2 đêm",
    slug: "ninh-binh-pu-luong-3n2d",
    shortDescription: "Trekking Pù Luông, homestay Thái và cảnh quan non nước.",
    description: "Kết hợp Ninh Bình và Pù Luông cho người yêu trekking.",
    price: 3590000,
    duration: "3 ngày 2 đêm",
    location: "Ninh Bình - Thanh Hóa",
    maxGroupSize: 10,
    difficulty: "Khó",
    featured: true,
    itinerary: "Ngày 1-3: Trekking Pù Luông",
    image: { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", alternativeText: "Pù Luông" },
    destination: FALLBACK_DESTINATIONS[5],
  },
];

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Nguyễn Minh Anh",
    content:
      "Tour Hạ Long tuyệt vời! Hướng dẫn viên nhiệt tình, du thuyền sạch sẽ, hải sản ngon. Gia đình mình rất hài lòng.",
    rating: 5,
    tour: "Khám phá Hạ Long 2 ngày 1 đêm",
  },
  {
    id: 2,
    name: "Trần Văn Hùng",
    content:
      "Lần đầu đến Sa Pa, cảnh đẹp ngoài sức tưởng tượng. Homestay ấm cúng, trekking vừa sức. Sẽ quay lại!",
    rating: 5,
    tour: "Trekking Sa Pa - Fansipan",
  },
  {
    id: 3,
    name: "Lê Thị Mai",
    content:
      "Đặt tour online rất tiện, nhân viên tư vấn nhanh. Hội An về đêm thật lung linh, recommend cho mọi người.",
    rating: 5,
    tour: "Hội An - Đà Nẵng 3 ngày 2 đêm",
  },
];
