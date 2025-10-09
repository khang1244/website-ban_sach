import express from "express";
import {
  nhanTatCaDanhMucSach,
  taoDanhMucSachMoi,
  capNhatDanhMucSach,
  xoaDanhMucSach,
} from "../controller/danhMucSachController.js";
const router = express.Router();

// Lấy tất cả các danh mục sách
router.get("/", nhanTatCaDanhMucSach);

// Tạo một danh mục sách mới
router.post("/", taoDanhMucSachMoi);

// Cập nhật một danh mục sách dựa trên ID
router.put("/:id", capNhatDanhMucSach); // PUT /api/danhMucSach/:id

// Xóa một danh mục sách dựa trên ID
router.delete("/:id", xoaDanhMucSach); // DELETE /api/danhMucSach/:id

export default router;
