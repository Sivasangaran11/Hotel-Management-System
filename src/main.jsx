import React from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM.render instead of ReactDOM.render
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Menu from './Menu2.jsx';
import Cart from './cart.jsx';

const Root = () => {
  return (
    <React.StrictMode>
      <Router>
      <Menu>
        <Routes>
            <Route exact path="/" element={<App />} />
            <Route path="/menu" element={<Menu />} />
            
              <Route path="/cart" element={<Cart />} />
        </Routes>
        </Menu>
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.render(
  <Root />, // Render your Root component
  document.getElementById('root')
);
