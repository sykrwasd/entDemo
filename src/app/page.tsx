"use client";

import React, { useEffect, useState } from "react";
import OrderSuccessPopup from "@/components/orderSucess";
import OrderErrorPopup from "@/components/orderError";

type Item = {
  _id: string;
  item_name: string;
  item_price: number;
  item_stock: number;
  item_description: string;
  item_color: string;
};

export default function Sales() {
  const [formData, setFormData] = useState({
    customerName: "",
    colleague: "",
    item: "",
    qty: 1,
    price: 0,
    total: 0,
    date: new Date().toISOString().split("T")[0],
  });
  const [items, setItems] = useState<Item[]>([]);
  const [now, setNow] = useState<Date | null>(null);
  const[result,setResult] =useState("")

  useEffect(() => {
    fetchItems();
    setNow(new Date());
    setFormData((prev) => ({
      ...prev,
      total: prev.qty * prev.price,
    }));
  }, [formData.qty, formData.price]);

  async function fetchItems() {
    try {
      const res = await fetch("/api/getItem");
      const data = await res.json();
      console.log(data);
      setItems(data);

      data.map((item: any, i = 0) => {
        console.log("descc");
        console.log(item);
      });
    } catch (e) {
      console.error(e);
    }
  }

  const addSales = async () => {
    console.log(formData);

    try {
      const response = await fetch("/api/addSales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
        }),
      });

      if (response.ok) {
        console.log("success");
        setFormData({
          ...formData,
          customerName: "",
          colleague: "",
          item: "",
          qty: 1,
          price: 0,
          total: 0,
          date: new Date().toISOString().split("T")[0],
        });

        setResult("success")
      }else{
        setResult("error")
      }



    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6 text-black">
      {result === "success" && <OrderSuccessPopup message="Sale recorded successfully!" />}
      {result === "error" && <OrderErrorPopup message="Failed to place order. Please try again." />}

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">
          [Kedai] Sales Form
        </h2>

        <div className="space-y-2">
          {/* Customer Name */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              placeholder="Enter customer name"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
            />
          </div>

          {/* Colleague */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Colleague
            </label>
            <select
              value={formData.colleague}
              onChange={(e) =>
                setFormData({ ...formData, colleague: e.target.value })
              }
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
            >
              <option value="" disabled>Select Colleague</option>
              <option value="Alpha">Alpha</option>
              <option value="Beta">Beta</option>
            </select>
          </div>

          {/* Item */}
          {/* Item */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">Item</label>
            <select
              value={formData.item}
              onChange={(e) => {
                const selectedItem = items.find(
                  (it) => it.item_name === e.target.value
                );
                setFormData({
                  ...formData,
                  item: e.target.value,
                  price: selectedItem ? selectedItem.item_price : 0, // set price here
                });
              }}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
            >
              <option value="" disabled>
                Select an item
              </option>
              {items.map((it) => (
                <option key={it._id} value={it.item_name}>
                  {it.item_name} - RM{it.item_price}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                value={formData.qty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qty: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              />
            </div>

            {/* Total */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Total Price (RM)
              </label>
              <input
                type="number"
                value={formData.qty * formData.price}
                readOnly
                className="w-full px-4 py-2 border text-gray-500 border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">Date</label>
            <input
              type="date"
              value={now ? now.toISOString().split("T")[0] : "Loading..."}
              readOnly
              className="w-full px-4 py-2 border text-gray-500 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition "
            />
          </div>

          {/* Total */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-transform duration-200"
            onClick={addSales}
          >
            Add Sale
          </button>
        </div>
      </div>
    </div>
    
  );
}
