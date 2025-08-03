import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { RefreshCw, TrendingUp, Users, Briefcase, Eye, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API_URL}/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreated = async (content) => {
        try {
            const response = await axios.post(`${API_URL}/posts`, { content });
            setPosts([response.data, ...posts]);
            return true;
        } catch (error) {
            console.error('Error creating post:', error);
            return false;
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {/* Left Sidebar */}
                    <div className="hidden lg:block">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white font-bold text-xl">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{user?.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{user?.bio || 'Professional'}</p>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">Profile views</span>
                                        <span className="text-sm font-semibold text-blue-600">245</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Connections</span>
                                        <span className="text-sm font-semibold text-blue-600">156</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                            <div className="space-y-3">
                                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
                                    <Users className="text-blue-600" size={20} />
                                    <span className="text-sm text-gray-700">Find connections</span>
                                </button>
                                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
                                    <Briefcase className="text-green-600" size={20} />
                                    <span className="text-sm text-gray-700">Explore jobs</span>
                                </button>
                                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
                                    <TrendingUp className="text-purple-600" size={20} />
                                    <span className="text-sm text-gray-700">View analytics</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <CreatePost onPostCreated={handlePostCreated} />

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                Recent Posts
                                <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                    {posts.length}
                                </span>
                            </h2>
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                            >
                                <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                                <span className="font-medium">Refresh</span>
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 text-lg">Loading amazing posts...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-200">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Plus size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                                <p className="text-gray-600 mb-6">Be the first to share something amazing with the community!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {posts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block">
                        {/* Trending Topics */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <TrendingUp className="mr-2 text-orange-500" size={20} />
                                Trending Topics
                            </h4>
                            <div className="space-y-3">
                                {['#WebDevelopment', '#ReactJS', '#NodeJS', '#UI/UX', '#JavaScript'].map((topic, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                                        <span className="text-sm font-medium text-blue-600">{topic}</span>
                                        <span className="text-xs text-gray-500">{Math.floor(Math.random() * 100)}k posts</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Suggested Connections */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <Users className="mr-2 text-blue-500" size={20} />
                                People you may know
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { name: 'Sarah Johnson', role: 'Frontend Developer', mutual: 12 },
                                    { name: 'Mike Chen', role: 'Product Manager', mutual: 8 },
                                    { name: 'Emma Davis', role: 'UX Designer', mutual: 5 }
                                ].map((person, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                {person.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm truncate">{person.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{person.role}</p>
                                            <p className="text-xs text-gray-400">{person.mutual} mutual connections</p>
                                        </div>
                                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors duration-200">
                                            Connect
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;