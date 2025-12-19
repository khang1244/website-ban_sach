import DiaChi from "../models/DiaChi.js";

// Lấy danh sách địa chỉ theo người dùng
// params: userId
export const layDiaChiTheoNguoiDung = async (req, res) => {
  try {
    const { nguoiDungID } = req.params;
    const danhSachDiaChi = await DiaChi.findAll({
      where: { nguoiDungID },
    });
    return res.json({ ok: true, addresses: danhSachDiaChi });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Lỗi server", err });
  }
};

// Tạo địa chỉ mới cho người dùng
// body: { nguoiDungID, diaChi, macDinh }
export const taoDiaChi = async (req, res) => {
  try {
    const { nguoiDungID, diaChi, macDinh } = req.body;
    // Nếu đánh dấu là mặc định, bỏ cờ mặc định cho các địa chỉ khác
    if (macDinh) {
      await DiaChi.update({ macDinh: false }, { where: { nguoiDungID } });
    }
    const diaChiMoi = await DiaChi.create({
      nguoiDungID,
      diaChi,
      macDinh: !!macDinh,
    });
    return res.status(201).json({ ok: true, address: diaChiMoi });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, message: "Lỗi khi tạo địa chỉ", err });
  }
};

// Xóa địa chỉ theo ID
export const xoaDiaChi = async (req, res) => {
  try {
    const { diaChiID } = req.params;
    await DiaChi.destroy({ where: { diaChiID } });
    return res.json({ ok: true, message: "Xóa thành công" });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Lỗi xóa", err });
  }
};

// Cập nhật địa chỉ theo ID
// body: { diaChi, macDinh }
export const capNhatDiaChi = async (req, res) => {
  try {
    const { diaChiID } = req.params;
    const { diaChi, macDinh } = req.body;

    const diaChiCu = await DiaChi.findByPk(diaChiID);
    if (!diaChiCu)
      return res
        .status(404)
        .json({ ok: false, message: "Không tìm thấy địa chỉ" });

    // Nếu đánh dấu là mặc định, bỏ cờ mặc định cho các địa chỉ khác
    if (macDinh) {
      await DiaChi.update(
        { macDinh: false },
        { where: { nguoiDungID: diaChiCu.nguoiDungID } }
      );
    }

    // Cập nhật địa chỉ
    diaChiCu.diaChi = diaChi || diaChiCu.diaChi;
    diaChiCu.macDinh = macDinh !== undefined ? !!macDinh : diaChiCu.macDinh;
    await diaChiCu.save();

    return res.json({ ok: true, address: diaChiCu });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, message: "Lỗi cập nhật địa chỉ", err });
  }
};

// Đặt một địa chỉ làm mặc định
// params: id (diaChiID)
export const datDiaChiMacDinh = async (req, res) => {
  try {
    const { diaChiID } = req.params;
    const diaChi = await DiaChi.findByPk(diaChiID);
    if (!diaChi)
      return res
        .status(404)
        .json({ ok: false, message: "Không tìm thấy địa chỉ" });
    await DiaChi.update(
      { macDinh: false },
      { where: { nguoiDungID: diaChi.nguoiDungID } }
    );
    diaChi.macDinh = true;
    await diaChi.save();
    return res.json({ ok: true, address: diaChi });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, message: "Lỗi đặt mặc định", err });
  }
};
