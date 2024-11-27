import { Card, CardContent } from "@/components/ui/card";
import { addDays, format } from "date-fns";
import { Home, CalendarIcon, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface BookingParams {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  type: "Chalet";
}

interface DateRange {
  checkIn: Date;
  checkOut: Date;
}

export function BookingWidget() {
  const [type, setType] = useState<"Chalet">("Chalet");
  const [dates, setDates] = useState<DateRange>({
    checkIn: new Date(),
    checkOut: addDays(new Date(), 1),
  });
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
  });
  const [activeCalendar, setActiveCalendar] = useState<
    "checkIn" | "checkOut" | null
  >(null);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Add responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (activeCalendar === "checkIn") {
      setDates((prev) => ({
        ...prev,
        checkIn: selectedDate,
        checkOut:
          selectedDate < prev.checkOut
            ? prev.checkOut
            : addDays(selectedDate, 1),
      }));
    } else if (activeCalendar === "checkOut") {
      setDates((prev) => ({
        ...prev,
        checkOut: selectedDate,
      }));
    }
  };
  const handleDone = (popoverType: "calendar" | "guests") => {
    if (popoverType === "calendar") {
      setActiveCalendar(null);
    } else {
      setIsGuestsOpen(false);
    }
  };

  const resetSelection = () => {
    setDates({
      checkIn: new Date(),
      checkOut: addDays(new Date(), 1),
    });
    setGuests({
      adults: 2,
      children: 0,
    });
    setType("Chalet");
  };

  const handleSearch = async () => {
    setLoading(true);
    const searchParams = new URLSearchParams({
      checkIn: dates.checkIn.toISOString(),
      checkOut: dates.checkOut.toISOString(),
      adults: guests.adults.toString(),
      children: guests.children.toString(),
    });

    // Add loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500));
    navigate(`/search?${searchParams.toString()}`);
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mb-3 bg-white backdrop-blur shadow-xl rounded-xl">
      <Tabs
        defaultValue="chalet"
        className="w-full mt-2 max-w-3xl p-2 rounded-none"
      >
        <TabsList className="grid w-full grid-cols-2 bg-transparent h-12">
          <TabsTrigger
            value="chalet"
            className="p-2 transition-all w-32 text-base font-semibold data-[state=active]:bg-[#27534c] data-[state=active]:text-white"
          >
            {type === "Chalet" && <Home className="mr-2 h-4 w-4" />}
            {type}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chalet">
          <CardContent className="p-1 md:p-1">
            <div className="grid gap-2 md:grid-cols-[1fr,1fr,1fr,1fr]">
              {/* Check-in Date */}
              <Popover
                open={activeCalendar === "checkIn"}
                onOpenChange={(open) =>
                  setActiveCalendar(open ? "checkIn" : null)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start transition-all text-sm md:text-base",
                      activeCalendar === "checkIn" && "border-[#27534c]"
                    )}
                  >
                     <CalendarIcon className="mr-1 h-4 w-4" />
                    <span className="text-sm mt-1 font-medium text-gray-500">
                      Check in
                    </span>
                    <span className="text-base mt-1">
                      {format(dates.checkIn, "LLL dd, y")}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-screen md:w-auto p-0"
                  align="start"
                  sideOffset={8}
                >
                  <div className="p-3">
                    <Calendar
                      mode="single"
                      selected={dates.checkIn}
                      onSelect={handleDateSelect}
                      numberOfMonths={isMobile ? 1 : 2}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border-none"
                    />
                    <div className="flex justify-end p-2 border-t">
                      <Button
                        onClick={() => handleDone("calendar")}
                        className="px-8 bg-[#27534c] hover:bg-[#1c3d38]"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Check-out Date */}
              <Popover
                open={activeCalendar === "checkOut"}
                onOpenChange={(open) =>
                  setActiveCalendar(open ? "checkOut" : null)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start transition-all text-sm md:text-base",
                      activeCalendar === "checkOut" && "border-[#27534c]"
                    )}
                  >
                     <CalendarIcon className="mr-1 h-4 w-4" />
                    <span className="text-sm mt-1 font-medium text-gray-500">
                      Check out
                    </span>
                    <span className="text-base mt-1">
                      {format(dates.checkOut, "LLL dd, y")}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-screen md:w-auto p-0"
                  align="start"
                  sideOffset={8}
                >
                  <div className="p-3">
                    <Calendar
                      mode="single"
                      selected={dates.checkOut}
                      onSelect={handleDateSelect}
                      numberOfMonths={isMobile ? 1 : 2}
                      disabled={(date) => date <= dates.checkIn}
                      className="rounded-md border-none"
                    />
                    <div className="flex justify-end p-2 border-t">
                      <Button
                        onClick={() => handleDone("calendar")}
                        className="px-8 bg-[#27534c] hover:bg-[#1c3d38]"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Guests Selection */}
              <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start transition-all text-sm md:text-base"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {guests.adults + guests.children} Room
                    {guests.adults + guests.children !== 1 ? "s" : ""}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[280px] md:w-80"
                  align="start"
                  sideOffset={8}
                >
                  <div className="p-4 space-y-4">
                    <div className="space-y-4">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Adults</h4>
                          <p className="text-sm text-gray-500">Age 13+</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setGuests((prev) => ({
                                ...prev,
                                adults: Math.max(1, prev.adults - 1),
                              }))
                            }
                            disabled={guests.adults <= 1}
                            className="h-8 w-8"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">
                            {guests.adults}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setGuests((prev) => ({
                                ...prev,
                                adults: Math.min(10, prev.adults + 1),
                              }))
                            }
                            disabled={guests.adults >= 10}
                            className="h-8 w-8"
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Children</h4>
                          <p className="text-sm text-gray-500">Ages 0-12</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setGuests((prev) => ({
                                ...prev,
                                children: Math.max(0, prev.children - 1),
                              }))
                            }
                            disabled={guests.children <= 0}
                            className="h-8 w-8"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">
                            {guests.children}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setGuests((prev) => ({
                                ...prev,
                                children: Math.min(10, prev.children + 1),
                              }))
                            }
                            disabled={guests.children >= 10}
                            className="h-8 w-8"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <Button variant="ghost" onClick={resetSelection}>
                        Reset
                      </Button>
                      <Button
                        className="bg-[#27534c] hover:bg-[#1c3d38]"
                        onClick={() => handleDone("guests")}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
          className="h-12 md:h-12 text-base md:text-base bg-[#27534c] hover:bg-[#1c3d38] font-medium transition-all"
          onClick={handleSearch}
          disabled={loading || !dates.checkIn || !dates.checkOut}
        >
          {/* <SearchIcon className="mr-2 h-4 w-4" /> */}
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Searching...</span>
            </div>
          ) : (
            `Search ${type}`
          )}
        </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
