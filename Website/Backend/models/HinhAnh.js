import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";

const HinhAnh = sequelize.define(
  "HinhAnh",
  {
    hinhAnhID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sachID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sach",
        key: "sachID",
      },
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    public_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "hinh_anh",
    timestamps: true,
  }
);

export default HinhAnh;
