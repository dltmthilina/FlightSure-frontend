import { Clock, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Flight } from '../../types';
import { format, addMinutes, parseISO } from 'date-fns';
import Button from '../common/Button';

interface FlightCardProps {
  flight: Flight;
  selectedClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}

const FlightCard = ({ flight, selectedClass = 'ECONOMY' }: FlightCardProps) => {
  const {
    id,
    flightNumber,
    airline,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    duration,
    stops,
    classes,
  } = flight;

  // Format dates
  const formatTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'EEE, MMM d');
  };

  // Get the class price
  const selectedClassInfo = classes.find((c) => c.type === selectedClass);
  const price = selectedClassInfo?.price || classes[0].price;
  const availableSeats = selectedClassInfo?.availableSeats || 0;

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Status style
  const getStatusStyle = (status: Flight['status']) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'DELAYED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'BOARDING':
        return 'bg-green-100 text-green-800';
      case 'IN_AIR':
        return 'bg-purple-100 text-purple-800';
      case 'LANDED':
        return 'bg-green-100 text-green-800';
      case 'DIVERTED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Airline Info */}
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src={airline.logo}
              alt={airline.name}
              className="w-12 h-12 object-contain rounded-full border border-gray-200"
            />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">{airline.name}</h3>
              <p className="text-sm text-gray-500">Flight {flightNumber}</p>
            </div>
          </div>
          
          {/* Flight Status */}
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(flight.status)}`}>
              {flight.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Departure Info */}
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold text-gray-900">{formatTime(departureTime)}</p>
            <p className="text-sm text-gray-500">{formatDate(departureTime)}</p>
            <p className="mt-1 font-medium">{departureAirport.code}</p>
            <p className="text-sm text-gray-700">{departureAirport.city}</p>
          </div>
          
          {/* Flight Duration */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-2">{formatDuration(duration)}</p>
            <div className="relative w-full px-4">
              <div className="absolute h-0.5 bg-gray-300 w-full top-1/2 transform -translate-y-1/2"></div>
              <Plane className="relative mx-auto text-primary w-6 h-6 transform rotate-90" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {stops.length === 0 ? (
                'Direct Flight'
              ) : (
                `${stops.length} ${stops.length === 1 ? 'Stop' : 'Stops'}`
              )}
            </p>
            {stops.length > 0 && (
              <p className="text-xs text-gray-500">
                {stops.map((stop) => stop.code).join(', ')}
              </p>
            )}
          </div>
          
          {/* Arrival Info */}
          <div className="text-center md:text-right">
            <p className="text-2xl font-bold text-gray-900">{formatTime(arrivalTime)}</p>
            <p className="text-sm text-gray-500">{formatDate(arrivalTime)}</p>
            <p className="mt-1 font-medium">{arrivalAirport.code}</p>
            <p className="text-sm text-gray-700">{arrivalAirport.city}</p>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-4">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-700">{flight.aircraft}</span>
            </div>
            <div className="mt-1">
              <p className="text-sm text-gray-500">
                {availableSeats} seats left in {selectedClass.toLowerCase().replace('_', ' ')}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <p className="text-3xl font-bold text-primary">${price}</p>
            <p className="text-sm text-gray-500 mb-2">per passenger</p>
            <Link to={`/flight/${id}?class=${selectedClass}`}>
              <Button variant="primary">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;