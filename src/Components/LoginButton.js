import React from 'react';
import './LoginPin.css';

// const LoginButton = ({ userRole, onClick }) => {
//   return (
//     <button className="login-btn" onClick={onClick}>
//       {userRole ? `Logged in as ${userRole}` : 'Staff Login'}
//     </button>
//   );
// };

const LoginButton = ({ userRole, onClick }) => {
  // Choose icon color based on role
  const iconColor = userRole === 'admin' ? '#FFD700' : 
                   userRole ? '#888' : '#3498db';
                   
  return (
    <button 
      className="login-btn" 
      onClick={onClick}
      aria-label={userRole ? `Logged in as ${userRole}` : 'Staff Login'}
      title={userRole ? `Logged in as ${userRole}` : 'Staff Login'}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={iconColor}
        width="24" 
        height="24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </button>
  );
};

export default LoginButton;