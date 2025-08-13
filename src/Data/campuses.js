import fort_totten from '../Assets/Sites/fort_totten.jpg';
import GA_Site from '../Assets/Sites/GA_Site.jpeg';
import Main_GA_Annex from '../Assets/Sites/Main_GA_Annex.png';
import Main_Site_SH from '../Assets/Sites/Main_Site_SH.png';
import Main_Site_ON from '../Assets/Sites/Main_Site_ON.png';

// only change name, don't change id
const campuses = [
  { id: 'fortTotten', name: 'Fort Totten', image: fort_totten},
  { id: 'shepherd', name: 'Shepherd', image: Main_Site_SH},
  { id: 'ontario', name: 'Ontario', image: Main_Site_ON},
  { id: 'georgia', name: 'Georgia', image: GA_Site},
  { id: 'georgiaAnnex', name: 'Georgia Annex', image: Main_GA_Annex}
];

export default campuses;