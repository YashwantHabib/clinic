import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { logout } = useAuth();

  const fetchData = async () => {
    const s = await API.get("/slots");
    const b = await API.get("/my-bookings");
    setSlots(s.data);
    setBookings(b.data);
  };

  const bookSlot = async (slotId: string) => {
    await API.post("/book", { slotId });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Available Slots</h2>
      {slots.map((slot: any) => (
        <div key={slot.id}>
          <p>{slot.time}</p>
          <button onClick={() => bookSlot(slot.id)}>Book</button>
        </div>
      ))}

      <h2>My Bookings</h2>
      {bookings.map((b: any) => (
        <div key={b.id}>
          <p>{b.slot.time}</p>
        </div>
      ))}

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
