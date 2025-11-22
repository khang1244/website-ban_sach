// Hàm để nhận các thông tin thống kê từ server
import { BASE_URL } from "./baseUrl";

export const layThongKe = async () => {
  try {
    const response = await fetch(`${BASE_URL}/thong-ke/tongquan`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thống kê:", error);
    return {
      success: false,
      message: "Không thể tải thông tin thống kê",
      error: error.message,
    };
  }
};
