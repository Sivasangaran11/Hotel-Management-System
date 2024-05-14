import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Login, ForgotPassword, Register } from "./LoginPage.jsx";
import { HomePage, AboutPage, Contact } from "./Home.jsx";
import { Menu, Cart } from "./Menu.jsx";
import Table from "./table.jsx";
import { Header, Footer } from "./HAF.jsx";
import CongratsPage from "./Congrats.jsx";

function App() {
  // Initialize state with local storage data or default values
  const [userID, setUserID] = useState(localStorage.getItem("userID") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true" || false
  );
  const [SelectedFoodItem, setSelectedFoodItem] = useState(
    JSON.parse(localStorage.getItem("selectedFood")) || []
  );
  const [isVisibleTable, setIsVisibleTable] = useState(
    localStorage.getItem("isVisibleTable") === "true" || false
  );
  const [isVisibleCart, setIsVisibleCart] = useState(
    localStorage.getItem("isVisibleCart") === "true" || false
  );

  // Effect to store state data in local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("userID", userID);
  }, [userID]);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("selectedFood", JSON.stringify(SelectedFoodItem));
  }, [SelectedFoodItem]);

  useEffect(() => {
    localStorage.setItem("isVisibleTable", isVisibleTable);
  }, [isVisibleTable]);

  useEffect(() => {
    localStorage.setItem("isVisibleCart", isVisibleCart);
  }, [isVisibleCart]);

  const updateUser = (newUser) => {
    setUserID(newUser);
    // Set isLoggedIn to true after successful login
    setIsLoggedIn(true);
  };
  const updateFood = (newFood) => {
    setSelectedFoodItem(newFood);
  };
  const toggleVisibility = (newVisibility) => {
    if (newVisibility === "table") {
      setIsVisibleTable(true);
    } else if (newVisibility === "cart") {
      setIsVisibleCart(true);
    }
  };

  const location = useLocation();
  const shouldRenderHeaderFooter = ![
    "/Login",
    "/Register",
    "/ForgotPassword",
  ].includes(location.pathname);

  return (
    <div className="App">
      {/* Header and Footer components */}
      {shouldRenderHeaderFooter && (
        <Header
          LoginStatus={updateUser}
          ISLoggedIn={isLoggedIn}
          CartVisibility={isVisibleCart}
          TableVisibility={isVisibleTable}
        />
      )}
      {/* Routes for different pages */}
      <Routes>
        <Route
          path="/"
          element={<HomePage userId={userID} ISLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/menu"
          element={
            <Menu
              userId={userID}
              selectedFood={updateFood}
              Visible={toggleVisibility}
            />
          }
        />
        <Route
          path="/cart"
          element={<Cart userId={userID} CartItems={SelectedFoodItem} />}
        />
        <Route path="/congrats" element={<CongratsPage/>}/>
        <Route
          path="/table"
          element={<Table userId={userID} Visible={toggleVisibility} />}
        />
        <Route path="/About" element={<AboutPage />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<Login currentUser={updateUser} />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
      </Routes>
      {/* Footer component */}
      {shouldRenderHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
