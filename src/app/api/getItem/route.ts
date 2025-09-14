import { connectToDatabase } from "@/../lib/mongoose.js";
import Item from "@/../models/Item.js";

await connectToDatabase();

export async function GET(req: Request) {
  try {
    const item = await Item.find({}); // get all items

    console.log(item);
    return new Response(JSON.stringify(item), { status: 200 });
    
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch items" }), { status: 500 });
  }
}
