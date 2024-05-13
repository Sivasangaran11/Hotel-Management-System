import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Table = (props) => {
  const [tables, setTables] = useState([
    {
      number: 1,
      time: "7:00 am - 10:00 pm",
      accommodation: "4",
    },
    {
      number: 2,
      time: "7:00 am - 10:00 pm",
      accommodation: "4",
    },
    {
      number: 3,
      time: "7:00 am - 10:00 pm",
      accommodation: "4",
    },
    {
      number: 4,
      time: "7:00 am - 10:00 pm",
      accommodation: "4",
    },
    {
      number: 5,
      time: "7:00 am - 10:00 pm",
      accommodation: "4",
    },
    {
      number: 6,
      time: "7:00 am - 10:00 pm",
      accommodation: "4",
    },
    {
      number: 7,
      time: "7:00 am - 10:00 pm",
      accommodation: "4",
    },
    {
      number: 8,
      time: "7:00 am - 10:00 pm",
      accommodation: "4",
    },
    {
      number: 9,
      time: "7:00 am - 10:00 pm",
      accommodation: "4",
    },
  ]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]); // Track available time slots
  const [reserved, setReserved] = useState([false]); // Track reserved

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTables(tables.map((table) => ({ ...table, date: tomorrow.toLocaleDateString() })));
    setAvailableTimeSlots(timeslots); // Initialize available time slots
  }, []);

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
  ];

  const reserveTable = async (tableNumber, timeSlot) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (!timeSlot) {
      alert("Please select a time slot."); // Alert if no time slot selected
      return;
    }
    const tableId = uuidv4();

    const table = {
      id: tableId,
      number: tableNumber,
      time: timeSlot,
      date: tomorrow.toLocaleDateString(),
      accommodation: "4",
      reservee: props.userId
    };

    try {
      await axios.post(`http://localhost:8000/table`, table);
      const updatedTables = tables.map((table) =>
        table.number === tableNumber
          ? { ...table, reservee: props.userId, time: timeSlot }
          : table
      );
      setTables(updatedTables); 
      setAvailableTimeSlots(availableTimeSlots.filter(slot => slot !== timeSlot)); // Remove selected time slot
    } catch (error) {
      console.error("Error reserving table:", error);
    }
  };

  const handleReservation = async (event, tableNumber) => {
    event.preventDefault();
    setSelectedTable(tableNumber);
    setSelectedTimeSlot("");
    setReserved(true);
  };
  const handleConfirmations = async (event, tableNumber) => {
    event.preventDefault();
    setReserved(false)
    await reserveTable(tableNumber, selectedTimeSlot);
  };

  return (
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
          <tr key={table.number} style={{ backgroundColor: reserved && selectedTable === table.number ? 'lightgreen' : 'inherit' }}>
            <td>{table.number}</td>
            <td>{table.time}</td>
            <td>{table.date}</td>
            <td>{table.accommodation}</td>
            <td>
                {selectedTable === table.number && reserved? (
                  <form onSubmit={(event) => handleConfirmations(event, table.number)}>
                    <button type="submit" className="button" >
                      Confirm
                    </button>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    >
                      <option value="">Select a time slot</option>
                      {availableTimeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </form>
                ) : (
                  <form onSubmit={(event) => handleReservation(event, table.number)}>
                  <button type="submit" className="button" >
                    Reserve
                  </button >
                  </form>
                )}
              
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
