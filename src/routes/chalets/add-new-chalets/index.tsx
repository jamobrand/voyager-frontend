import { chaletSchema } from "@/schema/chalet";
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
import { Camera } from "lucide-react";
import { Label } from "@/components/ui/label";

type FormValues = z.input<typeof chaletSchema>;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const ALLOWED_DIMENSIONS = { width: 400, height: 400 }; // Minimum dimensions

const client = new S3Client({
  region: `${AWS_REGION}`,
  credentials: {
    accessKeyId: `${AWS_ACCESS_KEY}`,
    secretAccessKey: `${AWS_SECRET_KEY}`,
  },
});

const AddNewChalet = () => {
  const { toast } = useToast();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { mutateAsync: createChalet, isPending } = useCreateChalet();

  const form = useForm<FormValues>({
    resolver: zodResolver(chaletSchema),
    defaultValues: {
      name: "",
      chaletType: "Duplex Lower",
      capacity: 1,
      price: 0,
      description: "",
      chaletImage:"",
      amenities: [],
      available: true,
      maintenanceMode: false,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select a JPG or PNG image.",
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
        });
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (
          img.width < ALLOWED_DIMENSIONS.width ||
          img.height < ALLOWED_DIMENSIONS.height
        ) {
          toast({
            variant: "destructive",
            title: "Image too small",
            description: `Image must be at least ${ALLOWED_DIMENSIONS.width}x${ALLOWED_DIMENSIONS.height} pixels.`,
          });
          return;
        }

        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      };
    }
  };

  const confirmCreate = async () => {
    setIsDialogOpen(false);
    const values = form.getValues();
    const photoName = `${values.name}`;
    try {
      let photoUrl = "";
      if (selectedImage) {
        const photoKey = `great-rift-lodge/chalets/${
          values.name
        }/${photoName}/${Date.now()}-${selectedImage.name}`;

        const command = new PutObjectCommand({
          Bucket: `${AWS_S3_BUCKET}`,
          Key: photoKey,
          Body: selectedImage,
          ContentType: selectedImage.type,
        });

        await client.send(command);

        // const { Location } = await s3.upload(params).promise();
        photoUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${photoKey}`;

        setPhotoUrl(photoUrl);
      }
      await createChalet({ ...values, chaletImage: photoUrl });
     
      form.reset();
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: "Failed to create staff: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="py-5">
      <Helmet>
        <title>Add New Staff</title>
      </Helmet>

      <div>
        <div className="space-y-4">
          <h1 className="font-bold text-2xl mb-5 text-[#1a3733]">Add Staff</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Chalet Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Chalet name"
                          type="text"
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  name="chaletType"
                  control={form.control}
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Chalet Type</FormLabel>
                      <FormControl>
                        <Select {...field}>
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Duplex Lower">
                              Duplex Lower
                            </SelectItem>
                            <SelectItem value="Duplex Upper">
                              Duplex Upper
                            </SelectItem>
                            <SelectItem value="Stand Alone Unit">
                              Stand Alone Unit
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  name="capacity"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Capacity"
                          type="number"
                          disabled={isPending}
                          className="h-10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  name="price"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Price"
                          type="number"
                          className="h-10"
                          disabled={isPending}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  {previewUrl ? (
                    <img
                      className="rounded-lg w-44 h-32 object-cover"
                      src={previewUrl}
                      alt="Preview"
                    />
                  ) : photoUrl ? (
                    <img
                      className="rounded-lg w-44 h-32 object-cover"
                      src={photoUrl}
                      alt="Staff Photo"
                    />
                  ) : (
                    <div className="rounded-lg w-44 h-32 bg-gray-200 flex items-center justify-center">
                      <Label htmlFor="profileImage" className="text-amber-600">
                        Upload Image
                      </Label>
                    </div>
                  )}
                  <Button
                    size="icon"
                    className="rounded-full bg-slate-700 dark:bg-gray-800 shadow-md"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Input
                    id="photo"
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/jpg"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Chalet Description"
                          className="h-20"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="col-span-6 sm:col-full flex justify-between mt-6">
              <Button
                type="submit"
                className="w-full h-12 bg-[#27534c] hover:bg-[#1a3733]"
                size="lg"
                disabled={isPending}
              >
                {isPending ? "Adding..." : "Add Chalet"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Chalet Creation</DialogTitle>
            <DialogDescription>
              Are you sure you want to create a new chalet with the provided
              information?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCreate} disabled={isPending}>
              {isPending ? "Creating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewChalet;
