import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [showBookingModal, setShowBookingModal] = useState(false); // New state for modal visibility
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null); // New state to store selected slot ID
  const { logout } = useAuth();

  const fetchData = async () => {
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 7);

    try {
      const s = await API.get("/api/slots", {
        params: {
          from: from.toISOString(),
          to: to.toISOString(),
        },
      });
      setSlots(s.data);

      const b = await API.get("/api/my-bookings");
      setBookings(b.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally, handle error display to user
    }
  };

  const bookSlot = async (slotId: number) => {
    try {
      await API.post("/api/book", { slotId });
      fetchData(); // Refresh data after successful booking
      alert("Slot booked successfully!"); // User feedback
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Could not book slot";
      alert(errorMessage);
    }
  };

  // Function to open the modal
  const handleBookClick = (slotId: number) => {
    setSelectedSlotId(slotId);
    setShowBookingModal(true);
  };

  // Function to confirm booking and close modal
  const confirmBooking = () => {
    if (selectedSlotId !== null) {
      bookSlot(selectedSlotId);
    }
    closeModal();
  };

  // Function to close the modal
  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedSlotId(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderAvailableSlots = () => (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Available Slots
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {slots.length === 0 && (
          <p className="text-gray-500">No available slots</p>
        )}
        {slots.map((slot: any) => (
          <div
            key={slot.id}
            className="bg-white rounded-md shadow-md p-4 flex flex-col justify-between"
          >
            <div>
              <p className="text-gray-700 text-sm">
                {new Date(slot.startAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-600 text-xs">
                {new Date(slot.startAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" - "}
                {new Date(slot.endAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <button
              onClick={() => handleBookClick(slot.id)} // Call handleBookClick
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-xs self-start"
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </>
  );

  const renderMyBookings = () => (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Bookings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bookings.length === 0 && (
          <p className="text-gray-500">No bookings yet</p>
        )}
        {bookings.map((booking: any) => (
          <div key={booking.id} className="bg-white rounded-md shadow-md p-4">
            <p className="text-gray-700 text-sm">
              {new Date(booking.slot.startAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-600 text-xs">
              {new Date(booking.slot.startAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" - "}
              {new Date(booking.slot.endAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen py-12 px-32">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div>
          <button
            onClick={() => setActiveTab("available")}
            className={`py-2 px-4 rounded-md ${
              activeTab === "available"
                ? "text-red-500 font-bold"
                : "text-gray-700"
            }`}
          >
            Slots
          </button>
          <button
            onClick={() => setActiveTab("my-bookings")}
            className={`py-2 px-4 rounded-md ml-2 ${
              activeTab === "my-bookings"
                ? "text-red-500 font-bold"
                : "text-gray-700"
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={logout}
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-5 rounded-md ml-4"
          >
            Logout
          </button>
        </div>
      </div>

      {activeTab === "available" && renderAvailableSlots()}
      {activeTab === "my-bookings" && renderMyBookings()}

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to book this slot?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
