import React from "react";

function ThongBaoChay({ show, type, title, message, onClose }) {
  if (!show) return null;

  // Chọn màu nền dựa trên loại thông báo
  const tone =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-rose-600"
      : "bg-cyan-600";

  return (
    <div
      className={`${tone} fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white`}
    >
      <span>✅</span>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-lg font-bold leading-none hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
}
export default ThongBaoChay;
