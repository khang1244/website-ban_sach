// 1. Tạo hàm đăng ký
import { BASE_URL } from "./baseUrl.js";

// 1. Nhận tất cả danh mục sách
export const layTatCaNguoiDung = async () => {
  try {
    const response = await fetch(`${BASE_URL}/nguoiDung`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Kiểm tra và trả về đúng mảng người dùng
    if (data && Array.isArray(data.users)) {
      return data.users;
    }

    console.error("API không trả về mảng users:", data);
    return []; // Trả về mảng rỗng để tránh lỗi .filter
  } catch (error) {
    console.error("Lỗi mạng:", error);
    return [];
  }
};

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
// 4. Tạo hàm để cập nhật mật khẩu người dùng
export const yeuCauNhanOTPCapNhatMatKhau = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/nguoiDung/nhan-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { status: response.ok, message: data.message };
    } else {
      return { status: response.ok, message: data.message };
    }
  } catch (error) {
    console.error("Lỗi khi yêu cầu nhận OTP cập nhật mật khẩu:", error);
    throw error;
  }
};
// 5. Tạo hàm để kiểm tra mã OTP
export const kiemTraMaOTP = async (email, maOTP) => {
  try {
    const response = await fetch(`${BASE_URL}/nguoiDung/kiem-tra-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp: maOTP }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { status: response.ok, message: data.message, userID: null };
    } else {
      return {
        status: response.ok,
        message: data.message,
        userID: data.userID,
      };
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra mã OTP:", error);
    throw error;
  }
};
// 6. Tạo hàm để đặt lại mật khẩu
export const datLaiMatKhau = async (userID, matKhauMoi) => {
  try {
    const response = await fetch(
      `${BASE_URL}/nguoiDung/cap-nhat-mat-khau/${userID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matKhauMoi }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return { status: response.ok, message: data.message };
    } else {
      return { status: response.ok, message: data.message };
    }
  } catch (error) {
    console.error("Lỗi khi đặt lại mật khẩu:", error);
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
// 4. Xóa danh mục sách
export const xoaNguoiDungTheoID = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/nguoiDung/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Một số API trả về object JSON, một số có thể trả về text.
    let data = null;
    try {
      data = await response.json();
    } catch {
      // nếu không phải JSON, đọc text thay thế
      data = { message: await response.text() };
    }

    return { ok: response.ok, data };
  } catch (error) {
    console.error("Lỗi mạng:", error);
    return { ok: false, data: { message: error.message } };
  }
};
// Thay đổi trạng thái tài khoản (khóa / mở khóa)
export const thayDoiTrangThaiNguoiDung = async (nguoiDungID, trangThai) => {
  try {
    const response = await fetch(
      `${BASE_URL}/nguoiDung/thay-doi-trang-thai/${nguoiDungID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trangThai }),
      }
    );

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = { message: await response.text() };
    }

    return { ok: response.ok, data };
  } catch (error) {
    console.error("Lỗi mạng khi thay đổi trạng thái:", error);
    return { ok: false, data: { message: error.message } };
  }
};
