import { Star, Users } from "lucide-react";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import GuestSelector from "./guest-selector";

interface Listing {
    id: number;
    name: string;
    title: string;
    description: string;
    host: {
      name: string;
      image: string;
      isSuperhost: boolean;
      hosting: string;
      response: string;
      responseTime: string;
    };
    images: string[];
    price: number;
    pricePerNight: string;
    rating: number;
    reviewCount: number;
    bathrooms: number;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    amenities: Array<{
      name: string;
      icon: React.ComponentType<any>;
    }>;
    location: string;
    highlights: Array<{
      title: string;
      description: string;
    }>;
  }
const BookingWidget = ({ listing }: { listing: Listing }) => {
    const [guests, setGuests] = useState({
      adults: 1,
      children: 0,
      infants: 0
    });
  
    return (
      <div className="sticky top-4 bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-2xl font-bold">KES {listing.price.toLocaleString()}</span>
            <span className="text-gray-500"> / night</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            <span className="font-medium">{listing.rating}</span>
            <span className="text-gray-500">({listing.reviewCount} reviews)</span>
          </div>
        </div>
  
        <div className="space-y-4">
          <div className="grid grid-cols-2 border rounded-lg">
            <div className="p-3 border-r">
              <div className="text-xs font-medium">CHECK-IN</div>
              <input type="date" className="w-full mt-1 focus:outline-none" />
            </div>
            <div className="p-3">
              <div className="text-xs font-medium">CHECK-OUT</div>
              <input type="date" className="w-full mt-1 focus:outline-none" />
            </div>
          </div>
  
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>
                    {guests.adults + guests.children} Guest
                    {guests.adults + guests.children !== 1 ? "s" : ""}
                    {guests.infants > 0 ? `, ${guests.infants} infant${guests.infants !== 1 ? "s" : ""}` : ""}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <GuestSelector 
                guests={guests} 
                setGuests={setGuests} 
                maxGuests={listing.maxGuests}
              />
            </PopoverContent>
          </Popover>
  
          <Button className="w-full py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            Reserve
          </Button>
  
          <div className="text-center text-sm text-gray-500">
            You won't be charged yet
          </div>
  
          <div className="space-y-2 pt-4">
            <div className="flex justify-between">
              <span>KES {listing.price.toLocaleString()} × 5 nights</span>
              <span>KES {(listing.price * 5).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>KES 1,500</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>KES 4,500</span>
            </div>
            <div className="pt-4 border-t flex justify-between font-bold">
              <span>Total</span>
              <span>KES {(listing.price * 5 + 6000).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default BookingWidget;