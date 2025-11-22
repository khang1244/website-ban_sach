import { BASE_URL } from "./baseUrl";

// Lấy tất cả giao dịch kho
export const layTatCaGiaoDichKho = async () => {
  try {
    const response = await fetch(`${BASE_URL}/giaoDichKho`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy giao dịch kho:", error);
  }
};

// Tạo giao dịch kho mới
export const taoGiaoDichKho = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/giaoDichKho`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi tạo giao dịch kho:", error);
  }
};

// Lấy lịch sử giao dịch theo sachID (phân trang)
export const layGiaoDichTheoSach = async (sachID, page = 1, limit = 20) => {
  try {
    const qs = new URLSearchParams({
      sachID: String(sachID),
      page: String(page),
      limit: String(limit),
    });
    const response = await fetch(`${BASE_URL}/giaoDichKho?${qs.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử giao dịch theo sách:", error);
  }
};
