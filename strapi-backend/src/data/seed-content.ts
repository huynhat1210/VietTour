export const SEED_DESTINATIONS = [
  {
    name: 'Vịnh Hạ Long',
    slug: 'ha-long',
    description:
      'Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ trên vịnh biển xanh ngọc.',
    region: 'Quảng Ninh',
    featured: true,
  },
  {
    name: 'Phố cổ Hội An',
    slug: 'hoi-an',
    description:
      'Thành phố cổ lung linh đèn lồng, di sản văn hóa thế giới bên dòng sông Thu Bồn.',
    region: 'Quảng Nam',
    featured: true,
  },
  {
    name: 'Sa Pa',
    slug: 'sa-pa',
    description:
      'Ruộng bậc thang mây mù, văn hóa các dân tộc vùng cao Tây Bắc.',
    region: 'Lào Cai',
    featured: true,
  },
  {
    name: 'Đà Nẵng & Bà Nà Hills',
    slug: 'da-nang',
    description:
      'Thành phố biển năng động với cầu Rồng, Bà Nà Hills và bãi biển Mỹ Khê.',
    region: 'Đà Nẵng',
    featured: true,
  },
  {
    name: 'Phú Quốc',
    slug: 'phu-quoc',
    description:
      'Đảo ngọc với bãi biển trong xanh, san hô và resort nghỉ dưỡng cao cấp.',
    region: 'Kiên Giang',
    featured: true,
  },
  {
    name: 'Ninh Bình',
    slug: 'ninh-binh',
    description:
      'Tràng An, Tam Cốc và quần thể danh thắng được UNESCO công nhận.',
    region: 'Ninh Bình',
    featured: true,
  },
  {
    name: 'Miền Tây sông nước',
    slug: 'mien-tay',
    description:
      'Chợ nổi, vườn trái cây và văn hóa sông nước đặc sắc miền Tây Nam Bộ.',
    region: 'Cần Thơ',
    featured: false,
  },
  {
    name: 'Đà Lạt',
    slug: 'da-lat',
    description:
      'Thành phố ngàn hoa, khí hậu mát mẻ và kiến trúc Pháp cổ kính.',
    region: 'Lâm Đồng',
    featured: true,
  },
  {
    name: 'Huế',
    slug: 'hue',
    description:
      'Cố đô với Đại Nội, lăng tẩm và ẩm thực cung đình tinh tế.',
    region: 'Thừa Thiên Huế',
    featured: true,
  },
];

type Difficulty = 'Dễ' | 'Trung bình' | 'Khó';

