import { createContext, useState, useEffect } from "react";

// Tạo UserContext để quản lý thông tin người dùng toàn cục
const UserContext = createContext();

// UserProvider component - bọc ứng dụng để cung cấp user context
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Thông tin người dùng hiện tại

  console.log("UserContext - user:", user);

  // Kiểm tra và khôi phục thông tin user từ localStorage khi khởi động ứng dụng
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

  // Các giá trị và hàm được cung cấp cho toàn bộ ứng dụng
  const value = {
    user, // Thông tin người dùng
    setUser, // Hàm cập nhật thông tin người dùng
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
