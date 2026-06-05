const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

async function registerUser(req, res) {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            role
        })

        const token = jwt.sign({
            id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET)

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })

        res.status(201).json({
            message: "User Registered Successfully",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;

        const user = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password is Incorrect" })
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET)

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })

        res.status(200).json({
            message: "User Login in successfully",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function logoutUser(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.status(200).json({ message: "User logged out successfully" })
}

module.exports = { registerUser, loginUser, logoutUser }