  const mongoose = require('mongoose');

  const expenseSchema = new mongoose.Schema({
    expense_category: { type: String, required: true },
    expense_description: { type: String, required: true },
    expense_amount: { type: Number, required: true },
    expense_date: { type: String, required: true },


  });

  export default mongoose.models.expense || mongoose.model("expense", expenseSchema);
