import React from 'react';
import HomeImage from './assets/img/248.jpg'; 
import AboutImage from './assets/img/about.jpg';
import {Header,Footer} from './HAF.jsx'
import './styles.css'
import { Link } from 'react-router-dom';
function HomePage() {
    return (
        <div>
            {/*<Header/>*/}
            <main className="l-main">
                {/* HOME SECTION */}
                <section className="home" id="home">
                    <div className="home__container bd-container bd-grid">
                        <div className="home__data">
                            <h1 className="home__title">Welcome!<br/>Try our food</h1>
                            <h3 className="home__subtitle">Nothing brings people together like good food.</h3>
                            <div className="button-container">
                                <Link to = "/menu"><a  className="button">View Menu</a></Link>
                                <Link to="/table"><a className="button">Reserve Table</a></Link>
                            </div>
                        </div>
                        
                        <img src={HomeImage} alt="Home" className="home__img"/>
                    </div>
                </section>
            </main>
        </div>
    );
}
function AboutPage() {
    return (
        <div>
            {/*<Header/>*/}
            <section className="about section bd-container" id="about">
                <div className="about__container bd-grid">
                    <div className="about__data">
                        <span className="section-subtitle about__initial">About us</span>
                        <h2 className="section-title about__initial">We cook the best <br/> tasty food</h2>
                        <p className="about__description">We cook the best food in the entire city, with excellent customer service, the best meals and at the best price, visit us and Don't forgot to Pay us a decent amount of money cause we are the best south indian food Restaurant🤪 </p>
                        <a href="#" className="button">Explore history</a>
                    </div>

                    <img src={AboutImage} alt="" className="about__img"/>
                </div>
            </section>
        </div>
    );
}
function Contact() {
    return (
        <div>
            {/*<Header/>*/}
            <section className="contact section bd-container" id="contact">
                <div className="contact__container bd-grid">
                    <div className="contact__data">
                        <span className="section-subtitle contact__initial">Let's talk</span>
                        <h2 className="section-title contact__initial">Contact us</h2>
                        <p className="contact__description">We would love to hear from you!
                        <br/> For any queries, please contact us.
                        <br/>Feel free to contact and suggest the improvements that are required for this website
                        </p>
                    </div>

                    <div className="contact__button">
                        <a href="#" className="button">Contact us now</a>
                    </div>
                </div>
            </section>
            {/*<FOOTER> */}
            <Footer/>
            {/*<FOOTER ENDS>*/}
        </div>
    );
}

export {HomePage,AboutPage,Contact};
