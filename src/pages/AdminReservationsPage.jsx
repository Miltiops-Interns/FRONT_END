import React, { useEffect, useState } from "react";
import "./AdminReservationsPage.css";
import { useNavigate } from "react-router-dom";

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reservations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setReservations(data);
      } catch (err) {
        console.error("Error fetching reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const deleteReservation = async (id) => {
    if (!window.confirm("Delete this reservation?")) return;

    await fetch(`http://localhost:5000/api/reservations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setReservations(reservations.filter((r) => r._id !== id));
  };
  const navigate = useNavigate();

  return (
    <div className="reservations-admin">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="dashboard-btn"
      >
        🏠 Back to Dashboard
      </button>
      <h2>📋 Manage Reservations</h2>

      {loading ? (
        <p>Loading...</p>
      ) : reservations.length === 0 ? (
        <p>No reservations yet.</p>
      ) : (
        <div className="reservation-list">
          {reservations.map((res) => (
            <div key={res._id} className="reservation-card">
              <p>
                <strong>Name:</strong> {res.name}
              </p>
              <p>
                <strong>Email:</strong> {res.email}
              </p>
              <p>
                <strong>Date:</strong> {res.date}
              </p>
              <p>
                <strong>Time:</strong> {res.time}
              </p>
              <p>
                <strong>Guests:</strong> {res.guests}
              </p>
              <p>
                <strong>Message:</strong> {res.message || "-"}
              </p>
              <button onClick={() => deleteReservation(res._id)}>
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReservationsPage;
