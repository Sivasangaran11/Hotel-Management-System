import React, { useState, useEffect } from 'react';
import './styles.css';
import axios from 'axios';
const Menu = () => {
    const [items, setItems] = useState([]);
    
    useEffect(() => {
        fetchItems();
    }, []);
    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:8000/item');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
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
        const updatedItems = items.map(item => {
            if (item.id === itemId) {
                const newOrderCount = (item.order || 0) + 1;
                updateOrderCount(itemId, newOrderCount);
                return { ...item, order: newOrderCount };
            }
            return item;
        });
        setItems(updatedItems);//Increments the order count and updates tbe order
    };
    if (!items || items.length === 0) {
        return <div>Loading...</div>;
    }//If items was not found
    return (
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
                            <button className="button menu__button" onClick={() => incrementOrder(item.id)}>Add</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Menu;
