import { BASE_URL } from "./baseUrl";

// 1. Nhận tất cả danh mục sách
export const nhanTatCaDanhMucSach = async () => {
  try {
    const response = await fetch(`${BASE_URL}/danhMucSach`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi mạng:", error);
    throw error;
  }
};

// 2. Tạo danh mục sách mới
export const taoDanhMucSachMoi = async (danhMucSach) => {
  try {
    const response = await fetch(`${BASE_URL}/danhMucSach`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tenDanhMuc: danhMucSach }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi mạng:", error);
    throw error;
  }
};

// 3. Cập nhật danh mục sách
export const capNhatDanhMucSach = async (danhMucSachID, tenDanhMuc) => {
  try {
    const response = await fetch(`${BASE_URL}/danhMucSach/${danhMucSachID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tenDanhMuc), // {tenDanhMuc: "Sách mới"}
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi mạng:", error);
    throw error;
  }
};

// 4. Xóa danh mục sách
export const xoaDanhMucSach = async (danhMucSachID) => {
  try {
    const response = await fetch(`${BASE_URL}/danhMucSach/${danhMucSachID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi mạng:", error);
    throw error;
  }
};
