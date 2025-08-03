import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Use environment variable or fallback
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    console.log('🔗 API URL:', API_URL); // Debug log

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('📱 Token from localStorage:', token ? 'exists' : 'not found');

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            console.log('👤 Fetching user from:', `${API_URL}/auth/me`);
            const response = await axios.get(`${API_URL}/auth/me`);
            console.log('✅ User fetched successfully:', response.data);
            setUser(response.data.user);
        } catch (error) {
            console.error('❌ Error fetching user:', error);
            console.error('📍 API URL was:', `${API_URL}/auth/me`);
            console.error('🔍 Error details:', error.response?.data || error.message);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            console.log('🔐 Attempting login for:', email);
            console.log('📍 Login URL:', `${API_URL}/auth/login`);

            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            console.log('✅ Login successful:', response.data);

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);

            return { success: true };
        } catch (error) {
            console.error('❌ Login error:', error);
            console.error('🔍 Error details:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password, bio) => {
        try {
            console.log('📝 Attempting registration for:', email);
            console.log('📍 Register URL:', `${API_URL}/auth/register`);

            const response = await axios.post(`${API_URL}/auth/register`, {
                name, email, password, bio
            });
            console.log('✅ Registration successful:', response.data);

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);

            return { success: true };
        } catch (error) {
            console.error('❌ Registration error:', error);
            console.error('🔍 Error details:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        console.log('🚪 Logging out...');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};