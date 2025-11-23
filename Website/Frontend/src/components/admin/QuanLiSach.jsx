import React, { useState } from "react";
import { capNhatSach, themSach, xoaSach } from "../../lib/sach-apis";
import { uploadHinhAnh, xoaHinhAnhCloudinary } from "../../lib/hinh-anh-apis";
import { useEffect } from "react";
import { nhanTatCaCacQuyenSach } from "../../lib/sach-apis";
import { nhanTatCaDanhMucSach } from "../../lib/danh-muc-sach-apis";
import { MdOutlineDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const DINH_DANG = ["Bìa mềm", "Bìa cứng", "PDF", "Epub"];
const NGON_NGU = ["Tiếng Việt", "Tiếng Anh"];

function QuanLiSach() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
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
    soLuongConLai: 0,
    giaNhap: 0,
    giaBan: 0,
    giaGiam: 0,
    moTa: "",
  });
  const [editId, setEditId] = useState(null);

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

    //Kiểm tra dữ liệu form
    console.log("Dữ liệu form ", form);

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
      await capNhatSach(editId, form);

      // Cập nhật state books để hiển thị ngay lập tức
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.sachID === editId ? { ...form, sachID: editId } : book
        )
      );

      // Refresh lại danh sách sách từ server để đảm bảo dữ liệu đồng bộ
      const updatedBooks = await nhanTatCaCacQuyenSach();
      const processedBooks = updatedBooks.map((book) => ({
        ...book,
        images: book.images ? JSON.parse(book.images) : [],
      }));
      setBooks(processedBooks);

      alert("Cập nhật sách thành công!");
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
      await themSach(form);
      // Cập nhật state books để hiển thị ngay lập tức
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.sachID === editId ? { ...form, sachID: editId } : book
        )
      );

      // Refresh lại danh sách sách từ server để đảm bảo dữ liệu đồng bộ
      const updatedBooks = await nhanTatCaCacQuyenSach();
      const processedBooks = updatedBooks.map((book) => ({
        ...book,
        images: book.images ? JSON.parse(book.images) : [],
      }));
      setBooks(processedBooks);
      // Gọi API để thêm sách vào database
      // Sau khi thêm sách thành công, chúng ta có thể làm gì đó, ví dụ như hiển thị thông báo
      alert("Thêm sách thành công!");
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
      soLuongConLai: 0,
      giaNhap: 0,
      giaBan: 0,
      giaGiam: 0,
    });
  };

  const handleEdit = (book) => {
    const ngayXuatBan = new Date(book.ngayXuatBan);
    const formatDate = ngayXuatBan.toISOString().split("T")[0];
    // Đảm bảo giữ lại hình ảnh cũ
    const oldImages = book.images || [];
    setForm({
      ...book,
      ngayXuatBan: formatDate,
      images: oldImages, // Giữ lại mảng hình ảnh cũ
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
      soLuongConLai: 0,
      giaNhap: 0,
      giaBan: 0,
      giaGiam: 0,
      moTa: "",
    });
    setEditId(null);
  };

  const handleDelete = async (sachID) => {
    // Tìm sách cần xóa trong state
    const bookToDelete = books.find((b) => b.sachID === sachID);
    if (!bookToDelete) {
      alert("Không tìm thấy sách để xóa.");
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
            await xoaHinhAnhCloudinary(img.public_id);
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

      alert("Xóa sách thành công!");
    } else {
      alert("Xóa sách thất bại: " + (resp?.message || "Lỗi server"));
    }
  };

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

  // useEffect để gọi API lấy tất cả các quyển sách từ database khi component được mount (kết nối, hiển thị) lần đầu tiên
  useEffect(() => {
    const napDuLieuSach = async () => {
      const booksData = await nhanTatCaCacQuyenSach();

      // Lặp qua mảng kết quản để chúng ta chuyển trường images từ chuỗi JSON thành mảng
      booksData.forEach((book) => {
        if (book.images) {
          book.images = JSON.parse(book.images); // Chuyển chuỗi JSON thành mảng
        } else {
          book.images = []; // Nếu không có trường images thì gán mảng rỗng
        }
      });
      console.log("Dữ liệu sách nhận từ API:", booksData);
      setBooks(booksData);
    };
    napDuLieuSach();
  }, []);

  // Kiểm tra 1 biến có phải là 1 file hay không để hiển thị hình ảnh khi cập nhật
  const isFile = (obj) => {
    return obj instanceof File;
  };

  // Modal xem ảnh (chỉ cho phần hình ảnh)
  const [anhModal, setAnhModal] = useState({ hien: false, dsAnh: [] });

  const moModalAnh = (dsAnh) => {
    const ds = Array.isArray(dsAnh) ? dsAnh : [];
    setAnhModal({ hien: true, dsAnh: ds });
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
    <div className="w-full max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-[#00809D] mb-8 text-center">
        📚 Quản lý sách
      </h1>

      {/* Form thêm / sửa sách */}
      <div className="bg-emerald-900 shadow-lg rounded-xl p-6 mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <label className="block font-semibold mb-2 text-white">
            Hình ảnh sản phẩm
          </label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="mb-3"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images &&
              Array.from(form.images).map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={isFile(img) ? URL.createObjectURL(img) : img.url}
                    alt={`preview-${idx}`}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageAt(idx)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                    title="Xóa ảnh"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block font-medium mb-1">Tên sách</label>
            <input
              type="text"
              name="tenSach"
              value={form.tenSach}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Tác giả</label>
            <input
              type="text"
              name="tacGia"
              value={form.tacGia}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Nhà xuất bản</label>
            <input
              type="text"
              name="nhaXuatBan"
              value={form.nhaXuatBan}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Ngày xuất bản</label>
            <input
              type="date"
              name="ngayXuatBan"
              value={form.ngayXuatBan}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Ngôn ngữ</label>
            <select
              name="ngonNgu"
              value={form.ngonNgu}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
            >
              {NGON_NGU.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className=" block font-medium mb-1">Danh mục sách</label>
            <select
              name="danhMucSachID"
              value={form.danhMucSachID}
              onChange={handleChange}
              className="text-white bg-emerald-900 w-full border rounded p-2 mb-3"
            >
              {danhMucSach.map((loai) => (
                <option key={loai.danhMucSachID} value={loai.danhMucSachID}>
                  {loai.tenDanhMuc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Số trang</label>
            <input
              type="number"
              name="soTrang"
              value={form.soTrang}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
              min="1"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Định dạng</label>
            <select
              name="dinhDang"
              value={form.dinhDang}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
            >
              {DINH_DANG.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Số lượng</label>
            <input
              type="number"
              name="soLuongConLai"
              value={form.soLuongConLai}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
              min="0"
            />
          </div>
          <div>
            <label className="block font.medium mb-1">Giá Nhập</label>
            <input
              type="number"
              name="giaNhap"
              value={form.giaNhap}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
              min="0"
            />
          </div>
          <div>
            <label className="block font.medium mb-1">Giá Bán</label>
            <input
              type="number"
              name="giaBan"
              value={form.giaBan}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
              min="0"
            />
          </div>
          <div>
            <label className="block font.medium mb-1">Giá giảm</label>
            <input
              type="number"
              name="giaGiam"
              value={form.giaGiam}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
              min="0"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Mô tả</label>
            <textarea
              name="moTa"
              value={form.moTa}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-2 h-32"
              placeholder="Nhập mô tả sách..."
            />
          </div>
          <div className="md:col-span-2 flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-[#00809D] text-white px-6 py-2 rounded hover:bg-[#006f89] font-semibold transition"
            >
              {editId ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>

      {/* Danh sách sách */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-[#00809D]">
          📖 Danh sách sách
        </h2>
        <div className="overflow-auto max-h-[600px] rounded border border-gray-200">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-emerald-900 text-white sticky top-0">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Hình ảnh</th>
                <th className="p-2">Tên sách</th>
                <th className="p-2">Tác giả</th>
                <th className="p-2">NXB</th>
                <th className="p-2">Ngày XB</th>
                <th className="p-2">Ngôn ngữ</th>
                <th className="p-2">Danh mục sách</th>
                <th className="p-2">Trang</th>
                <th className="p-2">Định dạng</th>
                <th className="p-2">SL</th>
                <th className="p-2">Giá nhập</th>
                <th className="p-2">Giá bán</th>
                <th className="p-2">Giá giảm</th>
                <th className="p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {books &&
                books.length > 0 &&
                books.map((book, idx) => (
                  <tr key={book.sachID} className="even:bg-gray-100 text-black">
                    <td className="p-2 font-bold">{idx + 1}</td>
                    <td className="p-2">
                      <div className="flex items-center">
                        {book.images && book.images.length > 0 ? (
                          <div className="relative">
                            <img
                              src={book.images[0].url}
                              alt="book"
                              className="w-12 h-12 object-cover rounded border cursor-pointer"
                              onClick={() => moModalAnh(book.images)}
                            />
                            {book.images.length > 1 && (
                              <div className="absolute -bottom-1 -right-1 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border border-white">
                                +{book.images.length - 1}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Không có ảnh</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2">{book.tenSach}</td>
                    <td className="p-2">{book.tacGia}</td>
                    <td className="p-2">{book.nhaXuatBan}</td>
                    <td className="p-2">{formatDate(book.ngayXuatBan)}</td>
                    <td className="p-5">{book.ngonNgu}</td>
                    <td className="p-8">{book.danhMucSachID}</td>
                    <td className="p-2">{book.soTrang}</td>
                    <td className="p-4">{book.dinhDang}</td>
                    <td className="p-2">{book.soLuongConLai}</td>
                    <td className="p-2">{book.giaNhap.toLocaleString()} VNĐ</td>
                    <td className="p-2">{book.giaBan.toLocaleString()} VNĐ</td>
                    <td className="p-2">{book.giaGiam.toLocaleString()} VNĐ</td>
                    <td className="p-2 flex gap-2">
                      <button onClick={() => handleEdit(book)}>
                        <FaEdit className="text-blue-600 text-2xl hover:text-red-500 mt-2" />
                      </button>

                      <button onClick={() => handleDelete(book.sachID)}>
                        <MdOutlineDelete className="text-red-600 text-3xl hover:text-blue-500 mt-2" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal xem ảnh (chỉ ảnh của sách khi bấm thumbnail) */}
      {anhModal.hien && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-4xl w-full p-4 relative">
            <button
              onClick={dongModalAnh}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {anhModal.dsAnh && anhModal.dsAnh.length > 0 ? (
                anhModal.dsAnh.map((a, i) => (
                  <div key={i} className="flex items-center justify-center p-2">
                    <img
                      src={a.url}
                      alt={`img-${i}`}
                      className="max-h-[60vh] object-contain rounded shadow"
                    />
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">Không có ảnh</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLiSach;
