// Room calendar with nodejs/mongodb backend

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import moment from 'moment';
import axios from 'axios';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './RoomCalendar.css';

import BackButton from '../Components/BackButton';
import campuses from '../Data/campuses';
import LoginButton from '../Components/LoginButton.js';
import PinModal from '../Components/PinModal.js';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const RoomCalendar = ({ building, roomNumber, userRole, setShowPinModal, setUserRole }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  // const [selectedSlot, setSelectedSlot] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    bookedBy: '',
    start: null,
    end: null
  });
  // Views
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('work_week');
  // Initial pin modal
  const [showInitialPinModal, setShowInitialPinModal] = useState(false);
  // Editing event
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [error, setError] = useState('');
  const [viewType, setViewType] = useState('calendar');

  


  // Fetch bookings from Mongodb
  const fetchBookings = useCallback(async () => {
    console.log("Fetching bookings for", building, roomNumber);
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/bookings', {
        params: {building, room: roomNumber}
      });

      const formattedEvents = response.data.map(booking => ({
        _id: booking._id,
        title: `${booking.title} (${booking.bookedBy})`,
        start: new Date(booking.start),
        end: new Date(booking.end),
        description: booking.description,
        originalTitle: booking.title,
        originalBookedBy: booking.bookedBy
      }));
    //   console.log(formattedEvents);
      setEvents(formattedEvents);

    } catch (error) {
      console.error('Error fetching bookings:', error);
      // alert('Error fetching bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [building, roomNumber]);

  // Add new booking (on clicking "Book Room" in modal)
    const addBooking = async () => {
      if (!newEvent.title || !newEvent.bookedBy) {
        alert('Please fill in all required fields');
        return;
      }

    const booking = {
      _id: Date.now().toString(),
      building,
      room: roomNumber,
      title: newEvent.title,
      description: newEvent.description,
      bookedBy: newEvent.bookedBy,
      start: newEvent.start.toISOString(),
      end: newEvent.end.toISOString(),
      originalTitle: newEvent.title,
      originalBookedBy: newEvent.bookedBy
    };


    try {
        await axios.post('http://localhost:5000/bookings', booking);
        setShowModal(false);
        // setSelectedSlot(null);
        fetchBookings(); // Refresh the calendar
    } catch (error) {
        setError(error.response?.data?.error || 'Booking failed');
    }
  };

  // Handle slot selection (when user clicks on empty time)
  const handleSelectSlot = (slotInfo) => {
    // setSelectedSlot(slotInfo);
    setNewEvent(
    {
      title: '',
      description: '',
      bookedBy: '',
      start: slotInfo.start,
      end: slotInfo.end
    }); // Set default start/end to selected slot
    setShowModal(true);
  };

  // New booking button click
  const handleNewBooking = () => {
    setNewEvent(
      {
        title: '',
        description: '',
        bookedBy: '',
        start: '',
        end: ''
      }
    );
    setShowModal(true);
  }

  const handleDateTimeChange = (field, value) => {
    setNewEvent(prev => ({
      ...prev,
      [field]: new Date(value)
    }));
  };

  // Test booking display
  // const testBooking = () => {
  //   const bookings = [{
  //     id: 12345,
  //     title: 'test title (test)',
  //     start: new Date(2025, 6, 30, 10, 0), // 10 AM on July 24, 2025
  //     end: new Date(2025, 6, 30, 11, 0), // 11 AM on July 24, 2025
  //     description: 'this is a test booking description',
  //     bookedBy: 'admin'
  //   },
  //   {
  //     id: 12346,
  //     title: 'test title 2 (test2)',
  //     start: new Date(2025, 6, 31, 8, 0), // 8 AM on July 23, 2025
  //     end: new Date(2025, 6, 31, 13, 0), // 1 PM on July 23, 2025
  //     description: 'this is a test booking description',
  //     bookedBy: 'admin'
  //   }];
  //   setEvents(bookings);
  // }

  // Campus name from ID for display
  const getCampusName = () => {
    const campus = campuses.find(c => c.id === building);
    return campus ? campus.name : building; // Fallback to ID if not found
  };

  // Handle event selection (when user clicks on existing booking)
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Edit event
  const handleEditEvent = (event) => {
    setNewEvent({
      title: event.originalTitle, // Use originalTitle
      bookedBy: event.originalBookedBy, // Use originalBookedBy
      description: event.description,
      start: event.start,
      end: event.end
    });
    setEditingEvent(event);
    setShowEventModal(false); // hide description
    setShowModal(true); // show editing modal
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:5000/bookings/${eventId}`);
        fetchBookings();
        setShowEventModal(false);
      } catch (error) {
        setError('Failed to delete event');
      }
    }
  };

  // Add after addBooking function
  const updateBooking = async () => {
    if (!newEvent.title || !newEvent.bookedBy) {
      setError('Please fill in all required fields');
      return;
    }

    const booking = {
      building,
      room: roomNumber,
      title: newEvent.title,
      description: newEvent.description,
      bookedBy: newEvent.bookedBy,
      start: newEvent.start.toISOString(),
      end: newEvent.end.toISOString()
    };

    try {
      await axios.put(`http://localhost:5000/bookings/${editingEvent._id}`, booking);
      setShowModal(false);
      setEditingEvent(null);
      fetchBookings(); // Refresh the calendar
    } catch (error) {
      setError(error.response?.data?.error || 'Update failed');
    }
  };

  // Drag and drop handler
  const handleEventDrop = async ({ event, start, end }) => {
    if (userRole !== 'admin') {
      return; // Admins only
    }

    // Optimistic update: Create a copy of the events and update the dropped event's time
    const updatedEvents = events.map(existingEvent =>
      existingEvent._id === event._id
        ? { ...existingEvent, start, end }
        : existingEvent
    );

    // Immediately update the local state to prevent flickering
    setEvents(updatedEvents);
    
    try {
      await axios.put(`http://localhost:5000/bookings/${event._id}`, {
        start: start.toISOString(),
        end: end.toISOString()
      });
      fetchBookings();
    } catch (error) {
      setError('Failed to update event');
    }
  };

  const handleEventResize = handleEventDrop;

  useEffect(() => {
    // Check if role is already in sesison storage
    const storedRole = sessionStorage.getItem('pinRole');
    if (!storedRole && !userRole) {
      setShowInitialPinModal(true);
    }
    // console.log("User role:", userRole);
    fetchBookings();
    // testBooking();
  }, [fetchBookings, userRole]);

  return (
    <div className="room-calendar">

      <BackButton to={`/rooms/${building}`} text="Rooms" />

      {/* Login Button */}
      <div className="login-container">
        <LoginButton 
          userRole={userRole} 
          onClick={() => setShowPinModal(true)} 
        />
      </div>

      <div className="calendar-header">
        <h2>{getCampusName()}  ▶  {roomNumber}</h2>
        
      </div>

      <div className="view-tabs-container">
        <div className="view-tabs">
          <button 
            className={viewType === 'calendar' ? 'active' : ''}
            onClick={() => setViewType('calendar')}
          >
            Calendar
          </button>
          <button 
            className={viewType === 'list' ? 'active' : ''}
            onClick={() => setViewType('list')}
          >
            List
          </button>
        </div>
      </div>      

      {/* ============ CALENDAR VIEW ================= */}
      {viewType === 'calendar' && (
        <div className="calendar-container">
          <div className="calendar-buttons">
            {/* New Booking Button */}
            <div className="new-booking-container">
              <button className="new-booking-btn" onClick={handleNewBooking}>
                New Booking
              </button>
            </div>
            {/* Refresh button */}
            <button className="refresh" onClick={fetchBookings} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* Drag and drop! */}
          <DnDCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            selected={selectedEvent} // manages selected state

            // Navigate views
            date={currentDate}
            view={currentView}
            onNavigate={date => setCurrentDate(date)}
            onView={view => setCurrentView(view)}

            views={['month', 'week', 'work_week', 'day']}
            defaultView="work_week"
            step={30}
            timeslots={2}
            min={new Date(2024, 0, 1, 7, 0)} // 7 AM
            max={new Date(2024, 0, 1, 22, 0)} // 10 PM

            // Drag and drop functionality
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            draggableAccessor={event => userRole === 'admin'}
            resizableAccessor={event => userRole === 'admin'}
          />
        </div>
      )}

      {/* Booking Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingEvent ? 'Edit Booking' : 'Book Room'} {roomNumber}</h3>
            
            <div className="time-group">
              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="datetime-local"
                  value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => handleDateTimeChange('start', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>End Time *</label>
                <input
                  type="datetime-local"
                  value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => handleDateTimeChange('end', e.target.value)}
                />
              </div>
            </div>
            
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

            {error && <p className="error">{error}</p>}

            <div className="modal-buttons">
              <button onClick={editingEvent ? updateBooking : addBooking}>
                {editingEvent ? 'Update Booking' : 'Book Room'}
              </button>
              <button onClick={() => {
                setSelectedEvent(null);
                setShowModal(false);
                setError('');
                setEditingEvent(null);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Event Details</h3>
            <p><strong>Title:</strong> {selectedEvent.originalTitle}</p>
            <p><strong>Booked By:</strong> {selectedEvent.originalBookedBy}</p>
            <p>
              <strong>Time:</strong> {moment(selectedEvent.start).format('MMM DD, YYYY h:mm A')} - 
              {moment(selectedEvent.end).format('h:mm A')}
            </p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            
            <div className="modal-buttons">
              {userRole === 'admin' && (
                <>
                  <button onClick={() => handleEditEvent(selectedEvent)}>Edit</button>
                  <button onClick={() => handleDeleteEvent(selectedEvent._id)}>Delete</button>
                </>
              )}
              <button onClick={() => {
                setShowEventModal(false)
                setSelectedEvent(null);
              }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Initial Pin Modal (first time opening calendar) */}
      {showInitialPinModal && (
        <PinModal 
          onVerify={(role) => {
            sessionStorage.setItem('pinRole', role);
            setUserRole(role);
            setShowInitialPinModal(false);
          }}
          onClose={() => setShowInitialPinModal(false)}
        />
      )}

      {/* ============ LIST VIEW ================= */}
      {viewType === 'list' && (
        <div className="list-view">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Booked By</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Description</th>
                {userRole === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.title.split(' (')[0]}</td>
                  <td>{event.title.split('(')[1].replace(')', '')}</td>
                  <td>{moment(event.start).format('MMM DD, YYYY h:mm A')}</td>
                  <td>{moment(event.end).format('h:mm A')}</td>
                  <td>{event.description}</td>
                  {userRole === 'admin' && (
                    <td className="actions">
                      <button onClick={() => handleEditEvent(event)}>Edit</button>
                      <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          {userRole === 'admin' && (
            <button className="download-btn">
              Download Events
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomCalendar;