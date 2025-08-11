// Fort Totten Images
import FT_1 from '../Assets/Rooms/FT/FT_1.jpeg';
import FT_2 from '../Assets/Rooms/FT/FT_2.jpeg';
import FT_3 from '../Assets/Rooms/FT/FT_3.jpeg';
import FT_4 from '../Assets/Rooms/FT/FT_4.jpeg';
import FT_5 from '../Assets/Rooms/FT/FT_5.jpeg';
import FT_6 from '../Assets/Rooms/FT/FT_6.jpeg';
import FT_7 from '../Assets/Rooms/FT/FT_7.jpeg';
import FT_8 from '../Assets/Rooms/FT/FT_8.jpeg';
import FT_9 from '../Assets/Rooms/FT/FT_9.jpeg';
import FT_10 from '../Assets/Rooms/FT/FT_10.jpeg';
import FT_11 from '../Assets/Rooms/FT/FT_11.jpeg';
import FT_12 from '../Assets/Rooms/FT/FT_12.jpeg';
import FT_13 from '../Assets/Rooms/FT/FT_13.jpeg';
import FT_14 from '../Assets/Rooms/FT/FT_14.jpeg';
import FT_15 from '../Assets/Rooms/FT/FT_15.jpeg';
import FT_16 from '../Assets/Rooms/FT/FT_16.jpeg';

// Georgia Images
import GA_Classroom79 from '../Assets/Rooms/GA/GA-Classroom-79.jpeg';
import GA_Classroom85 from '../Assets/Rooms/GA/GA-Classroom-85.jpeg';
import GA_Large_Counseling_Room from '../Assets/Rooms/GA/GA-Large-Counseling-Room.jpeg';
import GA_Small_Counseling_Room from '../Assets/Rooms/GA/GA-Small-Counseling-Room.jpeg';

// Georgia Annex Images
import Annex_1rst_Floor from '../Assets/Rooms/ANNEX/1rst Floor.png';
import Annex_2nd_floor_office from '../Assets/Rooms/ANNEX/2nd-floor-office.jpeg';
import Annex_basement from '../Assets/Rooms/ANNEX/basement-Annex.png';

// Ontario Images
import ONT_Bletzinger_Classroom from '../Assets/Rooms/ONT/Bletzinger-Classroom.jpeg';
import ONT_Green_Classroom from '../Assets/Rooms/ONT/Green-Classroom.jpeg';
import ONT_IT_Testing from '../Assets/Rooms/ONT/IT-Testing.jpeg';
import ONT_Zoom_Conf_2nd from '../Assets/Rooms/ONT/Zoom-Conf-2nd.jpeg';

// Shepherd Images
import SH_1 from '../Assets/Rooms/SH/SH_1.jpeg';
import SH_2 from '../Assets/Rooms/SH/SH_2.jpeg';
import SH_3 from '../Assets/Rooms/SH/SH_3.jpeg';
import SH_4 from '../Assets/Rooms/SH/SH_4.jpeg';
import SH_5 from '../Assets/Rooms/SH/SH_5.jpeg';
import SH_6 from '../Assets/Rooms/SH/SH_6.jpeg';
import SH_7 from '../Assets/Rooms/SH/SH_7.jpeg';
import SH_8 from '../Assets/Rooms/SH/SH_8.jpeg';
import SH_9 from '../Assets/Rooms/SH/SH_9.jpeg';
// import SH_10 from '../Assets/Rooms/SH/SH_10.jpeg';

const rooms = {
  fortTotten: [
    { name: "CASAS-Conference Room 134 Blue", image: FT_1 },
    { name: "Classroom 141 Blue (25)", image: FT_2 },
    { name: "Classroom 143 Blue (25)", image: FT_3 },
    { name: "Classroom 153 Yellow (25)", image: FT_4 },
    { name: "Classroom 159 Yellow (21)", image: FT_5 },
    { name: "Classroom 139 Blue (25)", image: FT_6 },
    { name: "Garden Room 144 Blue (6)", image: FT_7 },
    { name: "Lobby Room 146 (4)", image: FT_8 },
    { name: "NEST, Academic", image: FT_9 },
    { name: "NEST, Admin", image: FT_10 },
    { name: "Nook, Adika 156 Yellow (4)", image: FT_11 },
    { name: "Nook, Stella 162 Yellow (4)", image: FT_12 },
    { name: "Nook, Kondi 163 Yellow (4)", image: FT_13 },
    { name: "Nook, Mama 136 Blue (1)", image: FT_14 },
    { name: "Nook, Milo 155 Yellow (4)", image: FT_15 },
    { name: "Registration Room 131B Lobby (5)", image: FT_16 },
  ],
  georgia: [
    { name: "GA Classroom 79", image: GA_Classroom79 },
    { name: "GA Classroom 85", image: GA_Classroom85 },
    { name: "GA Lg Counseling Rm", image: GA_Large_Counseling_Room },
    { name: "GA Sm Counseling Rm", image: GA_Small_Counseling_Room },
  ],
  georgiaAnnex: [
    { name: "1st Floor (1-20)", image: Annex_1rst_Floor },
    { name: "2nd Floor O4ffice (4)", image: Annex_2nd_floor_office },
    { name: "Basement (1)", image: Annex_basement },
  ],
  ontario: [
    { name: "Bletzinger Classroom (25)", image: ONT_Bletzinger_Classroom },
    { name: "Green Classroom", image: ONT_Green_Classroom },
    { name: "IT Testing Room", image: ONT_IT_Testing },
    { name: "Zoom Conf 2nd Floor", image: ONT_Zoom_Conf_2nd },
    { name: "Zoom Spot (1) Inside Testing room", image: ONT_IT_Testing }, // Reusing same image
  ],
  shepherd: [
    { name: `AE Classrm 207 (30)`, image: SH_1 },
    { name: "CASAS Rm 209 (6)", image: SH_2 },
    { name: "AE Classrm 211 (30)", image: SH_3 },
    { name: "AE Classrm 218 (30)", image: SH_4 },
    { name: "NEDP-CARES Rm 219 (4)", image: SH_5 },
    { name: "West Conf Rm 224 (6)", image: SH_6 },
    { name: "East Conf Rm 226 (8)", image: SH_7 },
    { name: "Zoom Rm 1 242 (1)", image: SH_8 },
    { name: "Zoom Rm 2 243 (1)", image: SH_9 },
  //   { name: "#218A VI Teaching  (1)", image: SH_10 },
  ],
};

export default rooms;