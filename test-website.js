const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failCount++;
  }
}

console.log('--- RUNNING GJS MULTI SPECIALTY HOSPITAL VERIFICATION SUITE ---\n');

// 1. Verify 7 Core Pages + 404
console.log('1. Checking Core Pages...');
const requiredPages = [
  'index.html',
  'about.html',
  'facilities.html',
  'specialities.html',
  'gallery.html',
  'help.html',
  'contact.html',
  '404.html'
];

requiredPages.forEach(page => {
  const fullPath = path.join(ROOT, page);
  const exists = fs.existsSync(fullPath);
  assert(exists, `Page file exists: ${page}`);
  if (exists) {
    const content = fs.readFileSync(fullPath, 'utf8');
    assert(content.includes('<title>'), `${page} has <title> tag`);
    assert(content.includes('GJS Multi Specialty Hospital'), `${page} contains Hospital Name`);
    assert(content.includes('7981225781'), `${page} contains Phone 7981225781`);
    assert(content.includes('gjshospitalvizag@gmail.com'), `${page} contains Email`);
  }
});

// 2. Verify 15 Facilities
console.log('\n2. Checking 15 Verified Facilities...');
const verifiedFacilities = [
  { name: '50-bed inpatient services', file: 'facilities/inpatient-beds.jpg' },
  { name: '24/7 emergency services', file: 'facilities/emergency.jpg' },
  { name: 'Intensive Care Unit (ICU)', file: 'facilities/icu.jpg' },
  { name: 'Suite rooms', file: 'facilities/suite-room.jpg' },
  { name: 'Single rooms', file: 'facilities/single-room.jpg' },
  { name: 'General wards', file: 'facilities/general-ward.jpg' },
  { name: 'Sharing wards', file: 'facilities/sharing-ward.jpg' },
  { name: '24/7 pharmacy', file: 'facilities/pharmacy.jpg' },
  { name: 'Laboratory services', file: 'facilities/laboratory.jpg' },
  { name: 'ECG', file: 'facilities/ecg.jpg' },
  { name: 'Ultrasound', file: 'facilities/ultrasound.jpg' },
  { name: 'Advanced operation theatre with laparoscopy', file: 'facilities/operation-theatre.jpg' },
  { name: 'Round-the-clock experienced nursing staff', file: 'facilities/nursing.jpg' },
  { name: '24-hour ambulance services', file: 'facilities/ambulance.jpg' },
  { name: 'Child and adult vaccination', file: 'facilities/vaccination.jpg' }
];

const facilitiesHtml = fs.readFileSync(path.join(ROOT, 'facilities.html'), 'utf8');
verifiedFacilities.forEach(f => {
  const imgPath = path.join(ROOT, 'assets', 'images', f.file);
  assert(fs.existsSync(imgPath), `Facility image exists: assets/images/${f.file}`);
  assert(facilitiesHtml.toLowerCase().includes(f.name.toLowerCase().substring(0, 10)), `Facility represented in facilities.html: ${f.name}`);
});

// 3. Verify 15 Specialities
console.log('\n3. Checking 15 Medical Specialities...');
const verifiedSpecialities = [
  { name: 'General Medicine', file: 'specialities/general-medicine.jpg' },
  { name: 'General and Laparoscopic Surgery', file: 'specialities/laparoscopic-surgery.jpg' },
  { name: 'Gynaecology and Obstetrics', file: 'specialities/gynaecology-obstetrics.jpg' },
  { name: 'Pediatrics', file: 'specialities/pediatrics.jpg' },
  { name: 'Orthopaedics', file: 'specialities/orthopaedics.jpg' },
  { name: 'Pulmonology', file: 'specialities/pulmonology.jpg' },
  { name: 'ENT', file: 'specialities/ent.jpg' },
  { name: 'Ophthalmology', file: 'specialities/ophthalmology.jpg' },
  { name: 'Nephrology', file: 'specialities/nephrology.jpg' },
  { name: 'Cardiology', file: 'specialities/cardiology.jpg' },
  { name: 'Neurology', file: 'specialities/neurology.jpg' },
  { name: 'Urology', file: 'specialities/urology.jpg' },
  { name: 'Gastroenterology', file: 'specialities/gastroenterology.jpg' },
  { name: 'Geriatrics', file: 'specialities/geriatrics.jpg' },
  { name: 'Endocrinology and Diabetes', file: 'specialities/endocrinology-diabetes.jpg' }
];

const specialitiesHtml = fs.readFileSync(path.join(ROOT, 'specialities.html'), 'utf8');
verifiedSpecialities.forEach(s => {
  const imgPath = path.join(ROOT, 'assets', 'images', s.file);
  assert(fs.existsSync(imgPath), `Speciality image exists: assets/images/${s.file}`);
  assert(specialitiesHtml.includes(s.name), `Speciality present in specialities.html: ${s.name}`);
});

// 4. Verify Doctor Name
console.log('\n4. Checking Verified Doctor Name...');
const doctorName = 'Dr. Abhilash Jain Bhansali';
assert(facilitiesHtml.includes(doctorName) || specialitiesHtml.includes(doctorName), `Doctor name used in site`);
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
assert(indexHtml.includes(doctorName), `Doctor name on homepage: ${doctorName}`);
const aboutHtml = fs.readFileSync(path.join(ROOT, 'about.html'), 'utf8');
assert(aboutHtml.includes(doctorName), `Doctor name on about page: ${doctorName}`);

// 5. Verify All Local Image References in HTML Files
console.log('\n5. Checking All Local Image References in HTML Files...');
const allHtmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
allHtmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const imgRegex = /src="([^"]+)"/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const src = match[1];
    if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:')) {
      const cleanSrc = src.split('?')[0];
      const localFile = path.join(ROOT, cleanSrc);
      assert(fs.existsSync(localFile), `Image in ${file} exists: ${src}`);
    }
  }
});

console.log(`\n====================================================`);
console.log(`  TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`====================================================`);

if (failCount > 0) {
  process.exit(1);
}
