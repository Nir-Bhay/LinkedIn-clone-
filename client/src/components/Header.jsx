import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Home, Search, Bell, MessageCircle } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Search */}
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">in</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 hidden sm:block">
                                LinkedIn Clone
                            </span>
                        </Link>

                        {/* Search Bar */}
                        <div className="hidden md:flex relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 w-64"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-1">
                        <Link
                            to="/"
                            className="flex flex-col items-center space-y-1 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
                        >
                            <Home size={20} className="group-hover:scale-110 transition-transform duration-200" />
                            <span className="text-xs font-medium hidden sm:block">Home</span>
                        </Link>

                        <button className="flex flex-col items-center space-y-1 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group">
                            <MessageCircle size={20} className="group-hover:scale-110 transition-transform duration-200" />
                            <span className="text-xs font-medium hidden sm:block">Messages</span>
                        </button>

                        <button className="flex flex-col items-center space-y-1 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group relative">
                            <Bell size={20} className="group-hover:scale-110 transition-transform duration-200" />
                            <span className="text-xs font-medium hidden sm:block">Notifications</span>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">3</span>
                            </div>
                        </button>

                        <Link
                            to={`/profile/${user?.id}`}
                            className="flex flex-col items-center space-y-1 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
                        >
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <User size={14} className="text-white" />
                            </div>
                            <span className="text-xs font-medium hidden sm:block">Profile</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex flex-col items-center space-y-1 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors duration-200 group"
                        >
                            <LogOut size={20} className="group-hover:scale-110 transition-transform duration-200" />
                            <span className="text-xs font-medium hidden sm:block">Logout</span>
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;