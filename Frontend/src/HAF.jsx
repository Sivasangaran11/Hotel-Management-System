import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookF,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import "./styles/styles.css";

function Header(props) {
  return (
    <div>
      {/* SCROLL TOP */}
      <a href="#" className="scrolltop" id="scroll-top">
        <i className="bx bx-chevron-up scrolltop__icon"></i>
      </a>
      {/* HEADER */}
      <header className="l-header" id="header">
        <nav className="nav bd-container">
          <Link to="/" className="nav__logo">
            <h1>SaPPadu.</h1>
          </Link>
          <div className="nav__menu" id="nav-menu">
            <ul className="nav__list">
              <li className="nav__item">
                <Link to="/" className="nav__link active-link">
                  Home
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/About" className="nav__link">
                  About
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/Services" className="nav__link">
                  Services
                </Link>
              </li>
              {!props.ISLoggedIn ? (
                <>
                  <li className="nav__item">
                    <Link to="/Login" className="nav__link">
                      Log in
                    </Link>
                  </li>
                  <li className="nav__item">
                    <Link to="/Register">Register</Link>
                  </li>
                </>
              ) : (
                <li className="nav__item">
                  <Link
                    to="/Login"
                    className="nav__link"
                    onClick={() => props.LoginStatus(null)}
                  >
                    Log out
                  </Link>
                </li>
              )}
              <li className="nav__item">
                <Link to="/Contact" className="nav__link">
                  Contact us
                </Link>
              </li>
              {props.TableVisibility && (
                <Link to = "/BookedTables">
                <li className="nav__item">
                  <div className="nav__link">
                    <svg
                      width="24"
                      height="24"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 64 64"
                    >
                      <path d="m59.247 38.166 1.743-20.908c.07-.836-.217-1.67-.785-2.287S58.831 14 57.992 14a3 3 0 0 0-2.994 2.709L53.27 34H44c-1.103 0-2 .897-2 2v2c0 1.034.792 1.878 1.8 1.98l-1.608 8.841a1 1 0 0 0 1.968.358L45.83 40h9.694l1.67 9.179a1 1 0 0 0 1.967-.358l-1.609-8.85a2.009 2.009 0 0 0 1.696-1.805zM44 36h10.174a1 1 0 0 0 .995-.9l1.82-18.192A1.006 1.006 0 0 1 57.991 16c.285 0 .548.115.741.325.194.21.287.483.264.767L57.255 38H44v-2zm-24-2h-9.27L9.002 16.709A3 3 0 0 0 6.008 14c-.839 0-1.645.353-2.213.97s-.854 1.452-.785 2.288l1.743 20.908a2.01 2.01 0 0 0 1.696 1.805l-1.61 8.85a1 1 0 0 0 1.969.358l1.668-9.18h9.695l1.669 9.18a1 1 0 0 0 1.968-.358L20.2 39.98A1.996 1.996 0 0 0 22 38v-2c0-1.103-.897-2-2-2zM5.003 17.092a.999.999 0 0 1 .264-.767.996.996 0 0 1 .741-.325c.52 0 .952.39 1.004.908L8.83 35.1a1 1 0 0 0 .996.9H20v2H6.746L5.003 17.092z"></path>
                      <path d="M46 28c1.103 0 2-.897 2-2v-2c0-1.103-.897-2-2-2H18c-1.103 0-2 .897-2 2v2c0 1.103.897 2 2 2h7v2c0 1.103.897 2 2 2h4v12h-2c-1.654 0-3 1.346-3 3v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2c0-1.654-1.346-3-3-3h-2V32h4c1.103 0 2-.897 2-2v-2h7ZM36 47v1h-8v-1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1ZM18 24h28l.002 2H18v-2Zm19.002 6H27v-2h10l.002 2Z"></path>
                    </svg>
                  </div>
                </li>
                </Link>
              )}
              {props.CartVisibility && (
                <Link to="/cart">
                  <li className="nav__item">
                    <div className="nav__link">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        id="cart"
                        viewBox="0 0 64 64"
                      >
                        <path d="M14 36c-2.21 0-3.98 1.79-3.98 4s1.77 4 3.98 4 4-1.79 4-4-1.79-4-4-4zM2 4v4h4l7.19 15.17-2.7 4.9c-.31.58-.49 1.23-.49 1.93 0 2.21 1.79 4 4 4h24v-4H14.85c-.28 0-.5-.22-.5-.5 0-.09.02-.17.06-.24L16.2 26h14.9c1.5 0 2.81-.83 3.5-2.06l7.15-12.98c.16-.28.25-.61.25-.96a2 2 0 0 0-2-2H10.43l-1.9-4H2zm32 32c-2.21 0-3.98 1.79-3.98 4s1.77 4 3.98 4 4-1.79 4-4-1.79-4-4-4z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                      <span className="cart-message">View Cart</span>
                    </div>
                  </li>
                </Link>
              )}
              <li>
                <i
                  className="bx bx-moon change-theme"
                  id="theme-button"
                  onClick={props.Theme}
                ></i>
              </li>
            </ul>
          </div>
          <div className="nav__toggle" id="nav-toggle">
            <i className="bx bx-menu"></i>
          </div>
        </nav>
      </header>
      {/* HEADER ENDS */}
    </div>
  );
}
function Footer() {
  return (
    <div className="l-footer">
      <footer className="footer section bd-container">
        <div className="footer__container bd-grid">
          <div className="footer__content">
            <a href="#" className="footer__logo">
              Sappadu
            </a>
            <span className="footer__description">Restaurant</span>
            <div>
              <a href="#" className="footer__social">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="footer__social">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="footer__social">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </div>
          </div>

          <div className="footer__content">
            <h3 className="footer__title">Services</h3>
            <ul>
              <li>
                <Link to="/table" className="footer__link">
                    Table Reservation 
                </Link>
              </li>
              <li>
                <Link to="/menu" className="footer__link">
                    Order Food
                </Link>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Delivery Tracking
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__content">
            <h3 className="footer__title">Information</h3>
            <ul>
              <li>
                <a href="#" className="footer__link">
                  Event
                </a>
              </li>

              <li>
                <Link to="/contact" className="footer__link">
                    Contact us
                </Link>
              </li>

              <li>
                <a href="#" className="footer__link">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Terms of services
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__content">
            <h3 className="footer__title">Address</h3>
            <ul>
              <li>No 3, Vivekanandar street</li>
              <li>Dubai Main Road, Dubai</li>
              <li>9887654432</li>
              <li>restaurantapplication245@gmail.com</li>
            </ul>
          </div>
        </div>

        <p className="footer__copy">&#169; 2024 . All rights reserved</p>
      </footer>
    </div>
  );
}

export { Header, Footer };
