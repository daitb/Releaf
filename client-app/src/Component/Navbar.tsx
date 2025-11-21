import { Link, NavLink } from "react-router-dom";
import { LogOut, ShoppingCart, User, UserCircle } from "lucide-react";
import Logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "../api/apiClient";

export default function Navbar() {
    const { isLoggedIn, user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [cartCount, setCartCount] = useState<number>(0);
    const [isLoadingCart, setIsLoaingCard] = useState<boolean>(false);

    useEffect(() => {
        if (!isLoggedIn) {
            setCartCount(0);
            return;
        }

        const fetchCartCount = async () => {
            setIsLoaingCard(true);

            try {
                const res = await api.get("/Cart/count");
                setCartCount(res.data.data.count || 0);
            }
            catch (error) {
                console.error("Error fatching cart count: ", error)
                setCartCount(0);
            }
            finally {
                setIsLoaingCard(false);
            }
        }

        fetchCartCount();

    }, [isLoggedIn]);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Product", path: "/Products" },
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
                        {isLoggedIn && (
                            <button
                                className="p-2 text-gray-700 hover:text-green-600 transition-colors relative"
                                aria-label="Shopping Cart"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span className="absolute top-0 right-0 w-4 h-4 bg-green-600 text-white text-xs 
                            rounded-full justify-center items-center">
                                    {isLoadingCart ? "..." : cartCount}
                                </span>
                            </button>
                        )}


                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="p-2 text-gray-600 hover:text-green-600 hover:scale-105 transition"
                                    aria-label="User Account"
                                >
                                    <User className="w-5 h-5" />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-4 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <div className="px-4 py-2 text-sm text-gray-600">
                                            {user?.fullName || "User"}
                                        </div>

                                        <Link
                                            to="/Account"
                                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <UserCircle className="w-4 h-4 mr-2" />Profile
                                        </Link>

                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> LogOut
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button className="p-2 text-gray-600 hover:text-green-600 hover:scale-105 transition"
                                    aria-label="User Account"
                                >
                                    <User className="w-5 h-5" />
                                </button>

                                <Link
                                    to="/auth?mode=login"
                                    className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 active:scale-95 font-medium"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}