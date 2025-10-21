import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const sidebarLinks = [
  { label: "Quản lý chung", to: "/admin" },
  { label: "Quản lý sách", to: "/admin/sach" },
  { label: "Danh mục sách", to: "/admin/danhmucsach" },
  { label: "Quản lý đơn hàng", to: "/admin/donhang" },
  { label: "Quản lý Người dùng", to: "/admin/nguoidung" },
  { label: "Quản lý Bình luận", to: "/admin/binhluan" },
  { label: "Quản lý Khuyến mãi", to: "/admin/khuyenmai" },
  { label: "Quản lý Giao dịch kho", to: "/admin/giaodichkho" },
];

function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Wrapper full width */}
      <div className="flex w-full">
        {/* Sidebar fixed width */}
        <aside className="sticky top-0 h-screen w-72 shrink-0 bg-[#00809D] text-white/95 shadow-2xl ring-1 ring-black/5">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
            <div className="h-10 w-10 rounded-xl bg-white/20 grid place-items-center font-bold">
              A
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">Admin Panel</p>
              <p className="text-xs text-white/70">Quản trị hệ thống</p>
            </div>
          </div>
          <nav className="px-4 py-4">
            <ul className="space-y-1">
              {sidebarLinks.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={[
                        "group flex items-center justify-between rounded-xl px-4 py-2.5 transition-all",
                        "hover:bg-white/10 hover:translate-x-0.5",
                        active
                          ? "bg-white text-[#00809D] shadow-sm ring-1 ring-white/60"
                          : "text-white/90",
                      ].join(" ")}
                    >
                      <span className="font-medium">{link.label}</span>
                      <span
                        className={[
                          "h-2 w-2 rounded-full transition",
                          active
                            ? "bg-[#00809D]"
                            : "bg-white/30 group-hover:bg-white/60",
                        ].join(" ")}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto px-6 py-4 text-xs text-white/60 border-t border-white/10">
            © {new Date().getFullYear()} Dashboard
          </div>
        </aside>

        {/* Content full width */}
        <main className="flex-1 w-full">
          {/* Top bar full-bleed nhưng vẫn có padding */}
          <div className="px-6 md:px-8 pt-6">
            <div className="mb-6 rounded-2xl bg-white/70 backdrop-blur shadow-sm ring-1 ring-slate-200 px-5 py-4">
              <h1 className="text-lg md:text-xl font-semibold text-slate-800">
                Bảng điều khiển quản trị
              </h1>
              <p className="text-sm text-slate-500">
                Quản lý nội dung và dữ liệu hệ thống.
              </p>
            </div>

            {/* Outlet container full width */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-4 md:p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
