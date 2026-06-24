import { promises as fs } from "fs";
import path from "path";

export interface PointHistoryItem {
  date: string;
  action: string;
  change: string;
  current: number;
}

export interface LoyaltyRecord {
  points: number;
  tier: "Đồng" | "Bạc" | "Vàng" | "Kim Cương";
  redeemedCoupons: {
    code: string;
    type: "VT50K" | "VT200K" | "VT400K";
    amount: number;
    redeemedAt: string;
    used: boolean;
  }[];
  history: PointHistoryItem[];
}

const FILE_PATH = path.join(process.cwd(), "data", "loyalty.json");

// Helper to calculate tier based on points
function calculateTier(points: number): "Đồng" | "Bạc" | "Vàng" | "Kim Cương" {
  if (points >= 5000) return "Kim Cương";
  if (points >= 2000) return "Vàng";
  if (points >= 500) return "Bạc";
  return "Đồng";
}

// Read the database
export async function readLoyaltyDb(): Promise<Record<string, LoyaltyRecord>> {
  try {
    const content = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

// Write to the database
export async function writeLoyaltyDb(data: Record<string, LoyaltyRecord>): Promise<void> {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Get record for a single user
export async function getLoyaltyRecord(email: string): Promise<LoyaltyRecord> {
  const db = await readLoyaltyDb();
  const lowerEmail = email.toLowerCase();
  
  if (!db[lowerEmail]) {
    return {
      points: 0,
      tier: "Đồng",
      redeemedCoupons: [],
      history: [],
    };
  }
  
  // Make sure the structure is complete
  const record = db[lowerEmail];
  if (!record.redeemedCoupons) record.redeemedCoupons = [];
  if (!record.history) record.history = [];
  record.tier = calculateTier(record.points);
  
  return record;
}

// Add loyalty points to a user based on spent amount
export async function addLoyaltyPoints(
  email: string,
  spentAmount: number,
  bookingId: string | number
): Promise<LoyaltyRecord> {
  const db = await readLoyaltyDb();
  const lowerEmail = email.toLowerCase();
  
  // Earn 1 point per 10,000 VND spent
  const earnedPoints = Math.floor(spentAmount / 10000);
  if (earnedPoints <= 0) {
    return getLoyaltyRecord(email);
  }

  if (!db[lowerEmail]) {
    db[lowerEmail] = {
      points: 0,
      tier: "Đồng",
      redeemedCoupons: [],
      history: [],
    };
  }

  const record = db[lowerEmail];
  record.points += earnedPoints;
  record.tier = calculateTier(record.points);
  
  if (!record.history) record.history = [];
  record.history.unshift({
    date: new Date().toISOString(),
    action: `Tích điểm thanh toán đơn hàng #${bookingId}`,
    change: `+${earnedPoints} xu`,
    current: record.points,
  });

  await writeLoyaltyDb(db);
  return record;
}

// Redeem points for a voucher
export async function redeemLoyaltyPoints(
  email: string,
  voucherType: "VT50K" | "VT200K" | "VT400K"
): Promise<{ success: boolean; message: string; couponCode?: string; record?: LoyaltyRecord }> {
  const db = await readLoyaltyDb();
  const lowerEmail = email.toLowerCase();
  
  if (!db[lowerEmail]) {
    return { success: false, message: "Tài khoản chưa có thông tin tích lũy" };
  }

  const record = db[lowerEmail];
  
  const voucherCosts = {
    VT50K: { cost: 100, val: 50000 },
    VT200K: { cost: 300, val: 200000 },
    VT400K: { cost: 500, val: 400000 },
  };

  const { cost, val } = voucherCosts[voucherType];
  
  if (record.points < cost) {
    return { success: false, message: `Bạn không đủ điểm tích lũy. Cần thêm ${cost - record.points} xu.` };
  }

  // Deduct points
  record.points -= cost;
  record.tier = calculateTier(record.points);
  
  // Generate code: e.g., VT50K-XY7A9K
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const couponCode = `${voucherType}-${rand}`;

  if (!record.redeemedCoupons) record.redeemedCoupons = [];
  record.redeemedCoupons.unshift({
    code: couponCode,
    type: voucherType,
    amount: val,
    redeemedAt: new Date().toISOString(),
    used: false,
  });

  if (!record.history) record.history = [];
  record.history.unshift({
    date: new Date().toISOString(),
    action: `Đổi mã giảm giá ${voucherType}`,
    change: `-${cost} xu`,
    current: record.points,
  });

  await writeLoyaltyDb(db);
  return {
    success: true,
    message: `Đổi quà thành công! Bạn đã nhận được mã ${couponCode}`,
    couponCode,
    record,
  };
}

// Mark coupon as used
export async function useCoupon(email: string, code: string): Promise<boolean> {
  const db = await readLoyaltyDb();
  const lowerEmail = email.toLowerCase();
  const record = db[lowerEmail];
  
  if (!record || !record.redeemedCoupons) return false;
  
  const coupon = record.redeemedCoupons.find((c) => c.code === code && !c.used);
  if (coupon) {
    coupon.used = true;
    await writeLoyaltyDb(db);
    return true;
  }
  
  return false;
}
