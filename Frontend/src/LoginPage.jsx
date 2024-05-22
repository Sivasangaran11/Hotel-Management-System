import React, { useState } from "react";
import log from "./assets/img/log.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faGoogle,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import "./Login.css";
import axios from "axios";
//import SHA256 from 'crypto-js/sha256';
//import CryptoJS from 'crypto-js';
//import argon2 from 'argon2';
//import bcrypt from "bcrypt";
import { hashSync, compareSync } from "bcrypt-ts";
import { Link, useNavigate } from "react-router-dom";
//import './FTP.css';
//import register from './assets/img/register.svg';
const isValidEmail = (email) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const isValidPhoneNumber = (phoneNumber) => {
  // Regular expression for phone number validation
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phoneNumber);
};

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigateTo = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate email and password fields
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }
    if (email.length > 50) {
      setError("Email address exceeds the maximum character limit (50).");
      return;
    }

    try {
      // Fetch user data from the server
      const response = await axios.get("http://localhost:3000/api/users");
      const usersData = response.data;

      // Find user by email in the fetched data
      const user = usersData.find((user) => user.email === email);

      if (!user) {
        // Display alert message if user does not exist
        window.alert("User does not exist. Please register.");
        // Redirect to register page
        navigateTo('/Register');
        return;
      }

      // Compare the entered password with the hashed password using bcrypt-ts
      const passwordMatch = compareSync(password, user.password);
      if (!passwordMatch) {
        // Display alert message if password is incorrect
        window.alert("Incorrect password.");
        return;
      }

      // Call props.currentUser with the user ID after successful login
      props.currentUser(user._id);
      navigateTo('/');
      console.log("Login successful!");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Failed to login. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleSubmit} className="sign-in-form">
            <h2 className="title">Sign In</h2>
            {error && <p className="error">{error}</p>}
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Your Email"
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </div>
            <input type="submit" value="Login" className="btn solid" onClick={handleSubmit}/>
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faGoogle} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Register yourself to access our services.</p>
            <Link to="/Register">
              <button className="btn transparent" id="sign-up-btn">
                Sign up
              </button>
            </Link>
          </div>
          <img src={log} className="image" alt="" />
        </div>
      </div>
    </div>
  );
};
const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password1 !== password2) {
      setError("Passwords do not match");
      return;
    }
    // For example, you can send a request to your backend to change the password
    // Reset form fields
    setEmail("");
    setPassword1("");
    setPassword2("");
    // Optionally, you can switch back to the login form after successful password change
  };

  return (
    <>
      <div className="container-fp">
        <div className="form-container-fp">
          <form onSubmit={handleSubmit} className="otp-form">
            <h2 className="title">Change Password</h2>
            {error && <p className="error">{error}</p>}
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Your Email"
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                type="password"
                placeholder="New Password"
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                type="password"
                placeholder="Confirm New Password"
              />
            </div>
            <Link to="login">
            <input
              type="submit"
              value="Submit"
              className="btn solid"
            /></Link>
          </form>
        </div>
      </div>
    </>
  );
};
const Register = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number (10 digits only).");
      return;
    }
    if (email.length > 50) {
      setError("Email address exceeds the maximum character limit (50).");
      return;
    }
    // Check if password matches confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      const usersData = response.data;
      const existingUsers = usersData.find((user) => user.email === email);
      if (existingUsers) {
        setError("User already exists. Please login.");
        window.alert("User already exists. Please login.");
        navigateTo('/Login');
        return;
      }
      const hashedPassword = hashSync(password);

      const user = {
        name: name,
        email: email,
        address: address,
        phoneNumber: phoneNumber,
        password: hashedPassword, // Send hashed password to the server
      };

      await axios.post("http://localhost:3000/api/users", user);
      navigateTo('/Login');
    } catch (error) {
      console.error("Error registering user:", error);
      // Handle error
    }
  };

  return (
    <div className="container sign-up-mode">
      <div className="forms-container">
        <div className="signin-signup">
          <form method="POST" onSubmit={handleSubmit} className="sign-up-form">
            <h2 className="title">Sign up</h2>
            {error && <p className="error">{error}</p>}
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Full Name"
              />
            </div>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="input-field">
              <i className="fas fa-map-marker-alt"></i>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                placeholder="Address"
              />
            </div>
            <div className="input-field">
              <i className="fas fa-mobile-alt"></i>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="text"
                placeholder="Phone Number"
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
              />
            </div>
            <input
              type="submit"
              className="btn solid"
              value="Sign up"
              onClick={handleSubmit}
            />
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faGoogle} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export { Login, ForgotPassword, Register };
