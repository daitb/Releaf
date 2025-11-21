import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/apiClient";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { Leaf } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthForm() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    //select mode from query param  (login or register)
    const mode = searchParams.get("mode") || "login";
    const [isRightPanelActive, setIsRightPanelActive] = useState(mode === "register");

    useEffect(() => {
        setIsRightPanelActive(mode === "register");
    }, [mode]);

    //State

    const [signInEmail, setSigninEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");

    const [signUpName, setSignUpName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpConfirmPassword, setSignupConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleSignUpClick = () => {
        setSearchParams({ mode: "register" });
    }

    const handleSignInClick = () => {
        setSearchParams({ mode: "login" });
    }

    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); //Prevents the browser's default behavior when submitting a form, which is to "reload the entire page"
        setIsLoading(true);

        try {
            await api.post("Auth/register", {
                fullName: signUpName,
                email: signUpEmail,
                password: signUpPassword,
                confirmPassword: signUpConfirmPassword
            });

            toast.success("Đăng ký thành công!");

            setSigninEmail(signUpEmail);
            setSignInPassword(signUpPassword);

            setSearchParams({ mode: "login" });
        }
        catch (err: any) {
            toast.error(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
        }
        finally {
            setIsLoading(false);
        }
    };

    const { login } = useAuth();

    const handleSignInSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/Auth/login", {
                email: signInEmail,
                password: signInPassword
            });

            const token = response.data.data.accessToken;
            login(token);
            toast.success("Đăng nhập thành công!")
            navigate("/");
        }
        catch (err: any) {
            toast.error(err.response?.data?.message || "Email hoặc mật khẩu không đúng");
        }
        finally {
            setIsLoading(false);
        }
    };

    //style
    const commonInput = "bg-gray-100 border border-gray-300 py-3 px-4 my-2 w-full rounded-xl transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent";
    const commonButton = "rounded-full border border-green-600 bg-green-500 text-white text-xs font-bold py-3 px-11 tracking-[1px] transition-all duration-150 ease-in-out active:scale-95 focus:outline-none hover:bg-green-600 hover:border-green-600 disabled:opacity-50 disabled:cursor-not-allowed";
    const socialIcon = "border border-gray-300 rounded-full inline-flex justify-center items-center mx-1 h-10 w-10 text-gray-700 transition-all duration-200 ease-in-out hover:text-white active:scale-90";

    return (
        <div className="relative p-3 flex flex-col items-center justify-center min-h-screen bg-gray-50 font-['Montserrat']">

            <Link to="/"
                className="absolute top-3 left-3 flex gap-1 text-lg font-bold text-green-500 hover:text-green-600 transition duration-300"
            >
                <Leaf />
                <span>Releaf</span>
            </Link>

            <div className="relative overflow-hidden w-full max-w-md sm:max-w-lg md:max-w-4xl bg-white rounded-lg shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)] min-h-[480px]">

                {/* Sign up */}
                <div className={`
                        absolute top-0 left-0 h-full w-1/2 
                        transition-all duration-600 ease-in-out
                        opacity-0 z-10
                        ${isRightPanelActive ? "translate-x-full opacity-100 z-50 pointer-events-auto" : "pointer-events-none"}
                    `}>
                    <form onSubmit={handleSignUpSubmit}
                        className="bg-white flex flex-col items-center justify-center px-14 h-full text-center"
                    >
                        <h1 className="font-bold text-3xl">Create Account</h1>

                        {/* social icon */}
                        <div className="my-4">
                            <a href="" className={`${socialIcon} hover:bg-blue-500`}><FaFacebookF /></a>
                            <a href="" className={`${socialIcon} hover:bg-red-500`}><FaGoogle /></a>
                        </div>

                        <div className="relative mb-2 w-full">
                            {/* 1. Lớp chứa đường kẻ (nằm ở dưới) */}
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                            </div>

                            {/* 2. Lớp chứa văn bản (nằm ở trên) */}
                            <div className="relative flex justify-center">
                                <span className="bg-white px-3 text-xs text-neutral-500">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        <input type="text" placeholder="Full Name" value={signUpName} onChange={(e) => setSignUpName(e.target.value)} className={`${commonInput} placeholder: text-sm`} required />
                        <input type="email" placeholder="Email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} className={`${commonInput} placeholder: text-sm`} required />
                        <input type="password" placeholder="Password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} className={`${commonInput} placeholder: text-sm`} required />
                        <input type="password" placeholder="ConfimPassword" value={signUpConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} className={`${commonInput} placeholder: text-sm`} required />
                        <button type="submit" className={`${commonButton} mt-4`} disabled={isLoading}>
                            {isLoading ? "Loading..." : "Sign Up"}
                        </button>
                    </form>
                </div>

                {/* Sign In */}
                <div className={`
                    absolute top-0 left-0 h-full w-1/2 transition-all duration-600 ease-in-out
                    ${isRightPanelActive ? "translate-x-full" : ""}
                `}>
                    <form onSubmit={handleSignInSubmit}
                        className="bg-white flex flex-col items-center justify-center px-14 h-full text-center"
                    >
                        <h1 className="text-3xl font-bold">Sign In</h1>
                        <div className="my-5">
                            <a href="" className={`${socialIcon} hover:bg-blue-500`}><FaFacebookF /></a>
                            <a href="" className={`${socialIcon} hover:bg-red-500`}><FaGoogle /></a>
                        </div>

                        <div className="relative mb-2 w-full">
                            {/* 1. Lớp chứa đường kẻ (nằm ở dưới) */}
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                            </div>

                            {/* 2. Lớp chứa văn bản (nằm ở trên) */}
                            <div className="relative flex justify-center">
                                <span className="bg-white px-3 text-xs text-neutral-500">
                                    Or use your account
                                </span>
                            </div>
                        </div>

                        <input type="email" placeholder="Email" value={signInEmail} onChange={(e) => setSigninEmail(e.target.value)} className={commonInput} required />
                        <input type="password" placeholder="Password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} className={commonInput} required />
                        <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-green-600 transition duration-200 ease-in-out my-2 self-end">
                            Forgot password?
                        </Link>
                        <button type="submit" className={`${commonButton} mt-4`} disabled={isLoading}>
                            {isLoading ? "Loading..." : "Sign In"}
                        </button>
                    </form>
                </div>

                {/* overlay */}

                <div className={`
                    absolute top-0 left-1/2 h-full w-1/2 overflow-hidden z-[100] transition-transform duration-600 ease-in-out
                    ${isRightPanelActive ? "-translate-x-full rounded-tr-[360px]" : "rounded-tl-[360px]"}
                `}>
                    <div className={`
                        relative bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white 
                        left-[-100%] h-full w-[200%] transition-transform duration-600 ease-in-out
                        ${isRightPanelActive ? "translate-x-1/2" : ""}
                    `}>
                        {/* left panel */}
                        <div className="absolute top-0 flex flex-col items-center justify-center px-10 text-center h-full w-1/2">
                            <h1 className="font-bold text-3xl">Welcome Back!</h1>
                            <p className="text-sm font-thin leading-5 tracking-wider my-5">
                                Let's continue the journey for a green, clean and beautiful environment.
                            </p>
                            <button className={`${commonButton} bg-transparent border-white`} onClick={handleSignInClick}>
                                Sign In
                            </button>
                        </div>

                        {/* right panel */}
                        <div className="absolute top-0 right-0 flex flex-col items-center justify-center px-10 text-center h-full w-1/2">
                            <h1 className="font-bold text-3xl">Welcome new members</h1>
                            <p className="text-sm font-thin leading-5 tracking-wider my-5">
                                Create an account to help us spread sustainable living.
                            </p>
                            <button className={`${commonButton} bg-transparent border-white`} onClick={handleSignUpClick}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Toaster position="top-right" reverseOrder={false} />
        </div>
    )
}