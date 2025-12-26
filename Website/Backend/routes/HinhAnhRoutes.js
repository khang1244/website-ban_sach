import express from "express";
import {
  xuLyTaiAnhLenCloud,
  xuLyXoaAnhKhoiCloud,
} from "../controller/hinhAnhController.js";
import upload from "../config/multer.js";

const router = express.Router();

// tải ảnh lên s3
router.post("/taianhlen", upload.single("image"), xuLyTaiAnhLenCloud);

// xóa ảnh khỏi s3
router.post("/xoaanh", xuLyXoaAnhKhoiCloud);

export default router;
