import { useState, useContext } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { dangNhapTaiKhoan, capNhatMatKhau } from "../lib/nguoi-dung-apis.js";
import ThongBaoChay from "./admin/ThongBaoChay";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user-context";

// Hàm đánh giá độ mạnh mật khẩu
function passwordStrength(password) {
  let score = 0;
  if (!password) return { score: 0, label: "Rất yếu", color: "bg-red-500" };
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score, label: "Yếu", color: "bg-red-500" };
  if (score <= 3) return { score, label: "Trung bình", color: "bg-yellow-400" };
  return { score, label: "Mạnh", color: "bg-green-500" };
}
// Component đổi mật khẩu
export default function DoiMatKhau() {
  const { setUser } = useContext(UserContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  // Hàm hiển thị thông báo
  const showToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
    setTimeout(
      () => setToast({ show: false, type: "", title: "", message: "" }),
      3000
    );
  };

  const [showCurrent, setShowCurrent] = useState(false); // Hiển thị mật khẩu hiện tại
  const [showNew, setShowNew] = useState(false); // Hiển thị mật khẩu mới
  const [showConfirm, setShowConfirm] = useState(false); // Hiển thị xác nhận mật khẩu mới
  const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng

  // Xử lý gửi biểu mẫu đổi mật khẩu
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("info", "Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("info", "Lỗi", "Mật khẩu mới và xác nhận không khớp");
      return;
    }
    if (newPassword.length < 6) {
      showToast("info", "Lỗi", "Mật khẩu mới tối thiểu 6 ký tự");
      return;
    }

    const stored = localStorage.getItem("user");
    if (!stored) {
      showToast("info", "Lỗi", "Bạn chưa đăng nhập");
      return;
    }

    const user = JSON.parse(stored);
    setLoading(true);
    try {
      const verify = await dangNhapTaiKhoan(user.email, currentPassword);
      if (!verify.status) {
        showToast("info", "Lỗi", "Mật khẩu hiện tại không chính xác");
        setLoading(false);
        return;
      }

      const res = await capNhatMatKhau(user.nguoiDungID, newPassword);
      if (res.status) {
        showToast("success", "Thành công", "Đổi mật khẩu thành công");
        // Bắt buộc đăng xuất để đăng nhập lại
        localStorage.removeItem("user");
        setUser(null);
        setTimeout(() => navigate("/dangnhap"), 800);
      } else {
        showToast("info", "Thất bại", res.message || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      console.error(err);
      showToast("info", "Lỗi", "Có lỗi khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };
  // Đánh giá độ mạnh mật khẩu mới
  const strength = passwordStrength(newPassword);

  return (
    <div className="bg-gradient-to-br from-sky-700 via-cyan-600 to-emerald-600 min-h-screen w-full py-8">
      <Navigation />
      <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3">
          <div className="p-10 col-span-1 flex flex-col justify-center gap-4 border-r hidden md:block">
            <div className="flex items-center gap-3">
              <div className="bg-[#00809D] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"></div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Bảo mật tài khoản
                </h2>
                <p className="text-sm text-gray-600">
                  Thay đổi mật khẩu để bảo vệ tài khoản của bạn. Mật khẩu nên
                  dài ít nhất 8 ký tự và kết hợp chữ hoa, chữ thường, số và ký
                  tự đặc biệt.
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <ul className="list-disc pl-5 space-y-1">
                <li>Không chia sẻ mật khẩu với người khác.</li>
                <li>Đăng xuất sau khi đổi mật khẩu để đảm bảo an toàn.</li>
              </ul>
            </div>
          </div>

          <div className="p-8 col-span-2">
            <ThongBaoChay
              show={toast.show}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() =>
                setToast({ show: false, type: "", title: "", message: "" })
              }
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="text-sm font-medium text-gray-700">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className=" text-black mt-1 block w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00809D]"
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((s) => !s)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showCurrent ? "Ẩn" : "Hiện"}
                </button>
              </div>

              <label className="text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className=" text-black mt-1 block w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00809D]"
                  placeholder="Mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((s) => !s)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showNew ? "Ẩn" : "Hiện"}
                </button>
              </div>

              {/* strength meter */}
              <div className="mt-1">
                <div className="h-2 w-full bg-gray-200 rounded">
                  <div
                    className={`${strength.color} h-2 rounded`}
                    style={{ width: `${(strength.score / 5) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Độ mạnh:{" "}
                  <span className="font-semibold">{strength.label}</span>
                </div>
              </div>

              <label className="text-sm font-medium text-gray-700">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-black mt-1 block w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00809D]"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showConfirm ? "Ẩn" : "Hiện"}
                </button>
              </div>

              {/* inline errors */}
              {newPassword && newPassword.length < 6 && (
                <div className="text-sm text-red-600">
                  Mật khẩu mới phải tối thiểu 6 ký tự
                </div>
              )}
              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <div className="text-sm text-red-600">
                    Mật khẩu xác nhận không khớp
                  </div>
                )}

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#00809D] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#006b85] transition disabled:opacity-60"
                >
                  {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
