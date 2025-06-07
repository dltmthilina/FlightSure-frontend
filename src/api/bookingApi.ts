import axios from 'axios';
import { Booking, Passenger, Seat } from '../types';

// In a real app, this would be from environment variables
const API_BASE_URL = 'https://api.skywayair.com/api/v1';

// Mock data
import { mockBookings, mockFlights } from './mockData';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use(config => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Booking API functions
export const bookingApi = {
  // Get user's bookings
  getUserBookings: async (): Promise<Booking[]> => {
    try {
      // In a real app, this would be a real API call
      // const response = await api.get('/bookings');
      // return response.data;
      
      // Mock implementation for demo
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockBookings;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId: string): Promise<Booking> => {
    try {
      // In a real app, this would be a real API call
      // const response = await api.get(`/bookings/${bookingId}`);
      // return response.data;
      
      // Mock implementation for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const booking = mockBookings.find(b => b.id === bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      return booking;
    } catch (error) {
      console.error(`Error fetching booking ${bookingId}:`, error);
      throw error;
    }
  },

  // Create booking
  createBooking: async (
    flightId: string,
    classType: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST',
    passengers: Passenger[],
    seats: Seat[]
  ): Promise<Booking> => {
    try {
      // In a real app, this would be a real API call
      // const response = await api.post('/bookings', { flightId, classType, passengers, seats });
      // return response.data;
      
      // Mock implementation for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const flight = mockFlights.find(f => f.id === flightId);
      if (!flight) {
        throw new Error('Flight not found');
      }
      
      const flightClass = flight.classes.find(c => c.type === classType);
      if (!flightClass) {
        throw new Error('Flight class not found');
      }
      
      // Calculate total price
      const baseFare = flightClass.price * passengers.length;
      const seatsFare = seats.reduce((total, seat) => total + seat.price, 0);
      const taxes = Math.round(baseFare * 0.15); // Assuming 15% tax
      const totalPrice = baseFare + seatsFare + taxes;
      
      // Generate random booking reference
      const bookingReference = 'SKYWAY' + Math.floor(10000 + Math.random() * 90000);
      
      const newBooking: Booking = {
        id: 'b' + Date.now(),
        userId: '1', // Mock user ID
        flightId,
        flight,
        bookingReference,
        bookingStatus: 'PENDING',
        passengers,
        seats,
        classType,
        totalPrice,
        paymentStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        checkedIn: false
      };
      
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (
    bookingId: string,
    status: 'CONFIRMED' | 'CANCELLED'
  ): Promise<Booking> => {
    try {
      // In a real app, this would be a real API call
      // const response = await api.patch(`/bookings/${bookingId}`, { bookingStatus: status });
      // return response.data;
      
      // Mock implementation for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const booking = mockBookings.find(b => b.id === bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      booking.bookingStatus = status;
      return { ...booking };
    } catch (error) {
      console.error(`Error updating booking ${bookingId}:`, error);
      throw error;
    }
  },

  // Process payment for booking
  processPayment: async (
    bookingId: string,
    paymentDetails: any
  ): Promise<Booking> => {
    try {
      // In a real app, this would be a real API call
      // const response = await api.post(`/bookings/${bookingId}/payment`, paymentDetails);
      // return response.data;
      
      // Mock implementation for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const booking = mockBookings.find(b => b.id === bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      booking.paymentStatus = 'PAID';
      booking.bookingStatus = 'CONFIRMED';
      
      return { ...booking };
    } catch (error) {
      console.error(`Error processing payment for booking ${bookingId}:`, error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<Booking> => {
    try {
      // In a real app, this would be a real API call
      // const response = await api.post(`/bookings/${bookingId}/cancel`);
      // return response.data;
      
      // Mock implementation for demo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const booking = mockBookings.find(b => b.id === bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      booking.bookingStatus = 'CANCELLED';
      if (booking.paymentStatus === 'PAID') {
        booking.paymentStatus = 'REFUNDED';
      }
      
      return { ...booking };
    } catch (error) {
      console.error(`Error cancelling booking ${bookingId}:`, error);
      throw error;
    }
  }
};