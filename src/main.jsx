import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App.jsx';
import Menu from './Menu2.jsx';
import Cart from './cart.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Route exact path="/" component={App} />
            <Route path="/menu" component={Menu} />
            <Route path="/cart" component={Cart} />
        </Router>
    </React.StrictMode>
);
