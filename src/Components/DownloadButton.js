import React from 'react';
import './DownloadButton.css'; // Import the new CSS file

const DownloadButton = ({ onClick, title }) => {
  // SVG path for a download arrow icon
  const downloadIconPath = "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z";

  return (
    <button
      className="site-download-btn"
      onClick={onClick}
      aria-label={title}
      title={title}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white" // Set fill to white to match button text color
        width="20"
        height="20"
      >
        <path d={downloadIconPath} />
      </svg>
      {/* <span>Download Events</span> Text for the button */}
    </button>
  );
};

export default DownloadButton;