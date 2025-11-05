// 1. Tạo hàm đăng ký
import { BASE_URL } from "./baseUrl.js";

// Hàm đăng ký tài khoản người dùng
export const dangKyTaiKhoan = async (nguoiDung) => {
  try {
    const response = await fetch(`${BASE_URL}/nguoiDung/dang-ky`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nguoiDung),
    });

    return await response.json();
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    throw error;
  }
};
// 2. Tạo hàm đăng nhập
export const dangNhapTaiKhoan = async (email, matKhau) => {
  try {
    const response = await fetch(`${BASE_URL}/nguoiDung/dang-nhap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, matKhau }),
    });
    const data = await response.json();
    // Trả về đối tượng với trạng thái và thông điệp
    if (!response.ok) {
      return { status: response.ok, message: data.message, user: null };
    } else {
      return { status: response.ok, message: data.message, user: data.user };
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    throw error;
  }
};

// 3. Tạo hàm kiểm tra email tồn tại
export const kiemTraEmailTonTai = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/nguoiDung/kiemTraEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return await response.json();
  } catch (error) {
    console.error("Lỗi khi kiểm tra email:", error);
    throw error;
  }
};
// 4. Tạo hàm để cập nhật thông tin người dùng
export const capNhatThongTinNguoiDung = async (nguoiDungID, thongTinMoi) => {
  try {
    const response = await fetch(`${BASE_URL}/nguoiDung/${nguoiDungID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(thongTinMoi),
    });
    const data = await response.json();
    if (!response.ok) {
      return { status: response.ok, message: data.message, userData: null };
    } else {
      return {
        status: response.ok,
        message: data.message,
        userData: data.user,
      };
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    throw error;
  }
};

// 5. Cập nhật mật khẩu người dùng
export const capNhatMatKhau = async (nguoiDungID, matKhauMoi) => {
  try {
    const response = await fetch(
      `${BASE_URL}/nguoiDung/cap-nhat-mat-khau/${nguoiDungID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matKhauMoi }),
      }
    );
    const data = await response.json();
    return { status: response.ok, message: data.message };
  } catch (error) {
    console.error("Lỗi khi cập nhật mật khẩu:", error);
    throw error;
  }
};
// Hàm đăng nhập bằng Google
export const dangNhapGoogle = async (googleUser) => {
  try {
    const response = await fetch(`${BASE_URL}/nguoiDung/dang-nhap-google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(googleUser),
    });
    const data = await response.json();

    if (!response.ok) {
      return { status: response.ok, message: data.message, user: null };
    } else {
      return { status: response.ok, message: data.message, user: data.user };
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập Google:", error);
    throw error;
  }
};
