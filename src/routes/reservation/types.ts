export interface Reservation {
    id: number;
    checkIn: string;
    checkOut: string;
    totalCost: string;
    adults: number;
    children: number;
    specialRequests: string | null;
    status: "CONFIRMED" | "CANCELLED" | "PENDING"; // Add other possible statuses if needed
    paymentStatus: "PAID" | "UNPAID" | "PARTIAL"; // Add other payment statuses if needed
    bookingSource: string;
    bookingRefNumber: string;
    earlyCheckinRequest: boolean;
    lateCheckoutRequest: boolean;
    discountApplied: string;
    refundedAmount: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    cancelledAt: string | null;
    cancellationReason: string | null;
    createdAt: string;
    updatedAt: string;
    customerId: number;
    chaletId: number;
    customer: Customer;
  }
  
  interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    nationality: string;
    nationalIdNumber: string;
    dateOfBirth: string | null;
    loyaltyPoints: number | null;
    profilePicture: string | null;
    preferredRoomType: string | null;
    createdAt: string;
    updatedAt: string;
  }
  