import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { login as loginRequest } from "@features/auth/services/authService";
import { useAuth } from "@features/auth/context/AuthContext";
import { useAsyncError } from "@shared/hooks/useAsyncError";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { execute, isLoading } = useAsyncError();
    const { login } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await execute(
            () => loginRequest({ email, password }),
            {
                onSuccess: (authTokens) => {
                    login(authTokens);
                    toast.success("Đăng nhập thành công!");
                },
                onError: (errorMessage) => {
                    toast.error(errorMessage);
                }
            }
        );
    };

    const commonInput = "w-full border border-gray-300 rounded-xl py-3 px-4 text-sm transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent";
    const commonButton = "w-full rounded-xl bg-green-500 text-white font-semibold py-3 mt-2 transition hover:bg-green-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-['Montserrat']">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 relative">
                <Link
                    to="/"
                    className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md text-green-600 font-semibold"
                >
                    <Leaf className="w-4 h-4" />
                    Releaf
                </Link>

                <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Welcome back</h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Đăng nhập để tiếp tục hành trình sống xanh cùng Releaf
                        </p>
                    </div>

                    <label className="text-sm font-semibold text-gray-600">
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
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className={`${commonInput} mt-1`}
                            placeholder="Enter your password"
                            required
                        />
                    </label>

                    <div className="flex items-center justify-between text-sm mt-3">
                        <Link to="/forgot-password" className="text-green-600 hover:text-green-700 font-medium">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button type="submit" className={commonButton} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Sign In"}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Chưa có tài khoản?{" "}
                        <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                            Tạo tài khoản mới
                        </Link>
                    </p>
                </form>
            </div>

            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
}

