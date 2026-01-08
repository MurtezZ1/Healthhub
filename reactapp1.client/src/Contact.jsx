import React, { useState } from 'react';
import './contact.css';

function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all fields');
            return;
        }
        // You can also add email validation logic here.
        console.log(formData); // Print the form data for now
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' }); // Clear the form
    };


    return (
        <div className="contact-us">
            <header className="contact-header">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you. Reach out to us anytime!</p>
            </header>

            <section className="contact-info">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h2>Get in Touch</h2>
                            <p>Have questions or concerns? Contact us through any of the methods below, and our team will assist you promptly.</p>
                            <ul>
                                <li><strong>Phone:</strong> +123-456-7890</li>
                                <li><strong>Email:</strong> info@medical-ks.com</li>
                                <li><strong>Address:</strong> 123 Medical Street, Healthy City, HC 56789</li>
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <h2>Visit Us</h2>
                            <p>Find us on the map below or schedule a visit to our office for a personalized consultation.</p>
                            <div className="map-placeholder">
                                <img
                                    src="https://media.istockphoto.com/id/181553727/photo/outpatient-surgery-center.jpg?s=612x612&w=0&k=20&c=TSOFoFo6VWkBLtmvTgcsngxYmn3I677ilQxhoAbzfnE="
                                    alt="Map location"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact-form">
                <div className="container">
                    <h2>Send Us a Message</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Your Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Your Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                placeholder="Write your message"
                                value={formData.message}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
                </div>
            </section>

            <footer className="contact-footer">
                <p>&copy; {new Date().getFullYear()} Medical Center. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Contact;
