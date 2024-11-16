import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Chalet, Room } from "./types/room";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
    results: (Room | Chalet)[];
    loading: boolean;
    onBookNow: (item: Room | Chalet) => void;
  }
  
  export function SearchResults({ results, loading, onBookNow }: SearchResultsProps) {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
  
    if (!results.length) {
      return (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            No available accommodations found for your selected dates.
          </p>
        </Card>
      );
    }
  
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src="/api/placeholder/400/300"
                alt={`${item.type} ${item.number}`}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={item.available ? 'default' : 'secondary'}>
                  {item.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle>
                {item.type} {item.number}
              </CardTitle>
              <CardDescription>
                Capacity: {item.capacity} guests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">
                  ${item.price.toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /night
                  </span>
                </p>
                <div className="flex flex-wrap gap-1">
                  {item.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => onBookNow(item)}
                disabled={!item.available}
              >
                Book Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }