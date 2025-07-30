import React, { useState, useEffect } from 'react';

const AdminMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '', image: '' });
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then((res) => res.json())
      .then((data) => setMenuItems(data));
  }, []);

  const addItem = async () => {
    const res = await fetch('http://localhost:5000/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newItem),
    });

    const data = await res.json();
    setMenuItems([...menuItems, data]);
    setNewItem({ name: '', description: '', price: '', category: '', image: '' });
  };

  const updateItem = async (id) => {
    const res = await fetch(`http://localhost:5000/api/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editItem),
    });

    const updated = await res.json();
    setMenuItems(menuItems.map((item) => (item._id === id ? updated : item)));
    setEditId(null);
    setEditItem({});
  };

  return (
    <div>
      <h2>🍽️ Manage Menu Items</h2>

      {/* Add New Item */}
      <input placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
      <input placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
      <input placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
      <input placeholder="Category" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} />
      <input placeholder="Image URL" value={newItem.image} onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} />
      <button onClick={addItem}>Add Item</button>

      <hr />

      {/* Show Menu Items */}
      {menuItems.map((item) => (
        <div key={item._id} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
          {editId === item._id ? (
            <>
              <input value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
              <input value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
              <input value={editItem.price} onChange={(e) => setEditItem({ ...editItem, price: e.target.value })} />
              <input value={editItem.category} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} />
              <input value={editItem.image} onChange={(e) => setEditItem({ ...editItem, image: e.target.value })} />
              <button onClick={() => updateItem(item._id)}>✅ Save</button>
              <button onClick={() => setEditId(null)}>❌ Cancel</button>
            </>
          ) : (
            <>
              <h3>{item.name} - ₹{item.price}</h3>
              <p>{item.description}</p>
              <p>{item.category}</p>
              {item.image && <img src={item.image} alt={item.name} width="150" />}
              <br />
              <button onClick={() => { setEditId(item._id); setEditItem(item); }}>✏️ Edit</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminMenuPage;
