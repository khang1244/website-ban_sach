import { BASE_URL } from "./baseUrl";

// 1. Tạo bình luận mới
export const taoBinhLuanMoi = async (binhLuanData) => {
  try {
    const response = await fetch(`${BASE_URL}/binhLuan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(binhLuanData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      message: "Tạo bình luận thành công",
    };
  } catch (error) {
    console.error("Lỗi khi tạo bình luận mới:", error);
    return {
      success: false,
      message: "Không thể tạo bình luận mới",
      error: error.message,
    };
  }
};
// 2. Lấy tất cả bình luận
export const layTatCaBinhLuan = async () => {
  try {
    const response = await fetch(`${BASE_URL}/binhLuan`, {
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
    console.error("Lỗi khi lấy danh sách bình luận:", error);
    return {
      success: false,
      message: "Không thể tải danh sách bình luận",
      error: error.message,
    };
  }
};
// 3. Xóa bình luận theo ID
export const xoaBinhLuanTheoID = async (binhLuanID) => {
  try {
    const response = await fetch(`${BASE_URL}/binhLuan/${binhLuanID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          message: "Bình luận không tồn tại",
          error: "Không tìm thấy bình luận để xóa",
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      message: "Xóa bình luận thành công",
    };
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    return {
      success: false,
      message: "Không thể xóa bình luận",
      error: error.message,
    };
  }
};
// 4.1 Cập nhật trạng thái duyệt bình luận
export const duyetBinhLuanTheoID = async (binhLuanID, duyet) => {
  try {
    const response = await fetch(`${BASE_URL}/binhLuan/${binhLuanID}/duyet`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ duyet }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái duyệt:", error);
    return {
      success: false,
      message: "Không thể cập nhật trạng thái duyệt",
      error: error.message,
    };
  }
};
// 4. Lấy bình luận theo mã sách
export const layBinhLuanTheoSachID = async (sachID) => {
  try {
    const response = await fetch(`${BASE_URL}/binhLuan/${sachID}`, {
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
    console.error("Lỗi khi lấy bình luận theo sách ID:", error);
    return {
      success: false,
      message: "Không thể tải bình luận của sách này",
      error: error.message,
    };
  }
};
