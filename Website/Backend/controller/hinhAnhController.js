import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import s3 from "../config/s3_config.js";

// ================= UPLOAD ẢNH =================
export const xuLyTaiAnhLenCloud = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file upload" });
    }

    const fileBuffer = req.file.buffer; // Lấy buffer của file
    const originalName = req.file.originalname; // Lấy tên gốc của file
    const mimeType = req.file.mimetype; // Lấy kiểu MIME của file

    const bucket = process.env.VIETNIX_BUCKET_NAME; // Tên bucket S3
    const publicUrl = process.env.VIETNIX_PUBLIC_URL; // URL công khai của bucket S3

    const folder = "hinh-anh-sach"; // Thư mục lưu trữ trong bucket S3
    const fileExt = originalName.split(".").pop(); // Lấy phần mở rộng của file
    const objectKey = `${folder}/${uuidv4()}.${fileExt}`; // Tạo tên file duy nhất trong S3

    const uploadCommand = new PutObjectCommand({
      // Tạo lệnh upload
      Bucket: bucket,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: "public-read",
    });
    // Gửi lệnh upload lên S3
    await s3.send(uploadCommand);

    res.status(200).json({
      url: `${publicUrl}/${objectKey}`,
      public_id: objectKey,
    });
  } catch (error) {
    console.error("Upload S3 error:", error);
    res.status(500).json({ message: "Upload ảnh thất bại" });
  }
};

// ================= XÓA ẢNH =================
export const xuLyXoaAnhKhoiCloud = async (req, res) => {
  try {
    const { public_id } = req.body; // Lấy public_id từ body yêu cầu

    if (!public_id) {
      return res.status(400).json({ message: "Thiếu public_id" });
    }

    const bucket = process.env.VIETNIX_BUCKET_NAME; // Tên bucket S3

    const deleteCommand = new DeleteObjectCommand({
      // Tạo lệnh xóa
      Bucket: bucket,
      Key: public_id,
    });

    await s3.send(deleteCommand); // Gửi lệnh xóa lên S3

    res.status(200).json({ message: "Xóa ảnh thành công" });
  } catch (error) {
    console.error("Delete S3 error:", error);
    res.status(500).json({ message: "Xóa ảnh thất bại" });
  }
};
