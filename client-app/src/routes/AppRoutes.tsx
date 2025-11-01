import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import HomePage from "../pages/HomePage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}