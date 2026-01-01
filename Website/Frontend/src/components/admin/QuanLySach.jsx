import React, { useState, useEffect, useCallback } from "react";
import {
  capNhatSach,
  capNhatTrangThaiBanSach,
  themSach,
  xoaSach,
} from "../../lib/sach-apis";
import { uploadHinhAnh, xoaHinhAnhKhoiS3 } from "../../lib/hinh-anh-apis";
import { nhanTatCaCacQuyenSach } from "../../lib/sach-apis";
import { nhanTatCaDanhMucSach } from "../../lib/danh-muc-sach-apis";
import { MdOutlineDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import ThongBaoChay from "./ThongBaoChay";

const DINH_DANG = ["Bìa mềm", "Bìa cứng", "PDF", "Epub"];
const NGON_NGU = ["Tiếng Việt", "Tiếng Anh"];

function QuanLySach() {
  const [books, setBooks] = useState([]); // Mảng tất cả các quyển sách
  const [boLocTrangThai, setBoLocTrangThai] = useState("tatCa"); // "dangBan", "ngungBan", "tatCa"
  const [form, setForm] = useState({
    // Dữ liệu form thêm / sửa sách
    sachID: null,
    images: [],
    tenSach: "",
    tacGia: "",
    nhaXuatBan: "",
    ngayXuatBan: "",
    ngonNgu: "Tiếng Việt",
    danhMucSachID: 0,
    soTrang: 0,
    dinhDang: "Bìa mềm",
    giaBan: 0,
    giaGiam: 0,
    trangThaiBan: true,
    moTa: "",
  });
  const [editId, setEditId] = useState(null); // ID của sách đang sửa, null nếu không có
  const [thongBao, setThongBao] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const hienThongBao = useCallback((type, title, message) => {
    setThongBao({ show: true, type, title, message });
    setTimeout(
      () => setThongBao({ show: false, type: "info", title: "", message: "" }),
      3000
    );
  }, []);
  // Chuẩn hóa trạng thái bán của sách
  const chuanHoaTrangThaiBan = (value) => {
    if (value === undefined || value === null) return true;
    return (
      value === true ||
      value === 1 ||
      value === "1" ||
      value === "true" ||
      value === "dangBan"
    );
  };
  // Chuẩn hóa dữ liệu sách nhận từ API
  const chuanHoaSachTuApi = (book) => ({
    ...book,
    images: Array.isArray(book.images)
      ? book.images
      : book.images
      ? (() => {
          try {
            return JSON.parse(book.images);
          } catch {
            return [];
          }
        })()
      : [],
    trangThaiBan: chuanHoaTrangThaiBan(book.trangThaiBan),
    coPhieuNhap: Boolean(book.coPhieuNhap),
  });

  // Hàm nạp lại danh sách sách từ server
  const napLaiDanhSachSach = async () => {
    const booksData = await nhanTatCaCacQuyenSach();
    if (!booksData) return;
    const processedBooks = booksData.map((book) => chuanHoaSachTuApi(book));
    setBooks(processedBooks);
  };
  // --- PHÂN TRANG SÁCH ---
  // Số sách hiển thị mỗi trang (yêu cầu: 4)
  const soLuongSachMotTrang = 4; // 4 sách/trang
  // Trang sách hiện tại (1-based)
  const [trangSachHienTai, setTrangSachHienTai] = useState(1);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      // Append newly selected files so existing images are preserved
      setForm((prev) => ({
        ...prev,
        images: [
          ...(Array.isArray(prev.images) ? prev.images : []),
          ...Array.from(files),
        ],
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Xử lý submit form thêm / sửa sách
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      setBooks(
        books.map((b) => (b.id === editId ? { ...form, id: editId } : b)) //Tìm và cập nhật sách có id trùng với editId để cập nhật
      );
      // Nếu form.images có chứa các file (nghĩa là người dùng đã chọn hình ảnh mới để cập nhật) thì chúng ta sẽ upload hình ảnh mới lên Cloudinary
      // Kiểm tra xem người dùng có upload ảnh mới không
      const hasNewImages = form.images.some((img) => img instanceof File);

      if (hasNewImages) {
        // Nếu có ảnh mới, upload lên cloud
        const publicIDvaUrl = [];
        for (const img of form.images) {
          if (img instanceof File) {
            const result = await uploadHinhAnh(img);
            publicIDvaUrl.push(result);
          }
        }
        // Kết hợp ảnh mới với ảnh cũ (nếu có)
        const oldImages = form.images.filter((img) => !(img instanceof File));
        form.images = [...oldImages, ...publicIDvaUrl];
      }
      // Cập nhật sách trong database
      await capNhatSach(editId, {
        ...form,
        trangThaiBan: chuanHoaTrangThaiBan(form.trangThaiBan),
      });

      // Refresh lại danh sách sách từ server để đảm bảo dữ liệu đồng bộ
      await napLaiDanhSachSach();

      hienThongBao("success", "Thành công", "Cập nhật sách thành công!");
      setEditId(null);
    } else {
      setBooks([...books, { ...form, id: Date.now(), images: form.images }]);

      // Gọi API để upload hình ảnh lên server và lấy về URL của hình ảnh đó
      const publicIDvaUrl = []; // [{ public_id, url }, ... ]
      if (form.images.length > 0) {
        for (const img of form.images) {
          // Lặp qua từng hình (file) trong mảng images
          const result = await uploadHinhAnh(img); // Gọi API upload hình ảnh để upload hình ảnh lên Cloudinary
          console.log("Đang upload hình ảnh lên Cloud");
          publicIDvaUrl.push(result); // Lưu thông tin hình ảnh (public_id và url) vào mảng
        }
      }
      // Thay đổi giá trị images của form.images
      form.images = publicIDvaUrl; // Mảng này sẽ được gửi lên server khi thêm sách
      await themSach({
        ...form,
        trangThaiBan: chuanHoaTrangThaiBan(form.trangThaiBan),
      });
      // Refresh lại danh sách sách từ server để đảm bảo dữ liệu đồng bộ
      await napLaiDanhSachSach();
      // Gọi API để thêm sách vào database
      // Sau khi thêm sách thành công, chúng ta có thể làm gì đó, ví dụ như hiển thị thông báo
      hienThongBao("success", "Thành công", "Thêm sách thành công!");
    }
    setForm({
      id: null,
      images: [],
      tenSach: "",
      tacGia: "",
      nhaXuatBan: "",
      ngayXuatBan: "",
      ngonNgu: "Tiếng Việt",
      danhMucSachID: 0,
      soTrang: 0,
      dinhDang: "Bìa mềm",
      giaBan: 0,
      giaGiam: 0,
      trangThaiBan: true,
      moTa: "",
    });
  };

  // Xử lý khi nhấn nút sửa sách
  const handleEdit = (book) => {
    const ngayXuatBan = new Date(book.ngayXuatBan);
    const formatDate = ngayXuatBan.toISOString().split("T")[0];
    // Đảm bảo giữ lại hình ảnh cũ
    const oldImages = book.images || [];
    setForm({
      ...book,
      ngayXuatBan: formatDate,
      images: oldImages, // Giữ lại mảng hình ảnh cũ
      trangThaiBan: chuanHoaTrangThaiBan(book.trangThaiBan),
    });
    setEditId(book.sachID);
  };

  // Xóa 1 ảnh tại vị trí index trong form.images
  const removeImageAt = (index) => {
    setForm((prev) => ({
      ...prev,
      images: Array.isArray(prev.images)
        ? prev.images.filter((_, i) => i !== index)
        : [],
    }));
  };

  // Hủy (clear) form và thoát chế độ sửa
  const handleCancel = () => {
    setForm({
      sachID: null,
      images: [],
      tenSach: "",
      tacGia: "",
      nhaXuatBan: "",
      ngayXuatBan: "",
      ngonNgu: "Tiếng Việt",
      danhMucSachID: 0,
      soTrang: 0,
      dinhDang: "Bìa mềm",
      giaBan: 0,
      giaGiam: 0,
      moTa: "",
      trangThaiBan: true,
    });
    setEditId(null);
  };

  // Xử lý xóa sách
  const handleDelete = async (sachID) => {
    // Tìm sách cần xóa trong state
    const bookToDelete = books.find((b) => b.sachID === sachID);
    if (!bookToDelete) {
      hienThongBao("warning", "Chú ý", "Không tìm thấy sách để xóa.");
      return;
    }

    // Xác nhận hành động
    const ok = window.confirm("Bạn có chắc muốn xóa sách này không?");
    if (!ok) return;

    // Gọi API xóa sách trước. Backend sẽ xóa các HinhAnh liên quan rồi xóa Sach.
    const resp = await xoaSach(sachID);
    if (resp && resp.success) {
      // Sau khi xóa thành công ở server, xóa file trên Cloudinary (nếu muốn)
      if (Array.isArray(bookToDelete.images)) {
        for (const img of bookToDelete.images) {
          try {
            await xoaHinhAnhKhoiS3(img.public_id);
          } catch (e) {
            console.warn("Không xóa được file cloudinary:", img, e);
          }
        }
      }

      // Cập nhật state UI
      setBooks((prev) => prev.filter((b) => b.sachID !== sachID));

      // Phát sự kiện toàn cục để các component khác load lại dữ liệu
      try {
        window.dispatchEvent(new Event("booksUpdated"));
      } catch (e) {
        console.warn("Không thể dispatch event booksUpdated:", e);
      }

      hienThongBao("success", "Thành công", "Xóa sách thành công!");
    } else {
      hienThongBao(
        "error",
        "Thất bại",
        resp?.message || "Xóa sách thất bại, vui lòng thử lại."
      );
    }
  };

  // Hàm định dạng ngày tháng từ ISO sang dd/mm/yyyy
  const formatDate = (isoDate) => {
    if (!isoDate) return "";

    // 1. Tách chuỗi tại ký tự 'T' để loại bỏ phần giờ và múi giờ
    // Ví dụ: "2025-10-03T00:00:00.000Z" sẽ thành ["2025-10-03", "00:00:00.000Z"]
    const datePart = isoDate.split("T")[0];

    // 2. Tách phần ngày-tháng-năm (đã được làm sạch)
    const [year, month, day] = datePart.split("-");

    // 3. Trả về định dạng mong muốn
    return `${day}/${month}/${year}`; // Định dạng dd/mm/yyyy
  };

  // Xử lý ngừng bán sách
  const xuLyNgungBan = async (book) => {
    const ok = window.confirm("Bạn có chắc muốn ngừng bán sản phẩm này?");
    if (!ok) return;
    const resp = await capNhatTrangThaiBanSach(book.sachID, false);
    if (!resp || resp.success === false) {
      hienThongBao(
        "error",
        "Thất bại",
        resp?.message || "Không thể ngừng bán sản phẩm."
      );
      return;
    }
    await napLaiDanhSachSach();
    hienThongBao(
      "success",
      "Thành công",
      "Đã chuyển sách sang trạng thái ngừng bán."
    );
  };

  // Xử lý bán lại sách
  const xuLyBanLai = async (book) => {
    const ok = window.confirm("Bạn có muốn mở bán lại sản phẩm này?");
    if (!ok) return;
    const resp = await capNhatTrangThaiBanSach(book.sachID, true);
    if (!resp || resp.success === false) {
      hienThongBao(
        "error",
        "Thất bại",
        resp?.message || "Không thể mở bán lại sản phẩm."
      );
      return;
    }
    await napLaiDanhSachSach();
    hienThongBao(
      "success",
      "Thành công",
      "Đã chuyển sách sang trạng thái đang bán."
    );
  };

  // Nạp lại danh sách sách khi component được gắn vào DOM
  useEffect(() => {
    napLaiDanhSachSach();
  }, []);

  // --- LỌC SÁCH THEO TRẠNG THÁI ---
  const sachDaLoc = books.filter((book) => {
    const trangThai = chuanHoaTrangThaiBan(book.trangThaiBan);
    if (boLocTrangThai === "dangBan") return trangThai;
    if (boLocTrangThai === "ngungBan") return !trangThai;
    return true;
  });

  // --- TÍNH PHÂN TRANG ---
  const tongTrangSach = Math.max(
    1,
    Math.ceil(sachDaLoc.length / soLuongSachMotTrang)
  );

  // Nếu số trang thay đổi (ví dụ sau khi xóa), đảm bảo trang hiện tại hợp lệ
  useEffect(() => {
    if (trangSachHienTai > tongTrangSach) {
      setTrangSachHienTai(tongTrangSach);
    }
  }, [tongTrangSach, trangSachHienTai]);

  // Mảng sách sẽ hiển thị trên trang hiện tại
  const sachHienThi = sachDaLoc.slice(
    (trangSachHienTai - 1) * soLuongSachMotTrang,
    trangSachHienTai * soLuongSachMotTrang
  );

  // Kiểm tra 1 biến có phải là 1 file hay không để hiển thị hình ảnh khi cập nhật
  const isFile = (obj) => {
    return obj instanceof File;
  };

  // Chuẩn hóa ảnh hiển thị (file hoặc url)
  const chuanHoaAnhHienThi = (anh) => {
    if (isFile(anh)) {
      return { url: URL.createObjectURL(anh) };
    }
    return anh;
  };

  // Modal xem ảnh (chỉ cho phần hình ảnh)
  const [anhModal, setAnhModal] = useState({ hien: false, dsAnh: [] });

  // Mở modal xem ảnh với danh sách ảnh
  const moModalAnh = (dsAnh) => {
    const ds = Array.isArray(dsAnh) ? dsAnh : [];
    setAnhModal({
      hien: true,
      dsAnh: ds.map((anh) => chuanHoaAnhHienThi(anh)),
    });
  };

  const dongModalAnh = () => setAnhModal({ hien: false, dsAnh: [] });

  // Tạo thêm 1 biến trạng thái để lưu dữ liệu danh mục sách
  const [danhMucSach, setDanhMucSach] = useState([]);

  // Nạp dữ liệu danh mục sách
  useEffect(() => {
    const napDanhMucSach = async () => {
      const duLieuDM = await nhanTatCaDanhMucSach();
      if (duLieuDM) {
        console.log("Dữ liệu danh mục sách:", duLieuDM);
        setDanhMucSach(duLieuDM);
      }
    };
    napDanhMucSach();
  }, []);

  return (
    <div className="w-full space-y-6">
      <ThongBaoChay
        show={thongBao.show}
        type={thongBao.type}
        title={thongBao.title}
        message={thongBao.message}
        onClose={() =>
          setThongBao({ show: false, type: "info", title: "", message: "" })
        }
      />
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Quản lý sách
          </h1>
        </div>
      </div>

      {/* Form thêm / sửa sách */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#00809D] to-[#00a0c0] px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            {editId ? "✏️ Chỉnh sửa sách" : "➕ Thêm sách mới"}
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Images Section */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Hình ảnh sản phẩm
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-[#00809D] transition-colors">
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00809D] file:text-white hover:file:bg-[#006f89] file:cursor-pointer cursor-pointer"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Chọn một hoặc nhiều hình ảnh
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {form.images &&
                  Array.from(form.images).map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={isFile(img) ? URL.createObjectURL(img) : img.url}
                        alt={`preview-${idx}`}
                        className="w-24 h-24 object-cover rounded-lg border-2 border-slate-200 shadow-sm group-hover:shadow-md transition-shadow"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageAt(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Xóa ảnh"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Form Fields */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-black"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tên sách <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tenSach"
                  value={form.tenSach}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00809D] focus:border-transparent transition-all"
                  required
                  placeholder="Nhập tên sách"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tác giả <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tacGia"
                  value={form.tacGia}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00809D] focus:border-transparent transition-all"
                  required
                  placeholder="Nhập tên tác giả"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nhà xuất bản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nhaXuatBan"
                  value={form.nhaXuatBan}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00809D] focus:border-transparent transition-all"
                  required
                  placeholder="Nhập nhà xuất bản"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ngày xuất bản <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="ngayXuatBan"
                  value={form.ngayXuatBan}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00809D] focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ngôn ngữ
                </label>
                <select
                  name="ngonNgu"
                  value={form.ngonNgu}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00809D] focus:border-transparent transition-all bg-white"
                >
                  {NGON_NGU.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Danh mục sách
                </label>
                <select
                  name="danhMucSachID"
                  value={form.danhMucSachID}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00809D] focus:border-transparent transition-all bg-white"
                >
                  {danhMucSach.map((loai) => (
                    <option key={loai.danhMucSachID} value={loai.danhMucSachID}>
                      {loai.tenDanhMuc}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Số trang
                </label>
                <input
                  type="number"
                  name="soTrang"
                  value={form.soTrang}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00809D] focus:border-transparent transition-all"
                  min="1"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Định dạng
                </label>
                <select
                  name="dinhDang"
                  value={form.dinhDang}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00809D] focus:border-transparent transition-all bg-white"
                >
                  {DINH_DANG.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Giá bán (VNĐ)
                </label>
                <input
                  type="number"
                  name="giaBan"
                  value={form.giaBan}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00809D] focus:border-transparent transition-all"
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Giá giảm (VNĐ)
                </label>
                <input
                  type="number"
                  name="giaGiam"
                  value={form.giaGiam}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00809D] focus:border-transparent transition-all"
                  min="0"
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="moTa"
                  value={form.moTa}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 h-32 focus:outline-none focus:ring-2 focus:ring-[#00809D] focus:border-transparent transition-all resize-none"
                  placeholder="Nhập mô tả sách..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#00809D] text-white rounded-lg hover:bg-[#006f89] font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  {editId ? "Cập nhật sách" : "Thêm sách mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Danh sách sách */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Danh sách sách
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700 ">
                  Lọc trạng thái
                </label>
                <select
                  value={boLocTrangThai}
                  onChange={(e) => setBoLocTrangThai(e.target.value)}
                  className=" text-black border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00809D] focus:border-transparent bg-white"
                >
                  <option value="tatCa">Tất cả</option>
                  <option value="dangBan">Đang bán</option>
                  <option value="ngungBan">Ngừng bán</option>
                </select>
              </div>
              <div className="text-sm text-slate-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                <span className="font-medium text-blue-700">
                  {sachDaLoc.length} sách
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Tên sách
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  NXB
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Giá bán
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Giá giảm
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {books && books.length > 0 ? (
                sachHienThi.map((book, idx) => {
                  const danhSachAnh = Array.isArray(book.images)
                    ? book.images.map((anh) => chuanHoaAnhHienThi(anh))
                    : [];
                  const anhDauTien =
                    danhSachAnh.length > 0 ? danhSachAnh[0] : null;
                  const tenDanhMuc =
                    danhMucSach.find(
                      (dm) => dm.danhMucSachID === book.danhMucSachID
                    )?.tenDanhMuc || "N/A";

                  return (
                    <tr
                      key={book.sachID}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {(trangSachHienTai - 1) * soLuongSachMotTrang + idx + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {anhDauTien ? (
                          <div className="relative group">
                            <img
                              src={anhDauTien.url}
                              alt={book.tenSach}
                              className="w-16 h-16 object-cover rounded-lg border-2 border-slate-200 cursor-pointer hover:border-[#00809D] transition-all shadow-sm"
                              onClick={() => moModalAnh(danhSachAnh)}
                            />
                            {danhSachAnh.length > 1 && (
                              <div className="absolute -bottom-1 -right-1 bg-[#00809D] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-md font-semibold">
                                +{danhSachAnh.length - 1}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                            <span className="text-xs text-slate-400">N/A</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-slate-900 max-w-xs">
                          {book.tenSach}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {tenDanhMuc} • {book.soTrang} trang • {book.dinhDang}
                          <br />
                          Ngày xuất bản: {formatDate(book.ngayXuatBan)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700">
                        {book.tacGia}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700">
                        {book.nhaXuatBan}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900">
                          {book.giaBan.toLocaleString()}₫
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-red-600">
                          {book.giaGiam.toLocaleString()}₫
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            book.trangThaiBan
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {book.trangThaiBan ? "✓ Đang bán" : "⊘ Ngừng bán"}
                        </span>
                        {book.coPhieuNhap && (
                          <div className="text-xs text-blue-600 mt-1 font-medium">
                            📦 Đã có phiếu nhập
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(book)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Sửa"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          {book.trangThaiBan ? (
                            <button
                              onClick={() => xuLyNgungBan(book)}
                              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-600 text-black text-xs font-semibold rounded-lg transition-all shadow-sm"
                            >
                              Ngừng bán
                            </button>
                          ) : (
                            <button
                              onClick={() => xuLyBanLai(book)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
                            >
                              Bán lại
                            </button>
                          )}
                          {book.trangThaiBan && !book.coPhieuNhap && (
                            <button
                              onClick={() => handleDelete(book.sachID)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Xóa"
                            >
                              <MdOutlineDelete className="text-lg" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-12 text-center">
                    <div className="text-slate-400">
                      <svg
                        className="mx-auto h-12 w-12 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <p className="text-lg font-medium">Chưa có sách nào</p>
                      <p className="text-sm mt-1">
                        Hãy thêm sách mới để bắt đầu
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {tongTrangSach > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Hiển thị{" "}
                <span className="font-semibold text-slate-900">
                  {(trangSachHienTai - 1) * soLuongSachMotTrang + 1}
                </span>{" "}
                -{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(
                    trangSachHienTai * soLuongSachMotTrang,
                    sachDaLoc.length
                  )}
                </span>{" "}
                của{" "}
                <span className="font-semibold text-slate-900">
                  {sachDaLoc.length}
                </span>{" "}
                sách
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setTrangSachHienTai(Math.max(1, trangSachHienTai - 1))
                  }
                  disabled={trangSachHienTai === 1}
                  className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                    trangSachHienTai === 1
                      ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-[#00809D]"
                  }`}
                >
                  ← Trước
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: tongTrangSach }).map((_, i) => {
                    const page = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === tongTrangSach ||
                      (page >= trangSachHienTai - 1 &&
                        page <= trangSachHienTai + 1)
                    ) {
                      return (
                        <button
                          key={i}
                          onClick={() => setTrangSachHienTai(page)}
                          className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                            trangSachHienTai === page
                              ? "bg-[#00809D] text-white border-[#00809D] shadow-sm"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-[#00809D]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === trangSachHienTai - 2 ||
                      page === trangSachHienTai + 2
                    ) {
                      return (
                        <span key={i} className="px-2 text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() =>
                    setTrangSachHienTai(
                      Math.min(tongTrangSach, trangSachHienTai + 1)
                    )
                  }
                  disabled={trangSachHienTai === tongTrangSach}
                  className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                    trangSachHienTai === tongTrangSach
                      ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-[#00809D]"
                  }`}
                >
                  Tiếp →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal xem ảnh */}
      {anhModal.hien && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-800">
                Hình ảnh sản phẩm
              </h3>
              <button
                onClick={dongModalAnh}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {anhModal.dsAnh && anhModal.dsAnh.length > 0 ? (
                  anhModal.dsAnh.map((a, i) => (
                    <div
                      key={i}
                      className="group relative bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200 hover:border-[#00809D] transition-all"
                    >
                      <img
                        src={a.url}
                        alt={`img-${i}`}
                        className="w-full h-64 object-contain rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Hình {i + 1} / {anhModal.dsAnh.length}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    <svg
                      className="mx-auto h-12 w-12 mb-4 text-slate-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p>Không có ảnh để hiển thị</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLySach;
