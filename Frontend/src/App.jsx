import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Login, ForgotPassword, Register } from "./LoginPage";
import { HomePage, AboutPage, Contact, Services } from "./Home";
import { Menu, Cart } from "./Menu";
import {Table, BookedTables} from "./Table.jsx";
import { Header, Footer } from "./HAF";
import CongratsPage from "./Congrats";

function App() {
  const [userID, setUserID] = useState(localStorage.getItem("userID") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [bookedTables, setBookedTables] = useState([]);
  const [selectedFoodItem, setSelectedFoodItem] = useState(
    JSON.parse(localStorage.getItem("selectedFood")) || []
  );
  const [isVisibleTable, setIsVisibleTable] = useState(
    localStorage.getItem("isVisibleTable") === "true"
  );
  const [isVisibleCart, setIsVisibleCart] = useState(
    localStorage.getItem("isVisibleCart") === "true"
  );
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("isDarkTheme") === "true"
  );

  useEffect(() => {
    localStorage.setItem("userID", userID);
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("selectedFood", JSON.stringify(selectedFoodItem));
    localStorage.setItem("isVisibleTable", isVisibleTable);
    localStorage.setItem("isVisibleCart", isVisibleCart);
    localStorage.setItem("isDarkTheme", isDarkTheme);
  }, [
    userID,
    isLoggedIn,
    selectedFoodItem,
    isVisibleTable,
    isVisibleCart,
    isDarkTheme,
  ]);
  useEffect(() => {
    // Initialize booked tables from session storage
    const storedBookedTables = JSON.parse(sessionStorage.getItem("bookedTables")) || [];
    setBookedTables(storedBookedTables);
  }, []);

  const updateUser = (newUser) => {
    setUserID(newUser);
    setIsLoggedIn(!!newUser);
  };

  const updateFood = (newFood) => setSelectedFoodItem(newFood);
  const toggleVisibilityCart = (isVisible) => setIsVisibleCart(isVisible);
  const toggleVisibilityTable = (isVisible) => setIsVisibleTable(isVisible);
  const toggleTheme = () => setIsDarkTheme((prevTheme) => !prevTheme);
  const updateBookedTables = (newBookedTables) =>{
    setBookedTables(newBookedTables);
    sessionStorage.setItem("bookedTables", JSON.stringify(newBookedTables));
  }
  const location = useLocation();
  const shouldRenderHeaderFooter = ![
    "/Login",
    "/Register",
    "/ForgotPassword",
  ].includes(location.pathname);

  return (
    <div className={`App ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
      {shouldRenderHeaderFooter && (
        <Header
          LoginStatus={updateUser}
          ISLoggedIn={isLoggedIn}
          CartVisibility={isVisibleCart}
          TableVisibility={isVisibleTable}
          Theme={toggleTheme}
        />
      )}
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
              VisibleCart={toggleVisibilityCart}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              userId={userID}
              CartItems={selectedFoodItem}
              VisibleCart={toggleVisibilityCart}
            />
          }
        />
        <Route path="/congrats" element={<CongratsPage />} />
        <Route
          path="/table"
          element={
            <Table
              userId={userID}
              toggleVisibilityTable={toggleVisibilityTable}
              updateBookedTables={updateBookedTables}
            />
          }
        />
        <Route
          path="/BookedTables"
          element={<BookedTables bookedTables={bookedTables} />}
        />
        <Route path="/About" element={<AboutPage />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<Login currentUser={updateUser} />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
      </Routes>
      {shouldRenderHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
