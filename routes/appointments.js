const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Listing = require('../models/Listing');
const { requireLogin } = require('../middleware/auth');

// Book appointment form
router.get('/new/:listingId', requireLogin, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId).populate('seller', 'name');
    if (!listing) return res.redirect('/');
    res.render('appointments/new', { listing, error: null });
  } catch (err) {
    res.redirect('/');
  }
});

// Create appointment
router.post('/', requireLogin, async (req, res) => {
  try {
    const { listingId, date, time, message } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.redirect('/');

    await Appointment.create({
      listing: listingId,
      buyer: req.session.user.id,
      seller: listing.seller,
      date: new Date(date),
      time,
      message
    });

    res.redirect('/appointments/my');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// My appointments (as buyer)
router.get('/my', requireLogin, async (req, res) => {
  try {
    const appointments = await Appointment.find({ buyer: req.session.user.id })
      .populate('listing', 'title category brand model price images')
      .populate('seller', 'name phone email')
      .sort({ date: 1 });
    res.render('appointments/my', { appointments });
  } catch (err) {
    res.render('appointments/my', { appointments: [], error: 'Failed to load' });
  }
});

// Seller's incoming appointments
router.get('/incoming', requireLogin, async (req, res) => {
  try {
    const appointments = await Appointment.find({ seller: req.session.user.id })
      .populate('listing', 'title brand model price')
      .populate('buyer', 'name phone email')
      .sort({ date: 1 });
    res.render('appointments/incoming', { appointments });
  } catch (err) {
    res.render('appointments/incoming', { appointments: [], error: 'Failed to load' });
  }
});

// Update appointment status (seller confirms/cancels)
router.post('/:id/status', requireLogin, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt || appt.seller.toString() !== req.session.user.id) return res.redirect('/appointments/incoming');
    appt.status = req.body.status;
    await appt.save();
    res.redirect('/appointments/incoming');
  } catch (err) {
    res.redirect('/appointments/incoming');
  }
});

// Cancel as buyer
router.post('/:id/cancel', requireLogin, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (appt && appt.buyer.toString() === req.session.user.id) {
      appt.status = 'cancelled';
      await appt.save();
    }
    res.redirect('/appointments/my');
  } catch (err) {
    res.redirect('/appointments/my');
  }
});

module.exports = router;
