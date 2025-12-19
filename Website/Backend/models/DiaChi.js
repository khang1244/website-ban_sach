import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import NguoiDung from "./NguoiDung.js";

const DiaChi = sequelize.define(
  "DiaChi",
  {
    diaChiID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nguoiDungID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "nguoi_dung", key: "nguoiDungID" },
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

DiaChi.belongsTo(NguoiDung, { foreignKey: "nguoiDungID" });
NguoiDung.hasMany(DiaChi, { foreignKey: "nguoiDungID" });

export default DiaChi;
