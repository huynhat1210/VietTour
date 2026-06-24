"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import AdminChatsView from "@/components/AdminChatsView";
import { useLanguage } from "@/context/LanguageContext";

type BookingStatus = "pending" | "confirmed" | "cancelled";

interface AdminBooking {
  id: number;
  documentId: string;
  fullName: string;
  email: string;
  phone: string;
  tourDate: string;
  numberOfGuests: number;
  status: BookingStatus;
  message?: string;
  createdAt: string;
  paymentStatus?: "unpaid" | "paid";
  paymentMethod?: string;
  totalAmount?: number;
  transactionId?: string;
  tour?: {
    title: string;
    price: number;
    location: string;
  };
}

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "#f59e0b",
  confirmed: "#10b981",
  cancelled: "#ef4444",
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { t, language: locale } = useLanguage();

  const statusLabels = useMemo<Record<BookingStatus, string>>(() => ({
    pending: t("admin_status_pending"),
    confirmed: t("admin_status_confirmed"),
    cancelled: t("admin_status_cancelled"),
  }), [t]);

  const adm = useMemo(() => {
    const isEn = locale === "en";
    return {
      back: isEn ? "← Back" : "← Quay lại",
      title: isEn ? "Tour Bookings (Admin)" : "Quản lý Đặt Tour",
      subtitle: isEn ? "View and approve all customer bookings" : "Xem và duyệt tất cả booking từ khách hàng",
      tab_list: isEn ? "📋 Bookings" : "📋 Danh sách",
      tab_analytics: isEn ? "📊 Analytics" : "📊 Thống kê",
      tab_reviews: isEn ? "⭐ Manage Reviews" : "⭐ Quản lý Đánh giá",
      tab_users: isEn ? "👥 Manage Users" : "👥 Quản lý Thành viên",
      tab_chats: isEn ? "💬 Manage Chats" : "💬 Quản lý Chat",
      
      // Booking list tab
      stat_total_bookings: isEn ? "Total Bookings" : "Tổng booking",
      stat_pending: isEn ? "Pending" : "Chờ duyệt",
      stat_confirmed: isEn ? "Confirmed" : "Đã xác nhận",
      stat_cancelled: isEn ? "Cancelled" : "Đã hủy",
      search_placeholder: isEn ? "Search by name, email, tour..." : "🔍 Tìm kiếm theo tên, email, tour...",
      filter_all: isEn ? "All" : "Tất cả",
      
      // Table columns
      col_customer: isEn ? "Customer" : "Khách hàng",
      col_tour: isEn ? "Tour" : "Tour",
      col_date: isEn ? "Date" : "Ngày đi",
      col_guests: isEn ? "Guests" : "Số khách",
      col_payment: isEn ? "Payment" : "Thanh toán",
      col_status: isEn ? "Status" : "Trạng thái",
      col_actions: isEn ? "Actions" : "Thao tác",
      
      // Table cells
      guest_count: isEn ? "{count} guests" : "{count} người",
      date_created: isEn ? "Booked: {date}" : "Đặt: {date}",
      payment_paid: isEn ? "Paid" : "Đã mua",
      payment_unpaid: isEn ? "Unpaid" : "Chưa trả tiền",
      
      // Actions
      action_confirm: isEn ? "✓ Confirm" : "✓ Xác nhận",
      action_cancel: isEn ? "✗ Cancel" : "✗ Hủy",
      action_pending: isEn ? "↩ Pending" : "↩ Chờ",
      action_edit: isEn ? "✏️ Edit" : "✏️ Sửa",
      action_block: isEn ? "🔒 Block" : "🔒 Khóa",
      action_unblock: isEn ? "🔓 Unblock" : "🔓 Mở",
      action_delete: isEn ? "✗ Delete" : "✗ Xóa",
      action_approve: isEn ? "✓ Approve" : "✓ Duyệt",
      
      // Analytics tab
      analytics_total_revenue: isEn ? "TOTAL REVENUE" : "TỔNG DOANH THU",
      analytics_revenue_sub: isEn ? "Based on paid & confirmed bookings" : "Tính trên đơn đã thanh toán & xác nhận",
      analytics_payment_rate: isEn ? "PAYMENT RATE" : "TỶ LỆ THANH TOÁN",
      analytics_payment_sub: isEn ? "Paid: {paid} / {total} bookings" : "Đã trả tiền: {paid} / {total} booking",
      analytics_avg_guests: isEn ? "AVERAGE GUESTS" : "SỐ KHÁCH TRUNG BÌNH",
      analytics_avg_guests_sub: isEn ? "Total tourists: {total} guests" : "Tổng khách du lịch: {total} người",
      analytics_avg_guests_val: isEn ? "guests / booking" : "người / đơn",
      analytics_chart_title: isEn ? "📈 Revenue Chart of Last 6 Months (Simulated)" : "📈 Biểu đồ doanh thu 6 tháng qua (Mô phỏng)",
      analytics_breakdown_title: isEn ? "📊 Status Distribution" : "📊 Phân bổ trạng thái",
      analytics_breakdown_sub: isEn ? "Total {total} bookings received" : "Tổng cộng {total} đơn đã tiếp nhận",
      analytics_top_tours: isEn ? "🔥 Top 5 Most Booked Tours" : "🔥 Top 5 Tour được đặt nhiều nhất",
      analytics_no_tours: isEn ? "No tour data available" : "Chưa có dữ liệu tour",
      analytics_insights_title: isEn ? "💡 Business Insights" : "💡 Gợi ý kinh doanh",
      analytics_insights_desc: isEn 
        ? "Based on actual booking numbers, high-volume tours are attracting significant attention. Consider expanding schedules or introducing promotional offers for these leading tours to maximize revenue during peak season."
        : "Dựa vào số liệu đặt tour thực tế, các tour có lượng đặt cao đang thu hút sự chú ý đáng kể. Hãy cân nhắc mở rộng thêm lịch trình hoặc thêm các chương trình khuyến mãi cho các tour dẫn đầu này để tối đa hóa doanh thu trong mùa cao điểm.",
      
      // Reviews Tab
      reviews_total: isEn ? "Total Reviews" : "Tổng đánh giá",
      reviews_approved: isEn ? "Approved" : "Đã duyệt",
      reviews_col_stars: isEn ? "Stars" : "Số sao",
      reviews_col_content: isEn ? "Review Content" : "Nội dung nhận xét",
      reviews_no_reviews: isEn ? "No reviews found" : "⭐ Không có đánh giá nào",
      reviews_general: isEn ? "General" : "Chung",
      
      // Users Tab
      users_total: isEn ? "Total Members" : "Tổng thành viên",
      users_manager: isEn ? "Managers" : "Quản lý",
      users_blocked: isEn ? "Blocked" : "Bị khóa",
      users_unconfirmed: isEn ? "Unconfirmed" : "Chưa xác minh",
      users_search_placeholder: isEn ? "Search member by name, email, username..." : "🔍 Tìm kiếm thành viên theo tên, email, username...",
      users_no_users: isEn ? "No members found" : "👥 Không có thành viên nào",
      users_col_role: isEn ? "Role" : "Vai trò",
      users_not_updated: isEn ? "Not updated" : "Chưa cập nhật",
      users_role_member: isEn ? "Member" : "Thành viên",
      users_status_active: isEn ? "Active" : "Hoạt động",
      
      // Modal Edit User
      modal_title: isEn ? "Edit Member Information" : "Chỉnh sửa thông tin thành viên",
      modal_grid: isEn ? "Member Details" : "Thông tin chi tiết",
      modal_label_name: isEn ? "Full Name" : "Họ và tên",
      modal_label_username: isEn ? "Username" : "Tên đăng nhập (username)",
      modal_label_email: isEn ? "Email" : "Email",
      modal_label_phone: isEn ? "Phone Number" : "Số điện thoại",
      modal_label_role: isEn ? "Role" : "Vai trò",
      modal_label_verified: isEn ? "Verified" : "Đã xác minh",
      modal_label_block: isEn ? "Block Account" : "Khóa tài khoản",
      modal_btn_cancel: isEn ? "Cancel" : "Hủy",
      modal_btn_save: isEn ? "Save Changes" : "Lưu thay đổi",
      modal_btn_saving: isEn ? "Saving..." : "Đang lưu...",
      
      // Common & Loading
      loading_data: isEn ? "Loading data..." : "Đang tải dữ liệu...",
      no_bookings: isEn ? "No bookings found" : "📋 Không có booking nào",
      booking_unit: isEn ? "bookings" : "đơn",
      month_prefix: isEn ? "M" : "Thg",
      currency_symbol: isEn ? "VND" : "₫",
      
      // Alerts & Toast messages
      toast_no_permission: isEn ? "You do not have permission to access this page" : "Bạn không có quyền truy cập trang này",
      toast_load_users_fail: isEn ? "Failed to load member list" : "Không thể tải danh sách thành viên",
      toast_update_user_fail: isEn ? "Failed to update member" : "Cập nhật thành viên thất bại",
      toast_update_user_success: isEn ? "Member updated successfully!" : "Cập nhật thành viên thành công!",
      toast_block_success: isEn ? "Member account blocked" : "Đã khóa tài khoản thành viên",
      toast_unblock_success: isEn ? "Member account unblocked" : "Đã mở khóa tài khoản thành viên",
      toast_action_failed: isEn ? "Action failed" : "Thao tác thất bại",
      toast_delete_user_confirm: isEn ? "Are you sure you want to delete this member? This action cannot be undone." : "Bạn có chắc chắn muốn xóa thành viên này không? Thao tác này không thể hoàn tác.",
      toast_delete_user_success: isEn ? "Member deleted successfully!" : "Đã xóa thành viên thành công!",
      toast_delete_user_fail: isEn ? "Failed to delete member" : "Xóa thành viên thất bại",
      toast_load_bookings_fail: isEn ? "Failed to load booking list" : "Không thể tải danh sách booking",
      toast_update_status_success: isEn ? "Updated status to" : "Đã cập nhật trạng thái thành",
      toast_update_status_fail: isEn ? "Update failed" : "Cập nhật thất bại",
      toast_load_reviews_fail: isEn ? "Failed to load review list" : "Không thể tải danh sách đánh giá",
      toast_approve_review_success: isEn ? "Approved guest review!" : "Đã phê duyệt đánh giá thực tế!",
      toast_approve_review_fail: isEn ? "Approval failed" : "Phê duyệt thất bại",
      toast_delete_review_confirm: isEn ? "Are you sure you want to delete this review?" : "Bạn có chắc chắn muốn xóa đánh giá này không?",
      toast_delete_review_success: isEn ? "Review deleted successfully!" : "Đã xóa đánh giá thành công!",
      toast_delete_review_fail: isEn ? "Delete failed" : "Xóa thất bại",
    };
  }, [locale]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "analytics" | "reviews" | "users" | "chats">("list");

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [updatingReview, setUpdatingReview] = useState<string | null>(null);

  // Users management states
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Pagination states
  const [bookingsPage, setBookingsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);

  // Reset page states on filter/search change
  useEffect(() => {
    setBookingsPage(1);
  }, [filter, searchQuery]);

  useEffect(() => {
    setUsersPage(1);
  }, [userSearchQuery]);

  useEffect(() => {
    setReviewsPage(1);
  }, [viewMode]);

  const loadUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error(adm.toast_load_users_fail);
      const data = await res.json();
      setUsers(data.users || []);
      setRoles(data.roles || []);
    } catch (err: any) {
      showToast(err.message || adm.toast_load_users_fail, "error");
    } finally {
      setUsersLoading(false);
    }
  }, [showToast, adm.toast_load_users_fail]);

  useEffect(() => {
    if (viewMode === "users") {
      loadUsers();
    }
  }, [viewMode, loadUsers]);

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    setUpdatingUser(editingUser.documentId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: editingUser.documentId,
          fullName: editingUser.fullName,
          username: editingUser.username,
          email: editingUser.email,
          phone: editingUser.phone,
          role: editingUser.roleId,
          blocked: editingUser.blocked,
          confirmed: editingUser.confirmed,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || adm.toast_update_user_fail);
      }

      showToast(adm.toast_update_user_success, "success");
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      showToast(err.message || adm.toast_update_user_fail, "error");
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleToggleBlockUser = async (userToToggle: any) => {
    const newBlocked = !userToToggle.blocked;
    setUpdatingUser(userToToggle.documentId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: userToToggle.documentId,
          blocked: newBlocked,
        }),
      });

      if (!res.ok) throw new Error();
      showToast(
        newBlocked ? adm.toast_block_success : adm.toast_unblock_success,
        "success"
      );
      loadUsers();
    } catch {
      showToast(adm.toast_action_failed, "error");
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleDeleteUser = async (documentId: string) => {
    if (!confirm(adm.toast_delete_user_confirm)) return;
    setUpdatingUser(documentId);
    try {
      const res = await fetch(`/api/admin/users?documentId=${documentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || adm.toast_delete_user_fail);
      }

      showToast(adm.toast_delete_user_success, "success");
      loadUsers();
    } catch (err: any) {
      showToast(err.message || adm.toast_delete_user_fail, "error");
    } finally {
      setUpdatingUser(null);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role?.type !== "manager") {
        showToast(adm.toast_no_permission, "error");
        router.push("/");
      }
    }
  }, [user, authLoading, router, showToast, adm.toast_no_permission]);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin-bookings");
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          showToast(adm.toast_no_permission, "error");
          router.push("/");
          return;
        }
        throw new Error(adm.toast_load_bookings_fail);
      }
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err: any) {
      showToast(err.message || adm.toast_load_bookings_fail, "error");
    } finally {
      setLoading(false);
    }
  }, [router, showToast, adm.toast_no_permission, adm.toast_load_bookings_fail]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleStatusChange = async (
    documentId: string,
    newStatus: BookingStatus
  ) => {
    setUpdating(documentId);
    try {
      const res = await fetch("/api/admin-bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, status: newStatus }),
      });
      if (!res.ok) {
        throw new Error(adm.toast_update_status_fail);
      }
      setBookings((prev) =>
        prev.map((b) =>
          b.documentId === documentId ? { ...b, status: newStatus } : b
        )
      );
      showToast(
        `${adm.toast_update_status_success} "${statusLabels[newStatus]}"`,
        "success"
      );
    } catch (err: any) {
      showToast(err.message || adm.toast_update_status_fail, "error");
    } finally {
      setUpdating(null);
    }
  };

  const loadReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const res = await fetch("/api/tours/reviews");
      if (!res.ok) throw new Error(adm.toast_load_reviews_fail);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err: any) {
      showToast(err.message || adm.toast_load_reviews_fail, "error");
    } finally {
      setReviewsLoading(false);
    }
  }, [showToast, adm.toast_load_reviews_fail]);

  useEffect(() => {
    if (viewMode === "reviews") {
      loadReviews();
    }
  }, [viewMode, loadReviews]);

  const handleApproveReview = async (documentId: string) => {
    setUpdatingReview(documentId);
    try {
      const res = await fetch("/api/tours/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
      });
      if (!res.ok) throw new Error(adm.toast_approve_review_fail);
      showToast(adm.toast_approve_review_success, "success");
      loadReviews();
    } catch (err: any) {
      showToast(err.message || adm.toast_approve_review_fail, "error");
    } finally {
      setUpdatingReview(null);
    }
  };

  const handleDeleteReview = async (documentId: string) => {
    if (!confirm(adm.toast_delete_review_confirm)) return;
    setUpdatingReview(documentId);
    try {
      const res = await fetch(`/api/tours/reviews?documentId=${documentId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(adm.toast_delete_review_fail);
      showToast(adm.toast_delete_review_success, "success");
      loadReviews();
    } catch (err: any) {
      showToast(err.message || adm.toast_delete_review_fail, "error");
    } finally {
      setUpdatingReview(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = filter === "all" || b.status === filter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      b.fullName.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.tour?.title?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const filteredUsers = users.filter((u) => {
    const q = userSearchQuery.toLowerCase();
    return (
      !q ||
      (u.fullName || "").toLowerCase().includes(q) ||
      (u.username || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  // Compute analytics
  const totalRevenue = bookings.reduce((sum, b) => {
    if (b.status === "confirmed" || b.paymentStatus === "paid") {
      const amt = b.totalAmount || (b.tour?.price || 0) * b.numberOfGuests;
      return sum + amt;
    }
    return sum;
  }, 0);

  const paidCount = bookings.filter((b) => b.paymentStatus === "paid").length;
  const paymentRate = bookings.length
    ? Math.round((paidCount / bookings.length) * 100)
    : 0;

  const totalGuests = bookings.reduce((sum, b) => sum + b.numberOfGuests, 0);
  const avgGuests = bookings.length
    ? (totalGuests / bookings.length).toFixed(1)
    : "0";

  const getRevenueByMonth = () => {
    const monthsMap: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = `${adm.month_prefix} ${d.getMonth() + 1}`;
      monthsMap[label] = 0;
    }
    bookings.forEach((b) => {
      if (b.status === "confirmed" || b.paymentStatus === "paid") {
        const d = new Date(b.createdAt || b.tourDate);
        const label = `${adm.month_prefix} ${d.getMonth() + 1}`;
        const amt = b.totalAmount || (b.tour?.price || 0) * b.numberOfGuests;
        if (label in monthsMap) {
          monthsMap[label] += amt;
        }
      }
    });
    return Object.entries(monthsMap).map(([month, rev]) => ({ month, rev }));
  };

  const getTourPopularity = () => {
    const tourMap: Record<string, { count: number; revenue: number }> = {};
    bookings.forEach((b) => {
      const title = b.tour?.title || (locale === "en" ? "Other" : "Khác");
      const amt = b.totalAmount || (b.tour?.price || 0) * b.numberOfGuests;
      const rev = (b.status === "confirmed" || b.paymentStatus === "paid") ? amt : 0;
      if (!tourMap[title]) {
        tourMap[title] = { count: 0, revenue: 0 };
      }
      tourMap[title].count += 1;
      tourMap[title].revenue += rev;
    });
    return Object.entries(tourMap)
      .map(([title, data]) => ({ title, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const revenueData = getRevenueByMonth();
  const topTours = getTourPopularity();

  return (
    <div className="admin-bookings">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="admin-title">{adm.title}</h1>
              <p className="admin-subtitle">{adm.subtitle}</p>
            </div>
          </div>

          <div className="view-mode-tabs">
            <button
              className={`view-mode-tab ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              {adm.tab_list}
            </button>
            <button
              className={`view-mode-tab ${viewMode === "analytics" ? "active" : ""}`}
              onClick={() => setViewMode("analytics")}
            >
              {adm.tab_analytics}
            </button>
            <button
              className={`view-mode-tab ${viewMode === "reviews" ? "active" : ""}`}
              onClick={() => setViewMode("reviews")}
            >
              {adm.tab_reviews}
            </button>
            <button
              className={`view-mode-tab ${viewMode === "users" ? "active" : ""}`}
              onClick={() => setViewMode("users")}
            >
              {adm.tab_users}
            </button>
            <button
              className={`view-mode-tab ${viewMode === "chats" ? "active" : ""}`}
              onClick={() => setViewMode("chats")}
            >
              {adm.tab_chats}
            </button>
          </div>
        </div>
      </div>

      <div className="admin-body">
        {viewMode === "list" && (
          <>
            {/* Stats */}
            <div className="admin-stats">
              {[
                { label: adm.stat_total_bookings, value: stats.total, color: "#6366f1" },
                { label: adm.stat_pending, value: stats.pending, color: "#f59e0b" },
                { label: adm.stat_confirmed, value: stats.confirmed, color: "#10b981" },
                { label: adm.stat_cancelled, value: stats.cancelled, color: "#ef4444" },
              ].map((s) => (
                <div className="stat-card" key={s.label} style={{ borderColor: s.color }}>
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="admin-filters">
              <input
                className="admin-search"
                type="text"
                placeholder={adm.search_placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="filter-tabs">
                {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
                  <button
                    key={f}
                    className={`filter-tab ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === "all"
                      ? `${adm.filter_all} (${stats.total})`
                      : `${statusLabels[f as BookingStatus]} (${stats[f as BookingStatus]})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="admin-loading">
                <div className="loading-spinner" />
                <p>{adm.loading_data}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="admin-empty">
                <p>{adm.no_bookings}</p>
              </div>
            ) : (
              <div className="bookings-table-wrap">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>{adm.col_customer}</th>
                      <th>{adm.col_tour}</th>
                      <th>{adm.col_date}</th>
                      <th>{adm.col_guests}</th>
                      <th>{adm.col_payment}</th>
                      <th>{adm.col_status}</th>
                      <th>{adm.col_actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice((bookingsPage - 1) * 10, bookingsPage * 10).map((booking) => {
                      const totalAmt = booking.totalAmount || (booking.tour?.price || 0) * booking.numberOfGuests;
                      return (
                        <tr key={booking.documentId} className="booking-row">
                          <td data-label={adm.col_customer}>
                            <div className="customer-info">
                              <div className="customer-avatar">
                                {booking.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="customer-name">{booking.fullName}</div>
                                <div className="customer-email">{booking.email}</div>
                                <div className="customer-phone">{booking.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td data-label={adm.col_tour}>
                            <div className="tour-info">
                              <div className="tour-name">
                                {booking.tour?.title || "—"}
                              </div>
                              {booking.tour?.location && (
                                <div className="tour-location">
                                  📍 {booking.tour.location}
                                </div>
                              )}
                            </div>
                          </td>
                          <td data-label={adm.col_date}>
                            <div className="booking-date">
                              {new Date(booking.tourDate).toLocaleDateString(locale === "en" ? "en-US" : "vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </div>
                            <div className="booking-created">
                              {adm.date_created.replace("{date}", new Date(booking.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "vi-VN"))}
                            </div>
                          </td>
                          <td data-label={adm.col_guests}>
                            <div className="guests-badge">
                              {adm.guest_count.replace("{count}", booking.numberOfGuests.toString())}
                            </div>
                          </td>
                          <td data-label={adm.col_payment}>
                            <div className="payment-cell">
                              <div className="payment-amount">
                                {totalAmt.toLocaleString(locale === "en" ? "en-US" : "vi-VN")} {adm.currency_symbol}
                              </div>
                              {booking.paymentStatus === "paid" ? (
                                <span className="pay-badge paid">
                                  {adm.payment_paid} {booking.paymentMethod ? `(${booking.paymentMethod})` : ""}
                                </span>
                              ) : (
                                <span className="pay-badge unpaid">{adm.payment_unpaid}</span>
                              )}
                            </div>
                          </td>
                          <td data-label={adm.col_status}>
                            <span
                              className="status-badge"
                              style={{
                                background: `${STATUS_COLORS[booking.status]}22`,
                                color: STATUS_COLORS[booking.status],
                                borderColor: STATUS_COLORS[booking.status],
                              }}
                            >
                              {statusLabels[booking.status]}
                            </span>
                          </td>
                          <td data-label={adm.col_actions}>
                            <div className="action-buttons">
                              {booking.status !== "confirmed" && (
                                <button
                                  className="action-btn confirm-btn"
                                  disabled={updating === booking.documentId}
                                  onClick={() =>
                                    handleStatusChange(booking.documentId, "confirmed")
                                  }
                                >
                                  {updating === booking.documentId ? "..." : adm.action_confirm}
                                </button>
                              )}
                              {booking.status !== "cancelled" && (
                                <button
                                  className="action-btn cancel-btn"
                                  disabled={updating === booking.documentId}
                                  onClick={() =>
                                    handleStatusChange(booking.documentId, "cancelled")
                                  }
                                >
                                  {updating === booking.documentId ? "..." : adm.action_cancel}
                                </button>
                              )}
                              {booking.status !== "pending" && (
                                <button
                                  className="action-btn pending-btn"
                                  disabled={updating === booking.documentId}
                                  onClick={() =>
                                    handleStatusChange(booking.documentId, "pending")
                                  }
                                >
                                  {updating === booking.documentId ? "..." : adm.action_pending}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length > 10 && (
                  <div className="pagination-wrap">
                    <button
                      className="pagination-btn arrow"
                      disabled={bookingsPage === 1}
                      onClick={() => setBookingsPage((p) => p - 1)}
                    >
                      ←
                    </button>
                    {Array.from({ length: Math.ceil(filtered.length / 10) }).map((_, i) => (
                      <button
                        key={i + 1}
                        className={`pagination-btn ${bookingsPage === i + 1 ? "active" : ""}`}
                        onClick={() => setBookingsPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="pagination-btn arrow"
                      disabled={bookingsPage === Math.ceil(filtered.length / 10)}
                      onClick={() => setBookingsPage((p) => p + 1)}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {viewMode === "analytics" && (
          <div className="analytics-container animate-in fade-in duration-200">
            {/* Top stats indicators */}
            <div className="analytics-main-stats">
              <div className="analytics-card">
                <p className="stat-label">{adm.analytics_total_revenue}</p>
                <p className="stat-value text-emerald-600 mt-2">
                  {totalRevenue.toLocaleString(locale === "en" ? "en-US" : "vi-VN")} <span className="text-xl font-bold">{adm.currency_symbol}</span>
                </p>
                <p className="text-[11px] text-gray-30 mt-1">{adm.analytics_revenue_sub}</p>
              </div>

              <div className="analytics-card">
                <p className="stat-label">{adm.analytics_payment_rate}</p>
                <p className="stat-value text-indigo-600 mt-2">
                  {paymentRate} <span className="text-xl font-bold">%</span>
                </p>
                <p className="text-[11px] text-gray-30 mt-1">
                  {adm.analytics_payment_sub.replace("{paid}", paidCount.toString()).replace("{total}", bookings.length.toString())}
                </p>
              </div>

              <div className="analytics-card">
                <p className="stat-label">{adm.analytics_avg_guests}</p>
                <p className="stat-value text-orange-500 mt-2">
                  {avgGuests} <span className="text-xl font-bold">{adm.analytics_avg_guests_val}</span>
                </p>
                <p className="text-[11px] text-gray-30 mt-1">
                  {adm.analytics_avg_guests_sub.replace("{total}", totalGuests.toString())}
                </p>
              </div>
            </div>

            {/* SVG Revenue Chart */}
            <div className="analytics-card revenue-chart-card">
              <h3 className="analytics-title">
                {adm.analytics_chart_title}
              </h3>
              <RevenueChart data={revenueData} locale={locale} />
            </div>

            {/* Status Breakdown card */}
            <div className="analytics-card breakdown-card flex flex-col justify-between">
              <h3 className="analytics-title">
                {adm.analytics_breakdown_title}
              </h3>
              
              <div className="status-breakdown-list my-auto">
                {[
                  { label: adm.stat_confirmed, value: stats.confirmed, color: "#10b981" },
                  { label: adm.stat_pending, value: stats.pending, color: "#f59e0b" },
                  { label: adm.stat_cancelled, value: stats.cancelled, color: "#ef4444" },
                ].map((item) => {
                  const pct = stats.total ? Math.round((item.value / stats.total) * 100) : 0;
                  return (
                    <div className="status-breakdown-item" key={item.label}>
                      <span className="status-dot" style={{ backgroundColor: item.color }} />
                      <span className="status-name">{item.label}</span>
                      <span className="status-percentage">{item.value} {adm.booking_unit} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4 text-center">
                <p className="text-xs text-gray-30">
                  {adm.analytics_breakdown_sub.replace("{total}", stats.total.toString())}
                </p>
              </div>
            </div>

            {/* Top Tours */}
            <div className="analytics-card tours-chart-card">
              <h3 className="analytics-title">
                {adm.analytics_top_tours}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="popularity-list">
                  {topTours.map((tour, idx) => {
                    const maxCount = Math.max(...topTours.map(t => t.count), 1);
                    const pct = Math.round((tour.count / maxCount) * 100);
                    return (
                      <div className="popularity-item" key={tour.title}>
                        <div className="popularity-item-header">
                          <span className="truncate pr-4">
                            {idx + 1}. {tour.title}
                          </span>
                          <span className="shrink-0 text-slate-600 font-bold">
                            {tour.count} {adm.booking_unit}
                          </span>
                        </div>
                        <div className="popularity-progress-bg">
                          <div
                            className="popularity-progress-bar"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {topTours.length === 0 && (
                    <p className="text-sm text-gray-30 italic">{adm.analytics_no_tours}</p>
                  )}
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-center">
                  <h4 className="font-bold text-sm text-gray-90 mb-2">{adm.analytics_insights_title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {adm.analytics_insights_desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === "reviews" && (
          <>
            {/* Stats for reviews */}
            <div className="admin-stats animate-in fade-in duration-200">
              {[
                { label: adm.reviews_total, value: reviews.length, color: "#6366f1" },
                { label: adm.stat_pending, value: reviews.filter((r) => !r.publishedAt).length, color: "#f59e0b" },
                { label: adm.reviews_approved, value: reviews.filter((r) => r.publishedAt).length, color: "#10b981" },
              ].map((s) => (
                <div className="stat-card" key={s.label} style={{ borderColor: s.color }}>
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Reviews Table */}
            {reviewsLoading ? (
              <div className="admin-loading">
                <div className="loading-spinner" />
                <p>{adm.loading_data}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="admin-empty">
                <p>{adm.reviews_no_reviews}</p>
              </div>
            ) : (
              <div className="bookings-table-wrap animate-in fade-in duration-200">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>{adm.col_customer}</th>
                      <th>{adm.col_tour}</th>
                      <th>{adm.reviews_col_stars}</th>
                      <th>{adm.reviews_col_content}</th>
                      <th>{adm.col_status}</th>
                      <th>{adm.col_actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.slice((reviewsPage - 1) * 10, reviewsPage * 10).map((r) => (
                      <tr key={r.documentId} className="booking-row">
                        <td data-label={adm.col_customer}>
                          <div className="customer-info">
                            <div className="customer-avatar" style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
                              {r.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="customer-name">{r.name}</div>
                            </div>
                          </div>
                        </td>
                        <td data-label={adm.col_tour}>
                          <div className="tour-info">
                            <div className="tour-name">{r.tour || adm.reviews_general}</div>
                          </div>
                        </td>
                        <td data-label={adm.reviews_col_stars}>
                          <div className="flex gap-0.5">
                            {Array(5)
                              .fill(1)
                              .map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < r.rating ? "text-amber-500 fill-amber-500" : "text-gray-200 fill-gray-200"
                                  }`}
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                          </div>
                        </td>
                        <td data-label={adm.reviews_col_content}>
                          <div className="text-gray-70 max-w-xs md:max-w-md break-words whitespace-normal text-sm leading-relaxed">
                            {r.content}
                          </div>
                        </td>
                        <td data-label={adm.col_status}>
                          {r.publishedAt ? (
                            <span
                              className="status-badge"
                              style={{
                                background: "rgba(16, 185, 129, 0.08)",
                                color: "#10b981",
                                borderColor: "#10b981",
                              }}
                            >
                              {adm.reviews_approved}
                            </span>
                          ) : (
                            <span
                              className="status-badge"
                              style={{
                                background: "rgba(245, 158, 11, 0.08)",
                                color: "#f59e0b",
                                borderColor: "#f59e0b",
                              }}
                            >
                              {adm.stat_pending}
                            </span>
                          )}
                        </td>
                        <td data-label={adm.col_actions}>
                          <div className="action-buttons">
                            {!r.publishedAt && (
                              <button
                                className="action-btn confirm-btn"
                                disabled={updatingReview === r.documentId}
                                onClick={() => handleApproveReview(r.documentId)}
                              >
                                {updatingReview === r.documentId ? "..." : adm.action_approve}
                              </button>
                            )}
                            <button
                              className="action-btn cancel-btn"
                              disabled={updatingReview === r.documentId}
                              onClick={() => handleDeleteReview(r.documentId)}
                            >
                              {updatingReview === r.documentId ? "..." : adm.action_delete}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reviews.length > 10 && (
                  <div className="pagination-wrap">
                    <button
                      className="pagination-btn arrow"
                      disabled={reviewsPage === 1}
                      onClick={() => setReviewsPage((p) => p - 1)}
                    >
                      ←
                    </button>
                    {Array.from({ length: Math.ceil(reviews.length / 10) }).map((_, i) => (
                      <button
                        key={i + 1}
                        className={`pagination-btn ${reviewsPage === i + 1 ? "active" : ""}`}
                        onClick={() => setReviewsPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="pagination-btn arrow"
                      disabled={reviewsPage === Math.ceil(reviews.length / 10)}
                      onClick={() => setReviewsPage((p) => p + 1)}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {viewMode === "users" && (
          <>
            {/* Stats */}
            <div className="admin-stats animate-in fade-in duration-200">
              {[
                { label: adm.users_total, value: users.length, color: "#6366f1" },
                { label: adm.users_manager, value: users.filter((u) => u.role?.type === "manager").length, color: "#10b981" },
                { label: adm.users_blocked, value: users.filter((u) => u.blocked).length, color: "#ef4444" },
                { label: adm.users_unconfirmed, value: users.filter((u) => !u.confirmed).length, color: "#f59e0b" },
              ].map((s) => (
                <div className="stat-card" key={s.label} style={{ borderColor: s.color }}>
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="admin-filters">
              <input
                className="admin-search"
                type="text"
                placeholder={adm.users_search_placeholder}
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
              />
            </div>

            {/* Users Table */}
            {usersLoading ? (
              <div className="admin-loading">
                <div className="loading-spinner" />
                <p>{adm.toast_load_users_fail}</p>
              </div>
            ) : users.length === 0 ? (
              <div className="admin-empty">
                <p>{adm.users_no_users}</p>
              </div>
            ) : (
              <div className="bookings-table-wrap animate-in fade-in duration-200">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>{adm.tab_users.replace("👥 ", "")}</th>
                      <th>Email</th>
                      <th>{adm.modal_label_phone}</th>
                      <th>{adm.users_col_role}</th>
                      <th>{adm.col_status}</th>
                      <th>{adm.col_actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.slice((usersPage - 1) * 10, usersPage * 10).map((u) => (
                      <tr key={u.documentId} className="booking-row">
                        <td data-label={adm.tab_users.replace("👥 ", "")}>
                          <div className="customer-info">
                            <div>
                              <div className="customer-name">{u.fullName || adm.users_not_updated}</div>
                              <div className="customer-email">@{u.username}</div>
                            </div>
                          </div>
                        </td>
                        <td data-label="Email">
                          <div className="text-gray-90 text-sm">{u.email}</div>
                        </td>
                        <td data-label={adm.modal_label_phone}>
                          <div className="text-gray-90 text-sm">{u.phone || "—"}</div>
                        </td>
                        <td data-label={adm.users_col_role}>
                          <span
                            className="status-badge"
                            style={{
                              background: u.role?.type === "manager" ? "rgba(16, 185, 129, 0.08)" : "rgba(99, 102, 241, 0.08)",
                              color: u.role?.type === "manager" ? "#10b981" : "#6366f1",
                              borderColor: u.role?.type === "manager" ? "#10b981" : "#6366f1",
                            }}
                          >
                            {u.role?.type === "manager" ? adm.users_manager : (u.role?.name || adm.users_role_member)}
                          </span>
                        </td>
                        <td data-label={adm.col_status}>
                          <div className="flex flex-col gap-1 items-start">
                            {u.blocked ? (
                              <span className="status-badge" style={{ background: "rgba(239, 68, 68, 0.08)", color: "#ef4444", borderColor: "#ef4444" }}>
                                {adm.users_blocked}
                              </span>
                            ) : (
                              <span className="status-badge" style={{ background: "rgba(16, 185, 129, 0.08)", color: "#10b981", borderColor: "#10b981" }}>
                                {adm.users_status_active}
                              </span>
                            )}
                            {!u.confirmed && (
                              <span className="text-[10px] text-amber-600 font-semibold">{adm.users_unconfirmed}</span>
                            )}
                          </div>
                        </td>
                        <td data-label={adm.col_actions}>
                          <div className="action-buttons">
                            <button
                              className="action-btn confirm-btn"
                              onClick={() => {
                                setEditingUser({
                                  ...u,
                                  roleId: u.role?.id || "",
                                });
                              }}
                            >
                              {adm.action_edit}
                            </button>
                            <button
                              className={`action-btn ${u.blocked ? "confirm-btn" : "pending-btn"}`}
                              disabled={updatingUser === u.documentId}
                              onClick={() => handleToggleBlockUser(u)}
                            >
                              {updatingUser === u.documentId ? "..." : u.blocked ? adm.action_unblock : adm.action_block}
                            </button>
                            {u.username !== user?.username && (
                              <button
                                className="action-btn cancel-btn"
                                disabled={updatingUser === u.documentId}
                                onClick={() => handleDeleteUser(u.documentId)}
                              >
                                {updatingUser === u.documentId ? "..." : adm.action_delete}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length > 10 && (
                  <div className="pagination-wrap">
                    <button
                      className="pagination-btn arrow"
                      disabled={usersPage === 1}
                      onClick={() => setUsersPage((p) => p - 1)}
                    >
                      ←
                    </button>
                    {Array.from({ length: Math.ceil(filteredUsers.length / 10) }).map((_, i) => (
                      <button
                        key={i + 1}
                        className={`pagination-btn ${usersPage === i + 1 ? "active" : ""}`}
                        onClick={() => setUsersPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="pagination-btn arrow"
                      disabled={usersPage === Math.ceil(filteredUsers.length / 10)}
                      onClick={() => setUsersPage((p) => p + 1)}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
              <div className="modal-overlay">
                <div className="modal-card">
                  <h3 className="modal-title">{adm.modal_title}</h3>
                  <form onSubmit={handleUpdateUser}>
                    <div className="modal-grid">
                      <div className="form-group">
                        <label>{adm.modal_label_name}</label>
                        <input
                          type="text"
                          value={editingUser.fullName || ""}
                          onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>{adm.modal_label_username}</label>
                        <input
                          type="text"
                          required
                          value={editingUser.username || ""}
                          onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>{adm.modal_label_email}</label>
                        <input
                          type="email"
                          required
                          value={editingUser.email || ""}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>{adm.modal_label_phone}</label>
                        <input
                          type="text"
                          value={editingUser.phone || ""}
                          onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>{adm.modal_label_role}</label>
                        <select
                          value={editingUser.roleId || ""}
                          onChange={(e) => setEditingUser({ ...editingUser, roleId: e.target.value })}
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group flex-row gap-8 mt-4">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={editingUser.confirmed || false}
                            onChange={(e) => setEditingUser({ ...editingUser, confirmed: e.target.checked })}
                          />
                          {adm.modal_label_verified}
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={editingUser.blocked || false}
                            onChange={(e) => setEditingUser({ ...editingUser, blocked: e.target.checked })}
                          />
                          {adm.modal_label_block}
                        </label>
                      </div>
                    </div>
                    <div className="modal-actions">
                      <button
                        type="button"
                        className="modal-btn cancel-btn"
                        onClick={() => setEditingUser(null)}
                      >
                        {adm.modal_btn_cancel}
                      </button>
                      <button
                        type="submit"
                        className="modal-btn save-btn"
                        disabled={updatingUser === editingUser.documentId}
                      >
                        {updatingUser === editingUser.documentId ? adm.modal_btn_saving : adm.modal_btn_save}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {viewMode === "chats" && (
          <AdminChatsView />
        )}
      </div>

      <style jsx>{`
        .admin-bookings {
          min-height: 100vh;
          background: #f8fafc;
          color: #1e293b;
          font-family: 'Inter', sans-serif;
        }

        .admin-header {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 20px 32px;
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .admin-header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .admin-back-btn {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .admin-back-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .admin-title {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #059669, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 4px;
        }
        .admin-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .view-mode-tabs {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          overflow-x: auto;
          max-width: 100%;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .view-mode-tabs::-webkit-scrollbar {
          display: none;
        }
        .view-mode-tab {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          color: #64748b;
          background: transparent;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .view-mode-tab:hover {
          color: #1e293b;
        }
        .view-mode-tab.active {
          background: #ffffff;
          color: #059669;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .admin-body {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px;
        }

        .admin-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px 24px;
          text-align: center;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }

        .stat-value {
          font-size: 36px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .admin-filters {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .admin-search {
          flex: 1;
          min-width: 260px;
          padding: 12px 16px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          color: #0f172a;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }
        .admin-search:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }
        .admin-search::placeholder {
          color: #94a3b8;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 8px 16px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .filter-tab:hover {
          background: #f1f5f9;
          color: #1e293b;
        }
        .filter-tab.active {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.4);
          color: #047857;
        }

        .admin-loading {
          text-align: center;
          padding: 80px 20px;
          color: #64748b;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(16, 185, 129, 0.1);
          border-top-color: #10b981;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .admin-empty {
          text-align: center;
          padding: 80px 20px;
          color: #64748b;
          font-size: 16px;
        }

        .bookings-table-wrap {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
        }

        .bookings-table th {
          padding: 14px 20px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .booking-row {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s;
        }
        .booking-row:last-child { border-bottom: none; }
        .booking-row:hover { background: #f8fafc; }

        .bookings-table td {
          padding: 16px 20px;
          vertical-align: middle;
        }

        .customer-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .customer-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: #ffffff;
          flex-shrink: 0;
        }
        .customer-name { font-weight: 600; font-size: 14px; color: #1e293b; }
        .customer-email { font-size: 12px; color: #64748b; margin-top: 2px; }
        .customer-phone { font-size: 12px; color: #64748b; }

        .tour-name { font-weight: 600; font-size: 14px; color: #1e293b; max-width: 200px; }
        .tour-location { font-size: 12px; color: #64748b; margin-top: 2px; }

        .booking-date { font-weight: 600; font-size: 14px; color: #1e293b; }
        .booking-created { font-size: 12px; color: #64748b; margin-top: 2px; }

        .guests-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #047857;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid;
          white-space: nowrap;
        }

        .action-buttons {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .confirm-btn {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.25);
          color: #059669;
        }
        .confirm-btn:hover:not(:disabled) {
          background: #10b981;
          color: #ffffff;
          border-color: #10b981;
        }

        .cancel-btn {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.2);
          color: #dc2626;
        }
        .cancel-btn:hover:not(:disabled) {
          background: #ef4444;
          color: #ffffff;
          border-color: #ef4444;
        }

        .pending-btn {
          background: rgba(245, 158, 11, 0.08);
          border-color: rgba(245, 158, 11, 0.2);
          color: #d97706;
        }
        .pending-btn:hover:not(:disabled) {
          background: #f59e0b;
          color: #ffffff;
          border-color: #f59e0b;
        }

        /* Payment cell and badges */
        .payment-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .payment-amount {
          font-weight: 700;
          font-size: 13px;
          color: #1e293b;
        }
        .pay-badge {
          display: inline-flex;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          width: fit-content;
          white-space: nowrap;
        }
        .pay-badge.paid {
          background: rgba(16, 185, 129, 0.08);
          color: #059669;
        }
        .pay-badge.unpaid {
          background: rgba(239, 68, 68, 0.08);
          color: #dc2626;
        }

        /* Analytics section styles */
        .analytics-container {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
        }
        .analytics-main-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          grid-column: span 12;
        }
        .analytics-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }
        .revenue-chart-card {
          grid-column: span 8;
        }
        .breakdown-card {
          grid-column: span 4;
        }
        .tours-chart-card {
          grid-column: span 12;
        }
        .analytics-title {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .popularity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .popularity-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .popularity-item-header {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
          font-weight: 600;
          color: #334155;
        }
        .popularity-progress-bg {
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }
        .popularity-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 4px;
        }

        .status-breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .status-breakdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .status-name {
          font-weight: 600;
          color: #475569;
          flex: 1;
        }
        .status-percentage {
          font-weight: 700;
          color: #1e293b;
        }

        .svg-chart-container {
          background: #ffffff;
          padding: 10px 0;
        }

        @media (max-width: 900px) {
          .admin-header-content { flex-direction: column; align-items: stretch; gap: 16px; }
          .admin-body { padding: 16px; }
          .admin-stats, .analytics-main-stats { grid-template-columns: repeat(2, 1fr); }
          .revenue-chart-card, .breakdown-card { grid-column: span 12; }
          .view-mode-tabs { width: 100%; }
        }
        @media (max-width: 768px) {
          .bookings-table-wrap {
            border: none;
            box-shadow: none;
            background: transparent;
            overflow: visible;
          }
          .bookings-table thead {
            display: none;
          }
          .bookings-table, 
          .bookings-table tbody, 
          .bookings-table tr, 
          .bookings-table td {
            display: block;
            width: 100%;
          }
          .booking-row {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            margin-bottom: 16px;
            padding: 12px 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
            transition: all 0.2s;
          }
          .bookings-table td {
            padding: 12px 0;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-align: right;
          }
          .bookings-table td:last-child {
            border-bottom: none;
            padding-top: 14px;
          }
          .bookings-table td::before {
            content: attr(data-label);
            font-weight: 700;
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            text-align: left;
            margin-right: 12px;
            flex-shrink: 0;
          }
          .customer-info {
            justify-content: flex-end;
            text-align: right;
          }
          .tour-info {
            align-items: flex-end;
            text-align: right;
          }
          .booking-date {
            text-align: right;
          }
          .payment-cell {
            align-items: flex-end;
            text-align: right;
          }
          .action-buttons {
            justify-content: flex-end;
            width: 100%;
          }
        }
        @media (max-width: 500px) {
          .admin-stats, .analytics-main-stats { grid-template-columns: 1fr; }
          .admin-filters { flex-direction: column; align-items: stretch; }
          .view-mode-tab { flex: 1; text-align: center; padding: 8px 10px; font-size: 12px; }
        }

        /* Modal Overlay and Form Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 20px;
        }
        .modal-card {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 550px;
          padding: 32px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: modalFadeIn 0.25s ease;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-title {
          font-size: 20px;
          font-weight: 750;
          margin-bottom: 24px;
          color: #0f172a;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 12px;
        }
        .modal-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 28px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group.flex-row {
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
        }
        .form-group label {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group select {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          outline: none;
          font-size: 14px;
          color: #1e293b;
          font-weight: 550;
          background: #f8fafc;
          transition: all 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus {
          border-color: #059669;
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: #334155;
          font-weight: 600;
          cursor: pointer;
        }
        .checkbox-label input {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }
        .modal-btn {
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .modal-btn.cancel-btn {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #475569;
        }
        .modal-btn.cancel-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .modal-btn.save-btn {
          background: #059669;
          color: #ffffff;
        }
        .modal-btn.save-btn:hover {
          background: #047857;
        }

        /* Pagination Styles */
        .pagination-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }
        .pagination-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          height: 36px;
          padding: 0 8px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .pagination-btn:hover:not(:disabled) {
          border-color: #cbd5e1;
          color: #1e293b;
          background: #f8fafc;
        }
        .pagination-btn.active {
          border-color: #059669;
          background: #059669;
          color: #ffffff;
        }
        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: #f1f5f9;
        }
      `}</style>
    </div>
  );
}

function RevenueChart({ data, locale }: { data: { month: string; rev: number }[]; locale: string }) {
  const maxVal = Math.max(...data.map((d) => d.rev), 5000000); // min 5M scale
  const height = 200;
  const width = 500;
  const paddingLeft = 60;
  const paddingBottom = 30;
  const paddingTop = 30;
  const paddingRight = 20;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingLeft - paddingRight;

  const barWidth = (chartWidth / data.length) - 16;

  return (
    <div className="svg-chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingTop + chartHeight * (1 - ratio);
          const val = maxVal * ratio;
          return (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize={9}
                className="fill-slate-400 font-semibold"
              >
                {val >= 1000000
                  ? `${(val / 1000000).toFixed(1)}M`
                  : val.toLocaleString(locale === "en" ? "en-US" : "vi-VN")}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = paddingLeft + (chartWidth / data.length) * i + 8;
          const barHeight = maxVal > 0 ? (d.rev / maxVal) * chartHeight : 0;
          const y = paddingTop + chartHeight - barHeight;

          return (
            <g key={d.month} className="group cursor-pointer">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="url(#barGradient)"
                rx={4}
                className="transition-all duration-300 hover:opacity-80"
              />
              {/* Tooltip on Hover */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <rect
                  x={x - 25 + barWidth / 2}
                  y={y - 26}
                  width={66}
                  height={20}
                  rx={4}
                  fill="#1e293b"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 13}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={8.5}
                  fontWeight="bold"
                >
                  {(d.rev / 1000000).toFixed(2)}M {locale === "en" ? "VND" : "₫"}
                </text>
              </g>
              {/* X axis Label */}
              <text
                x={x + barWidth / 2}
                y={height - 10}
                textAnchor="middle"
                fontSize={10}
                className="fill-slate-500 font-bold"
              >
                {d.month}
              </text>
            </g>
          );
        })}

        {/* Axis lines */}
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={height - paddingBottom}
          stroke="#cbd5e1"
          strokeWidth={1.5}
        />
        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke="#cbd5e1"
          strokeWidth={1.5}
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
