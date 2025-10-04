"use client"

import { useState } from "react"
import { Toaster } from "react-hot-toast"
import Login from "@/components/pages/Login"
import Signup from "@/components/pages/Signup"
import EmployeeDashboard from "@/components/pages/EmployeeDashboard"
import ManagerDashboard from "@/components/pages/ManagerDashboard"
import AdminDashboard from "@/components/pages/AdminDashboard"
import AnalyticsDashboard from "@/components/pages/AnalyticsDashboard"
import UserProfile from "@/components/pages/UserProfile"
import Sidebar from "@/components/layout/Sidebar"

export default function App() {
  const [currentPage, setCurrentPage] = useState<"login" | "signup" | "app">("login")
  const [activePage, setActivePage] = useState<"dashboard" | "profile" | "analytics">("dashboard")
  const [userRole, setUserRole] = useState<"employee" | "manager" | "admin" | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Handle login
  const handleLogin = (email: string, password: string, role: "employee" | "manager" | "admin") => {
    console.log("Login attempt:", { email, password, role })
    setUserRole(role)
    // Mock user IDs based on role
    const userIds = { employee: "user-001", manager: "user-002", admin: "user-004" }
    setUserId(userIds[role])
    setIsAuthenticated(true)
    setCurrentPage("app")
    setActivePage("dashboard")
  }

  // Handle signup
  const handleSignup = (email: string, password: string, name: string) => {
    console.log("Signup attempt:", { email, password, name })
    setUserRole("employee")
    setUserId("user-001")
    setIsAuthenticated(true)
    setCurrentPage("app")
    setActivePage("dashboard")
  }

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    setUserId(null)
    setCurrentPage("login")
    setActivePage("dashboard")
  }

  // Handle navigation
  const handleNavigate = (page: string) => {
    setActivePage(page as typeof activePage)
  }

  // Render appropriate dashboard based on user role
  const renderContent = () => {
    if (!isAuthenticated || !userRole || !userId) return null

    if (activePage === "profile") {
      return <UserProfile userId={userId} />
    }

    if (activePage === "analytics" && userRole === "admin") {
      return <AnalyticsDashboard />
    }

    switch (userRole) {
      case "employee":
        return <EmployeeDashboard />
      case "manager":
        return <ManagerDashboard />
      case "admin":
        return <AdminDashboard />
      default:
        return null
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gray-50">
        {currentPage === "login" && <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage("signup")} />}
        {currentPage === "signup" && <Signup onSignup={handleSignup} onSwitchToLogin={() => setCurrentPage("login")} />}
        {currentPage === "app" && isAuthenticated && userRole && (
          <div className="flex">
            <Sidebar currentPage={activePage} onNavigate={handleNavigate} userRole={userRole} onLogout={handleLogout} />
            <main className="flex-1 p-8">{renderContent()}</main>
          </div>
        )}
      </div>
    </>
  )
}
