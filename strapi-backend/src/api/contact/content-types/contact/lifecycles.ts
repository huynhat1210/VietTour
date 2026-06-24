export default {
  async afterCreate(event: any) {
    const { result } = event;
    try {
      await strapi.plugin('email').service('email').send({
        to: 'lenhathuy494@gmail.com',
        from: 'lenhathuy494@gmail.com', // fallback from address matching defaultFrom
        subject: `Yêu cầu liên hệ mới: ${result.subject}`,
        text: `Bạn nhận được yêu cầu liên hệ mới từ Website VietTour:\n\nHọ và tên: ${result.fullName}\nEmail: ${result.email}\nTiêu đề: ${result.subject}\nNội dung:\n${result.message}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
            <h2 style="color: #059669; margin-top: 0;">Yêu cầu liên hệ mới từ Website VietTour</h2>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p><strong>Họ và tên:</strong> ${result.fullName}</p>
            <p><strong>Email khách hàng:</strong> <a href="mailto:${result.email}">${result.email}</a></p>
            <p><strong>Tiêu đề:</strong> ${result.subject}</p>
            <p><strong>Nội dung:</strong></p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; white-space: pre-wrap;">${result.message}</div>
          </div>
        `,
      });
      console.log('Successfully sent contact notification email to lenhathuy494@gmail.com');
    } catch (error) {
      console.error('Failed to send contact notification email:', error);
    }
  },
};
