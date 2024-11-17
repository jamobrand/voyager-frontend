import {Medal, Mountain, UtensilsCrossed, Waves, Wifi } from "lucide-react";
import ImageGallery from "./image-gallery";
import BookingWidget from "./booking-widget";
import { Helmet } from "react-helmet-async";
import Header from "../homepage/navbar";

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
  
const listing: Listing = {
    id: 3,
    name: 'Lucita Farm Pool House',
    title: 'Luxury Lakeside Retreat with Panoramic Views',
    description: 'Escape to this serene lakeside haven nestled in the heart of the Great Rift Valley. This beautifully appointed villa offers the perfect blend of luxury and natural beauty.',
    host: {
      name: 'Martha W.',
      image: 'https://a0.muscache.com/im/pictures/user/fed880be-454c-4721-8cae-e23f4ed78c78.jpg?im_w=240',  // Using placeholder as per instructions
      isSuperhost: true,
      hosting: '8 years hosting',
      response: '100% response rate',
      responseTime: 'Responds within an hour'
    },
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQzNDcxMzM%3D/original/79e4ba2a-5045-4979-ab6f-ab2067c2b1e6.jpeg?im_w=960',  // Using placeholders as per instructions
      'https://a0.muscache.com/im/pictures/hosting/Hosting-14347133/original/ad86bed1-df12-43d0-bad3-5a30ae8c10a9.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQzNDcxMzM%3D/original/f3c2975e-30de-4a98-b8f9-16007e2e9a1e.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-14347133/original/3c5a440b-9e97-474a-aff0-e1b0a31d1466.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQzNDcxMzM%3D/original/5c00bd08-c7dd-48a0-bfc4-3415ea8bae1c.jpeg?im_w=720'
    ],
    price: 31000,
    pricePerNight: 'KES 31,000',
    rating: 4.89,
    reviewCount: 95,
    bathrooms: 2,
    maxGuests: 9,
    bedrooms: 4,
    beds: 6,
    amenities: [
      { name: 'Pool', icon: Waves },
      { name: 'Mountain view', icon: Mountain },
      { name: 'Wi-Fi', icon: Wifi },
      { name: 'Kitchen', icon: UtensilsCrossed }
    ],
    location: 'Lake Naivasha, Kenya',
    highlights: [
      {
        title: 'Exceptional check-in experience',
        description: 'Recent guests gave the check-in process a 5-star rating.'
      },
      {
        title: '20-min walk to the lake',
        description: 'Perfect location near Lake Naivasha.'
      },
      {
        title: 'Outdoor entertainment',
        description: 'Pool, alfresco dining, and outdoor seating for summer enjoyment.'
      }
    ]
  };

const ChaletDetail = () => {
    return (
        <>
         <Helmet>
            <title>Great Rift Valley Lodge</title>
            <meta name="description" content="Voyager is a modern and elegant chalet rental platform." />
        </Helmet>
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold mb-2">{listing.title}</h1>
          {/* <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              <span className="font-medium">{listing.rating}</span>
              <span className="text-gray-500">({listing.reviewCount} reviews)</span>
            </div>
            {listing.host.isSuperhost && (
              <div className="flex items-center gap-1">
                <Medal className="w-4 h-4 text-rose-500" />
                <span>Superhost</span>
              </div>
            )}
            <SharePopover />
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div> */}
        </div>
  
        <ImageGallery images={listing.images} />
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between pb-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">
                  Hosted by {listing.host.name}
                </h2>
                <div className="text-gray-500">
                  {listing.host.hosting} · {listing.host.response}
                </div>
              </div>
              <img
                src={listing.host.image}
                alt={listing.host.name}
                className="w-14 h-14 rounded-full"
              />
            </div>
  
            <div className="py-6 border-b space-y-4">
              {listing.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Medal className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{highlight.title}</h3>
                    <p className="text-gray-500">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
  
            <div className="py-6 border-b">
              <p className="text-gray-600 whitespace-pre-line">
                {listing.description}
              </p>
            </div>
  
            <div className="py-6 border-b">
              <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
              {listing.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <amenity.icon className="w-6 h-6 text-gray-600" />
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <BookingWidget listing={listing} />
        </div>
      </div>
    </div>
        </>
    
  );
};

export default ChaletDetail;