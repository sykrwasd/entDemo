import { connectToDatabase } from "@/../lib/mongoose.js";
import Sales from "@/../models/Sales.js";

await connectToDatabase();

export async function GET(req: Request) {
  try {
    const sales = await Sales.find({}); // get all items

    //console.log(sales);
    return new Response(JSON.stringify(sales), { status: 200 });
    
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch items" }), { status: 500 });
  }
}
