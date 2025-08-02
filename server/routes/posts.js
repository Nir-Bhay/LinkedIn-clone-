const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create a post
router.post('/', auth, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Content is required' });
        }

        const post = new Post({
            content: content.trim(),
            author: req.user._id
        });

        await post.save();
        await post.populate('author', 'name email');

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get posts by user
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;