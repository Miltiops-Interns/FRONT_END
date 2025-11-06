import React, { useState, useEffect } from "react";
import "./AdminMenuPage.css"; // Make sure this path is correct
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { checkToken } from "../utils/checkToken";

const AdminMenuPage = () => {
  const navigate = useNavigate();
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
    let isMounted = true;

    const verify = async () => {
      const isValid = await checkToken();
      if (!isMounted) return; // Prevent navigation if component unmounted
      
      if (!isValid) {
        localStorage.removeItem("token");
        navigate("/admin/login");
        return;
      }
      
      // Only fetch if component is still mounted and authenticated
      if (isMounted) {
        apiFetch("/api/menu")
          .then((res) => res.json())
          .then((data) => {
            if (isMounted) {
              setMenuItems(data);
            }
          });
      }
    };

    verify();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const addItem = async () => {
    if (!newItem.name || !newItem.price)
      return alert("Name and price are required!");
    setLoading(true);
    
    try {
      const res = await apiFetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to add menu item" }));
        alert(errorData.error || `Error: ${res.status} ${res.statusText}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setMenuItems([...menuItems, data]);
      setNewItem({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    } catch (err) {
      console.error("Error adding menu item:", err);
      alert("Failed to add menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id) => {
    try {
      const res = await apiFetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editItem),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to update menu item" }));
        alert(errorData.error || `Error: ${res.status} ${res.statusText}`);
        return;
      }

      const updated = await res.json();
      setMenuItems(menuItems.map((item) => (item._id === id ? updated : item)));
      setEditId(null);
      setEditItem({});
    } catch (err) {
      console.error("Error updating menu item:", err);
      alert("Failed to update menu item. Please try again.");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const res = await apiFetch(`/api/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to delete menu item" }));
        alert(errorData.error || `Error: ${res.status} ${res.statusText}`);
        return;
      }

      setMenuItems(menuItems.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting menu item:", err);
      alert("Failed to delete menu item. Please try again.");
    }
  };

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
