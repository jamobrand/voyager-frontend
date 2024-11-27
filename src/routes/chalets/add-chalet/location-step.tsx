import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, MapPin, Locate } from "lucide-react";

// Declare Google global types
declare global {
  interface Window {
    google: any;
  }
}

interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationStepProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  googleMapsApiKey: string;
}

export const LocationStep: React.FC<LocationStepProps> = ({ 
  setCurrentStep, 
  googleMapsApiKey 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = () => {
          console.log("Google Maps script loaded");
          setMapLoaded(true); // Set mapLoaded to true when the script is loaded
        };
      } else {
        setMapLoaded(true); // If Google Maps is already loaded
      }
    };
    loadGoogleMapsScript();
  }, [googleMapsApiKey]);
  

  // Render map for selected location
  const renderMap = () => {
    if (!selectedLocation || !mapLoaded) return null;

    return (
      <div className="w-full h-[400px] mt-4">
        <div 
          id="location-map" 
          className="w-full h-full rounded-lg"
          ref={(el) => {
            if (el && window.google) {
              const map = new window.google.maps.Map(el, {
                center: selectedLocation.coordinates,
                zoom: 15
              });
              
              new window.google.maps.Marker({
                position: selectedLocation.coordinates,
                map: map,
                title: selectedLocation.name
              });
            }
          }}
        />
      </div>
    );
  };

  // Search locations using Google Places API
  const searchLocations = useCallback(async (query: string) => {
    if (!window.google || !query) return;

    setIsLoading(true);
    setError(null);

    try {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      service.textSearch({ query }, (results: any[], status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const mappedLocations: Location[] = results.map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.formatted_address,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
          }));
          setLocations(mappedLocations);
        } else {
          setError("No locations found or search failed");
        }
        setIsLoading(false);
      });
    } catch (err) {
      setError("Error searching locations");
      setIsLoading(false);
    }
  }, []);

  // Geolocation handler
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const service = new window.google.maps.places.PlacesService(document.createElement('div'));
          
          service.nearbySearch({
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            radius: 5000,
            type: ['lodging']
          }, (results: any[], status: string) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const nearbyLocations: Location[] = results.map(place => ({
                id: place.place_id,
                name: place.name,
                address: place.vicinity,
                coordinates: {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                }
              }));
              setLocations(nearbyLocations);
            } else {
              setError("No nearby locations found");
            }
            setIsLoading(false);
          });
        },
        (error) => {
          setError("Geolocation error: " + error.message);
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setIsLoading(false);
    }
  };

  // Search on term change
  useEffect(() => {
    if (searchTerm.length > 2 && window.google) {
      searchLocations(searchTerm);
    }
  }, [searchTerm, searchLocations]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    // onLocationSelect(location); // Callback to parent component
  };

  const handleNextStep = () => {
    if (selectedLocation) {
      setCurrentStep(5);
    }
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Select Chalet Location</CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedLocation ? (
          // Location search view
          <>
            <div className="flex items-center mb-4 space-x-2">
            <input 
  placeholder="Search locations (e.g., hotels, resorts)" 
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="flex-grow p-2 border rounded"
  disabled={!mapLoaded} // Disable input until map is loaded
/>
{!mapLoaded && <p className="text-sm text-muted-foreground">Loading Google Maps...</p>}

              <Button 
                variant="outline" 
                size="icon" 
                onClick={getCurrentLocation}
                title="Find Nearby Locations"
              >
                <Locate className="size-5" />
              </Button>
            </div>

            {error && (
              <div className="text-red-500 mb-4 text-center">{error}</div>
            )}

            {isLoading ? (
              <div className="text-center">Searching locations...</div>
            ) : (
              <div className="grid gap-4">
                {locations.map((location) => (
                  <div 
                    key={location.id}
                    className="border p-4 rounded-lg cursor-pointer hover:bg-secondary/20"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="flex items-center space-x-4">
                      <MapPin className="size-8 text-primary" />
                      <div>
                        <h3 className="font-semibold">{location.name}</h3>
                        <p className="text-muted-foreground">{location.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Selected location view
          <div className="space-y-4">
            <div className="border p-4 rounded-lg bg-primary/10">
              <div className="flex items-center space-x-4">
                <MapPin className="size-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-xl">{selectedLocation.name}</h3>
                  <p className="text-muted-foreground">{selectedLocation.address}</p>
                  <p className="text-sm">
                    Coordinates: {selectedLocation.coordinates.lat}, {selectedLocation.coordinates.lng}
                  </p>
                </div>
              </div>
            </div>

            {renderMap()}
          </div>
        )}

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setCurrentStep(3)}>
            <ChevronLeft className="mr-2" /> Back
          </Button>
          {selectedLocation && (
            <Button onClick={handleNextStep}>
              Next <ChevronRight className="ml-2" />
            </Button>
          )}
          {selectedLocation && (
            <Button 
              variant="secondary" 
              onClick={() => setSelectedLocation(null)}
            >
              Change Location
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};