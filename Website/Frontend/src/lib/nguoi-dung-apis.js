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

    if (!response.ok) {
      return { status: response.ok, message: data.message };
    } else {
      return { status: response.ok, message: data.message };
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
