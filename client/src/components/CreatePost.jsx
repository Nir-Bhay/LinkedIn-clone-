import React, { useState } from 'react';
import { Send, Image, Video, Calendar, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        setLoading(true);
        const success = await onPostCreated(content);

        if (success) {
            setContent('');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-lg">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                    <p className="text-sm text-gray-500">Share your thoughts with the community</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's happening in your professional world?"
                        className="w-full p-4 border-2 border-gray-100 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                        rows="4"
                        maxLength={1000}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2">
                        {content.length}/1000
                    </div>
                </div>

                {/* Media Options */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
                        >
                            <Image size={20} />
                            <span className="hidden sm:inline text-sm font-medium">Photo</span>
                        </button>

                        <button
                            type="button"
                            className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-200 p-2 rounded-lg hover:bg-green-50"
                        >
                            <Video size={20} />
                            <span className="hidden sm:inline text-sm font-medium">Video</span>
                        </button>

                        <button
                            type="button"
                            className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors duration-200 p-2 rounded-lg hover:bg-orange-50"
                        >
                            <Calendar size={20} />
                            <span className="hidden sm:inline text-sm font-medium">Event</span>
                        </button>

                        <button
                            type="button"
                            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors duration-200 p-2 rounded-lg hover:bg-purple-50"
                        >
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={!content.trim() || loading}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 font-medium shadow-lg"
                    >
                        <Send size={16} />
                        <span>{loading ? 'Posting...' : 'Post'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;