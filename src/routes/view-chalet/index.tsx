import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  Home, 
  Wifi, 
  Tv, 
  UtensilsCrossed,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { useGetChalets } from '@/features/use-get-chalets';
import { useNavigate, useParams } from 'react-router-dom';

const ChaletDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const chaletId = Number(params.id);
  const { data: allChalets, isLoading } = useGetChalets();
  
  const chalet = allChalets?.find(c => c.id === chaletId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#27534c]" />
      </div>
    );
  }

  if (!chalet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Chalet not found</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">{chalet.name}</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Main Image and Location */}
        <div className="relative h-[60vh] rounded-xl overflow-hidden mb-8">
          <img
            src={chalet.chaletImage}
            alt={chalet.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-lg flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-[#27534c]" />
            <span>Great Rift Valley Lodge</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="border-b pb-6">
              <h1 className="text-3xl font-bold mb-2">{chalet.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>Up to {chalet.capacity} guests</span>
                </div>
                <div className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  <span>{chalet.chaletType}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About this chalet</h2>
              <p className="text-gray-600 whitespace-pre-line">{chalet.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-gray-600" />
                  <span>WiFi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tv className="h-5 w-5 text-gray-600" />
                  <span>TV with DSTV</span>
                </div>
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-gray-600" />
                  <span>Kitchen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold">
                  KES  {Number(chalet.price).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-gray-600">per night</span>
              </div>

              {/* Calendar Picker would go here */}
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span>Select dates</span>
                </div>
                {/* Add your date picker component here */}
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Users className="h-5 w-5" />
                <span>Up to {chalet.capacity} guests</span>
              </div>

              <Button className="w-full bg-[#27534c] hover:bg-[#1c3d38] h-12 text-lg" disabled>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChaletDetailPage;