// Test script with sheets api
import SheetAPI from './SheetAPI';


const RoomCalendar1 = () => {
    
    
    return (
        <div>
            <h1>Room Booking Calendar</h1>
            {/* Calendar UI will be rendered here */}
            <form name="submit-booking">
                <input type="text" name="Room" placeholder="Room Number" required />
                <input type="date" name="Date" required />
                <input type="time" name="StartTime" required />
                <input type="time" name="EndTime" required />
                <button type="submit">Book Room</button>
            </form>
            <SheetAPI />
        </div>
    );
}

export default RoomCalendar1;