// import React from 'react';
// import './AboutUs.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHeartbeat, faStethoscope, faBuilding } from '@fortawesome/free-solid-svg-icons';

// function AboutUs() {
//     return (
//         <div className="about-us">
//             <header className="about-header">
//                 <h1>Welcome to Our Medical Center</h1>
//                 <p>Committed to providing excellent healthcare and compassionate care for all patients.</p>
//             </header>

//             <section className="mission-vision">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-md-6">
//                             <h2>Our Mission</h2>
//                             <p>Our mission is to provide the highest quality healthcare services, ensuring our patients receive the care they deserve in a compassionate, patient-centered environment. We focus on delivering state-of-the-art medical treatments, prioritizing the well-being of every individual we serve.</p>
//                         </div>
//                         <div className="col-md-6">
//                             <h2>Our Vision</h2>
//                             <p>Our vision is to be recognized as a leader in medical excellence and innovation, trusted by our community for providing the best in healthcare. We aim to enhance patient outcomes and improve the quality of life for our patients through exceptional service and cutting-edge treatments.</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <section className="values">
//                 <div className="container">
//                     <h2>Our Values</h2>
//                     <div className="row">
//                         <div className="col-md-4 text-center">
//                             <FontAwesomeIcon icon={faHeartbeat} size="3x" />
//                             <h3>Compassion</h3>
//                             <p>We put our patients' needs first, ensuring that they are treated with kindness, respect, and empathy at every stage of their care.</p>
//                         </div>
//                         <div className="col-md-4 text-center">
//                             <FontAwesomeIcon icon={faStethoscope} size="3x" />
//                             <h3>Excellence</h3>
//                             <p>We aim for the highest standards of medical practice, constantly improving through education, research, and innovation.</p>
//                         </div>
//                         <div className="col-md-4 text-center">
//                             <FontAwesomeIcon icon={faBuilding} size="3x" />
//                             <h3>Integrity</h3>
//                             <p>We uphold the highest ethical standards, fostering trust, honesty, and transparency in everything we do.</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <section className="our-team">
//                 <div className="container">
//                     <h2>Meet Our Team</h2>
//                     <div className="team-image">
//                         <img src={'https://www.klinikagliozheni.com/wp-content/uploads/2021/04/stafi2-1-scaled.jpg'} alt="Our Team" className="img-fluid" />
//                     </div>
//                     <p>Our team of healthcare professionals includes skilled doctors, nurses, and specialists who work tirelessly to ensure our patients receive the best possible care. From general practitioners to specialized surgeons, our team is dedicated to improving patient health and well-being.</p>
//                 </div>
//             </section>

//             <section className="facilities">
//                 <div className="container">
//                     <h2>Our Facilities</h2>
//                     <div className="row">
//                         <div className="col-md-6">
//                             <p>We are equipped with state-of-the-art medical equipment and offer a wide range of healthcare services. Our hospital features advanced treatment rooms, comfortable patient accommodations, and a dedicated team ready to assist you every step of the way.</p>
//                         </div>
//                         <div className="col-md-6">
//                             <img src="https://media.istockphoto.com/id/181553727/photo/outpatient-surgery-center.jpg?s=612x612&w=0&k=20&c=TSOFoFo6VWkBLtmvTgcsngxYmn3I677ilQxhoAbzfnE=" alt="Our Hospital" className="img-fluid" />
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <footer className="footer">
//                 <div className="container text-center">
//                     <p>Contact us at info@medicalcenter.com | Phone: 123-456-7890</p>
//                     <p>&copy; {new Date().getFullYear()} Our Medical Center. All rights reserved.</p>
//                 </div>
//             </footer>
//         </div>
//     );
// }

// export default AboutUs;

import React from 'react';
import './AboutUs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat, faStethoscope, faBuilding } from '@fortawesome/free-solid-svg-icons';

function AboutUs() {
    return (
        <div className="about-us">

            <header className="about-header">
                <h1>Welcome to Our Medical Center</h1>
                <p>Compassionate care, modern medicine & trusted professionals.</p>
            </header>

            <section className="mission-vision">
                <div className="about-container">
                    <div className="info-card">
                        <h2>Our Mission</h2>
                        <p>
                            To deliver high-quality, patient-centered healthcare using modern medical practices,
                            advanced technology, and compassionate service.
                        </p>
                    </div>

                    <div className="info-card">
                        <h2>Our Vision</h2>
                        <p>
                            To become a trusted healthcare leader recognized for innovation, excellence,
                            and improved patient outcomes.
                        </p>
                    </div>
                </div>
            </section>

            <section className="values">
                <div className="container">
                    <h2 className="section-title">Our Core Values</h2>

                    <div className="values-grid">
                        <div className="value-card">
                            <FontAwesomeIcon icon={faHeartbeat} />
                            <h3>Compassion</h3>
                            <p>Every patient is treated with empathy, dignity, and respect.</p>
                        </div>

                        <div className="value-card">
                            <FontAwesomeIcon icon={faStethoscope} />
                            <h3>Excellence</h3>
                            <p>We strive for the highest medical and professional standards.</p>
                        </div>

                        <div className="value-card">
                            <FontAwesomeIcon icon={faBuilding} />
                            <h3>Integrity</h3>
                            <p>Honesty, ethics, and transparency guide everything we do.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="our-team">
                <div className="container">
                    <h2 className="section-title">Meet Our Team</h2>

                    <img
                        src="https://www.klinikagliozheni.com/wp-content/uploads/2021/04/stafi2-1-scaled.jpg"
                        alt="Our Team"
                    />

                    <p>
                        Our experienced doctors, nurses, and specialists work together to ensure
                        the highest quality of care for every patient.
                    </p>
                </div>
            </section>

            <section className="facilities">
                <div className="container facilities-grid">
                    <div>
                        <h2>Modern Facilities</h2>
                        <p>
                            Equipped with advanced medical technology, comfortable patient rooms,
                            and specialized treatment units for optimal care.
                        </p>
                    </div>

                    <img
                        src="https://media.istockphoto.com/id/181553727/photo/outpatient-surgery-center.jpg?s=612x612&w=0&k=20&c=TSOFoFo6VWkBLtmvTgcsngxYmn3I677ilQxhoAbzfnE="
                        alt="Hospital"
                    />
                </div>
            </section>

            <footer className="footer">
                <p>📧 info@medicalcenter.com | ☎️ 123-456-7890</p>
                <p>© {new Date().getFullYear()} Medical Center. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default AboutUs;
