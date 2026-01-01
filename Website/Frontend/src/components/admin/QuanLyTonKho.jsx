import React, { useEffect, useState, useCallback } from "react";
import { layTonKho } from "../../lib/phieu-nhap-apis";
import { layTatCaPhieuNhap, taoPhieuNhap } from "../../lib/phieu-nhap-apis";
import { layTatCaPhieuXuat } from "../../lib/phieu-xuat-apis";
import { nhanTatCaCacQuyenSach } from "../../lib/sach-apis";
import ThongBaoChay from "./ThongBaoChay";

function QuanLyTonKho() {
  // State chung
  const [tabHienTai, setTabHienTai] = useState("tonkho"); // tonkho, phieunhap, phieuxuat
  const [danhSachSach, setDanhSachSach] = useState([]); // Tất cả sách
  const [tonKho, setTonKho] = useState([]); // Dữ liệu tồn kho
  const [phieuNhaps, setPhieuNhaps] = useState([]); // Dữ liệu phiếu nhập
  const [phieuXuats, setPhieuXuats] = useState([]); // Dữ liệu phiếu xuất
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
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

  // State cho form phiếu nhập
  const [showFormNhap, setShowFormNhap] = useState(false); // Hiển thị form tạo phiếu nhập
  const [ghiChuNhap, setGhiChuNhap] = useState(""); // Ghi chú phiếu nhập
  const [chiTietNhap, setChiTietNhap] = useState([
    // Chi tiết phiếu nhập
    { sachID: "", soLuongNhap: 0, donGiaNhap: 0 },
  ]);

  // State cho xem lịch sử nhập
  const [showLichSuNhap, setShowLichSuNhap] = useState(false);
  const [trangLichSuNhap, setTrangLichSuNhap] = useState(1);

  // State cho xem lịch sử xuất
  const [showLichSuXuat, setShowLichSuXuat] = useState(false);
  const [trangLichSuXuat, setTrangLichSuXuat] = useState(1);

  // State cho phân trang Tồn Kho
  const [trangTonKho, setTrangTonKho] = useState(1);

  // State cho phân trang Phiếu Nhập (danh sách tóm gọn)
  const [trangPhieuNhap, setTrangPhieuNhap] = useState(1);

  // State cho phân trang Phiếu Xuất (danh sách tóm gọn)
  const [trangPhieuXuat, setTrangPhieuXuat] = useState(1);

  // Helper phân trang gom gọn
  const taoPhanTrang = (duLieu, trang, soLuongMotTrang) => {
    const tongSo = duLieu.length;
    const tongSoTrang = Math.max(1, Math.ceil(tongSo / soLuongMotTrang));
    const trangHopLe = Math.min(Math.max(trang, 1), tongSoTrang);
    const viTriBatDau = (trangHopLe - 1) * soLuongMotTrang;
    return {
      tongSo,
      tongSoTrang,
      trangHopLe,
      viTriBatDau,
      duLieuTrongTrang: duLieu.slice(
        viTriBatDau,
        viTriBatDau + soLuongMotTrang
      ),
    };
  };

  // Load dữ liệu khi component mount
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const sachs = await nhanTatCaCacQuyenSach();
      setDanhSachSach(sachs);

      if (tabHienTai === "tonkho") {
        const tk = await layTonKho();
        setTonKho(tk);
      } else if (tabHienTai === "phieunhap") {
        const pn = await layTatCaPhieuNhap();
        setPhieuNhaps(pn);
      } else if (tabHienTai === "phieuxuat") {
        const px = await layTatCaPhieuXuat();
        setPhieuXuats(px);
      }
    } catch (error) {
      console.error("Lỗi khi load dữ liệu:", error);
      hienThongBao(
        "error",
        "Có lỗi",
        "Không thể tải dữ liệu kho, vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  }, [tabHienTai]);

  // Reload dữ liệu khi tab thay đổi
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Phân trang gom gọn cho từng danh sách
  const tonKhoPage = taoPhanTrang(tonKho, trangTonKho, 5);
  const phieuNhapPage = taoPhanTrang(phieuNhaps, trangPhieuNhap, 5);
  const phieuXuatPage = taoPhanTrang(phieuXuats, trangPhieuXuat, 5);

  const chuyenTrangTonKho = (trang) => {
    if (trang >= 1 && trang <= tonKhoPage.tongSoTrang) setTrangTonKho(trang);
  };
  const chuyenTrangPhieuNhap = (trang) => {
    if (trang >= 1 && trang <= phieuNhapPage.tongSoTrang)
      setTrangPhieuNhap(trang);
  };
  const chuyenTrangPhieuXuat = (trang) => {
    if (trang >= 1 && trang <= phieuXuatPage.tongSoTrang)
      setTrangPhieuXuat(trang);
  };

  useEffect(() => {
    if (trangTonKho !== tonKhoPage.trangHopLe) {
      setTrangTonKho(tonKhoPage.trangHopLe);
    }
  }, [tonKhoPage.trangHopLe, trangTonKho]);

  useEffect(() => {
    if (trangPhieuNhap !== phieuNhapPage.trangHopLe) {
      setTrangPhieuNhap(phieuNhapPage.trangHopLe);
    }
  }, [phieuNhapPage.trangHopLe, trangPhieuNhap]);

  useEffect(() => {
    if (trangPhieuXuat !== phieuXuatPage.trangHopLe) {
      setTrangPhieuXuat(phieuXuatPage.trangHopLe);
    }
  }, [phieuXuatPage.trangHopLe, trangPhieuXuat]);

  // Xử lý tạo phiếu nhập
  const handleTaoPhieuNhap = async () => {
    try {
      // Validate
      const chiTietHopLe = chiTietNhap.filter(
        (ct) => ct.sachID && ct.soLuongNhap > 0 && ct.donGiaNhap > 0
      );
      if (chiTietHopLe.length === 0) {
        hienThongBao(
          "warning",
          "Thiếu dữ liệu",
          "Vui lòng thêm ít nhất 1 sản phẩm hợp lệ."
        );
        return;
      }

      // Không cho nhập cho sách ngừng bán
      const sachNgungBan = chiTietHopLe.find((ct) => {
        const sach = danhSachSach.find(
          (s) => String(s.sachID) === String(ct.sachID)
        );
        const trangThaiBan =
          sach?.trangThaiBan === true ||
          sach?.trangThaiBan === 1 ||
          sach?.trangThaiBan === "1" ||
          sach?.trangThaiBan === "true" ||
          sach?.trangThaiBan === "dangBan";
        return !trangThaiBan;
      });
      if (sachNgungBan) {
        hienThongBao(
          "warning",
          "Không hợp lệ",
          "Sản phẩm đang ngừng bán, không thể tạo phiếu nhập cho sản phẩm đó."
        );
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
      hienThongBao("success", "Thành công", "Tạo phiếu nhập thành công!");
      setShowFormNhap(false);
      setGhiChuNhap("");
      setChiTietNhap([{ sachID: "", soLuongNhap: 0, donGiaNhap: 0 }]);
      loadData();
    } catch (error) {
      hienThongBao(
        "error",
        "Có lỗi",
        error.message || "Không thể tạo phiếu nhập, thử lại sau nhé!"
      );
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
      <ThongBaoChay
        show={thongBao.show}
        type={thongBao.type}
        title={thongBao.title}
        message={thongBao.message}
        onClose={() =>
          setThongBao({ show: false, type: "info", title: "", message: "" })
        }
      />
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
                  <th className="border  text-black">Hình Ảnh</th>
                  <th className="border  text-black">Tên Sách</th>
                  <th className="border  text-black">Tác Giả</th>
                  <th className="border text-black">Giá Giảm</th>
                  <th className="border text-black">Trạng thái</th>
                  <th className="border  text-black">Số Lượng Nhập</th>
                  <th className="border  text-black">Số Lượng Xuất</th>
                  <th className="border  text-black">Tồn Kho</th>
                </tr>
              </thead>
              <tbody>
                {tonKhoPage.duLieuTrongTrang.map((item) => {
                  const sach = danhSachSach.find((s) => s.sachID === item.sachID);
                  let firstImg = null;
                  try {
                    const imgs = Array.isArray(sach?.images)
                      ? sach.images
                      : JSON.parse(sach?.images || "null");
                    firstImg = Array.isArray(imgs) ? imgs[0]?.url : null;
                  } catch {
                    firstImg = null;
                  }

                  return (
                    <tr className="text-black" key={item.sachID}>
                      <td className="border p-2 text-center">{item.sachID}</td>
                      <td className="border p-2 text-center">
                        {firstImg ? (
                          <img
                            src={firstImg}
                            alt={item.tenSach}
                            className="mx-auto h-14 w-13 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="border p-2">{item.tenSach}</td>
                      <td className="border p-2">{item.tacGia}</td>
                      <td className="border p-2 text-right">
                        {item.giaGiam?.toLocaleString()} đ
                      </td>
                      <td className="border p-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.trangThaiBan
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.trangThaiBan ? "Đang bán" : "Ngừng bán"}
                        </span>
                      </td>
                      <td className="border p-2 text-center text-black  ">
                        {item.soLuongNhap}
                      </td>
                      <td className="border p-2 text-center text-black  ">
                        {item.soLuongXuat < 0
                          ? `+${Math.abs(item.soLuongXuat)}`
                          : item.soLuongXuat}
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
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Phân trang Tồn Kho */}
          {tonKhoPage.tongSoTrang > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 text-black">
              <button
                onClick={() => chuyenTrangTonKho(tonKhoPage.trangHopLe - 1)}
                disabled={tonKhoPage.trangHopLe === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                ← Trước
              </button>
              {Array.from({ length: tonKhoPage.tongSoTrang }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => chuyenTrangTonKho(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    tonKhoPage.trangHopLe === i + 1 ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => chuyenTrangTonKho(tonKhoPage.trangHopLe + 1)}
                disabled={tonKhoPage.trangHopLe === tonKhoPage.tongSoTrang}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab Lịch Sử Nhập */}
      {/* Xóa tab này - gom vào Phiếu Nhập */}

      {/* Tab Phiếu Nhập */}
      {tabHienTai === "phieunhap" && !loading && (
        <div>
          {!showLichSuNhap ? (
            // Hiển thị danh sách phiếu nhập tóm gọn
            <>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Phiếu Nhập
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowLichSuNhap(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    📋 Xem Lịch Sử Nhập
                  </button>
                  <button
                    onClick={() => setShowFormNhap(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    + Tạo Phiếu Nhập
                  </button>
                </div>
              </div>

              <>
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
                      {phieuNhapPage.duLieuTrongTrang.map((phieu) => (
                        <tr key={phieu.phieuNhapID}>
                          <td className="border p-2 text-center font-semibold">
                            {phieu.phieuNhapID}
                          </td>
                          <td className="border p-2">
                            {new Date(phieu.ngayNhap).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>
                          <td className="border p-2">{phieu.ghiChu || "-"}</td>
                          <td className="border p-2 text-center">
                            {phieu.chiTietPhieuNhaps?.length || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {phieuNhaps.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      Chưa có phiếu nhập nào
                    </p>
                  )}
                </div>

                {/* Phân trang Phiếu Nhập */}
                {phieuNhapPage.tongSoTrang > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4 text-black">
                    <button
                      onClick={() =>
                        chuyenTrangPhieuNhap(phieuNhapPage.trangHopLe - 1)
                      }
                      disabled={phieuNhapPage.trangHopLe === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      ← Trước
                    </button>
                    {Array.from({ length: phieuNhapPage.tongSoTrang }).map(
                      (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => chuyenTrangPhieuNhap(i + 1)}
                          className={`px-3 py-1 border rounded ${
                            phieuNhapPage.trangHopLe === i + 1
                              ? "bg-blue-500 text-white"
                              : ""
                          }`}
                        >
                          {i + 1}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        chuyenTrangPhieuNhap(phieuNhapPage.trangHopLe + 1)
                      }
                      disabled={
                        phieuNhapPage.trangHopLe === phieuNhapPage.tongSoTrang
                      }
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            </>
          ) : (
            // Hiển thị lịch sử nhập chi tiết
            <div>
              <button
                onClick={() => {
                  setShowLichSuNhap(false);
                  setTrangLichSuNhap(1);
                }}
                className="mb-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                ← Quay Lại
              </button>

              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                Lịch Sử Nhập Kho
              </h2>

              {/* Lấy dữ liệu và tính toán phân trang */}
              {(() => {
                const allData = phieuNhaps.flatMap((phieu) =>
                  (phieu.chiTietPhieuNhaps || []).map((chi, idx) => ({
                    phieu,
                    chi,
                    sachID: chi.sachID,
                    idx,
                  }))
                );
                const itemsPerPage = 5;
                const totalPages = Math.ceil(allData.length / itemsPerPage);
                const startIdx = (trangLichSuNhap - 1) * itemsPerPage;
                const endIdx = startIdx + itemsPerPage;
                const currentData = allData.slice(startIdx, endIdx);

                return (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border">
                        <thead>
                          <tr className="bg-gray-200 text-black">
                            <th className="border p-2">ID Phiếu</th>
                            <th className="border p-2">Ngày Nhập</th>
                            <th className="border p-2">Người Nhập</th>
                            <th className="border p-2">sachID</th>
                            <th className="border p-2">Tên Sách</th>
                            <th className="border p-2">Số Lượng Nhập</th>
                            <th className="border p-2">Đơn Giá</th>
                            <th className="border p-2">Thành Tiền</th>
                            <th className="border p-2">Ghi Chú</th>
                          </tr>
                        </thead>
                        <tbody className="text-black">
                          {currentData.map((item) => {
                            const sach = danhSachSach.find(
                              (s) => s.sachID === item.sachID
                            );
                            return (
                              <tr key={`${item.phieu.phieuNhapID}-${item.idx}`}>
                                <td className="border p-2 text-center font-semibold">
                                  {item.phieu.phieuNhapID}
                                </td>
                                <td className="border p-2">
                                  {new Date(item.phieu.ngayNhap)
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
                                  {item.phieu.nguoiDung?.tenNguoiDung ||
                                    "Chưa xác định"}
                                </td>
                                <td className="border p-7">
                                  {sach?.sachID || "-"}
                                </td>
                                <td className="border p-2 w-35">
                                  {sach?.tenSach || "-"}
                                </td>
                                <td className="border p-2 text-center w-20">
                                  {item.chi.soLuongNhap}
                                </td>
                                <td className="border p-2 text-right">
                                  {Number(item.chi.donGiaNhap).toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  đ
                                </td>

                                <td className="border p-2 text-right font-semibold">
                                  {(
                                    item.chi.soLuongNhap * item.chi.donGiaNhap
                                  )?.toLocaleString()}{" "}
                                  đ
                                </td>
                                <td className="border p-2 text-sm text-gray-600">
                                  {item.phieu.ghiChu || "-"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {allData.length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                          Chưa có phiếu nhập nào
                        </p>
                      )}
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-4 text-black">
                        <button
                          onClick={() =>
                            setTrangLichSuNhap(Math.max(1, trangLichSuNhap - 1))
                          }
                          disabled={trangLichSuNhap === 1}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          ← Trước
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setTrangLichSuNhap(i + 1)}
                            className={`px-3 py-1 border rounded ${
                              trangLichSuNhap === i + 1
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            setTrangLichSuNhap(
                              Math.min(totalPages, trangLichSuNhap + 1)
                            )
                          }
                          disabled={trangLichSuNhap === totalPages}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          Sau →
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

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
                      {danhSachSach
                        .filter(
                          (sach) =>
                            sach.trangThaiBan === true ||
                            sach.trangThaiBan === 1 ||
                            sach.trangThaiBan === "1" ||
                            sach.trangThaiBan === "true" ||
                            sach.trangThaiBan === "dangBan"
                        )
                        .map((sach) => (
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
          {!showLichSuXuat ? (
            // Hiển thị danh sách phiếu xuất tóm gọn
            <>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Phiếu Xuất
                </h2>
                <button
                  onClick={() => setShowLichSuXuat(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  📋 Xem Lịch Sử Xuát
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Phiếu xuất tự động tạo khi khách mua hàng
              </p>
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border text-black">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-2">ID Phiếu</th>
                        <th className="border p-2">Ngày Xuát</th>
                        <th className="border p-2">Khách Hàng</th>
                        <th className="border p-2">Loại Xuát</th>
                        <th className="border p-2">Đơn Hàng</th>
                        <th className="border p-2">Số Lượng SP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phieuXuatPage.duLieuTrongTrang.map((phieu) => (
                        <tr key={phieu.phieuXuatID}>
                          <td className="border p-2 text-center font-semibold">
                            {phieu.phieuXuatID}
                          </td>
                          <td className="border p-2">
                            {new Date(phieu.ngayXuat).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>
                          <td className="border p-2 font-medium">
                            {phieu.tenNguoiDung || "-"}
                          </td>
                          <td className="border p-2 text-center">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                              {phieu.loaiXuat}
                            </span>
                          </td>
                          <td className="border p-2 text-center">
                            {phieu.donHangID ? (
                              <span className="font-semibold text-blue-600">
                                #{phieu.donHangID}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="border p-2 text-center">
                            {phieu.chiTietPhieuXuats?.length || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {phieuXuats.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      Chưa có phiếu xuát nào
                    </p>
                  )}
                </div>

                {/* Phân trang Phiếu Xuất */}
                {phieuXuatPage.tongSoTrang > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4 text-black">
                    <button
                      onClick={() =>
                        chuyenTrangPhieuXuat(phieuXuatPage.trangHopLe - 1)
                      }
                      disabled={phieuXuatPage.trangHopLe === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      ← Trước
                    </button>
                    {Array.from({ length: phieuXuatPage.tongSoTrang }).map(
                      (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => chuyenTrangPhieuXuat(i + 1)}
                          className={`px-3 py-1 border rounded ${
                            phieuXuatPage.trangHopLe === i + 1
                              ? "bg-blue-500 text-white"
                              : ""
                          }`}
                        >
                          {i + 1}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        chuyenTrangPhieuXuat(phieuXuatPage.trangHopLe + 1)
                      }
                      disabled={
                        phieuXuatPage.trangHopLe === phieuXuatPage.tongSoTrang
                      }
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            </>
          ) : (
            // Hiển thị lịch sử xuát chi tiết
            <div>
              <button
                onClick={() => {
                  setShowLichSuXuat(false);
                  setTrangLichSuXuat(1);
                }}
                className="mb-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                ← Quay Lại
              </button>

              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                Lịch Sử Xuất Kho
              </h2>

              {/* Lấy dữ liệu và tính toán phân trang */}
              {(() => {
                const allData = phieuXuats.flatMap((phieu) =>
                  (phieu.chiTietPhieuXuats || []).map((chi, idx) => ({
                    phieu,
                    chi,
                    sachID: chi.sachID,
                    idx,
                  }))
                );
                const itemsPerPage = 5;
                const totalPages = Math.ceil(allData.length / itemsPerPage);
                const startIdx = (trangLichSuXuat - 1) * itemsPerPage;
                const endIdx = startIdx + itemsPerPage;
                const currentData = allData.slice(startIdx, endIdx);

                return (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border text-black">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border p-2">ID Phiếu</th>
                            <th className="border p-2">Ngày Xuát</th>
                            <th className="border p-2">Khách Hàng</th>
                            <th className="border p-2">Loại Xuát</th>
                            <th className="border p-2">Đơn Hàng</th>
                            <th className="border p-2">Tên Sách</th>
                            <th className="border p-2">Số Lượng Xuát</th>
                            <th className="border p-2">Người xuát</th>
                            <th className="border p-2">Đơn Giá Bán</th>
                            <th className="border p-2">Thành Tiền</th>
                            <th className="border p-2">Ghi Chú</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map((item) => {
                            const sach = danhSachSach.find(
                              (s) => s.sachID === item.sachID
                            );
                            return (
                              <tr key={`${item.phieu.phieuXuatID}-${item.idx}`}>
                                <td className="border p-2 text-center font-semibold">
                                  {item.phieu.phieuXuatID}
                                </td>
                                <td className="border p-2">
                                  {new Date(item.phieu.ngayXuat)
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
                                  {item.phieu.tenNguoiDung || "-"}
                                </td>
                                <td className="border p-2">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                    {item.phieu.loaiXuat}
                                  </span>
                                </td>
                                <td className="border p-2 text-center">
                                  {item.phieu.donHangID ? (
                                    <span className="font-semibold text-blue-600">
                                      #{item.phieu.donHangID}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="border p-2">
                                  {sach?.tenSach || "-"}
                                </td>
                                <td className="border p-2 text-center">
                                  <span
                                    className={
                                      item.phieu.loaiXuat === "Khách trả hàng"
                                        ? "text-green-600 font-semibold"
                                        : "text-red-500"
                                    }
                                  >
                                    {item.chi.soLuongXuat < 0
                                      ? `+${Math.abs(item.chi.soLuongXuat)}`
                                      : `-${item.chi.soLuongXuat}`}
                                  </span>
                                </td>
                                <td className="border p-2 text-center">
                                  {item.phieu.nguoiXuat}
                                </td>
                                <td className="border p-2 text-right">
                                  {(
                                    Number(item.chi.donGiaBan) || 0
                                  ).toLocaleString("vi-VN")}{" "}
                                  đ
                                </td>

                                <td className="border p-2 text-right font-semibold w-29">
                                  <div
                                    className={
                                      item.phieu.loaiXuat === "Khách trả hàng"
                                        ? "text-green-600"
                                        : "text-blue-600"
                                    }
                                  >
                                    {item.phieu.loaiXuat === "Khách trả hàng"
                                      ? `-${Math.abs(
                                          item.chi.soLuongXuat *
                                            item.chi.donGiaBan
                                        )?.toLocaleString()} đ`
                                      : `${(
                                          item.chi.soLuongXuat *
                                          item.chi.donGiaBan
                                        )?.toLocaleString()} đ`}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {item.phieu.loaiXuat === "Khách trả hàng"
                                      ? "(Hoàn trả)"
                                      : "(Bán hàng)"}
                                  </div>
                                </td>
                                <td className="border p-2 text-sm text-gray-600">
                                  {item.phieu.ghiChu || "-"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-4 text-black">
                        <button
                          onClick={() =>
                            setTrangLichSuXuat(Math.max(1, trangLichSuXuat - 1))
                          }
                          disabled={trangLichSuXuat === 1}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          ← Trước
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setTrangLichSuXuat(i + 1)}
                            className={`px-3 py-1 border rounded ${
                              trangLichSuXuat === i + 1
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            setTrangLichSuXuat(
                              Math.min(totalPages, trangLichSuXuat + 1)
                            )
                          }
                          disabled={trangLichSuXuat === totalPages}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          Sau →
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuanLyTonKho;
