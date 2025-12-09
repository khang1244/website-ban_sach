import { BASE_URL } from "./baseUrl.js";

// Lấy tất cả phiếu nhập
export const layTatCaPhieuNhap = async () => {
  try {
    const response = await fetch(`${BASE_URL}/phieunhap`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Lỗi khi lấy danh sách phiếu nhập");
    return await response.json();
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};

// Lấy phiếu nhập theo ID
export const layPhieuNhapTheoID = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/phieunhap/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Lỗi khi lấy phiếu nhập");
    return await response.json();
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};

// Tạo phiếu nhập mới
export const taoPhieuNhap = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/phieunhap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi tạo phiếu nhập");
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};
// Lấy tồn kho hiện tại
export const layTonKho = async () => {
  try {
    const response = await fetch(`${BASE_URL}/phieunhap/ton-kho`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Lỗi khi lấy tồn kho");
    return await response.json();
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};
// Lấy tồn kho của 1 sách cụ thể
export const layTonKhoTheoSach = async (sachID) => {
  try {
    const response = await fetch(`${BASE_URL}/phieunhap/ton-kho/${sachID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Lỗi khi lấy tồn kho sách");
    return await response.json();
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};
