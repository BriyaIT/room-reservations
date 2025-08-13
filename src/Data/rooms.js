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
import SH_10 from '../Assets/Rooms/SH/SH_10.jpeg';

// name is used as id, don't change
// displayName can be changed
const rooms = {
  fortTotten: [
    { displayName: "Academic NEST (1)", name: "NEST-Academic", image: FT_9 },
    { displayName: "Staff Kitchen NEST (1)", name: "NEST-Staff-Kitchen", image: FT_10 },
    { displayName: "Mama Nook 136 Blue (1)", name: "Nook-Mama-136-Blue", image: FT_14 },
    { displayName: "Adika Nook 156 Yellow (4)", name: "Nook-Adika-156-Yellow", image: FT_11 },
    { displayName: "Stella Nook 162 Yellow (4)", name: "Nook-Stella-162-Yellow", image: FT_12 },
    { displayName: "Kondi Nook 163 Yellow (4)", name: "Nook-Kondi-163-Yellow", image: FT_13 },
    { displayName: "Milo Nook 155 Yellow (4)", name: "Nook-Milo-155-Yellow", image: FT_15 },
    { displayName: "Garden Room 144 Blue (6)", name: "Garden-Room-144-Blue", image: FT_7 },
    { displayName: "Classroom 141 Blue (25)", name: "Classroom-141-Blue", image: FT_2 },
    { displayName: "Classroom 143 Blue (25)", name: "Classroom-143-Blue", image: FT_3 },
    { displayName: "Classroom 139 Blue (25)", name: "Classroom-139-Blue", image: FT_6 },
    { displayName: "CASAS/Conference Room 134 Blue", name: "CASAS-Conference-Room-134-Blue", image: FT_1 },
    { displayName: "Classroom 153 Yellow (25)", name: "Classroom-153-Yellow", image: FT_4 },
    { displayName: "Classroom 159 Yellow (21)", name: "Classroom-159-Yellow", image: FT_5 },
    { displayName: "Lobby Room 146 (4)", name: "Lobby-Room-146", image: FT_8 },
    { displayName: "Registration Room 131B Lobby (5)", name: "Registration-Room-131B-Lobby", image: FT_16 },
  ],
  georgia: [
    { displayName: "GA Classroom 79", name: "GA-Classroom-79", image: GA_Classroom79 },
    { displayName: "GA Classroom 85", name: "GA-Classroom-85", image: GA_Classroom85 },
    { displayName: "GA Lg Counseling Rm", name: "GA-Lg-Counseling-Rm", image: GA_Large_Counseling_Room },
    { displayName: "GA Sm Counseling Rm", name: "GA-Sm-Counseling-Rm", image: GA_Small_Counseling_Room },
  ],
  georgiaAnnex: [
    { displayName: "1st Floor (1-20)", name: "1st-Floor", image: Annex_1rst_Floor },
    { displayName: "2nd Floor Office (4)", name: "2nd-Floor-Office", image: Annex_2nd_floor_office },
    { displayName: "Basement (1)", name: "Basement", image: Annex_basement },
  ],
  ontario: [
    { displayName: "Bletzinger Classroom (25)", name: "Bletzinger-Classroom", image: ONT_Bletzinger_Classroom },
    { displayName: "Green Classroom", name: "Green-Classroom", image: ONT_Green_Classroom },
    { displayName: "IT/Testing Room", name: "IT-Testing-Room", image: ONT_IT_Testing },
    { displayName: "Zoom Conf 2nd Floor", name: "Zoom-Conf-2nd-Floor", image: ONT_Zoom_Conf_2nd },
    { displayName: "Zoom Spot (1) Inside Testing Room", name: "Zoom-Spot-Inside-Testing-Room", image: ONT_IT_Testing },
  ],
  shepherd: [
    { displayName: `AE Classrm 207 (30)`, name: `AE-Classrm-207`, image: SH_1 },
    { displayName: "CASAS Rm 209 (6)", name: "CASAS-Rm-209", image: SH_2 },
    { displayName: "AE Classrm 211 (30)", name: "AE-Classrm-211", image: SH_3 },
    { displayName: "AE Classrm 218 (30)", name: "AE-Classrm-218", image: SH_4 },
    { displayName: "NEDP/CARES Rm 219 (4)", name: "NEDP-CARES-Rm-219", image: SH_5 },
    { displayName: "West Conf Rm 224 (6)", name: "West-Conf-Rm-224", image: SH_6 },
    { displayName: "East Conf Rm 226 (8)", name: "East-Conf-Rm-226", image: SH_7 },
    { displayName: "Zoom Rm 1 242 (1)", name: "Zoom-Rm-1-242", image: SH_8 },
    { displayName: "Zoom Rm 2 243 (1)", name: "Zoom-Rm-2-243", image: SH_9 },
    { displayName: "218A VI Teaching (1)", name: "218A-VI-Teaching", image: SH_10 },
  ],
};

export default rooms;