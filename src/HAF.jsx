import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faInstagram, faFacebookF, faTwitter} from '@fortawesome/free-brands-svg-icons';

function Header(props) {
    return (
        <div>
            {/* SCROLL TOP */}
            <a href="#" className="scrolltop" id="scroll-top">
                <i className='bx bx-chevron-up scrolltop__icon'></i>
            </a>

            {/* HEADER */}
            <header className="l-header" id="header">
                <nav className="nav bd-container">
                    <a href="#" className="nav__logo"><h1>SaPPadu.</h1></a>

                    <div className="nav__menu" id="nav-menu">
                        <ul className="nav__list">
                            <li className="nav__item"><a href="#" className="nav__link active-link" onClick ={()=>props.onFormSwitch("Home")}>Home</a></li>
                            <li className="nav__item"><a href="#" className="nav__link" onClick ={()=>props.onFormSwitch("About")}>About</a></li>
                            <li className="nav__item"><a href="#" className="nav__link" >Services</a></li>
                            <li className="nav__item"><a href="#" className="nav__link" onClick ={()=>props.onFormSwitch("Login")}>Log in</a></li>
                            <li className="nav__item"><a href="#" className="nav__link" onClick ={()=>props.onFormSwitch("Register")}>Register</a></li> 
                            <li className="nav__item"><a href="#" className="nav__link" onClick ={()=>props.onFormSwitch("Contact")}>Contact us</a></li>

                            <li><i className='bx bx-moon change-theme' id="theme-button"></i></li>
                        </ul>
                    </div>

                    <div className="nav__toggle" id="nav-toggle">
                        <i className='bx bx-menu'></i>
                    </div>
                </nav>
            </header>
            {/* HEADER ENDS */}
        </div>
    );
}
function Footer(){
    return(
        <div>
            <footer className="footer section bd-container">
                <div className="footer__container bd-grid">
                    <div className="footer__content">
                        <a href="#" className="footer__logo">Sappadu</a>
                        <span className="footer__description">Restaurant</span>
                        <div>
                            <a href="#" className="footer__social"><FontAwesomeIcon icon={faFacebookF} /></a>
                            <a href="#" className="footer__social"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="#" className="footer__social"><FontAwesomeIcon icon={faTwitter} /></a>
                        </div>
                    </div>

                    <div className="footer__content">
                        <h3 className="footer__title">Services</h3>
                        <ul>
                            <li><a href="#" className="footer__link">Table Reservation</a></li>
                            <li><a href="#" className="footer__link">Order Food</a></li>
                            <li><a href="#" className="footer__link">Delivery Tracking</a></li>
                        </ul>
                    </div>

                    <div className="footer__content">
                        <h3 className="footer__title">Information</h3>
                        <ul>
                            <li><a href="#" className="footer__link">Event</a></li>
                            <li><a href="#" className="footer__link" onClick ={()=>props.onFormSwitch("Contact")} >Contact us</a></li>
                            <li><a href="#" className="footer__link">Privacy policy</a></li>
                            <li><a href="#" className="footer__link">Terms of services</a></li>
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

export{Header,Footer};
