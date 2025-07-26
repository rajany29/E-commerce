// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  richDescription: String,
  image: String,
  images: [String],
  brand: String,
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  countInStock: { type: Number, required: true },
  rating: Number,
  isFeatured: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now }
});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});


module.exports = mongoose.model('Product', productSchema);
