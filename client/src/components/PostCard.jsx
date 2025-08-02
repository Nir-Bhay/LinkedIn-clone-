import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share, MoreHorizontal, ThumbsUp, Send } from 'lucide-react';

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 1);
    const [showComments, setShowComments] = useState(false);

    const formatDate = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffInSeconds = Math.floor((now - postDate) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

        return postDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const handleLike = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Post Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <Link to={`/profile/${post.author._id}`}>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                                <span className="text-white font-semibold text-lg">
                                    {post.author.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </Link>
                        <div>
                            <Link
                                to={`/profile/${post.author._id}`}
                                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                            >
                                {post.author.name}
                            </Link>
                            <p className="text-sm text-gray-500">
                                Professional • {formatDate(post.createdAt)}
                            </p>
                        </div>
                    </div>

                    <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Post Content */}
            <div className="px-6 pb-4">
                <p className="text-gray-800 leading-relaxed text-lg">{post.content}</p>
            </div>

            {/* Engagement Stats */}
            <div className="px-6 py-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                        <div className="flex -space-x-1">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <ThumbsUp size={12} className="text-white" />
                            </div>
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <Heart size={12} className="text-white" />
                            </div>
                        </div>
                        <span>{likes} reactions</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span>{Math.floor(Math.random() * 10) + 1} comments</span>
                        <span>{Math.floor(Math.random() * 5) + 1} shares</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-3 border-t border-gray-100">
                <div className="flex items-center justify-around">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${liked
                                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                            }`}
                    >
                        <ThumbsUp size={20} className={liked ? 'fill-current' : ''} />
                        <span className="font-medium">Like</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-50 transition-all duration-200"
                    >
                        <MessageCircle size={20} />
                        <span className="font-medium">Comment</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-50 transition-all duration-200">
                        <Share size={20} />
                        <span className="font-medium">Share</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-gray-50 transition-all duration-200">
                        <Send size={20} />
                        <span className="font-medium">Send</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">You</span>
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;