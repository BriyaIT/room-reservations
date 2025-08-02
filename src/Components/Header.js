import React from 'react';
import './Header.css';
import briya_logo from '../Assets/briya_logo.png';

const Header = ({ logoVisible = true, h1Visible = true, h2Visible = true, title, subtitle }) => {
  return (
    <header className="main-header center">
      <img 
        src={briya_logo}
        alt="Briya Logo" 
        className={`logo ${logoVisible ? 'fade-in-drop' : ''} show-immediately`} 
      />
      <h1 className={h1Visible ? 'fade-in-drop' : ''}>{title}</h1>
      <h2 className={h2Visible ? 'fade-in-drop' : ''}>{subtitle}</h2>
    </header>
  );
};

export default Header;