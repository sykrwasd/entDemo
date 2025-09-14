"use client";
import { useState } from "react";

export default function OrderSuccessPopup({ message = "Order Successful!" }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-xl">
      <div className="bg-green-200/50 rounded-2xl shadow-lg p-6 max-w-sm w-full text-center outline-3 outline-green-400 ">
        <h2 className="text-2xl font-bold text-green-600 mb-3">✅ Success!</h2>
        <p className="text-gray-700">{message}</p>
        
        <button
          onClick={() => setIsOpen(false)}
          className="mt-5 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
