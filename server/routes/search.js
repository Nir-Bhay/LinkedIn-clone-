const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// General search
router.get('/', auth, async (req, res) => {
    try {
        const { q, type = 'all', page = 1, limit = 10 } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const searchRegex = new RegExp(q, 'i');

        let results = {};

        if (type === 'all' || type === 'users') {
            const users = await User.find({
                $or: [
                    { name: searchRegex },
                    { jobTitle: searchRegex },
                    { company: searchRegex },
                    { skills: { $in: [searchRegex] } }
                ],
                isActive: true
            })
                .select('name profilePicture jobTitle company location')
                .skip(skip)
                .limit(parseInt(limit));

            results.users = users;
        }

        if (type === 'all' || type === 'posts') {
            const posts = await Post.find({
                content: searchRegex,
                isPublic: true
            })
                .populate('author', 'name profilePicture jobTitle')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            results.posts = posts;
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get trending searches
router.get('/trending', async (req, res) => {
    try {
        // Mock trending data - in real app, you'd track search queries
        const trending = [
            { query: 'React Developer', count: 245 },
            { query: 'Node.js', count: 189 },
            { query: 'UI/UX Designer', count: 156 },
            { query: 'Full Stack', count: 134 },
            { query: 'JavaScript', count: 128 },
            { query: 'Product Manager', count: 95 },
            { query: 'Data Science', count: 87 },
            { query: 'DevOps', count: 76 }
        ];

        res.json(trending);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;