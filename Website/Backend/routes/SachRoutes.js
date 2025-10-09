import express from "express";
import {
  capNhatSach,
  nhanTatCaCacQuyenSach,
  taoSachMoi,
  xoaSach,
} from "../controller/sachController.js";

const router = express.Router();

router.get("/", nhanTatCaCacQuyenSach); // GET /

router.post("/", taoSachMoi); // POST /

router.put("/:id", capNhatSach); // PUT /:id

router.delete("/:id", xoaSach); // DELETE /:id

export default router;
