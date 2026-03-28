require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Item = require('./models/Item');

const app = express();
app.use(cors());
app.use(express.json());

// Check if we have real credentials
const isUsingPlaceholders = process.env.MONGO_URI.includes('<username>') || !process.env.MONGO_URI;
let mockItems = [
  { ProductName: 'Blue T-Shirt', CurrentStock: 45, TotalSold: 120, TotalRevenue: 2400, TotalCost: 1000, Status: 'In Stock', Margin: 58, Cost: 10, CurrentPrice: 20 },
  { ProductName: 'Leather Belt', CurrentStock: 12, TotalSold: 340, TotalRevenue: 15300, TotalCost: 6000, Status: 'Low Stock', Margin: 60, Cost: 25, CurrentPrice: 45 }
]; 

if (!isUsingPlaceholders) {
  mongoose.connect(process.env.MONGO_URI, {
  }).then(() => console.log('MongoDB Connected to Atlas'))
    .catch(err => {
      console.error('Failed to connect to MongoDB, falling back to mock mode.');
      console.error(err);
    });
} else {
  console.log('--- Running in DEMO/MOCK MODE ---');
}

// Get all inventory
app.get('/api/inventory', async (req, res) => {
  try {
    if (isUsingPlaceholders) return res.json(mockItems);
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
    
    if (isUsingPlaceholders) {
      const item = mockItems.find(i => i.ProductName === productName);
      if (!item) return res.status(404).json({ error: 'Item not found in mock data' });
      item.CurrentStock = Math.max(0, item.CurrentStock + change);
      return res.json(item);
    }

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
    
    if (isUsingPlaceholders) {
      mockItems = inventory;
      return res.json(mockItems);
    }

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
