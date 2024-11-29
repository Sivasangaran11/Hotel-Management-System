import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles.css";
import { Link } from "react-router-dom";
import {motion} from "framer-motion"

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

  useEffect(() => {
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

    const updatedTables = initialTables.map((table) => {
      const bookedTimeSlots =
        JSON.parse(
          sessionStorage.getItem(`table${table.number}_bookedTimeSlots`)
        ) || [];
      const isReserved =
        sessionStorage.getItem(`table${table.number}_reserved`) === "true";
      const filteredTimeSlots = timeslots.filter(
        (slot) => !bookedTimeSlots.includes(slot)
      );
      return {
        ...table,
        reserved: isReserved,
        availableTimeSlots: filteredTimeSlots,
      };
    });

    setTables(updatedTables);
  }, []);

  const reserveTable = async (tableNumber, timeSlot) => {
    if (!timeSlot) {
      alert("Please select a time slot.");
      return;
    }
    const table = {
      number: tableNumber,
      time: timeSlot,
      date: new Date().toLocaleDateString(),
      accommodation: "4",
      reservee: props.userId,
    };

    try {
      await axios.post(`${backendUri}/api/table`, table);
      const updatedBookedTables = [...bookedTables, table];
      props.updateBookedTables(updatedBookedTables);
      setBookedTables(updatedBookedTables);
      const updatedTables = tables.map((t) =>
        t.number === tableNumber
          ? {
              ...t,
              reserved: true,
              time: timeSlot,
              date: new Date().toLocaleDateString(),
              reservee: props.userId,
              availableTimeSlots: t.availableTimeSlots.filter(
                (slot) => slot !== timeSlot
              ),
            }
          : t
      );
      setTables(updatedTables);

      const bookedTimeSlots =
        JSON.parse(
          sessionStorage.getItem(`table${tableNumber}_bookedTimeSlots`)
        ) || [];
      sessionStorage.setItem(
        `table${tableNumber}_bookedTimeSlots`,
        JSON.stringify([...bookedTimeSlots, timeSlot])
      );
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

  return (
    <motion.div
    initial = {{opacity:0}}
    animate = {{opacity:1}}
    exit = {{opacity:0}}>
      <div className="l-table">
        <table>
          <thead>
            <tr>
              <th>Table</th>
              <th>Time</th>
              <th>Date</th>
              <th>Accommodation</th>
              <th>Reservee</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr
                key={table.number}
                style={{
                  backgroundColor: table.reserved ? "lightgreen" : "inherit",
                  color: table.reserved ? "#333333" : "inherit",
                }}
              >
                <td>{table.number}</td>
                <td>{table.time || "7:00 am - 10:00 pm"}</td>
                <td>{table.date || new Date().toLocaleDateString()}</td>
                <td>{table.accommodation}</td>
                <td>
                  {selectedTable === table.number && reserved ? (
                    <form onSubmit={handleConfirmation} className="l-form">
                      <button type="submit" className="button">
                        Confirm
                      </button>
                      <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      >
                        <option value="">Select a time slot</option>
                        {table.availableTimeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </form>
                  ) : (
                    <button
                      onClick={(event) =>
                        handleReservation(event, table.number)
                      }
                      className="button"
                    >
                      Reserve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const BookedTables = (props) => {
  const tablesBooked = props.bookedTables;
  return (
    <motion.div className="l-table"
    initial = {{opacity:0}}
    animate = {{opacity:1}}
    exit = {{opacity:0}}>
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
            tablesBooked.map((table, index) => (
              <tr key={index}>
                <td>{table.number}</td>
                <td>{table.time}</td>
                <td>{table.date}</td>
                <td>{table.accommodation}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No tables are currently booked.</td>
            </tr>
          )}
        </tbody>
      </table>
      <Link to="/table" className="back-table">
        Back to Table
      </Link>
    </motion.div>
  );
};


export { Table, BookedTables };
