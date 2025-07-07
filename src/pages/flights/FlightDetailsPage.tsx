import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, addMinutes } from 'date-fns';
import { ArrowRight, Clock, Plane, Info, Calendar, User, CheckCircle } from 'lucide-react';
import { flightApi } from '../../api/flightApi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { Flight, FlightClass } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import useApi from '../../hooks/use-api';

const FlightDetailsPage = () => {
  const { flightId } = useParams<{ flightId: string }>();
  const [searchParams] = useSearchParams();
  const selectedClassType =
    (searchParams.get("class") as
      | "ECONOMY"
      | "PREMIUM_ECONOMY"
      | "BUSINESS"
      | "FIRST") || "ECONOMY";
  const [selectedClass, setSelectedClass] = useState<FlightClass | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [flight, setFLight] = useState<Flight>()
  const api = useApi();

  // Update selected class when flight data or selected class type changes

  // Format dates
  const formatTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "h:mm a");
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "EEEE, MMMM d, yyyy");
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Handle booking button click
  const handleBookNow = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate(
        `/login?redirect=/flight/${flightId}?class=${selectedClassType}`
      );
      return;
    }

    navigate(`/booking/${flightId}?class=${selectedClassType}`);
  };

  if (api.isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Loader text="Loading flight details..." />
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Flight Details
          </h1>
          <p className="text-gray-600">
            {flight?.origin.city} to {flight?.destination.city} •{" "}
            {flight?.departureTime ? formatDate(flight?.departureTime) : "-"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flight Details Card */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {/*  <img
                      src={flight.airplane.}
                      alt={flight.airline.name}
                      className="w-12 h-12 object-contain rounded-full border border-gray-200"
                    /> */}
                    <div className="ml-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        {"airline name"}
                      </h2>
                      <p className="text-gray-600">
                        Flight {flight?.flightNumber}
                      </p>
                    </div>
                  </div>
                  <div>
                    {/*  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      flight.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                      flight.status === 'DELAYED' ? 'bg-yellow-100 text-yellow-800' :
                      flight.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {flight.status.replace('_', ' ')}
                    </span> */}
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-4">
                  {/* Departure Info */}
                  <div className="col-span-3">
                    <div className="text-3xl font-bold text-gray-900">
                      {flight?.departureTime
                        ? formatTime(flight?.departureTime)
                        : "-"}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {flight?.departureTime
                        ? formatDate(flight?.departureTime)
                        : "-"}
                    </div>
                    <div className="font-medium">{flight?.origin.code}</div>
                    <div className="text-gray-700">{flight?.origin.name}</div>
                    <div className="text-gray-600">
                      {flight?.origin.city}, {flight?.origin.country}
                    </div>
                  </div>

                  {/* Flight Duration */}
                  <div className="col-span-1 flex flex-col items-center justify-center">
                    <div className="text-sm text-gray-500 mb-2">
                      {"duration"}
                    </div>
                    <div className="relative w-full px-2">
                      <div className="absolute h-0.5 bg-gray-300 w-full top-1/2 transform -translate-y-1/2"></div>
                      <Plane className="relative mx-auto text-primary w-6 h-6 transform rotate-90" />
                    </div>
                    <div className="text-sm text-gray-500 mt-2"></div>
                  </div>

                  {/* Arrival Info */}
                  <div className="col-span-3">
                    <div className="text-3xl font-bold text-gray-900">
                      {flight?.arrivalTime
                        ? formatTime(flight?.arrivalTime)
                        : "-"}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {flight?.arrivalTime
                        ? formatDate(flight?.arrivalTime)
                        : "-"}
                    </div>
                    <div className="font-medium">
                      {flight?.destination.code}
                    </div>
                    <div className="text-gray-700">
                      {flight?.destination.name}
                    </div>
                    <div className="text-gray-600">
                      {flight?.destination.city}, {flight?.destination.country}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Flight Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Plane className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Aircraft</p>
                      <p className="text-gray-600">
                        {flight?.airplane.regNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Flight Duration
                      </p>
                      <p className="text-gray-600">{"duration"}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Departure</p>
                      <p className="text-gray-600">
                        {flight?.departureTime
                          ? formatDate(flight?.departureTime)
                          : "-"}
                        at{" "}
                        {flight?.departureTime
                          ? formatTime(flight?.departureTime)
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Arrival</p>
                      <p className="text-gray-600">
                        {flight?.arrivalTime
                          ? formatDate(flight?.arrivalTime)
                          : "-"}{" "}
                        at {flight?.arrivalTime?formatTime(flight?.arrivalTime):"-"}
                      </p>
                    </div>
                  </div>

                  {/* {flight.stops.length > 0 && (
                    <div className="flex items-start md:col-span-2">
                      <Info className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Stops</p>
                        <ul className="text-gray-600">
                          {flight.stops.map((stop, index) => (
                            <li key={index}>
                              {stop.city} ({stop.code}) - {stop.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </Card>

            {/* Flight Class Details */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Available Classes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* {flight.classes.map((flightClass) => (
                  <div
                    key={flightClass.type}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedClass?.type === flightClass.type
                        ? 'border-primary bg-primary bg-opacity-5'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                    onClick={() => setSelectedClass(flightClass)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">
                        {flightClass.type.replace('_', ' ')}
                      </h4>
                      {selectedClass?.type === flightClass.type && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <p className="text-xl font-bold text-primary">${flightClass.price}</p>
                    <p className="text-sm text-gray-600">
                      {flightClass.availableSeats} seats left
                    </p>
                  </div>
                ))} */}
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  What's included in {selectedClass?.type.replace("_", " ")}
                </h4>
                <ul className="space-y-2">
                  {selectedClass?.type === "ECONOMY" && (
                    <>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Standard seat with 30" legroom
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          One personal item (under the seat)
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Complimentary snack and beverage
                        </span>
                      </li>
                    </>
                  )}

                  {selectedClass?.type === "PREMIUM_ECONOMY" && (
                    <>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Extra legroom seat (34" pitch)
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          One carry-on and personal item
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Priority boarding
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Enhanced meal service
                        </span>
                      </li>
                    </>
                  )}

                  {selectedClass?.type === "BUSINESS" && (
                    <>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Lie-flat seat with direct aisle access
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Two checked bags included
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Premium dining experience
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Priority check-in, boarding, and baggage handling
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Lounge access
                        </span>
                      </li>
                    </>
                  )}

                  {selectedClass?.type === "FIRST" && (
                    <>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Private suite with sliding door
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Three checked bags included
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Gourmet dining with chef-prepared meals
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Exclusive first class lounge access
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Dedicated concierge service
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          Ground transportation at destination
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </Card>
          </div>

          {/* Booking Summary Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Price Summary
              </h3>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Base fare</span>
                  <span className="font-medium">
                    ${selectedClass?.price || 0}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Taxes & fees</span>
                  <span className="font-medium">
                    ${Math.round((selectedClass?.price || 0) * 0.15)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-900">
                  Total per passenger
                </span>
                <span className="text-lg font-bold text-primary">
                  ${Math.round((selectedClass?.price || 0) * 1.15)}
                </span>
              </div>

              <Button variant="primary" fullWidth onClick={handleBookNow}>
                Book Now
              </Button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>
                  By booking, you agree to our{" "}
                  <a href="#" className="text-primary">
                    Terms and Conditions
                  </a>
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Flight Summary
                </h4>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Plane className="w-4 h-4 mr-2" />
                  {flight?.destination.city} to {flight?.destination.city}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {flight?.departureTime
                    ? formatDate(flight?.departureTime)
                    : "-"}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />1 passenger,{" "}
                  {selectedClass?.type.replace("_", " ")}
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <p className="flex items-start">
                  <Info className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  Free cancellation available up to 24 hours before departure
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsPage;