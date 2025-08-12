import './App.css'; // Nothing here :)
import { HashRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import Sites from './Pages/Sites.js';
import Rooms from './Pages/Rooms.js';
import RoomCalendar from './Pages/RoomCalendar3.js';

import { useState, useEffect } from 'react';
import PinModal from './Components/PinModal.js';

import axios from 'axios';
import { serverIp } from './Data/backend.js';

import rooms from './Data/rooms';
import campuses from './Data/campuses';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);

  const reconcileUserEvents = async () => {
    const userEvents = JSON.parse(localStorage.getItem('userEvents')) || [];
  
    if (userEvents.length === 0) return;
  
    try {
      const res = await axios.post(`${serverIp}/bookings/exists`, { ids: userEvents });
  
      const existingIds = res.data;
  
      const updatedEvents = userEvents.filter(id => existingIds.includes(id));
      if (updatedEvents.length !== userEvents.length) {
        localStorage.setItem('userEvents', JSON.stringify(updatedEvents));
      }
    } catch (error) {
      console.error('Error reconciling user events:', error);
    }
  };

  useEffect(() => {
    const role = sessionStorage.getItem('pinRole');
    // console.log("Role from sessionStorage:", role);
    if (role) setUserRole(role);
    reconcileUserEvents();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Sites userRole={userRole} setShowPinModal={setShowPinModal} setUserRole={setUserRole} />
        } />
        <Route path="/rooms/:campusId" element={
          <Rooms userRole={userRole} setShowPinModal={setShowPinModal} setUserRole={setUserRole} />
        } />
        <Route path="/calendar/:campusId/:roomId" element={
          <RoomCalendarWrapper userRole={userRole} setShowPinModal={setShowPinModal} setUserRole={setUserRole} />
        } />
      </Routes>

      {showPinModal && (
        <PinModal
          onVerify={setUserRole}
          onClose={() => setShowPinModal(false)}
        />
      )}

    </Router>
  );
}

// New wrapper component to convert route params to props
function RoomCalendarWrapper({ userRole, setShowPinModal, setUserRole }) {
  const { campusId, roomId } = useParams();

  const campusExists = campuses.some(c => c.id === campusId);
  const roomExists = campusExists && rooms[campusId]?.some(
    r => r.name.toLowerCase() === decodeURIComponent(roomId).toLowerCase()
  );

  // Redirects home if url is modified
  if (!roomExists) {
    return <Navigate to="/" replace />;
  }

  return (

    <RoomCalendar
      building={campusId} 
      roomNumber={roomId} 
      userRole={userRole} 
      setShowPinModal={setShowPinModal}
      setUserRole={setUserRole}
    />
  );
}

export default App;
