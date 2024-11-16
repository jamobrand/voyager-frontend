export interface ReservationConfirmation {
    id: number;
    bookingRefNumber: string;
    checkIn: Date;
    checkOut: Date;
    totalCost: number;
    adults: number;
    children: number;
    status: string;
    paymentStatus: string;
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    chalet: {
      name: string;
      chaletType: string;
      chaletImage: string;
    };
  }
  
  // Confirmation Page Component
  import { useLocation, useNavigate } from 'react-router-dom';
  import { format } from 'date-fns';
  import { Check, Calendar, User, Users } from 'lucide-react';
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { Separator } from '@/components/ui/separator';
import { PDFPreview } from './pdf/pdf-template';
// import { toast } from '@/hooks/use-toast';


  const BookedConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const reservation: ReservationConfirmation = location.state?.reservation;

  
    if (!reservation) {
      navigate('/search');
      return null;
    }
  
    // const handleDownloadConfirmation = () => {
    //   // Implement PDF generation and download
    //   console.log('Downloading confirmation...');
    // };

    // const handleDownloadConfirmation = async () => {
    //   try {
    //     await PDFGenerationService.generateBookingConfirmationPDF(reservation);
    //     toast({
    //       title: "Success",
    //       description: "Booking confirmation downloaded successfully",
    //     });
    //   } catch (error) {
    //     console.error('Error generating PDF:', error);
    //     toast({
    //       title: "Error",
    //       description: "Failed to generate PDF. Please try again.",
    //       variant: "destructive",
    //     });
    //   }
    // };
  
    // const handleShareReservation = async () => {
    //   const shareData = {
    //     title: 'My Chalet Reservation',
    //     text: `I've booked ${reservation.chalet.name} for ${format(new Date(reservation.checkIn), 'PP')}`,
    //     url: window.location.href,
    //   };
  
    //   if (navigator.share) {
    //     try {
    //       await navigator.share(shareData);
    //       toast({
    //         title: "Success",
    //         description: "Reservation shared successfully",
    //       });
    //     } catch (error) {
    //       if ((error as Error).name !== 'AbortError') {
    //         toast({
    //           title: "Error",
    //           description: `${error}` || "Failed to share reservation",
    //           variant: "destructive",
    //         });
    //       }
    //     }
    //   } else {
    //     // Fallback for browsers that don't support sharing
    //     try {
    //       await navigator.clipboard.writeText(
    //         `${shareData.title}\n${shareData.text}\n${shareData.url}`
    //       );
    //       toast({
    //         title: "Success",
    //         description: "Reservation details copied to clipboard",
    //       });
    //     } catch (error) {
    //       toast({
    //         title: "Error",
    //         description: `${error}` || "Failed to copy reservation details",
    //         variant: "destructive",
    //       });
    //     }
    //   }
    // };
  
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center border-b border-gray-200">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Booking Confirmed!
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Booking Reference: {reservation.bookingRefNumber}
              </p>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Chalet Details */}
              <div className="flex items-start space-x-4">
                <img
                  src={reservation.chalet.chaletImage}
                  alt={reservation.chalet.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{reservation.chalet.name}</h3>
                  <p className="text-gray-600">{reservation.chalet.chaletType}</p>
                </div>
              </div>
  
              <Separator />
  
              {/* Stay Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">
                      {format(new Date(reservation.checkIn), 'PPP')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">
                      {format(new Date(reservation.checkOut), 'PPP')}
                    </p>
                  </div>
                </div>
              </div>
  
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Guests</p>
                  <p className="font-medium">
                    {reservation.adults} Adults, {reservation.children} Children
                  </p>
                </div>
              </div>
  
              <Separator />
  
              {/* Payment Details */}
              <div>
                <h4 className="font-semibold mb-2">Payment Details</h4>
                <div className="flex justify-between text-gray-600">
                  <span>Total Paid</span>
                  <span className="font-medium">
                    KES {reservation.totalCost.toLocaleString()}
                  </span>
                </div>
              </div>
  
              {/* Actions */}
              {/* <div className="flex space-x-4 pt-4">
                <Button
                  onClick={handleDownloadConfirmation}
                  className="flex-1"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={handleShareReservation}
                  className="flex-1"
                  variant="outline"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div> */}
            </CardContent>
          </Card>

<div className='mt-8'> <PDFPreview reservation={reservation} /></div>
         
  
          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Need help with your booking?{' '}
              <button
                onClick={() => navigate('/contact')}
                className="text-primary-600 hover:underline"
              >
                Contact us
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default BookedConfirmation;