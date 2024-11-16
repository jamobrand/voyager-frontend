type Payment = {
    id: number;
    amount: string;
    paymentMethod: string;
    transactionId: string;
    date: string;
    status: string;
    notes: string | null;
    reservationId: number;
  };
  
  type Customer = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    nationality: string;
    nationalIdNumber: string;
    createdAt: string;
    updatedAt: string;
  };
  
  type Chalet = {
    id: number;
    name: string;
    chaletType: string;
    capacity: number;
    chaletImage: string;
    price: string;
    description: string;
    amenities: string[];
    available: boolean;
    maintenanceMode: boolean;
    createdAt: string;
    updatedAt: string;
  };
  
  export type Reservation = {
    id: number;
    checkIn: string;
    checkOut: string;
    totalCost: string;
    adults: number;
    children: number;
    specialRequests: string | null;
    status: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
    customerId: number;
    roomId: number | null;
    chaletId: number;
    chalet: Chalet;
    customer: Customer;
    payments: Payment[];
  };