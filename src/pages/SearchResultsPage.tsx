import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Flight, SearchParams, Airline } from '../types';
import { flightApi } from '../api/flightApi';
import FlightCard from '../components/flight/FlightCard';
import { Sliders, BarChart2, ArrowUpDown } from 'lucide-react';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import AirportSearch from '../components/search/AirportSearch';

type SortOption = 'price_low' | 'price_high' | 'duration_low' | 'duration_high' | 'departure_early' | 'departure_late';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchParams>({
    departureAirport: searchParams.get('departureAirport') || undefined,
    arrivalAirport: searchParams.get('arrivalAirport') || undefined,
    departureDate: searchParams.get('departureDate') || undefined,
    returnDate: searchParams.get('returnDate') || null,
    passengers: searchParams.get('passengers') ? Number(searchParams.get('passengers')) : 1,
    classType: (searchParams.get('classType') as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST') || 'ECONOMY',
    directFlightsOnly: searchParams.get('directFlightsOnly') === 'true',
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    airlines: searchParams.getAll('airlines') || [],
  });
  
  const [sortBy, setSortBy] = useState<SortOption>('price_low');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch flights based on search params
  const { data: flights, isLoading, isError } = useQuery({
    queryKey: ['flights', filters],
    queryFn: () => flightApi.searchFlights(filters),
  });
  
  // Fetch airlines for filter
  const { data: airlines } = useQuery({
    queryKey: ['airlines'],
    queryFn: () => flightApi.getAirlines(),
  });
  
  // Apply sorting to flights
  const sortedFlights = flights ? [...flights].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return getFlightPrice(a) - getFlightPrice(b);
      case 'price_high':
        return getFlightPrice(b) - getFlightPrice(a);
      case 'duration_low':
        return a.duration - b.duration;
      case 'duration_high':
        return b.duration - a.duration;
      case 'departure_early':
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      case 'departure_late':
        return new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime();
      default:
        return 0;
    }
  }) : [];
  
  // Get flight price based on selected class
  const getFlightPrice = (flight: Flight): number => {
    const classInfo = flight.classes.find((c) => c.type === filters.classType);
    return classInfo?.price || flight.classes[0].price;
  };
  
  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'airlines' && Array.isArray(value)) {
          value.forEach((airline) => params.append(key, airline));
        } else {
          params.set(key, String(value));
        }
      }
    });
    
    setSearchParams(params);
  }, [filters, setSearchParams]);
  
  // Handle airline filter change
  const handleAirlineFilterChange = (airlineId: string) => {
    setFilters((prevFilters) => {
      const airlineIds = [...(prevFilters.airlines || [])];
      
      if (airlineIds.includes(airlineId)) {
        // Remove airline if already selected
        return {
          ...prevFilters,
          airlines: airlineIds.filter((id) => id !== airlineId),
        };
      } else {
        // Add airline if not selected
        return {
          ...prevFilters,
          airlines: [...airlineIds, airlineId],
        };
      }
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      departureAirport: searchParams.get('departureAirport') || undefined,
      arrivalAirport: searchParams.get('arrivalAirport') || undefined,
      departureDate: searchParams.get('departureDate') || undefined,
      returnDate: searchParams.get('returnDate') || null,
      passengers: searchParams.get('passengers') ? Number(searchParams.get('passengers')) : 1,
      classType: (searchParams.get('classType') as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST') || 'ECONOMY',
      directFlightsOnly: false,
      maxPrice: undefined,
      airlines: [],
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Search Results</h1>
          <p className="text-gray-600">
            {filters.departureAirport && filters.arrivalAirport
              ? `${filters.departureAirport} to ${filters.arrivalAirport}`
              : 'All flights'}
            {filters.departureDate && ` on ${filters.departureDate}`}
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters for desktop */}
          <div className="hidden lg:block w-64 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Filters</h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Price Range</h3>
              <div className="mb-2">
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={filters.maxPrice || 5000}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$100</span>
                  <span>${filters.maxPrice || 5000}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Airlines</h3>
              {airlines?.map((airline: Airline) => (
                <div key={airline.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`airline-${airline.id}`}
                    checked={filters.airlines?.includes(airline.id) || false}
                    onChange={() => handleAirlineFilterChange(airline.id)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor={`airline-${airline.id}`} className="ml-2 text-sm text-gray-700">
                    {airline.name}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Flight Options</h3>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="direct-flights"
                  checked={filters.directFlightsOnly || false}
                  onChange={(e) => setFilters({ ...filters, directFlightsOnly: e.target.checked })}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="direct-flights" className="ml-2 text-sm text-gray-700">
                  Direct flights only
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Class</h3>
              <select
                value={filters.classType}
                onChange={(e) => 
                  setFilters({ 
                    ...filters, 
                    classType: e.target.value as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST' 
                  })
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First Class</option>
              </select>
            </div>
            
            <Button variant="outline" onClick={resetFilters} fullWidth>
              Reset Filters
            </Button>
          </div>
          
          {/* Mobile filters toggle */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              leftIcon={<Sliders className="h-4 w-4" />}
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
          
          {/* Mobile filters */}
          {showFilters && (
            <div className="lg:hidden bg-white rounded-xl shadow-md p-6 mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Filters</h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Price Range</h3>
                <div className="mb-2">
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={filters.maxPrice || 5000}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>$100</span>
                    <span>${filters.maxPrice || 5000}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Airlines</h3>
                <div className="grid grid-cols-2 gap-2">
                  {airlines?.map((airline: Airline) => (
                    <div key={airline.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`mobile-airline-${airline.id}`}
                        checked={filters.airlines?.includes(airline.id) || false}
                        onChange={() => handleAirlineFilterChange(airline.id)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor={`mobile-airline-${airline.id}`} className="ml-2 text-sm text-gray-700">
                        {airline.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Flight Options</h3>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="mobile-direct-flights"
                    checked={filters.directFlightsOnly || false}
                    onChange={(e) => setFilters({ ...filters, directFlightsOnly: e.target.checked })}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="mobile-direct-flights" className="ml-2 text-sm text-gray-700">
                    Direct flights only
                  </label>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Class</h3>
                <select
                  value={filters.classType}
                  onChange={(e) => 
                    setFilters({ 
                      ...filters, 
                      classType: e.target.value as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST' 
                    })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First Class</option>
                </select>
              </div>
              
              <Button variant="outline" onClick={resetFilters} fullWidth>
                Reset Filters
              </Button>
            </div>
          )}
          
          {/* Search results */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="mb-4 lg:mb-0">
                  <h2 className="text-xl font-bold text-gray-900">Search</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <div className="sm:w-1/2 lg:w-auto">
                    <AirportSearch
                      value={filters.departureAirport || ''}
                      onChange={(airport) => 
                        setFilters({ ...filters, departureAirport: airport?.code })
                      }
                      placeholder="From"
                    />
                  </div>
                  
                  <div className="sm:w-1/2 lg:w-auto">
                    <AirportSearch
                      value={filters.arrivalAirport || ''}
                      onChange={(airport) => 
                        setFilters({ ...filters, arrivalAirport: airport?.code })
                      }
                      placeholder="To"
                    />
                  </div>
                  
                  <div className="lg:w-auto">
                    <input
                      type="date"
                      className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={filters.departureDate || ''}
                      onChange={(e) => setFilters({ ...filters, departureDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sort options */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex items-center mb-3 sm:mb-0">
                  <BarChart2 className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    {isLoading ? 'Loading...' : `${sortedFlights?.length || 0} flights found`}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <ArrowUpDown className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700 mr-2">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="duration_low">Duration: Shortest</option>
                    <option value="duration_high">Duration: Longest</option>
                    <option value="departure_early">Departure: Earliest</option>
                    <option value="departure_late">Departure: Latest</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Flight results */}
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-md p-12 flex justify-center">
                <Loader text="Searching for the best flights..." />
              </div>
            ) : isError ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Oops! Something went wrong.</h3>
                <p className="text-gray-600 mb-6">We couldn't fetch the flight results. Please try again.</p>
                <Button variant="primary" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : sortedFlights && sortedFlights.length > 0 ? (
              <div className="space-y-6">
                {sortedFlights.map((flight) => (
                  <FlightCard 
                    key={flight.id} 
                    flight={flight} 
                    selectedClass={filters.classType}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No flights found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or selecting different dates.</p>
                <Button variant="primary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;