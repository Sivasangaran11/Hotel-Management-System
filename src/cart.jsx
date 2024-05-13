import React, { useState, useEffect } from 'react';
import './style-cart.css';
import { Link } from 'react-router-dom';

const Cart = (props) => {
    const [selectedItems, setSelectedItems] = useState(props.CartItems);
    const [cartItems, setCartItems] = useState(selectedItems);
    console.log(cartItems);

    useEffect(() => {
        // Update cartItems state whenever selectedItems context value changes
        setCartItems(selectedItems);
    }, [selectedItems]);

    console.log(cartItems);

    const updateOrderCount = (itemId, newOrderCount) => {
        fetch(`http://localhost:8000/item/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order: newOrderCount }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update order count');
            }
            // Handle success response
        })
        .catch(error => {
            console.error('Error updating order count:', error);
            // Handle error
        });
    };

    const incrementOrder = (itemId) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === itemId) {
                const newOrderCount = (item.order || 0) + 1;
                updateOrderCount(itemId, newOrderCount);
                return { ...item, order: newOrderCount };
            }
            return item;
        });
        setCartItems(updatedItems);
        setSelectedItems(updatedItems); // Update context state
    };
    
    const decrementOrder = (itemId) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === itemId) {
                const newOrderCount = Math.max((item.order || 0) - 1, 0);
                updateOrderCount(itemId, newOrderCount);
                return { ...item, order: newOrderCount };
            }
            return item;
        });
        setCartItems(updatedItems);
        setSelectedItems(updatedItems); // Update context state
    };
    
    return (
        <div className="CartContainer">
            <div className="Header">
                <h3 className="Heading">Cart</h3>
                <a href="/menu_page" className="back">
                    <Link to ="/menu">
                        <h5 className="Action">Back to Menu <i className='bx bxs-food-menu'></i></h5>
                    </Link>
                </a>
            </div>

            {cartItems.map((selectedItem) => (
                <div className="Cart-Items" key={selectedItem.id}>
                    <div className="image-box">
                        <img src={`src/assets/img/${selectedItem.source}`} alt="" className="menu__img" />
                    </div>

                    <div className="about">
                        <h1 className="title">{selectedItem.name}</h1>
                        <h3 className="subtitle">{selectedItem.description}</h3>
                    </div>

                    <div className="counter">
                        <button className="btn" onClick={() => incrementOrder(selectedItem.id)}>+</button>
                        <div className="count">{selectedItem.order}</div>
                        <button className="btn" onClick={() => decrementOrder(selectedItem.id)}>-</button>
                    </div>

                    <div className="prices">
                        <div className="amount">₹ {selectedItem.price}</div>
                        <div className="remove"><i className='bx bxs-trash-alt'></i></div>
                    </div>
                </div>
            ))}

            <div className="checkout">
                <div className="total">
                    <div>
                        <div className="Subtotal">Sub-Total</div>
                        <div className="items"> {cartItems.length} items</div>
                    </div>
                    <div className="total-amount">₹ 100</div>
                </div>
                <button className='button' type='submit'>Submit</button>
            </div>
        </div>
    );
};


export default Cart;
