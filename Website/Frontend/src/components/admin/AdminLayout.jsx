import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const sidebarLinks = [
  { label: "Quản lý chung", to: "/admin" },
  { label: "Quản lý sách", to: "/admin/sach" },
  { label: "Danh mục sách", to: "/admin/danhmucsach" },
  { label: "Quản lý đơn hàng", to: "/admin/donhang" },
  { label: "Người dùng", to: "/admin/nguoidung" },
  { label: "Bình luận", to: "/admin/binhluan" },
  { label: "Khuyến mãi", to: "/admin/khuyenmai" },
  { label: "Giao dịch kho", to: "/admin/giaodichkho" },
];

function AdminLayout() {
  const location = useLocation(); // Vị trí website đang hiển thị

  console.log(location.pathname);
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#00809D] text-white flex flex-col py-8 px-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
        <nav className="flex-1">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`block px-4 py-2 rounded-lg font-medium transition hover:bg-[#005f73] ${
                    location.pathname === link.to
                      ? "bg-white text-[#00809D]"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
