// Download events for a single room

import moment from 'moment';

export const downloadEvents = (filteredEvents, building, room) => {
  // We will use the 'filteredEvents' array which is already in scope.
  if (!filteredEvents || filteredEvents.length === 0) {
    alert('No events to download.');
    return;
  }

  // Define the CSV header
  const headers = [
    "Building",
    "Room",
    "Title",
    "Booked By",
    "Original Title",
    "Original Booker",
    "Start Time",
    "End Time",
    "Description",
    "Recurring ID",
    "Created At",
    "Updated At"
  ];

  // Format the data for CSV
  const csvData = filteredEvents.map(event => {
    
    // Return a new array with the data in the correct order for the CSV
    return [
      `"${building}"`,
      `"${room}"`,
      `"${event.rawTitle.replace(/"/g, '""')}"`,
      `"${event.bookedBy.replace(/"/g, '""')}"`,
      `"${event.originalTitle.replace(/"/g, '""')}"`,
      `"${event.originalBookedBy.replace(/"/g, '""')}"`,
      `"${moment(event.start).format('YYYY-MM-DD HH:mm:ss')}"`,
      `"${moment(event.end).format('YYYY-MM-DD HH:mm:ss')}"`,
      `"${(event.description || '').replace(/"/g, '""')}"`,
      `"${event.recurringId || ''}"`,
      `"${moment(event.createdAt).format('YYYY-MM-DD HH:mm:ss')}"`,
      `"${moment(event.updatedAt).format('YYYY-MM-DD HH:mm:ss')}"`
    ];
  });

  // Combine headers and data, and join with newline characters
  const csvContent = [
    headers.join(','),
    ...csvData.map(e => e.join(','))
  ].join('\n');

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a temporary download link and trigger a click
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${building} - ${room}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};