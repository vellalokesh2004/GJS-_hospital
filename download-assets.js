const https = require('https');
const fs = require('fs');
const path = require('path');

const imageList = [
  // Facilities (15 items)
  {
    folder: 'facilities',
    file: 'inpatient-beds.jpg',
    url: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&h=600&fit=crop&q=80',
    title: '50-Bed Inpatient Services'
  },
  {
    folder: 'facilities',
    file: 'emergency.jpg',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop&q=80',
    title: '24/7 Emergency Services'
  },
  {
    folder: 'facilities',
    file: 'icu.jpg',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&h=600&fit=crop&q=80',
    title: 'Intensive Care Unit (ICU)'
  },
  {
    folder: 'facilities',
    file: 'suite-room.jpg',
    url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop&q=80',
    title: 'Suite Rooms'
  },
  {
    folder: 'facilities',
    file: 'single-room.jpg',
    url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop&q=80',
    title: 'Single Rooms'
  },
  {
    folder: 'facilities',
    file: 'general-ward.jpg',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop&q=80',
    title: 'General Wards'
  },
  {
    folder: 'facilities',
    file: 'sharing-ward.jpg',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop&q=80',
    title: 'Sharing Wards'
  },
  {
    folder: 'facilities',
    file: 'pharmacy.jpg',
    url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop&q=80',
    title: '24/7 Pharmacy'
  },
  {
    folder: 'facilities',
    file: 'laboratory.jpg',
    url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=600&fit=crop&q=80',
    title: 'Laboratory Services'
  },
  {
    folder: 'facilities',
    file: 'ecg.jpg',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop&q=80',
    title: 'ECG Diagnostics'
  },
  {
    folder: 'facilities',
    file: 'ultrasound.jpg',
    url: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=600&fit=crop&q=80',
    title: 'Ultrasound'
  },
  {
    folder: 'facilities',
    file: 'operation-theatre.jpg',
    url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop&q=80',
    title: 'Advanced Operation Theatre with Laparoscopy'
  },
  {
    folder: 'facilities',
    file: 'nursing.jpg',
    url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop&q=80',
    title: 'Round-the-clock Experienced Nursing Staff'
  },
  {
    folder: 'facilities',
    file: 'ambulance.jpg',
    url: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800&h=600&fit=crop&q=80',
    title: '24-Hour Ambulance Services'
  },
  {
    folder: 'facilities',
    file: 'vaccination.jpg',
    url: 'https://images.unsplash.com/photo-1632053001855-9261cb28c610?w=800&h=600&fit=crop&q=80',
    title: 'Child and Adult Vaccination'
  },

  // Specialities (15 items)
  {
    folder: 'specialities',
    file: 'general-medicine.jpg',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&h=600&fit=crop&q=80',
    title: 'General Medicine'
  },
  {
    folder: 'specialities',
    file: 'laparoscopic-surgery.jpg',
    url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop&q=80',
    title: 'General and Laparoscopic Surgery'
  },
  {
    folder: 'specialities',
    file: 'gynaecology-obstetrics.jpg',
    url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=600&fit=crop&q=80',
    title: 'Gynaecology and Obstetrics'
  },
  {
    folder: 'specialities',
    file: 'pediatrics.jpg',
    url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop&q=80',
    title: 'Pediatrics'
  },
  {
    folder: 'specialities',
    file: 'orthopaedics.jpg',
    url: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=800&h=600&fit=crop&q=80',
    title: 'Orthopaedics'
  },
  {
    folder: 'specialities',
    file: 'pulmonology.jpg',
    url: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&h=600&fit=crop&q=80',
    title: 'Pulmonology'
  },
  {
    folder: 'specialities',
    file: 'ent.jpg',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop&q=80',
    title: 'ENT'
  },
  {
    folder: 'specialities',
    file: 'ophthalmology.jpg',
    url: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?w=800&h=600&fit=crop&q=80',
    title: 'Ophthalmology'
  },
  {
    folder: 'specialities',
    file: 'nephrology.jpg',
    url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=600&fit=crop&q=80',
    title: 'Nephrology'
  },
  {
    folder: 'specialities',
    file: 'cardiology.jpg',
    url: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&h=600&fit=crop&q=80',
    title: 'Cardiology'
  },
  {
    folder: 'specialities',
    file: 'neurology.jpg',
    url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop&q=80',
    title: 'Neurology'
  },
  {
    folder: 'specialities',
    file: 'urology.jpg',
    url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&h=600&fit=crop&q=80',
    title: 'Urology'
  },
  {
    folder: 'specialities',
    file: 'gastroenterology.jpg',
    url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=600&fit=crop&q=80',
    title: 'Gastroenterology'
  },
  {
    folder: 'specialities',
    file: 'geriatrics.jpg',
    url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop&q=80',
    title: 'Geriatrics'
  },
  {
    folder: 'specialities',
    file: 'endocrinology-diabetes.jpg',
    url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&h=600&fit=crop&q=80',
    title: 'Endocrinology and Diabetes'
  },

  // Hospital & General
  {
    folder: 'hospital',
    file: 'hospital-building.jpg',
    url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&h=800&fit=crop&q=80',
    title: 'GJS Hospital Exterior'
  },
  {
    folder: 'hospital',
    file: 'reception.jpg',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1000&h=667&fit=crop&q=80',
    title: 'Reception & Waiting Lounge'
  },
  {
    folder: 'hospital',
    file: 'doctor-profile.jpg',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=600&fit=crop&q=80',
    title: 'Dr. Abhilash Jain Bhansali'
  },
  {
    folder: 'hospital',
    file: 'hero-banner.jpg',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&h=700&fit=crop&q=80',
    title: 'Hospital Hero Banner'
  },
  {
    folder: 'hospital',
    file: 'consultation-room.jpg',
    url: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=600&fit=crop&q=80',
    title: 'Doctor Consultation Room'
  },
  {
    folder: 'hospital',
    file: 'care-team.jpg',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&h=600&fit=crop&q=80',
    title: 'Medical Care Team'
  }
];

const basePath = path.join(__dirname, 'assets', 'images');

function download(item) {
  return new Promise((resolve, reject) => {
    const destDir = path.join(basePath, item.folder);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    const destFile = path.join(destDir, item.file);
    
    // Follow redirects
    function getWithRedirect(url) {
      https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          getWithRedirect(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download ${item.title}: HTTP ${res.statusCode}`));
          return;
        }
        const fileStream = fs.createWriteStream(destFile);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`[OK] Downloaded: ${item.folder}/${item.file} (${item.title})`);
          resolve(destFile);
        });
      }).on('error', (err) => {
        reject(err);
      });
    }

    getWithRedirect(item.url);
  });
}

async function run() {
  console.log(`Starting download of ${imageList.length} healthcare assets...`);
  let successCount = 0;
  for (const item of imageList) {
    try {
      await download(item);
      successCount++;
    } catch (err) {
      console.error(`[Error] Failed ${item.folder}/${item.file}:`, err.message);
    }
  }
  console.log(`Finished: ${successCount}/${imageList.length} downloaded successfully.`);
}

run();
