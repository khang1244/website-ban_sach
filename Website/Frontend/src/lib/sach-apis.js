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
