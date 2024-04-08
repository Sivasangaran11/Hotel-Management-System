import React, { useState } from 'react';
import log from './assets/img/log.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faGoogle, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import './Login.css';
//import './FTP.css';
//import register from './assets/img/register.svg';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const postData = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to login');
      }
      return response.json();
    } catch (error) {
      throw new Error(`Error logging in: ${error.message}`);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postData('http://localhost:8000/login', { email, password });
      console.log('Login response:', response);
      // Optionally, handle successful login response here (e.g., redirect to another page)
    } catch (error) {
      console.error('Error logging in:', error);
      // Optionally, handle login error here (e.g., show error message to user)
    }
  };
  return (
    <>
      <div className="container">
        <div className="forms-container">
          <div className="signin-signup">
            <form method="POST" onSubmit={handleSubmit} className="sign-in-form">
              <h2 className="title">SignIn</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your Email" />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
              </div>

              <div className='f-password'>
                <h4 className="forgot-password">
                  <a className="fp-link" onClick={() =>props.onFormSwitch("ForgotPassword")}>Forgot Password?</a>
                </h4>
              </div>

              <input type="submit" value="Login" className="btn solid" />
              <p className="social-text">Or Sign in with social platforms</p>
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
              <div className="panel left-panel">
                <div className="content">
                  <h3>New here?</h3>
                  <p>
                    Register yourself to access our services.
                  </p>
                  <button className="btn transparent" id="sign-up-btn" onClick={() =>props.onFormSwitch("Register")} >
                    Sign up
                  </button>
                </div>
                <img src={log} className="image" alt="" />
              </div>
            </div>
      </div>
    </>
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
    ;
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
            <input type="submit" value="Submit" className="btn solid" onClick={() =>props.onFormSwitch("login")}/>
          </form>
        </div>
      </div>
    </>
  );
};
const Register = (props) => {
  const [name , setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [Address, setAddress] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== ConfirmPassword) {
        setError("Passwords do not match");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
  }};
  return (
    <div className="container sign-up-mode">
        <div className="forms-container">
            <div className="signin-signup">
                <form method="POST" onSubmit={handleSubmit} className="sign-up-form">
                    <h2 className="title">Sign up</h2>
                    {error && <p className="error">{error}</p>}
                    <div className="input-field">
                    <i className="fas fa-user"></i>
                    <input value = {name} onChange ={(e)=>setName(e.target.value)} type="text" placeholder="Full Name" />
                    </div>
                    <div className="input-field">
                    <i className="fas fa-user"></i>
                    <input value = {email} onChange ={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" />
                    </div>
                    <div className="input-field">
                    <i className="fas fa-map-marker-alt"></i>
                    <input value = {Address} onChange ={(e)=>setAddress(e.target.value)} type="text" placeholder="Address" />
                    </div>
                    <div className="input-field">
                    <i className="fas fa-mobile-alt"></i>
                    <input value = {PhoneNumber} onChange ={(e)=>setPhoneNumber(e.target.value)} type="text" placeholder="Phone Number" />
                    </div>
                    <div className="input-field">
                    <i className="fas fa-lock"></i>
                    <input value = {password} onChange ={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" />
                    </div>
                    <div className="input-field">
                    <i className="fas fa-lock"></i>
                    <input value = {ConfirmPassword} onChange ={(e)=>setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" />
                    </div>
                    <input type="submit" className="btn" value="Sign up" onClick ={()=>props.onFormSwitch('Home')} />
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
        {/*<div className="panels-container">
            <div className="panel right-panel">
                <div className="content">
                    <h3>One of us?</h3>
                    <p>
                    Already registered? then hop on & access our services.
                    </p>
                    <button className="btn transparent" id="sign-in-btn" onClick ={()=>props.onFormSwitch("Login")}>
                    Sign in
                    </button>
                </div>
            {/*<img src={register} className="image" alt="" />/}
            </div>
        </div>*/}
    </div>
  );
};
export{Login, ForgotPassword, Register};
