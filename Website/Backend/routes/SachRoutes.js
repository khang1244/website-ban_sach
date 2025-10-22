import express from "express";
import {
  capNhatSach,
  nhanTatCaCacQuyenSach,
  taoSachMoi,
  xoaSach,
  layChiTietSach,
} from "../controller/sachController.js";

const router = express.Router();

router.get("/", nhanTatCaCacQuyenSach); // GET /

router.post("/", taoSachMoi); // POST /

router.put("/:id", capNhatSach); // PUT /:id

router.delete("/:id", xoaSach); // DELETE /:id

router.get("/:sachID", layChiTietSach); // GET /:sachID

export default router;
