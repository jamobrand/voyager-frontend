import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addDays, format } from "date-fns";
import { Home, CalendarIcon, Users} from "lucide-react";
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

export interface BookingParams {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  type: "CHALET";
}

interface BookingWidgetProps {
  onSearch: (params: BookingParams) => Promise<void>;
  loading?: boolean;
}

interface DateRange {
  from: Date;
  to: Date | undefined;
}

export function BookingWidget({
  loading = false,
}: BookingWidgetProps) {
  const [type, setType] = useState<'CHALET'>('CHALET');
  const [dates, setDates] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();

  // Add responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDateSelect = (range: { from: Date | undefined; to?: Date | undefined } | undefined) => {
    if (range && range.from) {
      setDates({ from: range.from, to: range.to });
    }
  };

  const handleDone = (popoverType: 'calendar' | 'guests') => {
    if (popoverType === 'calendar') {
      setIsCalendarOpen(false);
    } else {
      setIsGuestsOpen(false);
    }
  };

  const resetSelection = () => {
    setDates({
      from: new Date(),
      to: addDays(new Date(), 1),
    });
    setGuests({
      adults: 2,
      children: 0,
    });
    setType('CHALET');
  };

  const handleSearch = () => {
    if (dates.from && dates.to) {
      const searchParams = new URLSearchParams({
        checkIn: dates.from.toISOString(),
        checkOut: dates.to.toISOString(),
        adults: guests.adults.toString(),
        children: guests.children.toString(),
      });
      
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur shadow-xl rounded-xl">
      <CardHeader className="space-y-1 p-4 md:p-6">
        <CardTitle className="text-xl md:text-2xl font-bold">Find your perfect chalet</CardTitle>
        <CardDescription className="text-gray-500">
          Search available {type.toLowerCase()}s for your dates
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr,2fr,1fr]">
          {/* Property Type Selection */}
          <div className="flex items-center space-x-4">
            <Button
              variant={type === 'CHALET' ? 'greatRiftColorDefault' : 'greatRiftColorOutline'}
              onClick={() => setType('CHALET')}
              className="flex-1 transition-all text-sm md:text-base"
            >
              <Home className="mr-2 h-4 w-4" />
              Chalet
            </Button>
          </div>

          {/* Date Selection */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal transition-all text-sm md:text-base',
                  !dates && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dates?.from ? (
                  dates.to ? (
                    <>
                      {format(dates.from, 'LLL dd, y')} -{' '}
                      {format(dates.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dates.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-screen md:w-auto p-0" 
              align="start"
              sideOffset={8}
            >
              <div className="p-3">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dates?.from}
                  selected={dates}
                  onSelect={handleDateSelect}
                  numberOfMonths={isMobile ? 1 : 2}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border-none"
                />
                <div className="flex justify-end p-2 border-t">
                  <Button 
                    onClick={() => handleDone('calendar')} 
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
                className="w-full justify-start transition-all text-sm md:text-base"
              >
                <Users className="mr-2 h-4 w-4" />
                {guests.adults + guests.children} Guest{guests.adults + guests.children !== 1 ? 's' : ''}
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
                        onClick={() => setGuests(prev => ({
                          ...prev,
                          adults: Math.max(1, prev.adults - 1),
                        }))}
                        disabled={guests.adults <= 1}
                        className="h-8 w-8"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{guests.adults}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setGuests(prev => ({
                          ...prev,
                          adults: Math.min(10, prev.adults + 1),
                        }))}
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
                        onClick={() => setGuests(prev => ({
                          ...prev,
                          children: Math.max(0, prev.children - 1),
                        }))}
                        disabled={guests.children <= 0}
                        className="h-8 w-8"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{guests.children}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setGuests(prev => ({
                          ...prev,
                          children: Math.min(10, prev.children + 1),
                        }))}
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
                    onClick={() => handleDone('guests')}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
      <CardFooter className="p-4 md:p-6">
        <Button
          className="w-full h-10 md:h-12 text-base md:text-lg bg-[#27534c] hover:bg-[#1c3d38] font-medium transition-all"
          onClick={handleSearch}
          disabled={loading || !dates.from || !dates.to}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Searching...</span>
            </div>
          ) : (
            'Search'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}