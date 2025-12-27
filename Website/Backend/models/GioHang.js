import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import NguoiDung from "./NguoiDung.js";
import Sach from "./Sach.js";

// Định nghĩa model GioHang (Shopping Cart)
const GioHang = sequelize.define(
  "GioHang",
  {
    gioHangID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nguoiDungID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: NguoiDung,
        key: "nguoiDungID",
      },
    },
  },
  {
    tableName: "gio_hang",
    timestamps: true, // createdAt, updatedAt
  }
);

// Định nghĩa model ChiTietGioHang (Shopping Cart Items) - Bảng trung gian
const ChiTietGioHang = sequelize.define(
  "ChiTietGioHang",
  {
    gioHangID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: GioHang,
        key: "gioHangID",
      },
    },
    sachID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Sach,
        key: "sachID",
      },
    },
    soLuong: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    giaLucThem: {
      type: DataTypes.FLOAT,
      allowNull: false, // Giá của sách tại thời điểm thêm vào giỏ
    },
    tongGia: {
      type: DataTypes.FLOAT,
      allowNull: false, // soLuong * giaLucThem
    },
  },
  {
    tableName: "chi_tiet_gio_hang",
    timestamps: true,
  }
);

// Thiết lập quan hệ giữa các model
// Một người dùng có một giỏ hàng
NguoiDung.hasOne(GioHang, { foreignKey: "nguoiDungID" });
GioHang.belongsTo(NguoiDung, { foreignKey: "nguoiDungID" });

// Một giỏ hàng có nhiều chi tiết giỏ hàng
GioHang.hasMany(ChiTietGioHang, { foreignKey: "gioHangID" });
ChiTietGioHang.belongsTo(GioHang, { foreignKey: "gioHangID" });

// Một sách có thể có trong nhiều chi tiết giỏ hàng
Sach.hasMany(ChiTietGioHang, { foreignKey: "sachID" });
ChiTietGioHang.belongsTo(Sach, { foreignKey: "sachID" });

// Quan hệ many-to-many giữa GioHang và Sach thông qua ChiTietGioHang
GioHang.belongsToMany(Sach, {
  through: ChiTietGioHang,
  foreignKey: "gioHangID",
});
Sach.belongsToMany(GioHang, { through: ChiTietGioHang, foreignKey: "sachID" });

export { GioHang, ChiTietGioHang };
export default GioHang;
