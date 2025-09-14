import { connectToDatabase } from "@/../lib/mongoose.js";
import Expense from "@/../models/Expense";


await connectToDatabase();

export async function POST(req: Request) {
  try {

    const {newExpense} = await req.json();
    console.log("Route",newExpense)
    console.log("name", newExpense.name);

    const newE = new Expense({
        expense_category : newExpense.category,
        expense_description: newExpense.description,
        expense_amount: newExpense.amount,
        
    });
    await newE.save();
   
     return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });

  } catch (err) {
    console.error("Error adding item:", err);
    return new Response(JSON.stringify({ error: "Failed to add item" }), {
      status: 500,
    });
    
  }
}