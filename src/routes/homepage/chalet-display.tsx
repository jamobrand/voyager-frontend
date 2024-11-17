import React from 'react';
import { Heart, Star, Users, Bath, BedDouble, Medal } from 'lucide-react';

const chaletsHouses = [
  {
    id: 1,
    name: 'Furnished 4 bedroom cottage',
    title: 'Luxury Lakeside Cottage with Panoramic Views',
    host: 'Superhost: James K.',
    href: '#',
    imageSrc: 'https://a0.muscache.com/im/pictures/18ad49ec-466d-4552-b637-c231b6468bf5.jpg?im_w=960',
    imageAlt: "Furnished 4 bedroom cottage - Beautiful Lake Views",
    price: 26000,
    pricePerNight: 'KES 26,000',
    rating: 4.97,
    reviewCount: 128,
    bathroom: 2,
    guests: 5,
    bedrooms: 4,
    beds: 6,
    amenities: ['Lake view', 'Wi-Fi', 'Kitchen', 'Free parking'],
    available: 'Nov 20-25',
    isSuperhost: true,
  },
  {
    id: 2,
    name: 'Lucita Farm Pool House',
    title: 'Serene Pool House with Farm Views',
    host: 'Martha W.',
    href: '#',
    imageSrc: 'https://a0.muscache.com/im/pictures/miso/Hosting-14794850/original/f9ac8e95-4e61-49cc-b602-5b3e0ece8954.jpeg?im_w=960',
    imageAlt: "Lucita Farm Pool House with stunning views",
    price: 31000,
    pricePerNight: 'KES 31,000',
    rating: 4.89,
    reviewCount: 95,
    bathroom: 2,
    guests: 5,
    bedrooms: 4,
    beds: 6,
    amenities: ['Pool', 'Mountain view', 'Wi-Fi', 'Kitchen'],
    available: 'Nov 18-23',
    isSuperhost: false,
  },
  {
    id: 3,
    name: 'Lucita Farm Pool House',
    title: 'Serene Pool House with Farm Views',
    host: 'Martha W.',
    href: '#',
    imageSrc: 'https://a0.muscache.com/im/pictures/miso/Hosting-14794850/original/f9ac8e95-4e61-49cc-b602-5b3e0ece8954.jpeg?im_w=960',
    imageAlt: "Lucita Farm Pool House with stunning views",
    price: 31000,
    pricePerNight: 'KES 31,000',
    rating: 4.89,
    reviewCount: 95,
    bathroom: 2,
    guests: 5,
    bedrooms: 4,
    beds: 6,
    amenities: ['Pool', 'Mountain view', 'Wi-Fi', 'Kitchen'],
    available: 'Nov 18-23',
    isSuperhost: false,
  },
];

const ChaletDisplay = () => {
  return (
    <div className="bg-white mt-60 sm:mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">Our chalets</h2>
          <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Show all
          </button>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {chaletsHouses.map((chalet) => (
            <div key={chalet.id} className="group">
              <div className="relative">
                {/* Image Container */}
                <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl bg-gray-200">
                  <img
                    src={chalet.imageSrc}
                    alt={chalet.imageAlt}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {chalet.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        {chalet.isSuperhost && (
                          <div className="flex items-center mr-2">
                            <Medal className="w-4 h-4 text-rose-500 mr-1" />
                            <span className="text-sm font-medium">Superhost</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-rose-500 mr-1" />
                          <span className="text-sm font-medium">{chalet.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({chalet.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{chalet.guests} guests</span>
                      <BedDouble className="w-4 h-4 ml-2" />
                      <span>{chalet.bedrooms} bedrooms</span>
                      <Bath className="w-4 h-4 ml-2" />
                      <span>{chalet.bathroom} baths</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {chalet.amenities.map((amenity, index) => (
                        <span key={index} className="inline-block bg-gray-100 px-2 py-1 rounded-md text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <span className="text-lg font-semibold">KES {chalet.price.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm"> / night</span>
                    </div>
                    <span className="text-sm text-gray-500">{chalet.available}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChaletDisplay;