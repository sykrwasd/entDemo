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
  Legend,
} from "recharts";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  X,
  Menu,
} from "lucide-react";
import StatCard from "@/components/statCard";
import {
  getItems,
  addItem,
  getExpense,
  getSales,
  addExpense,
  updateProduct,
  deleteItemRoute,
  deleteSalesRoute,
  deleteExpenseRoute,
} from "@/../lib/api";
import { SwatchesPicker } from "react-color";
import OrderSuccessPopup from "@/components/orderSucess";
import OrderErrorPopup from "@/components/orderError";
import ItemTable from "@/components/itemTable";
import SalesTable from "@/components/salesTable";
import ExpenseTable from "@/components/expenseTable";
import { RingLoader } from "react-spinners";

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
  _id: string;
  expense_category: string;
  expense_description: string;
  expense_amount: number;
  expense_date: string;
};

export default function StudentSalesManager() {
  useEffect(() => {
    getItems().then(setItems);
    getExpense().then(setExpenses);
    getSales().then(setSales);
   
  }, []);
  

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [sales, setSales] = useState<Sales[]>([]);
  const [color, setColor] = useState("#ffff");
  const defaultcolor = "#87CEEB";
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [result, setResult] = useState({
    type: " ",
    message: " ",
  });
  const [isOpen,setIsOpen] = useState(true)

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    color: defaultcolor,
  });

  const [shopName, setShopName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6"); // default
  const [secondaryColor, setSecondaryColor] = useState("#3B82F6"); // default
  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [customCategory, setCustomCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [updatedProduct, setUpdatedProduct] = useState({
    _id: "",
    name: "",
    price: "",
    stock: "",
    description: "",
    color: defaultcolor,
  });
  const [editingSales, setEditingSales] = useState(false);

  // Sample data for charts

  const [expenses, setExpenses] = useState<Expense[]>([]);

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

  const totalExpenses = expenses.reduce((sum, e) => sum + e.expense_amount, 0);

  const totalRevenue = sales.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = sales.length;
  const lowStockItems = items.filter((item) => item.item_stock < 5);

  async function addProduct() {
    setLoading(true);
    try {
      await addItem(newProduct);
      const update = await getItems();
      setItems(update);

      setResult({ type: "", message: "" });

      setTimeout(() => {
        setResult({
          type: "success",
          message: "Product added successfully",
        });
      }, 10);

      setNewProduct({
        name: "",
        price: "",
        stock: "",
        description: "",
        color: defaultcolor,
      });
    } catch {
      setResult({ type: "", message: "" });
      setTimeout(() => {
        setResult({
          type: "error",
          message: "Product failed to add, try again",
        });
      }, 10);
    } finally {
      setLoading(false);
    }
  }
  async function handleExpense() {
    const categoryToSave =
      newExpense.category === "Other" ? customCategory : newExpense.category;

    const expenseToSave = {
      ...newExpense,
      category: categoryToSave,
    };

    console.log(expenseToSave);
    setLoading(true);
    try {
      await addExpense(expenseToSave);
      const update = await getExpense();
      setExpenses(update);

      setResult({ type: "", message: "" });

      setTimeout(() => {
        setResult({
          type: "success",
          message: "Expenses added successfully",
        });
      }, 10);

      setNewExpense({
        category: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch {
      setResult({ type: "", message: "" });
      setTimeout(() => {
        setResult({
          type: "error",
          message: "Expenses failed to add, try again",
        });
      }, 10);
    } finally {
      setLoading(false);
    }
  }
  async function updateItem(id: string) {
    UpdateModalItem(id);
    setLoading(true);
    try {
      await updateProduct(updatedProduct);
      const update = await getItems();
      setItems(update);

      setResult({ type: "", message: "" });

      setTimeout(() => {
        setResult({
          type: "success",
          message: "Product update successfully",
        });
      }, 10);
    } catch (e) {
      setResult({ type: "", message: "" });
      setTimeout(() => {
        setResult({
          type: "error",
          message: "Product failed to add, try again",
        });
      }, 10);
    } finally {
      setLoading(false);
    }
    setEditingProduct(false);
    //console.log(updatedProduct);
  }
  const UpdateModalItem = async (id: string) => {
    setEditingProduct(true);
    const product = items.find((i) => i._id === id);
    if (!product) return;

    console.log(product);
    console.log(updatedProduct);

    setUpdatedProduct({
      _id: product._id,
      name: product.item_name,
      price: product.item_price.toString(),
      stock: product.item_stock.toString(),
      description: product.item_description,
      color: product.item_color,
    });
  };
  async function deleteItem(id: string) {
    setLoading(true);
    try {
      await deleteItemRoute(id);
      const update = await getItems();
      setItems(update);

      setResult({ type: "", message: "" });

      setTimeout(() => {
        setResult({
          type: "success",
          message: "Product deleted successfully",
        });
      }, 10);
    } catch (e) {
      setResult({ type: "", message: "" });
      setTimeout(() => {
        setResult({
          type: "error",
          message: "Product deletion failed, try again",
        });
      }, 10);
    } finally {
      setLoading(false);
    }
  }
  async function deleteSale(id: string) {
    setLoading(true);
    try {
      await deleteSalesRoute(id);
      const update = await getSales();
      setSales(update);

      setResult({ type: "", message: "" });

      setTimeout(() => {
        setResult({
          type: "success",
          message: "Sale deleted successfully",
        });
      }, 10);
    } catch (e) {
      setResult({ type: "", message: "" });
      setTimeout(() => {
        setResult({
          type: "error",
          message: "Sale deletion failed, try again",
        });
      }, 10);
    } finally {
      setLoading(false);
    }
  }
  async function deleteExpense(id: string) {
    setLoading(true);
    try {
      await deleteExpenseRoute(id);
      const update = await getExpense();
      setExpenses(update);

      setResult({ type: "", message: "" });

      setTimeout(() => {
        setResult({
          type: "success",
          message: "Expense deleted successfully",
        });
      }, 10);
    } catch (e) {
      setResult({ type: "", message: "" });
      setTimeout(() => {
        setResult({
          type: "error",
          message: "Sale deletion failed, try again",
        });
      }, 10);
    } finally {
      setLoading(false);
    }
  }
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

  const closeModal = () => {
    setIsOpen(false);
  };

  const tabs = ["dashboard", "products", "orders", "expenses"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {result.type === "success" && (
        <OrderSuccessPopup message={result.message} />
      )}
      {result.type === "error" && <OrderErrorPopup message={result.message} />}
      {loading && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 flex items-center justify-center z-50 ">
          <div className="flex flex-col items-center">
            <RingLoader color="black" speedMultiplier={2} />
            <p className="mt-4 text-black font-semibold">Loading...</p>
          </div>
        </div>
      )}
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg border border-gray-100 relative">
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
        <div
          className={`bg-white rounded-2xl p-2 mb-4 sm:mb-8 shadow-lg border border-gray-100 ${
            isMobileMenuOpen ? "block" : "hidden md:block"
          }`}
        >
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
                  step="1"
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

            <ItemTable
              items={items}
              onEdit={UpdateModalItem}
              onDelete={deleteItem}
            />
            {/* Products Table */}
          </div>
        )}
        {/* Order Management */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Orders Table */}
            <SalesTable sales={sales} onDelete={deleteSale}></SalesTable>
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
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                      className=" px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
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
                    step="1"
                    placeholder="Amount (RM)"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className="px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />

                  <button
                    onClick={handleExpense}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:cursor-pointer transition-all duration-300 flex items-center justify-center font-semibold"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add
                  </button>
                </div>
              </div>

              <ExpenseTable
                expense={expenses}
                onDelete={deleteExpense}
              ></ExpenseTable>
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

      <dialog id="colorEditModal" className="modal backdrop-blur-sm">
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
                setUpdatedProduct({
                  ...updatedProduct,
                  color: colorResult.hex,
                });
                (
                  document.getElementById("colorEditModal") as HTMLDialogElement
                )?.close();
              }}
            />

            <div className="modal-action flex gap-3"></div>
          </div>
        </div>
      </dialog>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Edit Product
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                value={updatedProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-xl text-black"
                placeholder="Product Name"
              />
              <input
                type="number"
                value={updatedProduct.price}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    price: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl text-black"
                placeholder="Price (RM)"
              />
              <input
                type="number"
                value={updatedProduct.stock}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    stock: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl text-black"
                placeholder="Stock"
              />
              <input
                type="text"
                value={updatedProduct.description}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl text-black"
                placeholder="Description"
              />

              <button
                onClick={() =>
                  (
                    document.getElementById(
                      "colorEditModal"
                    ) as HTMLDialogElement
                  )?.show()
                }
                className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                {/* Color preview circle */}
                <span
                  className="inline-block w-6 h-6 rounded-full border border-gray-400 shadow-sm"
                  style={{ backgroundColor: updatedProduct.color }}
                ></span>

                {/* Label */}
                <span className="text-sm font-medium text-gray-700">
                  Choose Color
                </span>
              </button>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingProduct(false)}
                className="px-4 py-2 rounded-xl border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => updateItem(updatedProduct._id)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      {/* Header */}
      <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Welcome to Student Sales Manager (Demo)
      </h2>

      {/* Content */}
      <p className="text-gray-600 text-center leading-relaxed mb-6">
        You’re currently exploring a{" "}
        <span className="font-semibold text-purple-600">demo version</span> of
        the Student Sales Manager template.  
        <br />
        The <span className="font-semibold">final product</span> will include:
      </p>

      <ul className="text-gray-700 space-y-3 mb-6">
        <li className="flex items-start gap-2">
          <span className="text-green-500">✔</span>
          <span>Full backend integration with MongoDB</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-500">🎨</span>
          <span>Customizable shop settings & themes</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-purple-500">📊</span>
          <span>Enhanced reports & analytics</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-yellow-500">📂</span>
          <span>Export to PDF/Excel</span>
        </li>
      </ul>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={closeModal}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:opacity-90 transition"
        >
          🚀 Explore Demo
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
