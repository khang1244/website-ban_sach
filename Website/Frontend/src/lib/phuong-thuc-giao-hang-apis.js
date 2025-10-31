import { BASE_URL } from "./baseUrl";

// 1. Lấy tất cả phương thức giao hàng
export const layTatCaPhuongThucGiaoHang = async () => {
  try {
    const response = await fetch(`${BASE_URL}/phuongThucGiaoHang`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phương thức giao hàng:", error);
    throw error;
  }
};

// 2. Tạo phương thức giao hàng mới
export const taoPhuongThucGiaoHang = async (phuongThucGiaoHang) => {
  try {
    const response = await fetch(`${BASE_URL}/phuongThucGiaoHang`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(phuongThucGiaoHang),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi tạo phương thức giao hàng:", error);
    throw error;
  }
};

// 3. Cập nhật phương thức giao hàng
export const capNhatPhuongThucGiaoHang = async (id, phuongThucGiaoHang) => {
  try {
    const response = await fetch(`${BASE_URL}/phuongThucGiaoHang/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(phuongThucGiaoHang),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi cập nhật phương thức giao hàng:", error);
    throw error;
  }
};

// 4. Xóa phương thức giao hàng (soft delete)
export const xoaPhuongThucGiaoHang = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/phuongThucGiaoHang/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi xóa phương thức giao hàng:", error);
    throw error;
  }
};

// 5. Xóa vĩnh viễn phương thức giao hàng (hard delete)
export const xoaVinhVienPhuongThucGiaoHang = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/phuongThucGiaoHang/vinh-vien/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi xóa vĩnh viễn phương thức giao hàng:", error);
    throw error;
  }
};

// 6. Kích hoạt lại phương thức giao hàng
export const kichHoatPhuongThucGiaoHang = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/phuongThucGiaoHang/kich-hoat/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi kích hoạt phương thức giao hàng:", error);
    throw error;
  }
};
