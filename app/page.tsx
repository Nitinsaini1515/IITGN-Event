"use client"

import { useState } from "react"
import Login from "@/components/pages/Login"
import Signup from "@/components/pages/Signup"
import EmployeeDashboard from "@/components/pages/EmployeeDashboard"
import ManagerDashboard from "@/components/pages/ManagerDashboard"
import AdminDashboard from "@/components/pages/AdminDashboard"

export default function App() {
  const [currentPage, setCurrentPage] = useState<"login" | "signup" | "dashboard">("login")
  const [userRole, setUserRole] = useState<"employee" | "manager" | "admin" | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Handle login
  const handleLogin = (email: string, password: string, role: "employee" | "manager" | "admin") => {
    // Mock authentication - in real app, this would call an API
    console.log("Login attempt:", { email, password, role })
    setUserRole(role)
    setIsAuthenticated(true)
    setCurrentPage("dashboard")
  }

  // Handle signup
  const handleSignup = (email: string, password: string, name: string) => {
    // Mock signup - in real app, this would call an API
    console.log("Signup attempt:", { email, password, name })
    setUserRole("employee") // Default role for new users
    setIsAuthenticated(true)
    setCurrentPage("dashboard")
  }

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    setCurrentPage("login")
  }

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    if (!isAuthenticated || !userRole) return null

    switch (userRole) {
      case "employee":
        return <EmployeeDashboard onLogout={handleLogout} />
      case "manager":
        return <ManagerDashboard onLogout={handleLogout} />
      case "admin":
        return <AdminDashboard onLogout={handleLogout} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {currentPage === "login" && <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage("signup")} />}
      {currentPage === "signup" && <Signup onSignup={handleSignup} onSwitchToLogin={() => setCurrentPage("login")} />}
      {currentPage === "dashboard" && renderDashboard()}
    </div>
  )
}
