import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../../assets/animations/no-wifi.json';
import './noWifi.scss';

const NoWifi = () => {
  return (
    <div className="unauthorized-container">
      <Lottie animationData={animationData} loop={true} className="unauthorized-animation" />
      <h1>No Internet Connection</h1>
      <p>Something went wrong. Try refreshing the page or checking your internet connection.</p>
    </div>
  );
};

export default NoWifi;
