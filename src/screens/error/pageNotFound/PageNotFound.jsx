import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../../assets/animations/error-blue.json';
import './PageNotFound.scss';

const PageNotFound = () => {
  return (
    <div className="unauthorized-container">
      <Lottie animationData={animationData} loop={true} className="unauthorized-animation" />
      <h1>Page Not Found</h1>
      <p>Oops! We couldn't find the page you were looking for.</p>
    </div>
  );
};

export default PageNotFound;
