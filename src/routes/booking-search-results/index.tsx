import { useSearchChalets } from "@/features/use-search-chalets";
import { format } from "date-fns";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Users, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chalet } from "../chalets/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkIn = new Date(searchParams.get("checkIn") || "");
  const checkOut = new Date(searchParams.get("checkOut") || "");
  const adults = parseInt(searchParams.get("adults") || "2");
  const children = parseInt(searchParams.get("children") || "0");

  const { data: chalets, isLoading } = useSearchChalets({
    checkIn,
    checkOut,
    adults,
    children,
  });

  const handleSelect = (chalet: Chalet) => {
    navigate(`/reservation/${chalet.id}`, {
      state: {
        chalet,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        adults,
        children,
      },
    });
  };

  // if (isLoading) {
  //   return (
  //     <div className="container mx-auto p-8">
  //       <div className="flex items-center justify-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#27534c]" />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
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
          <h1 className="text-xl font-semibold">Available Chalets</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mt-14 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="space-y-4 sm:space-y-0 sm:space-x-8">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span className="font-semibold text-lg">Available Chalets</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm">
            <div>
              <div className="text-gray-500">CHECK IN</div>
              <div className="font-medium">{format(checkIn, "MMM d")}</div>
            </div>
            <div>
              <div className="text-gray-500">CHECK OUT</div>
              <div className="font-medium">{format(checkOut, "MMM d")}</div>
            </div>
            <div className="text-gray-600">· {adults + children} guests</div>
          </div>
        </div>
        {/* <Button variant="outline" className="px-6">
          Modify Search
        </Button> */}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <Skeleton className="w-full sm:w-96 h-64" />
                <div className="flex-1 p-6 space-y-4">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <div className="flex justify-between items-end">
                    <Skeleton className="h-20 w-1/2" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Hotel Cards */}
      {!isLoading && (
        <div className="space-y-6">
          {chalets?.map((chalet: Chalet) => (
            <Card
              key={chalet.id}
              className="overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-96 h-64">
                  <img
                    src={chalet.chaletImage}
                    alt={chalet.name}
                    className="object-cover w-full h-full"
                  />
                  <Badge
                    className={cn(
                      "absolute top-4 left-4",
                      chalet.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {chalet.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h2 className="text-xl text-[#27534c] font-semibold mb-2">
                        {chalet.name}
                      </h2>
                      <div className="text-sm text-gray-600 mb-2">
                        {chalet.chaletType}
                      </div>
                      <div className="flex items-center space-x-2 mb-4">
                        <Users className="h-4 w-4" />
                        <span className="text-sm text-gray-600">
                          Up to {chalet.capacity} guests
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {chalet.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <div>
                        <div className="text-2xl font-semibold">
                          KES {Number(chalet.price).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                        </div>
                        <div className="text-sm text-gray-500">per night</div>
                      </div>
                      {/* <div className="text-sm text-gray-500 mb-4">/ Night</div> */}
                      <Button
                        className="min-w-[120px] bg-[#27534c] hover:bg-[#1c3d38]"
                        onClick={() => handleSelect(chalet)}
                        disabled={!chalet.available}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
    </>
   
  );
};

export default SearchResults;
