import React from 'react';
import ChangeVideo from './video.module.css';
import VideoIntro from '../src/assets/backroom.mp4';
i

function VideoComponent() {
    return (
        <div className={ChangeVideo.vid}>
            <video src={VideoIntro} type="video/mp4" className={ChangeVideo.bg} autoPlay muted loop preload="auto"></video>
            <div className={ChangeVideo.content}>
                <h1>About Us</h1>
                <h2>Welcome to Medical</h2>
                <h3>Where we revolutionize hospital management with cutting-edge technology and a commitment to excellence.</h3>
            </div>
        </div>
    );
}

export default VideoComponent;