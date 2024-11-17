import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateChalet } from "@/features/use-create-chalet";
import {
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_SECRET_KEY,
} from "@/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ChangeEvent, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Camera, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";

// Zod schema for form validation
const chaletSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  chaletType: z.string().min(1, "Chalet type is required"),
  description: z.string().min(1, "Description is required"),
  pricePerNight: z.number().min(1, "Price is required"),
  capacity: z.number().min(1, "Capacity is required"),
  bedrooms: z.number().min(1, "Number of bedrooms is required"),
  bathrooms: z.number().min(1, "Number of bathrooms is required"),
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  images: z.array(z.string()),
  available: z.boolean().default(true),
  maintenanceMode: z.boolean().default(false),
});

type FormValues = z.infer<typeof chaletSchema>;

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const ALLOWED_DIMENSIONS = { width: 400, height: 400 };

const client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

const NewChalet = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createChalet, isPending } = useCreateChalet();

  const form = useForm<FormValues>({
    resolver: zodResolver(chaletSchema),
    defaultValues: {
      name: "",
      title: "",
      chaletType: "",
      description: "",
      pricePerNight: 0,
      capacity: 0,
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
      images: [],
      available: true,
      maintenanceMode: false,
    },
  });

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      
      for (const file of newFiles) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast({
            variant: "destructive",
            title: "Invalid file type",
            description: "Please select JPG or PNG images only.",
          });
          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          toast({
            variant: "destructive",
            title: "File too large",
            description: "Images must be less than 5MB.",
          });
          continue;
        }

        const img = new Image();
        const imgUrl = URL.createObjectURL(file);
        img.src = imgUrl;
        
        await new Promise((resolve) => {
          img.onload = () => {
            URL.revokeObjectURL(imgUrl);
            if (img.width < ALLOWED_DIMENSIONS.width || img.height < ALLOWED_DIMENSIONS.height) {
              toast({
                variant: "destructive",
                title: "Image too small",
                description: `Images must be at least ${ALLOWED_DIMENSIONS.width}x${ALLOWED_DIMENSIONS.height} pixels.`,
              });
            } else {
              setSelectedImages(prev => [...prev, file]);
              setImageUrls(prev => [...prev, imgUrl]);
            }
            resolve(null);
          };
        });
      }
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
    form.setValue('amenities', selectedAmenities);
  };

  const handleSubmit = async () => {
    if (selectedImages.length === 0) {
      toast({
        variant: "destructive",
        title: "Images required",
        description: "Please add at least one image of the chalet.",
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const confirmCreate = async () => {
    setIsDialogOpen(false);
    const values = form.getValues();

    try {
      const uploadedImageUrls = await Promise.all(
        selectedImages.map(async (file) => {
          const photoKey = `great-rift-lodge/chalets/${values.name}/${Date.now()}-${file.name}`;
          
          const command = new PutObjectCommand({
            Bucket: AWS_S3_BUCKET,
            Key: photoKey,
            Body: file,
            ContentType: file.type,
          });

          await client.send(command);
          return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${photoKey}`;
        })
      );

      await createChalet({
        ...values,
        images: uploadedImageUrls,
        amenities: selectedAmenities,
      });

      form.reset();
      setSelectedImages([]);
      setImageUrls([]);
      setSelectedAmenities([]);
      
      toast({
        title: "Success",
        description: "Chalet created successfully",
      });
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: "Failed to create chalet: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-5">
         <Helmet>
        <title>Add New Chalet</title>
      </Helmet>

      <div>
      <div className="space-y-4">
          <h1 className="font-bold text-2xl mb-5 text-[#1a3733]">Add New Chalet</h1>
        </div>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
        <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chalet Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Duplex Lower 101"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketing Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Luxurious Lakeside Duplex"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="chaletType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chalet Type</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DUPLEX_LOWER">Duplex Lower</SelectItem>
                        <SelectItem value="DUPLEX_UPPER">Duplex Upper</SelectItem>
                        <SelectItem value="STAND_ALONE">Stand Alone Unit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="pricePerNight"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Night (KES)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isPending}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
        </div>


        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
        <FormField
                name="capacity"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Guests</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isPending}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="bedrooms"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isPending}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="bathrooms"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isPending}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
        </div>

         {/* Images Section */}
         <div className="space-y-4">
         <FormLabel>Chalet Images</FormLabel>
         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
         {imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={url}
                      alt={`Chalet preview ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="aspect-square flex flex-col items-center justify-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-8 w-8" />
                  <span className="text-sm">Add Photo</span>
                </Button>
         </div>
         <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
         </div>

          {/* Amenities Section */}
          <div className="space-y-4">
          <FormLabel>Amenities</FormLabel>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {AMENITIES_LIST.map((amenity) => (
                  <div
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedAmenities.includes(amenity)
                        ? 'border-[#1a3733] bg-[#1a3733]/10'
                        : 'border-gray-200 hover:border-[#1a3733]/50'
                    }`}
                  >
                    <p className="text-sm font-medium">{amenity}</p>
                  </div>
                ))}
          </div>
          </div>


        </form>
        </Form>
      </div>
    </div>
  )

}

export default NewChalet