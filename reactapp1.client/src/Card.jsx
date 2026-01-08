import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import examplePicture from './assets/Dr.-Shpetim-Thaci.jpg';
import Dokrori1 from './assets/doktor1.jpeg';
import Dokrori2 from './assets/dokori5.jpg';
import Dokrori3 from './assets/dokori3.jpg';

const doctors = [
    {
        id: 1,
        name: "Dr. Shpetim Thaqi",
        title: "MD, PhD Specialist i Pulmologjise",
        image: examplePicture,
    },
    {
        id: 2,
        name: "Dr. Arben Bytyqi",
        title: "MD, Cardiologist",
        image: Dokrori1, 
    },
    {
        id: 3,
        name: "Dr. Liridon Gashi",
        title: "MD, Neurologist",
        image: Dokrori2, 
    },
    {
        id: 4,
        name: "Dr. Alban Kelmendi",
        title: "MD, Dermatologist",
        image: Dokrori3,
    },
   
];

function Card() {
    
    const [showAlert, setShowAlert] = useState(false);

    const handleButtonClick = () => {
        setShowAlert(!showAlert); 
    };

    return (
        <div className="container">
            <div className="row">
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="col-md-3 mb-4">
                        <div className="card">
                            <img className="card-img-top" src={doctor.image} alt={doctor.name} />
                            <div className="card-body">
                                <h5 className="card-title">{doctor.name}</h5>
                                <p className="card-text">{doctor.title}</p>

                                <Button variant="primary" onClick={handleButtonClick}>
                                    Click me
                                </Button>

                                {showAlert && (
                                    <Alert variant="info" className="mt-2">
                                        This is a button alert
                                    </Alert>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Card;
