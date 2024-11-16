
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Home, Loader2 } from 'lucide-react';
import { Chalet } from '@/modules/types/room';
import { useNavigate } from 'react-router-dom';

interface ChaletListingsProps {
    chalets: Chalet[];
    isLoading: boolean;
}
const ChaletListings = ({ chalets,isLoading }:ChaletListingsProps) => {
    const navigate = useNavigate()
    
    if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

 

   // Take only the first 4 chalets
   const displayedChalets = chalets?.slice(0, 4) || [];

   const handleViewChalet = (chaletId: number) => {
    navigate(`/chalets/${chaletId}`);
  };

  return (
    <div className="space-y-12">
      {/* Chalets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedChalets?.map((chalet) => (
          <Card key={chalet.id} 
          className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
          onClick={() => handleViewChalet(chalet.id)}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={chalet.chaletImage}
                alt={chalet.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <CardHeader className="space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{chalet.name}</h3>
                <span className="text-green-600 font-semibold">
                  KES {Number(chalet.price)}
                </span>
              </div>
              <p className="text-sm text-gray-500">{chalet.chaletType}</p>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Up to {chalet.capacity} guests</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Home className="h-4 w-4" />
                <span>{chalet.chaletType}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{chalet.description}</p>
            </CardContent>

            <CardFooter>
              <Button 
              className="w-full bg-[#27534c] hover:bg-[#1c3d38]"
              onClick={(e) => {
                e.stopPropagation();
                handleViewChalet(chalet.id);
              }}
            >
              View Chalet
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

       {/* View All Button - Only show if there are more than 4 chalets */}
       {/* {(chalets?.length || 0) > 4 && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="lg"
            className="border-[#27534c] text-[#27534c] hover:bg-[#27534c] hover:text-white"
            onClick={() => navigate('/chalets')}
          >
            View All Chalets
          </Button>
        </div>
      )} */}

      {/* Promotional Banner */}
      <div className="relative rounded-xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/media/great-rift-valley-lodge-and-golf-resort-banners20201009_1721462.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative py-12 px-6 md:px-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Special Offer: Book Now and Save 20%
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Experience luxury at Great Rift Valley Lodge. Book your stay for 3 nights or more and enjoy a 20% discount on our best available rates.
            </p>
            <Button size="lg" className="bg-white text-[#27534c] hover:bg-white/90">
              View Special Offers
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChaletListings;