import React, { useState } from 'react';
import axios from 'axios';
import './LoginPin.css';
import { serverIp } from '../Data/backend.js'


const PinModal = ({ onVerify, onClose, showCancel=true }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${serverIp}/verify-pin`, { pin });
      sessionStorage.setItem('pinRole', response.data.role);
      onVerify(response.data.role);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid PIN');
    }
  };

  return (
    <div className="pin-modal-overlay">
      <div className="pin-modal">
        <h3>Enter Access PIN</h3>
        <input 
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter PIN"
        />
        {error && <p className="error">{error}</p>}
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Verify</button>
          {showCancel && (<button onClick={onClose}>Cancel</button>)}
        </div>
      </div>
    </div>
  );
};

export default PinModal;