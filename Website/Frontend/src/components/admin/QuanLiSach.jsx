import React, { useState } from "react";
import { capNhatSach, themSach, xoaSach } from "../../lib/sach-apis";
import { uploadHinhAnh, xoaHinhAnhCloudinary } from "../../lib/hinh-anh-apis";
import { useEffect } from "react";
import { nhanTatCaCacQuyenSach } from "../../lib/sach-apis";
import { MdOutlineDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

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
  // State quản lý danh sách sách
  const [books, setBooks] = useState([]);
  // State quản lý form thêm / sửa sách
  const [form, setForm] = useState({
    sachID: null,
    images: [],
    tenSach: "",
    tacGia: "",
    nhaXuatBan: "",
    ngayXuatBan: "",
    ngonNgu: "Tiếng Việt",
    loaiSach: "Truyện tranh",
    soTrang: 0,
    dinhDang: "Bìa mềm",
    soLuongConLai: 0,
    giaNhap: 0,
    giaBan: 0,
    giaGiam: 0,
    ISBN13: "",
  });
  // State quản lý id sách đang được sửa
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
      loaiSach: "Truyện tranh",
      soTrang: 0,
      dinhDang: "Bìa mềm",
      soLuongConLai: 0,
      giaNhap: 0,
      giaBan: 0,
      giaGiam: 0,
      ISBN13: "",
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

  const handleDelete = async (sachID) => {
    setBooks(books.filter((b) => b.sachID !== sachID)); // Lọc bỏ quyển sách có id trùng với id được truyền vào hàm

    // Xóa hình ảnh của quyển sách khỏi Cloudinary
    const bookToDelete = books.find((b) => b.sachID === sachID);

    console.log("Quyển sách cần xóa:", bookToDelete);

    if (bookToDelete) {
      // Nếu tìm thấy quyển sách cần xóa
      bookToDelete.images.forEach(async (img) => {
        console.log("Đang xóa hình ảnh khỏi Cloudinary:", img);
        await xoaHinhAnhCloudinary(img.public_id);
      });
    }
    // Xóa dữ liệu quyển sách khỏi database
    await xoaSach(sachID); // Gọi API xóa quyển sách khỏi database
    alert("Xóa sách thành công!");
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

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-[#00809D] mb-8 text-center">
        📚 Quản lý sách
      </h1>

      {/* Form thêm / sửa sách */}
      <div className="bg-amber-900 shadow-lg rounded-xl p-6 mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <div>
                  <img
                    key={idx}
                    src={isFile(img) ? URL.createObjectURL(img) : img.url}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
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
            <label className=" block font.medium mb-1">Loại sách</label>
            <select
              name="loaiSach"
              value={form.loaiSach}
              onChange={handleChange}
              className="text-white bg-amber-900 w-full border rounded p-2 mb-3"
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
            <label className="block font-medium mb-1">ISBN13</label>
            <input
              type="text"
              name="ISBN13"
              value={form.ISBN13}
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
                <th className="p-2">Giá nhập</th>
                <th className="p-2">Giá bán</th>
                <th className="p-2">Giá giảm</th>
                <th className="p-2">ISBN13</th>
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
                      <div className="flex flex-wrap gap-1">
                        {book.images && book.images.length > 0 ? (
                          book.images.map((img, i) => (
                            <img
                              key={i}
                              src={img.url}
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
                    <td className="p-2">{book.soLuongConLai}</td>
                    <td className="p-2">{book.giaNhap.toLocaleString()} VNĐ</td>
                    <td className="p-2">{book.giaBan.toLocaleString()} VNĐ</td>
                    <td className="p-2">{book.giaGiam.toLocaleString()} VNĐ</td>
                    <td className="p-2">{book.ISBN13}</td>
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
    </div>
  );
}

export default QuanLiSach;
