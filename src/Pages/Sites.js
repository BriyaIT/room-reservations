import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import campuses from '../Data/campuses';
import './Sites.css';
import LoginButton from '../Components/LoginButton.js';




const Sites = ({ userRole, setShowPinModal }) => {

  const [animations, setAnimations] = useState({
      logo: false,
      h1: false,
      h2: false,
      footer: false
    });

  const navigate = useNavigate();
  
  useEffect(() => {
      // Logo animation immediately
      setAnimations(prev => ({ ...prev, logo: true }));
  
      // H1 after 500ms
      const h1Timer = setTimeout(() => {
        setAnimations(prev => ({ ...prev, h1: true }));
      }, 250);
  
      // H2 after 1200ms
      const h2Timer = setTimeout(() => {
        setAnimations(prev => ({ ...prev, h2: true }));
      }, 600);
  
      return () => {
        clearTimeout(h1Timer);
        clearTimeout(h2Timer);
      };
  }, []);

  const navigateToRooms = (campusId) => {
    navigate(`/rooms/${campusId}`);
  };

  return (
    <div className="sites">
      {/* Header Section */}
      <Header 
      logoVisible={animations.logo}
      h1Visible={animations.h1}
      h2Visible={animations.h2}
      title="BRIYA Room Reservations"
      subtitle="Choose a Site"
    />

      {/* Login Button */}
      <div className="login-container">
        <LoginButton 
          userRole={userRole} 
          onClick={() => setShowPinModal(true)} 
        />
      </div>

      {/* Campus Selection Cards */}
      <main>
        <section className="image-card-container">
          {campuses.map((campus) => (
            <div 
              key={campus.id}
              className="image-card"
              onClick={() => navigateToRooms(campus.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigateToRooms(campus.id)}
            >
              <img src={campus.image} alt={campus.name} />
              <div className="caption">{campus.name}</div>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Sites;