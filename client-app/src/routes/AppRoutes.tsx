import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import HomePage from "../pages/HomePage";
import AuthForm from "../pages/AuthPage";

// Inner component: Nơi gọi useLocation (bên trong Router context)
function RoutesWithLayout() {
    const location = useLocation();  // Bây giờ an toàn, vì đã trong <BrowserRouter>
    // ẨN layout nếu là /login HOẶC /register
    const showLayout = location.pathname !== "/auth";

    return (
        <>
            {/* Navbar: Chỉ hiện nếu showLayout */}
            {showLayout && <Navbar />}
            
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<AuthForm />} />
                    {/* Thêm các route khác nếu cần */}
                </Routes>
            </main>
            
            {/* Footer: Chỉ hiện nếu showLayout */}
            {showLayout && <Footer />}
        </>
    );
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <RoutesWithLayout />  {/* Render inner component bên trong Router */}
        </BrowserRouter>
    );
}