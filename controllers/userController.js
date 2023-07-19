const User = require('../models/userModel');
const Note = require('../models/noteModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc    Create new user
// @route    POST    /users
// @access  Private
exports.createUser = asyncHandler(async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please enter username and password'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({ username, password: hashedPassword, role });
    if (user) {
        res.status(200).json({ User: user });
    } else {
        res.status(400).json({ error: `Failure creating user` });
    }
});

// @desc    Get all users
// @route    GET    /users
// @access  Public
exports.getUsers = asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({}).skip(skip).limit(limit);
    if (!users.length) {
        return res.status(400).json({
            success: false,
            message: 'No users found'
        });
    }
    res.status(200).json({ result: users.length, message: users});
});

// @desc    Get a specific user by id
// @route    GET    /users
// @access  Public
exports.getUserById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User not found'
        });
    }
    res.status(200).json({ user });
});

// @desc    Update a specific user
// @route    PATCH    /users
// @access  Private
exports.updateUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User not found'
        });
    }
    user.username = req.body.username;
    user.role = req.body.role;
    user.status = req.body.status;
    // if (password) {
    //     user.password = await bcrypt.hash(password, 8);
    // };

    const updatedUser = await user.save();

    res.status(200).json({ updatedUser });
});

// @desc    Delete a specific user
// @route   DELETE    /users
// @access  Private
exports.deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Please enter user id'
        });
    }

    const note = await Note.findOne({ user: id });
    if (note) {
        return res.status(400).json("Cant't delete, user has assigned notes")
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User not found'
        });
    };
    const result = await user.deleteOne();
    res.status(200).json(`${result.username} with ID ${result._id} has been deleted`);
});