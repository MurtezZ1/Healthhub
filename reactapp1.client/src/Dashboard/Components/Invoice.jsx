import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import emailjs from "emailjs-com"; // Import EmailJS
import EmailSender from "./EmailSender";


const Invoice = () => {
    const [patients, setPatients] = useState([]);
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [recipientEmail, setRecipientEmail] = useState(""); // New state for email input
    const [emailSent, setEmailSent] = useState(false); // State to track email status


    // Fetch all patients on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            fetchPatients();
        }
    }, [navigate]);

    // Fetch patients
    const fetchPatients = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("https://localhost:7107/api/Pacienti", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
            alert("Failed to fetch patients. Please try again later.");
        }
    };

    // Fetch invoice for a specific patient using patientId
    const fetchInvoice = async (patientId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`https://localhost:7107/api/Invoice/${patientId}/Invoice`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data) {
                setInvoiceDetails(response.data);
                setShowModal(true);
            } else {
                alert("No invoice data found for this patient.");
            }
        } catch (error) {
            console.error("Error fetching invoice:", error);
            alert("Failed to fetch invoice. Please try again.");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setInvoiceDetails(null);
        setRecipientEmail(""); // Reset email input
        setEmailSent(false); // Reset email sent status
    };

    // Format date (removed from helpers, added here)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
    };

    // Format currency (added here)
    const formatCurrency = (value) => {
        return ` ${value.toFixed(2)}`;
    };

    const generateInvoicePdf = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Invoice", 14, 20);

        doc.setFontSize(10);
        doc.text(`Date: ${formatDate(invoiceDetails.date)}`, 170, 30);
        doc.text(`Due Date: ${formatDate(invoiceDetails.dueDate)}`, 170, 40);

        doc.text("From:", 14, 50);
        doc.text("Medical Clinic", 14, 60);
        doc.text("medicalclinic@gmail.com", 14, 70);
        doc.text("+ (49) 000-900", 14, 80);

        doc.text("To:", 160, 50);
        doc.text(`${invoiceDetails.patient.name} ${invoiceDetails.patient.surname}`, 160, 60);
        doc.text(`${formatDate(invoiceDetails.patient.ditelindja)}`, 160, 70);

        // Soft box for Historik (Medical History)
        const historikuStartY = 90;
        const historikuWidth = 180;
        const historikuHeight = invoiceDetails.historiku.length * 20 + 20; // Adjust height based on number of entries

        // Set soft background color and light border color
        doc.setFillColor(240, 240, 240); // Light gray background color
        doc.setDrawColor(200, 200, 200); // Light gray border color
        doc.setLineWidth(0.5);

        // Draw the rectangle (soft box)
        doc.rect(14, historikuStartY - 5, historikuWidth, historikuHeight, 'FD'); // 'FD' means Fill and Draw

        doc.setFontSize(12);
        doc.text("Medical History:", 14, historikuStartY);

        invoiceDetails.historiku.forEach((entry, index) => {
            const entryY = historikuStartY + 10 + (index * 20); // Space between entries
            doc.text(`Diagnosis: ${entry.diagnoza}`, 16, entryY + 5);
            doc.text(`Outcome: ${entry.perfundimi}`, 16, entryY + 10);
        });

        // Add services (Sherbimet) next
        const finalYAfterHistory = historikuStartY + historikuHeight + 10;
        doc.text("Services:", 14, finalYAfterHistory);
        autoTable(doc, {
            head: [['Item', 'Price ', 'Quantity', 'Amount ']],
            body: invoiceDetails.records.map((service) => [
                service.emri_Sherbimit,
                service.cmimi,
                service.quantity,
                service.cmimi * service.quantity,
            ]),
            startY: finalYAfterHistory + 10,
            styles: { fontSize: 10 },
        });
        const finalY = doc.lastAutoTable.finalY + 10;

        // Add price details at the end
        doc.text(`Subtotal: ${formatCurrency(invoiceDetails.subTotal)}Euro`, 14, finalY);
        doc.text(`Discount: ${formatCurrency(invoiceDetails.discount)}Euro`, 14, finalY + 10);
        doc.text(`Tax: ${formatCurrency(invoiceDetails.tax)}Euro`, 14, finalY + 20);
        doc.text(`Total: ${formatCurrency(invoiceDetails.grandTotal)}Euro`, 14, finalY + 30);

        doc.text("----------------------------------------------------", 14, finalY + 40);
        doc.text("Notes:", 14, finalY + 50);
        doc.text("Thank you for the visit. Stay healthy!", 14, finalY + 60);

        // Save the PDF
        doc.save(`Invoice_${invoiceDetails.patient.name}_${invoiceDetails.patient.surname}.pdf`);
    };

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleSendEmail = async (recipientEmail, invoiceDetails) => {
        // Extract diagnosis and conclusion from historiku or records
        const diagnoza = invoiceDetails.historiku[0]?.diagnoza || "N/A";
        const perfundimi = invoiceDetails.historiku.length > 0 && invoiceDetails.historiku[0].perfundimi ? invoiceDetails.historiku[0].perfundimi : "N/A";



        // Format the invoice content
        const invoiceContent = `
    <h2>Invoice for ${invoiceDetails.patient.name} ${invoiceDetails.patient.surname}</h2>
    <p><strong>Date:</strong> ${formatDate(invoiceDetails.date)}</p>
    <p><strong>Due Date:</strong> ${formatDate(invoiceDetails.dueDate)}</p>
    <p><strong>Subtotal:</strong> ${formatCurrency(invoiceDetails.subTotal)} Euro</p>
    <p><strong>Discount:</strong> ${formatCurrency(invoiceDetails.discount)} Euro</p>
    <p><strong>Tax:</strong> ${formatCurrency(invoiceDetails.tax)} Euro</p>
    <p><strong>Total:</strong> ${formatCurrency(invoiceDetails.grandTotal)} Euro</p>
    `;
       

        const emailParams = {
            patient_name: `${invoiceDetails.patient.name} ${invoiceDetails.patient.surname}`,
            invoice_date: formatDate(invoiceDetails.date),
            due_date: formatDate(invoiceDetails.dueDate),
            diagnoza: diagnoza,  // Correctly access diagnosis
            perfundimi: perfundimi,  // Correctly access conclusion
            subtotal: formatCurrency(invoiceDetails.subTotal),
            discount: formatCurrency(invoiceDetails.discount),
            tax: formatCurrency(invoiceDetails.tax),
            total: formatCurrency(invoiceDetails.grandTotal),
            to_email: recipientEmail,  // Add the recipient email here
        };
        // Send the email using EmailJS
        emailjs
            .send(
                "service_2uowrla",  // Replace with your EmailJS service ID
                "template_hycb7y5",  // Replace with your EmailJS template ID
                emailParams,         // Ensure `emailParams` includes the correct recipient email
                "TwUwWzu0RatBeHGx1"  // Replace with your EmailJS public key
            )
            .then(() => {
                setEmailSent(true);
                toast.success("Email sent successfully!");
                console.log("Email sent successfully!");
            })
            .catch((error) => {
                if (!(validateEmail(recipientEmail))) {
                    alert("Please provide a valid email", error);
                }
               

            });


        console.log(invoiceDetails); // Log the full details to see the structure




    };




    const sendInvoiceEmail = (email, invoiceDetails, invoiceUrl) => {
        emailjs
            .send(
                "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
                "service_2uowrla", // Replace with your EmailJS template ID
                {
                    patient_name: invoiceDetails.patientName,  // Variable for patient's name
                    invoice_date: invoiceDetails.invoiceDate,  // Variable for invoice date
                    due_date: invoiceDetails.dueDate,          // Variable for due date
                    diagnoza: invoiceDetails.diagnosis,        // Variable for diagnosis
                    perfundimi: invoiceDetails.conclusion,     // Variable for conclusion
                    subtotal: invoiceDetails.subtotal,         // Variable for subtotal
                    discount: invoiceDetails.discount,         // Variable for discount
                    tax: invoiceDetails.tax,                   // Variable for tax
                    total: invoiceDetails.total,               // Variable for total
                    invoice_url: invoiceUrl,                   // Link to invoice attachment
                    to_email: email,                           // Recipient's email address
                },
                "TwUwWzu0RatBeHGx1" // Replace with your EmailJS public key
            )
            .then((response) => {
                console.log("Email sent successfully:", response);
            })
            .catch((error) => {
                console.error("Failed to send email:", error);
            });
    };


    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f6f7" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: "20px" }}>
                <Container>
                    <Row className="mt-4">
                        <Col xs={12}>
                            <h3>Patients List</h3>
                            {patients.length === 0 ? (
                                <p>No patients found. Please ensure the backend is working properly.</p>
                            ) : (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Surname</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.map((patient) => (
                                            <tr key={patient.id}>
                                                <td>{patient.name}</td>
                                                <td>{patient.surname}</td>
                                                <td>
                                                    <Button variant="info" onClick={() => fetchInvoice(patient.id)}>
                                                        View Invoice
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </Col>
                    </Row>

                    {/* Modal for displaying invoice */}
                    {/* Modal for displaying invoice */}
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Invoice for {invoiceDetails?.patient?.name || "N/A"} {invoiceDetails?.patient?.surname || "N/A"}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {invoiceDetails ? (
                                <>
                                    <p><strong>Patient Name:</strong> {invoiceDetails.patient.name}</p>
                                    <p><strong>Date:</strong> {formatDate(invoiceDetails.date)}</p>

                                    {/* Email Input */}
                                    <h5>Send Invoice via Email</h5>
                                    <input
                                        type="email"
                                        placeholder="Enter recipient's email"
                                        value={recipientEmail}
                                        onChange={(e) => setRecipientEmail(e.target.value)}
                                        className="form-control mb-3"
                                    />
                                    <Button
                                        variant="success"
                                        onClick={() => handleSendEmail(recipientEmail, invoiceDetails)}
                                        disabled={!recipientEmail}
                                    >
                                        Send via Email
                                    </Button> <br></br><br></br>
                                    
                                    {/* Show EmailSender component if email is sent */}
                                    {emailSent && <EmailSender />}
                                </>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={generateInvoicePdf}>
                                Download
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </div>
        </div>
    );
};

export default Invoice;
