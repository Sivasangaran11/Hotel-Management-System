import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Login, ForgotPassword, Register } from "./LoginPage.jsx";
import { HomePage, AboutPage, Contact } from "./Home.jsx";
import Menu from "./Menu2.jsx";
import Cart from "./cart.jsx";
import Table from "./table.jsx";
import { Header, Footer } from "./HAF.jsx";

function App() {
  const [userID, setUserID] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [SelectedFoodItem, setSelectedFoodItem] = useState([]);

  const updateUser = (newUser) => {
    setUserID(newUser);
    // Set isLoggedIn to true after successful login
    setIsLoggedIn(true);
  };

  const updateFood = (newFood) => {
    setSelectedFoodItem(newFood);
    console.log(SelectedFoodItem);
  };

  const location = useLocation();
  const shouldRenderHeaderFooter = ![
    "/Login",
    "/Register",
    "/ForgotPassword",
  ].includes(location.pathname);

  return (
    <div className="App">
      {shouldRenderHeaderFooter && (
        <Header LoginStatus={updateUser} ISLoggedIn={isLoggedIn} />
      )}
      <Routes>
        <Route
          path="/"
          element={<HomePage userId={userID} ISLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/menu"
          element={<Menu userId={userID} selectedFood={updateFood} />}
        />
        <Route
          path="/cart"
          element={<Cart userId={userID} CartItems={SelectedFoodItem} />}
        />
        <Route path="/table" element={<Table userId={userID} />} />
        <Route path="/About" element={<AboutPage />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<Login currentUser={updateUser} />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        {/* Redirect to home page after successful login */}
      </Routes>
      {shouldRenderHeaderFooter && <Footer />}
    </div>
  );
}

export default App;


/*
import React, { useState } from 'react';
import Menu from './Menu2.jsx';
function App() {
  const [currentForm, setCurrentForm] = useState('Menu');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  return(<div className="menuPage">
    <Menu onFormSwitch = {toggleForm}/>
  </div>
  );
};
export default App;
*/
