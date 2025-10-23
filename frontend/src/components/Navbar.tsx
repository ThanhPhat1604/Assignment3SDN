"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Heart,
  Bell,
  ChevronDown,
  Plus,
  LogOut,
  Package,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const { data: session } = useSession();
  const { items } = useCart();

  // 🧩 Tính tổng sản phẩm trong giỏ
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* --- Top Bar --- */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="hidden md:block">🚚 Free shipping on orders over $50!</p>
          <div className="flex items-center space-x-4 text-xs">
            <Link href="/help" className="hover:text-yellow-300">Help Center</Link>
            <span>|</span>
            <Link href="/track" className="hover:text-yellow-300">Track Order</Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-yellow-300">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* --- Main Navbar --- */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/main" className="flex items-center">
            <div className="bg-gradient-to-r from-pink-600 to-purple-700 text-white px-3 py-2 rounded-lg font-bold text-xl">
              FashionHub
            </div>
          </Link>

          {/* --- Search Bar (Desktop) --- */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button className="absolute right-2 top-1 bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>

          {/* --- Desktop Nav Links --- */}
          <div className="hidden md:flex items-center space-x-6">

            <Link href="/main" className="text-gray-700 hover:text-blue-600 font-medium relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
            </Link>

            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link href="/main/categories/dresses" className="block px-4 py-2 hover:bg-gray-100">Dresses</Link>
                <Link href="/main/categories/tops" className="block px-4 py-2 hover:bg-gray-100">Tops & Blouses</Link>
                <Link href="/main/categories/bottoms" className="block px-4 py-2 hover:bg-gray-100">Bottoms</Link>
                <Link href="/main/categories/accessories" className="block px-4 py-2 hover:bg-gray-100">Accessories</Link>
              </div>
            </div>

            {/* Add New Product - Only show when logged in */}
            {session && (
              <Link
                href="/main/products/create"
                className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add Product
              </Link>
            )}
          </div>

          {/* --- Right Side Icons --- */}
          <div className="flex items-center space-x-4">

            {/* Mobile Search Icon */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Orders - Only show when logged in */}
            {session && (
              <Link 
                href="/main/orders" 
                className="relative p-2 text-gray-700 hover:text-blue-600 group"
                title="My Orders"
              >
                <Package className="h-6 w-6" />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
              </Link>
            )}

            {/* Wishlist */}
            <button className="relative p-2 text-gray-700 hover:text-blue-600">
              <Heart className="h-6 w-6" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-700 hover:text-blue-600">
              <Bell className="h-6 w-6" />
            </button>

            {/* Cart */}
            <Link href="/main/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User (Login / Logout) */}
            {session ? (
              <div className="flex items-center space-x-2">
                <Link href="/account" className="flex items-center text-gray-700 hover:text-blue-600">
                  <User className="h-6 w-6 mr-1" />
                  <span className="hidden md:inline">{session.user?.name || "Account"}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-red-500 hover:text-red-700"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="p-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* --- Mobile Search --- */}
        {isSearchOpen && (
          <div className="md:hidden border-t border-gray-200 p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* --- Mobile Menu --- */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              <Link href="/main" className="block py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/main/categories/dresses" className="block py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Dresses</Link>
              <Link href="/main/categories/tops" className="block py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Tops & Blouses</Link>
              <Link href="/main/categories/bottoms" className="block py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Bottoms</Link>
              <Link href="/main/categories/accessories" className="block py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Accessories</Link>

              <div className="border-t border-gray-200 my-2"></div>

              {session ? (
                <>
                  <Link href="/account" className="block py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>My Account</Link>
                  
                  <Link href="/main/orders" className="block py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2" /> My Orders
                    </div>
                  </Link>

                  <Link href="/main/products/create" className="block py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-center font-semibold" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex justify-center items-center">
                      <Plus className="w-4 h-4 mr-2" /> Add Product
                    </div>
                  </Link>

                  <button
                    onClick={() => { signOut(); setIsMenuOpen(false); }}
                    className="w-full text-left py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className="block py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Login</Link>
              )}

              <Link href="/main/cart" className="block py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                Cart ({totalItems})
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}