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
            The premier platform for showcasing musical talent and building professional artist portfolios.
          </p>
          <div className="welcome-description">
            <p>Create comprehensive musician profiles featuring high-quality audio portfolios, professional biographies, and seamless music discovery.</p>
            <p>Access your complete artist collection through an intuitive dashboard designed for both emerging and established musicians.</p>
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
