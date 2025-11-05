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

      let avatarObject = null;
      if (parsedUser.avatar) {
        // Kiểm tra kiểu dữ liệu của avatar
        if (typeof parsedUser.avatar === "string") {
          const trimmed = parsedUser.avatar.trim();
          // Kiểm tra nếu chuỗi là JSON
          if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
            try {
              // Parse chuỗi JSON thành object
              avatarObject = JSON.parse(parsedUser.avatar);
            } catch (err) {
              console.warn(
                "UserContext: Không thể parse avatar JSON từ localStorage, giữ nguyên chuỗi:",
                err
              );
              // Giữ nguyên chuỗi nếu không thể parse
              avatarObject = parsedUser.avatar;
            }
          } else {
            // Không phải JSON, giữ nguyên chuỗi
            avatarObject = parsedUser.avatar;
          }
        } else {
          // Đã là object, giữ nguyên
          avatarObject = parsedUser.avatar;
        }
      }
      // Cập nhật user state với avatar đã xử lý
      setUser({ ...parsedUser, avatar: avatarObject });
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
