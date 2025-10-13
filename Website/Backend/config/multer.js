// Giúp xử lý hình ảnh gửi lên từ client và lưu trữ tạm thời trên RAM
import multer from "multer";

// Cấu hình multer để lưu trữ tạm thời trên RAM
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
export default upload;
