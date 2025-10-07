import React, { useState } from "react";
import img1 from "../../lib/../assets/sach1.webp";

const initialBooks = [
  {
    id: 1,
    images: [img1],
    tenSach: "Thần Đồng Đất Phương Nam",
    tacGia: "Nguyễn Nhật Ánh",
    nhaXuatBan: "NXB Kim Đồng",
    ngayXuatBan: "2022-01-01",
    ngonNgu: "Tiếng Việt",
    loaiSach: "Truyện tranh",
    soTrang: 200,
    dinhDang: "Bìa mềm",
    soLuong: 50,
    giaGoc: 120000,
    giaGiam: 90000,
    isbn13: "9786042091234",
  },
];

const LOAI_SACH = [
  "Truyện tranh",
  "Ngôn tình",
  "Phiêu lưu",
  "Kinh dị",
  "Sách giáo khoa",
  "Sách kỹ năng",
];

const DINH_DANG = ["Bìa mềm", "Bìa cứng", "PDF", "Epub"];
const NGON_NGU = ["Tiếng Việt", "Tiếng Anh"];

function QuanLiSach() {
  const [books, setBooks] = useState(initialBooks);
  const [form, setForm] = useState({
    id: null,
    images: [],
    tenSach: "",
    tacGia: "",
    nhaXuatBan: "",
    ngayXuatBan: "",
    ngonNgu: "Tiếng Việt",
    loaiSach: "Truyện tranh",
    soTrang: 0,
    dinhDang: "Bìa mềm",
    soLuong: 0,
    giaGoc: 0,
    giaGiam: 0,
    isbn13: "",
  });
  const [editId, setEditId] = useState(null);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, images: Array.from(files) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  // Xử lý submit form thêm / sửa sách
  const handleSubmit = (e) => {
    e.preventDefault();

    // (Tuỳ chọn) kiểm tra dữ liệu
    if (form.giaGiam > form.giaGoc) {
      alert("Giá giảm không được lớn hơn giá gốc!");
      return;
    }
    if (!/^\d{13}$/.test(form.isbn13)) {
      alert("ISBN13 phải gồm đúng 13 chữ số!");
      return;
    }
    // Cập nhật sách nếu đang sửa, hoặc thêm mới
    if (editId) {
      setBooks(
        books.map((b) => (b.id === editId ? { ...form, id: editId } : b))
      );
      setEditId(null);
    } else {
      setBooks([...books, { ...form, id: Date.now(), images: form.images }]);
    }

    setForm({
      id: null,
      images: [],
      tenSach: "",
      tacGia: "",
      nhaXuatBan: "",
      ngayXuatBan: "",
      ngonNgu: "Tiếng Việt",
      loaiSach: "Truyện tranh",
      soTrang: 0,
      dinhDang: "Bìa mềm",
      soLuong: 0,
      giaGoc: 0,
      giaGiam: 0,
      isbn13: "",
    });
  };

  const handleEdit = (book) => {
    // giữ ảnh cũ hoặc loại bỏ, tuỳ bạn
    setForm({ ...book });
    setEditId(book.id);
  };

  const handleDelete = (id) => {
    setBooks(books.filter((b) => b.id !== id));
    // Nếu đang sửa chính sách này, reset form
    if (editId === id) {
      setEditId(null);
      setForm({
        id: null,
        images: [],
        tenSach: "",
        tacGia: "",
        nhaXuatBan: "",
        ngayXuatBan: "",
        ngonNgu: "Tiếng Việt",
        loaiSach: "Truyện tranh",
        soTrang: 0,
        dinhDang: "Bìa mềm",
        soLuong: 0,
        giaGoc: 0,
        giaGiam: 0,
        isbn13: "",
      });
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-[#00809D] mb-8 text-center">
        📚 Quản lý sách
      </h1>

      {/* Form thêm / sửa sách */}
      <div className="bg-black shadow-lg rounded-xl p-6 mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              form.images.map((img, idx) => (
                <img
                  key={idx}
                  src={typeof img === "string" ? img : URL.createObjectURL(img)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
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
            <label className="block font.medium mb-1">Loại sách</label>
            <select
              name="loaiSach"
              value={form.loaiSach}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
            >
              {LOAI_SACH.map((loai) => (
                <option key={loai} value={loai}>
                  {loai}
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
              name="soLuong"
              value={form.soLuong}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
              min="0"
            />
          </div>
          <div>
            <label className="block font.medium mb-1">Giá gốc</label>
            <input
              type="number"
              name="giaGoc"
              value={form.giaGoc}
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
            <label className="block font-medium mb-1">ISBN13</label>
            <input
              type="text"
              name="isbn13"
              value={form.isbn13}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
              required
            />
          </div>
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-[#00809D] text-white px-6 py-2 rounded hover:bg-[#006f89] font-semibold transition"
            >
              {editId ? "Cập nhật" : "➕ Thêm mới"}
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
            <thead className="bg-[#00809D] text-white sticky top-0">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Hình ảnh</th>
                <th className="p-2">Tên sách</th>
                <th className="p-2">Tác giả</th>
                <th className="p-2">NXB</th>
                <th className="p-2">Ngày XB</th>
                <th className="p-2">Ngôn ngữ</th>
                <th className="p-2">Loại</th>
                <th className="p-2">Trang</th>
                <th className="p-2">Định dạng</th>
                <th className="p-2">SL</th>
                <th className="p-2">Giá gốc</th>
                <th className="p-2">Giá giảm</th>
                <th className="p-2">ISBN13</th>
                <th className="p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, idx) => (
                <tr key={book.id} className="even:bg-gray-100 text-black">
                  <td className="p-2 font-bold">{idx + 1}</td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {book.images && book.images.length > 0 ? (
                        book.images.map((img, i) => (
                          <img
                            key={i}
                            src={
                              typeof img === "string"
                                ? img
                                : URL.createObjectURL(img)
                            }
                            alt="book"
                            className="w-10 h-10 object-cover rounded border"
                          />
                        ))
                      ) : (
                        <span className="text-gray-400">Không có ảnh</span>
                      )}
                    </div>
                  </td>
                  <td className="p-2">{book.tenSach}</td>
                  <td className="p-2">{book.tacGia}</td>
                  <td className="p-2">{book.nhaXuatBan}</td>
                  <td className="p-2">{formatDate(book.ngayXuatBan)}</td>
                  <td className="p-2">{book.ngonNgu}</td>
                  <td className="p-2">{book.loaiSach}</td>
                  <td className="p-2">{book.soTrang}</td>
                  <td className="p-2">{book.dinhDang}</td>
                  <td className="p-2">{book.soLuong}</td>
                  <td className="p-2">{book.giaGoc.toLocaleString()} VNĐ</td>
                  <td className="p-2">{book.giaGiam.toLocaleString()} VNĐ</td>
                  <td className="p-2">{book.isbn13}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default QuanLiSach;
