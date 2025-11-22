import { Leaf } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo and description */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div>
                                <Leaf className="w-6 h-6 text-green-600" />
                            </div>
                            <span>Releaf</span>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            Cung cấp sản phẩm thân thiện với môi trường,
                            giảm thải C02 giúp bạn sống xanh, sống khỏe mỗi ngày
                        </p>
                        <div className="flex gap-6">
                            <FaFacebook className="w-6 h-6 text-gray-600 mt-4 hover:text-blue-600"/>
                            <FaInstagram className="w-6 h-6 text-gray-600 mt-4 hover:text-red-600"/>
                            <FaTiktok className="w-6 h-6 text-gray-600 mt-4 hover:text-[#EE1D52]" />
                        </div>
                    </div>

                    {/* Link */}
                    <div>
                        <h3 className="text-gray-900 font-semibold mb-3">Company</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li><a href="">About US</a></li>
                            <li><a href="">Product</a></li>
                            <li><a href="">Contact</a></li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h3 className="text-gray-900 font-semibold mb-3">Help</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li><a href="">Frequently ask questions</a></li>
                            <li><a href="">Return Policy</a></li>
                            <li><a href="">Private Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Releaf. All rights reserved</p>                
            </div>
        </footer>
    )
}