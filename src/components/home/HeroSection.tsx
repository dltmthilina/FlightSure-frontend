import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, Users } from 'lucide-react';
import Button from '../common/Button';
import { SearchParams } from '../../types';
import AirportSearch from '../search/AirportSearch';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    departureAirport: undefined,
    arrivalAirport: undefined,
    departureDate: undefined,
    returnDate: null,
    passengers: 1,
    classType: 'ECONOMY',
    directFlightsOnly: false
  });
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate the form
    if (!searchParams.departureAirport || !searchParams.arrivalAirport || !searchParams.departureDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Convert the search params to query string
    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    // Navigate to the search results page
    navigate(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="bg-gradient-to-r from-primary-dark to-primary text-white pt-16 pb-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-40 w-96 h-96 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -left-40 bottom-0 w-80 h-80 bg-white opacity-10 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Fly to Your Dream Destination with SkyWay
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Book your flights with ease and enjoy the journey. Best prices guaranteed with premium service.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
          <div className="flex gap-4 mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                tripType === 'oneWay'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setTripType('oneWay')}
            >
              One Way
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                tripType === 'roundTrip'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setTripType('roundTrip')}
            >
              Round Trip
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-700">
              <div className="relative">
                <label className="block text-sm font-medium mb-1">From</label>
                <AirportSearch
                  value={searchParams.departureAirport || ''}
                  onChange={(airport) => 
                    setSearchParams({ ...searchParams, departureAirport: airport?.code })
                  }
                  placeholder="Departure Airport"
                />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium mb-1">To</label>
                <AirportSearch
                  value={searchParams.arrivalAirport || ''}
                  onChange={(airport) => 
                    setSearchParams({ ...searchParams, arrivalAirport: airport?.code })
                  }
                  placeholder="Arrival Airport"
                />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Departure Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => 
                      setSearchParams({ ...searchParams, departureDate: e.target.value })
                    }
                    required
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {tripType === 'roundTrip' && (
                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Return Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
                      min={searchParams.departureDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => 
                        setSearchParams({ ...searchParams, returnDate: e.target.value })
                      }
                      required={tripType === 'roundTrip'}
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}
              
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Passengers</label>
                <div className="relative">
                  <select
                    className="appearance-none px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
                    value={searchParams.passengers}
                    onChange={(e) => 
                      setSearchParams({ ...searchParams, passengers: Number(e.target.value) })
                    }
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                  <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Class</label>
                <div className="relative">
                  <select
                    className="appearance-none px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
                    value={searchParams.classType}
                    onChange={(e) => 
                      setSearchParams({ 
                        ...searchParams, 
                        classType: e.target.value as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST' 
                      })
                    }
                  >
                    <option value="ECONOMY">Economy</option>
                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                    <option value="BUSINESS">Business</option>
                    <option value="FIRST">First Class</option>
                  </select>
                  <Plane className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <input
                id="directFlights"
                type="checkbox"
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                checked={searchParams.directFlightsOnly}
                onChange={(e) => 
                  setSearchParams({ ...searchParams, directFlightsOnly: e.target.checked })
                }
              />
              <label htmlFor="directFlights" className="ml-2 text-sm text-gray-700">
                Direct flights only
              </label>
            </div>
            
            <Button type="submit" variant="primary" fullWidth={true}>
              Search Flights
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;