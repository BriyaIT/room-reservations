// Test sheet api calls
import { useEffect } from 'react';


const SheetAPI = () => {
    useEffect(() => {
        // Initialize calendar or any other setup code here
        console.log('RoomCalendar component mounted');
        const form = document.forms['submit-booking'];
        const API_URL = 'https://script.google.com/macros/s/AKfycbzzy_j_t1_L5k3aS02s7o872nRwKbNIv6xWro9yRmofJ_chqci80E8yVO3nqiFePLAa/exec';


        const handleSubmit = (e) => {
            e.preventDefault();
            fetch(API_URL, {method: 'POST', body: new FormData(form)})
                .then(() => {
                    alert('Room booked successfully!');
                    form.reset();
                })
                .catch((error) => {console.error('Error booking room:', error);});
        }


        form.addEventListener('submit', handleSubmit);
        return () => {
        console.log('RoomCalendar component unmounted');
        form.removeEventListener('submit', handleSubmit);
        };
    }, []);

    return null;
}

export default SheetAPI;