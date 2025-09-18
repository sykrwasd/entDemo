import { connectToDatabase } from "@/../lib/mongoose.js";
import Item from "@/../models/Item.js";
import mongoose from "mongoose";

export async function  PUT(
  req: Request,
 context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const {id} = await context.params;
   

    const body = await req.json();

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      {
        item_name: body.name,
        item_price: Number(body.price),
        item_stock: Number(body.stock),
        item_description: body.description,
        item_color: body.color,
      },
      { new: true }
    );

    if (!updatedItem) {
      return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedItem.toObject()), { status: 200 });
  } catch (err) {
    console.error("Error updating item:", err);
    return new Response(JSON.stringify({ error: "Failed to update item" }), { status: 500 });
  }
}
