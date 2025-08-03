import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import {
    User, Mail, Edit3, Save, X, MapPin, Calendar,
    Briefcase, GraduationCap, Award, ExternalLink,
    Eye, MessageCircle, UserPlus
} from 'lucide-react';

const Profile = () => {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        bio: ''
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const isOwnProfile = currentUser?.id === userId;

    useEffect(() => {
        fetchUserProfile();
        fetchUserPosts();
    }, [userId]);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}`);
            setUser(response.data);
            setEditForm({
                name: response.data.name,
                bio: response.data.bio || ''
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await axios.get(`${API_URL}/posts/user/${userId}`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = async () => {
        try {
            const response = await axios.put(`${API_URL}/users/profile`, editForm);
            setUser(response.data);
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditForm({
            name: user.name,
            bio: user.bio || ''
        });
        setEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User size={48} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">User not found</h3>
                        <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
                        {/* Cover Photo */}
                        <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 relative">
                            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        </div>

                        {/* Profile Info */}
                        <div className="relative px-8 pb-8">
                            <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6">
                                {/* Profile Picture */}
                                <div className="relative -mt-16 mb-4 lg:mb-0">
                                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                                        <span className="text-white font-bold text-4xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    {isOwnProfile && (
                                        <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200">
                                            <Edit3 size={16} className="text-gray-600" />
                                        </button>
                                    )}
                                </div>

                                {/* Profile Details */}
                                <div className="flex-1">
                                    {editing ? (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="text-3xl font-bold border-b-2 border-blue-500 focus:outline-none bg-transparent w-full"
                                            />
                                            <textarea
                                                value={editForm.bio}
                                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                                placeholder="Tell us about yourself..."
                                                rows="3"
                                                maxLength={500}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            />
                                            <p className="text-sm text-gray-500">{editForm.bio.length}/500 characters</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                                            <div className="flex items-center text-gray-600 mb-2">
                                                <Mail size={16} className="mr-2" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center text-gray-600 mb-4">
                                                <MapPin size={16} className="mr-2" />
                                                <span>San Francisco, CA</span>
                                                <Calendar size={16} className="ml-4 mr-2" />
                                                <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                            </div>
                                            {user.bio && (
                                                <p className="text-gray-700 leading-relaxed mb-4">{user.bio}</p>
                                            )}

                                            {/* Stats */}
                                            <div className="flex items-center space-x-6 text-sm">
                                                <div className="flex items-center space-x-1">
                                                    <Eye size={16} className="text-gray-500" />
                                                    <span className="font-semibold">245</span>
                                                    <span className="text-gray-500">profile views</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <User size={16} className="text-gray-500" />
                                                    <span className="font-semibold">156</span>
                                                    <span className="text-gray-500">connections</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3 mt-4 lg:mt-0">
                                    {isOwnProfile ? (
                                        editing ? (
                                            <>
                                                <button
                                                    onClick={handleEditProfile}
                                                    className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 flex items-center space-x-2 font-medium shadow-lg transition-all duration-200 transform hover:scale-105"
                                                >
                                                    <Save size={16} />
                                                    <span>Save</span>
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 flex items-center space-x-2 font-medium shadow-lg transition-all duration-200"
                                                >
                                                    <X size={16} />
                                                    <span>Cancel</span>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setEditing(true)}
                                                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 flex items-center space-x-2 font-medium shadow-lg transition-all duration-200 transform hover:scale-105"
                                            >
                                                <Edit3 size={16} />
                                                <span>Edit Profile</span>
                                            </button>
                                        )
                                    ) : (
                                        <>
                                            <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 flex items-center space-x-2 font-medium shadow-lg transition-all duration-200 transform hover:scale-105">
                                                <UserPlus size={16} />
                                                <span>Connect</span>
                                            </button>
                                            <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-300 flex items-center space-x-2 font-medium shadow-lg transition-all duration-200">
                                                <MessageCircle size={16} />
                                                <span>Message</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - About */}
                        <div className="space-y-6">
                            {/* About Section */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">About</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Briefcase className="text-blue-600" size={20} />
                                        <div>
                                            <p className="font-medium text-gray-900">Full Stack Developer</p>
                                            <p className="text-sm text-gray-500">Tech Company</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <GraduationCap className="text-green-600" size={20} />
                                        <div>
                                            <p className="font-medium text-gray-900">Computer Science</p>
                                            <p className="text-sm text-gray-500">University of Technology</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Award className="text-purple-600" size={20} />
                                        <div>
                                            <p className="font-medium text-gray-900">Top Performer</p>
                                            <p className="text-sm text-gray-500">2023 Achievement</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Skills & Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'UI/UX Design', 'TypeScript', 'AWS'].map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Activity Section */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <p className="text-sm text-gray-700">Published a new post</p>
                                        <span className="text-xs text-gray-500 ml-auto">2h ago</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <p className="text-sm text-gray-700">Updated profile information</p>
                                        <span className="text-xs text-gray-500 ml-auto">1d ago</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <p className="text-sm text-gray-700">Connected with 5 new people</p>
                                        <span className="text-xs text-gray-500 ml-auto">3d ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Posts */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {isOwnProfile ? 'Your Posts' : `${user.name}'s Posts`}
                                        </h2>
                                        <p className="text-gray-500 mt-1">
                                            {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                            {posts.length}
                                        </span>
                                    </div>
                                </div>

                                {posts.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MessageCircle size={32} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {isOwnProfile ? "You haven't posted anything yet" : "No posts to show"}
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            {isOwnProfile
                                                ? "Share your thoughts and connect with your network!"
                                                : "This user hasn't shared any posts yet."
                                            }
                                        </p>
                                        {isOwnProfile && (
                                            <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 font-medium transition-all duration-200 transform hover:scale-105">
                                                Create your first post
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {posts.map((post) => (
                                            <PostCard key={post._id} post={post} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;