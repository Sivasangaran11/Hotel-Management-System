import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Menu from './Menu2.jsx';
import Cart from './cart.jsx';
import Table from './table.jsx';

const Root = () => {
  return (
    <React.StrictMode>
      <Router>
          <Routes>
              <Route exact path="/" element={<App />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/table" element={<Table />} />
            </Routes>
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.render(
  <Root />, // Render your Root component
  document.getElementById('root')
);
