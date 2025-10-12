import express from "express";
import {
  nhanBinhLuanTheoSachID,
  nhanTatCaBinhLuan,
  taoBinhLuan,
  xoaBinhLuan,
} from "../controller/binhLuanController.js";

const router = express.Router();

// Lấy tất cả bình luận
router.get("/", nhanTatCaBinhLuan);

// Lấy bình luận theo sách ID
router.get("/:sachID", nhanBinhLuanTheoSachID);

// Tạo bình luận mới
router.post("/", taoBinhLuan);

// Xóa bình luận
router.delete("/:binhLuanID", xoaBinhLuan);

export default router;
