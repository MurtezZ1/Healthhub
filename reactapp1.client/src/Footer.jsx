import React from 'react';
import './Footer.css';
import img1 from './assets/FooterPic1.jpg';
import img2 from './assets/Footer2.jpg';
import img3 from './assets/Footer3.jpg';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

function Footer() {
    return (
        <footer>
            <div className="container" style={{ backgroundColor: '#242424' }}>
                <div className="row">

                    <div className="col-lg-4 col-md-6">
                        <h3>Social Media</h3>
                        <ul className="list-unstyled three-column">
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
                            <a href="https://www.youtube.com/c/jamesqquick" className="youtube social">
                                <FontAwesomeIcon icon={faYoutube} size="2x" />
                            </a>
                            <a href="https://www.facebook.com/learnbuildteach/" className="facebook social">
                                <FontAwesomeIcon icon={faFacebook} size="2x" />
                            </a>
                            <a href="http://www.instagram.com/larnbuildteach" className="instagram social">
                                <FontAwesomeIcon icon={faInstagram} size="2x" />
                            </a>
                            <a href="https://wwww.twitter.com" className="twitter social">
                                <FontAwesomeIcon icon={faTwitter} size="2x" />
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <h3>Contact</h3>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Subscribe here to get 10% discount</Form.Label>
                                <Form.Control type="email" placeholder="Enter your email here..." />
                                <Button className="subscribe" type="submit" variant="success">Subscribe</Button>
                            </Form.Group>
                        </Form>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <div className="media">
                                <img src="https://static.vecteezy.com/system/resources/previews/006/541/488/original/clock-icon-isolated-on-a-white-background-symbol-of-time-for-your-website-design-illustration-free-vector.jpg" className="media-object" width="64px" alt="Clock" />
                                <div className="media-body">
                                    <h4 className="media-heading">Opening Hours</h4>
                                    <p>Everyday: 24/7</p>
                                </div>
                            </div>
                            <div className="media">
                                <img src="https://cdn3.vectorstock.com/i/1000x1000/25/07/telephone-icon-phone-simple-or-logo-for-web-vector-11362507.jpg" width="64px" className="media-object" alt="Telephone" />
                                <div className="media-body">
                                    <h4 className="media-heading">Contact</h4>
                                    <p>Tel: 038 - 265- 928<br />E-mail: info@medical-ks.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="copyright text-center">
                Copyright &copy; {new Date().getFullYear()} <span>Medical- All right reserved</span>
            </div>
        </footer>
    );
}

export default Footer;
