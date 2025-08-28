import React, { useState, useEffect, useRef } from "react";
import log from "/img/log.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faGoogle,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import "../styles/Login.css"
import { Link, useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import register from "/img/register.svg";
import { motion } from "framer-motion";
import axiosInstance from "./axiosInstance";

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phoneNumber);
};
const isValidName = (name) => {
  const nameRegex = /^[A-Za-z][A-Za-z '’-]{1,48}[A-Za-z]$/;
  return nameRegex.test(name);
};


const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  return passwordRegex.test(password);
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
      const response = await axiosInstance.post("/api/login", { email, password }, { withCredentials: true });
      const { token, userId } = response.data;

      // Save the token and userId in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      props.currentUser(token, userId);
      setLoading(false);
      navigateTo("/");
    } catch (error) {
      console.error("Error logging in:", error);
      setLoading(false);

      // Check the response to see if the error indicates that the user does not exist
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "User does not exist. Please register."
      ) {
        window.alert(
          "User does not exist. Redirecting to the registration page."
        );
        navigateTo("/register");
      }
      else if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Incorrect password."
      ) {
        setError("Incorrect email or password. Please try again.");
      }
      else {
        setError("Failed to login. Please try again later.");
      }
    }
  };
  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "name":
        if (!isValidName(value)) {
          error =
            "Name must contain only letters, spaces, hyphens, and apostrophes.";
        }
        break;

      case "email":
        if (!isValidEmail(value)) {
          error = "Please enter a valid email address.";
        } else if (value.length > 50) {
          error = "Email address exceeds the maximum character limit (50).";
        }
        break;

      case "phoneNumber":
        if (!isValidPhoneNumber(value)) {
          error = "Phone number must be exactly 10 digits.";
        }
        break;

      case "address":
        if (value.length > 100) {
          error = "Address exceeds the maximum character limit (100).";
        }
        break;

      case "password":
        if (!isValidPassword(value)) {
          error =
            "Password must be at least 8 characters, with one uppercase, one lowercase, one number, and one special character.";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          error = "Passwords do not match.";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error while typing
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
      if (errors[field]) {
        newErrors[field] = errors[field];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAlertMessage("Please fix the highlighted errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`${backendUri}/api/users`);
      const usersData = response.data;
      const existingUser = usersData.find(
        (user) => user.email === formData.email
      );

      if (existingUser) {
        setErrors({ email: "User already exists. Please login." });
        window.alert("User already exists. Please login.");
        navigateTo("/Login");
        return;
      }

      await axiosInstance.post(`${backendUri}/api/users`, formData);
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="forms-container">
        <div className="signin-signup">
          <form method="POST" onSubmit={handleSubmit} className="sign-up-form">
            {alertMessage && (
              <div className="alert-box">
                <p>{alertMessage}</p>
              </div>
            )}
            <h2 className="title-login">Sign up</h2>

            {/* Name Field */}
            <div className={`input-field ${errors.name ? "error" : ""}`}>
              <i className="fas fa-user"></i>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Full Name"
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            {/* Email Field */}
            <div className={`input-field ${errors.email ? "error" : ""}`}>
              <i className="fas fa-envelope"></i>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                type="email"
                placeholder="Email"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* Address Field */}
            <div className={`input-field ${errors.address ? "error" : ""}`}>
              <i className="fas fa-map-marker-alt"></i>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Address"
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>

            {/* Phone Number Field */}
            <div className={`input-field ${errors.phoneNumber ? "error" : ""}`}>
              <i className="fas fa-mobile-alt"></i>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Phone Number"
              />
              {errors.phoneNumber && (
                <span className="error-message">{errors.phoneNumber}</span>
              )}
            </div>

            {/* Password Field */}
            <div className={`input-field ${errors.password ? "error" : ""}`}>
              <i className="fas fa-lock"></i>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div
              className={`input-field ${errors.confirmPassword ? "error" : ""}`}
            >
              <i className="fas fa-lock"></i>
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <input type="submit" className="btn solid" value="Sign up" />
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export { Login, ForgotPassword, Register };
