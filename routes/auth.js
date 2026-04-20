const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Show register form
router.get('/register', (req, res) => {
  res.render('auth/register', { error: null });
});

// Handle register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.render('auth/register', { error: 'Email already registered' });
    }

    const user = await User.create({ name, email, phone, password, role });
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    res.redirect('/');
  } catch (err) {
    res.render('auth/register', { error: 'Registration failed. Try again.' });
  }
});

// Show login form
router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

// Handle login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    res.redirect('/');
  } catch (err) {
    res.render('auth/login', { error: 'Login failed. Try again.' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
