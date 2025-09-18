
"use client"

import { Edit, Trash2 } from "lucide-react";

type Sales = {
  _id: string;
  customerName: string;
  colleague: string;
  item: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
};

type Props = {
  sales: Sales[]
  onDelete: (id: string) => void;
};


export default function SalesTable({sales, onDelete}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-500">
        <h3 className="text-xl font-bold text-center text-white tracking-wide">
          Order Management
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Colleague",
                "Customer Name",
                "Item",
                "Quantity",
                "Total",
                "Date",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sales.map((sale, idx) => (
              <tr
                key={sale._id}
                className={`transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-indigo-50`}
              >
                <td className="px-6 py-4 font-semibold text-sm text-indigo-600">
                  {sale.colleague}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {sale.customerName}
                </td>
                <td className="px-6 py-4 text-gray-600">{sale.item}</td>
                <td className="px-6 py-4 text-gray-600">{sale.quantity}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    RM{sale.total}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {sale.date.split("T")[0]}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex ">
                   
                    <button
                     className="p-3 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                     onClick={() => onDelete(sale._id)}
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
    </div>
  );
}
