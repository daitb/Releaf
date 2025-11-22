import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import AppLayout from "@app/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "@features/auth/context/AuthContext";
import LoginPage from "@features/auth/pages/LoginPage";
import RegisterPage from "@features/auth/pages/RegisterPage";
import ProductListPage from "@features/products/pages/ProductListPage";
import NotFound from "@app/pages/NotFound";

const HomePage = React.lazy(() => import("@features/home/pages/HomePage"));

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route
                            path="/"
                            element={(
                                <Suspense fallback={<div className="text-center mt-6">Loading HomePage...</div>}>
                                    <HomePage />
                                </Suspense>
                            )}
                        />
                        <Route path="/products" element={<ProductListPage />} />

                        <Route element={<ProtectedRoute />}>
                            {/* Protected routes go here, e.g. dashboard */}
                        </Route>
                    </Route>

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}