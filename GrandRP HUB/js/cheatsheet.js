

export const mirandaRights = {
  standard: `You have the right to remain silent. Anything you say can and will be used against you in a court of law. You have the right to an attorney. If you cannot afford an attorney, one will be provided for you by the state if one is available. Do you understand these rights as they have been read to you?`,
  concise: `You have the right to remain silent. Anything you say can be used against you in court. You have the right to a state-appointed lawyer. Do you understand your rights?`,
  suspectConfirmation: `With these rights in mind, do you wish to speak to us now or do you request legal representation?`,
  trafficInfractionNotice: `Driver, please turn off your engine, place your hands on the steering wheel, and remain inside the vehicle until instructed otherwise.`
};

export const tenCodes = [
  { code: "10-1", meaning: "Receiving Poorly / Signal Weak", category: "Radio Communication" },
  { code: "10-2", meaning: "Receiving Well / Loud and Clear", category: "Radio Communication" },
  { code: "10-3", meaning: "Stop Transmitting / Clear the Radio", category: "Radio Communication" },
  { code: "10-4", meaning: "Message Received / Understood (Affirmative)", category: "Radio Communication" },
  { code: "10-6", meaning: "Busy / Standby unless urgent", category: "Radio Communication" },
  { code: "10-7", meaning: "Out of Service / Off Duty", category: "Duty Status" },
  { code: "10-8", meaning: "In Service / Available for Calls (On Duty)", category: "Duty Status" },
  { code: "10-9", meaning: "Repeat Last Transmission", category: "Radio Communication" },
  { code: "10-10", meaning: "Fight in Progress", category: "Incident Codes" },
  { code: "10-11", meaning: "Traffic Stop in Progress", category: "Traffic & Patrol" },
  { code: "10-12", meaning: "Standby / Visitors Present", category: "Radio Communication" },
  { code: "10-13", meaning: "Shots Fired / Officer Needs Immediate Assistance", category: "Emergency / Distress" },
  { code: "10-14", meaning: "Medic Requested / EMS Needed", category: "Medical" },
  { code: "10-15", meaning: "Suspect in Custody (Transporting to Cell/DOC)", category: "Arrest & Transport" },
  { code: "10-16", meaning: "Stolen Vehicle Report", category: "Vehicle Operations" },
  { code: "10-17", meaning: "En Route to Location / Report to Station", category: "Movement" },
  { code: "10-19", meaning: "Returning to Station / HQ", category: "Movement" },
  { code: "10-20", meaning: "Current Location (What is your 10-20?)", category: "Radio Communication" },
  { code: "10-22", meaning: "Disregard Last Transmission / Cancel", category: "Radio Communication" },
  { code: "10-23", meaning: "Arrived on Scene", category: "Movement" },
  { code: "10-27", meaning: "Driver's License / ID Check", category: "Investigation" },
  { code: "10-28", meaning: "Vehicle Registration / License Plate Check", category: "Investigation" },
  { code: "10-29", meaning: "Check for Active Warrants (NCIC Check)", category: "Investigation" },
  { code: "10-32", meaning: "Person with Firearm / Armed Suspect", category: "Emergency / Distress" },
  { code: "10-41", meaning: "Beginning Shift / Going 10-8", category: "Duty Status" },
  { code: "10-42", meaning: "Ending Shift / Going 10-7", category: "Duty Status" },
  { code: "10-50", meaning: "Motor Vehicle Accident / Collision", category: "Traffic & Patrol" },
  { code: "10-51", meaning: "Tow Truck Requested", category: "Traffic & Patrol" },
  { code: "10-52", meaning: "Ambulance / Paramedic Requested", category: "Medical" },
  { code: "10-66", meaning: "Suspicious Person / Vehicle", category: "Investigation" },
  { code: "10-70", meaning: "Foot Pursuit in Progress", category: "Tactical & Pursuit" },
  { code: "10-80", meaning: "Vehicle Pursuit in Progress", category: "Tactical & Pursuit" },
  { code: "10-97", meaning: "In-Transit / En Route", category: "Movement" },
  { code: "10-99", meaning: "Officer in Immediate Danger / Panic Button / High Priority", category: "Emergency / Distress" },
];

export const statusCodes = [
  { code: "Code 0", meaning: "Game crash / Disconnection", description: "Officer lost connection to the server. Surrounding units take over scene." },
  { code: "Code 1", meaning: "Routine Response (No Lights / Sirens)", description: "Normal driving, obey all traffic regulations and speed limits." },
  { code: "Code 2", meaning: "Urgent Response (Lights Only)", description: "Expedited travel without sirens unless clearing intersections." },
  { code: "Code 3", meaning: "Emergency Response (Lights & Sirens)", description: "Full emergency equipment engaged with priority right of way." },
  { code: "Code 4", meaning: "Scene Secured / Under Control", description: "All clear. Additional responding units may cancel and resume patrol." },
  { code: "Code 5", meaning: "Felony / High-Risk Vehicle Stop", description: "Keep distance, draw sidearms from behind vehicle cover." },
  { code: "Code 6", meaning: "Conducting Field Investigation", description: "Unit is out of vehicle conducting interviews or checks." },
  { code: "Code 7", meaning: "Out of Service for Break", description: "Officer taking short meal or rest break." }
];

