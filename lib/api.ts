// lib/api.ts
export async function getItems() {
  const res = await fetch("/api/getItem");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  console.log(data);
  return data;
}

export async function getSales() {
  const res = await fetch("/api/getSales");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  console.log(data);
  return data;
}


export async function getExpense() {
  const res = await fetch("/api/getExpense");
  if (!res.ok) throw new Error("Failed to fetch ");
  const data = await res.json();
  console.log(data);
  return data;
}


export async function addItem(newProduct: any) {
  const res = await fetch("/api/addItem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });
  if (!res.ok) throw new Error("Failed to add item");
  return res.json();
}

export async function addExpense(newExpense: any) {
  const res = await fetch("/api/addExpense", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newExpense),
  });
  if (!res.ok) throw new Error("Failed to add item");
  return res.json();
}

export async function updateProduct(updated: any) {
  const res = await fetch(`/api/updateItem/${updated._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  if (!res.ok) throw new Error("Failed to add item");
  return res.json();
}

export async function deleteItemRoute(id: string) {
  const res = await fetch(`/api/deleteItem/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete item");
  return res.json();
}


export async function deleteSalesRoute(id: string) {
  const res = await fetch(`/api/deleteSales/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete item");
  return res.json();
}

export async function deleteExpenseRoute(id: string) {
  const res = await fetch(`/api/deleteExpense/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete item");
  return res.json();
}


