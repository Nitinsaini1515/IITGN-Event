"use client"

import type React from "react"

import { useState } from "react"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import Button from "@/components/ui/Button"

interface EmployeeDashboardProps {
  onLogout: () => void
}

interface Expense {
  id: string
  amount: string
  category: string
  description: string
  date: string
  status: "pending" | "approved" | "rejected"
}

export default function EmployeeDashboard({ onLogout }: EmployeeDashboardProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("travel")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mock API call - in real app, this would POST to backend
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount,
      category,
      description,
      date,
      status: "pending",
    }

    console.log("Submitting expense:", newExpense)
    setExpenses([newExpense, ...expenses])

    // Reset form
    setAmount("")
    setCategory("travel")
    setDescription("")
    setDate("")
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
              />

              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: "travel", label: "Travel" },
                  { value: "meals", label: "Meals" },
                  { value: "office", label: "Office Supplies" },
                  { value: "equipment", label: "Equipment" },
                  { value: "other", label: "Other" },
                ]}
              />

              <Input type="date" label="Date" value={date} onChange={(e) => setDate(e.target.value)} required />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe your expense..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Expense
              </Button>
            </form>
          </Card>

          {/* Recent Expenses */}
          <Card title="Recent Expenses">
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No expenses submitted yet</p>
                <p className="text-sm mt-2">Submit your first expense using the form</p>
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">${expense.amount}</p>
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
                    <p className="text-xs text-gray-500">{expense.date}</p>
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
