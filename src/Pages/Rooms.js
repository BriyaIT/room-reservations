import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import BackButton from '../Components/BackButton';
import campuses from '../Data/campuses';
import rooms from '../Data/rooms';
// import './Rooms.css';
import LoginButton from '../Components/LoginButton.js';
import {downloadSiteEvents} from '../Data/downloadSiteEvents.js';
import DownloadButton from '../Components/DownloadButton';

const Rooms = ({ userRole, setShowPinModal }) => {
  const { campusId } = useParams();
  const navigate = useNavigate();
  
  // Find the campus
  const campus = campuses.find(c => c.id === campusId);
  
  // Get rooms for this campus
  const campusRooms = rooms[campusId] || [];
  
  const navigateToCalendar = (campusId, roomName) => {
    // Create a URL-friendly room ID
    // const roomId = roomName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/calendar/${campusId}/${roomName}`);
  };

  return (
    <div className="rooms-page">
      <BackButton to="/" text="Sites"/>
      
      {/* Download site events */}
      {userRole === 'admin' && (
        <DownloadButton
          title="Download all events for this site"
          onClick={() => downloadSiteEvents(campusId)}
        />
      )}

      <Header 
        title="BRIYA Room Reservations"
        subtitle={`${campus?.name || 'Campus'} Rooms`}
        showImmediately={true}
      />


      {/* Login Button */}
      <div className="login-container">
        <LoginButton 
          userRole={userRole} 
          onClick={() => setShowPinModal(true)} 
        />
      </div>
      
      <main>
        <section className="image-card-container">
          {campusRooms.length === 0 ? (
            <p className="no-rooms">No rooms found for this campus.</p>
          ) : (
            campusRooms.map((room, index) => (
              <div
                key={index}
                className="image-card"
                onClick={() => navigateToCalendar(campusId, room.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigateToCalendar(campusId, room.name)}
              >
                <img src={room.image} alt={room.name} />
                <div className="caption">{room.name}</div>
              </div>
            ))
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Rooms;