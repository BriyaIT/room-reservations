// Google sheets apps script backend

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './RoomCalendar.css';

const localizer = momentLocalizer(moment);

const RoomCalendar = ({ building, roomNumber }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    bookedBy: ''
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('week');


  // Google Apps Script Web App URL - replace with your actual URL
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhot-eAvCG2WIFAJOA9ZsH1cn5HZTmNNHikCFxHpjhrQuFx5RvBwFn7QaCoSHzc4sJ/exec';

  useEffect(() => {
    // fetchBookings();
    testBooking();
  }, [building, roomNumber]);

  // Fetch bookings from Google Sheets
  const fetchBookings = async () => {
    console.log("Fetching bookings");
    try {
      setLoading(true);
      const response = await fetch(`${APPS_SCRIPT_URL}?action=getBookings&building=${encodeURIComponent(building)}&room=${encodeURIComponent(roomNumber)}`);
      const data = await response.json();
      
      if (data.success) {
        console.log("Bookings fetched successfully:", data.bookings);
        const formattedEvents = data.bookings.map(booking => ({
          id: booking.id,
          title: booking.title,
          start: new Date(booking.start),
          end: new Date(booking.end),
          resource: {
            description: booking.description,
            bookedBy: booking.bookedBy
          }
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add new booking
    const addBooking = async () => {
      if (!newEvent.title || !selectedSlot) {
        alert('Please fill in all required fields');
        return;
      }

      try {
        const booking = {
          building,
          roomNumber,
          title: newEvent.title,
          description: newEvent.description,
          bookedBy: newEvent.bookedBy,
          start: selectedSlot.start.toISOString(),
          end: selectedSlot.end.toISOString()
        };

      console.log(booking)

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addBooking',
          booking
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowModal(false);
        setNewEvent({ title: '', description: '', bookedBy: '' });
        setSelectedSlot(null);
        fetchBookings(); // Refresh the calendar
      } else {
        alert('Failed to add booking: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding booking:', error);
      alert('Failed to add booking. Please try again.');
    }
  };

  // Handle slot selection (when user clicks on empty time)
  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setShowModal(true);
  };

  // Handle event selection (when user clicks on existing booking)
  const handleSelectEvent = (event) => {
    const eventInfo = `
      Title: ${event.title}
      Time: ${moment(event.start).format('MMM DD, YYYY h:mm A')} - ${moment(event.end).format('h:mm A')}
      Booked by: ${event.resource.bookedBy}
      Description: ${event.resource.description}
    `;
    alert(eventInfo);
  };

  // Test booking display
  const testBooking = () => {
    const bookings = [{
      id: 12345,
      title: 'test title',
      start: new Date(2025, 6, 24, 10, 0), // 10 AM on July 24, 2025
      end: new Date(2025, 6, 24, 11, 0), // 11 AM on July 24, 2025
      resource: {
        description: 'this is a test booking description',
        bookedBy: 'admin'
      }
    },
    {
      id: 12346,
      title: 'test title 2',
      start: new Date(2025, 6, 23, 8, 0), // 8 AM on July 23, 2025
      end: new Date(2025, 6, 23, 13, 0), // 1 PM on July 23, 2025
      resource: {
        description: 'this is a test booking description',
        bookedBy: 'admin'
      }
    }];
    setEvents(bookings);
  }


  return (
    <div className="room-calendar">
      <div className="calendar-header">
        <h2>{building} - Room {roomNumber}</h2>
        <button onClick={fetchBookings} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable

          date={currentDate}
          view={currentView}
          onNavigate={date => setCurrentDate(date)}
          onView={view => setCurrentView(view)}

          views={['month', 'week', 'day']}
          defaultView="week"
          step={30}
          timeslots={2}
          min={new Date(2024, 0, 1, 7, 0)} // 7 AM
          max={new Date(2024, 0, 1, 22, 0)} // 10 PM
        />
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Book Room {roomNumber}</h3>
            <p>
              <strong>Time:</strong> {selectedSlot && moment(selectedSlot.start).format('MMM DD, YYYY h:mm A')} - {selectedSlot && moment(selectedSlot.end).format('h:mm A')}
            </p>
            
            <div className="form-group">
              <label>Event Title *</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="e.g., Team Meeting"
              />
            </div>

            <div className="form-group">
              <label>Booked By *</label>
              <input
                type="text"
                value={newEvent.bookedBy}
                onChange={(e) => setNewEvent({...newEvent, bookedBy: e.target.value})}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Optional description"
                rows="3"
              />
            </div>

            <div className="modal-buttons">
              <button onClick={addBooking}>Book Room</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCalendar;