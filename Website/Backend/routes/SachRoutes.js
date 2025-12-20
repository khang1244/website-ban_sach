import express from "express";
import {
  capNhatSach,
  capNhatTrangThaiBan,
  nhanTatCaCacQuyenSach,
  taoSachMoi,
  xoaSach,
  layChiTietSach,
  tangLuotXem,
} from "../controller/sachController.js";

const router = express.Router();

router.get("/", nhanTatCaCacQuyenSach); // GET /

router.post("/", taoSachMoi); // POST /

router.put("/:id/trang-thai-ban", capNhatTrangThaiBan); // PUT /:id/trang-thai-ban

router.put("/:id", capNhatSach); // PUT /:id

router.delete("/:id", xoaSach); // DELETE /:id

router.get("/:sachID", layChiTietSach); // GET /:sachID

// Tăng lượt xem (POST) - dành cho frontend gọi khi muốn ghi một lượt xem
router.post("/:sachID/luot-view", tangLuotXem);

export default router;