export const SEED_TOURS: Array<{
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  maxGroupSize: number;
  difficulty: Difficulty;
  featured: boolean;
  itinerary: string;
  destinationSlug: string;
}> = [
  {
    title: 'Khám phá Hạ Long 2 ngày 1 đêm',
    slug: 'ha-long-2n1d',
    shortDescription:
      'Du thuyền sang trọng, kayak, tắm biển và thưởng thức hải sản tươi sống.',
    description:
      'Hành trình khám phá vịnh Hạ Long trên du thuyền 4 sao. Tham quan hang Sửng Sốt, chèo kayak, tắm biển Titop.',
    price: 2890000,
    duration: '2 ngày 1 đêm',
    location: 'Quảng Ninh',
    maxGroupSize: 20,
    difficulty: 'Dễ',
    featured: true,
    itinerary:
      'Ngày 1: Hà Nội - Hạ Long - Du thuyền - Hang Sửng Sốt\nNgày 2: Titop - Về Hà Nội',
    destinationSlug: 'ha-long',
  },
  {
    title: 'Hạ Long 5 sao 3 ngày 2 đêm',
    slug: 'ha-long-5sao-3n2d',
    shortDescription:
      'Du thuyền 5 sao, bữa tối BBQ trên boong, spa và sunset party.',
    description:
      'Trải nghiệm Hạ Long đẳng cấp trên du thuyền 5 sao. Suite view vịnh, ẩm thực fusion và dịch vụ butler.',
    price: 6890000,
    duration: '3 ngày 2 đêm',
    location: 'Quảng Ninh',
    maxGroupSize: 12,
    difficulty: 'Dễ',
    featured: true,
    itinerary:
      'Ngày 1: Hà Nội - Hạ Long - Check-in du thuyền\nNgày 2: Kayak - Bãi tắm - BBQ\nNgày 3: Hang động - Về',
    destinationSlug: 'ha-long',
  },
  {
    title: 'Hội An - Đà Nẵng 3 ngày 2 đêm',
    slug: 'hoi-an-da-nang-3n2d',
    shortDescription:
      'Phố cổ Hội An, Bà Nà Hills, Cầu Vàng và làng gốm Thanh Hà.',
    description:
      'Tour miền Trung kết hợp văn hóa và nghỉ dưỡng. Khám phá phố cổ Hội An về đêm, leo Bà Nà Hills.',
    price: 4590000,
    duration: '3 ngày 2 đêm',
    location: 'Quảng Nam - Đà Nẵng',
    maxGroupSize: 15,
    difficulty: 'Dễ',
    featured: true,
    itinerary:
      'Ngày 1: Đà Nẵng - Hội An\nNgày 2: Bà Nà Hills\nNgày 3: Làng gốm - Về',
    destinationSlug: 'hoi-an',
  },
  {
    title: 'Hội An nghỉ dưỡng 2 ngày 1 đêm',
    slug: 'hoi-an-2n1d',
    shortDescription:
      'Resort ven sông, đèn lồng phố cổ và lớp nấu ăn Hội An.',
    description:
      'Kỳ nghỉ ngắn tại Hội An. Dạo phố cổ về đêm, thả đèn hoa đăng và học nấu món cao lầu.',
    price: 2490000,
    duration: '2 ngày 1 đêm',
    location: 'Quảng Nam',
    maxGroupSize: 18,
    difficulty: 'Dễ',
    featured: false,
    itinerary: 'Ngày 1: Đà Nẵng - Hội An - Phố cổ\nNgày 2: Lớp nấu ăn - Về',
    destinationSlug: 'hoi-an',
  },
  {
    title: 'Trekking Sa Pa - Fansipan 3 ngày 2 đêm',
    slug: 'sa-pa-fansipan-3n2d',
    shortDescription:
      'Chinh phục nóc nhà Đông Dương, homestay bản làng và ruộng bậc thang.',
    description:
      "Hành trình trekking qua các bản làng người H'Mông, Dao đỏ. Nghỉ homestay và chinh phục Fansipan.",
    price: 3290000,
    duration: '3 ngày 2 đêm',
    location: 'Lào Cai',
    maxGroupSize: 12,
    difficulty: 'Trung bình',
    featured: true,
    itinerary:
      'Ngày 1: Hà Nội - Sa Pa - Cát Cát\nNgày 2: Lao Chải - Tả Van\nNgày 3: Fansipan - Về',
    destinationSlug: 'sa-pa',
  },
  {
    title: 'Sa Pa mây mù 2 ngày 1 đêm',
    slug: 'sa-pa-2n1d',
    shortDescription:
      'Cáp treo Fansipan, thị trấn Sa Pa và chợ phiên vùng cao.',
    description:
      'Tour Sa Pa nhẹ nhàng phù hợp mọi lứa tuổi. Ngắm ruộng bậc thang, check-in Fansipan Legend.',
    price: 2190000,
    duration: '2 ngày 1 đêm',
    location: 'Lào Cai',
    maxGroupSize: 20,
    difficulty: 'Dễ',
    featured: false,
    itinerary: 'Ngày 1: Hà Nội - Sa Pa - Fansipan\nNgày 2: Chợ phiên - Về',
    destinationSlug: 'sa-pa',
  },
  {
    title: 'Đà Nẵng - Bà Nà Hills 2 ngày 1 đêm',
    slug: 'da-nang-ba-na-2n1d',
    shortDescription:
      'Cầu Vàng, Fantasy Park và bãi biển Mỹ Khê.',
    description:
      'Trải nghiệm Bà Nà Hills cáp treo dài nhất thế giới, vui chơi Fantasy Park và thư giãn biển Mỹ Khê.',
    price: 2790000,
    duration: '2 ngày 1 đêm',
    location: 'Đà Nẵng',
    maxGroupSize: 22,
    difficulty: 'Dễ',
    featured: true,
    itinerary: 'Ngày 1: Bà Nà Hills - Cầu Vàng\nNgày 2: Biển Mỹ Khê - Về',
    destinationSlug: 'da-nang',
  },
  {
    title: 'Miền Tây sông nước 2 ngày 1 đêm',
    slug: 'mien-tay-2n1d',
    shortDescription:
      'Chợ nổi Cái Răng, vườn trái cây, đờn ca tài tử và ẩm thực miền Tây.',
    description:
      'Khám phá đời sống sông nước miền Tây Nam Bộ. Tham quan chợ nổi, thuyền len lỏi kênh rạch.',
    price: 1890000,
    duration: '2 ngày 1 đêm',
    location: 'Cần Thơ - An Giang',
    maxGroupSize: 25,
    difficulty: 'Dễ',
    featured: false,
    itinerary: 'Ngày 1: Cần Thơ - Chợ nổi\nNgày 2: Vườn trái cây - Về TP.HCM',
    destinationSlug: 'mien-tay',
  },
  {
    title: 'Miền Tây khám phá 3 ngày 2 đêm',
    slug: 'mien-tay-3n2d',
    shortDescription:
      'Châu Đốc, núi Sam, chợ nổi và homestay miệt vườn.',
    description:
      'Hành trình sâu vào miền Tây. Tham quan miệt vườn, chùa Bửu Sơn Kỳ Hương và ẩm thực địa phương.',
    price: 2690000,
    duration: '3 ngày 2 đêm',
    location: 'An Giang - Cần Thơ',
    maxGroupSize: 20,
    difficulty: 'Dễ',
    featured: false,
    itinerary:
      'Ngày 1: TP.HCM - Cần Thơ\nNgày 2: Châu Đốc - Núi Sam\nNgày 3: Chợ nổi - Về',
    destinationSlug: 'mien-tay',
  },
  {
    title: 'Phú Quốc nghỉ dưỡng 4 ngày 3 đêm',
    slug: 'phu-quoc-4n3d',
    shortDescription:
      'Bãi biển trong xanh, lặn ngắm san hô, safari và sunset tại Dinh Cậu.',
    description:
      'Kỳ nghỉ biển đảo tại Phú Quốc. Lặn ngắm san hô, Vinpearl Safari, chợ đêm Dinh Cậu.',
    price: 5990000,
    duration: '4 ngày 3 đêm',
    location: 'Kiên Giang',
    maxGroupSize: 18,
    difficulty: 'Dễ',
    featured: true,
    itinerary: 'Ngày 1-4: Khám phá Phú Quốc',
    destinationSlug: 'phu-quoc',
  },
  {
    title: 'Phú Quốc lặn biển 3 ngày 2 đêm',
    slug: 'phu-quoc-diving-3n2d',
    shortDescription:
      'Lặn ngắm san hô, câu mực đêm và tour 3 đảo.',
    description:
      'Tour biển đảo dành cho người yêu khám phá. Lặn ống thở, câu mực đêm và BBQ hải sản trên bãi.',
    price: 4290000,
    duration: '3 ngày 2 đêm',
    location: 'Kiên Giang',
    maxGroupSize: 14,
    difficulty: 'Trung bình',
    featured: false,
    itinerary:
      'Ngày 1: Bay Phú Quốc - Bãi Sao\nNgày 2: Lặn san hô - Câu mực\nNgày 3: Tour 3 đảo - Về',
    destinationSlug: 'phu-quoc',
  },
  {
    title: 'Hà Nội - Ninh Bình 2 ngày 1 đêm',
    slug: 'ninh-binh-2n1d',
    shortDescription:
      'Tràng An, Tam Cốc, chùa Bái Đính và ẩm thực Hà Nội phố cổ.',
    description:
      'Khám phá di sản Tràng An, chèo thuyền Tam Cốc, tham quan chùa Bái Đính.',
    price: 2190000,
    duration: '2 ngày 1 đêm',
    location: 'Hà Nội - Ninh Bình',
    maxGroupSize: 20,
    difficulty: 'Dễ',
    featured: false,
    itinerary: 'Ngày 1: Tràng An - Tam Cốc\nNgày 2: Bái Đính - Phố cổ',
    destinationSlug: 'ninh-binh',
  },
  {
    title: 'Ninh Bình - Pù Luông 3 ngày 2 đêm',
    slug: 'ninh-binh-pu-luong-3n2d',
    shortDescription:
      'Trekking Pù Luông, homestay Thái và cảnh quan non nước.',
    description:
      'Kết hợp Ninh Bình và Pù Luông. Trekking rừng nhiệt đới, tắm thác và nghỉ homestay bản làng.',
    price: 3590000,
    duration: '3 ngày 2 đêm',
    location: 'Ninh Bình - Thanh Hóa',
    maxGroupSize: 10,
    difficulty: 'Khó',
    featured: true,
    itinerary:
      'Ngày 1: Hà Nội - Ninh Bình\nNgày 2: Pù Luông trekking\nNgày 3: Thác - Về',
    destinationSlug: 'ninh-binh',
  },
  {
    title: 'Đà Lạt ngàn hoa 3 ngày 2 đêm',
    slug: 'da-lat-3n2d',
    shortDescription:
      'Thung lũng tình yêu, Datanla, chợ đêm và cafe view đồi.',
    description:
      'Khám phá Đà Lạt mộng mơ. Tham quan vườn hoa, đồi chè Cầu Đất và trải nghiệm cafe specialty.',
    price: 3190000,
    duration: '3 ngày 2 đêm',
    location: 'Lâm Đồng',
    maxGroupSize: 16,
    difficulty: 'Dễ',
    featured: true,
    itinerary:
      'Ngày 1: TP.HCM - Đà Lạt\nNgày 2: Thung lũng - Datanla\nNgày 3: Chợ đêm - Về',
    destinationSlug: 'da-lat',
  },
  {
    title: 'Đà Lạt dã ngoại 2 ngày 1 đêm',
    slug: 'da-lat-2n1d',
    shortDescription:
      'Camping đồi thông, săn mây và BBQ đêm.',
    description:
      'Tour Đà Lạt trải nghiệm cho giới trẻ. Camping, săn mây đỉnh đồi và tiệc BBQ ngoài trời.',
    price: 1990000,
    duration: '2 ngày 1 đêm',
    location: 'Lâm Đồng',
    maxGroupSize: 15,
    difficulty: 'Trung bình',
    featured: false,
    itinerary: 'Ngày 1: Đà Lạt - Camping\nNgày 2: Săn mây - Về',
    destinationSlug: 'da-lat',
  },
  {
    title: 'Huế - Đà Nẵng di sản 4 ngày 3 đêm',
    slug: 'hue-da-nang-4n3d',
    shortDescription:
      'Đại Nội Huế, lăng Khải Định, Hội An và Cầu Rồng.',
    description:
      'Hành trình di sản miền Trung. Khám phá cố đô Huế, ẩm thực cung đình và phố cổ Hội An.',
    price: 5490000,
    duration: '4 ngày 3 đêm',
    location: 'Huế - Đà Nẵng',
    maxGroupSize: 18,
    difficulty: 'Dễ',
    featured: true,
    itinerary:
      'Ngày 1: Huế - Đại Nội\nNgày 2: Lăng tẩm - Sông Hương\nNgày 3: Hội An\nNgày 4: Đà Nẵng - Về',
    destinationSlug: 'hue',
  },
  {
    title: 'Huế ẩm thực 2 ngày 1 đêm',
    slug: 'hue-food-2n1d',
    shortDescription:
      'Bún bò Huế, cơm hến, nem lụi và tour ẩm thực đường phố.',
    description:
      'Tour dành cho tín đồ ẩm thực. Khám phá chợ Đông Ba, học nấu món cung đình và thưởng thức đặc sản.',
    price: 1790000,
    duration: '2 ngày 1 đêm',
    location: 'Thừa Thiên Huế',
    maxGroupSize: 12,
    difficulty: 'Dễ',
    featured: false,
    itinerary: 'Ngày 1: Huế - Food tour\nNgày 2: Lớp nấu ăn - Về',
    destinationSlug: 'hue',
  },
];

