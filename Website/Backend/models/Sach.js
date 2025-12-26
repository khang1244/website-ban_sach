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
      allowNull: false,
      references: {
        model: DanhMucSach,
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
    giaBan: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    giaGiam: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    trangThaiBan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // true: đang bán, false: ngừng bán
    },
    moTa: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    luotXem: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
