
import React from 'react';
import './Footer.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

function Footer() {
    const handleSubscribe = (e) => {
        e.preventDefault();
        alert('Subscribed successfully!');
    };

    return (
        <footer>
            <div className="container-fluid">

                <div className="footer-columns">

                    {/* Left Column: Quick Links + Social Icons */}
                    <div className="footer-column">
                        <h5>Quick Links</h5>
                        <ul className="footer-links">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Records</a></li>
                            <li><a href="#">About</a></li>
                            <li><a href="#">Code</a></li>
                            <li><a href="#">Design</a></li>
                            <li><a href="#">Host</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Company</a></li>
                        </ul>
                        <div className="social-icons">
                            <a href="https://www.youtube.com/c/jamesqquick" aria-label="YouTube">
                                <FontAwesomeIcon icon={faYoutube} />
                            </a>
                            <a href="https://www.facebook.com/learnbuildteach/" aria-label="Facebook">
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                            <a href="http://www.instagram.com/larnbuildteach" aria-label="Instagram">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a href="https://www.twitter.com" aria-label="Twitter">
                                <FontAwesomeIcon icon={faTwitter} />
                            </a>
                        </div>
                    </div>

                    {/* Middle Column: Subscription Form */}
                    <div className="footer-column">
                        <h5>Subscribe</h5>
                        <Form className="subscription-form" onSubmit={handleSubscribe}>
                            <Form.Group>
                                <Form.Label>Get 10% off by subscribing:</Form.Label>
                                <Form.Control type="email" placeholder="Enter your email" required />
                                <Button type="submit" variant="success" className="mt-2">Subscribe</Button>
                            </Form.Group>
                        </Form>
                    </div>

                    {/* Right Column: Contact Info */}
                    <div className="footer-column contact-info">
                        <h5>Contact Info</h5>
                        <div className="media">
                            <img src="https://static.vecteezy.com/system/resources/previews/006/541/488/original/clock-icon-isolated-on-a-white-background-symbol-of-time-for-your-website-design-illustration-free-vector.jpg" alt="Clock" />
                            <div>
                                <h6>Opening Hours</h6>
                                <p className="mb-0">Everyday: 24/7</p>
                            </div>
                        </div>
                        <div className="media">
                            <img src="https://cdn3.vectorstock.com/i/1000x1000/25/07/telephone-icon-phone-simple-or-logo-for-web-vector-11362507.jpg" alt="Telephone" />
                            <div>
                                <h6>Contact</h6>
                                <p className="mb-0">
                                    Tel: 038 - 265-928<br />
                                    E-mail: info@medical-ks.com
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} Medical. All rights reserved.
                </div>

            </div>
        </footer>
    );
}

export default Footer;
