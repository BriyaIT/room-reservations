import React from 'react';
import './Footer.css';

const Footer = ({ typingDone = false }) => {
  return (
    <footer className={`footer center ${typingDone ? 'typing-done' : ''}`}>
      <p>
        &copy; 2025 | Designed &amp; Engineered by the Briya IT Team | All Rights
        Reserved.
      </p>
    </footer>
  );
};

export default Footer;