import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, User, FileText } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ users: [], posts: [] });
    const [trending, setTrending] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchTrending();
    }, []);

    useEffect(() => {
        if (query.trim()) {
            const delayedSearch = setTimeout(() => {
                performSearch();
            }, 300);
            return () => clearTimeout(delayedSearch);
        } else {
            setResults({ users: [], posts: [] });
        }
    }, [query]);

    const fetchTrending = async () => {
        try {
            const response = await axios.get(`${API_URL}/search/trending`);
            setTrending(response.data);
        } catch (error) {
            console.error('Error fetching trending:', error);
        }
    };

    const performSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/search?q=${encodeURIComponent(query)}&limit=5`);
            setResults(response.data);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults({ users: [], posts: [] });
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={searchRef}>
            <div className="relative">
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search for people, posts, companies..."
                    className="pl-11 pr-10 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 w-64 lg:w-80"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                    {loading && (
                        <div className="p-4 text-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">Searching...</p>
                        </div>
                    )}

                    {!loading && query && (results.users.length > 0 || results.posts.length > 0) && (
                        <div className="p-2">
                            {/* Users Results */}
                            {results.users.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 px-3 py-2 flex items-center">
                                        <User size={16} className="mr-2" />
                                        People
                                    </h4>
                                    {results.users.map((user) => (
                                        <Link
                                            key={user._id}
                                            to={`/profile/${user._id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {user.jobTitle} {user.company && `at ${user.company}`}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Posts Results */}
                            {results.posts.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 px-3 py-2 flex items-center">
                                        <FileText size={16} className="mr-2" />
                                        Posts
                                    </h4>
                                    {results.posts.map((post) => (
                                        <div
                                            key={post._id}
                                            className="px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {post.author.name}
                                                </span>
                                                <span className="text-xs text-gray-500">•</span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 line-clamp-2">
                                                {post.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {!loading && query && results.users.length === 0 && results.posts.length === 0 && (
                        <div className="p-4 text-center">
                            <p className="text-gray-500">No results found for "{query}"</p>
                        </div>
                    )}

                    {/* Trending when no search */}
                    {!query && trending.length > 0 && (
                        <div className="p-2">
                            <h4 className="text-sm font-semibold text-gray-700 px-3 py-2 flex items-center">
                                <TrendingUp size={16} className="mr-2" />
                                Trending Searches
                            </h4>
                            {trending.slice(0, 8).map((trend, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setQuery(trend.query);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center justify-between"
                                >
                                    <span className="text-sm text-gray-700">{trend.query}</span>
                                    <span className="text-xs text-gray-500">{trend.count}k</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;