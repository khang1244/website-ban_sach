import { BASE_URL } from "./baseUrl";

// 1. Lấy thông tin giỏ hàng theo người dùng
export const layGioHangTheoNguoiDung = async (nguoiDungID) => {
  try {
    const response = await fetch(`${BASE_URL}/gioHang/${nguoiDungID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi mạng khi lấy giỏ hàng:", error);
    throw error;
  }
};

// 2. Thêm sản phẩm vào giỏ hàng
export const themSanPhamVaoGioHang = async (
  nguoiDungID,
  sachID,
  soLuong,
  giaLucThem
) => {
  try {
    const response = await fetch(`${BASE_URL}/gioHang`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nguoiDungID,
        sachID,
        soLuong,
        giaLucThem,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi mạng khi thêm sản phẩm vào giỏ hàng:", error);
    throw error;
  }
};

// 3. Cập nhật số lượng sản phẩm trong giỏ hàng
export const capNhatSoLuongSanPham = async (chiTietGioHangID, soLuong) => {
  try {
    const response = await fetch(`${BASE_URL}/gioHang/${chiTietGioHangID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ soLuong }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi mạng khi cập nhật số lượng sản phẩm:", error);
    throw error;
  }
};

// 4. Xóa sản phẩm khỏi giỏ hàng
export const xoaSanPhamKhoiGioHang = async (chiTietGioHangID) => {
  try {
    const response = await fetch(`${BASE_URL}/gioHang/${chiTietGioHangID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi mạng khi xóa sản phẩm khỏi giỏ hàng:", error);
    throw error;
  }
};

// 5. Xóa toàn bộ giỏ hàng
export const xoaToanBoGioHang = async (nguoiDungID) => {
  try {
    const response = await fetch(`${BASE_URL}/gioHang/toan-bo/${nguoiDungID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi mạng khi xóa toàn bộ giỏ hàng:", error);
    throw error;
  }
};

// 6. Đếm số lượng sản phẩm trong giỏ hàng
export const demSoLuongSanPhamTrongGioHang = async (nguoiDungID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/gioHang/dem-so-luong/${nguoiDungID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi mạng khi đếm số lượng sản phẩm:", error);
    throw error;
  }
};

// 7. Helper function - Tính tổng tiền giỏ hàng (từ dữ liệu frontend)
export const tinhTongTienGioHang = (chiTietGioHangs) => {
  if (!chiTietGioHangs || !Array.isArray(chiTietGioHangs)) {
    return 0;
  }
  return chiTietGioHangs.reduce((total, item) => {
    return total + (item.tongGia || 0);
  }, 0);
};

// 8. Helper function - Tính tổng số lượng sản phẩm (từ dữ liệu frontend)
export const tinhTongSoLuongSanPham = (chiTietGioHangs) => {
  if (!chiTietGioHangs || !Array.isArray(chiTietGioHangs)) {
    return 0;
  }
  return chiTietGioHangs.reduce((total, item) => {
    return total + (item.soLuong || 0);
  }, 0);
};

// 9. Helper function - Kiểm tra sản phẩm có trong giỏ hàng không
export const kiemTraSanPhamTrongGioHang = (chiTietGioHangs, sachID) => {
  if (!chiTietGioHangs || !Array.isArray(chiTietGioHangs)) {
    return false;
  }
  return chiTietGioHangs.some((item) => item.sachID === sachID);
};

// 10. Helper function - Lấy thông tin chi tiết sản phẩm trong giỏ hàng
export const layChiTietSanPhamTrongGioHang = (chiTietGioHangs, sachID) => {
  if (!chiTietGioHangs || !Array.isArray(chiTietGioHangs)) {
    return null;
  }
  return chiTietGioHangs.find((item) => item.sachID === sachID) || null;
};
