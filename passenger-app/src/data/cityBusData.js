/** Static demo data — aligned with CityBus reference */

export const USER = { name: 'Arjun Mehta', college: 'Engineering College' }

export const ROUTES = [
  {
    id: 'R1',
    name: 'University Express',
    type: 'student',
    color: '#1a56db',
    stops: ['City Center', 'Engineering College', 'Arts University', 'Medical College', 'Tech Park'],
    times: ['7:00', '7:15', '7:30', '7:45', '8:00'],
    fare: 15,
  },
  {
    id: 'R2',
    name: 'City Circular',
    type: 'regular',
    color: '#3b6d11',
    stops: ['Central Station', 'Market', 'Hospital', 'Mall', 'Airport'],
    times: ['6:00', '6:20', '6:40', '7:00', '7:20'],
    fare: 25,
  },
  {
    id: 'R3',
    name: 'School Special',
    type: 'student',
    color: '#854f0b',
    stops: ['Residential Zone', 'Primary School', 'Secondary School', 'International School'],
    times: ['7:30', '7:45', '8:00', '8:15'],
    fare: 10,
  },
  {
    id: 'R4',
    name: 'Metro Connect',
    type: 'regular',
    color: '#533489',
    stops: ['Metro North', 'Bus Depot', 'IT Hub', 'SEZ', 'Port'],
    times: ['8:00', '8:15', '8:30', '8:45', '9:00'],
    fare: 30,
  },
]

export const BUSES = [
  {
    id: 'KA-01-F-1234',
    route: 'R1',
    driver: 'Ramesh Kumar',
    conductor: 'Priya S',
    occupancy: 28,
    capacity: 40,
    lat: 12.97,
    lng: 77.58,
    nextStop: 'Arts University',
    eta: 6,
    status: 'on-time',
  },
  {
    id: 'KA-01-F-5678',
    route: 'R2',
    driver: 'Suresh Babu',
    conductor: 'Meena R',
    occupancy: 35,
    capacity: 45,
    lat: 12.96,
    lng: 77.6,
    nextStop: 'Hospital',
    eta: 3,
    status: 'on-time',
  },
  {
    id: 'KA-01-G-2345',
    route: 'R3',
    driver: 'Kumar Das',
    conductor: 'Anita K',
    occupancy: 18,
    capacity: 35,
    lat: 12.98,
    lng: 77.57,
    nextStop: 'Secondary School',
    eta: 8,
    status: 'delayed',
  },
  {
    id: 'KA-01-G-6789',
    route: 'R4',
    driver: 'Vijay S',
    conductor: 'Ravi M',
    occupancy: 40,
    capacity: 45,
    lat: 12.95,
    lng: 77.62,
    nextStop: 'IT Hub',
    eta: 2,
    status: 'on-time',
  },
]

export const TICKETS = [
  {
    id: 'TKT-2024-8821',
    route: 'R1',
    from: 'City Center',
    to: 'Medical College',
    seat: '12A',
    date: '05 Apr 2026',
    time: '7:00 AM',
    fare: 15,
    status: 'active',
  },
  {
    id: 'TKT-2024-7642',
    route: 'R2',
    from: 'Central Station',
    to: 'Mall',
    seat: '7B',
    date: '04 Apr 2026',
    time: '6:00 AM',
    fare: 25,
    status: 'used',
  },
]

export const PASSES = [
  {
    name: 'Arjun Mehta',
    type: 'Monthly Student Pass',
    college: 'Engineering College',
    valid: '30 Apr 2026',
    id: 'PASS-2026-0441',
  },
  {
    name: 'Priya Nair',
    type: 'Semester Pass',
    college: 'Arts University',
    valid: '30 Jun 2026',
    id: 'PASS-2026-0389',
  },
]

/** Seats unavailable for new booking */
export const BOOKED_SEAT_IDS = new Set(['5A', '5B', '5C', '8D', '12B', '12C', '15A', '19D', '22A', '22B'])

/** Passenger's existing seat on active trip — not selectable for new booking */
export const YOUR_SEAT_ID = '12A'

export const ROUTE_PATHS = [
  'M80,320 Q200,280 340,220 Q420,190 500,180 Q600,170 720,160',
  'M80,180 Q200,200 340,240 Q420,260 500,280 Q580,290 720,280',
  'M80,80 Q200,100 380,120 Q460,130 580,140',
  'M80,380 Q240,350 400,340 Q520,330 680,360 Q710,370 720,380',
]

export const ROUTE_COLORS = ['#378add', '#3b6d11', '#854f0b', '#533489']

export const STOP_SETS = [
  [
    { x: 80, y: 320 },
    { x: 220, y: 280 },
    { x: 380, y: 220 },
    { x: 510, y: 180 },
    { x: 720, y: 160 },
  ],
  [
    { x: 80, y: 180 },
    { x: 220, y: 205 },
    { x: 370, y: 245 },
    { x: 500, y: 278 },
    { x: 720, y: 280 },
  ],
  [
    { x: 80, y: 80 },
    { x: 220, y: 105 },
    { x: 400, y: 125 },
    { x: 580, y: 140 },
  ],
  [
    { x: 80, y: 380 },
    { x: 280, y: 350 },
    { x: 440, y: 340 },
    { x: 580, y: 352 },
    { x: 720, y: 380 },
  ],
]

export const MAP_W = 860
export const MAP_H = 420

export const PASS_TYPES = [
  {
    id: 'pt-student-monthly',
    name: 'Student Monthly Pass',
    price: 450,
    validity: '30 days',
    perks: ['Unlimited student routes', '10% off regular routes'],
  },
  {
    id: 'pt-semester',
    name: 'Semester Pass',
    price: 2200,
    validity: '180 days',
    perks: ['Priority booking window', 'Unlimited student routes'],
  },
  {
    id: 'pt-city-regular',
    name: 'City Regular Pass',
    price: 900,
    validity: '30 days',
    perks: ['Unlimited regular routes'],
  },
]
