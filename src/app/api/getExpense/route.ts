import { connectToDatabase } from "@/../lib/mongoose.js";
import Expense from "@/../models/Expense";

await connectToDatabase();

export async function GET(req: Request) {
  try {
    const e = await Expense.find({}); // get all items

    //console.log(e);
    return new Response(JSON.stringify(e), { status: 200 });
    
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch items" }), { status: 500 });
  }
}
