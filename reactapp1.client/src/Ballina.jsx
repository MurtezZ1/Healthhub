/*import React from 'react';*/
import Button from 'react-bootstrap/Button';
import image1 from './assets/Ballina.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';
import HealthyLifeImage from './assets/HealthyLifeImage.png';
import Tips1 from './assets/Tips1.png';
import Meals from './assets/Meals.png';
import Ending from './assets/Ending.png';
function Ballina() {
    return (  
        <>
            <Image src={image1} fluid style={{ width: '100%', margin: '-1px' }} ></Image>
            <Image src={HealthyLifeImage}  ></Image>
            <Image src={Tips1} style={{ marginLeft: '7rem' }} ></Image>
            <Image src={Meals} style={{ width: '95rem' }}  ></Image>
            <Image src={Ending}  ></Image>


        </>
    );

}
export default Ballina;
