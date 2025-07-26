// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem', required: true }],
  shippingAddress1: { type: String, required: true },
  shippingAddress2: String,
  city: String,
  zip: String,
  country: String,
  phone: Number,
  status: { type: String, default: 'Pending' },
  totalPrice: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateOrdered: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
