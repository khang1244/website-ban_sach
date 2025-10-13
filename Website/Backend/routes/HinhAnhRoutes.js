import express from "express";
import {
  xuLyTaiAnhLenCloud,
  xuLyXoaAnhKhoiCloud,
} from "../controller/hinhAnhController.js";
import upload from "../config/multer.js";

const router = express.Router();

// Tải ảnh lên Cloudinary
router.post("/taianhlen", upload.single("image"), xuLyTaiAnhLenCloud);

// Xóa ảnh khỏi Cloudinary
router.post("/xoaanh", xuLyXoaAnhKhoiCloud);

export default router;
