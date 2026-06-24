export const SITE_NAME = "VietTour";
export const SITE_TAGLINE = "Khám phá Việt Nam - Đặt tour dễ dàng";

export const NAV_LINKS = [
  { href: "/", key: "home", label: "Trang chủ" },
  { href: "/destinations", key: "destinations", label: "Điểm đến" },
  { href: "/tours", key: "tours", label: "Tour du lịch" },
  { href: "/about", key: "about", label: "Giới thiệu" },
  { href: "/contact", key: "contact", label: "Liên hệ" },
];

export const FEATURES = [
  {
    title: "Tour chất lượng cao",
    icon: "/map.svg",
    description:
      "Hơn 100+ tour được thiết kế bởi đội ngũ chuyên gia du lịch, đảm bảo trải nghiệm tuyệt vời tại mọi điểm đến.",
  },
  {
    title: "Đặt tour trực tuyến",
    icon: "/calendar.svg",
    description:
      "Đặt tour nhanh chóng chỉ với vài bước. Xác nhận ngay, thanh toán linh hoạt và nhận voucher điện tử.",
  },
  {
    title: "Hướng dẫn viên chuyên nghiệp",
    icon: "/tech.svg",
    description:
      "Đội ngũ HDV giàu kinh nghiệm, am hiểu văn hóa địa phương, hỗ trợ tiếng Việt và tiếng Anh.",
  },
  {
    title: "Điểm đến mới mỗi tháng",
    icon: "/location.svg",
    description:
      "Liên tục cập nhật tour mới khắp 63 tỉnh thành — từ miền núi Tây Bắc đến đảo Phú Quốc.",
  },
];

export const FOOTER_LINKS = [
  {
    title: "Khám phá",
    links: [
      { label: "Tour du lịch", href: "/tours" },
      { label: "Giới thiệu", href: "/about" },
      { label: "Liên hệ", href: "/contact" },
    ],
  },
  {
    title: "Điểm đến hot",
    links: [
      { label: "Hạ Long", href: "/tours?destination=ha-long" },
      { label: "Hội An", href: "/tours?destination=hoi-an" },
      { label: "Sa Pa", href: "/tours?destination=sa-pa" },
      { label: "Phú Quốc", href: "/tours?destination=phu-quoc" },
    ],
  },
];

export const FOOTER_CONTACT_INFO = {
  title: "Liên hệ",
  links: [
    { label: "Hotline", value: "1900 1234" },
    { label: "Email", value: "info@viettour.vn" },
    { label: "Địa chỉ", value: "123 Nguyễn Huệ, Q.1, TP.HCM" },
  ],
};

export const SOCIALS = {
  title: "Mạng xã hội",
  links: [
    { icon: "/facebook.svg", href: "https://facebook.com", label: "Facebook" },
    { icon: "/instagram.svg", href: "https://instagram.com", label: "Instagram" },
    { icon: "/youtube.svg", href: "https://youtube.com", label: "YouTube" },
  ],
};

export const STATS = [
  { value: "10K+", label: "Khách hàng" },
  { value: "100+", label: "Tour du lịch" },
  { value: "63", label: "Tỉnh thành" },
  { value: "4.9★", label: "Đánh giá" },
];
