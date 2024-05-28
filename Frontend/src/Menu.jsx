import React, { useState, useEffect } from "react";
import "./styles/styles.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./styles/style-cart.css";
import "boxicons/css/boxicons.min.css";

const backendUri = import.meta.env.VITE_BACKEND_URI;

const Menu = (props) => {
  const [foodItems, setFoodItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUri}/api/menu`)
      .then((response) => {
        setFoodItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching food items:", error);
      });
  }, []);

  useEffect(() => {
    const storedItems = sessionStorage.getItem("selectedItems");
    if (storedItems) {
      const parsedItems = JSON.parse(storedItems);
      setSelectedItems(parsedItems);
      setSelectedItemIds(parsedItems.map((item) => item._id));
    }
  }, []);

  useEffect(() => {
    props.selectedFood(selectedItems);
  }, [selectedItems]);

  const addItemSelected = (itemId) => {
    if (!selectedItemIds.includes(itemId)) {
      const selectedItem = foodItems.find((item) => item._id === itemId);
      if (selectedItem) {
        selectedItem.quantity = 1; // Set initial quantity to 1
        const updatedSelectedItems = [...selectedItems, selectedItem];
        const updatedSelectedItemIds = [...selectedItemIds, itemId];
        setSelectedItems(updatedSelectedItems);
        setSelectedItemIds(updatedSelectedItemIds);
        sessionStorage.setItem(
          "selectedItems",
          JSON.stringify(updatedSelectedItems)
        );
        props.VisibleCart(true);
      }
    }
  };

  return (
    <div className="l-menu">
      <section className="menu section bd-container" id="menu">
        <h2 className="section-title">Menu</h2>
        <div className="menu__container bd-grid">
          {foodItems.map((item) => (
            <div key={item._id} className="menu__content">
              <img
                src={`src/assets/img/${item.source}`}
                alt={item.name}
                className="menu__img"
              />
              <h3 className="menu__name">{item.ItemName}</h3>
              <span className="menu__price">₹{item.price}</span>
              <div className="menu__order-container">
                {!selectedItemIds.includes(item._id) ? (
                  <button
                    className="button menu__button__add"
                    onClick={() => addItemSelected(item._id)}
                  >
                    Add
                  </button>
                ) : (
                  <button className="button menu__button_added">Added</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Cart = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    const storedCartItems = sessionStorage.getItem("selectedItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    const newTotalAmount = cartItems.reduce(
      (total, item) => total + (item.quantity || 0) * item.price,
      0
    );
    setTotalAmount(newTotalAmount);

    if (cartItems.length === 0) {
      props.VisibleCart(false);
    }
  }, [cartItems]);

  const updateCartItems = (updatedItems) => {
    setCartItems(updatedItems);
    sessionStorage.setItem("selectedItems", JSON.stringify(updatedItems));
  };

  const changeOrderQuantity = (itemId, change) => {
    const updatedItems = cartItems.map((item) => {
      if (item._id === itemId) {
        const newOrderCount = Math.max((item.quantity || 0) + change, 0);
        return { ...item, quantity: newOrderCount };
      }
      return item;
    });
    updateCartItems(updatedItems);
  };

  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter((item) => item._id !== itemId);
    updateCartItems(updatedItems);
  };

  const handleSubmission = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please select some food items.");
      navigateTo("/menu");
      return;
    }

    setLoading(true);
    try {
      const orderItems = cartItems.map((item) => ({
        foodId: item._id,
        name: item.ItemName,
        price: item.price,
        quantity: item.quantity,
        source: item.source,
        reservee: props.userId,
      }));
      const response = await axios.post(
        `${backendUri}/api/cart`,
        orderItems
      );
      console.log("Cart items submitted successfully:", response.data);

      setCartItems([]);
      sessionStorage.removeItem("selectedItems");
      props.VisibleCart(false);

      alert(`Your order has been confirmed!`);
      navigateTo("/congrats");
    } catch (error) {
      console.error("Error submitting cart items:", error);
      alert(`Failed to submit your order. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="l-cart">
      <div className="CartContainer">
        <div className="Header">
          <h3 className="Heading">Cart</h3>
          <Link to="/menu" className="back">
            <h5 className="Action">
              Back to Menu <i className="bx bxs-food-menu"></i>
            </h5>
          </Link>
        </div>

        {cartItems.length > 0 ? (
          cartItems.map((selectedItem) => (
            <div className="Cart-Items" key={selectedItem._id}>
              <div className="image-box">
                <img
                  src={`src/assets/img/${selectedItem.source}`}
                  alt={selectedItem.name}
                  className="menu__img"
                />
              </div>

              <div className="about">
                <h1 className="title">{selectedItem.ItemName}</h1>
                <h3 className="subtitle">{selectedItem.description}</h3>
              </div>

              <div className="counter">
                <button
                  className="btn"
                  onClick={() => changeOrderQuantity(selectedItem._id, -1)}
                  disabled={selectedItem.quantity <= 0}
                >
                  -
                </button>
                <div className="count">{selectedItem.quantity}</div>
                <button
                  className="btn"
                  onClick={() => changeOrderQuantity(selectedItem._id, 1)}
                >
                  +
                </button>
              </div>
              <div className="prices">
                <div className="amount">₹ {selectedItem.price}</div>
                <div
                  className="remove"
                  onClick={() => removeItem(selectedItem._id)}
                >
                  <i className="bx bxs-trash-alt"></i>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-cart">Your cart is empty</div>
        )}

        <div className="checkout">
          <div className="total">
            <div>
              <div className="Subtotal">Sub-Total</div>
              <div className="items">{cartItems.length} items</div>
            </div>
            <div className="total-amount">₹ {totalAmount}</div>
          </div>
          <button
            className="button"
            type="submit"
            onClick={handleSubmission}
            disabled={loading || cartItems.length === 0}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};


export { Menu, Cart };
