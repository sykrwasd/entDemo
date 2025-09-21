const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  customerName: { type: String, required: true },  // Customer’s name
  colleague: { type: String, required: true },     // Alpha,Beta,Gamma
  item: { type: String, required: true },          // Name of item sold (Based on item.js)
  quantity: { type: Number, required: true },      // Quantity sold
  price: { type: Number, required: true },         // Price per item
  total: { type: Number, required: true },         // Total = qty * price
  date: { type: Date, default: Date.now },         // Sale date
});


  export default mongoose.models.sales || mongoose.model("sales", salesSchema);
