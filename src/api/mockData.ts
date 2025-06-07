import { Flight, Airport, Airline, Booking } from '../types';

// Mock Airports
export const mockAirports: Airport[] = [
  {
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'United States'
  },
  {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'United States'
  },
  {
    code: 'LHR',
    name: 'Heathrow Airport',
    city: 'London',
    country: 'United Kingdom'
  },
  {
    code: 'CDG',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France'
  },
  {
    code: 'SIN',
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore'
  },
  {
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates'
  },
  {
    code: 'DEL',
    name: 'Indira Gandhi International Airport',
    city: 'Delhi',
    country: 'India'
  },
  {
    code: 'BOM',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    city: 'Mumbai',
    country: 'India'
  }
];

// Mock Airlines
export const mockAirlines: Airline[] = [
  {
    id: 'al1',
    name: 'SkyWay Airlines',
    code: 'SW',
    logo: 'https://images.pexels.com/photos/388415/pexels-photo-388415.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'al2',
    name: 'Blue Horizon',
    code: 'BH',
    logo: 'https://images.pexels.com/photos/388415/pexels-photo-388415.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'al3',
    name: 'Global Airways',
    code: 'GA',
    logo: 'https://images.pexels.com/photos/388415/pexels-photo-388415.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'al4',
    name: 'Oceanic Airlines',
    code: 'OA',
    logo: 'https://images.pexels.com/photos/388415/pexels-photo-388415.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

// Mock Flights
export const mockFlights: Flight[] = [
  {
    id: 'f1',
    flightNumber: 'SW123',
    airline: mockAirlines[0],
    departureAirport: mockAirports[0],
    arrivalAirport: mockAirports[1],
    departureTime: '2025-07-15T08:00:00Z',
    arrivalTime: '2025-07-15T11:30:00Z',
    duration: 330,
    distance: 3983,
    aircraft: 'Boeing 787-9',
    classes: [
      { type: 'ECONOMY', price: 299, availableSeats: 120 },
      { type: 'PREMIUM_ECONOMY', price: 499, availableSeats: 40 },
      { type: 'BUSINESS', price: 1299, availableSeats: 20 },
      { type: 'FIRST', price: 2499, availableSeats: 8 }
    ],
    stops: [],
    status: 'SCHEDULED'
  },
  {
    id: 'f2',
    flightNumber: 'BH456',
    airline: mockAirlines[1],
    departureAirport: mockAirports[0],
    arrivalAirport: mockAirports[1],
    departureTime: '2025-07-15T10:15:00Z',
    arrivalTime: '2025-07-15T13:45:00Z',
    duration: 330,
    distance: 3983,
    aircraft: 'Airbus A350-900',
    classes: [
      { type: 'ECONOMY', price: 325, availableSeats: 150 },
      { type: 'PREMIUM_ECONOMY', price: 525, availableSeats: 35 },
      { type: 'BUSINESS', price: 1399, availableSeats: 30 },
    ],
    stops: [],
    status: 'SCHEDULED'
  },
  {
    id: 'f3',
    flightNumber: 'GA789',
    airline: mockAirlines[2],
    departureAirport: mockAirports[0],
    arrivalAirport: mockAirports[1],
    departureTime: '2025-07-15T14:30:00Z',
    arrivalTime: '2025-07-15T19:15:00Z',
    duration: 405,
    distance: 3983,
    aircraft: 'Boeing 777-300ER',
    classes: [
      { type: 'ECONOMY', price: 275, availableSeats: 200 },
      { type: 'BUSINESS', price: 1250, availableSeats: 40 },
    ],
    stops: [mockAirports[3]],
    status: 'SCHEDULED'
  },
  {
    id: 'f4',
    flightNumber: 'OA234',
    airline: mockAirlines[3],
    departureAirport: mockAirports[0],
    arrivalAirport: mockAirports[1],
    departureTime: '2025-07-15T18:45:00Z',
    arrivalTime: '2025-07-15T22:10:00Z',
    duration: 325,
    distance: 3983,
    aircraft: 'Airbus A321neo',
    classes: [
      { type: 'ECONOMY', price: 249, availableSeats: 170 },
      { type: 'PREMIUM_ECONOMY', price: 449, availableSeats: 30 },
      { type: 'BUSINESS', price: 1099, availableSeats: 16 },
    ],
    stops: [],
    status: 'SCHEDULED'
  },
  {
    id: 'f5',
    flightNumber: 'SW456',
    airline: mockAirlines[0],
    departureAirport: mockAirports[1],
    arrivalAirport: mockAirports[0],
    departureTime: '2025-07-22T09:15:00Z',
    arrivalTime: '2025-07-22T17:45:00Z',
    duration: 330,
    distance: 3983,
    aircraft: 'Boeing 787-9',
    classes: [
      { type: 'ECONOMY', price: 319, availableSeats: 110 },
      { type: 'PREMIUM_ECONOMY', price: 519, availableSeats: 35 },
      { type: 'BUSINESS', price: 1349, availableSeats: 18 },
      { type: 'FIRST', price: 2599, availableSeats: 6 }
    ],
    stops: [],
    status: 'SCHEDULED'
  },
  {
    id: 'f6',
    flightNumber: 'BH789',
    airline: mockAirlines[1],
    departureAirport: mockAirports[2],
    arrivalAirport: mockAirports[3],
    departureTime: '2025-07-15T07:30:00Z',
    arrivalTime: '2025-07-15T10:45:00Z',
    duration: 195,
    distance: 344,
    aircraft: 'Airbus A320neo',
    classes: [
      { type: 'ECONOMY', price: 149, availableSeats: 150 },
      { type: 'BUSINESS', price: 449, availableSeats: 12 },
    ],
    stops: [],
    status: 'SCHEDULED'
  },
  {
    id: 'f7',
    flightNumber: 'GA345',
    airline: mockAirlines[2],
    departureAirport: mockAirports[4],
    arrivalAirport: mockAirports[5],
    departureTime: '2025-07-16T23:50:00Z',
    arrivalTime: '2025-07-17T03:30:00Z',
    duration: 460,
    distance: 3644,
    aircraft: 'Boeing 777-200LR',
    classes: [
      { type: 'ECONOMY', price: 499, availableSeats: 220 },
      { type: 'PREMIUM_ECONOMY', price: 899, availableSeats: 40 },
      { type: 'BUSINESS', price: 2499, availableSeats: 30 },
      { type: 'FIRST', price: 4999, availableSeats: 8 }
    ],
    stops: [],
    status: 'SCHEDULED'
  },
  {
    id: 'f8',
    flightNumber: 'OA678',
    airline: mockAirlines[3],
    departureAirport: mockAirports[6],
    arrivalAirport: mockAirports[7],
    departureTime: '2025-07-18T06:15:00Z',
    arrivalTime: '2025-07-18T08:30:00Z',
    duration: 135,
    distance: 1148,
    aircraft: 'Airbus A320',
    classes: [
      { type: 'ECONOMY', price: 89, availableSeats: 150 },
      { type: 'BUSINESS', price: 289, availableSeats: 12 },
    ],
    stops: [],
    status: 'SCHEDULED'
  }
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: 'b1',
    userId: '1',
    flightId: 'f1',
    flight: mockFlights[0],
    bookingReference: 'SKYWAY1234',
    bookingStatus: 'CONFIRMED',
    passengers: [
      {
        id: 'p1',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'MALE',
        dateOfBirth: '1985-05-15',
        passportNumber: 'A12345678',
        nationality: 'United States',
      }
    ],
    seats: [
      {
        id: 's1',
        row: 15,
        column: 'A',
        status: 'OCCUPIED',
        type: 'WINDOW',
        price: 15,
        extraLegroom: false
      }
    ],
    classType: 'ECONOMY',
    totalPrice: 314,
    paymentStatus: 'PAID',
    createdAt: '2025-06-20T14:30:00Z',
    checkedIn: false
  },
  {
    id: 'b2',
    userId: '1',
    flightId: 'f3',
    flight: mockFlights[2],
    bookingReference: 'SKYWAY5678',
    bookingStatus: 'CONFIRMED',
    passengers: [
      {
        id: 'p2',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'MALE',
        dateOfBirth: '1985-05-15',
        passportNumber: 'A12345678',
        nationality: 'United States',
      },
      {
        id: 'p3',
        firstName: 'Jane',
        lastName: 'Doe',
        gender: 'FEMALE',
        dateOfBirth: '1987-08-22',
        passportNumber: 'B98765432',
        nationality: 'United States',
      }
    ],
    seats: [
      {
        id: 's2',
        row: 20,
        column: 'B',
        status: 'OCCUPIED',
        type: 'MIDDLE',
        price: 0,
        extraLegroom: false
      },
      {
        id: 's3',
        row: 20,
        column: 'C',
        status: 'OCCUPIED',
        type: 'AISLE',
        price: 10,
        extraLegroom: false
      }
    ],
    classType: 'ECONOMY',
    totalPrice: 560,
    paymentStatus: 'PAID',
    createdAt: '2025-06-25T09:15:00Z',
    checkedIn: false
  }
];