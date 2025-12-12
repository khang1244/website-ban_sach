import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/user-context";

// Bảo vệ tuyến đường: chặn truy cập nếu chưa đăng nhập hoặc không đủ quyền
const BaoVeTuyenDuong = ({ children, chiChoAdmin = false }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/dangnhap", { replace: true });
      return;
    }

    if (chiChoAdmin && user.vaiTro !== "admin") {
      alert("Bạn không có quyền truy cập trang này!");
      navigate("/", { replace: true });
    }
  }, [user, navigate, chiChoAdmin]);

  if (!user) return null;
  if (chiChoAdmin && user.vaiTro !== "admin") return null;

  return children;
};

export default BaoVeTuyenDuong;
