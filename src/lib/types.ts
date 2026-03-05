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

export type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: 'Active' | 'Onboarding' | 'On Leave' | 'Terminated';
  joinDate: string;
  avatar?: string;
};

export type InductionTask = {
  id: string;
  employeeId: string;
  task: string;
  completed: boolean;
  dueDate: string;
};

export type LeaveRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Annual' | 'Sick' | 'Maternity' | 'Unpaid';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
};

export type PerformanceReview = {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  rating: number; // 1-5
  feedback: string;
  reviewer: string;
};

export type HRQuery = {
  id: string;
  employeeId: string;
  employeeName: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  date: string;
};

export type TrainingModule = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
};