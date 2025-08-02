import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({ to = '/', text = "Button"}) => {
  const navigate = useNavigate();
  
  return (
    <button 
      className="floating-back-button"
      onClick={() => navigate(to)}
      aria-label="Back"
    >
      &larr; {text}
    </button>
  );
};

export default BackButton;