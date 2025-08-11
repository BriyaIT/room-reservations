// Save an event ID to local storage
export const saveEventId = (eventId) => {
  let userEvents = JSON.parse(localStorage.getItem('userEvents')) || [];
  if (!userEvents.includes(eventId)) {
    userEvents.push(eventId);
    localStorage.setItem('userEvents', JSON.stringify(userEvents));
  }
};

// Check if an event ID exists in local storage
export const isMyEvent = (eventId) => {
  const userEvents = JSON.parse(localStorage.getItem('userEvents')) || [];
  return userEvents.includes(eventId);
};

// Remove an event ID after deletion
export const removeEventId = (eventId) => {
  let userEvents = JSON.parse(localStorage.getItem('userEvents')) || [];
  userEvents = userEvents.filter(id => id !== eventId);
  localStorage.setItem('userEvents', JSON.stringify(userEvents));
};

