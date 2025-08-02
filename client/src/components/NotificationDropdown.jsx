import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, User, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useAuth();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return <Heart className="text-red-500" size={16} />;
            case 'comment':
                return <MessageCircle className="text-blue-500" size={16} />;
            case 'connection_request':
            case 'connection_accepted':
                return <UserPlus className="text-green-500" size={16} />;
            case 'follow':
                return <User className="text-purple-500" size={16} />;
            default:
                return <Bell className="text-gray-500" size={16} />;
        }
    };

    const formatDate = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffInSeconds = Math.floor((now - notifDate) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return notifDate.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllNotificationsAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="mx-auto text-gray-400 mb-3" size={32} />
                                <p className="text-gray-500">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.slice(0, 10).map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${!notification.isRead ? 'bg-blue-50' : ''
                                        }`}
                                    onClick={() => {
                                        if (!notification.isRead) {
                                            markNotificationAsRead(notification._id);
                                        }
                                    }}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            {notification.sender?.profilePicture ? (
                                                <img
                                                    src={notification.sender.profilePicture}
                                                    alt={notification.sender.name}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {notification.sender?.name?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                {getNotificationIcon(notification.type)}
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-900 font-medium mb-1">
                                                {notification.message}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {formatDate(notification.createdAt)}
                                            </p>

                                            {notification.relatedPost && (
                                                <Link
                                                    to="/"
                                                    className="text-xs text-blue-600 hover:text-blue-700 mt-1 block"
                                                >
                                                    View post
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 10 && (
                        <div className="p-3 border-t border-gray-200 text-center">
                            <Link
                                to="/notifications"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                View all notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;