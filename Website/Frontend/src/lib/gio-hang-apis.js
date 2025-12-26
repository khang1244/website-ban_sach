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
    return await response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nguoiDungID,
        sachID,
        soLuong,
        giaLucThem,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Lỗi mạng khi thêm sản phẩm vào giỏ hàng:", error);
    throw error;
  }
};

// 3. Cập nhật số lượng sản phẩm trong giỏ hàng
export const capNhatSoLuongSanPham = async (gioHangID, sachID, soLuong) => {
  try {
    const response = await fetch(
      `${BASE_URL}/gioHang/${gioHangID}/sach/${sachID}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soLuong }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Lỗi mạng khi cập nhật số lượng sản phẩm:", error);
    throw error;
  }
};

// 4. Xóa sản phẩm khỏi giỏ hàng
export const xoaSanPhamKhoiGioHang = async (gioHangID, sachID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/gioHang/${gioHangID}/sach/${sachID}`,
      {
        method: "DELETE",
      }
    );
    return await response.json();
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
    return await response.json();
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
    return await response.json();
  } catch (error) {
    console.error("Lỗi mạng khi đếm số lượng sản phẩm:", error);
    throw error;
  }
};

//7. HELPER – TÍNH TỔNG TIỀN GIỎ HÀNG
export const tinhTongTienGioHang = (chiTietGioHangs) => {
  if (!Array.isArray(chiTietGioHangs)) return 0;
  return chiTietGioHangs.reduce(
    (total, item) => total + (item.tongGia || 0),
    0
  );
};

//8. HELPER – TÍNH TỔNG SỐ LƯỢNG SẢN PHẨM
export const tinhTongSoLuongSanPham = (chiTietGioHangs) => {
  if (!Array.isArray(chiTietGioHangs)) return 0;
  return chiTietGioHangs.reduce(
    (total, item) => total + (item.soLuong || 0),
    0
  );
};

//9. HELPER – KIỂM TRA SÁCH CÓ TRONG GIỎ KHÔNG
export const kiemTraSanPhamTrongGioHang = (chiTietGioHangs, sachID) => {
  if (!Array.isArray(chiTietGioHangs)) return false;
  return chiTietGioHangs.some((item) => String(item.sachID) === String(sachID));
};

/* =====================================================
   10. HELPER – LẤY CHI TIẾT SẢN PHẨM TRONG GIỎ
===================================================== */
export const layChiTietSanPhamTrongGioHang = (chiTietGioHangs, sachID) => {
  if (!Array.isArray(chiTietGioHangs)) return null;
  return (
    chiTietGioHangs.find((item) => String(item.sachID) === String(sachID)) ||
    null
  );
};
