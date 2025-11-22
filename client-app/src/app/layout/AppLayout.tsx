import { Outlet } from "react-router-dom";
import Navbar from "@shared/layout/Navbar";
import Footer from "@shared/layout/Footer";

export default function AppLayout() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

