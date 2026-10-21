const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Tutor = require('./models/Tutor');

const tutorsData = [
  {
    name: 'P. Srinivas',
    email: 'srinivas.p98@gmail.com',
    gender: 'Male',
    age: 24,
    qualification: 'BTech',
    hourlyRate: 200,
    monthlyRate: 4000,
    experience: 3,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Telugu'],
    classes: ['Class 6-10', 'Class 11-12'],
    teachingMode: 'Both',
    streetAddress: 'Flat 302, Cyber View Residency, Near Metro Pillar C1042, Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    lat: 17.4485,
    lng: 78.3742,
    mobile: '9848011201'
  },
  {
    name: 'K. Karthik',
    email: 'karthik.k2004@gmail.com',
    gender: 'Male',
    age: 22,
    qualification: 'BTech',
    hourlyRate: 150,
    monthlyRate: 3000,
    experience: 2,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Offline',
    streetAddress: 'House No 4-82, Telecom Nagar Colony, Near Gachibowli Stadium, Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    lat: 17.4401,
    lng: 78.3489,
    mobile: '9848011202'
  },
  {
    name: 'K. Priyanka',
    email: 'priyanka.k2003@gmail.com',
    gender: 'Female',
    age: 23,
    qualification: 'Degree',
    hourlyRate: 150,
    monthlyRate: 3000,
    experience: 2,
    subjects: ['Biology', 'Chemistry', 'English', 'Telugu', 'Social Studies'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Both',
    streetAddress: 'Plot 128, KPHB Phase 3, Near Temple Bus Stop, Kukatpally',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500072',
    lat: 17.4938,
    lng: 78.3995,
    mobile: '9848011203'
  },
  {
    name: 'N. Bhuloka',
    email: 'bhuloka.n01@gmail.com',
    gender: 'Male',
    age: 25,
    qualification: 'Diploma',
    hourlyRate: 100,
    monthlyRate: 2000,
    experience: 3,
    subjects: ['Mathematics', 'Physics', 'Telugu', 'Social Studies'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Offline',
    streetAddress: '7-1-212, Srinivasa Nagar East, Near Metro Station, Ameerpet',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500038',
    lat: 17.4375,
    lng: 78.4482,
    mobile: '9848011204'
  },
  {
    name: 'J. Vijaya Lakshmi',
    email: 'vijaya.lakshmi.j@gmail.com',
    gender: 'Female',
    age: 26,
    qualification: 'Degree',
    hourlyRate: 250,
    monthlyRate: 5000,
    experience: 4,
    subjects: ['English', 'Sanskrit', 'Telugu', 'Social Studies', 'Mathematics'],
    classes: ['Class 6-10', 'Class 11-12'],
    teachingMode: 'Online',
    streetAddress: 'Villa 18, Green Valley Enclave, Road Number 12, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    lat: 17.4156,
    lng: 78.4350,
    mobile: '9848011205'
  },
  {
    name: 'H. Himavardhan',
    email: 'himavardhan.h@gmail.com',
    gender: 'Male',
    age: 21,
    qualification: 'BTech',
    hourlyRate: 150,
    monthlyRate: 3000,
    experience: 1,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
    classes: ['Class 6-10'],
    teachingMode: 'Both',
    streetAddress: 'Door 16-11-405, Moosarambagh Rd, Near Chaitanyapuri Metro, Dilsukhnagar',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500060',
    lat: 17.3688,
    lng: 78.5247,
    mobile: '9848011206'
  },
  {
    name: 'Burra Venkatesh',
    email: 'venkatesh.burra99@gmail.com',
    gender: 'Male',
    age: 25,
    qualification: 'BTech',
    hourlyRate: 200,
    monthlyRate: 4000,
    experience: 3,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Telugu'],
    classes: ['Class 6-10', 'Class 11-12'],
    teachingMode: 'Offline',
    streetAddress: 'Flat 201, Sri Sai Krupa Residency, Near RTO Office, Kondapur',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500084',
    lat: 17.4648,
    lng: 78.3622,
    mobile: '9848011207'
  },
  {
    name: 'J. Jaya Ram',
    email: 'jayaram.j2003@gmail.com',
    gender: 'Male',
    age: 23,
    qualification: 'Degree',
    hourlyRate: 150,
    monthlyRate: 3000,
    experience: 2,
    subjects: ['Social Studies', 'English', 'Telugu', 'Mathematics', 'Sanskrit'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Both',
    streetAddress: '10-2-186, West Marredpally Main Road, Near St Anns, Secunderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500026',
    lat: 17.4428,
    lng: 78.5032,
    mobile: '9848011208'
  },
  {
    name: 'Karri Rambabu',
    email: 'karri.rambabu02@gmail.com',
    gender: 'Male',
    age: 24,
    qualification: 'Diploma',
    hourlyRate: 100,
    monthlyRate: 2000,
    experience: 3,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Telugu'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Offline',
    streetAddress: 'Plot 54, Janapriya Nagar Phase 2, Near Allwyn Colony, Miyapur',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500049',
    lat: 17.4968,
    lng: 78.3556,
    mobile: '9848011209'
  },
  {
    name: 'G. Kiran Reddy',
    email: 'kiranreddy.g98@gmail.com',
    gender: 'Male',
    age: 26,
    qualification: 'BTech',
    hourlyRate: 300,
    monthlyRate: 6000,
    experience: 4,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Social Studies'],
    classes: ['Class 6-10', 'Class 11-12'],
    teachingMode: 'Both',
    streetAddress: 'Plot 421, Journalist Colony, Road No 70, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    lat: 17.4319,
    lng: 78.4073,
    mobile: '9848011210'
  },
  {
    name: 'K. Joshna',
    email: 'joshna.k2004@gmail.com',
    gender: 'Female',
    age: 22,
    qualification: 'Degree',
    hourlyRate: 150,
    monthlyRate: 3000,
    experience: 2,
    subjects: ['Biology', 'Chemistry', 'English', 'Telugu', 'Sanskrit'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Online',
    streetAddress: '1-11-252, Prakash Nagar Main Road, Near Shoppers Stop, Begumpet',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500016',
    lat: 17.4440,
    lng: 78.4682,
    mobile: '9848011211'
  },
  {
    name: 'N. Manhor',
    email: 'manhor.n2006@gmail.com',
    gender: 'Male',
    age: 20,
    qualification: 'Diploma',
    hourlyRate: 100,
    monthlyRate: 2000,
    experience: 1,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Offline',
    streetAddress: 'House 2-4-68, Chilakanagar Main Road, Near Uppal Metro, Uppal',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500039',
    lat: 17.4022,
    lng: 78.5602,
    mobile: '9848011212'
  },
  {
    name: 'Sampangi Rambabu',
    email: 'sampangi.rambabu@gmail.com',
    gender: 'Male',
    age: 25,
    qualification: 'BTech',
    hourlyRate: 200,
    monthlyRate: 4000,
    experience: 3,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Telugu', 'Social Studies'],
    classes: ['Class 6-10'],
    teachingMode: 'Both',
    streetAddress: 'Flat 104, Royal Palms, PVNR Expressway Pillar 48, Mehdipatnam',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500028',
    lat: 17.3916,
    lng: 78.4398,
    mobile: '9848011213'
  },
  {
    name: 'P. Kavya',
    email: 'kavya.p2005@gmail.com',
    gender: 'Female',
    age: 21,
    qualification: 'BTech',
    hourlyRate: 200,
    monthlyRate: 4000,
    experience: 1,
    subjects: ['Biology', 'Chemistry', 'Physics', 'English', 'Telugu'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Both',
    streetAddress: 'Plot 88, Snehapuri Colony, Near LB Nagar Ring Road, Mansoorabad',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500068',
    lat: 17.3457,
    lng: 78.5522,
    mobile: '9848011214'
  },
  {
    name: 'J. Roshini',
    email: 'roshini.j2004@gmail.com',
    gender: 'Female',
    age: 22,
    qualification: 'Degree',
    hourlyRate: 150,
    monthlyRate: 3000,
    experience: 2,
    subjects: ['English', 'Sanskrit', 'Telugu', 'Social Studies'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Online',
    streetAddress: '12-13-418, Street No 1, Near Osmania University Gate, Tarnaka',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500017',
    lat: 17.4284,
    lng: 78.5283,
    mobile: '9848011215'
  },
  {
    name: 'K. Lakshmi',
    email: 'lakshmi.k2002@gmail.com',
    gender: 'Female',
    age: 24,
    qualification: 'Diploma',
    hourlyRate: 100,
    monthlyRate: 2000,
    experience: 2,
    subjects: ['Mathematics', 'English', 'Telugu', 'Social Studies', 'Sanskrit'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Offline',
    streetAddress: '6-3-1090, Raj Bhavan Road, Near Yashoda Hospital, Somajiguda',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500082',
    lat: 17.4244,
    lng: 78.4554,
    mobile: '9848011216'
  },
  {
    name: 'P. Sai Priya',
    email: 'saipriya.p2003@gmail.com',
    gender: 'Female',
    age: 23,
    qualification: 'Degree',
    hourlyRate: 150,
    monthlyRate: 3000,
    experience: 2,
    subjects: ['Biology', 'Chemistry', 'English', 'Telugu', 'Social Studies'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Both',
    streetAddress: 'Door 8-3-228, BK Guda Road, Near Community Hall, SR Nagar',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500038',
    lat: 17.4431,
    lng: 78.4419,
    mobile: '9848011217'
  },
  {
    name: 'L. Kalpana',
    email: 'kalpana.l2001@gmail.com',
    gender: 'Female',
    age: 25,
    qualification: 'BTech',
    hourlyRate: 200,
    monthlyRate: 4000,
    experience: 3,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    classes: ['Class 6-10', 'Class 11-12'],
    teachingMode: 'Online',
    streetAddress: '3-6-522, Liberty Road, Near Minerva Coffee Shop, Himayatnagar',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500029',
    lat: 17.3998,
    lng: 78.4842,
    mobile: '9848011218'
  },
  {
    name: 'H. Janu',
    email: 'janu.h2007@gmail.com',
    gender: 'Female',
    age: 19,
    qualification: 'Diploma',
    hourlyRate: 100,
    monthlyRate: 2000,
    experience: 1,
    subjects: ['Telugu', 'English', 'Social Studies', 'Sanskrit'],
    classes: ['Class 1-5'],
    teachingMode: 'Offline',
    streetAddress: 'Plot 19, Maruthi Nagar Colony, Near Victoria Memorial Metro, Kothapet',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500035',
    lat: 17.3615,
    lng: 78.5449,
    mobile: '9848011219'
  },
  {
    name: 'K. Rajesh',
    email: 'rajesh.k2002@gmail.com',
    gender: 'Male',
    age: 24,
    qualification: 'BTech',
    hourlyRate: 250,
    monthlyRate: 5000,
    experience: 3,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Telugu'],
    classes: ['Class 6-10', 'Class 11-12'],
    teachingMode: 'Both',
    streetAddress: 'Flat 405, Shirdi Sai Enclave, Puppalguda Main Road, Manikonda',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500089',
    lat: 17.4025,
    lng: 78.3792,
    mobile: '9848011220'
  },
  {
    name: 'G Srilekha',
    email: 'srilekha.g2004@gmail.com',
    gender: 'Female',
    age: 22,
    qualification: 'BTech',
    hourlyRate: 200,
    monthlyRate: 4000,
    experience: 2,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    classes: ['Class 6-10', 'Class 11-12'],
    teachingMode: 'Both',
    streetAddress: 'Plot 34, Cyber Towers Rd, Near Cyber Gateway, Hitech City',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    lat: 17.4504,
    lng: 78.3808,
    mobile: '9848011221'
  },
  {
    name: 'CH Sowjanya',
    email: 'sowjanya.ch2003@gmail.com',
    gender: 'Female',
    age: 23,
    qualification: 'Degree',
    hourlyRate: 150,
    monthlyRate: 3000,
    experience: 2,
    subjects: ['Biology', 'Chemistry', 'English', 'Telugu', 'Social Studies'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Online',
    streetAddress: 'Door 22-5-182, Near Laad Bazaar, Charminar, Old City',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500002',
    lat: 17.3616,
    lng: 78.4747,
    mobile: '9848011222'
  },
  {
    name: 'Kimidi Ramakrishna',
    email: 'ramakrishna.kimidi@gmail.com',
    gender: 'Male',
    age: 25,
    qualification: 'BTech',
    hourlyRate: 250,
    monthlyRate: 5000,
    experience: 3,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Telugu'],
    classes: ['Class 6-10', 'Class 11-12'],
    teachingMode: 'Both',
    streetAddress: 'Flat 402, Cyber Heights, Near DLF Cyber City, Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    lat: 17.4435,
    lng: 78.3562,
    mobile: '9848011223'
  },
  {
    name: 'P Janaki',
    email: 'janaki.p2005@gmail.com',
    gender: 'Female',
    age: 21,
    qualification: 'Diploma',
    hourlyRate: 100,
    monthlyRate: 2000,
    experience: 1,
    subjects: ['Telugu', 'English', 'Social Studies', 'Sanskrit'],
    classes: ['Class 1-5'],
    teachingMode: 'Offline',
    streetAddress: 'House 5-8-12, Lower Tank Bund Road, Hussainsagar',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500080',
    lat: 17.4239,
    lng: 78.4738,
    mobile: '9848011224'
  },
  {
    name: 'K Manasa',
    email: 'manasa.k2002@gmail.com',
    gender: 'Female',
    age: 24,
    qualification: 'BTech',
    hourlyRate: 200,
    monthlyRate: 4000,
    experience: 3,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    classes: ['Class 6-10', 'Class 11-12'],
    teachingMode: 'Both',
    streetAddress: 'Villa 14, Mindspace Layout, Near Inorbit Mall, Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    lat: 17.4344,
    lng: 78.3866,
    mobile: '9848011225'
  },
  {
    name: 'A Mounika',
    email: 'mounika.a2003@gmail.com',
    gender: 'Female',
    age: 23,
    qualification: 'Degree',
    hourlyRate: 150,
    monthlyRate: 3000,
    experience: 2,
    subjects: ['Biology', 'Chemistry', 'English', 'Telugu'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Online',
    streetAddress: 'Shop 12, Station Road, Near GPO, Abids',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    lat: 17.3891,
    lng: 78.4744,
    mobile: '9848011226'
  },
  {
    name: 'Killari Chaitanya',
    email: 'chaitanya.killari@gmail.com',
    gender: 'Male',
    age: 26,
    qualification: 'BTech',
    hourlyRate: 300,
    monthlyRate: 6000,
    experience: 4,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Social Studies'],
    classes: ['Class 6-10', 'Class 11-12'],
    teachingMode: 'Both',
    streetAddress: 'Plot 72, Road No 36, Near Peddamma Temple, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    lat: 17.4285,
    lng: 78.4116,
    mobile: '9848011227'
  },
  {
    name: 'U Ganesh',
    email: 'ganesh.u2004@gmail.com',
    gender: 'Male',
    age: 22,
    qualification: 'Diploma',
    hourlyRate: 100,
    monthlyRate: 2000,
    experience: 2,
    subjects: ['Mathematics', 'Physics', 'Telugu', 'Social Studies'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Offline',
    streetAddress: 'House 8-2-45, Exhibition Grounds Road, Nampally',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    lat: 17.3872,
    lng: 78.4683,
    mobile: '9848011228'
  },
  {
    name: 'B Jareena',
    email: 'jareena.b2003@gmail.com',
    gender: 'Female',
    age: 23,
    qualification: 'Degree',
    hourlyRate: 150,
    monthlyRate: 3000,
    experience: 2,
    subjects: ['English', 'Social Studies', 'Telugu', 'Mathematics'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Online',
    streetAddress: 'Flat 203, Paramount Hills, Near Galaxy Theatre, Tolichowki',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500008',
    lat: 17.4014,
    lng: 78.4128,
    mobile: '9848011229'
  },
  {
    name: 'J Sireesha',
    email: 'sireesha.j2001@gmail.com',
    gender: 'Female',
    age: 25,
    qualification: 'BTech',
    hourlyRate: 200,
    monthlyRate: 4000,
    experience: 3,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
    classes: ['Class 6-10'],
    teachingMode: 'Both',
    streetAddress: 'Plot 105, Botanical Garden Road, Kondapur',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500084',
    lat: 17.4582,
    lng: 78.3619,
    mobile: '9848011230'
  },
  {
    name: 'Rongali Devi',
    email: 'devi.rongali@gmail.com',
    gender: 'Female',
    age: 24,
    qualification: 'Degree',
    hourlyRate: 150,
    monthlyRate: 3000,
    experience: 2,
    subjects: ['Telugu', 'Sanskrit', 'English', 'Social Studies'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Offline',
    streetAddress: 'House 1-8-32, Brahmanwadi, Near Begumpet Flyover, Begumpet',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500016',
    lat: 17.4439,
    lng: 78.4705,
    mobile: '9848011231'
  },
  {
    name: 'L Sowmya',
    email: 'sowmya.l2004@gmail.com',
    gender: 'Female',
    age: 22,
    qualification: 'BTech',
    hourlyRate: 200,
    monthlyRate: 4000,
    experience: 2,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    classes: ['Class 6-10', 'Class 11-12'],
    teachingMode: 'Both',
    streetAddress: 'Door 6-3-248, Nagarjuna Circle, Panjagutta',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500082',
    lat: 17.4265,
    lng: 78.4509,
    mobile: '9848011232'
  },
  {
    name: 'V Janshi',
    email: 'janshi.v2006@gmail.com',
    gender: 'Female',
    age: 20,
    qualification: 'Diploma',
    hourlyRate: 100,
    monthlyRate: 2000,
    experience: 1,
    subjects: ['Mathematics', 'Telugu', 'Social Studies', 'English'],
    classes: ['Class 1-5'],
    teachingMode: 'Offline',
    streetAddress: 'House 16-2-80, Super Bazaar Road, Malakpet',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500036',
    lat: 17.3719,
    lng: 78.4981,
    mobile: '9848011233'
  },
  {
    name: 'K Ramu',
    email: 'ramu.k2002@gmail.com',
    gender: 'Male',
    age: 24,
    qualification: 'BTech',
    hourlyRate: 250,
    monthlyRate: 5000,
    experience: 3,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Telugu', 'English'],
    classes: ['Class 6-10', 'Class 11-12'],
    teachingMode: 'Both',
    streetAddress: 'Plot 48, Industrial Estate Main Road, Sanathnagar',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500018',
    lat: 17.4563,
    lng: 78.4371,
    mobile: '9848011234'
  },
  {
    name: 'T Kalyani',
    email: 'kalyani.t2003@gmail.com',
    gender: 'Female',
    age: 23,
    qualification: 'Degree',
    hourlyRate: 150,
    monthlyRate: 3000,
    experience: 2,
    subjects: ['Biology', 'Chemistry', 'English', 'Telugu', 'Sanskrit'],
    classes: ['Class 1-5', 'Class 6-10'],
    teachingMode: 'Both',
    streetAddress: 'Villa 28, Road Number 2, Near Annapurna Studios, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    lat: 17.4219,
    lng: 78.4326,
    mobile: '9848011235'
  }
];

async function seedToMongo() {
  const defaultPassword = 'pavan0707';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(defaultPassword, salt);

  let createdCount = 0;
  let updatedCount = 0;

  for (const t of tutorsData) {
    let user = await User.findOne({ email: t.email, role: 'Tutor' });
    if (!user) {
      user = new User({
        name: t.name,
        email: t.email,
        password: defaultPassword,
        role: 'Tutor',
        phone: t.mobile,
        paymentStatus: 'Paid',
        paymentId: 'pay_manual_seed_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        subscriptionExpiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      });
      await user.save();
      await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword, paymentStatus: 'Paid' } });
      createdCount++;
    } else {
      await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword, paymentStatus: 'Paid' } });
      updatedCount++;
    }

    let tutor = await Tutor.findOne({ email: t.email });
    if (!tutor) {
      tutor = new Tutor({
        userId: user._id,
        fullName: t.name,
        mobile: t.mobile,
        email: t.email,
        gender: t.gender,
        age: t.age,
        qualification: t.qualification,
        university: 'Osmania University, Hyderabad',
        graduationYear: 2026 - (t.age - 21 > 0 ? t.age - 21 : 1),
        experience: t.experience,
        subjects: t.subjects,
        classes: t.classes,
        teachingMode: t.teachingMode,
        hourlyRate: t.hourlyRate,
        monthlyRate: t.monthlyRate,
        streetAddress: t.streetAddress,
        city: t.city,
        state: t.state,
        pincode: t.pincode,
        lat: t.lat,
        lng: t.lng,
        bio: '',
        about: '',
        methodology: '',
        photo: '', // Empty photo so standard letter badge is used
        isVerified: true,
        verifiedAt: new Date(),
        verifiedDate: new Date(),
        paymentStatus: 'Paid',
        paymentId: user.paymentId || 'pay_seed_verified'
      });
      await tutor.save();
      user.tutorProfile = tutor._id;
      await user.save();
    } else {
      tutor.fullName = t.name;
      tutor.age = t.age;
      tutor.gender = t.gender;
      tutor.qualification = t.qualification;
      tutor.hourlyRate = t.hourlyRate;
      tutor.monthlyRate = t.monthlyRate;
      tutor.subjects = t.subjects;
      tutor.classes = t.classes;
      tutor.teachingMode = t.teachingMode;
      tutor.streetAddress = t.streetAddress;
      tutor.city = t.city;
      tutor.state = t.state;
      tutor.pincode = t.pincode;
      tutor.lat = t.lat;
      tutor.lng = t.lng;
      tutor.bio = '';
      tutor.about = '';
      tutor.methodology = '';
      tutor.photo = '';
      tutor.isVerified = true;
      tutor.paymentStatus = 'Paid';
      await tutor.save();
      updatedCount++;
    }
  }

  return { createdCount, updatedCount, total: tutorsData.length, password: defaultPassword };
}

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tutorconnect';
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('MongoDB connection established successfully.');

    const res = await seedToMongo();
    console.log(`\nAll 20 Hyderabad tutors processed!`);
    console.log(`- Created Users: ${res.createdCount}`);
    console.log(`- Updated Existing: ${res.updatedCount}`);
    console.log(`- Login password for all: ${res.password}`);
  } catch (err) {
    console.error('Seeding error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
}

if (require.main === module) {
  seed();
}

module.exports = { tutorsData, seedToMongo };
