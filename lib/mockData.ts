// Mock data for the Expense Management System

export interface Expense {
  id: string
  employeeId: string
  employeeName: string
  amount: number
  category: string
  description: string
  date: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "employee" | "manager" | "admin"
  status: "active" | "inactive"
  createdAt: string
}

export interface WorkflowSettings {
  autoApproveThreshold: number
  requireManagerApproval: "always" | "threshold" | "never"
  approvalSequence: string[]
}

// Mock expenses data
export const mockExpenses: Expense[] = [
  {
    id: "exp-001",
    employeeId: "user-001",
    employeeName: "John Smith",
    amount: 250.0,
    category: "travel",
    description: "Client meeting transportation - Uber to downtown office",
    date: "2025-01-15",
    status: "pending",
    submittedAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "exp-002",
    employeeId: "user-003",
    employeeName: "Sarah Johnson",
    amount: 85.5,
    category: "meals",
    description: "Team lunch at Italian restaurant",
    date: "2025-01-14",
    status: "pending",
    submittedAt: "2025-01-14T14:20:00Z",
  },
  {
    id: "exp-003",
    employeeId: "user-005",
    employeeName: "Mike Davis",
    amount: 450.0,
    category: "equipment",
    description: "New mechanical keyboard and ergonomic mouse",
    date: "2025-01-13",
    status: "approved",
    submittedAt: "2025-01-13T09:15:00Z",
    reviewedAt: "2025-01-13T16:45:00Z",
    reviewedBy: "Sarah Johnson",
  },
  {
    id: "exp-004",
    employeeId: "user-001",
    employeeName: "John Smith",
    amount: 125.0,
    category: "office",
    description: "Office supplies - notebooks, pens, sticky notes",
    date: "2025-01-12",
    status: "approved",
    submittedAt: "2025-01-12T11:00:00Z",
    reviewedAt: "2025-01-12T15:30:00Z",
    reviewedBy: "Sarah Johnson",
  },
  {
    id: "exp-005",
    employeeId: "user-005",
    employeeName: "Mike Davis",
    amount: 75.0,
    category: "meals",
    description: "Dinner with potential client",
    date: "2025-01-11",
    status: "rejected",
    submittedAt: "2025-01-11T19:30:00Z",
    reviewedAt: "2025-01-11T20:15:00Z",
    reviewedBy: "Sarah Johnson",
  },
  {
    id: "exp-006",
    employeeId: "user-003",
    employeeName: "Sarah Johnson",
    amount: 320.0,
    category: "travel",
    description: "Flight tickets for conference",
    date: "2025-01-10",
    status: "approved",
    submittedAt: "2025-01-10T08:00:00Z",
    reviewedAt: "2025-01-10T10:30:00Z",
    reviewedBy: "Admin User",
  },
]

// Mock users data
export const mockUsers: User[] = [
  {
    id: "user-001",
    name: "John Smith",
    email: "john@company.com",
    role: "employee",
    status: "active",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "user-002",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "manager",
    status: "active",
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "user-003",
    name: "Mike Davis",
    email: "mike@company.com",
    role: "employee",
    status: "active",
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "user-004",
    name: "Emily Brown",
    email: "emily@company.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "user-005",
    name: "David Wilson",
    email: "david@company.com",
    role: "employee",
    status: "inactive",
    createdAt: "2024-03-15T00:00:00Z",
  },
]

// Mock workflow settings
export const mockWorkflowSettings: WorkflowSettings = {
  autoApproveThreshold: 100,
  requireManagerApproval: "always",
  approvalSequence: ["manager", "admin"],
}
