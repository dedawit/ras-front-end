export interface Feedback {
  id: string;
  transactionId: string;
  comment: string;
  star: number;
  createdAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName?: string;
  };
}

export interface CreateFeedbackData {
  transactionId: string;
  createdBy: string; // Added userId field
  comment: string;
  star: number;
}
