import NguoiDung from "../models/NguoiDung.js";
import bcrypt from "bcryptjs"; // Thư viện để mã hóa mật khẩu

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
