import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";

const DanhMucSach = sequelize.define(
  "DanhMucSach",
  {
    DanhMucSachID: {
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
    tableName: "DanhMucSach",
    timestamps: false,
  }
);
export default DanhMucSach;
