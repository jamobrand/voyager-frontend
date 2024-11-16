import { format } from 'date-fns';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays,
  Users,
  Building2,
  CreditCard,
  Clock,
  Mail,
  Phone,
  MapPin,
  Flag,
  IdCard,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useGetReservation } from '@/features/reservation/use-get-reservation';
import { useParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from 'react';

enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED"
}

const ViewReservationPage = () => {
    const params = useParams();

    const reservationId = Number(params.id);
  const { data: reservation, isLoading } = useGetReservation(reservationId);

  if (isLoading) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center">
        <Loader2 className="size-6 text-orange-300 animate-spin" />
      </div>
    );
  }

  if (!reservation) return null;

  const stayDuration = Math.ceil(
    (new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'CHECKED_IN':
        return 'bg-blue-500';
      case 'CHECKED_OUT':
        return 'bg-purple-500';
      case 'CANCELLED':
        return 'bg-red-500';
      case 'COMPLETED':
        return 'bg-green-700';
      default:
        return 'bg-gray-500';
    }
  };

  const isStatusChangeAllowed = (currentStatus: string, newStatus: string) => {
    const statusFlow = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['CHECKED_IN', 'CANCELLED'],
      CHECKED_IN: ['CHECKED_OUT'],
      CHECKED_OUT: ['COMPLETED'],
      CANCELLED: [],
      COMPLETED: []
    };

    return statusFlow[currentStatus as keyof typeof statusFlow].includes(newStatus);
  };
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Reservation #{reservation.id}</h1>
          <p className="text-gray-500">Created {format(new Date(reservation.createdAt), 'PPP')}</p>
        </div>
        <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
              <Select
                // disabled={isUpdating}
                value={reservation.status}
                // onValueChange={(value) => handleStatusChange(value as ReservationStatus)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ReservationStatus).map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      disabled={!isStatusChangeAllowed(reservation.status, status)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                        {status.replace('_', ' ')}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge 
                variant="secondary"
                className={`${getStatusColor(reservation.status)} text-white`}
              >
                {reservation.status.replace('_', ' ')}
              </Badge>
            </div>
          
          <Badge 
            variant="destructive"
            className={`${getStatusColor(reservation.paymentStatus)} text-white`}
          >
            {reservation.paymentStatus}
          </Badge>
        </div>
          
        </div>
      </div>

         {/* Status Flow Information */}
         <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-5" />
            Status Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'COMPLETED'].map((status, index) => (
                <React.Fragment key={status}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      reservation.status === status ? getStatusColor(status) : 'bg-gray-200'
                    } ${reservation.status === status ? 'text-white' : 'text-gray-500'}`}>
                      {index + 1}
                    </div>
                    <span className="text-sm mt-1">{status.replace('_', ' ')}</span>
                  </div>
                  {index < 4 && (
                    <div className={`h-0.5 w-12 ${
                      ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'COMPLETED']
                        .indexOf(reservation.status) > index ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {reservation.status === 'CANCELLED' && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="font-medium text-red-600">Reservation Cancelled</p>
              {reservation.cancellationReason && (
                <p className="text-sm text-red-500 mt-1">
                  Reason: {reservation.cancellationReason}
                </p>
              )}
              {reservation.cancelledAt && (
                <p className="text-sm text-red-500">
                  Cancelled on: {format(new Date(reservation.cancelledAt), 'PPP pp')}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chalet Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5" />
              Chalet Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={reservation.chalet.chaletImage} 
              alt={reservation.chalet.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{reservation.chalet.name}</h3>
              <p className="text-gray-600">Type: {reservation.chalet.chaletType}</p>
              <p className="text-gray-600">Capacity: {reservation.chalet.capacity} persons</p>
              <p className="text-gray-600">Price per night: KES {Number(reservation.chalet.price).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Stay Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-5" />
              Stay Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-medium">{format(new Date(reservation.checkIn), 'PPP')}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{stayDuration} nights</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="font-medium">{format(new Date(reservation.checkOut), 'PPP')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-5 text-gray-500" />
              <span>{reservation.adults} Adults, {reservation.children} Children</span>
            </div>
            {reservation.specialRequests && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">Special Requests:</p>
                <p className="text-gray-600">{reservation.specialRequests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guest Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Guest Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg font-medium">
              {reservation.customer.firstName} {reservation.customer.lastName}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-gray-500" />
                <span>{reservation.customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-gray-500" />
                <span>{reservation.customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-gray-500" />
                <span>{reservation.customer.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="size-4 text-gray-500" />
                <span>{reservation.customer.nationality}</span>
              </div>
              <div className="flex items-center gap-2">
                <IdCard className="size-4 text-gray-500" />
                <span>ID: {reservation.customer.nationalIdNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="font-medium">Total Amount</span>
              <span className="text-xl font-semibold">
                KES {Number(reservation.totalCost).toLocaleString()}
              </span>
            </div>
            {reservation.payments.map((payment) => (
              <div key={payment.id} className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-medium">{payment.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{format(new Date(payment.date), 'PPP')}</span>
                </div>
                {payment.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-medium">Notes:</p>
                    <p>{payment.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Reservation Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-2 bg-green-500 rounded-full" />
              <div>
                <p className="font-medium">Reservation Created</p>
                <p className="text-sm text-gray-500">{format(new Date(reservation.createdAt), 'PPP pp')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 bg-blue-500 rounded-full" />
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-sm text-gray-500">{format(new Date(reservation.updatedAt), 'PPP pp')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewReservationPage;