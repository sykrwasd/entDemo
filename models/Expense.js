  const mongoose = require('mongoose');

  const expenseSchema = new mongoose.Schema({
    expense_category: { type: String, required: true }, // Supplies,Marketing, Transport, Utilities, Other
    expense_description: { type: String, required: true }, // if Others, state here
    expense_amount: { type: Number, required: true }, // number 
    expense_date: { type: String, required: true }, 


  });

  export default mongoose.models.expense || mongoose.model("expense", expenseSchema);
