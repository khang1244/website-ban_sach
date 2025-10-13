import cloudinary from "../config/cloudinary_config.js";

// Tạo hàm để upload hình ảnh lên Cloudinary và nhận về url và public_id
const taiAnhLenCloud = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    // Giúp tránh callback hell và tạo ra hàm bất đồng bộ
    cloudinary.uploader
      .upload_stream({ folder: folder }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log("Upload result:", result);

          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      })
      .end(fileBuffer);
  });
};

// Xóa hình ảnh khỏi Cloudinary dựa trên public_id
const xoaAnhKhoiCloud = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    throw error;
  }
};

// Hàm controller để xử lý upload hình ảnh
export const xuLyTaiAnhLenCloud = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer; // Lấy buffer từ tệp tin
    const folder = "Cloudinary_Lê Hoàng Khang_CK23V7K512"; // Thư mục trên Cloudinary để lưu trữ hình ảnh
    const uploadResult = await taiAnhLenCloud(fileBuffer, folder);
    res.status(200).json(uploadResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm controller để xử lý xóa hình ảnh
export const xuLyXoaAnhKhoiCloud = async (req, res) => {
  try {
    const { public_id } = req.body;
    const deleteResult = await xoaAnhKhoiCloud(public_id);
    res.status(200).json(deleteResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
