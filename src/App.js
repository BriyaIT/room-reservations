import './App.css';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Sites from './Pages/Sites.js';
import Rooms from './Pages/Rooms.js';
import RoomCalendar from './Pages/RoomCalendar3.js';

import { useState, useEffect } from 'react';
import PinModal from './Components/PinModal.js';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem('pinRole');
    // console.log("Role from sessionStorage:", role);
    if (role) setUserRole(role);
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
  return <RoomCalendar building={campusId} roomNumber={roomId} userRole={userRole} setShowPinModal={setShowPinModal} setUserRole={setUserRole} />;
}

export default App;
