import React, { useState, useEffect } from 'react';
import './Slider.css';
const IntervalSlider = ({ images, interval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const sliderInterval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, interval);

        return () => clearInterval(sliderInterval);
    }, [images.length, interval]);

    return (
        <div className='slider'>
            <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />
        </div>
    );
};

export default IntervalSlider;
