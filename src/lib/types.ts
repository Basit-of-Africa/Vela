export type Transaction = {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
};

export type Appointment = {
  id: string;
  date: Date;
  title: string;
  description: string;
};
