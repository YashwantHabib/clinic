import React, { useEffect, useState } from "react";
import axios from "axios";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
}

interface Booking {
  id: string;
  slot: Slot;
  createdAt: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3001/api/my-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="p-4">Loading bookings...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <p>
                <strong>Date:</strong> {booking.slot.date}
              </p>
              <p>
                <strong>Time:</strong> {booking.slot.startTime} –{" "}
                {booking.slot.endTime}
              </p>
              <p>
                <strong>Booked on:</strong>{" "}
                {new Date(booking.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
