import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/user-context";

// Bảo vệ tuyến đường: chặn truy cập nếu chưa đăng nhập hoặc không đủ quyền
const BaoVeTuyenDuong = ({ children, chiChoAdmin = false }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const savedUserRaw = localStorage.getItem("user");

  useEffect(() => {
    // Nếu chưa có user trong context nhưng có trong localStorage thì khôi phục lại
    if (!user && savedUserRaw) {
      try {
        const parsed = JSON.parse(savedUserRaw);
        const avatarObject = parsed.avatar ? JSON.parse(parsed.avatar) : null;
        setUser({ ...parsed, avatar: avatarObject });
        return;
      } catch (err) {
        console.warn("Không thể khôi phục user từ localStorage", err);
      }
    }

    // Không tìm thấy user => chuyển về đăng nhập
    if (!user && !savedUserRaw) {
      navigate("/dangnhap", { replace: true });
      return;
    }

    if (chiChoAdmin && user && user.vaiTro !== "admin") {
      alert("Bạn không có quyền truy cập trang này!");
      navigate("/", { replace: true });
    }
  }, [user, savedUserRaw, navigate, chiChoAdmin, setUser]);

  // Đợi khôi phục user từ localStorage tránh nháy trang
  if (!user && savedUserRaw) return null;
  if (!user) return null;
  if (chiChoAdmin && user.vaiTro !== "admin") return null;

  return children;
};

export default BaoVeTuyenDuong;
