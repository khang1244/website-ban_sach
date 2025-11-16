import { BASE_URL } from "./baseUrl";

// 1. Tạo bình luận mới
export const taoBinhLuanMoi = async (binhLuanData) => {
  try {
    const response = await fetch(`${BASE_URL}/binhLuan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(binhLuanData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      message: "Tạo bình luận thành công",
    };
  } catch (error) {
    console.error("Lỗi khi tạo bình luận mới:", error);
    return {
      success: false,
      message: "Không thể tạo bình luận mới",
      error: error.message,
    };
  }
};
