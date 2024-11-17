import { BookingWidget } from "@/modules/booking-widget";
import { useState, useEffect } from "react";

const slides = [
  {
    image: "https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/media/great-rift-valley-lodge-and-golf-resort-banners20201009_1721462.jpg",
    text: "Spectacular Views Over the World's Largest Valley: The Great Rift Valley Lodge"
  },
  {
    image: "https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/media/great-rift-valley-lodge-and-golf-resort-bannersimg_03133.jpg",
    text: "Experience Luxury Living Amidst Nature's Grandeur"
  },
  {
    image: "https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/media/great-rift-valley-lodge-and-golf-resort-imageLinks20201102_133239_original.jpg",
    text: "World-Class Golf Course with Breathtaking Valley Views"
  },
  {
    image: "https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/media/great-rift-valley-lodge-and-golf-resort-imageLinksgrvl-done-15th-hole-final.jpg",
    text: "Your Perfect Escape into Nature's Paradise"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section
        className="relative bg-cover bg-center sm:h-[500px] md:h-[500px] lg:h-[500px] xl:h-[500px] h-[300px] transition-all duration-700"
        style={{
          backgroundImage: `url('${slides[currentSlide].image}')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10 px-4">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 md:mb-4">
              Welcome to Great Rift Valley Lodge
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 md:mb-6 transition-opacity duration-700 max-w-3xl mx-auto">
              {slides[currentSlide].text}
            </p>
          </div>
        </div>

        {/* Navigation Dots */}
        {/* <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? "w-4 bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div> */}
      </section>

      <div className="absolute left-0 right-0">
        <div className="container mx-auto px-4 -mt-16">
          <BookingWidget />
        </div>
      </div>
    </>
  );
};

export default HeroSection;