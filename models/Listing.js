const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  seller:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  category:    { type: String, enum: ['Car', 'Bike', 'Truck', 'Scooter', 'Other'], required: true },
  brand:       { type: String, required: true },
  model:       { type: String, required: true },
  year:        { type: Number, required: true },
  price:       { type: Number, required: true },
  mileage:     { type: Number },         // in km
  fuel:        { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'] },
  transmission:{ type: String, enum: ['Manual', 'Automatic'] },
  color:       { type: String },
  description: { type: String },
  location:    { type: String, required: true },
  images:      [{ type: String }],       // stored file paths
  status:      { type: String, enum: ['available', 'sold'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
