import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style-cart.css";
import { v4 as uuidv4 } from "uuid";
const Menu = (props) => {
  const foodItems = [
    {
      id: uuidv4(),
      name: "Barbecue Salad",
      price: 200,
      quantity: 0,
      source: "plate1.png",
      reservee: null,
    },
    {
      id: uuidv4(),
      name: "Salad with Fish",
      price: 200,
      quantity: 0,
      source: "plate2.png",
      reservee: null,
    },
    {
      id: uuidv4(),
      name: "Spinach Salad",
      price: 200,
      quantity: 0,
      source: "plate3.png",
      reservee: null,
    },
    {
      id: uuidv4(),
      name: "Fresh Salad",
      price: 200,
      quantity: 0,
      source: "salad.png",
      reservee: null,
    },
    {
      id: uuidv4(),
      name: "Fried Noodles",
      price: 200,
      quantity: 0,
      source: "noodles.png",
      reservee: null,
    },
    {
      id: uuidv4(),
      name: "Roasted Chicken",
      price: 200,
      quantity: 0,
      source: "chicken.png",
      reservee: null,
    },
    {
      id: uuidv4(),
      name: "Cheese Pizza",
      price: 200,
      quantity: 0,
      source: "pizza.png",
      reservee: null,
    },
    {
      id: uuidv4(),
      name: "Barbecue Salad",
      price: 200,
      quantity: 0,
      source: "plate1.png",
      reservee: null,
    },
    {
      id: uuidv4(),
      name: "Salad With Fish",
      price: 200,
      quantity: 0,
      source: "plate2.png",
      reservee: null,
    },
  ];

  const [selectedItems, setSelectedItems] = useState([]);

  const addItemSelected = (itemId) => {
    if (selectedItems.find((item) => item.id === itemId)) {
      return; // If item is already selected, do nothing
    }
    const selectedItem = foodItems.find((item) => item.id === itemId);
    setSelectedItems([...selectedItems, selectedItem]);
  };

  const removeItemSelected = (itemId) => {
    const updatedSelectedItems = selectedItems.filter(
      (item) => item.id !== itemId
    );
    setSelectedItems(updatedSelectedItems);
  };

  console.log(selectedItems);
  props.selectedFood(selectedItems);

  return (
    <section className="menu section bd-container" id="menu">
      <h2 className="section-title">Menu</h2>
      <div className="menu__container bd-grid">
        {foodItems.map((item) => (
          <div key={item.id} className="menu__content">
            <img
              src={`src/assets/img/${item.source}`}
              alt=""
              className="menu__img"
            />
            <h3 className="menu__name">{item.name}</h3>
            <span className="menu__price">₹{item.price}</span>
            <div className="menu__order-container">
              <button
                className="button menu__button__add"
                onClick={() => addItemSelected(item.id)}
              >
                Add
              </button>
              <button
                className="button menu__button__remove"
                onClick={() => removeItemSelected(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
const Cart = (props) => {
  const [cartItems, setCartItems] = useState(props.CartItems);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    setCartItems(props.CartItems);
  }, [props.CartItems]);

  useEffect(() => {
    // Recalculate total amount whenever cartItems change
    const newTotalAmount = cartItems.reduce((total, item) => total + (item.quantity || 0) * item.price, 0);
    setTotalAmount(newTotalAmount);
  }, [cartItems]);

  const incrementOrder = (itemId) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === itemId) {
        const newOrderCount = (item.quantity || 0) + 1;
        return { ...item, quantity: newOrderCount };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const decrementOrder = (itemId) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === itemId) {
        const newOrderCount = Math.max((item.quantity || 0) - 1, 0);
        return { ...item, quantity: newOrderCount };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const handleSubmission = async () => {
    try {
      // Make a POST request to your JSON server endpoint
      const response = await axios.post("http://localhost:8000/item", cartItems);
      console.log("Cart items submitted successfully:", response.data);
      // Optionally, you can clear the cart items after submission
      setCartItems([]);
    } catch (error) {
      console.error("Error submitting cart items:", error);
    }
  };
  return (
    <div>
    <div className="CartContainer">
      <div className="Header">
        <h3 className="Heading">Cart</h3>
        <a href="/menu_page" className="back">
          <Link to="/menu">
            <h5 className="Action">
              Back to Menu <i className="bx bxs-food-menu"></i>
            </h5>
          </Link>
        </a>
      </div>

      {cartItems.map((selectedItem) => (
        <div className="Cart-Items" key={selectedItem.id}>
          <div className="image-box">
            <img
              src={`src/assets/img/${selectedItem.source}`}
              alt=""
              className="menu__img"
            />
          </div>

          <div className="about">
            <h1 className="title">{selectedItem.name}</h1>
            <h3 className="subtitle">{selectedItem.description}</h3>
          </div>

          <div className="counter">
            <button
              className="btn"
              onClick={() => incrementOrder(selectedItem.id)}
            >
              +
            </button>
            <div className="count">{selectedItem.quantity}</div>
            <button
              className="btn"
              onClick={() => decrementOrder(selectedItem.id)}
            >
              -
            </button>
          </div>
          <div className="prices">
            <div className="amount">₹ {selectedItem.price}</div>
            <div className="remove">
              <i className="bx bxs-trash-alt"></i>
            </div>
          </div>
        </div>
      ))}
      <div className="checkout">
        <div className="total">
          <div>
            <div className="Subtotal">Sub-Total</div>
            <div className="items"> {cartItems.length} items</div>
          </div>
          <div className="total-amount">{totalAmount}</div>
        </div>
        <button
          className="button"
          type="submit"
          onClick={() => handleSubmission(cartItems)}
        >
          Submit
        </button>
      </div>
    </div>
    </div>
  );
};

export { Menu, Cart };
