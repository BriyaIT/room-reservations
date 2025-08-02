// Room calendar with FullCalendar and Google Sheets backend

import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const API_URL = "https://script.google.com/macros/s/AKfycbz8yh_9EuloH8JXB7b1fh3YefFLXSO_DFF9o6eYt8dy7YaLcOafkB7kzydMZ1-nttSS/exec";

const RoomCalendar = ({ building, roomNumber }) => {
  const calendarRef = useRef(null);

  // Fetch and transform bookings
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}?building=${building}&room=${roomNumber}`);
      const bookings = await res.json();
      
      return bookings.map(booking => ({
        title: `${booking[4]} (${booking[5]})`, // Event + Username
        start: booking[2], // Start time
        end: booking[3]    // End time
      }));
    } catch (error) {
      console.error('Failed to fetch events:', error);
      return [];
    }
  };

  // Handle new booking
  const handleDateSelect = async (selectInfo) => {
    const title = prompt('Event name:');
    if (title) {
      const formData = new URLSearchParams();
      formData.append('room', roomNumber);
      formData.append('building', building);
      formData.append('start', selectInfo.startStr);
      formData.append('end', selectInfo.endStr);
      formData.append('event', title);
      formData.append('user', "Current User");
      
      try {
        await fetch(API_URL, {
          method: 'POST',
          body: formData
        });
        calendarRef.current.getApi().refetchEvents();
      } catch (error) {
        console.error("Booking failed:", error);
        alert('Booking failed!');
      }
    }
  };

  return (
    <div className="room-calendar">
      <h2>{building} - Room {roomNumber}</h2>
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        events={fetchEvents}
        select={handleDateSelect}
        height="auto"
      />
    </div>
  );
};

export default RoomCalendar;