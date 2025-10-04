"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import Button from "@/components/ui/Button"
import { expenseApi } from "@/lib/mockApi"
import type { Expense } from "@/lib/mockData"
import { TableSkeleton } from "@/components/ui/LoadingSkeleton"
import toast from "react-hot-toast"

export default function EmployeeDashboard() {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("travel")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "amount">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchExpenses()
  }, [])

  useEffect(() => {
    let filtered = [...expenses]

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((exp) => exp.status === statusFilter)
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((exp) => exp.category === categoryFilter)
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter((exp) => exp.date >= dateFrom)
    }
    if (dateTo) {
      filtered = filtered.filter((exp) => exp.date <= dateTo)
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const comparison = a.date.localeCompare(b.date)
        return sortOrder === "asc" ? comparison : -comparison
      } else {
        const comparison = a.amount - b.amount
        return sortOrder === "asc" ? comparison : -comparison
      }
    })

    setFilteredExpenses(filtered)
  }, [statusFilter, categoryFilter, dateFrom, dateTo, sortBy, sortOrder, expenses])

  const fetchExpenses = async () => {
    setIsLoading(true)

    try {
      const data = await expenseApi.getExpensesByEmployee("user-001")
      setExpenses(data)
    } catch (err) {
      toast.error("Failed to load expenses")
      console.error("Error fetching expenses:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await expenseApi.createExpense({
        employeeId: "user-001",
        employeeName: "John Smith",
        amount: Number.parseFloat(amount),
        category,
        description,
        date,
      })

      if (result.success && result.expense) {
        setExpenses([result.expense, ...expenses])
        setAmount("")
        setCategory("travel")
        setDescription("")
        setDate("")
        toast.success("Expense submitted successfully!")
      } else {
        toast.error(result.error || "Failed to submit expense")
      }
    } catch (err) {
      toast.error("Failed to submit expense")
      console.error("Error submitting expense:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Employee Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Expense History with Filters */}
        <Card title="Expense History">
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ]}
              />

              <Select
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Categories" },
                  { value: "travel", label: "Travel" },
                  { value: "meals", label: "Meals" },
                  { value: "office", label: "Office" },
                  { value: "equipment", label: "Equipment" },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input type="date" label="From Date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <Input type="date" label="To Date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                options={[
                  { value: "date", label: "Date" },
                  { value: "amount", label: "Amount" },
                ]}
              />
              <Select
                label="Order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                options={[
                  { value: "desc", label: "Descending" },
                  { value: "asc", label: "Ascending" },
                ]}
              />
            </div>
          </div>

          {isLoading ? (
            <TableSkeleton rows={3} />
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No expenses found</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
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
    </div>
  )
}
