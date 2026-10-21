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
