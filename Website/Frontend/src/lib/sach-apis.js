// Tạo các lời gọi API liên quan đến sách

import { BASE_URL } from "./baseUrl";

// 1. Thêm 1 quyển sách mới vào cơ sở dữ liệu
export const themSach = async (sach) => {
  try {
    const response = await fetch(`${BASE_URL}/sach`, {
      // axios
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sach),
    });
    const data = await response.json();
    console.log("Dữ liệu trả về từ sever:", data);
    return data;
  } catch (error) {
    console.error("Error adding book:", error);
  }
};
// 2. Cập nhật thông tin của 1 quyển sách
export const capNhatSach = async (sachId, sach) => {
  try {
    const response = await fetch(`${BASE_URL}/sach/${sachId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sach),
    });
    const data = await response.json();
    console.log("Dữ liệu trả về từ sever:", data);
    return data;
  } catch (error) {
    console.error("Error updating book:", error);
  }
};
// 3. Nhận tất cả các quyển sách từ cơ sở dữ liệu
export const nhanTatCaCacQuyenSach = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sach`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Dữ liệu trả về từ sever:", data);

    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

// 4. Hàm để xóa một quyển sách dựa trên ID
export const xoaSach = async (sachId) => {
  try {
    const response = await fetch(`${BASE_URL}/sach/${sachId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Dữ liệu trả về từ sever:", data);
    return data;
  } catch (error) {
    console.error("Error deleting book:", error);
  }
};
// 5. Lấy chi tiết một quyển sách dựa trên ID của quyển sách
export const layChiTietSach = async (sachID) => {
  try {
    const response = await fetch(`${BASE_URL}/sach/${sachID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Dữ liệu trả về từ sever:", data);
    return data;
  } catch (error) {
    console.error("Error fetching book details:", error);
  }
};

// 6. Cập nhật trạng thái bán (đang bán / ngừng bán)
export const capNhatTrangThaiBanSach = async (sachId, trangThaiBan) => {
  try {
    const response = await fetch(`${BASE_URL}/sach/${sachId}/trang-thai-ban`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trangThaiBan }),
    });
    const data = await response.json();
    console.log("Cập nhật trạng thái bán:", data);
    return data;
  } catch (error) {
    console.error("Error updating sale status:", error);
  }
};

// 6. Gọi API tăng lượt xem (POST) — frontend gọi có kiểm soát (localStorage)
export const tangLuotXem = async (sachID) => {
  try {
    const response = await fetch(`${BASE_URL}/sach/${sachID}/luot-view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("tangLuotXem response:", data);
    return data;
  } catch (error) {
    console.error("Error incrementing view:", error);
  }
};
