import { BASE_URL } from "./baseUrl";

export const nhanTatCaKhuyenMai = async () => {
  try {
    const response = await fetch(`${BASE_URL}/khuyenMai`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi nhận tất cả khuyến mãi:", error);
    throw error;
  }
};

// 2. Tạo khuyến mãi mới
export const taoKhuyenMai = async (khuyenMai) => {
  try {
    const response = await fetch(`${BASE_URL}/khuyenMai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(khuyenMai),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi tạo khuyến mãi:", error);
    throw error;
  }
};

// 3. Cập nhật khuyến mãi
export const capNhatKhuyenMai = async (khuyenMaiID, khuyenMai) => {
  try {
    const response = await fetch(`${BASE_URL}/khuyenMai/${khuyenMaiID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(khuyenMai),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi cập nhật khuyến mãi:", error);
    throw error;
  }
};

// 4. Xóa khuyến mãi
export const xoaKhuyenMai = async (khuyenMaiID) => {
  try {
    const response = await fetch(`${BASE_URL}/khuyenMai/${khuyenMaiID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi xóa khuyến mãi:", error);
    throw error;
  }
};
// 5. Lấy khuyến mãi theo ID
export const nhanMaKhuyenMaiTheoID = async (khuyenMaiID) => {
  try {
    const response = await fetch(`${BASE_URL}/khuyenMai/${khuyenMaiID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi nhận khuyến mãi theo ID:", error);
    throw error;
  }
};
