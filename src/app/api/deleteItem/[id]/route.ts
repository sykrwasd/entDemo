import { connectToDatabase } from "@/../lib/mongoose.js";
import Item from "@/../models/Item.js";
import mongoose from "mongoose";

export async function  DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const {id} = await params;
   
    const deletedItem = await Item.findByIdAndDelete(id)
    

    return new Response(JSON.stringify(deletedItem), { status: 200 });
  } catch (err) {
    console.error("Error updating item:", err);
    return new Response(JSON.stringify({ error: "Failed to update item" }), { status: 500 });
  }
}
