import express from "express";
import { thongKe, thongKeDoanhThuTheoThang } from "../controller/thongKeController.js";

const router = express.Router();

router.get("/tongquan", thongKe);
router.get("/doanh-thu-theo-thang", thongKeDoanhThuTheoThang);

export default router;
