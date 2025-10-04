// Mock API functions with simulated network delays

import { mockExpenses, mockUsers, mockWorkflowSettings } from "./mockData"
import type { Expense, User, WorkflowSettings } from "./mockData"

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// In-memory storage (simulates database)
let expenses = [...mockExpenses]
let users = [...mockUsers]
let workflowSettings = { ...mockWorkflowSettings }

// Expense API
export const expenseApi = {
  // Get all expenses
  getAllExpenses: async (): Promise<Expense[]> => {
    await delay(800)
    return [...expenses]
  },

  // Get expenses by employee ID
  getExpensesByEmployee: async (employeeId: string): Promise<Expense[]> => {
    await delay(600)
    return expenses.filter((exp) => exp.employeeId === employeeId)
  },

  // Get expenses by status
  getExpensesByStatus: async (status: "pending" | "approved" | "rejected"): Promise<Expense[]> => {
    await delay(700)
    return expenses.filter((exp) => exp.status === status)
  },

  // Create new expense
  createExpense: async (
    expenseData: Omit<Expense, "id" | "status" | "submittedAt">,
  ): Promise<{ success: boolean; expense?: Expense; error?: string }> => {
    await delay(1000)

    try {
      const newExpense: Expense = {
        ...expenseData,
        id: `exp-${Date.now()}`,
        status: "pending",
        submittedAt: new Date().toISOString(),
      }

      expenses = [newExpense, ...expenses]
      return { success: true, expense: newExpense }
    } catch (error) {
      return { success: false, error: "Failed to create expense" }
    }
  },

  // Update expense status (approve/reject)
  updateExpenseStatus: async (
    expenseId: string,
    status: "approved" | "rejected",
    reviewedBy: string,
  ): Promise<{ success: boolean; expense?: Expense; error?: string }> => {
    await delay(800)

    try {
      const expenseIndex = expenses.findIndex((exp) => exp.id === expenseId)

      if (expenseIndex === -1) {
        return { success: false, error: "Expense not found" }
      }

      expenses[expenseIndex] = {
        ...expenses[expenseIndex],
        status,
        reviewedAt: new Date().toISOString(),
        reviewedBy,
      }

      return { success: true, expense: expenses[expenseIndex] }
    } catch (error) {
      return { success: false, error: "Failed to update expense status" }
    }
  },
}

// User API
export const userApi = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    await delay(700)
    return [...users]
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<User | null> => {
    await delay(500)
    return users.find((user) => user.id === userId) || null
  },

  // Create new user
  createUser: async (
    userData: Omit<User, "id" | "createdAt">,
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    await delay(900)

    try {
      // Check if email already exists
      if (users.some((user) => user.email === userData.email)) {
        return { success: false, error: "Email already exists" }
      }

      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }

      users = [...users, newUser]
      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: "Failed to create user" }
    }
  },

  // Update user status
  updateUserStatus: async (
    userId: string,
    status: "active" | "inactive",
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    await delay(600)

    try {
      const userIndex = users.findIndex((user) => user.id === userId)

      if (userIndex === -1) {
        return { success: false, error: "User not found" }
      }

      users[userIndex] = { ...users[userIndex], status }
      return { success: true, user: users[userIndex] }
    } catch (error) {
      return { success: false, error: "Failed to update user status" }
    }
  },

  // Delete user
  deleteUser: async (userId: string): Promise<{ success: boolean; error?: string }> => {
    await delay(700)

    try {
      const userIndex = users.findIndex((user) => user.id === userId)

      if (userIndex === -1) {
        return { success: false, error: "User not found" }
      }

      users = users.filter((user) => user.id !== userId)
      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete user" }
    }
  },
}

// Workflow API
export const workflowApi = {
  // Get workflow settings
  getWorkflowSettings: async (): Promise<WorkflowSettings> => {
    await delay(500)
    return { ...workflowSettings }
  },

  // Update workflow settings
  updateWorkflowSettings: async (
    settings: Partial<WorkflowSettings>,
  ): Promise<{ success: boolean; settings?: WorkflowSettings; error?: string }> => {
    await delay(800)

    try {
      workflowSettings = { ...workflowSettings, ...settings }
      return { success: true, settings: workflowSettings }
    } catch (error) {
      return { success: false, error: "Failed to update workflow settings" }
    }
  },
}
