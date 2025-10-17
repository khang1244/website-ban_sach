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
