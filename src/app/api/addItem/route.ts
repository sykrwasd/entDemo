import { connectToDatabase } from "@/../lib/mongoose.js";
import Item from "@/../models/Item.js";


await connectToDatabase();

export async function POST(req: Request) {
  try {

    const {newProduct} = await req.json();
    console.log("ROute",newProduct)
    console.log("name", newProduct.name);

    const newItem = new Item({
        item_name : newProduct.name,
        item_price : newProduct.price,
        item_stock: newProduct.stock,
        item_description: newProduct.description,
        item_color: newProduct.color,
        
    });
    await newItem.save();
   
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