"use client"

import type React from "react"

import { useState } from "react"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/Table"

interface AdminDashboardProps {
  onLogout: () => void
}

interface User {
  id: string
  name: string
  email: string
  role: "employee" | "manager" | "admin"
  status: "active" | "inactive"
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  // Mock data - in real app, this would be fetched from API
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@company.com",
      role: "employee",
      status: "active",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "manager",
      status: "active",
    },
    {
      id: "3",
      name: "Mike Davis",
      email: "mike@company.com",
      role: "employee",
      status: "active",
    },
  ])

  const [showAddUser, setShowAddUser] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<"employee" | "manager" | "admin">("employee")

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock API call - in real app, this would POST to backend
    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "active",
    }

    console.log("Adding user:", newUser)
    setUsers([...users, newUser])

    // Reset form
    setNewUserName("")
    setNewUserEmail("")
    setNewUserRole("employee")
    setShowAddUser(false)
  }

  const handleToggleStatus = (id: string) => {
    // Mock API call - in real app, this would PUT to backend
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  const handleDeleteUser = (id: string) => {
    // Mock API call - in real app, this would DELETE to backend
    console.log("Deleting user:", id)
    setUsers(users.filter((user) => user.id !== id))
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
              <p className="text-sm text-gray-600 mb-1">Managers</p>
              <p className="text-3xl font-bold text-gray-900">{users.filter((u) => u.role === "manager").length}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Employees</p>
              <p className="text-3xl font-bold text-gray-900">{users.filter((u) => u.role === "employee").length}</p>
            </div>
          </Card>
        </div>

        {/* User Management */}
        <Card title="User Management">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">Manage users and their roles</p>
            <Button onClick={() => setShowAddUser(!showAddUser)}>{showAddUser ? "Cancel" : "Add User"}</Button>
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
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="john@company.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
                <Select
                  label="Role"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as "employee" | "manager" | "admin")}
                  options={[
                    { value: "employee", label: "Employee" },
                    { value: "manager", label: "Manager" },
                    { value: "admin", label: "Admin" },
                  ]}
                />
                <div className="md:col-span-3">
                  <Button type="submit" className="w-full">
                    Create User
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Users Table */}
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
                      <Button size="sm" variant="secondary" onClick={() => handleToggleStatus(user.id)}>
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Approval Workflow Settings */}
        <Card title="Approval Workflow Settings" className="mt-8">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Configure expense approval workflows and thresholds</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input type="number" label="Auto-Approve Threshold ($)" placeholder="100.00" defaultValue="100" />
              <Select
                label="Require Manager Approval"
                defaultValue="always"
                options={[
                  { value: "always", label: "Always" },
                  { value: "threshold", label: "Above Threshold" },
                  { value: "never", label: "Never" },
                ]}
              />
            </div>
            <Button variant="primary">Save Settings</Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
