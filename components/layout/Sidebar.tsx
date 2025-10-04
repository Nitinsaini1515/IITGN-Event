"use client"

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  userRole: "employee" | "manager" | "admin"
  onLogout: () => void
}

export default function Sidebar({ currentPage, onNavigate, userRole, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", roles: ["employee", "manager", "admin"] },
    { id: "profile", label: "Profile", roles: ["employee", "manager", "admin"] },
    { id: "analytics", label: "Analytics", roles: ["admin"] },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Expense Manager</h2>
        <p className="text-sm text-gray-600 mt-1 capitalize">{userRole} Portal</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
