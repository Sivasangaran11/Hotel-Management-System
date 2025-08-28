import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/style-congrats.css";
import axiosInstance from "./axiosInstance";
import mongoose from "mongoose";


const CongratsPage = (props) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [previousOrders, setPreviousOrders] = useState([]);
  const userId = props.userId;
  const backendUri = import.meta.env.VITE_BACKEND_URI;
  useEffect(() => {
    const timer = setTimeout(() => {
      const doneElement = document.querySelector(".done");
      if (doneElement) {
        doneElement.classList.add("drawn");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        console.log(userId);
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          console.error("Invalid user ID");
          return; // Exit early if the userId is invalid
        }
  
        const response = await axiosInstance.get(
          `${backendUri}/api/cart/user?reservee=${userId}`
        );
  
        if (response.data.length > 0) {
          setCurrentOrder(response.data[response.data.length - 1]); 
          setPreviousOrders(response.data.slice(0, -1)); 
        } else {
          setCurrentOrder(null);
          setPreviousOrders([]);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
  
    if (userId) fetchCart();
  }, [userId]);
  
  const handleReceived = async () => {
    try {
      await axiosInstance.put(`${backendUri}/api/cart/${currentOrder._id}`, { received: true });
  
      // Move the order to history after marking as received
      setPreviousOrders((prevOrders) => [...prevOrders, { ...currentOrder, received: true }]);
  
      // Clear currentOrder since it's now part of history
      setCurrentOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  

  return (
    <div className="Body">
      {/* <Header /> */}
      <div className="contain">
        <div className="congrats">
          <h1>
            Congrat<span className="hide">ulation</span>s!
          </h1>
          <div className="done">
            <svg
              version="1.1"
              id="tick"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 37 37"
              style={{ enableBackground: "new 0 0 37 37" }}
              xmlSpace="preserve"
            >
              <path
                className="circ path"
                style={{
                  fill: "#0cdcc7",
                  stroke: "#07a796",
                  strokeWidth: "3",
                  strokeLinejoin: "round",
                  strokeMiterlimit: "10",
                }}
                d="M30.5,6.5C37.1,13.1,37.1,23.9,30.5,30.5c-6.6,6.6-17.4,6.6-24,0c-6.6-6.6-6.6-17.4,0-24C13.1-0.2,23.9-0.2,30.5,6.5z"
              />
              <polyline
                className="tick path"
                style={{
                  fill: "none",
                  stroke: "#fff",
                  strokeWidth: "3",
                  strokeLinejoin: "round",
                  strokeMiterlimit: "10",
                }}
                points="11.6,20 15.9,24.2 26.4,13.8"
              />
            </svg>
          </div>

          <div className="text">
            <p>
              Your order has been placed successfully.
              <br />
              {/* <strong>Order-ID:</strong> {currentOrder?.orderId || "Loading..."}
              <br /> */}
              {/* <Link to="/track" className="butt">
                <button className="button-congrats">
                  <h5 className="links">Track Order</h5>
                </button>
              </Link> */}
              <Link to="/" className="butt">
                <button className="button-congrats">
                  <h5 className="links">Return Home</h5>
                </button>
              </Link>
            </p>
          </div>

          {/* 🧾 Bill Invoice */}
          {currentOrder && (
            <div className="invoice">
              <h3>🧾 Your Bill</h3>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(currentOrder.orderedDate).toLocaleString()}
              </p>
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>₹ {item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3>
                Total Amount: ₹{" "}
                {currentOrder.items.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                )}
              </h3>

              {/* ✅ Received Button */}
              <button
                className="button-congrats"
                onClick={handleReceived}
                disabled={currentOrder.received} // Disable if already received
              >
                {currentOrder.received ? "✅ Received" : "Mark as Received"}
              </button>
            </div>
          )}

          {/* 📜 Previous Orders Table */}
          {previousOrders.length > 0 && (
            <div className="order-history">
              <h3>📜 Your Order History</h3>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Order Date</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {previousOrders.map((order, index) => (
                    <tr key={index}>
                      <td>{new Date(order.orderedDate).toLocaleString()}</td>
                      <td>
                        {order.items.map((item) => (
                          <div key={item.foodId}>
                            {item.name} (x{item.quantity})
                          </div>
                        ))}
                      </td>
                      <td>
                        ₹{" "}
                        {order.items.reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CongratsPage;
