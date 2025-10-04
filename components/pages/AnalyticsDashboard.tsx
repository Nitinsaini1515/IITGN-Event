"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import Card from "@/components/ui/Card"
import { expenseApi, userApi } from "@/lib/mockApi"
import type { Expense } from "@/lib/mockData"
import { CardSkeleton } from "@/components/ui/LoadingSkeleton"

export default function AnalyticsDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const [expensesData, usersData] = await Promise.all([expenseApi.getAllExpenses(), userApi.getAllUsers()])
      setExpenses(expensesData)
      setTotalEmployees(usersData.filter((u) => u.status === "active").length)
    } catch (error) {
      console.error("Failed to fetch analytics data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate statistics
  const totalExpenses = expenses.length
  const approvedExpenses = expenses.filter((e) => e.status === "approved")
  const rejectedExpenses = expenses.filter((e) => e.status === "rejected")
  const pendingExpenses = expenses.filter((e) => e.status === "pending")
  const totalApprovedAmount = approvedExpenses.reduce((sum, e) => sum + e.amount, 0)

  // Expenses by category
  const categoryData = expenses.reduce(
    (acc, expense) => {
      const category = expense.category
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Number(value.toFixed(2)),
  }))

  // Expenses by status
  const statusChartData = [
    { name: "Pending", value: pendingExpenses.length, color: "#fbbf24" },
    { name: "Approved", value: approvedExpenses.length, color: "#10b981" },
    { name: "Rejected", value: rejectedExpenses.length, color: "#ef4444" },
  ]

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total Employees</p>
            <p className="text-4xl font-bold text-blue-600">{totalEmployees}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total Expenses</p>
            <p className="text-4xl font-bold text-purple-600">{totalExpenses}</p>
            <div className="mt-2 flex justify-center gap-4 text-xs">
              <span className="text-green-600">✓ {approvedExpenses.length}</span>
              <span className="text-yellow-600">⏳ {pendingExpenses.length}</span>
              <span className="text-red-600">✗ {rejectedExpenses.length}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total Approved Amount</p>
            <p className="text-4xl font-bold text-green-600">${totalApprovedAmount.toFixed(2)}</p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <Card title="Expenses by Category">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Amount ($)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Expenses by Status */}
        <Card title="Expenses by Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
