const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Listing = require('../models/Listing');
const { requireLogin } = require('../middleware/auth');

// Multer setup - save images to public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// All listings page (same as home but without limit)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'available' })
      .populate('seller', 'name')
      .sort({ createdAt: -1 });
    res.render('listings/index', { listings });
  } catch (err) {
    res.render('listings/index', { listings: [], error: 'Failed to load' });
  }
});

// Show create form
router.get('/new', requireLogin, (req, res) => {
  res.render('listings/new', { error: null });
});

// Create listing
router.post('/', requireLogin, upload.array('images', 4), async (req, res) => {
  try {
    const { title, category, brand, model, year, price, mileage, fuel, transmission, color, description, location } = req.body;
    const images = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];

    await Listing.create({
      seller: req.session.user.id,
      title, category, brand, model,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      fuel, transmission, color, description, location, images
    });

    res.redirect('/listings/my');
  } catch (err) {
    console.error(err);
    res.render('listings/new', { error: 'Failed to create listing. Check all fields.' });
  }
});

// My listings
router.get('/my', requireLogin, async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.session.user.id }).sort({ createdAt: -1 });
    res.render('listings/my', { listings });
  } catch (err) {
    res.render('listings/my', { listings: [], error: 'Failed to load' });
  }
});

// View single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name email phone');
    if (!listing) return res.redirect('/');
    res.render('listings/show', { listing });
  } catch (err) {
    res.redirect('/');
  }
});

// Edit form
router.get('/:id/edit', requireLogin, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing || listing.seller.toString() !== req.session.user.id) return res.redirect('/listings/my');
    res.render('listings/edit', { listing, error: null });
  } catch (err) {
    res.redirect('/listings/my');
  }
});

// Update listing
router.put('/:id', requireLogin, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing || listing.seller.toString() !== req.session.user.id) return res.redirect('/listings/my');

    const { title, category, brand, model, year, price, mileage, fuel, transmission, color, description, location, status } = req.body;
    await Listing.findByIdAndUpdate(req.params.id, {
      title, category, brand, model,
      year: Number(year), price: Number(price), mileage: Number(mileage),
      fuel, transmission, color, description, location, status
    });

    res.redirect('/listings/my');
  } catch (err) {
    res.redirect('/listings/my');
  }
});

// Delete listing
router.delete('/:id', requireLogin, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing && listing.seller.toString() === req.session.user.id) {
      await Listing.findByIdAndDelete(req.params.id);
    }
    res.redirect('/listings/my');
  } catch (err) {
    res.redirect('/listings/my');
  }
});

module.exports = router;
