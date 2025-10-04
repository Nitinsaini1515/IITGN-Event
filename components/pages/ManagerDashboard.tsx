"use client"

import { useState, useEffect } from "react"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/Table"
import { expenseApi } from "@/lib/mockApi"
import type { Expense } from "@/lib/mockData"

interface ManagerDashboardProps {
  onLogout: () => void
}

export default function ManagerDashboard({ onLogout }: ManagerDashboardProps) {
  const [pendingExpenses, setPendingExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingExpenses()
  }, [])

  const fetchPendingExpenses = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await expenseApi.getExpensesByStatus("pending")
      setPendingExpenses(data)
    } catch (err) {
      setError("Failed to load pending expenses. Please try again.")
      console.error("[v0] Error fetching pending expenses:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    setError(null)

    try {
      const result = await expenseApi.updateExpenseStatus(id, "approved", "Sarah Johnson")

      if (result.success) {
        setPendingExpenses(pendingExpenses.filter((expense) => expense.id !== id))
      } else {
        setError(result.error || "Failed to approve expense")
      }
    } catch (err) {
      setError("Failed to approve expense. Please try again.")
      console.error("[v0] Error approving expense:", err)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    setError(null)

    try {
      const result = await expenseApi.updateExpenseStatus(id, "rejected", "Sarah Johnson")

      if (result.success) {
        setPendingExpenses(pendingExpenses.filter((expense) => expense.id !== id))
      } else {
        setError(result.error || "Failed to reject expense")
      }
    } catch (err) {
      setError("Failed to reject expense. Please try again.")
      console.error("[v0] Error rejecting expense:", err)
    } finally {
      setProcessingId(null)
    }
  }

  const totalPendingAmount = pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0)

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
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

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
              <p className="text-3xl font-bold text-gray-900">${totalPendingAmount.toFixed(2)}</p>
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
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading pending expenses...</p>
            </div>
          ) : pendingExpenses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No pending expenses</p>
              <p className="text-sm mt-2">All expenses have been reviewed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                      <TableCell>${expense.amount.toFixed(2)}</TableCell>
                      <TableCell className="capitalize">{expense.category}</TableCell>
                      <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleApprove(expense.id)}
                            disabled={processingId === expense.id}
                          >
                            {processingId === expense.id ? "..." : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReject(expense.id)}
                            disabled={processingId === expense.id}
                          >
                            {processingId === expense.id ? "..." : "Reject"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
