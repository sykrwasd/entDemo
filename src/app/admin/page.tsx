"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  Menu,
} from "lucide-react";
import StatCard from "@/components/statCard";

import { SwatchesPicker } from "react-color";

type Item = {
  _id: string;
  item_name: string;
  item_price: number;
  item_stock: number;
  item_description: string;
  item_color: string;
};

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

type Expense = {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
};

const StudentSalesManager = () => {
  useEffect(() => {
    fetchItems();
    fetchSales();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/getItem");
      const data = await res.json();
      console.log(data);
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchSales() {
    try {
      const res = await fetch("/api/getSales");
      const data = await res.json();
      console.table("table", data);
      setSales(data);
    } catch (e) {
      console.error(e);
    }
  }

  const [items, setItems] = useState<Item[]>([]);
  const [sales, setSales] = useState<Sales[]>([]);
  const [color, setColor] = useState("#ffff");
  const defaultcolor = "#87CEEB";

  function getWeekNumber(date: string) {
    const d = new Date(date);
    const firstDay = new Date(d.getFullYear(), 0, 1); // Jan 1
    const pastDays = (d.getTime() - firstDay.getTime()) / 86400000; // days since Jan 1
    return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
  }

  // Group sales by week
  function groupByWeek(sales: Sales[]) {
    return sales.reduce((acc, sale) => {
      const week = getWeekNumber(sale.date);
      if (!acc[week]) acc[week] = [];
      acc[week].push(sale);
      return acc;
    }, {} as Record<string, Sales[]>);
  }

  const weeklySales = groupByWeek(sales);
  const weeklyChartData = Object.entries(weeklySales).map(([week, sales]) => {
    const total = sales.reduce((sum, s) => sum + s.total, 0);
    return {
      week: `Week ${week}`, // label on X-axis
      sales: total, // Y-axis value
    };
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    color: defaultcolor,
  });

  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
  });
  const [customCategory, setCustomCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Sample data for charts

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const totalRevenue = sales.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = sales.length;
  const lowStockItems = items.filter((item) => item.item_stock < 5);

  const addProduct = async () => {
    //alert("selected color" + color);
    console.log(newProduct);

    try {
      const res = await fetch("/api/addItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newProduct }),
      });

      fetchItems();
    } catch (e) {}
  };

  const addExpense = async () => {
    const categoryToSave =
      newExpense.category === "Other" ? customCategory : newExpense.category;

    const expenseToSave = {
      ...newExpense,
      category: categoryToSave,
    };

    try {
      const res = await fetch("/api/addExpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newProduct }),
      });

      fetchItems();
    } catch (e) {}

    console.log(newExpense);
  };

  const updateItem = () => {
    //setEditingProduct(false);
  };

  //const deleteProduct = (id) => {};

  // const filteredOrders = orders.filter((order) => {
  //   const matchesSearch =
  //     order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     order.item.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesFilter =
  //     filterStatus === "All" || order.status === filterStatus;
  //   return matchesSearch && matchesFilter;
  // });

  const pieData = items
    .map((item) => {
      // Sum total sales for this item
      const totalSales = sales
        .filter((s) => s.item === item.item_name)
        .reduce((sum, s) => sum + s.price, 0);

      return {
        name: item.item_name,
        value: totalSales,
        color: item.item_color,
      };
    })
    .filter((d) => d.value > 0); // remove items with 0 sales

     const tabs = ["dashboard", "products", "orders", "expenses"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg border border-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Student Sales Manager
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your entrepreneurial venture with ease
            </p>
          </div>
        </div>


        {/* Navigation */}
        
        {/* Navigation */}
        <div className={`bg-white rounded-2xl p-2 mb-4 sm:mb-8 shadow-lg border border-gray-100 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex-1 py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center justify-between"
          >
            <span className="font-semibold text-gray-800 capitalize">
              {activeTab}
            </span>
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={`RM ${totalRevenue.toFixed(2)}`}
                icon={TrendingUp}
                color="text-green-600"
                subtitle="This month"
              />
              <StatCard
                title="Total Orders"
                value={totalOrders}
                icon={ShoppingCart}
                color="text-blue-600"
                subtitle={"All Time"}
              />
              <StatCard
                title="Items"
                value={items.length}
                icon={Package}
                color="text-purple-600"
                subtitle={"On Sale"}
              />
              <StatCard
                title="Low Stock Alert"
                value={lowStockItems.length}
                icon={AlertTriangle}
                color="text-red-600"
                subtitle="Items < 10"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Sales Over Time (RM)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Sales by Product (RM)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      isAnimationActive={false}
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value}`,
                        name,
                      ]}
                    />
                    <Legend
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {lowStockItems.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Low Stock Alerts
                </h3>
                <div className="space-y-2">
                  {lowStockItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg p-3 flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-800">
                        {item.item_name}
                      </span>
                      <span className="text-red-600 font-bold">
                        {item.item_stock} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Product Management */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Add New Product */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Add New Product
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount (RM)"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                  className="px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={() =>
                    (
                      document.getElementById("colorModal") as HTMLDialogElement
                    )?.show()
                  }
                  className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  {/* Color preview circle */}
                  <span
                    className="inline-block w-6 h-6 rounded-full border border-gray-400 shadow-sm"
                    style={{ backgroundColor: newProduct.color }}
                  ></span>

                  {/* Label */}
                  <span className="text-sm font-medium text-gray-700">
                    Choose Color
                  </span>
                </button>

                <button
                  onClick={addProduct}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:cursor-pointer transition-all duration-300 flex items-center justify-center font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add
                </button>
              </div>
            </div>

            {/* Products Table */}
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
                      {[
                        "Name",
                        "Price",
                        "Stock",
                        "Description",
                        "Color",
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
                    {items.map((i, idx) => (
                      <tr
                        key={i._id}
                        className={`transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-50`}
                      >
                        {/* Item name */}
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {i.item_name}
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 shadow-sm">
                            RM{i.item_price}
                          </span>
                        </td>

                        {/* Stock with conditional badge */}
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

                        {/* Description */}
                        <td className="px-6 py-4 text-gray-600">
                          {i.item_description}
                        </td>

                        {/* Color dot */}
                        <td className="px-6 py-4">
                          <span
                            className="inline-block w-6 h-6 rounded-full border shadow-inner"
                            style={{ backgroundColor: i.item_color }}
                          ></span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                              onClick={() => setEditingProduct(true)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Order Management */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Orders Table */}
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
                        <td className="px-6 py-4 text-gray-600">
                          {sale.quantity}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            RM{sale.total}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {sale.date.split("T")[0]}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                              onClick={() => setEditingProduct(true)}
                            >
                              <Edit className="w-4 h-4" onClick={updateItem} />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-500">
                <h3 className="text-xl font-bold text-center text-white tracking-wide">
                  Expense Table
                </h3>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border justify-center border-gray-100">
                <h3 className="text-xl text-center font-bold text-gray-800 mb-4">
                  Add New Expense
                </h3>
                <div className=" grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 flex justify-center">
                  {/* Category Dropdown */}
                  <select
                    value={newExpense.category}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setNewExpense({
                        ...newExpense,
                        category: selected,
                      });
                      if (selected !== "Other") {
                        setCustomCategory(""); // reset if not Other
                      }
                    }}
                    className="px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Transport">Transport</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                  </select>

                  {/* Custom Category Input (shown only if "Other" selected) */}
                  {newExpense.category === "Other" && (
                    <input
                      type="text"
                      placeholder="Enter custom category"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="mt-3 px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
                    />
                  )}

                  <input
                    type="text"
                    placeholder="Description"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                    className="px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount (RM)"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className="px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />

                  <button
                    onClick={addExpense}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:cursor-pointer transition-all duration-300 flex items-center justify-center font-semibold"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      {["Category", "Description", "Amount (RM)", "Date"].map(
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
                    {expenses.map((expense, idx) => (
                      <tr
                        key={expense.id}
                        className={`transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-indigo-50`}
                      >
                        <td className="px-6 py-4 font-semibold text-sm text-indigo-600">
                          {expense.category}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {expense.description}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          RM{expense.amount}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {expense.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-gray-50 flex justify-end">
                <p className="font-bold text-gray-800">
                  Total Expenses: RM {totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <dialog id="colorModal" className="modal backdrop-blur-sm">
        <div className="modal-box bg-white">
          <h3 className="text-center font-bold text-lg text-gray-400">
            Select Color
          </h3>

          {/* Form Content */}
          <div className="mt-4">
            <SwatchesPicker
              width={450}
              className="rounded-xl"
              color={color}
              onChange={(colorResult: any) => {
                setNewProduct({ ...newProduct, color: colorResult.hex });
                (
                  document.getElementById("colorModal") as HTMLDialogElement
                )?.close();
              }}
            />

            <div className="modal-action flex gap-3"></div>
          </div>
        </div>
      </dialog>

      {/* Edit Product Modal */}
      {/* {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Edit Product
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Cost (RM)"
                        value={editingProduct.cost}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            cost: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price (RM)"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={editingProduct.stock}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            stock: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct(
                            ...editingProduct,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={updateProduct}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div> 
              )}
                */}
    </div>
  );
};

export default StudentSalesManager;
