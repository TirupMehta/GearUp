require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Item = require('./models/Item');

const app = express();
app.use(cors());
app.use(express.json());

// User will provide the URI
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB Connected to Atlas'))
  .catch(err => console.error(err));

// Get all inventory
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update stock manually or via AI
app.post('/api/inventory/stock', async (req, res) => {
  try {
    const { productName, change } = req.body;
    const item = await Item.findOne({ ProductName: productName });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    item.CurrentStock = Math.max(0, item.CurrentStock + change);
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync Parsed Frontend Data into DB
app.post('/api/sync', async (req, res) => {
  try {
    const { inventory } = req.body; 
    for (const data of inventory) {
      await Item.findOneAndUpdate(
        { ProductName: data.ProductName },
        { 
          $set: { 
            TotalSold: data.TotalSold,
            TotalRevenue: data.TotalRevenue,
            TotalCost: data.TotalCost,
            Status: data.Status,
            Margin: data.Margin,
            Cost: data.Cost,
            CurrentPrice: data.CurrentPrice
          },
          // If it's a completely new product, default stock to 100
          $setOnInsert: { CurrentStock: 100 }
        },
        { upsert: true, new: true }
      );
    }
    const allItems = await Item.find();
    res.json(allItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
