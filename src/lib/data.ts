import type { 
  Transaction, 
  Appointment, 
  Employee, 
  LeaveRequest, 
  InductionTask, 
  PerformanceReview, 
  HRQuery, 
  TrainingModule,
  Customer,
  Lead,
  Interaction
} from './types';

export const transactions: Transaction[] = [
  { id: "txn_1", date: new Date(2023, 10, 5).toISOString(), type: "income", category: "Client Project", description: "Web design for 'Creative Solutions'", amount: 2500 },
  { id: "txn_2", date: new Date(2023, 10, 8).toISOString(), type: "expense", category: "Software", description: "Figma Subscription", amount: 15 },
  { id: "txn_3", date: new Date(2023, 11, 15).toISOString(), type: "income", category: "Client Project", description: "Logo design for 'Startup Inc'", amount: 800 },
  { id: "txn_4", date: new Date(2023, 11, 20).toISOString(), type: "expense", category: "Utilities", description: "Monthly Internet Bill", amount: 60 },
  { id: "txn_5", date: new Date(2024, 0, 10).toISOString(), type: "income", category: "Consulting", description: "Marketing strategy session", amount: 500 },
  { id: "txn_6", date: new Date(2024, 0, 12).toISOString(), type: "expense", category: "Office Supplies", description: "Notebooks and pens", amount: 45 },
  { id: "txn_7", date: new Date(2024, 1, 1).toISOString(), type: "income", category: "Client Project", description: "Backend dev for 'Tech Innovators'", amount: 4200 },
  { id: "txn_8", date: new Date(2024, 1, 5).toISOString(), type: "expense", category: "Rent", description: "Co-working space fee", amount: 250 },
];

export const appointments: Appointment[] = [
    { id: "apt_1", date: new Date(new Date().setDate(new Date().getDate() + 2)), title: "Project Kickoff", description: "Initial meeting with Startup Inc." },
    { id: "apt_2", date: new Date(new Date().setDate(new Date().getDate() + 5)), title: "Design Review", description: "Review mockups with Creative Solutions." },
];

export const employees: Employee[] = [
  { id: 'emp_1', name: 'Alice Johnson', role: 'Senior Developer', department: 'Engineering', email: 'alice@bizhub.com', status: 'Active', joinDate: '2022-03-15' },
  { id: 'emp_2', name: 'Bob Smith', role: 'Product Designer', department: 'Design', email: 'bob@bizhub.com', status: 'Active', joinDate: '2023-01-10' },
  { id: 'emp_3', name: 'Charlie Davis', role: 'Marketing Lead', department: 'Marketing', email: 'charlie@bizhub.com', status: 'On Leave', joinDate: '2021-11-05' },
  { id: 'emp_4', name: 'Diana Prince', role: 'Junior QA', department: 'Engineering', email: 'diana@bizhub.com', status: 'Onboarding', joinDate: '2024-05-20' },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 'lv_1', employeeId: 'emp_3', employeeName: 'Charlie Davis', type: 'Annual', startDate: '2024-06-01', endDate: '2024-06-15', status: 'Approved', reason: 'Summer vacation' },
  { id: 'lv_2', employeeId: 'emp_2', employeeName: 'Bob Smith', type: 'Sick', startDate: '2024-05-15', endDate: '2024-05-16', status: 'Pending', reason: 'Flu symptoms' },
];

export const inductionTasks: InductionTask[] = [
  { id: 'task_1', employeeId: 'emp_4', task: 'Sign employment contract', completed: true, dueDate: '2024-05-21' },
  { id: 'task_2', employeeId: 'emp_4', task: 'Setup workstation', completed: false, dueDate: '2024-05-22' },
];

export const performanceReviews: PerformanceReview[] = [
  { id: 'rev_1', employeeId: 'emp_1', employeeName: 'Alice Johnson', date: '2024-01-15', rating: 5, feedback: 'Outstanding leadership.', reviewer: 'Jane Doe' },
];

export const hrQueries: HRQuery[] = [
  { id: 'q_1', employeeId: 'emp_1', employeeName: 'Alice Johnson', subject: 'Insurance', message: 'I need details on the updated health insurance.', status: 'Open', priority: 'Medium', date: '2024-05-25' },
];

export const trainingModules: TrainingModule[] = [
  {
    id: 'tr_1',
    title: 'Cybersecurity Awareness',
    description: 'Learn basics of staying safe online.',
    duration: '45 mins',
    category: 'Security',
    questions: [{ question: 'What is phishing?', options: ['Sport', 'Email scam', 'Language'], correctAnswer: 1 }]
  }
];

// CRM Data
export const customers: Customer[] = [
  { id: 'cust_1', name: 'John Miller', company: 'Miller Corp', email: 'john@millercorp.com', phone: '555-0101', status: 'Active', lastContact: '2024-05-20', totalValue: 15000 },
  { id: 'cust_2', name: 'Sarah Wilson', company: 'Wilson Designs', email: 'sarah@wilson.com', phone: '555-0202', status: 'Active', lastContact: '2024-05-22', totalValue: 8400 },
  { id: 'cust_3', name: 'Mike Ross', company: 'Ross Legal', email: 'mike@ross.com', phone: '555-0303', status: 'Lead', lastContact: '2024-05-18', totalValue: 0 },
];

export const leads: Lead[] = [
  { id: 'lead_1', title: 'Website Redesign', customerName: 'Ross Legal', value: 5000, stage: 'Discovery', probability: 20, createdAt: '2024-05-15' },
  { id: 'lead_2', title: 'Mobile App Project', customerName: 'Miller Corp', value: 12000, stage: 'Proposal', probability: 60, createdAt: '2024-05-10' },
  { id: 'lead_3', title: 'SEO Optimization', customerName: 'Wilson Designs', value: 2500, stage: 'Negotiation', probability: 80, createdAt: '2024-05-12' },
];

export const interactions: Interaction[] = [
  { id: 'int_1', customerId: 'cust_1', customerName: 'John Miller', type: 'Call', content: 'Discussed project timeline for app.', date: '2024-05-20' },
  { id: 'int_2', customerId: 'cust_2', customerName: 'Sarah Wilson', type: 'Email', content: 'Sent final design invoice.', date: '2024-05-22' },
];