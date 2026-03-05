import type { Transaction, Appointment, Employee, LeaveRequest, InductionTask, PerformanceReview, HRQuery, TrainingModule } from './types';

export const transactions: Transaction[] = [
  {
    id: "txn_1",
    date: new Date(2023, 10, 5).toISOString(),
    type: "income",
    category: "Client Project",
    description: "Web design for 'Creative Solutions'",
    amount: 2500,
  },
  {
    id: "txn_2",
    date: new Date(2023, 10, 8).toISOString(),
    type: "expense",
    category: "Software",
    description: "Figma Subscription",
    amount: 15,
  },
  {
    id: "txn_3",
    date: new Date(2023, 11, 15).toISOString(),
    type: "income",
    category: "Client Project",
    description: "Logo design for 'Startup Inc'",
    amount: 800,
  },
  {
    id: "txn_4",
    date: new Date(2023, 11, 20).toISOString(),
    type: "expense",
    category: "Utilities",
    description: "Monthly Internet Bill",
    amount: 60,
  },
  {
    id: "txn_5",
    date: new Date(2024, 0, 10).toISOString(),
    type: "income",
    category: "Consulting",
    description: "Marketing strategy session",
    amount: 500,
  },
  {
    id: "txn_6",
    date: new Date(2024, 0, 12).toISOString(),
    type: "expense",
    category: "Office Supplies",
    description: "Notebooks and pens",
    amount: 45,
  },
  {
    id: "txn_7",
    date: new Date(2024, 1, 1).toISOString(),
    type: "income",
    category: "Client Project",
    description: "Backend dev for 'Tech Innovators'",
    amount: 4200,
  },
  {
    id: "txn_8",
    date: new Date(2024, 1, 5).toISOString(),
    type: "expense",
    category: "Rent",
    description: "Co-working space fee",
    amount: 250,
  },
  {
    id: "txn_9",
    date: new Date(2024, 2, 18).toISOString(),
    type: "income",
    category: "Maintenance",
    description: "Website update for 'Creative Solutions'",
    amount: 350,
  },
  {
    id: "txn_10",
    date: new Date(2024, 2, 22).toISOString(),
    type: "expense",
    category: "Marketing",
    description: "Social media ads",
    amount: 150,
  },
];

export const appointments: Appointment[] = [
    {
        id: "apt_1",
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        title: "Project Kickoff with Startup Inc.",
        description: "Initial meeting to discuss project scope and deliverables.",
    },
    {
        id: "apt_2",
        date: new Date(new Date().setDate(new Date().getDate() + 5)),
        title: "Design Review with Creative Solutions",
        description: "Review of the latest design mockups.",
    },
    {
        id: "apt_3",
        date: new Date(new Date().setDate(new Date().getDate() - 3)),
        title: "Dentist Appointment",
        description: "Annual check-up.",
    },
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
  { id: 'task_3', employeeId: 'emp_4', task: 'Team introduction meeting', completed: false, dueDate: '2024-05-23' },
];

export const performanceReviews: PerformanceReview[] = [
  { id: 'rev_1', employeeId: 'emp_1', employeeName: 'Alice Johnson', date: '2024-01-15', rating: 5, feedback: 'Outstanding performance and leadership.', reviewer: 'Jane Doe' },
  { id: 'rev_2', employeeId: 'emp_2', employeeName: 'Bob Smith', date: '2024-02-10', rating: 4, feedback: 'Great design sense, needs to work on deadlines.', reviewer: 'Jane Doe' },
];

export const hrQueries: HRQuery[] = [
  { id: 'q_1', employeeId: 'emp_1', employeeName: 'Alice Johnson', subject: 'Insurance Policy', message: 'I need details on the updated health insurance.', status: 'Open', priority: 'Medium', date: '2024-05-25' },
];

export const trainingModules: TrainingModule[] = [
  {
    id: 'tr_1',
    title: 'Cybersecurity Awareness',
    description: 'Learn the basics of staying safe online at work.',
    duration: '45 mins',
    category: 'Security',
    questions: [
      { question: 'What is phishing?', options: ['A sport', 'An email scam', 'A coding language'], correctAnswer: 1 },
      { question: 'Should you reuse passwords?', options: ['Yes', 'No', 'Only for personal accounts'], correctAnswer: 1 }
    ]
  },
  {
    id: 'tr_2',
    title: 'Workplace Ethics',
    description: 'Understanding our code of conduct.',
    duration: '30 mins',
    category: 'Compliance',
    questions: [
      { question: 'Who is responsible for ethics?', options: ['Management', 'HR', 'Everyone'], correctAnswer: 2 }
    ]
  }
];