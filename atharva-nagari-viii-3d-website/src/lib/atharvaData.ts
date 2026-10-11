import { HotspotItem } from '@/types/atharva';

export const ATHARVA_PROJECT_DETAILS = {
  name: 'Atharva Nagari VIII',
  builder: 'Atharva Infrastructures',
  tagline: 'Luxury Living in the Heart of Besa',
  location: 'Prime Besa–Pipla Road, Pipla, Nagpur – 440037',
  office: '3rd Floor, Above Shyam Mart, Besa–Pipla Road, Nagpur',
  reraNo: 'P50500053130',
  phone: '+91 82618 32689',
  email: 'sales@atharvainfrastructuresnagpur.com',
  website: 'https://atharvainfrastructuresnagpur.com/atharva-nagari-viii/',
  whatsappNumber: '918261832689',
  trackRecord: '17+ Years of Township Excellence in Nagpur',
  configurations: ['2 BHK Luxury Residences', '3 BHK Royal Suites', 'Exclusive Penthouses'],
  towers: '12-Storey High-Rise Towers with Symmetrical Cantilever Framing',
  amenitiesCount: '25+ World-Class Township Amenities',
};

export const HOTSPOTS_DATA: HotspotItem[] = [
  {
    id: 'grand-gate',
    title: 'Grand Entrance Portal & Security Cabin',
    category: 'Architecture',
    position: [0, 2.5, 36],
    description:
      'Imposing architectural entryway with illuminated "ATHARVA NAGARI VIII" typography, dual RFID automated boom barriers, CCTV surveillance, and 24/7 security cabin on Besa-Pipla Road.',
    features: [
      'Dual RFID Automated Boom Barriers',
      '24/7 Security Cabin with Intercom & CCTV',
      'Dedicated Ingress & Egress Lanes with Paved Driveways',
      'Reflective Wet-Asphalt Boulevard & Zebra Crossings',
    ],
    specs: '60-ft wide central access road connecting directly to Besa-Pipla highway hub.',
    image: '/images/atharva/gate.jpg',
  },
  {
    id: 'podium-park',
    title: 'Podium Garden & Children’s Play Arena',
    category: 'Amenities',
    position: [-16, 2, 8],
    description:
      'Lush vehicle-free podium landscape featuring interactive children’s play structures (multi-slides, swings), circular amphitheater lawn, seating gazebos, and designer bollard lighting.',
    features: [
      'Kids Multi-Play Castle with Safe Rubberized EPDM Turf',
      'Curved Landscaped Lawn & Seating Pergolas',
      'Tall Royal Palm Trees & Flowering Shrubs',
      'Jogging & Acupressure Walking Tracks',
    ],
    specs: 'Over 15,000 sq.ft. of dedicated green recreation zone for families.',
    image: '/images/atharva/playarea.jpg',
  },
  {
    id: 'towers-facade',
    title: '12-Storey Architectural Towers',
    category: 'Architecture',
    position: [0, 18, -4],
    description:
      'Striking contemporary high-rise silhouette featuring alternating white stucco cantilevered frames, rich teak wood-textured accents, glass railings, and illuminated rooftop crowns.',
    features: [
      'Earthquake-Resistant RCC Framed Structure',
      'Double-Height Grand Entrance Lobbies with Concierge',
      'Energy-Efficient Architectural Facade Lighting',
      'Optimal Cross-Ventilation with Besa Skyline Views',
    ],
    specs: 'Ground + 12 Residential Floors with podium and covered stilt parking.',
    image: '/images/atharva/elevation.png',
  },
  {
    id: 'sample-flat-3bhk',
    title: 'Luxury 3 BHK Sample Flat (12th Floor)',
    category: 'Sample Flat',
    position: [12, 28, -6],
    description:
      'Walkable 3 BHK model flat complete with an expansive living-dining lounge, false ceiling cove lighting, open modular kitchen, teak wood master bedroom, and wide sunset balcony.',
    features: [
      'Italian Statuario Marble / Vitrified Tile Options',
      'Modern Modular Kitchen with Breakfast Island & Chimney Point',
      'Master Bedroom with Rich Natural Wood Flooring',
      'Expansive French Windows Leading to Private Skyline Balcony',
    ],
    specs: '1,450 – 1,750 Sq.Ft. Carpet Area options with premium fittings.',
    image: '/images/atharva/poster.webp',
  },
  {
    id: 'highspeed-elevators',
    title: 'High-Speed Elevators & Transit Hub',
    category: 'Amenities',
    position: [0, 4, -5],
    description:
      'World-class automatic passenger and stretcher elevators with stainless steel mirror cabins, ARD battery backup, smooth vertical travel, and digital floor indicators.',
    features: [
      '2.0 m/s High-Speed Smooth Kinematic Motion',
      'Automatic Rescue Device (ARD) during power failure',
      'Keycard & Contactless Floor Access Integration',
      'Full 12-Floor Coverage from Covered Podium to Penthouse',
    ],
    specs: 'Dual elevator shafts per wing with 100% DG power backup.',
    image: '/images/atharva/aerial.png',
  },
  {
    id: 'clubhouse-pool',
    title: 'Clubhouse, Gym & Infinity Pool Deck',
    category: 'Amenities',
    position: [22, 3, 10],
    description:
      'Exclusive residents-only clubhouse featuring a state-of-the-art gymnasium, indoor sports lounge (Table Tennis, Snooker), multipurpose party hall, and rooftop swimming pool.',
    features: [
      'Temperature-Controlled Rooftop Pool with Sun Loungers',
      'Cardio & Strength Training Air-Conditioned Gym',
      'Multi-Purpose Celebration Hall with Banquet Pantry',
      'Yoga & Meditation Terrace overlooking green belt',
    ],
    specs: 'Multi-level clubhouse facility reserved exclusively for Atharva residents.',
    image: '/images/atharva/aerial.png',
  },
];
