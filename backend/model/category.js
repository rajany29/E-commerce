// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: String,
  icon: String,
  image: String
});

module.exports = mongoose.model('Category', categorySchema);
