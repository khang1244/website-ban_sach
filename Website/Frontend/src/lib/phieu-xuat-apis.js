import { BASE_URL } from "./baseUrl.js";

// Lấy tất cả phiếu xuất
export const layTatCaPhieuXuat = async () => {
  try {
    const response = await fetch(`${BASE_URL}/phieuxuat`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Lỗi khi lấy danh sách phiếu xuất");
    return await response.json();
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};

// Lấy phiếu xuất theo ID
export const layPhieuXuatTheoID = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/phieuxuat/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Lỗi khi lấy phiếu xuất");
    return await response.json();
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};

// Tạo phiếu xuất mới
export const taoPhieuXuat = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/phieuxuat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi tạo phiếu xuất");
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};
