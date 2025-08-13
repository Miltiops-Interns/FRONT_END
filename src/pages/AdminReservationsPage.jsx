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
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reservations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setReservations((prev) =>
          prev.map((res) =>
            res._id === id ? { ...res, status: newStatus } : res
          )
        );
      }
    } catch (err) {
      console.error("Error updating reservation status:", err);
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm("Delete this reservation?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/reservations/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setReservations((prev) => prev.filter((res) => res._id !== id));
      }
    } catch (err) {
      console.error("Error deleting reservation:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#28a745";
      case "pending":
        return "#ffc107";
      case "cancelled":
        return "#dc3545";
      case "completed":
        return "#17a2b8";
      default:
        return "#6c757d";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
      <h2>📅 Reservations Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div className="reservation-list">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="reservation-card">
              <div className="reservation-header">
                <h3>{reservation.name}</h3>
                <span
                  className="status-badge"
                  style={{
                    backgroundColor: getStatusColor(reservation.status),
                  }}
                >
                  {reservation.status}
                </span>
              </div>

              <div className="reservation-details">
                <p>
                  <strong>Email:</strong> {reservation.email}
                </p>
                <p>
                  <strong>Phone:</strong> {reservation.phone}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(reservation.date)}
                </p>
                <p>
                  <strong>Time:</strong> {reservation.time}
                </p>
                <p>
                  <strong>Guests:</strong> {reservation.guests}
                </p>
                {reservation.specialRequests && (
                  <p>
                    <strong>Special Requests:</strong>{" "}
                    {reservation.specialRequests}
                  </p>
                )}
                <p>
                  <strong>Submitted:</strong>{" "}
                  {new Date(reservation.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="reservation-actions">
                <select
                  value={reservation.status}
                  onChange={(e) =>
                    updateStatus(reservation._id, e.target.value)
                  }
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  onClick={() => deleteReservation(reservation._id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReservationsPage;
