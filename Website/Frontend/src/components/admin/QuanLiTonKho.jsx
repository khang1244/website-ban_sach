import React, { useEffect, useState, useCallback } from "react";
import { layTonKho } from "../../lib/phieu-nhap-apis";
import { layTatCaPhieuNhap, taoPhieuNhap } from "../../lib/phieu-nhap-apis";
import { layTatCaPhieuXuat } from "../../lib/phieu-xuat-apis";
import { nhanTatCaCacQuyenSach } from "../../lib/sach-apis";

function QuanLiTonKho() {
  // State chung
  const [tabHienTai, setTabHienTai] = useState("tonkho"); // tonkho, lichsunhap, phieunhap, phieuxuat
  const [danhSachSach, setDanhSachSach] = useState([]);
  const [tonKho, setTonKho] = useState([]);
  const [phieuNhaps, setPhieuNhaps] = useState([]);
  const [phieuXuats, setPhieuXuats] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho form phiếu nhập
  const [showFormNhap, setShowFormNhap] = useState(false);
  const [ghiChuNhap, setGhiChuNhap] = useState("");
  const [chiTietNhap, setChiTietNhap] = useState([
    { sachID: "", soLuongNhap: 0, donGiaNhap: 0 },
  ]);

  // Load dữ liệu khi component mount
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const sachs = await nhanTatCaCacQuyenSach();
      setDanhSachSach(sachs);

      if (tabHienTai === "tonkho") {
        const tk = await layTonKho();
        setTonKho(tk);
      } else if (tabHienTai === "lichsunhap") {
        const pn = await layTatCaPhieuNhap();
        setPhieuNhaps(pn);
      } else if (tabHienTai === "phieunhap") {
        const pn = await layTatCaPhieuNhap();
        setPhieuNhaps(pn);
      } else if (tabHienTai === "phieuxuat") {
        const px = await layTatCaPhieuXuat();
        setPhieuXuats(px);
      }
    } catch (error) {
      console.error("Lỗi khi load dữ liệu:", error);
      alert("Lỗi khi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [tabHienTai]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Xử lý tạo phiếu nhập
  const handleTaoPhieuNhap = async () => {
    try {
      // Validate
      const chiTietHopLe = chiTietNhap.filter(
        (ct) => ct.sachID && ct.soLuongNhap > 0 && ct.donGiaNhap > 0
      );
      if (chiTietHopLe.length === 0) {
        alert("Vui lòng thêm ít nhất 1 sản phẩm hợp lệ");
        return;
      }

      // Lấy adminID từ localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        ngayNhap: new Date(),
        ghiChu: ghiChuNhap,
        chiTietPhieuNhaps: chiTietHopLe,
        nguoiDungID: user?.nguoiDungID || null,
      };

      await taoPhieuNhap(payload);
      alert("Tạo phiếu nhập thành công!");
      setShowFormNhap(false);
      setGhiChuNhap("");
      setChiTietNhap([{ sachID: "", soLuongNhap: 0, donGiaNhap: 0 }]);
      loadData();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  // Thêm dòng chi tiết nhập
  const themDongNhap = () => {
    setChiTietNhap([
      ...chiTietNhap,
      { sachID: "", soLuongNhap: 0, donGiaNhap: 0 },
    ]);
  };

  // Xóa dòng chi tiết nhập
  const xoaDongNhap = (index) => {
    const newList = chiTietNhap.filter((_, i) => i !== index);
    setChiTietNhap(newList);
  };

  // Cập nhật chi tiết nhập
  const capNhatChiTietNhap = (index, field, value) => {
    const newList = [...chiTietNhap];
    newList[index][field] = value;
    setChiTietNhap(newList);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Quản Lý Tồn Kho</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-300">
        <button
          onClick={() => setTabHienTai("tonkho")}
          className={`px-4 py-2 text-gray-700 hover:text-blue-600 transition ${
            tabHienTai === "tonkho"
              ? "border-b-2 border-blue-500 font-semibold "
              : ""
          }`}
        >
          Tồn Kho
        </button>
        <button
          onClick={() => setTabHienTai("lichsunhap")}
          className={`px-4 py-2 text-black ${
            tabHienTai === "lichsunhap"
              ? "border-b-2 border-blue-500 font-semibold"
              : ""
          }`}
        >
          Lịch Sử Nhập
        </button>
        <button
          onClick={() => setTabHienTai("phieunhap")}
          className={`px-4 py-2 text-black ${
            tabHienTai === "phieunhap"
              ? "border-b-2 border-blue-500 font-semibold"
              : ""
          }`}
        >
          Phiếu Nhập
        </button>
        <button
          onClick={() => setTabHienTai("phieuxuat")}
          className={`px-4 py-2 text-black ${
            tabHienTai === "phieuxuat"
              ? "border-b-2 border-blue-500 font-semibold"
              : ""
          }`}
        >
          Phiếu Xuất
        </button>
      </div>

      {loading && <p>Đang tải...</p>}

      {/* Tab Tồn Kho */}
      {tabHienTai === "tonkho" && !loading && (
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Danh Sách Tồn Kho
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200 border-black">
                  <th className="border  text-black">ID</th>
                  <th className="border  text-black">Tên Sách</th>
                  <th className="border  text-black">Tác Giả</th>
                  <th className="border text-black">Giá Giảm</th>
                  <th className="border  text-black">Số Lượng Nhập</th>
                  <th className="border  text-black">Số Lượng Xuất</th>
                  <th className="border  text-black">Tồn Kho</th>
                </tr>
              </thead>
              <tbody>
                {tonKho.map((item) => (
                  <tr className="text-black" key={item.sachID}>
                    <td className="border p-2 text-center">{item.sachID}</td>
                    <td className="border p-2">{item.tenSach}</td>
                    <td className="border p-2">{item.tacGia}</td>
                    <td className="border p-2 text-right">
                      {item.giaGiam?.toLocaleString()} đ
                    </td>
                    <td className="border p-2 text-center text-black  ">
                      {item.soLuongNhap}
                    </td>
                    <td className="border p-2 text-center text-black  ">
                      {item.soLuongXuat}
                    </td>
                    <td
                      className={`border p-2 text-center font-semibold ${
                        item.tonKho < 5
                          ? "text-red-600"
                          : item.tonKho < 10
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.tonKho}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Lịch Sử Nhập */}
      {tabHienTai === "lichsunhap" && !loading && (
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Lịch Sử Nhập Kho
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="border p-2">ID Phiếu</th>
                  <th className="border p-2">Ngày Nhập</th>
                  <th className="border p-2">Người Nhập</th>
                  <th className="border p-2">Tên Sách</th>
                  <th className="border p-2">Số Lượng Nhập</th>
                  <th className="border p-2">Đơn Giá</th>
                  <th className="border p-2">Thành Tiền</th>
                  <th className="border p-2">Ghi Chú</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {phieuNhaps.flatMap((phieu) =>
                  (phieu.chiTietPhieuNhaps || []).map((chi, idx) => {
                    const sach = danhSachSach.find(
                      (s) => s.sachID === chi.sachID
                    );
                    return (
                      <tr key={`${phieu.phieuNhapID}-${idx}`}>
                        <td className="border p-2 text-center font-semibold">
                          {phieu.phieuNhapID}
                        </td>
                        <td className="border p-2">
                          {new Date(phieu.ngayNhap)
                            .toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            .replace(",", "")}
                        </td>
                        <td className="border p-2 text-center font-semibold text-blue-600">
                          {phieu.nguoiDung?.tenNguoiDung || "Chưa xác định"}
                        </td>
                        <td className="border p-2">{sach?.tenSach || "-"}</td>
                        <td className="border p-2 text-center">
                          {chi.soLuongNhap}
                        </td>
                        <td className="border p-2 text-right">
                          {Number(chi.donGiaNhap).toLocaleString("vi-VN")} đ
                        </td>

                        <td className="border p-2 text-right font-semibold">
                          {(chi.soLuongNhap * chi.donGiaNhap)?.toLocaleString()}{" "}
                          đ
                        </td>
                        <td className="border p-2 text-sm text-gray-600">
                          {phieu.ghiChu || "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {phieuNhaps.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Chưa có phiếu nhập nào
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab Phiếu Nhập */}
      {tabHienTai === "phieunhap" && !loading && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Danh Sách Phiếu Nhập
            </h2>
            <button
              onClick={() => setShowFormNhap(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              + Tạo Phiếu Nhập
            </button>
          </div>

          {/* Bảng phiếu nhập */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border text-black">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Ngày Nhập</th>
                  <th className="border p-2">Ghi Chú</th>
                  <th className="border p-2">Số Lượng SP</th>
                </tr>
              </thead>
              <tbody>
                {phieuNhaps.map((phieu) => (
                  <tr key={phieu.phieuNhapID}>
                    <td className="border p-2 text-center">
                      {phieu.phieuNhapID}
                    </td>
                    <td className="border p-2">
                      {new Date(phieu.ngayNhap).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="border p-2">{phieu.ghiChu || "-"}</td>
                    <td className="border p-2 text-center">
                      {phieu.chiTietPhieuNhaps?.length || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Form tạo phiếu nhập */}
          {showFormNhap && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                  Tạo Phiếu Nhập Mới
                </h3>

                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Ghi Chú:</label>
                  <input
                    type="text"
                    value={ghiChuNhap}
                    onChange={(e) => setGhiChuNhap(e.target.value)}
                    className="w-full border p-2 rounded text-black"
                    placeholder="Nhập ghi chú (tùy chọn)"
                  />
                </div>

                <h4 className="font-semibold mb-2 text-gray-800">
                  Chi Tiết Nhập:
                </h4>
                {chiTietNhap.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <select
                      value={item.sachID}
                      onChange={(e) =>
                        capNhatChiTietNhap(index, "sachID", e.target.value)
                      }
                      className="border p-2 rounded flex-1 text-black"
                    >
                      <option value="">-- Chọn sách --</option>
                      {danhSachSach.map((sach) => (
                        <option key={sach.sachID} value={sach.sachID}>
                          {sach.tenSach}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Số lượng"
                      value={item.soLuongNhap}
                      onChange={(e) =>
                        capNhatChiTietNhap(
                          index,
                          "soLuongNhap",
                          e.target.value ? Number(e.target.value) : 0
                        )
                      }
                      className="border p-2 rounded w-24 text-black"
                    />
                    <input
                      type="text"
                      placeholder="Đơn giá"
                      value={item.donGiaNhap}
                      onChange={(e) =>
                        capNhatChiTietNhap(
                          index,
                          "donGiaNhap",
                          e.target.value ? Number(e.target.value) : 0
                        )
                      }
                      className="border p-2 rounded w-32 text-black"
                    />
                    <button
                      onClick={() => xoaDongNhap(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </div>
                ))}

                <button
                  onClick={themDongNhap}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                >
                  + Thêm Dòng
                </button>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowFormNhap(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleTaoPhieuNhap}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Lưu Phiếu Nhập
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Phiếu Xuất */}
      {tabHienTai === "phieuxuat" && !loading && (
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Lịch Sử Xuất Kho
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Phiếu xuất tự động tạo khi khách mua hàng
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border text-black">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">ID Phiếu</th>
                  <th className="border p-2">Ngày Xuất</th>
                  <th className="border p-2">Khách Hàng</th>
                  <th className="border p-2">Loại Xuất</th>
                  <th className="border p-2">Tên Sách</th>
                  <th className="border p-2">Số Lượng Xuất</th>
                  <th className="border p-2">Người xuất</th>
                  <th className="border p-2">Đơn Giá Bán</th>
                  <th className="border p-2">Thành Tiền</th>
                  <th className="border p-2">Ghi Chú</th>
                </tr>
              </thead>
              <tbody>
                {phieuXuats.flatMap((phieu) =>
                  (phieu.chiTietPhieuXuats || []).map((chi, idx) => {
                    const sach = danhSachSach.find(
                      (s) => s.sachID === chi.sachID
                    );
                    return (
                      <tr key={`${phieu.phieuXuatID}-${idx}`}>
                        <td className="border p-2 text-center font-semibold">
                          {phieu.phieuXuatID}
                        </td>
                        <td className="border p-2">
                          {new Date(phieu.ngayXuat)
                            .toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            .replace(",", "")}
                        </td>
                        <td className="border p-2 font-medium">
                          {phieu.tenKhachHang || "-"}
                        </td>
                        <td className="border p-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {phieu.loaiXuat}
                          </span>
                        </td>
                        <td className="border p-2">{sach?.tenSach || "-"}</td>
                        <td className="border p-2 text-center text-red-500">
                          -{chi.soLuongXuat}
                        </td>
                        <td className="border p-2 text-center text-black  ">
                          {phieu.nguoiXuat}
                        </td>
                        <td className="border p-2 text-right">
                          {(Number(chi.donGiaBan) || 0).toLocaleString("vi-VN")}{" "}
                          đ
                        </td>

                        <td className="border p-2 text-right font-semibold w-29">
                          {(chi.soLuongXuat * chi.donGiaBan)?.toLocaleString()}{" "}
                          đ
                        </td>
                        <td className="border p-2 text-sm text-gray-600">
                          {phieu.ghiChu || "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {phieuXuats.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Chưa có phiếu xuất nào
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLiTonKho;