export const natoAlphabet = [
  { letter: "A", word: "Alpha", phonetic: "AL-FAH" },
  { letter: "B", word: "Bravo", phonetic: "BRAH-VOH" },
  { letter: "C", word: "Charlie", phonetic: "CHAR-LEE" },
  { letter: "D", word: "Delta", phonetic: "DELL-TAH" },
  { letter: "E", word: "Echo", phonetic: "ECK-OH" },
  { letter: "F", word: "Foxtrot", phonetic: "FOKS-TROT" },
  { letter: "G", word: "Golf", phonetic: "GOLF" },
  { letter: "H", word: "Hotel", phonetic: "HOH-TELL" },
  { letter: "I", word: "India", phonetic: "IN-DEE-AH" },
  { letter: "J", word: "Juliett", phonetic: "JEW-LEE-ETT" },
  { letter: "K", word: "Kilo", phonetic: "KEY-LOH" },
  { letter: "L", word: "Lima", phonetic: "LEE-MAH" },
  { letter: "M", word: "Mike", phonetic: "MIKE" },
  { letter: "N", word: "November", phonetic: "NO-VEM-BER" },
  { letter: "O", word: "Oscar", phonetic: "OSS-CAH" },
  { letter: "P", word: "Papa", phonetic: "PAH-PAH" },
  { letter: "Q", word: "Quebec", phonetic: "KEH-BECK" },
  { letter: "R", word: "Romeo", phonetic: "ROW-ME-OH" },
  { letter: "S", word: "Sierra", phonetic: "SEE-AIR-RAH" },
  { letter: "T", word: "Tango", phonetic: "TANG-GO" },
  { letter: "U", word: "Uniform", phonetic: "YOU-NEE-FORM" },
  { letter: "V", word: "Victor", phonetic: "VIK-TAH" },
  { letter: "W", word: "Whiskey", phonetic: "WISS-KEY" },
  { letter: "X", word: "X-ray", phonetic: "ECKS-RAY" },
  { letter: "Y", word: "Yankee", phonetic: "YANG-KEY" },
  { letter: "Z", word: "Zulu", phonetic: "ZOO-LOO" },
];

export const bodycamCommands = [
  {
    title: "Bodycam Activation (Turn ON)",
    action: "turn_on",
    badge: "RECORDING",
    text: "/me reaches up and double-taps the power button on the chest Axon Body 3 camera\n/do The bodycam beeps twice with a solid green LED and starts recording audio & video in 1080p.",
    shortDesc: "Standard protocol when going on duty or initiating an interaction"
  },
  {
    title: "Bodycam Deactivation (Turn OFF)",
    action: "turn_off",
    badge: "OFF-DUTY",
    text: "/me presses and holds the power button on the chest bodycam for 3 seconds\n/do The bodycam beeps once with a red LED, encrypts footage, and uploads recording to state secure cloud servers.",
    shortDesc: "Protocol when ending shift, hospital visits, or confidential briefing"
  },
  {
    title: "Bodycam Incident Bookmark (Tag Key Evidence)",
    action: "bookmark",
    badge: "BOOKMARK",
    text: "/me taps the event bookmark button on the center of the chest bodycam\n/do A high-priority event marker is logged with current GPS coordinates and 30-second audio pre-buffer.",
    shortDesc: "Tags critical moments for Internal Affairs, FIB case files, or court trials"
  },
  {
    title: "Dashcam & Vehicle Radar Synchronization",
    action: "dashcam",
    badge: "DASHCAM",
    text: "/me connects the wireless sync link between bodycam and patrol vehicle Panasonic Toughbook\n/do The front cruiser dashcam and speed radar synchronize multi-angle HD recording.",
    shortDesc: "Synchronizes cruiser video & vehicle speed radar"
  },
  {
    title: "Request Suspect Identification (Soft)",
    action: "ask_id",
    badge: "RP DIALOGUE",
    text: "/do What would be the full name and government passport ID of the individual?",
    shortDesc: "Clean official /do question for suspect identification"
  },
  {
    title: "Vehicle Registration & VIN Inspection",
    action: "vin_check",
    badge: "INSPECTION",
    text: "/me kneels down near the vehicle windshield and examines the lower left VIN plate and license registration\n/do What would the registered owner and license plate read?",
    shortDesc: "Official RP check for vehicle ownership and impound verification"
  }
];

