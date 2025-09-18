"use client"

import { Edit, Trash2 } from "lucide-react";

type Item = {
  _id: string;
  item_name: string;
  item_price: number;
  item_stock: number;
  item_description: string;
  item_color: string;
};

type Props = {
  items: Item[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function ItemTable({ items, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b text-center border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-500">
        <h3 className="text-xl font-bold text-white tracking-wide">
          Product List
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {["Name", "Price", "Stock", "Description", "Color", "Actions"].map(
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
            {items.map((i, idx) => (
              <tr
                key={i._id}
                className={`transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-50`}
              >
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {i.item_name}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 shadow-sm">
                    RM{i.item_price}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                      i.item_stock < 10
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {i.item_stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{i.item_description}</td>
                <td className="px-6 py-4">
                  <span
                    className="inline-block w-6 h-6 rounded-full border shadow-inner"
                    style={{ backgroundColor: i.item_color }}
                  ></span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                      onClick={() => onEdit(i._id)}
                    >
                      <Edit className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => onDelete(i._id)}
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
    </div>
  );
}
