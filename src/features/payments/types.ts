export type TransactionResponse = {
  id: number;
  amount: string;
  paymentMethod: string;
  transactionId: string;
  date: string;
  status: string;
  notes: string | null;
  reservationId: number;
};
