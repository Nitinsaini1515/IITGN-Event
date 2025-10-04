"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import Button from "@/components/ui/Button"
import { expenseApi } from "@/lib/mockApi"
import type { Expense } from "@/lib/mockData"

interface EmployeeDashboardProps {
  onLogout: () => void
}

export default function EmployeeDashboard({ onLogout }: EmployeeDashboardProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("travel")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExpenses()
  }, [])

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredExpenses(expenses)
    } else {
      setFilteredExpenses(expenses.filter((exp) => exp.status === statusFilter))
    }
  }, [statusFilter, expenses])

  const fetchExpenses = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // In real app, would use actual employee ID from auth context
      const data = await expenseApi.getExpensesByEmployee("user-001")
      setExpenses(data)
    } catch (err) {
      setError("Failed to load expenses. Please try again.")
      console.error("[v0] Error fetching expenses:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await expenseApi.createExpense({
        employeeId: "user-001", // In real app, from auth context
        employeeName: "John Smith", // In real app, from auth context
        amount: Number.parseFloat(amount),
        category,
        description,
        date,
      })

      if (result.success && result.expense) {
        setExpenses([result.expense, ...expenses])
        // Reset form
        setAmount("")
        setCategory("travel")
        setDescription("")
        setDate("")
      } else {
        setError(result.error || "Failed to submit expense")
      }
    } catch (err) {
      setError("Failed to submit expense. Please try again.")
      console.error("[v0] Error submitting expense:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Expense Form */}
          <Card title="Submit New Expense">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="number"
                label="Amount ($)"
                placeholder="0.00"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={isSubmitting}
              />

              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                options={[
                  { value: "travel", label: "Travel" },
                  { value: "meals", label: "Meals" },
                  { value: "office", label: "Office Supplies" },
                  { value: "equipment", label: "Equipment" },
                  { value: "other", label: "Other" },
                ]}
              />

              <Input
                type="date"
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isSubmitting}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  rows={4}
                  placeholder="Describe your expense..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Expense"}
              </Button>
            </form>
          </Card>

          {/* Expense History */}
          <Card title="Expense History">
            <div className="mb-4">
              <Select
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                options={[
                  { value: "all", label: "All Expenses" },
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ]}
              />
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading expenses...</p>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No {statusFilter !== "all" ? statusFilter : ""} expenses found</p>
                <p className="text-sm mt-2">
                  {statusFilter === "all" ? "Submit your first expense using the form" : "Try a different filter"}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600 capitalize">{expense.category}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          expense.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : expense.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {expense.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{expense.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{expense.date}</span>
                      {expense.reviewedBy && <span>Reviewed by: {expense.reviewedBy}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
