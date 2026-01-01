import React from "react";
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const cauHinhThongBao = {
  success: {
    nen: "bg-gradient-to-br from-emerald-500 via-emerald-500/95 to-emerald-600 border-emerald-200/50",
    Icon: FiCheckCircle,
    nhan: "Thành công",
  },
  error: {
    nen: "bg-gradient-to-br from-rose-500 via-rose-500/95 to-rose-600 border-rose-200/60",
    Icon: FiAlertTriangle,
    nhan: "Có lỗi",
  },
  warning: {
    nen: "bg-gradient-to-br from-amber-500 via-amber-500/95 to-orange-500 border-amber-200/60",
    Icon: FiAlertTriangle,
    nhan: "Cần chú ý",
  },
  info: {
    nen: "bg-gradient-to-br from-sky-500 via-sky-500/95 to-indigo-500 border-sky-200/60",
    Icon: FiInfo,
    nhan: "Thông báo",
  },
};

function ThongBaoChay({ show, type = "info", title, message, onClose }) {
  if (!show) return null;

  const thongTinLoai = cauHinhThongBao[type] || cauHinhThongBao.info;
  const { Icon, nhan, nen } = thongTinLoai;

  return (
    <div className="pointer-events-auto fixed top-4 right-4 z-[60] w-full max-w-xs sm:max-w-sm">
      <div
        role="alert"
        aria-live="assertive"
        className={`relative overflow-hidden rounded-2xl border ${nen} px-4 py-3 text-white shadow-xl backdrop-blur-md transition-all duration-300`}
      >
        <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Icon className="text-xl" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
              {nhan}
            </p>
            <p className="text-base font-semibold leading-snug">{title}</p>
            <p className="text-sm text-white/90">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-1 text-white transition hover:bg-white/20"
            aria-label="Đóng thông báo"
          >
            <FiX className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThongBaoChay;
