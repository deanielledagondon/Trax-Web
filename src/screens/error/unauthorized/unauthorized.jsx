import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../../assets/animations/error-triangle.json';
import './unauthorized.scss';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <Lottie animationData={animationData} loop={true} className="unauthorized-animation" />
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
};

export default Unauthorized;
