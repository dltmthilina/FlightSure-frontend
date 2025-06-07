import HeroSection from '../components/home/HeroSection';
import { useState, useEffect } from 'react';
import { Flight } from '../types';
import { flightApi } from '../api/flightApi';
import FlightCard from '../components/flight/FlightCard';
import Card from '../components/common/Card';
import { Calendar, Compass, Shield, CreditCard, Headphones, Plane } from 'lucide-react';
import Button from '../components/common/Button';

const HomePage = () => {
  const [featuredFlights, setFeaturedFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedFlights = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would call a specific API endpoint for featured flights
        const flights = await flightApi.searchFlights({});
        setFeaturedFlights(flights.slice(0, 3)); // Just take the first 3 flights
      } catch (error) {
        console.error('Error fetching featured flights:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedFlights();
  }, []);

  // Popular destinations
  const popularDestinations = [
    {
      city: 'New York',
      imageUrl: 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      airport: 'JFK',
    },
    {
      city: 'Los Angeles',
      imageUrl: 'https://images.pexels.com/photos/1444086/pexels-photo-1444086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      airport: 'LAX',
    },
    {
      city: 'London',
      imageUrl: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      airport: 'LHR',
    },
    {
      city: 'Paris',
      imageUrl: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      airport: 'CDG',
    },
  ];

  return (
    <>
      <HeroSection />
      
      {/* Featured Flights Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Flight Deals</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our best flight deals to popular destinations around the world.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {featuredFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Button variant="outline" size="lg">
              View All Deals
            </Button>
          </div>
        </div>
      </section>
      
      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our most popular destinations and plan your next adventure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden h-64 group cursor-pointer"
              >
                <img
                  src={destination.imageUrl}
                  alt={destination.city}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold">{destination.city}</h3>
                  <p className="text-sm opacity-90">{destination.airport}</p>
                  <p className="mt-2 text-sm bg-primary bg-opacity-80 inline-block px-2 py-1 rounded">
                    Explore Flights
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SkyWay</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best flying experience for our customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="bg-primary bg-opacity-10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Competitive Prices</h3>
              <p className="text-gray-600">
                We guarantee the best prices on flights with no hidden fees or charges.
              </p>
            </Card>
            
            <Card className="text-center p-8">
              <div className="bg-primary bg-opacity-10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Flexible Bookings</h3>
              <p className="text-gray-600">
                Change your travel dates with minimal or no fees on most bookings.
              </p>
            </Card>
            
            <Card className="text-center p-8">
              <div className="bg-primary bg-opacity-10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer service team is available 24/7 to assist you with any queries.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-8 md:mb-0 md:w-2/3">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Take Off?</h2>
              <p className="text-xl text-white opacity-90">
                Book your flight today and experience the SkyWay difference.
              </p>
            </div>
            <div>
              <Button variant="secondary" size="lg">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials or App Download Section can go here */}
    </>
  );
};

export default HomePage;