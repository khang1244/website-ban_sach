import { DataTypes } from "sequelize";
import sequelize from "../config/mysql_config.js";
import Sach from "./Sach.js";

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
        model: Sach,
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

//quan hệ 1-n giữa Sach và HinhAnh
Sach.hasMany(HinhAnh, { foreignKey: "sachID", as: "hinhAnhs" });
HinhAnh.belongsTo(Sach, { foreignKey: "sachID", as: "sach" });

export default HinhAnh;
