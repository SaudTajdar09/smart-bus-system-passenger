// Routes data - synchronized with passenger app
export const CONDUCTOR_ROUTES = [
  {
    id: 'R1',
    name: 'University Express',
    type: 'student',
    stops: ['City Center', 'Engineering College', 'Arts University', 'Medical College', 'Tech Park'],
    capacity: 40,
  },
  {
    id: 'R2',
    name: 'City Circular',
    type: 'regular',
    stops: ['Central Station', 'Market', 'Hospital', 'Mall', 'Airport'],
    capacity: 40,
  },
  {
    id: 'R3',
    name: 'School Special',
    type: 'student',
    stops: ['Residential Zone', 'Primary School', 'Secondary School', 'International School'],
    capacity: 40,
  },
  {
    id: 'R4',
    name: 'Metro Connect',
    type: 'regular',
    stops: ['Metro North', 'Bus Depot', 'IT Hub', 'SEZ', 'Port'],
    capacity: 40,
  },
]

// Mock passengers - initial state
export function buildInitialPassengers() {
  return [
    {
      id: 'TKT-001',
      seat: '1A',
      name: 'John Doe',
      route: 'R1',
      from: 'City Center',
      to: 'Tech Park',
      status: 'booked', // booked | boarded
      scanTime: null,
    },
    {
      id: 'TKT-002',
      seat: '2B',
      name: 'Jane Smith',
      route: 'R1',
      from: 'Engineering College',
      to: 'Tech Park',
      status: 'booked',
      scanTime: null,
    },
    {
      id: 'TKT-003',
      seat: '3A',
      name: 'Mike Johnson',
      route: 'R1',
      from: 'City Center',
      to: 'Medical College',
      status: 'booked',
      scanTime: null,
    },
    {
      id: 'TKT-004',
      seat: '4C',
      name: 'Sarah Williams',
      route: 'R1',
      from: 'Hospital',
      to: 'Airport',
      status: 'booked',
      scanTime: null,
    },
    {
      id: 'TKT-005',
      seat: '5D',
      name: 'Alex Brown',
      route: 'RT-101',
      from: 'Station',
      to: 'Market',
      status: 'booked',
      scanTime: null,
    },
    {
      id: 'TKT-006',
      seat: '6A',
      name: 'Emma Davis',
      route: 'RT-101',
      from: 'Tech Park',
      to: 'Airport',
      status: 'booked',
      scanTime: null,
    },
    {
      id: 'TKT-007',
      seat: '7B',
      name: 'David Lee',
      route: 'RT-102',
      from: 'Downtown',
      to: 'Mall',
      status: 'booked',
      scanTime: null,
    },
    {
      id: 'TKT-008',
      seat: '8C',
      name: 'Lisa Anderson',
      route: 'RT-102',
      from: 'Park',
      to: 'School',
      status: 'booked',
      scanTime: null,
    },
  ]
}

// Conductor profile
export const CURRENT_CONDUCTOR = {
  id: 'COND-001',
  name: 'Rajesh Kumar',
  badge: 'CB-2024-001',
  route: 'R1',
  shift: 'Morning',
}
