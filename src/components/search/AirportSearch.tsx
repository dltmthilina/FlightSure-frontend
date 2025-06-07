import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { Airport } from '../../types';
import { flightApi } from '../../api/flightApi';

interface AirportSearchProps {
  value: string;
  onChange: (airport: Airport | null) => void;
  placeholder?: string;
}

const AirportSearch = ({ value, onChange, placeholder = 'Search for an airport' }: AirportSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Effect to search airports when query changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const searchAirports = async () => {
      setIsLoading(true);
      try {
        const airports = await flightApi.getAirports(query);
        setResults(airports);
      } catch (error) {
        console.error('Error searching airports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(searchAirports, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Effect to update the query when a value is passed in
  useEffect(() => {
    if (value && !selectedAirport) {
      const fetchAirport = async () => {
        try {
          const airports = await flightApi.getAirports();
          const airport = airports.find(a => a.code === value);
          if (airport) {
            setSelectedAirport(airport);
            setQuery(`${airport.city} (${airport.code})`);
          }
        } catch (error) {
          console.error('Error fetching airport:', error);
        }
      };
      
      fetchAirport();
    } else if (!value) {
      setSelectedAirport(null);
      setQuery('');
    }
  }, [value, selectedAirport]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    
    if (!value) {
      setSelectedAirport(null);
      onChange(null);
    }
  };

  const handleSelectAirport = (airport: Airport) => {
    setSelectedAirport(airport);
    setQuery(`${airport.city} (${airport.code})`);
    setIsOpen(false);
    onChange(airport);
  };

  const handleClear = () => {
    setSelectedAirport(null);
    setQuery('');
    onChange(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-10 pr-10"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        {query && (
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            onClick={handleClear}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg overflow-hidden max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((airport) => (
                <li
                  key={airport.code}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectAirport(airport)}
                >
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{airport.city} ({airport.code})</div>
                      <div className="text-sm text-gray-500">{airport.name}, {airport.country}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="px-4 py-2 text-sm text-gray-500">No airports found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AirportSearch;