export const SEED_TESTIMONIALS = [
  {
    name: 'Nguyễn Minh Anh',
    content:
      'Tour Hạ Long tuyệt vời! Hướng dẫn viên nhiệt tình, du thuyền sạch sẽ, hải sản ngon.',
    rating: 5,
    tourSlug: 'ha-long-2n1d',
  },
  {
    name: 'Trần Văn Hùng',
    content:
      'Lần đầu đến Sa Pa, cảnh đẹp ngoài sức tưởng tượng. Homestay ấm cúng, sẽ quay lại!',
    rating: 5,
    tourSlug: 'sa-pa-fansipan-3n2d',
  },
  {
    name: 'Lê Thị Mai',
    content:
      'Đặt tour online rất tiện, nhân viên tư vấn nhanh. Hội An về đêm lung linh!',
    rating: 5,
    tourSlug: 'hoi-an-da-nang-3n2d',
  },
  {
    name: 'Phạm Quốc Bảo',
    content:
      'Tour Phú Quốc 4N3Đ đáng tiền. Biển đẹp, resort sạch, lặn san hô thú vị lắm.',
    rating: 5,
    tourSlug: 'phu-quoc-4n3d',
  },
  {
    name: 'Hoàng Thị Lan',
    content:
      'Đà Lạt mộng mơ quá! Hoa đẹp, thời tiết mát, guide rất hiểu biết địa phương.',
    rating: 5,
    tourSlug: 'da-lat-3n2d',
  },
];
