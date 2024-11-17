import { Chalet } from "@/modules/types/room";
import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { BookingParams, BookingWidget } from "@/modules/booking-widget";
import grvlLogo from "../../assets/grvl-logo-rmbg.png";
import Footer from "./footer";
import { useGetChalets } from "@/features/use-get-chalets";
import ChaletListings from "./chalet-listing";

export default function BookingPage() {
    const [loading, setLoading] = useState(false);
    const [ setResults] = useState<(Chalet)[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const carouselImages = [
        "https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/media/great-rift-valley-lodge-and-golf-resort-banners20201009_1721462.jpg",
        "https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/media/great-rift-valley-lodge-and-golf-resort-bannersimg_03133.jpg",
        "https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/media/great-rift-valley-lodge-and-golf-resort-imageLinks20201102_133239_original.jpg",
        "https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/media/great-rift-valley-lodge-and-golf-resort-imageLinksgrvl-done-15th-hole-final.jpg"
        // Add more image URLs here
      ];

        // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

    // Navigation items
  const navItems = [
    { label: 'Home', href: '#' },
    { label: 'Rooms', href: '#rooms' },
    { label: 'Amenities', href: '#amenities' },
    { label: 'Contact', href: '#contact' },
  ];

  const NavLinks = ({ mobile = false }) => (
    <div className={`flex ${mobile ? 'flex-col' : 'gap-8'}`}>
      {navItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={`
            ${mobile ? 'py-4 px-6' : 'px-4 py-2'} 
            text-white hover:text-white/80 
            hover:bg-slate-500/20 
            rounded-lg 
            transition-all 
            duration-300
            ${!mobile && 'backdrop-blur-sm bg-white/10'}
          `}
        >
          {item.label}
        </a>
      ))}
    </div>
  );

  const handleSearch = async (params: BookingParams) => {
    setLoading(true);
    try {
      const response = await fetch('/api/search-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleBookNow = (item: Room | Chalet) => {
  //   // Implement booking logic
  //   console.log('Booking:', item);
  // };

  const { data: allChalets, isLoading } = useGetChalets();

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-transparent">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-white text-2xl font-bold">
            <img src={grvlLogo} alt="GRVL Logo" className="h-12" />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <NavLinks />
            </div>

             {/* Mobile Menu Button */}
             <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="md:hidden text-white hover:bg-white/20"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="bg-[#27534c] border-none w-64"
              >
                <div className="flex flex-col gap-4 mt-8">
                  <NavLinks mobile={true} />
                </div>
              </SheetContent>
            </Sheet>


          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <div className="h-[500px] relative overflow-hidden">
        {/* Carousel */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${carouselImages[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}

        {/* Booking Widget Container */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-4 mt-10">
            <BookingWidget />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-16 mb-10">
        {/* <SearchResults
          results={results}
          loading={loading}
          onBookNow={handleBookNow}
        /> */}
          <ChaletListings chalets={allChalets || []} isLoading={isLoading} />
      </div>

      <Footer />
    </div>
  );
}