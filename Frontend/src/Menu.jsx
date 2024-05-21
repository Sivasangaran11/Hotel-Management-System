import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";
import { Link, useNavigate  } from "react-router-dom";
import "./style-cart.css";
import { v4 as uuidv4 } from "uuid";


const Menu = (props) => {
  const foodItems = [
    {
      foodId: '1',
      name: "Barbecue Salad",
      price: 200,
      quantity: 0,
      source: "plate1.png",
      reservee: null,
    },
    {
      foodId: '2',
      name: "Salad with Fish",
      price: 200,
      quantity: 0,
      source: "plate2.png",
      reservee: null,
    },
    {
      foodId: '3',
      name: "Spinach Salad",
      price: 200,
      quantity: 0,
      source: "plate3.png",
      reservee: null,
    },
    {
      foodId: '4',
      name: "Fresh Salad",
      price: 200,
      quantity: 0,
      source: "salad.png",
      reservee: null,
    },
    {
      foodId: '5',
      name: "Fried Noodles",
      price: 200,
      quantity: 0,
      source: "noodles.png",
      reservee: null,
    },
    {
      foodId: '6',
      name: "Roasted Chicken",
      price: 200,
      quantity: 0,
      source: "chicken.png",
      reservee: null,
    },
    {
      foodId: '7',
      name: "Cheese Pizza",
      price: 200,
      quantity: 0,
      source: "pizza.png",
      reservee: null,
    },
    {
      foodId: '8',
      name: "Barbecue Salad",
      price: 200,
      quantity: 0,
      source: "plate1.png",
      reservee: null,
    },
    {
      foodId: '9',
      name: "Salad With Fish",
      price: 200,
      quantity: 0,
      source: "plate2.png",
      reservee: null,
    },
  ];
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const addItemSelected = (itemId) => {
    if (!selectedItemIds.includes(itemId)) {
      const selectedItem = foodItems.find((item) => item.foodId === itemId);
      const updatedSelectedItems = [...selectedItems, selectedItem];
      const updatedSelectedItemIds = [...selectedItemIds, itemId];
      setSelectedItems(updatedSelectedItems);
      setSelectedItemIds(updatedSelectedItemIds);
      sessionStorage.setItem("selectedItems", JSON.stringify(updatedSelectedItems));
      props.Visible('cart');
      console.log(selectedItemIds)
      
    }
  };

  useEffect(() => {
    const storedItems = sessionStorage.getItem("selectedItems");
    if (storedItems) {
      setSelectedItems(JSON.parse(storedItems));
      setSelectedItemIds(JSON.parse(storedItems).map(item => item.foodId));
    }
  }, []);

  useEffect(() => {
    props.selectedFood(selectedItems);
  }, [selectedItems, props]);

  return (
    <section className="menu section bd-container" id="menu">
      <h2 className="section-title">Menu</h2>
      <div className="menu__container bd-grid">
        {foodItems.map((item) => (
          <div key={item.foodId} className="menu__content">
            <img
              src={`src/assets/img/${item.source}`}
              alt=""
              className="menu__img"
            />
            <h3 className="menu__name">{item.name}</h3>
            <span className="menu__price">₹{item.price}</span>
            <div className="menu__order-container">
              {!selectedItemIds.includes(item.foodId) ? (
                
                <button
                  className="button menu__button__add"
                  onClick={() => addItemSelected(item.foodId)}
                >
                  Add
                </button>
              ) : (
                <button className="button menu__button_add">Added</button>
              )}
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
  const navigateTo = useNavigate();

  useEffect(() => {
    const storedCartItems = sessionStorage.getItem("selectedItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, [props.CartItems]);

  useEffect(() => {
    // Recalculate total amount whenever cartItems change
    const newTotalAmount = cartItems.reduce(
      (total, item) => total + (item.quantity || 0) * item.price,
      0
    );
    setTotalAmount(newTotalAmount);
  }, [cartItems]);

  const incrementOrder = (itemId) => {
    const updatedItems = cartItems.map((item) => {
      if (item.foodId === itemId) {
        const newOrderCount = (item.quantity || 0) + 1;
        return { ...item, quantity: newOrderCount };
      }
      return item;
    });
    setCartItems(updatedItems);
    sessionStorage.setItem("selectedItems", JSON.stringify(updatedItems));
  };

  const decrementOrder = (itemId) => {
    const updatedItems = cartItems.map((item) => {
      if (item.foodId === itemId) {
        const newOrderCount = Math.max((item.quantity || 0) - 1, 0);
        return { ...item, quantity: newOrderCount };
      }
      return item;
    });
    setCartItems(updatedItems);
    sessionStorage.setItem("selectedItems", JSON.stringify(updatedItems));
  };

  const handleSubmission = async () => {
    try {
      const orderId = uuidv4()
      const orderItems = cartItems.map(item => ({
        OrderId: orderId,
        ...item,
        reservee: props.userId
      }));

      // Send the array of items to the server
      const response = await axios.post("http://localhost:8000/item", orderItems);
      navigateTo('/congrats');
      console.log("Cart items submitted successfully:", response.data);

      // Clear the cart items and session storage after submission
      setCartItems([]);
      sessionStorage.removeItem("selectedItems");
      alert(`Are you sure you want Confirm your Order?`);
    } catch (error) {
      console.error("Error submitting cart items:", error);
    }
  };

  return (
    <div className="CartContainer">
      <div className="Header">
        <h3 className="Heading">Cart</h3>
        <Link to="/menu" className="back">
          <h5 className="Action">
            Back to Menu <i className="bx bxs-food-menu"></i>
          </h5>
        </Link>
      </div>

      {cartItems.map((selectedItem) => (
        <div className="Cart-Items" key={selectedItem.foodId}>
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
              onClick={() => decrementOrder(selectedItem.foodId)}
            >
              -
            </button>
            <div className="count">{selectedItem.quantity}</div>
            <button
              className="btn"
              onClick={() => incrementOrder(selectedItem.foodId)}
            >
              +
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
            <div className="items">{cartItems.length} items</div>
          </div>
          <div className="total-amount">₹ {totalAmount}</div>
        </div>
        <button className="button" type="submit" onClick={handleSubmission}>
          Submit
        </button>
      </div>
    </div>
  );
};

export { Menu, Cart };
