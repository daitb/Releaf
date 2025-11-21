import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import Logo from "../assets/logo.png";

export default function Navbar() {

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Product", path: "/Products" },
        { name: "Cart", path: "/Carts" },
        { name: "Account", path: "/Account" }
    ]

    return (
        <nav className="sticky top-0 left-0 bg-white shadow-sm border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* logo */}
                    <NavLink to="/" >
                        <div className="w-16 h-16 flex justify-center items-center">
                            <img src={Logo} alt="Logo" />
                        </div>
                    </NavLink>

                    {/* desktop menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `font-medium transition colors ${isActive
                                        ? "text-green-600"
                                        : "text-gray-700 hover:text-green-600"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* desktop action */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            className="p-2 text-gray-700 hover:text-green-600 transition-colors relative"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-4 h-4 bg-green-600 text-white text-xs 
                            rounded-full justify-center items-center">
                                0
                            </span>
                        </button>

                        <button className="p-2 text-gray-700 hover:text-green-600 transition-colors"
                            aria-label="User Account">
                            <User className="w-5 h-5" />
                        </button>

                        <Link
                            to={"/auth"}
                            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}