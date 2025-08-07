import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    API.get("/bookings").then((res) => setBookings(res.data));
  }, []);

  return (
    <div>
      <h2>All Bookings</h2>
      {bookings.map((b: any) => (
        <div key={b.id}>
          <p>User: {b.user.email}</p>
          <p>Slot: {b.slot.time}</p>
        </div>
      ))}

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Admin;
