import { connectToDatabase } from "@/../lib/mongoose.js";
import Sales from "@/../models/Sales";
import mongoose from "mongoose";

export async function  DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const {id} = await params;
   
    const deletedSales = await Sales.findByIdAndDelete(id)
    

    return new Response(JSON.stringify(deletedSales), { status: 200 });
  } catch (err) {
    console.error("Error updating item:", err);
    return new Response(JSON.stringify({ error: "Failed to update item" }), { status: 500 });
  }
}
