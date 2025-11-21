import { useState, useEffect } from 'react';
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from 'react-icons/fa';
import { api } from '../api/apiClient';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthForm() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Lấy mode từ query param (login hoặc register)
    const mode = searchParams.get('mode') || 'login';
    const [isRightPanelActive, setIsRightPanelActive] = useState(mode === 'register');

    useEffect(() => {
        setIsRightPanelActive(mode === 'register');
    }, [mode]);

    // ---- States ----
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');

    const [signUpName, setSignUpName] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // ---- Handlers ----
    const handleSignUpClick = () => {
        setSearchParams({ mode: 'register' });
        setError(null);
        setSuccess(null);
    };

    const handleSignInClick = () => {
        setSearchParams({ mode: 'login' });
        setError(null);
        setSuccess(null);
    };

    const handleSignInSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post("/Auth/login", {
                email: signInEmail,
                password: signInPassword,
            });
            const token = response.data.data;
            localStorage.setItem("accessToken", token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Email hoặc mật khẩu không đúng");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.post("/Auth/register", {
                name: signUpName,
                email: signUpEmail,
                password: signUpPassword,
            });
            setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
            setSearchParams({ mode: 'login' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    // ---- Styles ----
    const commonInput = "bg-[#eee] border-none py-3 px-4 my-2 w-full rounded";
    const commonButton = "rounded-[20px] border border-[#FF4B2B] bg-[#FF4B2B] text-white text-xs font-bold py-3 px-11 tracking-[1px] uppercase transition-transform duration-[80ms] ease-in active:scale-95 focus:outline-none";
    const socialIcon = "border border-[#DDDDDD] rounded-full inline-flex justify-center items-center mx-1 h-10 w-10 text-gray-700";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f6f5f7] font-['Montserrat']">
            <h2 className="text-center font-bold mb-4 text-2xl">Sign In / Sign Up Form</h2>

            <div className="relative overflow-hidden w-[768px] max-w-full min-h-[480px] bg-white rounded-lg shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)]">
                {/* --- Sign Up --- */}
                <div className={`
                    absolute top-0 left-0 h-full w-1/2 
                    transition-all duration-600 ease-in-out
                    opacity-0 z-10
                    ${isRightPanelActive ? 'translate-x-full opacity-100 z-50 pointer-events-auto' : 'pointer-events-none'}
                `}>
                    <form onSubmit={handleSignUpSubmit} className="bg-white flex items-center justify-center flex-col px-12 h-full text-center">
                        <h1 className="font-bold text-3xl">Create Account</h1>
                        <div className="my-5">
                            <a href="#" className={socialIcon}><FaFacebookF /></a>
                            <a href="#" className={socialIcon}><FaGooglePlusG /></a>
                            <a href="#" className={socialIcon}><FaLinkedinIn /></a>
                        </div>
                        <span className="text-xs">or use your email for registration</span>
                        <input type="text" placeholder="Name" value={signUpName} onChange={(e) => setSignUpName(e.target.value)} className={commonInput} required />
                        <input type="email" placeholder="Email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} className={commonInput} required />
                        <input type="password" placeholder="Password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} className={commonInput} required />
                        <button type="submit" className={`${commonButton} mt-4`} disabled={isLoading}>
                            {isLoading ? "Loading..." : "Sign Up"}
                        </button>
                    </form>
                </div>

                {/* --- Sign In --- */}
                <div className={`
                    absolute top-0 left-0 h-full w-1/2 transition-all duration-600 ease-in-out
                    ${isRightPanelActive ? 'translate-x-full' : ''}
                `}>
                    <form onSubmit={handleSignInSubmit} className="bg-white flex items-center justify-center flex-col px-12 h-full text-center">
                        <h1 className="font-bold text-3xl">Sign in</h1>
                        <div className="my-5">
                            <a href="#" className={socialIcon}><FaFacebookF /></a>
                            <a href="#" className={socialIcon}><FaGooglePlusG /></a>
                            <a href="#" className={socialIcon}><FaLinkedinIn /></a>
                        </div>
                        <span className="text-xs">or use your account</span>
                        <input type="email" placeholder="Email" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} className={commonInput} required />
                        <input type="password" placeholder="Password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} className={commonInput} required />
                        <a href="#" className="text-[#333] text-sm no-underline my-4">Forgot your password?</a>
                        <button type="submit" className={commonButton} disabled={isLoading}>
                            {isLoading ? "Loading..." : "Sign In"}
                        </button>
                    </form>
                </div>

                {/* --- Overlay --- */}
                <div className={`
                    absolute top-0 left-1/2 h-full w-1/2 overflow-hidden z-[100] transition-transform duration-600 ease-in-out
                    ${isRightPanelActive ? '-translate-x-full' : ''}
                `}>
                    <div className={`
                        relative bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white
                        left-[-100%] h-full w-[200%] transition-transform duration-600 ease-in-out
                        ${isRightPanelActive ? 'translate-x-1/2' : ''}
                    `}>
                        {/* Left Panel */}
                        <div className="absolute top-0 flex items-center justify-center flex-col px-10 text-center h-full w-1/2">
                            <h1 className="font-bold text-3xl">Welcome Back!</h1>
                            <p className="text-sm font-thin leading-5 tracking-wider my-5">
                                To keep connected with us please login with your personal info
                            </p>
                            <button className={`${commonButton} bg-transparent border-white`} onClick={handleSignInClick}>
                                Sign In
                            </button>
                        </div>

                        {/* Right Panel */}
                        <div className="absolute top-0 right-0 flex items-center justify-center flex-col px-10 text-center h-full w-1/2">
                            <h1 className="font-bold text-3xl">Hello, Friend!</h1>
                            <p className="text-sm font-thin leading-5 tracking-wider my-5">
                                Enter your personal details and start your journey with us
                            </p>
                            <button className={`${commonButton} bg-transparent border-white`} onClick={handleSignUpClick}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hiển thị thông báo */}
            {(error || success) && (
                <div className={`mt-4 px-4 py-2 rounded ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {error || success}
                </div>
            )}
        </div>
    );
}
