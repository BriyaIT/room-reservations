// Room calendar with nodejs/mongodb backend

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

import { saveEventId, isMyEvent, removeEventId } from '../Data/localStorage.js';
import { downloadEvents } from '../Data/downloadEvents.js';
import { serverIp } from '../Data/backend.js'

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

// Detect if touch device to disable DnD
const isTouchOnlyDevice = (() => {
  if (typeof window === 'undefined') return false;

  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Rough desktop OS detection
  const isDesktopOS = /Windows NT|Macintosh|Linux x86_64/.test(navigator.userAgent);

  // If it’s desktop OS → treat as having mouse/keyboard, not touch-only
  if (isDesktopOS) return false;

  // Otherwise, if it has touch, assume touch-only
  return hasTouch;
})();

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
  // Mutable reference that doesn't trigger re-render for input typing
  const titleRef = useRef();
  const bookedByRef = useRef();
  const descriptionRef = useRef();
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

  // View type (calendar or list)
  const [viewType, setViewType] = useState('calendar');

  // New state variables for recurring bookings
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState([]);
  const [recurringEndDate, setRecurringEndDate] = useState(null);

  // Recurring delete modal
  const [showRecurringDeleteModal, setShowRecurringDeleteModal] = useState(false);
  const [selectedDeletionType, setSelectedDeletionType] = useState('this'); // New state for radio selection

  // List view filters
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showMyEventsOnly, setShowMyEventsOnly] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [inputSearch, setInputSearch] = useState(''); // For debounce

  // Dragging fix
  const [isDragging, setIsDragging] = useState(false);


  // =================== CALENDAR FUNCTIONS ==============================

  // Fetch bookings from Mongodb
  const fetchBookings = useCallback(async () => {
    // If you wanna lose all your events
    // localStorage.removeItem('userEvents')
    console.log("Fetching bookings for", building, roomNumber);
    try {
      setLoading(true);
      const response = await axios.get(`${serverIp}/bookings`, {
        params: {building, room: roomNumber}
      });

      const formattedEvents = response.data.map(booking => ({
        _id: booking._id,
        title: `${booking.title} (${booking.bookedBy})`,
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
    //   console.log(formattedEvents);
      setEvents(formattedEvents);

    } catch (error) {
      console.error('Error fetching bookings:', error);
      // alert('Error fetching bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [building, roomNumber]);

  // Add new bookings (on clicking "Book Room" in modal)
  const addBooking = async (title, bookedBy, description) => {
    // Only takes title, bookedBy, description inputs, others are passed through newEvent
    setError('');

    if (!title || !bookedBy) {
      setError('Please fill in all required fields');
      return;
    }

    const startMoment = moment(newEvent.start);
    const endTime = moment(newEvent.end);

    if (endTime.isBefore(startMoment)) {
      setError('End time cannot be before start time');
      return
    }

    if (isRecurring) {
      if (recurringDays.length === 0) {
        setError('Please select at least one day for recurring events');
        return;
      }
      if (!recurringEndDate) {
        setError('Please select an end date');
        return
      }

      const endMoment = moment(recurringEndDate);

      // Validate that recurringEndDate is not before event start date
      if (endMoment.isBefore(startMoment, 'day')) {
        setError('End date cannot be before start date');
        return;
      }

      // Validate that recurringEndDate is not more than 1 year from newEvent.start
      const maxEndDate = startMoment.clone().add(1, 'year'); // Use clone to avoid modifying original
      if (endMoment.isAfter(maxEndDate, 'day')) { // Check if endMoment is after maxEndDate (day-wise)
        setError('End date cannot be more than 1 year from the start date');
        return;
      }
    }

    const bookingsToAdd = [];
    const recurringId = isRecurring ? Date.now().toString() : null;

    if (isRecurring) {
      let currentDate = moment(newEvent.start);
      const endMoment = moment(recurringEndDate);
      const duration = moment.duration(moment(newEvent.end).diff(moment(newEvent.start)));

      while (currentDate.isSameOrBefore(endMoment, 'day')) {
        if (recurringDays.includes(currentDate.day())) { // `day()` returns 0 for Sunday, 1 for Monday, etc.
          bookingsToAdd.push({
            _id: Date.now().toString() + Math.random(), // Unique ID for each event
            building,
            room: roomNumber,
            title: title,
            description: description,
            bookedBy: bookedBy,
            start: currentDate.toDate().toISOString(),
            end: currentDate.add(duration).toDate().toISOString(),
            recurringId: recurringId,
            originalTitle: title, // Only sets original on first add
            originalBookedBy: bookedBy
          });
          currentDate = moment(currentDate).subtract(duration); // Subtract duration to not compound time
        }
        currentDate = currentDate.add(1, 'day');
      }
    } else {
      // Single booking
      bookingsToAdd.push({
        _id: Date.now().toString(),
        building,
        room: roomNumber,
        title: title,
        description: description,
        bookedBy: bookedBy,
        start: newEvent.start.toISOString(),
        end: newEvent.end.toISOString(),
        recurringId: null,
        originalTitle: title,
        originalBookedBy: bookedBy
      });
    }

    try {
        const response = await axios.post(`${serverIp}/bookings`, bookingsToAdd);
        
        // Add booked event id to local storage
        if (response.data && response.data.length > 0) {
          response.data.forEach(bookedEvent => {
            if (bookedEvent._id) { // Probably don't need this if
              saveEventId(bookedEvent._id);
            }
          })
        }
        
        setShowModal(false);
        localStorage.setItem('currentName', bookedBy);
        setIsRecurring(false);
        setRecurringDays([]);
        setRecurringEndDate(null);
        // setSelectedSlot(null);
        fetchBookings(); // Refresh the calendar
    } catch (error) {
        setError(error.response?.data?.error || 'Booking failed');
    }
  };

  // Handle slot selection (when user clicks on empty time)
  const handleSelectSlot = (slotInfo) => {
    // console.log(isTouchOnlyDevice)
    // setSelectedSlot(slotInfo);
    // console.log(isDragging)
    setNewEvent(
    {
      title: '',
      description: '',
      bookedBy: '',
      start: slotInfo.start,
      end: slotInfo.end
    }); // Set default start/end to selected slot
    setIsRecurring(false);
    setRecurringDays([moment(slotInfo.start).day()]);
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
    setIsRecurring(false);
    setRecurringDays([]);
    setShowModal(true);
  }

  // Old changing datetime in booking modal
  // const handleDateTimeChange = (field, value) => {
  //   setNewEvent(prev => ({
  //     ...prev,
  //     [field]: new Date(value)
  //   }));
  // };

  // For separate date and time
  // const handleSplitDateTimeChange = (field, datePart, timePart) => {
  //   setNewEvent(prev => {
  //     let current = prev[field] ? new Date(prev[field]) : new Date();
  
  //     if (datePart) {
  //       const [year, month, day] = datePart.split('-').map(Number);
  //       current.setFullYear(year, month - 1, day);
  //     }
  
  //     if (timePart) {
  //       const [hour, minute] = timePart.split(':').map(Number);
  //       current.setHours(hour, minute);
  //     }
  
  //     return {
  //       ...prev,
  //       [field]: current
  //     };
  //   });
  // };

  // Update datetime from date and time
  const handleSplitDateTimeChange = (field, datePart, timePart) => {
    setNewEvent(prev => {
      let current = prev[field] ? new Date(prev[field]) : new Date();
  
      if (datePart) {
        const [year, month, day] = datePart.split('-').map(Number);
        current.setFullYear(year, month - 1, day);
      }
  
      if (timePart) {
        const [hour, minute] = timePart.split(':').map(Number);
        current.setHours(hour, minute);
      }
  
      const updatedEvent = { ...prev, [field]: current };
  
      // If start time changes and it's after the end time → auto-adjust end
      if (field === 'start') {
        const endDate = new Date(updatedEvent.end);
        if (!updatedEvent.end || current >= endDate) {
          updatedEvent.end = new Date(current.getTime() + 30 * 60000); // +30 mins
        }
      }
  
      return updatedEvent;
    });
  };

  // 30 minute increment dropdown
  // const generateTimeOptions = () => {
  //   const options = [];
  //   for (let h = 0; h < 24; h++) {
  //     for (let m of [0, 30]) {
  //       options.push(
  //         <option key={`${h}:${m}`} value={moment({ hour: h, minute: m }).format('HH:mm')}>
  //           {moment({ hour: h, minute: m }).format('h:mm A')}
  //         </option>
  //       );
  //     }
  //   }
  //   return options;
  // };

  const generateTimeOptions = (minMoment = null) => {
    const options = [];
    const minMinutes = minMoment
      ? minMoment.hours() * 60 + minMoment.minutes()
      : 0;
  
    for (let h = 0; h < 24; h++) {
      for (let m of [0, 30]) {
        const totalMinutes = h * 60 + m;
        if (totalMinutes >= minMinutes) {
          options.push(
            <option
              key={`${h}:${m}`}
              value={moment({ hour: h, minute: m }).format('HH:mm')}
            >
              {moment({ hour: h, minute: m }).format('h:mm A')}
            </option>
          );
        }
      }
    }
    return options;
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
    // console.log(event);
    setSelectedEvent(event);
    setShowEventModal(true);
    setIsDragging(false)
    // setIsRecurring(event.recurringId !== null); // unnecessary now
    setRecurringDays([]);
  };

  // Opens editing modal (modified booking modal) for existing event (when user clicks edit)
  const handleEditEvent = (event) => {
    setNewEvent({
      title: event.rawTitle,
      bookedBy: event.bookedBy,
      description: event.description,
      start: event.start,
      end: event.end
    });
    setEditingEvent(event);
    setIsRecurring(false); // Editing existing event does not display recurring options
    setShowEventModal(false); // hide description
    setShowModal(true); // show editing modal
  };

  // Delete event (single and recurring, when user clicks delete)
  const handleDeleteEvent = async (event, deletionType) => {
    // If a deletionType is provided, it's a recurring event action.
    if (deletionType) {
        try {
            const response = await axios.delete(`${serverIp}/bookings/recurring/${event.recurringId}`, {
                params: {
                    deletionType,
                    eventId: event._id
                }
            });

            const deletedIds = response.data.deletedIds;
            if (deletedIds) {
              deletedIds.forEach(id => removeEventId(id));
            }

            setShowRecurringDeleteModal(false);
            fetchBookings();
            setShowEventModal(false);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to delete recurring event(s)');
        }
    } else {
      try {
        await axios.delete(`${serverIp}/bookings/${event._id}`);
        removeEventId(event._id);
        fetchBookings();
        setShowRecurringDeleteModal(false);
      } catch (error) {
        setError('Failed to delete event');
      }
    }
  };

  // Update event (put)
  const updateBooking = async (title, bookedBy, description) => {
    // Only takes title, bookedBy, description inputs, others are passed through newEvent
    if (!title || !bookedBy) {
      setError('Please fill in all required fields');
      return;
    }

    const startMoment = moment(newEvent.start);
    const endTime = moment(newEvent.end);

    if (endTime.isBefore(startMoment)) {
      setError('End time cannot be before start time');
      return
    }

    const booking = {
      building,
      room: roomNumber,
      title: title,
      description: description,
      bookedBy: bookedBy,
      start: newEvent.start.toISOString(),
      end: newEvent.end.toISOString()
    };

    try {
      await axios.put(`${serverIp}/bookings/${editingEvent._id}`, booking);
      setShowModal(false);
      localStorage.setItem('currentName', bookedBy);
      setEditingEvent(null);
      fetchBookings(); // Refresh the calendar
    } catch (error) {
      setError(error.response?.data?.error || 'Update failed');
    }
  };

  // Drag and drop handler
  const handleEventDrop = async ({ event, start, end }) => {
    setIsDragging(false)
    if (userRole !== 'admin' && !isMyEvent(event._id)) {
      return; // Block non-admin users from editing others' events
    }

    const originalEvents = [...events]; // Store original events in case of failure

    // Optimistic update: Create a copy of the events and update the dropped event's time
    const updatedEvents = events.map(existingEvent =>
      existingEvent._id === event._id
        ? { ...existingEvent, start, end }
        : existingEvent
    );
    // Immediately update the local state to prevent flickering
    setEvents(updatedEvents);

    try {
      await axios.put(`${serverIp}/bookings/${event._id}`, {
        start: start.toISOString(),
        end: end.toISOString()
      });
      fetchBookings();
    } catch (error) {
      setEvents(originalEvents);
      // Uncomment if I want to make error popup
      // setError('Failed to update event');
    }
  };

  const handleEventResize = handleEventDrop;

  // Event styling for user owned/not owned
  const eventPropGetter = (event) => {
    const isMyBooking = isMyEvent(event._id);
    return {
      className: isMyBooking? 'my-event' : 'other-user-event'
    };
  };

  // =================== List view filtering logic =========================
  let filteredEvents = events;

  // 1. Filter by current time (default behavior)
  if (!showAllEvents) {
    const now = moment();
    filteredEvents = filteredEvents.filter(event => moment(event.end).isAfter(now));
  }

  // 2. Filter by "my events"
  if (showMyEventsOnly) {
    filteredEvents = filteredEvents.filter(event => isMyEvent(event._id));
  }

  // 3. Filter by user search
  if (userSearch) {
    const searchTerm = userSearch.toLowerCase();
    filteredEvents = filteredEvents.filter(event =>
      (event.bookedBy || "").toLowerCase().includes(searchTerm)
    );
  }

  // 4. Sort the final filtered list
  filteredEvents.sort((a, b) => moment(a.start).diff(moment(b.start)));

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setUserSearch(inputSearch);
    }, 0); // change for debounce time if lag
  
    return () => {
      clearTimeout(handler);
    };
  }, [inputSearch]);
  
  // =========================================================

  // Fetch and show pin modal on mount
  useEffect(() => {
    // Check if role is already in sesison storage
    const storedRole = sessionStorage.getItem('pinRole');
    if (!storedRole && !userRole) {
      setShowInitialPinModal(true);
    }
    fetchBookings();
    // testBooking();
  }, [fetchBookings, userRole]);


  // =================================================
  // Page JSX (HTML)
  // =================================================
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
      {/* Tabs */}
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
            className={`${isDragging ? 'dragging-active' : ''}`}
            // Calendar stuff
            localizer={localizer}
            events={events}
            eventPropGetter={eventPropGetter} // Pass the new getter function here
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
            min={new Date(2024, 0, 1, 0, 0)} // 12 AM
            max={new Date(2024, 0, 1, 23, 59)} // 12 AM
            scrollToTime={moment().subtract(4, 'hours').toDate()}

            // Drag and drop functionality
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            draggableAccessor={event => {
              if (isTouchOnlyDevice) return false; // Disable DnD
              // Only admin and event owners
              return userRole === 'admin' || isMyEvent(event._id)}
            }
            resizableAccessor={event => {
              if (isTouchOnlyDevice) return false; // Disable DnD
              // Disable for events in top tab
              const isFullDayEvent = (event.end.getTime() - event.start.getTime()) === (24 * 60 * 60 * 1000);
              const isMultiDayEvent = moment(event.start).startOf('day').isBefore(moment(event.end).startOf('day'));
              if (isFullDayEvent || isMultiDayEvent) {
                return false;
              }
              // Only admin and event owners
              return userRole === 'admin' || isMyEvent(event._id)
            }}
            onDragStart={() => setIsDragging(true)} // Set state to true when drag starts
            // onDragEnd={() => setIsDragging(false)} // Not working, used elsewhere
          />
        </div>
      )}

      {/* Booking Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingEvent ? 'Edit Booking for' : 'Book'} {roomNumber}</h3>
            {/* Title */}
            <div className="form-group">
              <label>Event Title *</label>
              <input
                type="text"
                defaultValue={editingEvent?.rawTitle}
                // onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                ref={titleRef}
                placeholder="e.g., Team Meeting"
              />
            </div>

            {/* Start Time */}
            <div className="time-group">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={moment(newEvent.start).format('YYYY-MM-DD')}
                  onChange={(e) => handleSplitDateTimeChange('start', e.target.value, null)}
                />
              </div>
              <div className="form-group">
              <select
                className="time-select"
                list="start-times"
                value={moment(newEvent.start).format('HH:mm')}
                onChange={(e) => handleSplitDateTimeChange('start', null, e.target.value)}
              >
                {generateTimeOptions()}
              </select>
              </div>
            </div>

            {/* End Time */}
            <div className="time-group">
              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  value={moment(newEvent.end).format('YYYY-MM-DD')}
                  onChange={(e) => handleSplitDateTimeChange('end', e.target.value, null)}
                />
              </div>
              <div className="form-group">
                <select
                  className="time-select"
                  value={moment(newEvent.end).format('HH:mm')}
                  onChange={(e) => handleSplitDateTimeChange('end', null, e.target.value)}
                >
                  {generateTimeOptions(newEvent.start ? moment(newEvent.start).add(30, 'minutes') : null)}
                </select>
              </div>
            </div>


            {/* Only new events have recurring tickbox */}
            {!editingEvent && (
              <div className="recur-group">
                <label className="is-recur">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={() => {
                      setIsRecurring(!isRecurring);
                      // setRecurringDays([]); // Reset days when toggling
                      setRecurringEndDate(null); // Reset end date
                    }}
                  />
                  Recurring Event
                </label>
              </div>
            )}
            {/* Recurring options */}
            {isRecurring && (
              <>
                <div className="recur-group">
                  <label>Repeats On *</label>
                  {/* Day picking buttons */}
                  <div className="day-picker">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <button
                        key={index}
                        className={`day-btn ${recurringDays.includes(index) ? 'selected' : ''}`}
                        onClick={() => {
                          setRecurringDays(prevDays => 
                            prevDays.includes(index)
                              ? prevDays.filter(d => d !== index)
                              : [...prevDays, index]
                          );
                        }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Recurring event end date */}
                <div className="time-group">
                <div className="form-group">
                  <label>Ends On *</label>
                  <input
                    type="date"
                    value={recurringEndDate ? moment(recurringEndDate).format('YYYY-MM-DD') : ''}
                    onChange={(e) => {
                      const newDate = moment(e.target.value).toDate();;
                      setRecurringEndDate(newDate);
                    }}
                  />
                </div>
                </div>
              </>
            )}
            
            {/* Booked By */}
            <div className="form-group">
              <label>{editingEvent ? 'Updated By' : 'Booked By'} *</label>
              <input
                type="text"
                defaultValue={localStorage.getItem('currentName')}
                // onChange={(e) => setNewEvent({...newEvent, bookedBy: e.target.value})}
                ref={bookedByRef}
                placeholder="Your name"
              />
            </div>
            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                defaultValue={editingEvent?.description}
                // onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                ref={descriptionRef}
                placeholder="Optional description"
                rows="3"
              />
            </div>
            {/* Error message */}
            {error && <p className="error">{error}</p>}
            {/* Buttons */}
            <div className="modal-buttons">
              <button onClick={() => {
                const title = titleRef.current.value;
                const bookedBy = bookedByRef.current.value;
                const description = descriptionRef.current.value;

            
                // 2. Update the newEvent state just before calling the booking function
                setNewEvent(prev => ({
                    ...prev,
                    title,
                    bookedBy,
                    description
                }));

                // console.log(newEvent)

                setError('');
            
                editingEvent ? updateBooking(title, bookedBy, description) : addBooking(title, bookedBy, description)
              }}>
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

      {/* Event Details Modal (when you click on an event) */}
      {showEventModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Event Details</h3>
            {/* Originally only displays if title/booker has been modified */}
            <p><strong>Title:</strong> {selectedEvent.rawTitle}
              {selectedEvent.rawTitle !== selectedEvent.originalTitle && (
              <span> (Originally: {selectedEvent.originalTitle})</span> )}
            </p>
            <p><strong>Booked By:</strong> {selectedEvent.bookedBy}
              {selectedEvent.bookedBy !== selectedEvent.originalBookedBy && (
              <span> (Originally: {selectedEvent.originalBookedBy})</span> )}
            </p>
            <p>
              <strong>Time:</strong> {moment(selectedEvent.start).format('MMM DD, YYYY h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}
            </p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            {/* Buttons */}
            <div className="modal-buttons">
              {(userRole === 'admin' || isMyEvent(selectedEvent._id)) && (
                <>
                  <button onClick={() => handleEditEvent(selectedEvent)}>Edit</button>
                  <button id='event-det-del' onClick={() => {
                    if (selectedEvent.recurringId) {
                      setSelectedDeletionType('this');
                    } else {
                      setSelectedDeletionType(null);
                    }
                    setShowEventModal(false);
                    setShowRecurringDeleteModal(true);
                  }}>Delete</button>
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

      {/* Recurring Delete Confirmation Modal */}
      {showRecurringDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Recurring Event</h3>
            <p id="delete-warning">Are you sure you want to delete this event?</p>
            {selectedEvent.recurringId && (
              <div className="radio-group">
                <label>
                  <input type="radio" value="this" checked={selectedDeletionType === 'this'} 
                  onChange={(e) => setSelectedDeletionType(e.target.value)} />
                  This event
                </label>
                <label>
                  <input type="radio" value="following" checked={selectedDeletionType === 'following'}
                  onChange={(e) => setSelectedDeletionType(e.target.value)} />
                  This and following events
                </label>
                <label>
                  <input type="radio" value="all" checked={selectedDeletionType === 'all'}
                  onChange={(e) => setSelectedDeletionType(e.target.value)} />
                  All events
                </label>
              </div>
            )}
          {error && <p className="error">{error}</p>} {/* Display errors here */}
          <div className="modal-buttons">
            <button onClick={() => handleDeleteEvent(selectedEvent, selectedDeletionType)}>
              Delete
            </button>
            <button onClick={() => {
              setShowRecurringDeleteModal(false);
              setSelectedEvent(null);
              setError(''); // Clear any errors when canceling
              setSelectedDeletionType(null); // Reset selection on cancel
            }}>
              Cancel
            </button>
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
          showCancel={false} // Must enter PIN to see calendar
        />
      )}

      {/* ============ LIST VIEW ================= */}
      {viewType === 'list' && (
        <div className="list-view">
          <div className="calendar-buttons">
            {/* New Booking Button */}
            <div className="new-booking-container">
              <button className="new-booking-btn" onClick={handleNewBooking}>
                New Booking
              </button>
            </div>
            {/* Download Button */}
            {userRole === 'admin' && (
              <button className="download-btn" title="Download currently filtered events" onClick={() => downloadEvents(filteredEvents, building, roomNumber)}>
                Download Events
              </button>
            )}
            {/* Refresh button */}
            <button className="refresh" onClick={fetchBookings} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          {/* List filter controls */}
          <div className="list-controls">
            <div className="control-group ticks">
              <label>
                <input
                  type="checkbox"
                  checked={showAllEvents}
                  onChange={(e) => setShowAllEvents(e.target.checked)}
                />
                Show Past Events
              </label>
            </div>

            <div className="control-group ticks">
              <label>
                <input
                  type="checkbox"
                  checked={showMyEventsOnly}
                  onChange={(e) => setShowMyEventsOnly(e.target.checked)}
                />
                My Events
              </label>
            </div>

            <div className="control-group">
              <label>Filter by User:</label>
              <input
                type="text"
                placeholder="Enter name"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
              />
            </div>
          </div>
          {/* List view table */}
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Booked By</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event._id}>
                  <td>{event.rawTitle}</td>
                  <td>{event.bookedBy}</td>
                  <td>{moment(event.start).format('MMM DD, YYYY h:mm A')}</td>
                  <td>{moment(event.end).format('h:mm A')}</td>
                  <td>
                    <div className="desc"> {event.description} </div>
                  </td>
                  {(userRole === 'admin' || isMyEvent(event._id)) && (
                    <td className="actions">
                      <button onClick={() => handleEditEvent(event)}>Edit</button>
                      <button onClick={() => {
                        setSelectedEvent(event)
                        if (event.recurringId) {
                          setSelectedDeletionType('this');
                        } else {
                          setSelectedDeletionType(null);
                        }
                        setShowRecurringDeleteModal(true);
                      }}>Delete</button>
                    </td>
                  )}
                  {!(userRole === 'admin' || isMyEvent(event._id)) && (<td className="actions"></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RoomCalendar;