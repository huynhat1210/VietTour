export default {
  async afterUpdate(event: any) {
    const { result, params } = event;
    const { data } = params;

    // Only trigger when paymentStatus is explicitly set/updated to 'paid'
    if (data && data.paymentStatus === 'paid') {
      try {
        const docId = result.documentId;
        if (!docId) {
          strapi.log.warn('[Email Automation] No documentId found in update result');
          return;
        }

        // Fetch the booking details and populate relation 'tour'
        const booking = await strapi.documents('api::booking.booking').findOne({
          documentId: docId,
          populate: ['tour'],
        }) as any;

        if (!booking) {
          strapi.log.error(`[Email Automation] Booking not found for documentId: ${docId}`);
          return;
        }

        if (!booking.email) {
          strapi.log.warn(`[Email Automation] Booking #${booking.id} does not have an email address`);
          return;
        }

        strapi.log.info(`[Email Automation] Sending confirmation email for booking #${booking.id} to ${booking.email}`);

        const tourTitle = booking.tour?.title || 'Tour du lịch';
        const tourLocation = booking.tour?.location || 'Việt Nam';
        const totalAmount = booking.totalAmount || 0;
        
        // Format Currency to VND (e.g. 1.200.000 ₫)
        const formattedAmount = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(totalAmount);

        // Format tour date
        let tourDateStr = booking.tourDate || '';
        if (booking.tourDate) {
          try {
            const dateObj = new Date(booking.tourDate);
            tourDateStr = dateObj.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
          } catch (e) {
            // fallback
          }
        }

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận Đặt Tour thành công - VietTour</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
      border: 1px solid #f1f5f9;
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 8px 0 0 0;
      opacity: 0.9;
      font-size: 14px;
      font-weight: 500;
    }
    .content {
      padding: 35px 30px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .intro-text {
      font-size: 14px;
      color: #64748b;
      margin-top: 0;
      margin-bottom: 25px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .card-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      border-b: 1px solid #cbd5e1;
      padding-bottom: 8px;
      margin-bottom: 15px;
      margin-top: 0;
    }
    .info-list {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }
    .info-item {
      display: table;
      width: 100%;
      margin-bottom: 10px;
    }
    .info-label {
      display: table-cell;
      width: 45%;
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }
    .info-value {
      display: table-cell;
      width: 55%;
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
      text-align: right;
    }
    .info-value-highlight {
      color: #10b981;
      font-weight: 700;
    }
    .info-value-mono {
      font-family: Consolas, Monaco, monospace;
    }
    .divider {
      border-top: 1px dashed #cbd5e1;
      margin: 12px 0;
    }
    .total-row {
      margin-top: 10px;
    }
    .total-label {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }
    .total-value {
      font-size: 18px;
      font-weight: 800;
      color: #10b981;
    }
    .note-box {
      font-size: 12px;
      color: #64748b;
      background-color: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .btn-container {
      text-align: center;
      margin: 30px 0 10px 0;
    }
    .btn {
      display: inline-block;
      background-color: #10b981;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 14px 28px;
      border-radius: 9999px;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
    }
    .barcode-container {
      text-align: center;
      margin-top: 20px;
    }
    .barcode-line {
      display: inline-block;
      background-color: #1e293b;
      height: 24px;
      margin: 0 1px;
    }
    .barcode-text {
      font-family: Consolas, monospace;
      font-size: 9px;
      color: #64748b;
      margin-top: 4px;
      letter-spacing: 2px;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 24px 30px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      margin: 4px 0;
    }
    .footer a {
      color: #10b981;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>XÁC NHẬN ĐẶT TOUR THÀNH CÔNG</h1>
        <p>Cảm ơn bạn đã lựa chọn VietTour</p>
      </div>
      <div class="content">
        <div class="greeting">Xin chào ${booking.fullName},</div>
        <p class="intro-text">Chúng tôi vui mừng thông báo rằng thanh toán cho đơn đặt tour của bạn đã được nhận và xác nhận thành công. Dưới đây là thông tin chi tiết hóa đơn dịch vụ của bạn.</p>

        <!-- Booking details -->
        <div class="card">
          <h3 class="card-title">Thông tin giao dịch</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Mã đơn đặt tour:</span>
              <span class="info-value info-value-highlight">#${booking.id}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Mã giao dịch:</span>
              <span class="info-value info-value-mono">${booking.transactionId || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phương thức thanh toán:</span>
              <span class="info-value">${booking.paymentMethod || 'VNPAY'}</span>
            </div>
            <div class="divider"></div>
            <div class="info-item total-row">
              <span class="info-label total-label">Tổng cộng đã thanh toán:</span>
              <span class="info-value total-value">${formattedAmount}</span>
            </div>
          </div>
        </div>

        <!-- Tour details -->
        <div class="card">
          <h3 class="card-title">Chi tiết chuyến đi</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Tên Tour:</span>
              <span class="info-value">${tourTitle}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Điểm đến:</span>
              <span class="info-value">📍 ${tourLocation}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Ngày khởi hành:</span>
              <span class="info-value">📅 ${tourDateStr}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Số lượng khách:</span>
              <span class="info-value">👥 ${booking.numberOfGuests} người</span>
            </div>
          </div>
        </div>

        <div class="note-box">
          <strong>Lưu ý quan trọng:</strong> Vui lòng xuất trình email này (hoặc ảnh chụp màn hình có mã hóa đơn) cho Hướng dẫn viên tại điểm khởi hành để được check-in và tham gia tour.
        </div>

        <div class="btn-container">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile" class="btn">Xem Lịch Sử Đặt Tour</a>
        </div>

        <!-- Simulated Barcode -->
        <div class="barcode-container">
          <div>
            <span class="barcode-line" style="width: 2px;"></span>
            <span class="barcode-line" style="width: 1px;"></span>
            <span class="barcode-line" style="width: 3px;"></span>
            <span class="barcode-line" style="width: 1px;"></span>
            <span class="barcode-line" style="width: 2px;"></span>
            <span class="barcode-line" style="width: 4px;"></span>
            <span class="barcode-line" style="width: 1px;"></span>
            <span class="barcode-line" style="width: 2px;"></span>
            <span class="barcode-line" style="width: 3px;"></span>
            <span class="barcode-line" style="width: 1px;"></span>
            <span class="barcode-line" style="width: 2px;"></span>
            <span class="barcode-line" style="width: 1px;"></span>
            <span class="barcode-line" style="width: 4px;"></span>
            <span class="barcode-line" style="width: 2px;"></span>
            <span class="barcode-line" style="width: 1px;"></span>
            <span class="barcode-line" style="width: 3px;"></span>
          </div>
          <div class="barcode-text">VT-TICKET-${booking.documentId ? booking.documentId.slice(0, 8).toUpperCase() : '00000000'}</div>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>Công ty TNHH Lữ hành VietTour Việt Nam</strong></p>
        <p>Địa chỉ: 123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
        <p>Hotline: 1900 6789 | Email: <a href="mailto:support@viettour.vn">support@viettour.vn</a></p>
      </div>
    </div>
  </div>
</body>
</html>
        `;

        await strapi.plugin('email').service('email').send({
          to: booking.email,
          subject: `[VietTour] Xác nhận đặt tour #${booking.id} thành công`,
          html: htmlContent,
        });

        strapi.log.info(`[Email Automation] Confirmation email sent successfully to ${booking.email} for booking #${booking.id}`);
      } catch (err: any) {
        strapi.log.error(`[Email Automation] Error in lifecycle afterUpdate for booking: ${err.message}`);
      }
    }
  },
};
