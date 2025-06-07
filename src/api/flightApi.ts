import axios from 'axios';
import { Flight, SearchParams, Airport, Airline } from '../types';

// In a real app, this would be from environment variables
const API_BASE_URL = 'https://api.skywayair.com/api/v1';

// Mock data
import { mockFlights, mockAirports, mockAirlines } from './mockData';

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

// Flight API functions
export const flightApi = {
  // Search flights
  searchFlights: async (params: SearchParams): Promise<Flight[]> => {
    try {
      // In a real app, this would be a real API call
      // const response = await api.get('/flights/search', { params });
      // return response.data;
      
      // Mock implementation for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter flights based on search params
      let filteredFlights = [...mockFlights];
      
      if (params.departureAirport) {
        filteredFlights = filteredFlights.filter(
          flight => flight.departureAirport.code === params.departureAirport
        );
      }
      
      if (params.arrivalAirport) {
        filteredFlights = filteredFlights.filter(
          flight => flight.arrivalAirport.code === params.arrivalAirport
        );
      }
      
      if (params.classType) {
        filteredFlights = filteredFlights.filter(flight =>
          flight.classes.some(c => c.type === params.classType)
        );
      }
      
      if (params.directFlightsOnly) {
        filteredFlights = filteredFlights.filter(flight => flight.stops.length === 0);
      }
      
      if (params.maxPrice) {
        filteredFlights = filteredFlights.filter(flight =>
          flight.classes.some(c => c.price <= (params.maxPrice || Infinity))
        );
      }
      
      if (params.airlines && params.airlines.length > 0) {
        filteredFlights = filteredFlights.filter(flight =>
          params.airlines?.includes(flight.airline.id)
        );
      }
      
      return filteredFlights;
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  },

  // Get flight by ID
  getFlightById: async (flightId: string): Promise<Flight> => {
    try {
      // In a real app, this would be a real API call
      // const response = await api.get(`/flights/${flightId}`);
      // return response.data;
      
      // Mock implementation for demo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const flight = mockFlights.find(f => f.id === flightId);
      if (!flight) {
        throw new Error('Flight not found');
      }
      
      return flight;
    } catch (error) {
      console.error(`Error fetching flight ${flightId}:`, error);
      throw error;
    }
  },

  // Get airports
  getAirports: async (query?: string): Promise<Airport[]> => {
    try {
      // In a real app, this would be a real API call
      // const response = await api.get('/airports', { params: { query } });
      // return response.data;
      
      // Mock implementation for demo
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!query) {
        return mockAirports;
      }
      
      const lowercaseQuery = query.toLowerCase();
      return mockAirports.filter(
        airport =>
          airport.code.toLowerCase().includes(lowercaseQuery) ||
          airport.name.toLowerCase().includes(lowercaseQuery) ||
          airport.city.toLowerCase().includes(lowercaseQuery) ||
          airport.country.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error fetching airports:', error);
      throw error;
    }
  },

  // Get airlines
  getAirlines: async (): Promise<Airline[]> => {
    try {
      // In a real app, this would be a real API call
      // const response = await api.get('/airlines');
      // return response.data;
      
      // Mock implementation for demo
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockAirlines;
    } catch (error) {
      console.error('Error fetching airlines:', error);
      throw error;
    }
  }
};