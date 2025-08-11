// Download events for entire site

import axios from 'axios';
import moment from 'moment';
import { serverIp } from './backend.js'

export const downloadSiteEvents = async (building) => {
  const formattedEvents = await fetchBookingsForDownload(building);

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
    const csvData = formattedEvents.map(event => {
      
      // Return a new array with the data in the correct order for the CSV
      return [
        `"${building}"`,
        `"${event.room}"`,
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
    link.setAttribute("download", `${building}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// API call
const fetchBookingsForDownload = async (building) => {
  try {
    console.log(building)
    const response = await axios.get(`${serverIp}/siteBookings`, {
      params: {building}
    });

    const formattedEvents = response.data.map(booking => ({
      _id: booking._id,
      room: booking.room,
      rawTitle: booking.title,
      start: new Date(booking.start),
      end: new Date(booking.end),
      description: booking.description,
      originalTitle: booking.originalTitle,
      originalBookedBy: booking.originalBookedBy,
      bookedBy: booking.bookedBy,
      recurringId: booking.recurringId || null,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    console.log(formattedEvents)
    return formattedEvents;
  } catch (error) {
    console.error('Error fetching site bookings:', error);
  }};