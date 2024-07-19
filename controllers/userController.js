const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, username: newUser.username, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
};

const loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    if (user.username === 'admin' && bcrypt.compareSync(password, 'salam123')) {
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin');
    } else {
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    }
};

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.render("profile", { user });
};

const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.render("users", { users });
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, email, role, updatedAt: new Date() },
        { new: true }
    );
    if (updatedUser) {
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
        res.json(deletedUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, getAllUsers, updateUser, deleteUser };
