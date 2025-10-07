import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config(); // Tải biến môi trường từ file .env

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, // Cổng mặc định của MySQL là 3306
    dialect: "mysql", // Sử dụng MySQL là cơ sở dữ liệu
    logging: false, // Tắt logging SQL query
  }
);

export default sequelize; // Xuất đối tượng sequelize để sử dụng ở các file khác
