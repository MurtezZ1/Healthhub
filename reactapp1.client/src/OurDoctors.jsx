import React from 'react';
import './OurDoctors.css';
import { Card, Button, Container, Row, Col, Badge } from 'react-bootstrap';

function OurDoctors() {
    const doctors = [
        {
            name: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            bio: "Dr. Sarah specializes in heart health, bringing 15+ years of experience.",
            image: "https://t3.ftcdn.net/jpg/03/13/77/82/360_F_313778250_Y0o5can6MA490Nt7G6p03Zfu5fKmWCIv.jpg",
        },
        {
            name: "Dr. James Smith",
            specialty: "Neurologist",
            bio: "Dr. James is an expert in diagnosing and treating neurological disorders with advanced techniques.",
            image: "https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdG9yfGVufDB8fDB8fHww",
        },
        {
            name: "Dr. Emily Davis",
            specialty: "Pediatrician",
            bio: "Dr. Emily provides compassionate care for children, focusing on their growth, development, and wellness.",
            image: "https://img.freepik.com/free-photo/medium-shot-doctor-posing-studio_23-2150275672.jpg",
        },
        {
            name: "Dr. Michael Brown",
            specialty: "Orthopedic Surgeon",
            bio: "Dr. Michael is a specialist in musculoskeletal health, offering surgical.",
            image: "https://www.aucmed.edu/sites/g/files/krcnkv361/files/styles/atge_3_2_crop_md/public/2021-11/large-Smile-Guy-web.jpg?h=6b55786a&itok=Wy7cQpYS",
        },
        {
            name: "Dr. Anna Lee",
            specialty: "Dermatologist",
            bio: "Dr. Anna treats a variety of skin conditions with personalized care and cutting-edge treatments.",
            image: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
        },
        {
            name: "Dr. Fred Schmidt",
            specialty: "Surgeon",
            bio: "Dr. Fred Schmidt is an experienced surgeon with over 20 years in treating severe injuries and internal surgeries.",
            image: "https://t4.ftcdn.net/jpg/03/20/52/31/360_F_320523164_tx7Rdd7I2XDTvvKfz2oRuRpKOPE5z0ni.jpg",
        },
    ];

    return (
        <>
            {/* Green top section */}
            <section className="green-top-section">
                <h1 style={{ fontSize:"3rem" }}>Meet Our Doctors</h1>
                <p>Our dedicated team of professionals is here to ensure you receive the best care possible.</p>
            </section>

            {/* Doctors list */}
            <section id="our-doctors" className="our-doctors-section py-5">
                <Container>
                    <Row>
                        {doctors.map((doctor, index) => (
                            <Col key={index} md={6} lg={4} className="mb-4">
                                <Card className="doctor-card h-100 text-center shadow">
                                    <div className="card-image-container">
                                        <Card.Img
                                            variant="top"
                                            src={doctor.image}
                                            alt={doctor.name}
                                            className="rounded-circle shadow-sm"
                                        />
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{doctor.name}</Card.Title>
                                        <Badge bg="info" className="mb-2">{doctor.specialty}</Badge>
                                        <Card.Text className="text-muted">{doctor.bio}</Card.Text>
                                    </Card.Body>
                                    <Card.Footer className="text-muted">Available for Consultations</Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </>
    );
}

export default OurDoctors;
