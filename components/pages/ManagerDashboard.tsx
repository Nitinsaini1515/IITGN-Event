"use client"

import { useState, useEffect } from "react"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/Table"
import { expenseApi } from "@/lib/mockApi"
import type { Expense } from "@/lib/mockData"
import { TableSkeleton } from "@/components/ui/LoadingSkeleton"
import toast from "react-hot-toast"

export default function ManagerDashboard() {
  const [pendingExpenses, setPendingExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "amount">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingExpenses()
  }, [])

  useEffect(() => {
    let filtered = [...pendingExpenses]

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
  }, [categoryFilter, dateFrom, dateTo, sortBy, sortOrder, pendingExpenses])

  const fetchPendingExpenses = async () => {
    setIsLoading(true)

    try {
      const data = await expenseApi.getExpensesByStatus("pending")
      setPendingExpenses(data)
    } catch (err) {
      toast.error("Failed to load pending expenses")
      console.error("Error fetching pending expenses:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    setProcessingId(id)

    try {
      const result = await expenseApi.updateExpenseStatus(id, "approved", "Sarah Johnson")

      if (result.success) {
        setPendingExpenses(pendingExpenses.filter((expense) => expense.id !== id))
        toast.success("Expense approved successfully!")
      } else {
        toast.error(result.error || "Failed to approve expense")
      }
    } catch (err) {
      toast.error("Failed to approve expense")
      console.error("Error approving expense:", err)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)

    try {
      const result = await expenseApi.updateExpenseStatus(id, "rejected", "Sarah Johnson")

      if (result.success) {
        setPendingExpenses(pendingExpenses.filter((expense) => expense.id !== id))
        toast.success("Expense rejected")
      } else {
        toast.error(result.error || "Failed to reject expense")
      }
    } catch (err) {
      toast.error("Failed to reject expense")
      console.error("Error rejecting expense:", err)
    } finally {
      setProcessingId(null)
    }
  }

  const totalPendingAmount = pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Manager Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="text-sm text-gray-600 mb-1">Filtered Results</p>
            <p className="text-3xl font-bold text-gray-900">{filteredExpenses.length}</p>
          </div>
        </Card>
      </div>

      {/* Pending Expenses Table with Filters */}
      <Card title="Pending Expense Approvals">
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
          <TableSkeleton rows={5} />
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No pending expenses found</p>
            <p className="text-sm mt-2">
              {pendingExpenses.length === 0 ? "All expenses have been reviewed" : "Try adjusting your filters"}
            </p>
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
                {filteredExpenses.map((expense) => (
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
    </div>
  )
}
