import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import KhachHang from "./KhachHang.js";

const DiaChi = sequelize.define(
  "DiaChi",
  {
    diaChiID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    khachHangID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "khach_hang", key: "khachHangID" },
    },
    diaChi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    macDinh: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { timestamps: true, tableName: "dia_chi" }
);

DiaChi.belongsTo(KhachHang, { foreignKey: "khachHangID" });
KhachHang.hasMany(DiaChi, { foreignKey: "khachHangID" });

export default DiaChi;
