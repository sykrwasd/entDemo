import { connectToDatabase } from "@/../lib/mongoose.js";
import Sales from "@/../models/Sales.js";
import Item from "../../../../models/Item";

await connectToDatabase();

export async function POST(req: Request) {
  try {
    const { formData } = await req.json();
    console.log("ROute", formData);
    console.log("name", formData.customerName);

    const newSales = new Sales({
      customerName: formData.customerName,
      colleague: formData.colleague,
      item: formData.item,
      quantity: formData.qty,
      price: formData.price,
      total: formData.total,
      date: formData.date,
    });

    const reduceStock = await Item.findOneAndUpdate(
      { item_name: newSales.item },
      {
        $inc: { item_stock: -newSales.quantity },
      },
      { new: true }
    );

    await newSales.save();

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
