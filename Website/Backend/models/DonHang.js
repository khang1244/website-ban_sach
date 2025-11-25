import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import Sach from "./Sach.js";
import NguoiDung from "./NguoiDung.js";
// Định nghãi model DonHang
const DonHang = sequelize.define(
  "DonHang",
  {
    donHangID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nguoiDungID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "nguoi_dung",
        key: "nguoiDungID",
      },
    },
    tenKhachHang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    soDienThoaiKH: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ngayDat: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tongTien: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    trangThai: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    khuyenMaiID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tienGiam: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tongTienBanDau: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    diaChiGiaoHang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phuongThucThanhToan: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "cod", // Mặc định là COD để tránh lỗi khi thêm cột vào bảng hiện có
    },
    phuongThucGiaoHangID: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ghiChu: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt fields
    tableName: "don_hang",
  }
);

// Bảng trung gian DonHang_Sach cho quan hệ nhiều nhiều bao gồm 4 trường chính: donHangID, sachID, soLuong, donGia
export const DonHang_Sach = sequelize.define(
  "DonHang_Sach",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    donHangID: {
      type: DataTypes.INTEGER,
      references: {
        model: "don_hang",
        key: "donHangID",
      },
    },
    sachID: {
      type: DataTypes.INTEGER,
      references: {
        model: "sach",
        key: "sachID",
      },
    },
    soLuong: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    donGia: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "donhang_sach",
  }
);

// Thiết lập quan hệ nhiều nhiều giữa DonHang và Sach thông qua bảng trung gian DonHang_Sach
DonHang.belongsToMany(Sach, { through: DonHang_Sach, foreignKey: "donHangID" });

Sach.belongsToMany(DonHang, { through: DonHang_Sach, foreignKey: "sachID" });

// Tạo liên kết cho bảng DonHang với bảng NguoiDung
DonHang.belongsTo(NguoiDung, { foreignKey: "nguoiDungID" });
NguoiDung.hasMany(DonHang, { foreignKey: "nguoiDungID" });

export default DonHang;
