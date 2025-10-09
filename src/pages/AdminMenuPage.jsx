import React, { useState, useEffect } from "react";
import "./AdminMenuPage.css"; // Make sure this path is correct
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

const AdminMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    apiFetch("/api/menu")
      .then((res) => res.json())
      .then((data) => setMenuItems(data));
  }, []);

  const addItem = async () => {
    if (!newItem.name || !newItem.price)
      return alert("Name and price are required!");
    setLoading(true);
    const res = await apiFetch("/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newItem),
    });

    const data = await res.json();
    setMenuItems([...menuItems, data]);
    setNewItem({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });
    setLoading(false);
  };

  const updateItem = async (id) => {
    const res = await apiFetch(`/api/menu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editItem),
    });

    const updated = await res.json();
    setMenuItems(menuItems.map((item) => (item._id === id ? updated : item)));
    setEditId(null);
    setEditItem({});
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    await apiFetch(`/api/menu/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setMenuItems(menuItems.filter((item) => item._id !== id));
  };
  const navigate = useNavigate();

  return (
    <div className="menu-admin">
      <h2>🍽️ Manage Menu Items</h2>
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="dashboard-btn"
      >
        🏠 Back to Dashboard
      </button>

      {/* Add Form */}
      <div className="add-form">
        <h3>Add New Item</h3>
        <input
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          placeholder="Description"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
        />
        <input
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <input
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        />
        <input
          placeholder="Image URL"
          value={newItem.image}
          onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
        />
        <button onClick={addItem} disabled={loading}>
          {loading ? "Adding..." : "➕ Add Item"}
        </button>
      </div>

      {/* Item Cards */}
      {menuItems.map((item) => (
        <div key={item._id} className="menu-card">
          {editId === item._id ? (
            <>
              <input
                value={editItem.name}
                onChange={(e) =>
                  setEditItem({ ...editItem, name: e.target.value })
                }
              />
              <input
                value={editItem.description}
                onChange={(e) =>
                  setEditItem({ ...editItem, description: e.target.value })
                }
              />
              <input
                value={editItem.price}
                onChange={(e) =>
                  setEditItem({ ...editItem, price: e.target.value })
                }
              />
              <input
                value={editItem.category}
                onChange={(e) =>
                  setEditItem({ ...editItem, category: e.target.value })
                }
              />
              <input
                value={editItem.image}
                onChange={(e) =>
                  setEditItem({ ...editItem, image: e.target.value })
                }
              />
              <button onClick={() => updateItem(item._id)}>✅ Save</button>
              <button onClick={() => setEditId(null)}>❌ Cancel</button>
            </>
          ) : (
            <>
              <h3>
                {item.name} - ₹{item.price}
              </h3>
              <p>{item.description}</p>
              <p>
                <strong>Category:</strong> {item.category}
              </p>
              {item.image && <img src={item.image} alt={item.name} />}
              <button
                onClick={() => {
                  setEditId(item._id);
                  setEditItem(item);
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => deleteItem(item._id)}
                style={{ color: "red" }}
              >
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminMenuPage;
