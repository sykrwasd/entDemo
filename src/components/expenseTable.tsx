import { Edit, Trash2 } from "lucide-react";

type Expense = {
  _id: string;
  expense_category: string;
  expense_description: string;
  expense_amount: number;
  expense_date: string;
};


type Props = {
  expense: Expense[]
  onDelete: (id: string) => void;
};


export default function ExpenseTable({expense,onDelete}:Props){
    return (
        <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      {["Category", "Description", "Amount (RM)", "Date", "Actions"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {expense.map((expense, idx) => (
                      <tr
                        key={expense._id}
                        className={`transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-indigo-50`}
                      >
                        <td className="px-6 py-4 font-semibold text-sm text-indigo-600">
                          {expense.expense_category}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {expense.expense_description}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-red-400 text-white shadow-sm">
                            RM{expense.expense_amount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {expense.expense_date}
                        </td>
                         <td className="px-6 py-4">
                          <div className="flex space-x-2">
                         
                            
                            <button
                              onClick={() => onDelete(expense._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                    ))}
                  </tbody>
                </table>
              </div>
    )
}