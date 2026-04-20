const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// Home page - show recent listings
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    let filter = { status: 'available' };
    if (category) filter.category = category;
    if (search)   filter.title = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter)
      .populate('seller', 'name')
      .sort({ createdAt: -1 })
      .limit(12);

    res.render('index', { listings, query: req.query });
  } catch (err) {
    res.render('index', { listings: [], query: {}, error: 'Failed to load listings' });
  }
});

module.exports = router;
