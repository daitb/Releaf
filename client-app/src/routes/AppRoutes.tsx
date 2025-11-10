import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
// import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import React, { Suspense } from "react";

const NO_LAYOUT_PATHS = ["/auth", "/404"]
const HomePage = React.lazy(() => import("../pages/HomePage"));
// Inner component: Nơi gọi useLocation (bên trong Router context)
function RoutesWithLayout() {
    const location = useLocation();  // Bây giờ an toàn, vì đã trong <BrowserRouter>
    // ẨN layout nếu là /login HOẶC /register
    const showLayout = !NO_LAYOUT_PATHS.includes(location.pathname)

    return (
        <>
            {/* Navbar: Chỉ hiện nếu showLayout */}
            {showLayout && <Navbar />}

            <main>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Suspense fallback={<div className="text-center mt-6">Loading HomePage...</div>}>
                                <HomePage />
                            </Suspense>
                        }
                    />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route element={<ProtectedRoute />}>

                    </Route>

                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
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
            <AuthProvider>
                <RoutesWithLayout />  {/* Render inner component bên trong Router */}
            </AuthProvider>
        </BrowserRouter>
    );
}