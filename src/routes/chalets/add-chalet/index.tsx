import { useState } from "react";
import { ChaletDetailsStep } from "./chalet-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save } from "lucide-react";
import { RoomDetailsStep } from "./room-details";
import { AmenitiesStep } from "./amenities";
import { AddonsStep } from "./addons-step";
import { RulesStep } from "./rules-step";
import { LocationStep } from "./location-step";
import { GOOGLE_API_KEY } from "@/config";

const googleMapsKey = GOOGLE_API_KEY

const AddChalet = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);

  // Review Step
  const ReviewStep = () => {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Review Chalet Listing</CardTitle>
          <CardDescription>
            Review all details before final submission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6"></div>

          {/* Navigation and Submission */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              <ChevronLeft className="mr-2" /> Back
            </Button>
            <Button className="h-10 bg-[#27534c] hover:bg-[#1a3733]">
              Submit Chalet
              <Save className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render appropriate step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ChaletDetailsStep
            setCurrentStep={setCurrentStep}
            setTotalRooms={setTotalRooms}
          />
        );
      case 2:
        return (
          <RoomDetailsStep
            setCurrentStep={setCurrentStep}
            totalRooms={totalRooms}
          />
        );
      case 3:
        return <LocationStep setCurrentStep={setCurrentStep} googleMapsApiKey={googleMapsKey} />;
      case 4:
        return <AmenitiesStep setCurrentStep={setCurrentStep} />;

      case 5:
        return <AddonsStep setCurrentStep={setCurrentStep} />;

      case 6:
        return <RulesStep setCurrentStep={setCurrentStep} />;

      case 7:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center p-4">{renderStep()}</div>
  );
};

export default AddChalet;
