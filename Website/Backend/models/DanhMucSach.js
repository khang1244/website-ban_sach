import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";

const DanhMucSach = sequelize.define(
  "DanhMucSach",
  {
    danhMucSachID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenDanhMuc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Danh_Muc_Sach",
    timestamps: false,
  }
);
export default DanhMucSach;
