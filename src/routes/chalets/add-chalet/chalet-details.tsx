import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, X } from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";
import {
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_SECRET_KEY,
} from "@/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Types to match Prisma schema
interface ChaletImage {
  file: File | null;
  url: string;
  alt: string;
  key?: string; // S3 object key
}
interface ChaletData {
  name: string;
  type: string;
  description?: string;
  baseNightlyRate: number;
  maxOccupancy: number;
  minOccupancy: number;
  bedRooms: number;
  beds: number;
  images: ChaletImage[];
}

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

interface ChaletDetailsStepProps {
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setTotalRooms: Dispatch<SetStateAction<number>>;
}

export const ChaletDetailsStep: React.FC<ChaletDetailsStepProps> = ({
  setCurrentStep,
  setTotalRooms,
}) => {
  const [chaletData, setChaletData] = useState<ChaletData>({
    name: "",
    type: "",
    description: "",
    baseNightlyRate: 0,
    maxOccupancy: 1,
    minOccupancy: 1,
    bedRooms: 1,
    beds: 1,
    images: [],
  });

  const chaletTypes = ["Duplex Lower", "Stand Alone Unit", "Duplex Upper"];

  const handleBedRoomsChange = (value: string) => {
    setChaletData((prev) => ({
      ...prev,
      bedRooms: parseInt(value),
    }));
    setTotalRooms(parseInt(value));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ChaletImage[] = [];

    for (
      let i = 0;
      i < Math.min(files.length, 3 - chaletData.images.length);
      i++
    ) {
      const file = files[i];
      const objectKey = `great-rift-lodge/chalet/${
      chaletData.name}-${Date.now()}-${file.name}`;

      try {
        const params = {
          Bucket: AWS_S3_BUCKET,
          Key: objectKey,
          Body: file,
          ContentType: file.type,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        const imageUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${objectKey}`;

        newImages.push({
          file,
          url: imageUrl,
          alt: file.name,
          key: objectKey,
        });
      } catch (error) {
        console.error("Image upload error:", error);
      }
    }

    setChaletData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = async (indexToRemove: number) => {
    const imageToRemove = chaletData.images[indexToRemove];

    if (imageToRemove.key) {
      try {
        const deleteParams = {
          Bucket: AWS_S3_BUCKET!,
          Key: imageToRemove.key,
        };

        const deleteCommand = new DeleteObjectCommand(deleteParams);
        await s3Client.send(deleteCommand);
      } catch (error) {
        console.error("Image deletion error:", error);
      }
    }

    setChaletData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Chalet Details</CardTitle>
        <CardDescription>
          Provide basic information about your chalet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Chalet Name</Label>
              <Input
                value={chaletData.name}
                onChange={(e) =>
                  setChaletData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Enter chalet name"
                required
              />
            </div>

            <div>
              <Label>Chalet Type</Label>
              <Select
                value={chaletData.type}
                onValueChange={(value) =>
                  setChaletData((prev) => ({
                    ...prev,
                    type: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select chalet type" />
                </SelectTrigger>
                <SelectContent>
                  {chaletTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Total Rooms</Label>
              <Input
                type="number"
                value={chaletData.bedRooms}
                onChange={(e) => handleBedRoomsChange(e.target.value)} // Use handleBedRoomsChange here
                placeholder="Total Bedrooms"
                required
              />
            </div>

            <div>
              <Label>Total Beds</Label>
              <Input
                type="number"
                value={chaletData.beds}
                onChange={(e) =>
                  setChaletData((prev) => ({
                    ...prev,
                    beds: parseInt(e.target.value),
                  }))
                }
                placeholder="Maximum Beds"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Base Nightly Rate</Label>
              <Input
                type="number"
                value={chaletData.baseNightlyRate}
                onChange={(e) =>
                  setChaletData((prev) => ({
                    ...prev,
                    baseNightlyRate: parseFloat(e.target.value),
                  }))
                }
                placeholder="Rate per night"
                required
              />
            </div>

            <div>
              <Label>Max Occupancy</Label>
              <Input
                type="number"
                value={chaletData.maxOccupancy}
                onChange={(e) =>
                  setChaletData((prev) => ({
                    ...prev,
                    maxOccupancy: parseInt(e.target.value),
                  }))
                }
                placeholder="Maximum guests"
                required
              />
            </div>

            <div>
              <Label>Min Occupancy</Label>
              <Input
                type="number"
                value={chaletData.minOccupancy}
                onChange={(e) =>
                  setChaletData((prev) => ({
                    ...prev,
                    minOccupancy: parseInt(e.target.value),
                  }))
                }
                placeholder="Minimum guests"
                required
              />
            </div>
          </div>

          <div>
            <Label>Description (Optional)</Label>
            <Textarea
              value={chaletData.description}
              onChange={(e) =>
                setChaletData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              placeholder="Describe your chalet"
            />
          </div>

          <div>
            <Label>Chalet Images (2-3 recommended)</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={chaletData.images.length >= 3}
            />
            {chaletData.images.length > 0 && (
              <div className="flex gap-2 mt-2 relative">
                {chaletData.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-52 h-40 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            onClick={() => setCurrentStep(2)}
            disabled={!chaletData.name || !chaletData.type}
             className="h-10 bg-[#27534c] hover:bg-[#1a3733]"
          >
            Next <ChevronRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
