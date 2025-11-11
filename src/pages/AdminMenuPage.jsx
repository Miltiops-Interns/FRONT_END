import React, { useState, useEffect, useMemo } from "react";
import "./AdminMenuPage.css"; // Make sure this path is correct
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { checkToken } from "../utils/checkToken";

const normalizeCategoryKey = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")")
    .replace(/\s*-\s*/g, "-");

const categoryDietTypeMap = {
  beverages: "both",
  dessert: "veg",
  "basmati-e-bahar": "veg",
  "bageecha-e-bahar": "veg",
  "daawat-e-tandoor": "veg",
  "mehfil-e-snacks": "veg",
  "nashta-e-laziz": "veg",
  "khaazana subji ka": "veg",
  vegetarian: "veg",
  "shorba-e-suroor": "veg",
  "chinese platter": "veg",
  "nashta-e-laziz(non-veg)": "nonVeg",
  "shorba-e-suroor(non-veg)": "nonVeg",
  "chinese platter(non-veg)": "nonVeg",
  "tandoor se special": "nonVeg",
  "basmati-e-bahar(non-veg)": "nonVeg",
  "mehfil-e-snacks(non-veg)": "nonVeg",
  "nawabi gosht": "nonVeg",
  chicken: "nonVeg",
  "royal non-veg curries": "nonVeg",
  "tandoori non-veg platters": "nonVeg",
  "seafood splendours": "nonVeg",
};

const normalizeCategoryLabel = (value = "") =>
  value.replace(/\s+/g, " ").trim();

const resolveDietType = (category = "") => {
  const normalizedKey = normalizeCategoryKey(category);
  if (categoryDietTypeMap[normalizedKey]) {
    return categoryDietTypeMap[normalizedKey];
  }

  const nonVegKeywords = [
    "non-veg",
    "non veg",
    "nonveg",
    "non_veg",
    "chicken",
    "mutton",
    "lamb",
    "pork",
    "beef",
    "prawn",
    "fish",
    "seafood",
    "sea food",
    "egg",
    "gosht",
    "meat",
  ];

  const isNonVeg = nonVegKeywords.some((keyword) =>
    normalizedKey.includes(keyword)
  );

  return isNonVeg ? "nonVeg" : "veg";
};

const sanitizeMenuItem = (item = {}) => ({
  ...item,
  category: normalizeCategoryLabel(item.category || ""),
});

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
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dietFilter, setDietFilter] = useState("all");

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
              setMenuItems(data.map(sanitizeMenuItem));
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
      const payload = sanitizeMenuItem(newItem);

      const res = await apiFetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to add menu item" }));
        alert(errorData.error || `Error: ${res.status} ${res.statusText}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setMenuItems([...menuItems, sanitizeMenuItem(data)]);
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
      const payload = sanitizeMenuItem(editItem);

      const res = await apiFetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to update menu item" }));
        alert(errorData.error || `Error: ${res.status} ${res.statusText}`);
        return;
      }

      const updated = sanitizeMenuItem(await res.json());
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

  const categories = useMemo(() => {
    const categoryDietPairs = new Map();

    menuItems.forEach((item) => {
      if (item.category) {
        const key = normalizeCategoryKey(item.category);
        const dietType = resolveDietType(item.category);

        if (!categoryDietPairs.has(key)) {
          categoryDietPairs.set(key, {
            key,
            name: normalizeCategoryLabel(item.category),
            dietType,
          });
        }
      }
    });

    return Array.from(categoryDietPairs.values()).sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }, [menuItems]);

  const filteredCategoryOptions = useMemo(() => {
    if (dietFilter === "veg") {
      return categories.filter(
        (category) =>
          category.dietType === "veg" || category.dietType === "both"
      );
    }

    if (dietFilter === "nonVeg") {
      return categories.filter((category) => category.dietType === "nonVeg");
    }

    return categories;
  }, [categories, dietFilter]);

  useEffect(() => {
    if (categoryFilter === "all") return;

    const stillExists = filteredCategoryOptions.some(
      (category) => category.key === categoryFilter
    );

    if (!stillExists) {
      setCategoryFilter("all");
    }
  }, [filteredCategoryOptions, categoryFilter]);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const search = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !search ||
        item.name?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "all" ||
        normalizeCategoryKey(item.category) === categoryFilter;

      const itemDietType = resolveDietType(item.category);
      const matchesDiet =
        dietFilter === "all" ||
        itemDietType === dietFilter ||
        itemDietType === "both";

      return matchesSearch && matchesCategory && matchesDiet;
    });
  }, [menuItems, searchTerm, categoryFilter, dietFilter]);

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

      <div className="menu-controls">
        <div className="menu-search-wrapper">
          <input
            type="search"
            placeholder="Search by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="menu-filter-row">
          <div className="menu-filter">
            <label htmlFor="categoryFilter">Category</label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All categories</option>
              {filteredCategoryOptions.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="menu-filter">
            <label>Diet Preference</label>
            <div className="diet-filter">
              <button
                type="button"
                className={dietFilter === "all" ? "active" : ""}
                onClick={() => setDietFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={dietFilter === "veg" ? "active" : ""}
                onClick={() => {
                  setDietFilter("veg");
                  setCategoryFilter("all");
                }}
              >
                Veg
              </button>
              <button
                type="button"
                className={dietFilter === "nonVeg" ? "active" : ""}
                onClick={() => {
                  setDietFilter("nonVeg");
                  setCategoryFilter("all");
                }}
              >
                Non-Veg
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Item Cards */}
      {filteredMenuItems.length === 0 ? (
        <div className="menu-empty-state admin">
          <h3>No items found</h3>
          <p>
            Try adjusting your search or filter settings. All active menu items
            will appear here once they match the criteria.
          </p>
          <div className="menu-empty-actions">
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setDietFilter("all");
              }}
            >
              Reset filters
            </button>
          </div>
        </div>
      ) : (
        <div className="menu-card-grid">
          {filteredMenuItems.map((item, index) => {
          const prevCategory =
            index > 0 ? filteredMenuItems[index - 1] : null;
          const showCategoryDivider =
            prevCategory &&
            normalizeCategoryKey(prevCategory.category) !==
              normalizeCategoryKey(item.category);

            return (
            <React.Fragment key={item._id}>
                {showCategoryDivider && (
                  <div className="menu-category-divider" aria-hidden="true">
                    <span>{normalizeCategoryLabel(item.category)}</span>
                  </div>
                )}

                <div
                  className={`menu-card ${
                    editId === item._id ? "editing" : ""
                  }`}
                >
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
                          setEditItem({
                            ...editItem,
                            description: e.target.value,
                          })
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
                      {item.image && (
                        <div className="menu-card-image-wrapper">
                          <img src={item.image} alt={item.name} />
                        </div>
                      )}
                      <div className="menu-card-content">
                        <h3>
                          {item.name} - ₹{item.price}
                        </h3>
                        <p>{item.description}</p>
                      <p>
                        <strong>Category:</strong>{" "}
                        {normalizeCategoryLabel(item.category)}
                      </p>
                        <div className="menu-card-actions">
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
                            className="delete-btn"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminMenuPage;
