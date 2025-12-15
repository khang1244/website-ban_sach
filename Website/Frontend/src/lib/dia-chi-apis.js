import { BASE_URL } from "./baseUrl.js";
import { xaPhuong } from "./du-Lieu-XaPhuong.js";
// Lấy danh sách địa chỉ của một người dùng
// Tham số: khachHangID (số) => trả về mảng địa chỉ hoặc mảng rỗng
export const layDiaChiTheoKhachHang = async (khachHangID) => {
  try {
    const phanHoi = await fetch(
      `${BASE_URL}/diaChi/khachHangID/${khachHangID}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const duLieu = await phanHoi.json();
    if (phanHoi.ok) return duLieu.addresses || [];
    return [];
  } catch (err) {
    console.error("Lỗi khi lấy địa chỉ:", err);
    return [];
  }
};

// Tạo địa chỉ mới cho người dùng
// Tham số: duLieuDiaChi = { khachHangID, diaChi, isDefault }
export const taoDiaChi = async (duLieuDiaChi) => {
  try {
    const phanHoi = await fetch(`${BASE_URL}/diaChi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(duLieuDiaChi),
    });
    return await phanHoi.json();
  } catch (err) {
    console.error("Lỗi khi tạo địa chỉ:", err);
    throw err;
  }
};
// Xóa địa chỉ theo ID
export const xoaDiaChi = async (diaChiID) => {
  try {
    const phanHoi = await fetch(`${BASE_URL}/diaChi/${diaChiID}`, {
      method: "DELETE",
    });
    return await phanHoi.json();
  } catch (err) {
    console.error("Lỗi khi xóa địa chỉ:", err);
    throw err;
  }
};

// Đặt địa chỉ mặc định
export const datMacDinhDiaChi = async (diaChiID) => {
  try {
    const phanHoi = await fetch(`${BASE_URL}/diaChi/${diaChiID}/macDinh`, {
      method: "PUT",
    });
    return await phanHoi.json();
  } catch (err) {
    console.error("Lỗi khi đặt mặc định:", err);
    throw err;
  }
};

//  Lấy danh sách xã/phường dựa trên mã tỉnh/thành (dữ liệu tĩnh frontend)
//  Trả về mảng các đối tượng xã/phường tương ứng
export const nhanDanhSachXaPhuong = (maTinh) => {
  const danhSachXaPhuong = xaPhuong.filter(
    (item) => item.province_code === parseInt(maTinh)
  );
  return danhSachXaPhuong;
};
