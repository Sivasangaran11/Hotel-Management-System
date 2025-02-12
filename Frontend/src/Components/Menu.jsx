import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import { Link, useNavigate } from "react-router-dom";
import "../styles/style-cart.css";
import "boxicons/css/boxicons.min.css";
import loadingGif from "/img/loader.gif";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import axiosInstance from "./axiosInstance";

const backendUri = import.meta.env.VITE_BACKEND_URI;

const Menu = (props) => {
  const [foodItems, setFoodItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [userRole, setUserRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    ItemName: "",
    price: "",
    source: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [showCartIcon, setShowCartIcon] = useState(false);
  const userId = props.userId;
  const navigateTo = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`${backendUri}/api/menu`)
      .then((response) => {
        setFoodItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching food items:", error);
        setLoading(false);
      });
  }, []);

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  useEffect(() => {
    if (isLoggedIn === "false") {
      sessionStorage.removeItem("selectedFood");
      setSelectedItems([]);
      setSelectedItemIds([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    props.selectedFood(selectedItems);
  }, [selectedItems]);

  // Fetch user role using userId
  useEffect(() => {
    if (userId) {
      axiosInstance
        .get(`${backendUri}/api/users/${userId}`)
        .then((response) => setUserRole(response.data.role))
        .catch((error) => console.error("Error fetching user role:", error));
    }
  }, [userId]);

  const addItemSelected = (itemId) => {
    if (!selectedItemIds.includes(itemId)) {
      const selectedItem = foodItems.find((item) => item._id === itemId);
      if (selectedItem) {
        selectedItem.quantity = 1;
        const updatedSelectedItems = [...selectedItems, selectedItem];
        const updatedSelectedItemIds = [...selectedItemIds, itemId];
        setSelectedItems(updatedSelectedItems);
        setSelectedItemIds(updatedSelectedItemIds);
        sessionStorage.setItem(
          "selectedFood",
          JSON.stringify(updatedSelectedItems)
        );
        props.VisibleCart(true);
        setShowCartIcon(true);
      }
    }
  };
  // Handle input change for new menu item
  const handleNewItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await axiosInstance.post(
          `${backendUri}/api/menuimage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        imageUrl = uploadResponse.data.imageUrl;
      }

      const newItemData = { ...newItem, source: imageUrl };

      await axiosInstance.post(`${backendUri}/api/menu`, newItemData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Fetch updated menu items
      const response = await axiosInstance.get(`${backendUri}/api/menu`);
      setFoodItems(response.data);

      // Reset form fields
      setNewItem({ ItemName: "", price: "", source: "" });
      setImageFile(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding menu item:", error);

      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error); // Show error as an alert
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`${backendUri}/api/menu/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Make sure token is stored in localStorage
          },
        });

        alert("Menu item deleted successfully!");
        setFoodItems((prevItems) =>
          prevItems.filter((item) => item._id !== id)
        );
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Try again!");
      }
    }
  };

  return (
    <div className="l-menu">
      <section className="menu section bd-container" id="menu">
        <h2 className="section-title">Menu</h2>

        {loading ? (
          <div className="loading-container">
            <img src="/loading.gif" alt="Loading..." className="loading-gif" />
          </div>
        ) : (
          <div className="menu__container bd-grid">
            {/* Existing Menu Items */}
            {foodItems.map((item) => (
              <div key={item._id} className="menu__content">
                {/* Show Delete Icon only for Admin/Manager */}
                {(userRole === "Admin" || userRole === "Manager") && (
                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleDelete(item._id)}
                  />
                )}
                <img
                  src={`/img/${item.source}`}
                  alt={item.ItemName}
                  className="menu__img"
                />
                <h3 className="menu__name">{item.ItemName}</h3>
                <span className="menu__price">₹{item.price}</span>
                <div className="menu__order-container">
                  {!selectedItemIds.includes(item._id) &&
                  userRole !== "Admin" &&
                  userRole !== "Manager" ? (
                    <button
                      className="button menu__button__add"
                      onClick={() => addItemSelected(item._id)}
                    >
                      Add
                    </button>
                  ) : (
                    selectedItemIds.includes(item._id) && (
                      <button className="button menu__button_added">
                        Added
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}

            {/* Add Menu Item Button for Admin/Manager */}
            {(userRole === "Admin" || userRole === "Manager") && (
              <div className="menu__content add-menu-item">
                <button
                  className="button menu__button__add"
                  onClick={() => setShowModal(true)}
                >
                  Add New Item
                </button>
              </div>
            )}
          </div>
        )}
      </section>
      {/* Floating Cart Icon */}
      {showCartIcon && (
        <div className="floating-cart" onClick={() => navigateTo("/cart")}>
          <FaShoppingCart className="cart-icon" />
        </div>
      )}

      {/* Add New Item Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Menu Item</h3>
            <form onSubmit={handleAddMenuItem}>
              <input
                type="text"
                name="ItemName"
                placeholder="Item Name"
                value={newItem.ItemName}
                onChange={handleNewItemChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newItem.price}
                onChange={handleNewItemChange}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="button menu__button__add">
                  Add Item
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Cart = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [formattedCart, setFormattedCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const orderDate = new Date().toISOString();
  const userId = props.userId;

  useEffect(() => {
    const storedCartItems = sessionStorage.getItem("selectedFood");
    if (storedCartItems) {
      const parsedItems = JSON.parse(storedCartItems);
      setCartItems(parsedItems);
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
      window.alert("No items selected");
      navigateTo("/menu");
    }

    // Format the cart items to match the required structure
    const formattedOrder = [
      {
        orderId: `ORD-${Date.now()}`, // Unique Order ID
        orderedDate: orderDate,
        items: cartItems.map((item) => ({
          foodId: item._id,
          name: item.ItemName,
          quantity: item.quantity,
          price: item.price,
        })),
        totalprice: newTotalAmount,
        received: false,
        reservee: userId,
      },
    ];
    setFormattedCart(formattedOrder);
  }, [cartItems]);

  const updateCartItems = (updatedItems) => {
    setCartItems(updatedItems);
    sessionStorage.setItem("selectedFood", JSON.stringify(updatedItems));
  };

  const changeOrderQuantity = (itemId, change) => {
    const updatedItems = cartItems
      .map((item) => {
        if (item._id === itemId) {
          const newOrderCount = Math.max((item.quantity || 0) + change, 0);
          return { ...item, quantity: newOrderCount };
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // Remove items with zero quantity
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
      const orderId = `ORD-${Date.now()}`; // Generate a unique order ID

      const orderData = [
        {
          orderId,
          orderedDate: new Date().toISOString(),
          items: cartItems.map((item) => ({
            foodId: item._id,
            name: item.ItemName,
            price: item.price,
            quantity: item.quantity,
          })),
          totalprice: totalAmount,
          received: false,
          reservee: userId,
        },
      ];

      const response = await axiosInstance.post(
        `${backendUri}/api/cart`,
        orderData
      );
      console.log("Cart items submitted successfully:", response.data);

      setCartItems([]);
      sessionStorage.removeItem("selectedFood");
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
                  src={`/img/${selectedItem.source}`}
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
