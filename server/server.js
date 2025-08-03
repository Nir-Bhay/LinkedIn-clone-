const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

// Middleware - CORS first
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:3001',
            'https://linked-in-clone-jet-three.vercel.app'
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    next();
});

// Basic health check route
app.get('/', (req, res) => {
    res.json({
        message: 'LinkedIn Clone API is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use('*', (req, res) => {
    console.log('404 - Route not found:', req.method, req.originalUrl);
    res.status(404).json({
        error: 'Route not found',
        method: req.method,
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Global Error:', error);
    res.status(error.status || 500).json({
        error: error.message || 'Internal Server Error',
        timestamp: new Date().toISOString()
    });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/linkedin-clone')
    .then(() => {
        console.log('✅ Connected to MongoDB');
        console.log('📂 Database:', mongoose.connection.name);

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌐 Local URL: http://localhost:${PORT}`);
            console.log(`📊 Health Check: http://localhost:${PORT}/health`);
            console.log(`🔗 API Base: http://localhost:${PORT}/api`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    mongoose.connection.close(() => {
        process.exit(0);
    });
});