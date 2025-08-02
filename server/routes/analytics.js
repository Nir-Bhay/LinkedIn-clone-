const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard analytics (admin only)
router.get('/dashboard', auth, async (req, res) => {
    try {
        // Simple admin check - in real app, you'd have proper role-based auth
        if (req.user.email !== 'admin@linkedin.com') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const totalUsers = await User.countDocuments({ isActive: true });
        const totalPosts = await Post.countDocuments({ isPublic: true });
        const totalConnections = await User.aggregate([
            {
                $project: {
                    connectionCount: {
                        $size: {
                            $filter: {
                                input: '$connections',
                                cond: { $eq: ['$$this.status', 'accepted'] }
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$connectionCount' }
                }
            }
        ]);

        const activeUsers = await User.countDocuments({
            lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            isActive: true
        });

        // User growth over last 30 days
        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
                    isActive: true
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    users: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // Post engagement stats
        const postStats = await Post.aggregate([
            {
                $project: {
                    likesCount: { $size: '$likes' },
                    commentsCount: { $size: '$comments' },
                    sharesCount: { $size: '$shares' }
                }
            },
            {
                $group: {
                    _id: null,
                    avgLikes: { $avg: '$likesCount' },
                    avgComments: { $avg: '$commentsCount' },
                    avgShares: { $avg: '$sharesCount' },
                    totalLikes: { $sum: '$likesCount' },
                    totalComments: { $sum: '$commentsCount' },
                    totalShares: { $sum: '$sharesCount' }
                }
            }
        ]);

        res.json({
            overview: {
                totalUsers,
                totalPosts,
                totalConnections: totalConnections[0]?.total || 0,
                activeUsers
            },
            userGrowth,
            engagement: postStats[0] || {
                avgLikes: 0,
                avgComments: 0,
                avgShares: 0,
                totalLikes: 0,
                totalComments: 0,
                totalShares: 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user personal analytics
router.get('/personal', auth, async (req, res) => {
    try {
        const userId = req.user._id;

        // Get user's posts
        const posts = await Post.find({ author: userId });

        // Calculate engagement over time
        const engagementOverTime = await Post.aggregate([
            { $match: { author: userId } },
            {
                $project: {
                    date: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    engagement: {
                        $add: [
                            { $size: '$likes' },
                            { $size: '$comments' },
                            { $size: '$shares' }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$date',
                    totalEngagement: { $sum: '$engagement' },
                    postCount: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // Get top performing posts
        const topPosts = await Post.find({ author: userId })
            .sort({
                'likes.length': -1,
                'comments.length': -1,
                'shares.length': -1
            })
            .limit(5)
            .select('content likes comments shares createdAt');

        // Profile views over time (mock data - you'd track this in real app)
        const profileViews = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return {
                date: date.toISOString().split('T')[0],
                views: Math.floor(Math.random() * 20) + 5
            };
        }).reverse();

        res.json({
            engagementOverTime,
            topPosts,
            profileViews,
            summary: {
                totalPosts: posts.length,
                totalLikes: posts.reduce((sum, post) => sum + post.likes.length, 0),
                totalComments: posts.reduce((sum, post) => sum + post.comments.length, 0),
                totalShares: posts.reduce((sum, post) => sum + post.shares.length, 0),
                profileViews: req.user.profileViews
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;