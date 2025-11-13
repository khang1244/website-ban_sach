import { createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Tạo transporter cho việc gửi email
const transporter = createTransport({
  service: "gmail", // Hoặc sử dụng SMTP khác như SendGrid, Outlook, v.v.
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn
    pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (App Password) hoặc mật khẩu email
  },
});

// Hàm gửi email
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Email người gửi
      to: options.to, // Email người nhận
      subject: options.subject, // Tiêu đề email
      text: options.text, // Nội dung email dạng text
      html: options.html, // Nội dung email dạng HTML (tùy chọn)
    };

    // Gửi email
    const result = await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi thành công:", result.messageId);
    return result;
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    throw new Error("Không thể gửi email");
  }
};

// Hàm kiểm tra kết nối email
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Kết nối email thành công");
    return true;
  } catch (error) {
    console.error("Lỗi kết nối email:", error);
    return false;
  }
};

export default { sendEmail, verifyEmailConnection };
