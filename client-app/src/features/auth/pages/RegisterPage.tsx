import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { register as registerRequest } from "@features/auth/services/authService";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }

        setIsLoading(true);

        try {
            await registerRequest({ fullName, email, password, confirmPassword });
            toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        }
        catch (error: any) {
            toast.error(error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.");
        }
        finally {
            setIsLoading(false);
        }
    };

    const commonInput = "w-full border border-gray-300 rounded-xl py-3 px-4 text-sm transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent";
    const commonButton = "w-full rounded-xl bg-green-500 text-white font-semibold py-3 mt-2 transition hover:bg-green-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-['Montserrat']">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-8">
                    <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                        <Leaf className="w-5 h-5" />
                        Releaf
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold">Gia nhập Releaf</h2>
                        <p className="mt-4 text-sm text-green-50">
                            Tạo tài khoản để nhận ưu đãi độc quyền và cập nhật các xu hướng sống xanh mới nhất.
                        </p>
                    </div>
                    <div className="text-sm text-green-50">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="font-semibold text-white underline">
                            Đăng nhập
                        </Link>
                    </div>
                </div>

                <form className="md:pl-4" onSubmit={handleSubmit}>
                    <div className="text-center md:text-left mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Tạo tài khoản</h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Nhập thông tin của bạn để bắt đầu hành trình cùng chúng tôi
                        </p>
                    </div>

                    <label className="text-sm font-semibold text-gray-600">
                        Họ và tên
                        <input
                            type="text"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            className={`${commonInput} mt-1`}
                            placeholder="Nguyễn Văn A"
                            required
                        />
                    </label>

                    <label className="text-sm font-semibold text-gray-600 block mt-4">
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className={`${commonInput} mt-1`}
                            placeholder="you@example.com"
                            required
                        />
                    </label>

                    <label className="text-sm font-semibold text-gray-600 block mt-4">
                        Mật khẩu
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className={`${commonInput} mt-1`}
                            placeholder="Tối thiểu 8 ký tự"
                            required
                        />
                    </label>

                    <label className="text-sm font-semibold text-gray-600 block mt-4">
                        Xác nhận mật khẩu
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            className={`${commonInput} mt-1`}
                            placeholder="Nhập lại mật khẩu"
                            required
                        />
                    </label>

                    <button type="submit" className={commonButton} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Sign Up"}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4 md:hidden">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </div>

            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
}

