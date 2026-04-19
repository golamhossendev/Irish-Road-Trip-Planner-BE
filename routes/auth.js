const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const auth = require('../middleware/auth.js');
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        // You MUST extract the variables from req.body first
        const { name, email, password } = req.body;

        // Now you can log them

        // Simple check to make sure data arrived
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save to Database
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword 
        });
        
        await newUser.save();

        res.status(201).json({ 
            success: true, 
            message: "User registered successfully!" 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});
// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password, "<<<<<<<"); // Check your terminal to see if this prints
  
        // 1. Basic Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing email or password" });
        }

        // 2. Find User
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 3. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // 4. Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // 5. SEND RESPONSE (Crucial!)
        return res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
      
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});
module.exports = router;