import NguoiDung from "../models/NguoiDung.js";
import bcrypt from "bcryptjs"; // Thư viện để mã hóa mật khẩu
import { sendEmail } from "../utils/sendEmail.js";

// Hàm để đăng ký người dùng mới
export const dangKy = async (req, res) => {
  const { tenNguoiDung, email, matKhau, soDienThoai } = req.body; // Lấy thông tin từ body của request
  try {
    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await NguoiDung.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(matKhau, 10); // Sử dụng bcrypt để mã hóa mật khẩu
    // Tạo người dùng mới trong cơ sở dữ liệu
    const newUser = await NguoiDung.create({
      tenNguoiDung,
      email,
      matKhau: hashedPassword, // Lưu mật khẩu đã mã hóa
      soDienThoai,
    });
    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (error) {
    console.error("Lỗi khi đăng ký người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Hàm để thực hiện đăng nhập với người dùng đã có tài khoản
export const dangNhap = async (req, res) => {
  const { email, matKhau } = req.body; // Lấy thông tin từ body của request
  try {
    // Tìm người dùng trong cơ sở dữ liệu theo email
    const user = await NguoiDung.findOne({ where: { email } });
    // User tồn tại => { tenNguoiDung: ...,...}
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // So sánh mật khẩu đã mã hóa với mật khẩu người dùng nhập vào
    const isPasswordValid = await bcrypt.compare(matKhau, user.matKhau);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }
    // Đăng nhập thành công
    res.status(200).json({ message: "Đăng nhập thành công", user });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Hàm để thay đổi trạng thái tài khoản người dùng (active/inactive)
export const thayDoiTrangThaiTaiKhoan = async (req, res) => {
  const { nguoiDungID } = req.params;
  const { trangThai } = req.body; // trạng thái mới

  try {
    // Tìm người dùng theo ID
    const user = await NguoiDung.findByPk(nguoiDungID);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Cập nhật trạng thái người dùng
    user.trangThaiTaiKhoan = trangThai;
    await user.save();

    res
      .status(200)
      .json({ message: "Thay đổi trạng thái tài khoản thành công", user });
  } catch (error) {
    console.error("Lỗi khi thay đổi trạng thái tài khoản:", error);
    res
      .status(500)
      .json({ message: "Lỗi xảy ra khi cập nhật trạng thái tài khoản" });
  }
};

// Hàm để lấy thông tin người dùng theo ID
export const layThongTinNguoiDung = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm người dùng theo ID
    const user = await NguoiDung.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res
      .status(200)
      .json({ message: "Lấy thông tin người dùng thành công", user });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Hàm để cập nhật thông tin người dùng
export const capNhatThongTinNguoiDung = async (req, res) => {
  const { id } = req.params;
  const { tenNguoiDung, email, soDienThoai, avatar, diaChi } = req.body; // Thông tin mới cần cập nhật

  try {
    // Tìm người dùng theo ID
    const user = await NguoiDung.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Cập nhật thông tin người dùng
    user.tenNguoiDung = tenNguoiDung;
    user.email = email;
    user.soDienThoai = soDienThoai;
    user.avatar = avatar;
    user.diaChi = diaChi;
    await user.save();

    res
      .status(200)
      .json({ message: "Cập nhật thông tin người dùng thành công", user });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Hàm để cập nhật mật khẩu người dùng
export const capNhatMatKhau = async (req, res) => {
  const { id } = req.params;
  const { matKhauMoi } = req.body; // Mật khẩu mới
  try {
    // Tìm người dùng theo ID
    const user = await NguoiDung.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Mã hóa mật khẩu mới trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(matKhauMoi, 10); // Sử dụng bcrypt để mã hóa mật khẩu
    user.matKhau = hashedPassword; // Cập nhật mật khẩu đã mã hóa
    await user.save();
    res.status(200).json({ message: "Cập nhật mật khẩu thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật mật khẩu:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Hàm để xóa tài khoản người dùng
export const xoaTaiKhoanNguoiDung = async (req, res) => {
  const { id } = req.params;
  try {
    // Tìm người dùng theo ID
    const user = await NguoiDung.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Xóa người dùng
    await user.destroy();
    res.status(200).json({ message: "Xóa tài khoản người dùng thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa tài khoản người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Kiểm tra email đã tồn tại trong cơ sở dữ liệu
export const kiemTraEmailTonTai = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await NguoiDung.findOne({ where: { email } });
    if (user) {
      console.log("Email đã tồn tại:", email); // Debugging line
      return res.status(400).json({ message: "Email này đã được đăng ký!" });
    }
    console.log("Email hợp lệ:", email); // Debugging line
    return res.status(200).json({ message: "Email hợp lệ" });
  } catch (error) {
    console.error("Lỗi khi kiểm tra email:", error);
    return res.status(500).json({ message: "Lỗi máy chủ khi kiểm tra email." });
  }
};
// Hàm để xử lý đăng nhập bằng Google
export const dangNhapGoogle = async (req, res) => {
  const { tenNguoiDung, email, avatar, googleId } = req.body;
  try {
    // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
    let user = await NguoiDung.findOne({ where: { email } });

    if (user) {
      // Nếu người dùng đã tồn tại, cập nhật thông tin Google ID (nếu chưa có)
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Nếu người dùng chưa tồn tại, tạo người dùng mới
      // Mật khẩu cho người dùng Google sẽ là random vì họ không cần mật khẩu
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await NguoiDung.create({
        tenNguoiDung,
        email,
        matKhau: hashedPassword,
        avatar: JSON.stringify({ url: avatar, public_id: null }),
        googleId: googleId,
        trangThaiTaiKhoan: true, // true = active, false = inactive
      });
    }

    res.status(200).json({
      message: "Đăng nhập Google thành công",
      user: {
        nguoiDungID: user.nguoiDungID,
        tenNguoiDung: user.tenNguoiDung,
        email: user.email,
        avatar: user.avatar,
        googleId: user.googleId,
        vaiTro: user.vaiTro,
        trangThaiTaiKhoan: user.trangThaiTaiKhoan,
      },
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập Google:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
// Hàm để nhận một email từ frontend và gửi mã OTP đến email đó
export const yeuCauNhanOTPCapNhatMatKhau = async (req, res) => {
  const { email } = req.body;
  try {
    // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
    const user = await NguoiDung.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    // Tạo mã OTP ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu mã OTP vào cơ sở dữ liệu (có thể là một bảng riêng hoặc trường trong bảng người dùng)
    user.maOTP = otp;

    // Thiết lập thời gian hết hạn cho mã OTP (ví dụ: 15 phút từ bây giờ)
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 phút từ bây giờ
    // Lưu thời gian hết hạn vào cơ sở dữ liệu
    user.otpExpiry = otpExpiry;

    await user.save();

    // Gửi email chứa mã OTP đến người dùng
    await sendEmail({
      to: user.email,
      subject: "Mã xác thực quên mật khẩu",
      text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 15 phút.`,
      html: `
          <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f3f4f6; padding: 24px;">
            <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 28px 24px; box-shadow: 0 10px 30px rgba(15,23,42,0.08);">
              
              <div style="text-align: center; margin-bottom: 16px;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 999px; background: linear-gradient(135deg,#4f46e5,#6366f1); color: #ffffff; font-weight: 600;">
                  OTP
                </div>
              </div>

              <h1 style="margin: 0 0 8px 0; font-size: 20px; text-align: center; color: #111827;">
                Mã xác thực quên mật khẩu
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 13px; text-align: center; color: #6b7280;">
                Vui lòng sử dụng mã OTP bên dưới để xác thực yêu cầu đặt lại mật khẩu.
              </p>

              <div style="text-align: center; margin-bottom: 20px;">
                <div style="
                  display: inline-block;
                  padding: 14px 28px;
                  border-radius: 12px;
                  background: #111827;
                  color: #f9fafb;
                  font-size: 26px;
                  letter-spacing: 6px;
                  font-weight: 700;
                ">
                  ${otp}
                </div>
              </div>

              <p style="font-size: 13px; color: #374151; line-height: 1.6; margin: 0 0 12px 0;">
                ⏰ <strong>Thời hạn hiệu lực:</strong> Mã OTP này chỉ có hiệu lực trong <strong>5 phút</strong> 
                kể từ thời điểm email được gửi. Sau thời gian này, bạn cần yêu cầu mã mới.
              </p>

              <p style="font-size: 13px; color: #4b5563; line-height: 1.6; margin: 0 0 16px 0;">
                🔒 <strong>Lưu ý bảo mật:</strong> Không chia sẻ mã OTP với bất kỳ ai, kể cả người tự xưng là nhân viên hỗ trợ.
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />

              <p style="font-size: 11px; color: #9ca3af; margin: 0;">
                Nếu bạn không thực hiện yêu cầu quên mật khẩu, bạn có thể bỏ qua email này.
                <br/>
                Email được gửi tự động từ hệ thống Bookstore. Vui lòng không trả lời email này.
              </p>
            </div>
          </div>
          `,
    });
    res.status(200).json({ message: "Gửi mã OTP thành công" });
  } catch (error) {
    console.error("Lỗi khi gửi mã OTP:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Hàm để kiểm tra mã OTP người dùng nhập vào có đúng không để cho phép họ đặt lại mật khẩu

export const kiemTraMaOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    // Tìm người dùng theo email
    const user = await NguoiDung.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }
    // Kiểm tra mã OTP và thời gian hết hạn
    if (user.maOTP !== otp || new Date() > user.otpExpiry) {
      return res
        .status(400)
        .json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
    }
    // Mã OTP hợp lệ, cho phép người dùng đặt lại mật khẩu
    // Xóa mã OTP và thời gian hết hạn sau khi xác thực thành công
    user.maOTP = null;
    user.otpExpiry = null;
    await user.save();
    return res
      .status(200)
      .json({ message: "Mã OTP hợp lệ", userID: user.nguoiDungID });
  } catch (error) {
    console.error("Lỗi khi kiểm tra mã OTP:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
