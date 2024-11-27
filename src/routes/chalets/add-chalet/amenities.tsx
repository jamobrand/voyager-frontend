import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Utensils,
  Microwave,
  Refrigerator,
  Tv,
  Flame,
  Mountain,
  Wifi,
  ChevronRight,
  ChevronLeft,
  ShowerHead,
  CircleParking,
} from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";

const AMENITIES_LIST = [
  "Gas Cooker",
  "Microwave",
  "Fridge",
  "TV with DSTV",
  "BBQ Jiko",
  "En-suite Bathrooms",
  "Lake View",
  "Wi-Fi",
  "Parking",
] as const;

const AMENITIES_ICONS = {
  "Gas Cooker": Flame,
  Microwave: Microwave,
  Fridge: Refrigerator,
  "TV with DSTV": Tv,
  "BBQ Jiko": Utensils,
  "En-suite Bathrooms": ShowerHead,
  "Lake View": Mountain,
  "Wi-Fi": Wifi,
  Parking: CircleParking,
};

interface AmenitiesStepProps {
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

export const AmenitiesStep: React.FC<AmenitiesStepProps> = ({
  setCurrentStep,
}) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Amenities Details</CardTitle>
        <CardDescription>Select Amenities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {AMENITIES_LIST.map((amenity) => {
            const Icon = AMENITIES_ICONS[amenity];
            return (
              <Button
                key={amenity}
                variant={
                  selectedAmenities.includes(amenity) ? "chaletAmenity" : "greatRiftColorOutline"
                }
                onClick={() => toggleAmenity(amenity)}
                className="flex items-center justify-start gap-2 h-16 w-full"
              >
                <Icon className="mr-2 size-14" />
                {amenity}
              </Button>
            );
          })}
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setCurrentStep(2)}>
            <ChevronLeft className="mr-2" /> Back
          </Button>
          <Button
            onClick={() => setCurrentStep(5)}
            disabled={selectedAmenities.length === 0}
             className="h-10 bg-[#27534c] hover:bg-[#1a3733]"
          >
            Next <ChevronRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
