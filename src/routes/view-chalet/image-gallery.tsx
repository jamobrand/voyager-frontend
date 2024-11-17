import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ImageGallery = ({ images }: { images: string[] }) => {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
    return (
      <>
        <div className="grid grid-cols-4 gap-2 mb-8 h-[400px]">
          <div className="col-span-2 row-span-2">
            <img
              src={images[0]}
              alt="Main"
              className="w-full h-[400px] object-cover rounded-l-xl cursor-pointer"
              onClick={() => setSelectedImage(0)}
            />
          </div>
          <div className="grid grid-cols-2 col-span-2 gap-2 h-full">
            {images.slice(1, 5).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Gallery ${index + 1}`}
                className={`w-full h-[196px] object-cover cursor-pointer ${
                  index === 1 ? 'rounded-tr-xl' : index === 3 ? 'rounded-br-xl' : ''
                }`}
                onClick={() => setSelectedImage(index + 1)}
              />
            ))}
          </div>
        </div>
  
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl mx-auto">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Gallery</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            {selectedImage !== null && (
              <div className="relative aspect-video">
                <img
                  src={images[selectedImage]}
                  alt={`Full size ${selectedImage}`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  };

  export default ImageGallery;