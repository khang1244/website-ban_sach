import Navigation from "./Navigation.jsx";
import Footer from "./Footer.jsx";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { capNhatThongTinNguoiDung } from "../lib/nguoi-dung-apis.js";
import { uploadHinhAnh } from "../lib/hinh-anh-apis.js";
import ThongBaoChay from "./admin/ThongBaoChay";
import { layDiaChiTheoNguoiDung } from "../lib/dia-chi-apis.js";

function HoSoNguoiDung() {
  // State cho phép chỉnh sửa thông tin
  const [edit, setEdit] = useState(false);
  // State lưu thông tin người dùng
  const [user, setUser] = useState({});

  // Địa chỉ mặc định (hiển thị, chỉnh sửa ở trang quản lý địa chỉ)
  const [defaultAddress, setDefaultAddress] = useState("");
  const [addrLoading, setAddrLoading] = useState(false);

  //hình ảnh mã hóa để hiển thị ảnh cho người dùng xem trước
  const [hinhAnhMaHoa, setHinhAnhMaHoa] = useState(null);
  // thông báo chạy khi thêm, sửa, xóa
  const [toast, setToast] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const showToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
    setTimeout(
      () => setToast({ show: false, type: "", title: "", message: "" }),
      3000
    );
  };
  //Hàm kiểm tra có phải là 1 file ảnh hay không
  function isFile(variable) {
    return variable instanceof File;
  }

  // Hàm xử lý lưu thông tin
  const handleSave = async (e) => {
    e.preventDefault();
    setEdit(false);

    // Nếu người dùng có thay đổi avatar thì mình phải upload avatar lên s3
    let hinhAnhDaTa = user.avatar;
    if (isFile(user.avatar)) {
      hinhAnhDaTa = await uploadHinhAnh(user.avatar);
    }

    // Lưu thông tin người dùng mới sửa vào trong database
    const duLieuNguoiDungMoi = {
      tenNguoiDung: user.tenNguoiDung,
      email: user.email,
      soDienThoai: user.soDienThoai,
      diaChi: user.diaChi,
      avatar: hinhAnhDaTa
        ? JSON.stringify({
            public_id: hinhAnhDaTa.public_id,
            url: hinhAnhDaTa.url,
          })
        : JSON.stringify(user.avatar), // Nếu có hình ảnh mới thì lấy hình ảnh mới, không thì lấy hình ảnh cũ
    };

    const { status } = await capNhatThongTinNguoiDung(
      user.nguoiDungID,
      duLieuNguoiDungMoi
    );
    if (status) {
      showToast("info", "Thành công", "Cập nhật hồ sơ thành công!");
    } else {
      showToast("info", "Thất bại", "Cập nhật hồ sơ thất bại!");
    }

    // Cập nhật lại dữ liệu người dùng trong localStorage
    const duLieuNguoiDungMoiDeLuuVaoLocalStorage = {
      ...user,
      ...duLieuNguoiDungMoi,
    };
    localStorage.setItem(
      "user",
      JSON.stringify(duLieuNguoiDungMoiDeLuuVaoLocalStorage)
    );
  };

  // Nạp dữ liệu người dùng từ sever sử dung useEffect
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // Kiểm tra xem có dữ liệu user trong localStorage không

      const duLieuNguoiDung = JSON.parse(storedUser); // Chuyển dữ liệu người từ localStorage sang dạng Object để sử dụng

      // Vì avatar vẫn đang là một chuỗi JSON nên mình phỉa chuyển nó thành dạng Object để sử dụng để hiển thị avatar của người dùng
      const avatarDuocBienDoiThanhObject = duLieuNguoiDung.avatar
        ? JSON.parse(duLieuNguoiDung.avatar)
        : null;

      setUser({
        // Thay đổi biến trạng thái user để hiển thị dữ liệu người dùng ra form
        ...duLieuNguoiDung,
        avatar: avatarDuocBienDoiThanhObject, // Chuyển chuỗi JSON thành object
      });
    }
  }, []);

  // Lấy địa chỉ mặc định của người dùng
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      if (!user?.nguoiDungID) return;
      try {
        setAddrLoading(true);
        const list = await layDiaChiTheoNguoiDung(user.nguoiDungID);
        if (Array.isArray(list) && list.length > 0) {
          const def = list.find((a) => a.macDinh) || list[0];
          setDefaultAddress(def?.diaChi || "");
        } else {
          setDefaultAddress("");
        }
      } catch (err) {
        console.error("Không lấy được địa chỉ mặc định:", err);
        setDefaultAddress("");
      } finally {
        setAddrLoading(false);
      }
    };

    fetchDefaultAddress();
  }, [user?.nguoiDungID]);
  return (
    <div className="bg-gradient-to-br  min-h-screen w-full">
      <Navigation />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Cập Nhật Hồ Sơ Người Dùng
        </h1>
        {/* Toast */}
        <ThongBaoChay
          show={toast.show}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() =>
            setToast({ show: false, type: "", title: "", message: "" })
          }
        />
        <div className="bg-white rounded-xl shadow-xl p-8">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <img
                  src={hinhAnhMaHoa ? hinhAnhMaHoa : user.avatar?.url}
                  alt="avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#00809D] shadow mb-2"
                />
                {edit && (
                  <label
                    className="absolute bottom-2 right-2 bg-[#00809D] text-white rounded-full p-1 cursor-pointer shadow hover:bg-[#006b85] transition"
                    title="Đổi ảnh đại diện"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setUser({ ...user, avatar: file }); // Cập nhật avatar trong state user
                          const reader = new FileReader();
                          reader.onload = (ev) =>
                            setHinhAnhMaHoa(ev.target.result); // Hiển thị ảnh xem trước
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 16v2h12v-2M12.5 7.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      <path d="M16.5 6.5l-2-2A2 2 0 0013 4H7a2 2 0 00-1.5.5l-2 2A2 2 0 003 8v7a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-.5-1.5z" />
                    </svg>
                  </label>
                )}
              </div>
              <span className="font-semibold text-[#00809D] mt-2">
                Ảnh đại diện
              </span>
            </div>
            <div className="flex flex-col gap-2 text-black">
              <label className="font-semibold">Tên người dùng</label>
              <input
                className="border rounded px-4 py-2"
                value={user.tenNguoiDung}
                disabled={!edit}
                onChange={
                  (e) => setUser({ ...user, tenNguoiDung: e.target.value }) // spread operator
                }
              />
            </div>
            <div className="flex flex-col gap-2 text-black">
              <label className="font-semibold">Email</label>
              <input
                className="border rounded px-4 py-2"
                value={user.email}
                disabled={true}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2 text-black">
              <label className="font-semibold">Số điện thoại</label>
              <input
                className="border rounded px-4 py-2"
                value={user.soDienThoai}
                disabled={!edit}
                onChange={(e) =>
                  setUser({ ...user, soDienThoai: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2 text-black">
              <div className="flex items-center justify-between">
                <label className="font-semibold">
                  Địa chỉ giao hàng mặc định
                </label>
                <Link
                  to="/quanlydiachi"
                  className="text-sm text-[#00809D] font-semibold hover:underline"
                >
                  Quản lý địa chỉ
                </Link>
              </div>
              <div className="border rounded px-4 py-3 bg-gray-50 text-sm text-black min-h-[48px]">
                {addrLoading
                  ? "Đang tải..."
                  : defaultAddress || "Chưa có địa chỉ mặc định"}
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              {edit ? (
                <>
                  <button
                    type="submit"
                    className="bg-[#00809D] text-white px-6 py-2 rounded font-bold hover:bg-[#006b85] transition"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-bold hover:bg-gray-400 transition"
                    onClick={() => setEdit(false)}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="bg-[#00809D] text-white px-6 py-2 rounded font-bold hover:bg-[#006b85] transition"
                  onClick={() => setEdit(true)}
                >
                  Chỉnh sửa
                </button>
              )}
              <Link
                to="/lichsumuahang"
                className="ml-auto text-blue-600 underline font-semibold"
              >
                Xem lịch sử mua hàng
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HoSoNguoiDung;
