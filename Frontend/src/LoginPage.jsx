import React, { useState } from "react";
import log from "/img/log.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faGoogle,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import "./styles/Login.css";
import axios from "axios";
import { compareSync } from "bcrypt-ts";
import { Link, useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import register from '/img/register.svg';
import {motion} from "framer-motion"

const isValidEmail = (email) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phoneNumber);
};

const backendUri = import.meta.env.VITE_BACKEND_URI;

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const response = await axios.get(`${backendUri}/api/users`);
      const usersData = response.data;

      // Find user by email in the fetched data
      const user = usersData.find((user) => user.email === email);

      if (!user) {
        window.alert("User does not exist. Please register.");
        navigateTo("/Register");
        return;
      }

      // Compare the entered password with the hashed password using bcrypt-ts
      const passwordMatch = compareSync(password, user.password);
      if (!passwordMatch) {
        window.alert("Incorrect password.");
        return;
      }

      props.currentUser(user._id);
      setLoading(false);
      navigateTo("/");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Failed to login. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <motion.div 
    className="container"
    initial = {{opacity:0}}
    animate = {{opacity:1}}
    exit = {{opacity:0}}
    >
      <div className="Login-loader-container">
              {loading && (
                <div className={`loader ${loading ? "animate" : ""}`}>
                  <h4>loading </h4>
                  <BeatLoader color="#069C54" height={15} size={10} />
                </div>
              )}
            </div>
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleSubmit} className="sign-in-form">
            <h2 className="title-login">Sign In</h2>
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
            <div className="button-loader-container">
              <input type="submit" value="Login" className="btn solid" />
            </div>
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
    </motion.div>
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
    setEmail("");
    setPassword1("");
    setPassword2("");
    // Optionally, you can switch back to the login form after successful password change
  };

  return (
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
              <input type="submit" value="Submit" className="btn solid" />
            </Link>
          </form>
        </div>
      </div>
  );
};
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${backendUri}/api/users`);
      const usersData = response.data;
      const existingUsers = usersData.find((user) => user.email === email);
      if (existingUsers) {
        setError("User already exists. Please login.");
        window.alert("User already exists. Please login.");
        navigateTo("/Login");
        return;
      }

      const user = {
        name: name,
        email: email,
        address: address,
        phoneNumber: phoneNumber,
        password: password,
      };

      await axios.post(`${backendUri}/api/users`, user);
      setLoading(false);
      navigateTo("/Login");
    } catch (error) {
      console.error("Error registering user:", error);
      setLoading(false);
    }
  };

  return (
    <motion.div 
    className="container sign-up-mode"
    initial = {{opacity:0}}
    animate = {{opacity:1}}
    exit = {{opacity:0}}>
      <div className="Login-loader-container">
              {loading && (
                <div className={`loader ${loading ? "animate" : ""}`}>
                  <h4>loading </h4>
                  <BeatLoader color="#36d7b7" height={15} size={10} />
                </div>
              )}
            </div>
      <div className="forms-container">
        <div className="signin-signup">
          <form method="POST" onSubmit={handleSubmit} className="sign-up-form">
            <h2 className="title-login">Sign up</h2>
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
      <div className="panels-container">
        <div className="panel right-panel">
          <div className="content">
            <h3>Already an User?</h3>
            <p>Redirect to Login Page</p>
            <Link to="/Login">
              <button className="btn transparent" id="sign-up-btn">
                Log in
              </button>
            </Link>
          </div>

          <img src={register} className="image" alt="" />
        </div>
      </div>
    </motion.div>
  );
};
export { Login, ForgotPassword, Register };
