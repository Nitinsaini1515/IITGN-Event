"use client"

import { useState } from "react"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/Table"

interface ManagerDashboardProps {
  onLogout: () => void
}

interface PendingExpense {
  id: string
  employeeName: string
  amount: string
  category: string
  description: string
  date: string
  status: "pending"
}

export default function ManagerDashboard({ onLogout }: ManagerDashboardProps) {
  // Mock data - in real app, this would be fetched from API
  const [pendingExpenses, setPendingExpenses] = useState<PendingExpense[]>([
    {
      id: "1",
      employeeName: "John Smith",
      amount: "250.00",
      category: "Travel",
      description: "Client meeting transportation",
      date: "2025-01-15",
      status: "pending",
    },
    {
      id: "2",
      employeeName: "Sarah Johnson",
      amount: "85.50",
      category: "Meals",
      description: "Team lunch",
      date: "2025-01-14",
      status: "pending",
    },
    {
      id: "3",
      employeeName: "Mike Davis",
      amount: "450.00",
      category: "Equipment",
      description: "New keyboard and mouse",
      date: "2025-01-13",
      status: "pending",
    },
  ])

  const handleApprove = (id: string) => {
    // Mock API call - in real app, this would PUT to backend
    console.log("Approving expense:", id)
    setPendingExpenses(pendingExpenses.filter((expense) => expense.id !== id))
  }

  const handleReject = (id: string) => {
    // Mock API call - in real app, this would PUT to backend
    console.log("Rejecting expense:", id)
    setPendingExpenses(pendingExpenses.filter((expense) => expense.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-900">{pendingExpenses.length}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">
                ${pendingExpenses.reduce((sum, exp) => sum + Number.parseFloat(exp.amount), 0).toFixed(2)}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
          </Card>
        </div>

        {/* Pending Expenses Table */}
        <Card title="Pending Expense Approvals">
          {pendingExpenses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No pending expenses</p>
              <p className="text-sm mt-2">All expenses have been reviewed</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Employee</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableHeader>
              <TableBody>
                {pendingExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.employeeName}</TableCell>
                    <TableCell>${expense.amount}</TableCell>
                    <TableCell className="capitalize">{expense.category}</TableCell>
                    <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="primary" onClick={() => handleApprove(expense.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleReject(expense.id)}>
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>
    </div>
  )
}
