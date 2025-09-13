import React from "react";
import imageAlias from "../../assets/background-image-two.jpg";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container" style={{ backgroundImage: `url(${imageAlias})` }}>
      <div className="content-overlay">
        <div className="welcome-content">
          <h1 id="welcome-text">
            Welcome to Medley
          </h1>
          <p className="welcome-subtitle">
            A place where you can upload your favorite musicians along with their music.
          </p>
          <div className="welcome-description">
            <p>Navigate to your profile page to upload your favorite musicians' mp3 and other audio files you would like to showcase.</p>
            <p>Easily access all of your musicians by navigating to your profile page and choosing your desired artist.</p>
          </div>
        </div>
      </div>
      <div className="scroll-down-indicator">
        <span className="arrow down"></span>
        <span className="arrow down"></span>
        <span className="arrow down"></span>
      </div>
    </div>
  );
};

export default LandingPage;
