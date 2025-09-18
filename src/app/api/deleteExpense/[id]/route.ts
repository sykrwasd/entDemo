import { connectToDatabase } from "@/../lib/mongoose.js";
import mongoose from "mongoose";
import expense from "@/../models/Expense";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const {id} = params;
   
    const deleted = await expense.findByIdAndDelete(id)
    

    return new Response(JSON.stringify(deleted), { status: 200 });
  } catch (err) {
    console.error("Error updating item:", err);
    return new Response(JSON.stringify({ error: "Failed to update item" }), { status: 500 });
  }
}
