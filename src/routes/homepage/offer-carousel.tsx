import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const offers = [
  {
    id: 1,
    title: 'Take your longest vacation',
    description: 'Look for long term accommodation, there are many offers monthly discounts.',
    image: 'https://images.unsplash.com/photo-1562263315-5be44408966e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    buttonText: 'View Offer'
  },
  {
    id: 2,
    title: '50% discount for those of you',
    description: 'We give a 50% discount for those of you who want to vacation in Indonesia',
    image: 'https://a0.muscache.com/im/pictures/miso/Hosting-1229757104983931096/original/6363b537-63bd-4cb7-b839-e45120719808.jpeg?im_w=1200',
    buttonText: 'View Offer'
  },
  {
    id: 3,
    title: 'Family Package Deal',
    description: 'Special rates for family bookings with exclusive amenities included.',
    image: 'https://plus.unsplash.com/premium_photo-1664367173144-7e854e199524?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    buttonText: 'View Offer'
  },
  {
    id: 4,
    title: 'Weekend Getaway Special',
    description: 'Enjoy premium discounts on weekend stays at selected properties.',
    image: 'https://images.unsplash.com/photo-1628191013085-990d39ec25b8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    buttonText: 'View Offer'
  }
];

const OfferCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 2 >= offers.length ? 0 : prevIndex + 2
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 2 < 0 ? offers.length - 2 : prevIndex - 2
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Offer of the week
          </h2>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((offset) => {
            const offerIndex = (currentIndex + offset) % offers.length;
            const offer = offers[offerIndex];

            return (
              <div 
                key={offer.id}
                className="relative overflow-hidden rounded-xl group"
              >
                <div className="relative h-[300px] w-full">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-semibold mb-2">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-gray-200 mb-4">
                      {offer.description}
                    </p>
                    <button className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                      {offer.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(offers.length / 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 2)}
              className={`h-1.5 rounded-full transition-all ${
                index === Math.floor(currentIndex / 2)
                  ? 'w-8 bg-emerald-500'
                  : 'w-1.5 bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferCarousel;