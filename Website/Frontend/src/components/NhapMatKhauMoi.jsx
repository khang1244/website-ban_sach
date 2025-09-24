import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NhapMatKhauMoi(){
    const [matKhauMoi, setMatKhauMoi] = useState("");
    const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");
    
    const router = useNavigate();

    const xuLyDatLaiMatKhau = () => {
        if (matKhauMoi === xacNhanMatKhau) {
            alert("Đặt lại mật khẩu thành công!");
            router("/dangnhap");
        } else {
            alert("Mật khẩu không khớp!");
        }
    };

    return(
        <div className="flex justify-center items-center h-screen w-screen ">
            <form className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Nhập Mật Khẩu Mới
                </h2>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Mật Khẩu Mới
                    </label>
                    <input

                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={matKhauMoi}
                        onChange={(e) => setMatKhauMoi(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Xác Nhận Mật Khẩu
                    </label>
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        value={xacNhanMatKhau}
                        onChange={(e) => setXacNhanMatKhau(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <button
                    type="button"
                    onClick={xuLyDatLaiMatKhau}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Đặt Lại Mật Khẩu
                </button>
            </form>
        </div>
    )
}

export default NhapMatKhauMoi;