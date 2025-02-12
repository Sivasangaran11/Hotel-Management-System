import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import axiosInstance from "./axiosInstance";

const backendUri = import.meta.env.VITE_BACKEND_URI;

const Table = (props) => {
  const initialTables = [
    { number: 1, accommodation: "4", reserved: false, availableTimeSlots: [] },
    { number: 2, accommodation: "4", reserved: false, availableTimeSlots: [] },
    { number: 3, accommodation: "4", reserved: false, availableTimeSlots: [] },
    { number: 4, accommodation: "4", reserved: false, availableTimeSlots: [] },
    { number: 5, accommodation: "4", reserved: false, availableTimeSlots: [] },
    { number: 6, accommodation: "4", reserved: false, availableTimeSlots: [] },
    { number: 7, accommodation: "4", reserved: false, availableTimeSlots: [] },
    { number: 8, accommodation: "4", reserved: false, availableTimeSlots: [] },
    { number: 9, accommodation: "4", reserved: false, availableTimeSlots: [] },
  ];

  const [tables, setTables] = useState(initialTables);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [reserved, setReserved] = useState(false);
  const [bookedTables, setBookedTables] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axiosInstance.get(`${backendUri}/api/reservedTable`);
        const reservations = response.data;
  
        const token = localStorage.getItem("token");
        let currentUser = null;
        if (token) {
          try {
            currentUser = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            setUser(currentUser);
          } catch (error) {
            console.error("Invalid JWT Token:", error);
          }
        }
  
        const timeslots = [
          "8am-9am",
          "9am-10am",
          "10am-11am",
          "11am-12pm",
          "12pm-1pm",
          "1pm-2pm",
          "2pm-3pm",
          "3pm-4pm",
          "4pm-5pm",
          "5pm-6pm",
          "6pm-7pm",
          "7pm-8pm",
          "8pm-9pm",
          "9pm-10pm",
          "10pm-11pm",
        ];
  
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        const formattedDate = nextDay.toLocaleDateString();
  
        const updatedTables = initialTables.map((table) => {
          const tableReservations = reservations.filter(
            (res) => res.table.number === table.number && res.table.date === formattedDate
          );
  
          const userReserved = tableReservations.some((res) => res.reservee === currentUser?.id);
  
          return {
            ...table,
            reserved: userReserved, // Reserved status is now based on the current user
            availableTimeSlots: timeslots.filter(
              (slot) => !tableReservations.some((res) => res.table.time === slot)
            ),
          };
        });
  
        setTables(updatedTables);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
  
    fetchReservations();
  }, []);
  
  

  const reserveTable = async (tableNumber, timeSlot) => {
    if (!timeSlot) return alert("Select a time slot.");
    if (!user?.id) return alert("Login required.");
  
    const formattedDate = new Date(Date.now() + 86400000).toLocaleDateString();
    const reservationData = {
      reservee: user.id,
      table: { number: tableNumber, time: timeSlot, date: formattedDate, accommodation: "4" },
    };
  
    try {
      await axiosInstance.post(`${backendUri}/api/reservedTable`, reservationData);
      const updatedTables = tables.map((t) =>
        t.number === tableNumber ? { ...t, reserved: true, availableTimeSlots: t.availableTimeSlots.filter((s) => s !== timeSlot) } : t
      );
      setTables(updatedTables);
      props.updateBookedTables([...bookedTables, reservationData]);
      sessionStorage.setItem(`table${tableNumber}_bookedTimeSlots`, JSON.stringify([...bookedTables, timeSlot]));
      sessionStorage.setItem(`table${tableNumber}_reserved`, "true");
      props.toggleVisibilityTable(true);
    } catch (error) {
      console.error("Error reserving table:", error);
    }
  };
  

  const handleReservation = (event, tableNumber) => {
    event.preventDefault();
    setSelectedTable(tableNumber);
    setReserved(true);
  };

  const handleConfirmation = (event) => {
    event.preventDefault();
    setReserved(false);
    reserveTable(selectedTable, selectedTimeSlot);
  };

  const addTable = () => {
    const newTableNumber = tables.length + 1;
    const newTable = {
      number: newTableNumber,
      accommodation: "4",
      reserved: false,
      availableTimeSlots: [
        "8am-9am",
        "9am-10am",
        "10am-11am",
        "11am-12pm",
        "12pm-1pm",
        "1pm-2pm",
        "2pm-3pm",
        "3pm-4pm",
        "4pm-5pm",
        "5pm-6pm",
        "6pm-7pm",
        "7pm-8pm",
        "8pm-9pm",
        "9pm-10pm",
        "10pm-11pm",
      ],
    };

    setTables([...tables, newTable]);
    sessionStorage.setItem(
      `table${newTableNumber}_bookedTimeSlots`,
      JSON.stringify([])
    );
    sessionStorage.setItem(`table${newTableNumber}_reserved`, "false");
  };

  const deleteTable = (tableNumber) => {
    const updatedTables = tables
      .filter((table) => table.number !== tableNumber) // Remove selected table
      .map((table, index) => ({
        ...table,
        number: index + 1, // Re-number remaining tables
      }));

    setTables(updatedTables);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="l-table">
        <table>
          <thead>
            <tr>
              <th>Table</th>
              <th>Time</th>
              <th>Date</th>
              <th>Accommodation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {tables.map((table) => (
                <motion.tr
                  key={table.number}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }} 
                  style={{
                    backgroundColor: table.reserved ? "lightgreen" : "inherit",
                    color: table.reserved ? "#333333" : "inherit",
                  }}
                >
                  <td>{table.number}</td>
                  <td>{table.time || "7:00 am - 10:00 pm"}</td>
                  <td>{new Date(Date.now() + 86400000).toLocaleDateString()}</td>
                  <td>{table.accommodation}</td>
                  <td>
                    {user?.role === "Admin" || user?.role === "Manager" ? (
                      <button
                        onClick={() => deleteTable(table.number)}
                        className="button"
                      >
                        Remove Table
                      </button>
                    ) : selectedTable === table.number && reserved ? (
                      <form onSubmit={handleConfirmation} className="l-form">
                        <button type="submit" className="button">Confirm</button>
                        <select
                          value={selectedTimeSlot}
                          onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        >
                          <option value="">Select a time slot</option>
                          {table.availableTimeSlots.map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </form>
                    ) : (
                      <button
                        onClick={(event) => handleReservation(event, table.number)}
                        className="button"
                      >
                        Reserve
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {(user?.role === "Admin" || user?.role === "Manager") && (
          <div className="admin-button-container">
            <button className="admin-button" onClick={addTable}>
              Add Table
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const BookedTables = () => {
  const [tablesBooked, setTablesBooked] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBookedTables = async () => {
      try {
        const response = await axiosInstance.get(`/api/reservedTable/user?reservee=${userId}`);

        if (response.status === 200 && Array.isArray(response.data)) {
          setTablesBooked(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setTablesBooked([]); // Return an empty table if 404 occurs
        } else {
          console.error("Error fetching booked tables:", error);
        }
      }
    };

    if (userId) {
      fetchBookedTables();
    }
  }, [userId]);

  return (
    <div className="l-table">
      <h2>Booked Tables: {tablesBooked.length}</h2>
      <table>
        <thead>
          <tr>
            <th>Table Number</th>
            <th>Time Slot</th>
            <th>Date</th>
            <th>Accommodation</th>
          </tr>
        </thead>
        <tbody>
          {tablesBooked.length > 0 ? (
            tablesBooked.map((entry, index) => (
              <tr key={index}>
                <td>{entry.table.number}</td>
                <td>{entry.table.time}</td>
                <td>{entry.table.date}</td>
                <td>{entry.table.accommodation}</td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No tables found.</td> 
            </tr>
          )}
        </tbody>
      </table>
      <Link to="/table" className="back-table">
        Back to Table
      </Link>
    </div>
  );
};


export { Table, BookedTables };
