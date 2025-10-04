"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/Table"
import { expenseApi, userApi, workflowApi } from "@/lib/mockApi"
import type { Expense, User, WorkflowSettings } from "@/lib/mockData"

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([])
  const [allExpenses, setAllExpenses] = useState<Expense[]>([])
  const [workflowSettings, setWorkflowSettings] = useState<WorkflowSettings | null>(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<"employee" | "manager" | "admin">("employee")
  const [autoApproveThreshold, setAutoApproveThreshold] = useState("100")
  const [requireManagerApproval, setRequireManagerApproval] = useState<"always" | "threshold" | "never">("always")

  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false)
  const [isLoadingWorkflow, setIsLoadingWorkflow] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingUserId, setProcessingUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
    fetchAllExpenses()
    fetchWorkflowSettings()
  }, [])

  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    setError(null)

    try {
      const data = await userApi.getAllUsers()
      setUsers(data)
    } catch (err) {
      setError("Failed to load users. Please try again.")
      console.error("[v0] Error fetching users:", err)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const fetchAllExpenses = async () => {
    setIsLoadingExpenses(true)

    try {
      const data = await expenseApi.getAllExpenses()
      setAllExpenses(data)
    } catch (err) {
      console.error("[v0] Error fetching expenses:", err)
    } finally {
      setIsLoadingExpenses(false)
    }
  }

  const fetchWorkflowSettings = async () => {
    setIsLoadingWorkflow(true)

    try {
      const data = await workflowApi.getWorkflowSettings()
      setWorkflowSettings(data)
      setAutoApproveThreshold(data.autoApproveThreshold.toString())
      setRequireManagerApproval(data.requireManagerApproval)
    } catch (err) {
      console.error("[v0] Error fetching workflow settings:", err)
    } finally {
      setIsLoadingWorkflow(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await userApi.createUser({
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        status: "active",
      })

      if (result.success && result.user) {
        setUsers([...users, result.user])
        setNewUserName("")
        setNewUserEmail("")
        setNewUserRole("employee")
        setShowAddUser(false)
      } else {
        setError(result.error || "Failed to create user")
      }
    } catch (err) {
      setError("Failed to create user. Please try again.")
      console.error("[v0] Error creating user:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: "active" | "inactive") => {
    setProcessingUserId(id)
    setError(null)

    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      const result = await userApi.updateUserStatus(id, newStatus)

      if (result.success && result.user) {
        setUsers(users.map((user) => (user.id === id ? result.user! : user)))
      } else {
        setError(result.error || "Failed to update user status")
      }
    } catch (err) {
      setError("Failed to update user status. Please try again.")
      console.error("[v0] Error updating user status:", err)
    } finally {
      setProcessingUserId(null)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    setProcessingUserId(id)
    setError(null)

    try {
      const result = await userApi.deleteUser(id)

      if (result.success) {
        setUsers(users.filter((user) => user.id !== id))
      } else {
        setError(result.error || "Failed to delete user")
      }
    } catch (err) {
      setError("Failed to delete user. Please try again.")
      console.error("[v0] Error deleting user:", err)
    } finally {
      setProcessingUserId(null)
    }
  }

  const handleSaveWorkflowSettings = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await workflowApi.updateWorkflowSettings({
        autoApproveThreshold: Number.parseFloat(autoApproveThreshold),
        requireManagerApproval,
      })

      if (result.success && result.settings) {
        setWorkflowSettings(result.settings)
        alert("Workflow settings saved successfully!")
      } else {
        setError(result.error || "Failed to save workflow settings")
      }
    } catch (err) {
      setError("Failed to save workflow settings. Please try again.")
      console.error("[v0] Error saving workflow settings:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{users.filter((u) => u.status === "active").length}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <p className="text-3xl font-bold text-gray-900">{allExpenses.length}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900">
                {allExpenses.filter((e) => e.status === "pending").length}
              </p>
            </div>
          </Card>
        </div>

        {/* All Expenses Overview */}
        <Card title="All Expenses Overview" className="mb-8">
          {isLoadingExpenses ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading expenses...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableHead>ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableHeader>
                <TableBody>
                  {allExpenses.slice(0, 10).map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-mono text-xs">{expense.id}</TableCell>
                      <TableCell className="font-medium">{expense.employeeName}</TableCell>
                      <TableCell>${expense.amount.toFixed(2)}</TableCell>
                      <TableCell className="capitalize">{expense.category}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {allExpenses.length > 10 && (
                <p className="text-sm text-gray-500 text-center mt-4">Showing 10 of {allExpenses.length} expenses</p>
              )}
            </div>
          )}
        </Card>

        {/* User Management */}
        <Card title="User Management" className="mb-8">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">Manage users and their roles</p>
            <Button onClick={() => setShowAddUser(!showAddUser)} disabled={isSubmitting}>
              {showAddUser ? "Cancel" : "Add User"}
            </Button>
          </div>

          {/* Add User Form */}
          {showAddUser && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Add New User</h3>
              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  label="Name"
                  placeholder="John Doe"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="john@company.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <Select
                  label="Role"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as "employee" | "manager" | "admin")}
                  disabled={isSubmitting}
                  options={[
                    { value: "employee", label: "Employee" },
                    { value: "manager", label: "Manager" },
                    { value: "admin", label: "Admin" },
                  ]}
                />
                <div className="md:col-span-3">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Users Table */}
          {isLoadingUsers ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className="capitalize px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            disabled={processingUserId === user.id}
                          >
                            {processingUserId === user.id
                              ? "..."
                              : user.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={processingUserId === user.id}
                          >
                            {processingUserId === user.id ? "..." : "Delete"}
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

        {/* Approval Workflow Settings */}
        <Card title="Approval Workflow Settings">
          {isLoadingWorkflow ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading workflow settings...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Configure expense approval workflows and thresholds</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Auto-Approve Threshold ($)"
                  placeholder="100.00"
                  value={autoApproveThreshold}
                  onChange={(e) => setAutoApproveThreshold(e.target.value)}
                  disabled={isSubmitting}
                />
                <Select
                  label="Require Manager Approval"
                  value={requireManagerApproval}
                  onChange={(e) => setRequireManagerApproval(e.target.value as typeof requireManagerApproval)}
                  disabled={isSubmitting}
                  options={[
                    { value: "always", label: "Always" },
                    { value: "threshold", label: "Above Threshold" },
                    { value: "never", label: "Never" },
                  ]}
                />
              </div>
              <Button variant="primary" onClick={handleSaveWorkflowSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
