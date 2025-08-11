import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import './Footer.css';

const Footer = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        '&copy; 2025 | Designed &amp; Engineered by the Briya IT Team | All Rights Reserved.',
      ],
      typeSpeed: 50, // Typing speed in milliseconds
      showCursor: true, // Show the blinking cursor
      cursorChar: '|',
      loop: false, // Don't loop the animation
    });

    // Cleanup function to destroy the Typed.js instance when the component unmounts
    return () => {
      typed.destroy();
    };
  }, []); // The empty dependency array ensures this runs once on mount

  return (
    <footer className="footer center">
      <p>
        <span ref={el} />
      </p>
    </footer>
  );
};

export default Footer;