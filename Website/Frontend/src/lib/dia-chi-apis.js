// 1. Tạo hàm nhận về danh sách xã phường dựa trên mã tỉnh/thành phố

import { xaPhuong } from "./du-Lieu-XaPhuong.js";

export const nhanDanhSachXaPhuong = (maTinh) => {
  const danhSachXaPhuong = xaPhuong.filter(
    (item) => item.province_code === parseInt(maTinh)
  );
  return danhSachXaPhuong;
};
