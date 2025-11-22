import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@features/auth/context/AuthContext";

export default function ProtectedRoute() {
    const { isLoggedIn, isBootstrapping, isLoadingUser } = useAuth();

    if (isBootstrapping || isLoadingUser) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-gray-600">
                Checking your session...
            </div>
        );
    }

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
}