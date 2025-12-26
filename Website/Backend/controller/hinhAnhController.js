import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import s3 from "../config/s3_config.js";

// ================= UPLOAD ẢNH =================
export const xuLyTaiAnhLenCloud = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file upload" });
    }

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;

    const bucket = process.env.VIETNIX_BUCKET_NAME;
    const publicUrl = process.env.VIETNIX_PUBLIC_URL;

    const folder = "hinh-anh-sach";
    const fileExt = originalName.split(".").pop();
    const objectKey = `${folder}/${uuidv4()}.${fileExt}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: "public-read",
    });

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
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "Thiếu public_id" });
    }

    const bucket = process.env.VIETNIX_BUCKET_NAME;

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: public_id,
    });

    await s3.send(deleteCommand);

    res.status(200).json({ message: "Xóa ảnh thành công" });
  } catch (error) {
    console.error("Delete S3 error:", error);
    res.status(500).json({ message: "Xóa ảnh thất bại" });
  }
};
