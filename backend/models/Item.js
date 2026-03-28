const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  ProductName: { type: String, required: true, unique: true },
  CurrentStock: { type: Number, default: 0 },
  TotalSold: { type: Number, default: 0 },
  TotalRevenue: { type: Number, default: 0 },
  TotalCost: { type: Number, default: 0 },
  Status: { type: String, default: 'Neutral' },
  Margin: { type: Number, default: 0 },
  Cost: { type: Number, default: 0 },
  CurrentPrice: { type: Number, default: 0 }
});

module.exports = mongoose.model('Item', itemSchema);
