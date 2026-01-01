import { BASE_URL } from "./baseUrl";

// Hàm để tải lên hình ảnh
export const uploadHinhAnh = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const response = await fetch(`${BASE_URL}/hinhAnh/taianhlen`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Lỗi khi tải lên hình ảnh:", error);
    throw error;
  }
};
// Hàm để xóa hình ảnh khỏi Cloudinary
export const xoaHinhAnhKhoiS3 = async (publicId) => {
  try {
    const response = await fetch(`${BASE_URL}/hinhAnh/xoaanh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_id: publicId }),
    });
    const data = await response.json();
    return data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Lỗi khi xóa hình ảnh:", error);
    throw error;
  }
};
