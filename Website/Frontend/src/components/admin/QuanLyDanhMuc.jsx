import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiFolder,
} from "react-icons/fi";
import {
  taoDanhMucSachMoi,
  xoaDanhMucSach,
  capNhatDanhMucSach,
  nhanTatCaDanhMucSach,
} from "../../lib/danh-muc-sach-apis";
import { nhanTatCaCacQuyenSach } from "../../lib/sach-apis";
import ThongBaoChay from "../../components/admin/ThongBaoChay"; // duong dan tuy vi tri file

function QuanLyDanhMuc() {
  // thong bao chay khi them, sua, xoa
  const [thongBao, setThongBao] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const hienThongBao = (type, title, message) => {
    setThongBao({ show: true, type, title, message });
    setTimeout(
      () => setThongBao({ show: false, type: "", title: "", message: "" }),
      3000
    );
  };
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]); // toan bo danh muc
  const [danhMucDangDuocDung, setDanhMucDangDuocDung] = useState([]); // danh muc da gan cho sach
  const [tenDanhMucMoi, setTenDanhMucMoi] = useState(""); // o nhap them danh muc moi
  const [chiSoDangSua, setChiSoDangSua] = useState(null); // chi so danh muc dang sua
  const [giaTriDangSua, setGiaTriDangSua] = useState(""); // ten danh muc dang sua
  // --- PHAN TRANG ---
  const danhMucMotTrang = 4; // so muc tren moi trang (giong quan ly don hang)
  const [trangHienTai, setTrangHienTai] = useState(1); // trang hien tai

  // Ham lay ten danh muc du la object hay string
  const layTenDanhMuc = (cat) =>
    typeof cat === "string" ? cat : cat?.tenDanhMuc || "";

  // Ham xu ly khi nhan nut them
  const xuLyThemDanhMuc = async (e) => {
    e.preventDefault();
    const tenMoiDaCat = tenDanhMucMoi.trim(); // loai bo khoang trang thua
    if (!tenMoiDaCat) return; // neu rong thi dung xu ly

    // Kiem tra trung ten
    const biTrungTen = danhSachDanhMuc.some(
      (danhMuc) =>
        (danhMuc.tenDanhMuc || danhMuc)?.toLowerCase() ===
        tenMoiDaCat.toLowerCase()
    );
    if (biTrungTen) {
      hienThongBao("warning", "Chú ý", `Danh mục "${tenMoiDaCat}" đã tồn tại!`);
      return;
    }

    try {
      setTenDanhMucMoi(""); // xoa truong nhap ngay cho muot
      const danhMucMoi = await taoDanhMucSachMoi(tenMoiDaCat); // <- lay object co ID
      setDanhSachDanhMuc((truocDo) => [...truocDo, danhMucMoi]); // <- them vao mang de hien ID lien
      hienThongBao(
        "success",
        "Thành công",
        `Thêm danh mục "${tenMoiDaCat}" thành công!`
      );
    } catch (err) {
      console.error("Lỗi khi thêm danh mục:", err);
      hienThongBao("error", "Lỗi", "Không thể thêm danh mục, thử lại nhé!");
    }
  };

  // Ham xu ly khi nhan nut xoa
  const xuLyXoaDanhMuc = async (chiSo) => {
    const xacNhanXoa = window.confirm(
      "Bạn có chắc chắn muốn xóa danh mục này?"
    );
    if (!xacNhanXoa) return;

    const tenDanhMuc = layTenDanhMuc(danhSachDanhMuc[chiSo]);
    const danhMucID = danhSachDanhMuc[chiSo]?.danhMucSachID;

    console.log("Dang xoa danh muc:", { chiSo, danhMucID, tenDanhMuc });

    try {
      // Goi API xoa truoc
      await xoaDanhMucSach(danhMucID);

      // Sau khi xoa thanh cong, cap nhat giao dien
      setDanhSachDanhMuc(danhSachDanhMuc.filter((_, viTri) => viTri !== chiSo));

      hienThongBao(
        "success",
        "Thành công",
        "Xóa danh mục " + tenDanhMuc + " thành công!"
      );
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      hienThongBao(
        "error",
        "Lỗi",
        "Có lỗi xảy ra khi xóa danh mục. Vui lòng thử lại!"
      );
    }
  };

  // Ham xu ly khi nhan nut sua
  const batCheDoSua = (idx) => {
    setChiSoDangSua(idx);
    setGiaTriDangSua(layTenDanhMuc(danhSachDanhMuc[idx]));
  };

  // Ham xu ly khi luu cap nhat danh muc
  const xuLyCapNhatDanhMuc = async (e) => {
    e.preventDefault();
    const tenMoi = giaTriDangSua.trim();
    if (!tenMoi) return;

    const danhMucID = danhSachDanhMuc[chiSoDangSua]?.danhMucSachID;

    try {
      // Goi API cap nhat truoc
      await capNhatDanhMucSach(danhMucID, {
        tenDanhMuc: tenMoi,
      });

      // Sau khi cap nhat thanh cong, cap nhat giao dien
      const danhMucDaDuocSua = danhSachDanhMuc.map((cat, i) =>
        i === chiSoDangSua ? { ...cat, tenDanhMuc: tenMoi } : cat
      );
      setDanhSachDanhMuc(danhMucDaDuocSua);

      hienThongBao("success", "Thành công", "Cập nhật danh mục thành công!");

      // Đóng chế độ sửa
      setChiSoDangSua(null);
      setGiaTriDangSua("");
    } catch (err) {
      console.error("Lỗi khi cập nhật danh mục:", err);
      hienThongBao(
        "error",
        "Lỗi",
        "Cập nhật danh mục thất bại, vui lòng thử lại!"
      );
    }
  };

  // Nap tat ca danh muc va lay danh muc da dung o sach khi component mount
  useEffect(() => {
    const napTatCaDanhMucSach = async () => {
      const tatCaDanhMuc = await nhanTatCaDanhMucSach();
      if (tatCaDanhMuc) setDanhSachDanhMuc(tatCaDanhMuc);
    };
    // Lay tat ca sach de xac dinh danh muc da dung
    const napTatCaSach = async () => {
      const tatCaSach = await nhanTatCaCacQuyenSach();
      if (Array.isArray(tatCaSach)) {
        const cacDanhMucDaDung = tatCaSach
          .map((sach) => sach.danhMucSachID)
          .filter(Boolean);
        setDanhMucDangDuocDung(cacDanhMucDaDung);
      }
    };
    napTatCaDanhMucSach();
    napTatCaSach();
  }, []);

  // Ham xu ly khi huy sua
  const huyChinhSua = () => {
    setChiSoDangSua(null);
    setGiaTriDangSua("");
    hienThongBao("success", "Thành công", "Hủy sửa thành công!");
  };

  // Khi danh sach thay doi (them xoa) thi kep lai trang hien tai de tranh vuot tong trang moi
  useEffect(() => {
    const tong = Math.max(
      1,
      Math.ceil(danhSachDanhMuc.length / danhMucMotTrang)
    );
    if (trangHienTai > tong) setTrangHienTai(tong);
  }, [danhSachDanhMuc, trangHienTai]);

  // --- Logic phan trang: tach bien trung gian de doc de hon ---
  const tongTrang = Math.max(
    1,
    Math.ceil(danhSachDanhMuc.length / danhMucMotTrang)
  );
  const danhMucHienThi = danhSachDanhMuc.slice(
    (trangHienTai - 1) * danhMucMotTrang,
    trangHienTai * danhMucMotTrang
  );
  const danhSachSoTrang = Array.from(
    { length: tongTrang },
    (_, chiSo) => chiSo + 1
  );
  const chuyenTrang = (soTrang) => {
    if (!soTrang) return;
    const trangTiepTheo = Math.min(Math.max(soTrang, 1), tongTrang);
    setTrangHienTai(trangTiepTheo);
  };
  const trangTruoc = () => chuyenTrang(trangHienTai - 1);
  const trangSau = () => chuyenTrang(trangHienTai + 1);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 font-sans">
      {/* Thong bao */}
      <ThongBaoChay
        show={thongBao.show}
        type={thongBao.type}
        title={thongBao.title}
        message={thongBao.message}
        onClose={() =>
          setThongBao({ show: false, type: "", title: "", message: "" })
        }
      />
      {/* Tieu de */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-linear-to-br from-indigo-600 to-teal-500 text-white shadow-lg">
            <FiFolder className="text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Quản lý danh mục sách
            </h1>
          </div>
        </div>
      </div>

      {/* Form them danh muc */}
      <form onSubmit={xuLyThemDanhMuc} className="mb-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 md:p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Thêm danh mục mới
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={tenDanhMucMoi}
              onChange={(e) => setTenDanhMucMoi(e.target.value)}
              placeholder="Ví dụ: Văn học thiếu nhi"
              className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold shadow hover:bg-indigo-700 active:bg-indigo-800 transition"
            >
              <FiPlus className="text-lg" /> Thêm
            </button>
          </div>
        </div>
      </form>

      {/* Danh sach */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        <div className="px-6 pt-5 pb-3 flex items-center justify-between bg-linear-to-r from-slate-50 to-white">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            Danh sách danh mục
          </h2>
          <div className="text-sm text-slate-500">
            Tổng: {danhSachDanhMuc.length} mục
          </div>
        </div>

        {/* Hang tieu de */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-3 bg-slate-800 text-white">
          <div className="col-span-1 font-semibold text-sm">#</div>
          <div className="col-span-8 font-semibold text-sm">Tên danh mục</div>
          <div className="col-span-3 font-semibold text-sm text-center">
            Hành động
          </div>
        </div>

        {/* Tung danh muc */}
        <ul className="divide-y divide-slate-100">
          {danhSachDanhMuc && danhSachDanhMuc.length > 0 ? (
            danhMucHienThi.map((danhMuc, chiSoTrongTrang) => {
              // chiSoThuc giu dung vi tri cua danh muc trong mang goc o moi trang
              const chiSoThuc =
                (trangHienTai - 1) * danhMucMotTrang + chiSoTrongTrang;
              const dangSua = chiSoDangSua === chiSoThuc;
              const dangDuocSuDung = danhMucDangDuocDung.includes(
                danhMuc.danhMucSachID
              );
              return (
                <li
                  key={danhMuc.danhMucSachID ?? chiSoThuc}
                  className="px-6 py-3 hover:bg-slate-50 transition"
                >
                  {dangSua ? (
                    <form
                      onSubmit={xuLyCapNhatDanhMuc}
                      className="grid grid-cols-12 gap-3 items-center"
                    >
                      <div className="col-span-1 text-slate-500 font-medium">
                        {danhMuc.danhMucSachID}
                      </div>
                      <div className="col-span-7">
                        <input
                          type="text"
                          value={giaTriDangSua}
                          onChange={(e) => setGiaTriDangSua(e.target.value)}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="col-span-4 flex items-center justify-end gap-2">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700 transition"
                        >
                          <FiSave /> Lưu
                        </button>
                        <button
                          type="button"
                          onClick={huyChinhSua}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition"
                        >
                          <FiX /> Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-1 text-slate-500 font-medium">
                        {danhMuc.danhMucSachID}
                      </div>
                      <div className="col-span-8">
                        <span className="inline-flex items-center gap-2 text-slate-800 font-medium">
                          <span className="inline-block w-2 h-2 rounded-full bg-teal-500"></span>
                          {layTenDanhMuc(danhMuc) || "-"}
                        </span>
                      </div>
                      <div className="col-span-3 flex items-center justify-end gap-2">
                        <button
                          onClick={() => batCheDoSua(chiSoThuc)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 border border-blue-200 transition"
                        >
                          <FiEdit2 /> Sửa
                        </button>
                        <button
                          onClick={() => xuLyXoaDanhMuc(chiSoThuc)}
                          disabled={dangDuocSuDung}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border transition
                              ${
                                dangDuocSuDung
                                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                                  : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                              }
                            `}
                          title={
                            dangDuocSuDung
                              ? "Danh mục đã được sử dụng ở sách, không thể xóa"
                              : "Xóa"
                          }
                        >
                          <FiTrash2 /> Xóa
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })
          ) : (
            <li className="px-5 py-10 text-center text-slate-500">
              Hiện chưa có danh mục nào. Hãy thêm danh mục đầu tiên nhé!
            </li>
          )}
        </ul>

        {/* Dieu khien phan trang */}
        <div className="px-6 py-4">
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Trang {trangHienTai}/{tongTrang} · Hiển thị{" "}
              {danhMucHienThi.length}/{danhSachDanhMuc.length || 0} danh mục
            </p>
            <div className="flex items-center gap-2 text-black">
              <button
                onClick={trangTruoc}
                disabled={trangHienTai === 1}
                className={`px-3 py-1 rounded-md border transition ${
                  trangHienTai === 1
                    ? "opacity-50 cursor-not-allowed border-slate-200"
                    : "hover:bg-gray-100"
                }`}
              >
                Trước
              </button>
              {danhSachSoTrang.map((soTrang) => (
                <button
                  key={soTrang}
                  onClick={() => chuyenTrang(soTrang)}
                  className={`px-3 py-1 rounded-md border transition ${
                    trangHienTai === soTrang
                      ? "bg-[#004C61] text-white border-[#004C61]"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {soTrang}
                </button>
              ))}
              <button
                onClick={trangSau}
                disabled={trangHienTai === tongTrang}
                className={`px-3 py-1 rounded-md border transition ${
                  trangHienTai === tongTrang
                    ? "opacity-50 cursor-not-allowed border-slate-200"
                    : "hover:bg-gray-100"
                }`}
              >
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuanLyDanhMuc;
