  const mongoose = require('mongoose');

  const itemSchema = new mongoose.Schema({
    item_name: { type: String, required: true }, 
    item_price: { type: Number, required: true },
    item_stock: { type: Number, required: true },
    item_description: { type: String },
    item_color: { type: String, required: true },


  });

  export default mongoose.models.item || mongoose.model("item", itemSchema);
