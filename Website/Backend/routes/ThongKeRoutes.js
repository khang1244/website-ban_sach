import express from "express";
import { thongKe } from "../controller/thongKeController.js";

const router = express.Router();

router.get("/tongquan", thongKe);

export default router;
