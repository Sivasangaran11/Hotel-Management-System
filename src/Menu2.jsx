import React, { useState, useEffect } from 'react';
import './styles.css';
import axios from 'axios';
export const SelectedItemsContext = React.createContext();
import Cart from './cart.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Menu = (props) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:8000/item');
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const addItemSelected = (itemId) => {
        if (selectedItems.find(item => item.id === itemId)) {
            return; // If item is already selected, do nothing
        }
        const updatedItems = items.map(item => {
            if (item.id === itemId) {
                return { ...item };
            }
            return item;
        });
        setSelectedItems([...selectedItems, updatedItems.find(item => item.id === itemId)]);
    };

    const removeItemSelected = (itemId) => {
        const updatedSelectedItems = selectedItems.filter(item => item.id !== itemId);
        setSelectedItems(updatedSelectedItems);
    };

    const handleCartIconClick = () => {
        setShowCart(!showCart); // Toggle the showCart state when the cart icon is clicked
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    console.log(selectedItems);
    return (
        <SelectedItemsContext.Provider value={{ selectedItems, setSelectedItems }}>
            <section className="menu section bd-container" id="menu">
                <h2 className="section-title">Menu</h2>
                <div className="menu__container bd-grid">
                    {items.map((item) => (
                        <div key={item.id} className="menu__content">
                            <img src={`src/assets/img/${item.source}`} alt="" className="menu__img" />
                            <h3 className="menu__name">{item.name}</h3>
                            <span className="menu__price">₹{item.price}</span>
                            <span className="menu__order">{item.order}</span>
                            <div className="menu__order-container">
                                <button className="button menu__button__add" onClick={() => addItemSelected(item.id)}>Add</button>
                                <button className="button menu__button__remove" onClick={() => removeItemSelected(item.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* Cart icon */}
            <Link to = "/cart">
                <div className="cart-icon" onClick={handleCartIconClick}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                </div>
            </Link>
            {/* Render Cart component based on showCart state */}
            {showCart && <Cart  />}
        </SelectedItemsContext.Provider>
    );
};


export default Menu;
