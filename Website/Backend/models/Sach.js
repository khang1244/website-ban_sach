import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import DanhMucSach from "./DanhMucSach.js";

const Sach = sequelize.define(
  "Sach",
  {
    sachID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenSach: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tacGia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nhaXuatBan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ngayXuatBan: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ngonNgu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    danhMucSachID: {
      type: DataTypes.INTEGER,
      references: {
        model: "danh_muc_sach",
        key: "danhMucSachID",
      },
    },
    soTrang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dinhDang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    soLuongConLai: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    giaNhap: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    giaBan: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    giaGiam: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    images: {
      type: DataTypes.TEXT, // ["url1", "url2", ...]
      allowNull: false,
    },
  },
  {
    tableName: "sach",
    timestamps: true, // createdAt, updatedAt
  }
);

//quan hệ 1-n giữa DanhMucSach và Sach
Sach.belongsTo(DanhMucSach, { foreignKey: "danhMucSachID" });
DanhMucSach.hasMany(Sach, { foreignKey: "danhMucSachID" });

export default Sach;
