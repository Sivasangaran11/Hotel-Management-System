import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const Table = ({ reserveForm }) => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    // Fetch table data from JSON source
    axios
      .get("http://localhost:8000/table")
      .then((response) => {
        setTables(response.data);
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
      });
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Table</th>
          <th>Time</th>
          <th>Date</th>
          <th>Accommodation</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {tables.map((table) => (
          <tr key={table.id}>
            <td>{table.number}</td>
            <td>{table.time}</td>
            <td>{table.date}</td>
            <td>{table.accommodation}</td>
            <td>
              <form method="POST">
                {reserveForm && reserveForm.hidden_tag && reserveForm.hidden_tag()}
                <input
                  id="reserved_table"
                  name="reserved_table"
                  type="hidden"
                  value={table.number}
                />
                {reserveForm && reserveForm.submit && reserveForm.submit({ className: "button" })}
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
