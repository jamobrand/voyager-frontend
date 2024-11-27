import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
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

interface RoomImage {
  file: File | null;
  url: string;
  alt: string;
  key?: string; // S3 object key
}

interface RoomData {
  name: string;
  roomType: string;
  room: number;
  capacity: number;
  nightlySurcharge?: number;
  isAvailable: boolean;
  isEnsuite: boolean;
  description?: string;
  images: RoomImage[];
}

const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
    },
  });
  

interface RoomDetailsStepProps {
  setCurrentStep: (step: number) => void;
  totalRooms: number;
}

export const RoomDetailsStep = ({
  setCurrentStep,
  totalRooms,
}: RoomDetailsStepProps) => {
  const roomTypes = ["Double", "Twin"];

  const [roomDataList, setRoomDataList] = useState<RoomData[]>([
    {
      name: "",
      roomType: "",
      nightlySurcharge: 0,
      room: 1,
      capacity: 1,
      isAvailable: true,
      isEnsuite: false,
      images: [],
    },
  ]);

  const updateRoomData = (index: number, updates: Partial<RoomData>) => {
    setRoomDataList((prev) => {
      const newRoomDataList = [...prev];
      newRoomDataList[index] = { ...newRoomDataList[index], ...updates };
      return newRoomDataList;
    });
  };

  const addAnotherRoom = () => {
    const usedRoomTypes = roomDataList.map((room) => room.roomType);
    const availableRoomTypes = roomTypes.filter(
      (type) => !usedRoomTypes.includes(type)
    );

    if (availableRoomTypes.length > 0) {
      setRoomDataList((prev) => [
        ...prev,
        {
          name: "",
          roomType: availableRoomTypes[0],
          nightlySurcharge: 0,
          room: 1,
          capacity: 1,
          isAvailable: true,
          isEnsuite: false,
          images: [],
        },
      ]);
    }
  };

  const totalRoomsAdded = roomDataList.reduce(
    (sum, room) => sum + room.room,
    0
  );
  const isRoomDetailsComplete = totalRoomsAdded === totalRooms;

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    roomIndex: number
  ) => {
    const files = event.target.files;
    if (!files) return;

    const currentRoom = roomDataList[roomIndex];
    const remainingSlots = 3 - currentRoom.images.length;
    const newImages: RoomImage[] = [];

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      const objectKey = `great-rift-lodge/chalet/${
        currentRoom.name || `room-${roomIndex + 1}`
      }-${Date.now()}-${file.name}`;

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

    updateRoomData(roomIndex, {
      images: [...currentRoom.images, ...newImages],
    });
  };

  const removeImage = async (roomIndex: number, imageIndex: number) => {
    const currentRoom = roomDataList[roomIndex];
    const imageToRemove = currentRoom.images[imageIndex];

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

    const updatedImages = currentRoom.images.filter(
      (_, index) => index !== imageIndex
    );

    updateRoomData(roomIndex, { images: updatedImages });
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Room Details</CardTitle>
        <CardDescription>
          Provide information about the rooms in your chalet
        </CardDescription>
      </CardHeader>
      <CardContent>
        {roomDataList.map((roomData, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Room Type</Label>
                  <Select
                    value={roomData.roomType}
                    onValueChange={(value) =>
                      updateRoomData(index, { roomType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Rooms</Label>
                  <Input
                    type="number"
                    value={roomData.room}
                    onChange={(e) =>
                      updateRoomData(index, {
                        room: parseInt(e.target.value),
                      })
                    }
                    placeholder="Number of rooms"
                    required
                  />
                </div>

                <div>
                  <Label>Bed Capacity</Label>
                  <Input
                    type="number"
                    value={roomData.capacity}
                    onChange={(e) =>
                      updateRoomData(index, {
                        capacity: parseInt(e.target.value),
                      })
                    }
                    placeholder="Number of people"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Room En-Suite</Label>
                  <Select
                    value={roomData.isEnsuite.toString()}
                    onValueChange={(value) =>
                      updateRoomData(index, {
                        isEnsuite: value === "true",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Room En-Suite" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Room Availability</Label>
                  <Select
                    value={roomData.isAvailable.toString()}
                    onValueChange={(value) =>
                      updateRoomData(index, {
                        isAvailable: value === "true",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Room availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Available</SelectItem>
                      <SelectItem value="false">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Room Images (2-3 recommended)</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, index)}
                />
               {roomData.images.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {roomData.images.map((img, imgIndex) => (
                    <div key={imgIndex} className="relative">
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-52 h-40 object-cover rounded"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0 w-6 h-6 rounded-full p-1"
                        onClick={() => removeImage(index, imgIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          </div>
        ))}

        {!isRoomDetailsComplete && (
          <Button
            variant="outline"
            onClick={addAnotherRoom}
            className="w-full mb-4"
          >
            <Plus className="mr-2" /> Add Another Room Type
          </Button>
        )}

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setCurrentStep(1)}>
            <ChevronLeft className="mr-2" /> Back
          </Button>
          <Button
            onClick={() => setCurrentStep(3)}
            disabled={!isRoomDetailsComplete}
             className="h-10 bg-[#27534c] hover:bg-[#1a3733]"
          >
            Next <ChevronRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
