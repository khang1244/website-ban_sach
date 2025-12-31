import { createContext, useState, useEffect } from "react";
import {
  demSoLuongSanPhamTrongGioHang,
  layGioHangTheoNguoiDung,
} from "../lib/gio-hang-apis";

// Tạo UserContext để quản lý thông tin người dùng toàn cục
const UserContext = createContext();

// UserProvider component - bọc ứng dụng để cung cấp user context
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Thông tin người dùng hiện tại
  const [cartCount, setCartCount] = useState(0); // Số lượng sản phẩm (distinct) trong giỏ

  console.log("UserContext - user:", user);

  // // Kiểm tra và khôi phục thông tin user từ localStorage khi khởi động ứng dụng
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      const avatarObject = parsedUser.avatar
        ? JSON.parse(parsedUser.avatar)
        : null;

      setUser({
        ...parsedUser,
        avatar: avatarObject,
      });
    }
  }, []);

  // Hàm tải số lượng sản phẩm (distinct) trong giỏ hàng từ server
  const refreshCartCount = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setCartCount(0);
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      console.log("refreshCartCount - nguoiDungID:", parsedUser.nguoiDungID);
      const data = await demSoLuongSanPhamTrongGioHang(parsedUser.nguoiDungID);
      console.log("refreshCartCount - response:", data);

      // Nếu endpoint trả về số hoặc object chứa count/soLuong thì dùng trực tiếp
      let count = null;
      if (data !== null && data !== undefined) {
        if (typeof data === "number") count = data;
        else if (typeof data.count === "number") count = data.count;
        else if (typeof data.soLuong === "number") count = data.soLuong;
      }

      // Nếu không lấy được count từ endpoint, fallback: lấy toàn bộ giỏ hàng và đếm số mặt hàng distinct
      if (count === null) {
        try {
          const full = await layGioHangTheoNguoiDung(parsedUser.nguoiDungID);
          console.log("refreshCartCount - fallback full cart:", full);
          if (
            full &&
            full.gioHang &&
            Array.isArray(full.gioHang.ChiTietGioHangs)
          ) {
            count = full.gioHang.ChiTietGioHangs.length;
          } else {
            count = 0;
          }
        } catch (err) {
          console.warn("refreshCartCount - fallback failed:", err);
          count = 0;
        }
      }

      setCartCount(count || 0);
    } catch (error) {
      console.error("Lỗi khi tải số lượng giỏ hàng:", error);
    }
  };

  // Tự động tải lại số lượng giỏ hàng khi thông tin user thay đổi
  useEffect(() => {
    if (user) {
      refreshCartCount();
    } else {
      setCartCount(0);
    }
  }, [user]);

  // Các giá trị và hàm được cung cấp cho toàn bộ ứng dụng
  const value = {
    user, // Thông tin người dùng
    setUser, // Hàm cập nhật thông tin người dùng
    // Cart
    cartCount, // Số lượng sản phẩm distinct trong giỏ
    setCartCount, // Hàm cập nhật số lượng sản phẩm trong giỏ
    refreshCartCount, // Hàm tải lại số lượng sản phẩm trong giỏ
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
