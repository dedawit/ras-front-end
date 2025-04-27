export interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  bid: {
    id: string;
    totalPrice: number;
    createdBy: {
      companyName: string;
    };
    rfq?: {
      createdBy: {
        companyName: string;
      };
    };
  };
}
