import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/../lib/mongoose.js";
import expense from "@/../models/Expense";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    // ✅ direct access
    const { id } = await context.params;

    const deleted = await expense.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense deleted successfully",
      deleted,
    });
  } catch (err: any) {
    console.error("Error deleting expense:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
