import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Login, ForgotPassword, Register } from "./Components/LoginPage.jsx";
import { HomePage, AboutPage, Contact, Services } from "./Components/Home.jsx";
import { Menu, Cart } from "./Components/Menu.jsx";
import {Table, BookedTables} from "./Components/table.jsx";
import { Header, Footer } from "./Components/HAF.jsx";
import CongratsPage from "./Components/Congrats.jsx";
import {AnimatePresence} from "framer-motion"

function App() {
  const [userID, setUserID] = useState(localStorage.getItem("userId") || null);//Review the userId 
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
  const [isLightTheme, setIsLightTheme] = useState(
    localStorage.getItem("isLightTheme") === "true"
  );

  useEffect(() => {
    //localStorage.setItem("userID", userID);
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("selectedFood", JSON.stringify(selectedFoodItem));
    localStorage.setItem("isVisibleTable", isVisibleTable);
    localStorage.setItem("isVisibleCart", isVisibleCart);
    localStorage.setItem("isLightTheme", isLightTheme);
  }, [
    //userID,
    isLoggedIn,
    selectedFoodItem,
    isVisibleTable,
    isVisibleCart,
    isLightTheme,
  ]);
  useEffect(() => {
    // Initialize booked tables from session storage
    const storedBookedTables = JSON.parse(sessionStorage.getItem("bookedTables")) || [];
    setBookedTables(storedBookedTables);
  }, []);

  const updateUser = (newUserToken,newUser) => {
    setUserID(newUser);
    setIsLoggedIn(!!newUserToken);
  };

  const updateFood = (newFood) => setSelectedFoodItem(newFood);
  const toggleVisibilityCart = (isVisible) => setIsVisibleCart(isVisible);
  const toggleVisibilityTable = (isVisible) => setIsVisibleTable(isVisible);
  const toggleTheme = () => setIsLightTheme((prevTheme) => !prevTheme);
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
    <div className={`App ${isLightTheme ? "light-theme" : "dark-theme"}`}>
      {shouldRenderHeaderFooter && (
        <Header
          LoginStatus={updateUser}
          ISLoggedIn={isLoggedIn}
          CartVisibility={isVisibleCart}
          TableVisibility={isVisibleTable}
          Theme={toggleTheme}
        />
      )}
      <AnimatePresence>
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
      </AnimatePresence>
      {shouldRenderHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
