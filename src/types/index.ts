export enum UserType {
  Admin = "ADMIN",
  Customer = "CUSTOMER",
  Operator = "OPERATOR",
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserType;
  passportNumber?: string;
  nationality?: string;
  createdAt: string;
}

export interface AuthUser extends User {
  token: string;
}

// Flight types
export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  id: string;
  name: string;
  code: string;
  logo: string;
}

export interface FlightClass {
  type: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  price: number;
  availableSeats: number;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: Airline;
  departureAirport: Airport;
  arrivalAirport: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in minutes
  distance: number; // in km
  aircraft: string;
  classes: FlightClass[];
  stops: Airport[];
  status:
    | "SCHEDULED"
    | "DELAYED"
    | "CANCELLED"
    | "BOARDING"
    | "IN_AIR"
    | "LANDED"
    | "DIVERTED";
}

// Booking types
export interface Passenger {
  id?: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  passportNumber?: string;
  nationality?: string;
  specialRequests?: string;
}

export interface Seat {
  id: string;
  row: number;
  column: string;
  status: "AVAILABLE" | "OCCUPIED" | "SELECTED" | "RESERVED";
  type: "WINDOW" | "MIDDLE" | "AISLE";
  price: number;
  extraLegroom: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  flight: Flight;
  bookingReference: string;
  bookingStatus: "PENDING" | "CONFIRMED" | "CANCELLED";
  passengers: Passenger[];
  seats: Seat[];
  classType: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  totalPrice: number;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  createdAt: string;
  checkedIn: boolean;
}

// Search types
export interface SearchParams {
  departureAirport?: string;
  arrivalAirport?: string;
  departureDate?: string;
  returnDate?: string | null;
  passengers?: number;
  classType?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  directFlightsOnly?: boolean;
  maxPrice?: number;
  airlines?: string[];
}

// Payment types
export interface PaymentMethod {
  id: string;
  type: "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL";
  cardNumber?: string;
  expiryDate?: string;
  cardHolderName?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentDate: string;
  transactionId: string;
}

export type NotificationType = "success" | "error";
