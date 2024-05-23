import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./styles/styles.css";

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
      const filteredTimeSlots = timeslots.filter(
        (slot) => !bookedTimeSlots.includes(slot)
      );
      return { ...table, availableTimeSlots: filteredTimeSlots };
    });

    setTables(updatedTables);
  }, []);

  const reserveTable = async (tableNumber, timeSlot) => {
    if (!timeSlot) {
      alert("Please select a time slot.");
      return;
    }
    const tableId = uuidv4();
    const table = {
      id: tableId,
      number: tableNumber,
      time: timeSlot,
      date: new Date().toLocaleDateString(),
      accommodation: "4",
      reservee: props.userId,
    };

    try {
      await axios.post(`http://localhost:3000/api/table`, table);
      const updatedTables = tables.map((table) =>
        table.number === tableNumber
          ? {
              ...table,
              reserved: true,
              availableTimeSlots: table.availableTimeSlots.filter(
                (slot) => slot !== timeSlot
              ),
            }
          : table
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

      props.VisibleTable(true);
    } catch (error) {
      console.error("Error reserving table:", error);
    }
  };

  const handleReservation = (event, tableNumber) => {
    event.preventDefault();
    setSelectedTable(tableNumber);
    setSelectedTimeSlot("");
    setReserved(true);
  };

  const handleConfirmations = (event, tableNumber) => {
    event.preventDefault();
    setReserved(false);
    reserveTable(tableNumber, selectedTimeSlot);
  };

  return (
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
                backgroundColor:
                  sessionStorage.getItem(`table${table.number}_reserved`) ===
                  "true"
                    ? "lightgreen"
                    : "inherit",
              }}
            >
              <td>{table.number}</td>
              <td>{table.time || "7:00 am - 10:00 pm"}</td>
              <td>{table.date || new Date().toLocaleDateString()}</td>
              <td>{table.accommodation}</td>
              <td>
                {selectedTable === table.number && reserved ? (
                  <form
                    onSubmit={(event) =>
                      handleConfirmations(event, table.number)
                    }
                  >
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
                  <form
                    onSubmit={(event) => handleReservation(event, table.number)}
                  >
                    <button type="submit" className="button">
                      Reserve
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
