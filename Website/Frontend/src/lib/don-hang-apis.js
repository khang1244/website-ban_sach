import { BASE_URL } from "./baseUrl";

// 1. Lấy tất cả đơn hàng
export const layTatCaDonHang = async () => {
  try {
    const response = await fetch(`${BASE_URL}/donHang`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return {
      success: false,
      message: "Không thể tải danh sách đơn hàng",
      error: error.message,
    };
  }
};
// Nhận đơn hàng của một người dùng cụ thể
export const nhanDonHangCuaMotNguoiDung = async (nguoiDungID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/donHang/nguoiDung/${nguoiDungID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng của người dùng:", error);
    return [];
  }
};
// 2. Tạo đơn hàng mới
export const taoDonHangMoi = async (donHangData) => {
  try {
    const response = await fetch(`${BASE_URL}/donHang`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(donHangData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      message: "Tạo đơn hàng thành công",
    };
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng mới:", error);
    return {
      success: false,
      message: "Không thể tạo đơn hàng mới",
      error: error.message,
    };
  }
};

// 3. Cập nhật trạng thái đơn hàng
export const capNhatTrangThaiDonHang = async (donHangID, trangThaiMoi) => {
  try {
    const response = await fetch(`${BASE_URL}/donHang/${donHangID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trangThai: trangThaiMoi }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      message: "Cập nhật trạng thái đơn hàng thành công",
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    return {
      success: false,
      message: "Không thể cập nhật trạng thái đơn hàng",
      error: error.message,
    };
  }
};

// 4. Lấy đơn hàng theo ID
export const layDonHangTheoID = async (donHangID) => {
  try {
    const response = await fetch(`${BASE_URL}/donHang/${donHangID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          message: "Đơn hàng không tồn tại",
          error: "Không tìm thấy đơn hàng",
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng theo ID:", error);
    return {
      success: false,
      message: "Không thể tải thông tin đơn hàng",
      error: error.message,
    };
  }
};

// Trả hàng
export const traHang = async (donHangID, lyDoTraHang) => {
  try {
    const response = await fetch(`${BASE_URL}/donHang/tra-hang`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        donHangID,
        lyDoTraHang,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          message: "Đơn hàng không tồn tại",
          error: "Không tìm thấy đơn hàng",
        };
      }
      if (response.status === 400) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Không thể trả hàng",
          error: errorData.message,
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      message: "Trả hàng thành công",
    };
  } catch (error) {
    console.error("Lỗi khi trả hàng:", error);
    return {
      success: false,
      message: "Không thể trả hàng",
      error: error.message,
    };
  }
};
